import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function deleteCollege(formData: FormData) {
    "use server";
    const collegeId = formData.get("collegeId") as string;
    try {
        await prisma.college.delete({ where: { id: collegeId } });
    } catch (e) {
        console.error("Failed to delete college. Ensure all dependent records (courses, admissions) are removed first.", e);
    }
    revalidatePath("/admin/colleges");
}

export default async function CollegesAdminPage() {
    const colleges = await prisma.college.findMany({
        orderBy: { createdAt: "desc" },
        include: { courses: true, applications: true }
    });

    return (
        <div>
            <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--primary)" }}>Manage Colleges</h1>
                    <p style={{ color: "var(--muted-foreground)" }}>View, edit details, and remove colleges and their nested courses.</p>
                </div>
                <a href="/admin/colleges/new" style={{ padding: "0.5rem 1rem", backgroundColor: "#0f172a", color: "white", borderRadius: "6px", textDecoration: "none", fontWeight: 500 }}>
                    + Create College
                </a>
            </div>

            <div style={{ overflowX: "auto", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #eee", textAlign: "left", backgroundColor: "#f8fafc" }}>
                            <th style={{ padding: "1rem" }}>College Name</th>
                            <th style={{ padding: "1rem" }}>Email</th>
                            <th style={{ padding: "1rem" }}>Location</th>
                            <th style={{ padding: "1rem" }}>Established</th>
                            <th style={{ padding: "1rem" }}>Courses</th>
                            <th style={{ padding: "1rem" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {colleges.map((college) => (
                            <tr key={college.id} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "1rem", fontWeight: 500 }}>{college.name}</td>
                                <td style={{ padding: "1rem" }}>
                                    <a href={`mailto:${college.email}`} style={{ color: "#2563eb", textDecoration: "none" }}>
                                        {college.email || "N/A"}
                                    </a>
                                </td>
                                <td style={{ padding: "1rem" }}>{college.location}</td>
                                <td style={{ padding: "1rem" }}>{college.establishedYear || "N/A"}</td>
                                <td style={{ padding: "1rem" }}>
                                    {college.courses && college.courses.length > 0 ? (
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", maxWidth: "250px" }}>
                                            {college.courses.map((course) => (
                                                <span key={course.id} style={{
                                                    padding: "0.15rem 0.4rem",
                                                    backgroundColor: "#e0f2fe",
                                                    color: "#0369a1",
                                                    borderRadius: "4px",
                                                    fontSize: "0.75rem",
                                                    fontWeight: 500
                                                }}>
                                                    {course.title}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span style={{ color: "#94a3b8", fontSize: "0.875rem" }}>No courses</span>
                                    )}
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        <a href={`/admin/colleges/${college.id}`} style={{ padding: "0.4rem 0.8rem", backgroundColor: "#e2e8f0", color: "#0f172a", borderRadius: "4px", textDecoration: "none", fontSize: "0.875rem" }}>
                                            Edit Details
                                        </a>
                                        <form action={deleteCollege}>
                                            <input type="hidden" name="collegeId" value={college.id} />
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
                {colleges.length === 0 && (
                    <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                        No colleges configured.
                    </div>
                )}
            </div>
        </div>
    );
}
