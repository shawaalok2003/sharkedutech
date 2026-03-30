import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function updateApplicationStatus(formData: FormData) {
    "use server";
    const applicationId = formData.get("applicationId") as string;
    const status = formData.get("status") as string;
    await prisma.application.update({ where: { id: applicationId }, data: { status } });
    revalidatePath("/admin/applications");
}

async function deleteApplication(formData: FormData) {
    "use server";
    const applicationId = formData.get("applicationId") as string;
    try {
        await prisma.application.delete({ where: { id: applicationId } });
    } catch (e) {
        console.error("Failed to delete application", e);
    }
    revalidatePath("/admin/applications");
}

export default async function ApplicationsAdminPage() {
    const applications = await prisma.application.findMany({
        orderBy: { createdAt: "desc" },
        include: { job: true, applicant: true }
    });

    return (
        <div>
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--primary)" }}>Manage Applications</h1>
                <p style={{ color: "var(--muted-foreground)" }}>View job applications, edit their status, or remove them.</p>
            </div>

            <div style={{ overflowX: "auto", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #eee", textAlign: "left", backgroundColor: "#f8fafc" }}>
                            <th style={{ padding: "1rem" }}>Applicant</th>
                            <th style={{ padding: "1rem" }}>Job Applied For</th>
                            <th style={{ padding: "1rem" }}>Docs</th>
                            <th style={{ padding: "1rem" }}>Status</th>
                            <th style={{ padding: "1rem" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app.id} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "1rem" }}>
                                    <div style={{ fontWeight: 600 }}>{app.name}</div>
                                    <div style={{ fontSize: "0.875rem", color: "#64748b" }}>{app.email}</div>
                                    <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{new Date(app.createdAt).toLocaleDateString()}</div>
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    <div style={{ fontWeight: 500 }}>{app.job?.title || "Unknown Job"}</div>
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    {app.resumeUrl && <a href={app.resumeUrl} target="_blank" rel="noreferrer" style={{ color: "#2563eb", textDecoration: "underline", marginRight: "0.5rem" }}>Resume</a>}
                                    {app.coverLetter && <span style={{ fontSize: "0.875rem", color: "#475569" }}>Has Cover Letter</span>}
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    <span style={{
                                        padding: "0.25rem 0.5rem",
                                        borderRadius: "999px",
                                        fontSize: "0.875rem",
                                        backgroundColor: app.status === 'New' ? '#dbeafe' : app.status === 'Accepted' ? '#dcfce7' : '#f1f5f9',
                                        color: app.status === 'New' ? '#1e40af' : app.status === 'Accepted' ? '#166534' : '#475569',
                                    }}>
                                        {app.status}
                                    </span>
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        <a href={`/admin/applications/${app.id}`} style={{ padding: "0.4rem 0.8rem", backgroundColor: "#e2e8f0", color: "#0f172a", borderRadius: "4px", textDecoration: "none", fontSize: "0.875rem" }}>
                                            Edit Details
                                        </a>
                                        <form action={deleteApplication}>
                                            <input type="hidden" name="applicationId" value={app.id} />
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
                {applications.length === 0 && (
                    <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                        No applications found.
                    </div>
                )}
            </div>
        </div>
    );
}
