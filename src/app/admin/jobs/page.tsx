import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { formatJobDate } from "@/lib/dateUtils";

export const dynamic = "force-dynamic";

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
    if (!jobId) return;
    try {
        await prisma.$transaction([
            prisma.application.deleteMany({ where: { jobId } }),
            prisma.job.delete({ where: { id: jobId } })
        ]);
    } catch (e) {
        console.error("Failed to delete job", e);
    }
    revalidatePath("/admin/jobs");
    revalidatePath("/jobs");
    revalidatePath("/");
}

async function toggleTopOpportunity(formData: FormData) {
    "use server";
    const jobId = formData.get("jobId") as string;
    const current = formData.get("current") === "true";
    await prisma.job.update({ where: { id: jobId }, data: { isTopOpportunity: !current } });
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
                    <p style={{ color: "var(--muted-foreground)" }}>View, edit status, and manage posted opportunities.</p>
                </div>
                <a href="/admin/jobs/new" style={{ padding: "0.5rem 1rem", backgroundColor: "#0f172a", color: "white", borderRadius: "6px", textDecoration: "none", fontWeight: 500 }}>
                    + Post Job
                </a>
            </div>

            {/* Newly Posted Opportunity Cards View */}
            <div style={{ marginBottom: "2.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span>🗂️</span>
                        <span>Job Opportunity Cards</span>
                        <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#64748b" }}>({jobs.length} total)</span>
                    </h2>
                    <span style={{ fontSize: "0.8rem", color: "#64748b", background: "#f1f5f9", padding: "0.25rem 0.65rem", borderRadius: "999px" }}>
                        Newest first &bull; Dates without time
                    </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
                    {jobs.slice(0, 6).map((job) => {
                        const dateFormatted = formatJobDate(job.createdAt);
                        return (
                            <div key={job.id} style={{
                                background: "#ffffff",
                                borderRadius: "1rem",
                                border: "1px solid #e2e8f0",
                                overflow: "hidden",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
                                display: "flex",
                                flexDirection: "column"
                            }}>
                                {job.posterUrl ? (
                                    <div style={{ width: "100%", height: "150px", background: "#001736", position: "relative", overflow: "hidden" }}>
                                        <img 
                                            src={job.posterUrl} 
                                            alt={job.title}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                        />
                                        <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", background: "rgba(0,23,54,0.85)", backdropFilter: "blur(8px)", color: "#ffffff", padding: "0.25rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, border: "1px solid rgba(255,255,255,0.2)" }}>
                                            📅 {dateFormatted}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ padding: "1rem 1.25rem 0.25rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1d4ed8", background: "#eff6ff", border: "1px solid #bfdbfe", padding: "0.25rem 0.65rem", borderRadius: "999px" }}>
                                            📅 {dateFormatted}
                                        </span>
                                        <span style={{
                                            padding: "0.2rem 0.5rem",
                                            borderRadius: "999px",
                                            fontSize: "0.75rem",
                                            fontWeight: 700,
                                            backgroundColor: job.status === 'Active' ? '#dcfce7' : '#fef08a',
                                            color: job.status === 'Active' ? '#166534' : '#854d0e',
                                        }}>
                                            {job.status}
                                        </span>
                                    </div>
                                )}
                                <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                                    {job.posterUrl && (
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1d4ed8", background: "#eff6ff", border: "1px solid #bfdbfe", padding: "0.2rem 0.55rem", borderRadius: "999px" }}>
                                                📅 Posted: {dateFormatted}
                                            </span>
                                            <span style={{
                                                padding: "0.15rem 0.5rem",
                                                borderRadius: "999px",
                                                fontSize: "0.72rem",
                                                fontWeight: 700,
                                                backgroundColor: job.status === 'Active' ? '#dcfce7' : '#fef08a',
                                                color: job.status === 'Active' ? '#166534' : '#854d0e',
                                            }}>
                                                {job.status}
                                            </span>
                                        </div>
                                    )}
                                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.35rem 0", lineHeight: 1.3 }}>
                                        <a href={`/admin/jobs/${job.id}`} style={{ color: "#0f172a", textDecoration: "none" }}>{job.title}</a>
                                    </h3>
                                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b", marginBottom: "0.5rem" }}>
                                        {job.companyName || job.employer?.companyName || job.employer?.name || "Hospitality Partner"}
                                    </div>
                                    <div style={{ fontSize: "0.8rem", color: "#475569", display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                                        <span>📍 {job.location}</span>
                                        <span>&bull;</span>
                                        <span>💼 {job.type}</span>
                                        {job.isTopOpportunity && (
                                            <span style={{ color: "#d97706", fontWeight: 700 }}>⭐ Top</span>
                                        )}
                                    </div>

                                    <div style={{ marginTop: "auto", paddingTop: "0.75rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
                                            <strong>{job.applications.length}</strong> applications
                                        </span>
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            <a href={`/jobs/${job.id}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.78rem", color: "#2563eb", background: "#f8fafc", padding: "0.35rem 0.65rem", borderRadius: "6px", textDecoration: "none", fontWeight: 600, border: "1px solid #e2e8f0" }}>
                                                View Portal ↗
                                            </a>
                                            <a href={`/admin/jobs/${job.id}`} style={{ fontSize: "0.78rem", color: "#ffffff", background: "#0f172a", padding: "0.35rem 0.65rem", borderRadius: "6px", textDecoration: "none", fontWeight: 600 }}>
                                                Edit
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Comprehensive Table View */}
            <div style={{ overflowX: "auto", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #eee", textAlign: "left", backgroundColor: "#f8fafc" }}>
                            <th style={{ padding: "1rem" }}>Title & Company</th>
                            <th style={{ padding: "1rem" }}>Posted Date</th>
                            <th style={{ padding: "1rem" }}>Type & Location</th>
                            <th style={{ padding: "1rem" }}>Apps</th>
                            <th style={{ padding: "1rem" }}>Status</th>
                            <th style={{ padding: "1rem" }}>Top Opportunity</th>
                            <th style={{ padding: "1rem" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job) => (
                            <tr key={job.id} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "1rem" }}>
                                    <div style={{ fontWeight: 600 }}>
                                        <a href={`/admin/jobs/${job.id}`} style={{ color: "#2563eb", textDecoration: "none" }}>{job.title}</a>
                                    </div>
                                    <div style={{ fontSize: "0.875rem", color: "#64748b" }}>{job.employer?.companyName || job.employer?.name || "Unknown Employer"}</div>
                                </td>
                                <td style={{ padding: "1rem", whiteSpace: "nowrap" }}>
                                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1e293b", background: "#f8fafc", padding: "0.25rem 0.6rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                                        📅 {formatJobDate(job.createdAt)}
                                    </span>
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    <div>{job.type}</div>
                                    <div style={{ fontSize: "0.875rem", color: "#64748b" }}>{job.location}</div>
                                </td>
                                <td style={{ padding: "1rem", fontWeight: "bold" }}>
                                    <a href={`/admin/jobs/${job.id}#applications`} style={{ color: "#2563eb", textDecoration: "underline" }}>
                                        {job.applications.length}
                                    </a>
                                </td>
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
                                    <form action={toggleTopOpportunity}>
                                        <input type="hidden" name="jobId" value={job.id} />
                                        <input type="hidden" name="current" value={String(job.isTopOpportunity)} />
                                        {job.isTopOpportunity ? (
                                            <button
                                                type="submit"
                                                title="Click to remove from top opportunities"
                                                style={{
                                                    padding: "0.4rem 0.75rem",
                                                    backgroundColor: "#fef08a",
                                                    color: "#854d0e",
                                                    borderRadius: "6px",
                                                    border: "1px solid #facc15",
                                                    cursor: "pointer",
                                                    fontSize: "0.85rem",
                                                    fontWeight: 700,
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "0.4rem",
                                                    transition: "all 0.2s ease"
                                                }}
                                            >
                                                <span>⭐ Top</span>
                                                <span style={{
                                                    fontSize: "0.75rem",
                                                    backgroundColor: "#dc2626",
                                                    color: "#ffffff",
                                                    padding: "0.15rem 0.45rem",
                                                    borderRadius: "4px",
                                                    fontWeight: 700
                                                }}>
                                                    Remove ✕
                                                </span>
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                title="Click to mark as top opportunity"
                                                style={{
                                                    padding: "0.4rem 0.75rem",
                                                    backgroundColor: "#f1f5f9",
                                                    color: "#475569",
                                                    borderRadius: "6px",
                                                    border: "1px solid #cbd5e1",
                                                    cursor: "pointer",
                                                    fontSize: "0.85rem",
                                                    fontWeight: 600,
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "0.25rem",
                                                    transition: "all 0.2s ease"
                                                }}
                                            >
                                                <span>☆ Mark Top</span>
                                            </button>
                                        )}
                                    </form>
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
