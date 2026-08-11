import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ResetLinkButton } from "@/components/admin/ResetLinkButton";

export const dynamic = "force-dynamic";

async function updateUserRole(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    const role = formData.get("role") as string;
    await prisma.user.update({ where: { id: userId }, data: { role } });
    revalidatePath("/admin/users");
}

async function deleteUser(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    
    // Prevent deletion of admin accounts
    const targetUser = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (targetUser?.role === 'ADMIN') {
        console.error("Admin user accounts cannot be deleted.");
        return;
    }

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Delete StudentProfile
            await tx.studentProfile.deleteMany({ where: { userId } });
            
            // 2. Delete OTPs
            await tx.otp.deleteMany({ where: { userId } });

            // 3. Delete Job Applications submitted by this candidate
            await tx.application.deleteMany({ where: { applicantId: userId } });

            // 4. Delete Admission Applications submitted by this student
            await tx.admissionApplication.deleteMany({ where: { studentId: userId } });

            // 5. Delete Admission Documents uploaded by this student
            await tx.admissionDocument.deleteMany({ where: { studentId: userId } });

            // 6. Delete Admission Queries submitted by this student
            await tx.admissionQuery.deleteMany({ where: { studentId: userId } });

            // 7. Delete Jobs posted by this employer (and all job applications received on them)
            const employerJobs = await tx.job.findMany({
                where: { employerId: userId },
                select: { id: true }
            });
            const jobIds = employerJobs.map(j => j.id);
            if (jobIds.length > 0) {
                await tx.application.deleteMany({ where: { jobId: { in: jobIds } } });
                await tx.job.deleteMany({ where: { id: { in: jobIds } } });
            }

            // 8. Delete Colleges administered by this user and all their nested courses/requirements/applications
            const administeredColleges = await tx.college.findMany({
                where: { adminId: userId },
                select: { id: true }
            });
            const collegeIds = administeredColleges.map(c => c.id);
            if (collegeIds.length > 0) {
                // Delete Admission Documents connected to requirements of these colleges
                const requirements = await tx.admissionRequirement.findMany({
                    where: { collegeId: { in: collegeIds } },
                    select: { id: true }
                });
                const reqIds = requirements.map(r => r.id);
                if (reqIds.length > 0) {
                    await tx.admissionDocument.deleteMany({ where: { requirementId: { in: reqIds } } });
                }

                // Delete Requirements, Photos, Queries, Admission Applications, and Courses (Offered Courses)
                await tx.admissionRequirement.deleteMany({ where: { collegeId: { in: collegeIds } } });
                await tx.collegePhoto.deleteMany({ where: { collegeId: { in: collegeIds } } });
                await tx.admissionQuery.deleteMany({ where: { collegeId: { in: collegeIds } } });
                await tx.admissionApplication.deleteMany({ where: { collegeId: { in: collegeIds } } });
                await tx.course.deleteMany({ where: { collegeId: { in: collegeIds } } });

                // Finally delete the College records themselves
                await tx.college.deleteMany({ where: { id: { in: collegeIds } } });
            }

            // 9. Delete the main User record
            await tx.user.delete({ where: { id: userId } });
        }, { timeout: 15000 });
    } catch (e) {
        console.error("Failed to delete user", e);
    }
    revalidatePath("/admin/users");
}

async function generateResetLink(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
        where: { id: userId },
        data: { resetToken: token, resetTokenExpires: expires }
    });

    revalidatePath("/admin/users");
    // In a real app, you would email this. For now, we'll show it in the UI or copy it.
}

export default async function UsersAdminPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--primary)" }}>Manage Users</h1>
                    <p style={{ color: "var(--muted-foreground)" }}>View, edit roles, and remove users.</p>
                </div>
                <a href="/admin/users/new" style={{ padding: "0.5rem 1rem", backgroundColor: "#0f172a", color: "white", borderRadius: "6px", textDecoration: "none", fontWeight: 500, whiteSpace: "nowrap" }}>
                    + Create User
                </a>
            </div>

            <div style={{ overflowX: "auto", backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.04)", border: "1px solid #e2e8f0", maxWidth: "100%" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #e2e8f0", textAlign: "left", backgroundColor: "#f8fafc" }}>
                            <th style={{ padding: "0.75rem 0.65rem", fontWeight: 700, color: "#334155" }}>Name</th>
                            <th style={{ padding: "0.75rem 0.65rem", fontWeight: 700, color: "#334155" }}>Email</th>
                            <th style={{ padding: "0.75rem 0.65rem", fontWeight: 700, color: "#334155" }}>Role</th>
                            <th style={{ padding: "0.75rem 0.65rem", fontWeight: 700, color: "#334155" }}>Joined</th>
                            <th style={{ padding: "0.75rem 0.65rem", fontWeight: 700, color: "#334155" }}>Password Recovery</th>
                            <th style={{ padding: "0.75rem 0.65rem", fontWeight: 700, color: "#334155" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "0.75rem 0.65rem", fontWeight: 600, color: "#0f172a" }}>{user.name || "No Name Provided"}</td>
                                <td style={{ padding: "0.75rem 0.65rem", color: "#475569" }}>{user.email}</td>
                                <td style={{ padding: "0.75rem 0.65rem" }}>
                                    <span style={{
                                        padding: "0.2rem 0.5rem",
                                        borderRadius: "999px",
                                        fontSize: "0.75rem",
                                        fontWeight: 700,
                                        backgroundColor: user.role === 'ADMIN' ? '#dcfce7' : '#f1f5f9',
                                        color: user.role === 'ADMIN' ? '#166534' : '#475569',
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: "0.75rem 0.65rem", color: "#64748b" }}>{user.createdAt.toLocaleDateString()}</td>
                                <td style={{ padding: "0.75rem 0.65rem" }}>
                                    <ResetLinkButton 
                                        userId={user.id} 
                                        resetToken={user.resetToken} 
                                        generateAction={generateResetLink} 
                                    />
                                </td>
                                <td style={{ padding: "0.75rem 0.65rem" }}>
                                    <div style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
                                        <a href={`/admin/users/${user.id}`} style={{ padding: "0.35rem 0.65rem", backgroundColor: "#e2e8f0", color: "#0f172a", borderRadius: "6px", textDecoration: "none", fontSize: "0.8rem", fontWeight: 600 }}>
                                            Edit Details
                                        </a>
                                        {user.role === 'ADMIN' ? (
                                            <span style={{
                                                padding: "0.35rem 0.65rem",
                                                backgroundColor: "#f1f5f9",
                                                color: "#94a3b8",
                                                borderRadius: "6px",
                                                fontSize: "0.8rem",
                                                fontWeight: 600,
                                                cursor: "not-allowed",
                                                border: "1px solid #cbd5e1"
                                            }} title="Admin accounts cannot be deleted">
                                                Protected 🔒
                                            </span>
                                        ) : (
                                            <form action={deleteUser}>
                                                <input type="hidden" name="userId" value={user.id} />
                                                <button
                                                    type="submit"
                                                    style={{ padding: "0.35rem 0.65rem", backgroundColor: "#ef4444", color: "white", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
                                                >
                                                    Delete
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                        No users configured.
                    </div>
                )}
            </div>
        </div>
    );
}
