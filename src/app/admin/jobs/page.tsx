import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function updateJobStatus(formData: FormData) {
    "use server";
    const jobId = formData.get("jobId") as string;
    const status = formData.get("status") as string;
    await prisma.job.update({ where: { id: jobId }, data: { status } });
    revalidatePath("/admin/jobs");
}

async function deleteJob(formData: FormData) {
    "use server";
    const jobId = formData.get("jobId") as string;
    try {
        await prisma.job.delete({ where: { id: jobId } });
    } catch (e) {
        console.error("Failed to delete job", e);
    }
    revalidatePath("/admin/jobs");
}

export default async function JobsAdminPage() {
    const jobs = await prisma.job.findMany({
        orderBy: { createdAt: "desc" },
        include: { employer: true, applications: true }
    });

    return (
        <div>
            <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--primary)" }}>Manage Jobs</h1>
                    <p style={{ color: "var(--muted-foreground)" }}>View, edit status, and remove job postings.</p>
                </div>
                <a href="/admin/jobs/new" style={{ padding: "0.5rem 1rem", backgroundColor: "#0f172a", color: "white", borderRadius: "6px", textDecoration: "none", fontWeight: 500 }}>
                    + Post Job
                </a>
            </div>

            <div style={{ overflowX: "auto", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #eee", textAlign: "left", backgroundColor: "#f8fafc" }}>
                            <th style={{ padding: "1rem" }}>Title & Company</th>
                            <th style={{ padding: "1rem" }}>Type & Location</th>
                            <th style={{ padding: "1rem" }}>Apps</th>
                            <th style={{ padding: "1rem" }}>Status</th>
                            <th style={{ padding: "1rem" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job) => (
                            <tr key={job.id} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "1rem" }}>
                                    <div style={{ fontWeight: 600 }}>{job.title}</div>
                                    <div style={{ fontSize: "0.875rem", color: "#64748b" }}>{job.employer?.companyName || job.employer?.name || "Unknown Employer"}</div>
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    <div>{job.type}</div>
                                    <div style={{ fontSize: "0.875rem", color: "#64748b" }}>{job.location}</div>
                                </td>
                                <td style={{ padding: "1rem", fontWeight: "bold" }}>{job.applications.length}</td>
                                <td style={{ padding: "1rem" }}>
                                    <span style={{
                                        padding: "0.25rem 0.5rem",
                                        borderRadius: "999px",
                                        fontSize: "0.875rem",
                                        backgroundColor: job.status === 'Active' ? '#dcfce7' : '#fef08a',
                                        color: job.status === 'Active' ? '#166534' : '#854d0e',
                                    }}>
                                        {job.status}
                                    </span>
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        <a href={`/admin/jobs/${job.id}`} style={{ padding: "0.4rem 0.8rem", backgroundColor: "#e2e8f0", color: "#0f172a", borderRadius: "4px", textDecoration: "none", fontSize: "0.875rem" }}>
                                            Edit Details
                                        </a>
                                        <form action={deleteJob}>
                                            <input type="hidden" name="jobId" value={job.id} />
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
                {jobs.length === 0 && (
                    <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                        No jobs currently posted.
                    </div>
                )}
            </div>
        </div>
    );
}
