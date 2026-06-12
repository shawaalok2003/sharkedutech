import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

async function updateAdmissionStatus(formData: FormData) {
    "use server";
    const admissionId = formData.get("admissionId") as string;
    const status = formData.get("status") as string;
    await prisma.admissionApplication.update({ where: { id: admissionId }, data: { status } });
    revalidatePath("/admin/admissions");
}

async function deleteAdmission(formData: FormData) {
    "use server";
    const admissionId = formData.get("admissionId") as string;
    try {
        await prisma.admissionApplication.delete({ where: { id: admissionId } });
    } catch (e) {
        console.error("Failed to delete admission", e);
    }
    revalidatePath("/admin/admissions");
}

export default async function AdmissionsAdminPage() {
    const admissions = await prisma.admissionApplication.findMany({
        orderBy: { createdAt: "desc" },
        include: { student: true, college: true, course: true }
    });

    return (
        <div>
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--primary)" }}>Manage Admissions</h1>
                <p style={{ color: "var(--muted-foreground)" }}>View student admission applications, edit their status, or remove them.</p>
            </div>

            <div style={{ overflowX: "auto", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #eee", textAlign: "left", backgroundColor: "#f8fafc" }}>
                            <th style={{ padding: "1rem" }}>Student</th>
                            <th style={{ padding: "1rem" }}>College & Course</th>
                            <th style={{ padding: "1rem" }}>Score/Perc.</th>
                            <th style={{ padding: "1rem" }}>Status</th>
                            <th style={{ padding: "1rem" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admissions.map((admission) => (
                            <tr key={admission.id} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "1rem" }}>
                                    <div style={{ fontWeight: 600 }}>{admission.student?.name || "Unknown"}</div>
                                    <div style={{ fontSize: "0.875rem", color: "#64748b" }}>{admission.student?.email}</div>
                                    <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{new Date(admission.createdAt).toLocaleDateString()}</div>
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    <div style={{ fontWeight: 500 }}>{admission.college?.name || "Unknown College"}</div>
                                    <div style={{ fontSize: "0.875rem", color: "#64748b" }}>{admission.course?.title || "No Course Specified"}</div>
                                </td>
                                <td style={{ padding: "1rem", fontSize: "0.875rem" }}>
                                    {admission.percentage ? `${admission.percentage}%` : "N/A"}<br />
                                    {admission.entranceScore ? `Score: ${admission.entranceScore}` : ""}
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    <span style={{
                                        padding: "0.25rem 0.5rem",
                                        borderRadius: "999px",
                                        fontSize: "0.875rem",
                                        backgroundColor: admission.status === 'Pending' ? '#fef08a' : admission.status === 'Approved' ? '#dcfce7' : '#f1f5f9',
                                        color: admission.status === 'Pending' ? '#854d0e' : admission.status === 'Approved' ? '#166534' : '#475569',
                                    }}>
                                        {admission.status}
                                    </span>
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        <a href={`/admin/admissions/${admission.id}`} style={{ padding: "0.4rem 0.8rem", backgroundColor: "#e2e8f0", color: "#0f172a", borderRadius: "4px", textDecoration: "none", fontSize: "0.875rem" }}>
                                            Edit Details
                                        </a>
                                        <form action={deleteAdmission}>
                                            <input type="hidden" name="admissionId" value={admission.id} />
                                            <button
                                                type="submit"
                                                style={{ padding: "0.4rem 0.8rem", backgroundColor: "#ef4444", color: "white", borderRadius: "4px", border: "none", cursor: "pointer", fontSize: "0.875rem" }}
                                            >
                                                Delete
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {admissions.length === 0 && (
                    <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                        No admissions found.
                    </div>
                )}
            </div>
        </div>
    );
}
