import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";

async function updateJob(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const companyName = formData.get("companyName") as string;
    const type = formData.get("type") as string;
    const location = formData.get("location") as string;
    const salaryMin = Number(formData.get("salaryMin")) || null;
    const salaryMax = Number(formData.get("salaryMax")) || null;
    const description = formData.get("description") as string;
    const requirements = formData.get("requirements") as string;
    const status = formData.get("status") as string;

    await prisma.job.update({
        where: { id },
        data: { title, companyName, type, location, salaryMin, salaryMax, description, requirements, status }
    });

    revalidatePath("/admin/jobs");
    revalidatePath(`/admin/jobs/${id}`);
    redirect("/admin/jobs");
}

export default async function EditJobPage(props: { params: Promise<{  id: string  }> }) {
    const params = await props.params;
    const job = await prisma.job.findUnique({
        where: { id: params.id },
        include: { 
            employer: true,
            applications: {
                orderBy: { createdAt: "desc" }
            }
        }
    });

    if (!job) return <div style={{ padding: "2rem" }}>Job not found.</div>;

    return (
        <div>
            <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--primary)" }}>Edit Job</h1>
                    <p style={{ color: "var(--muted-foreground)" }}>Update posting by {job.employer.name || job.employer.email}.</p>
                </div>
                <Link href="/admin/jobs" style={{ padding: "0.5rem 1rem", backgroundColor: "#e2e8f0", color: "#0f172a", borderRadius: "6px", textDecoration: "none", fontWeight: 500 }}>
                    Back to Jobs
                </Link>
            </div>

            <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <form action={updateJob} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <input type="hidden" name="id" value={job.id} />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Job Title</label>
                            <input name="title" defaultValue={job.title} required style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Company Name (Optional)</label>
                            <input name="companyName" defaultValue={job.companyName || ""} placeholder="E.g., Marriott International, Radisson Blu, or leave empty if posted as admin" style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Type</label>
                            <input name="type" defaultValue={job.type} required style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Location</label>
                            <input name="location" defaultValue={job.location} required style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Min Salary</label>
                            <input name="salaryMin" type="number" defaultValue={job.salaryMin || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Max Salary</label>
                            <input name="salaryMax" type="number" defaultValue={job.salaryMax || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Status</label>
                            <select name="status" defaultValue={job.status} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }}>
                                <option value="Active">Active</option>
                                <option value="Pending">Pending</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Description</label>
                            <textarea name="description" defaultValue={job.description} required rows={5} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Requirements</label>
                            <textarea name="requirements" defaultValue={job.requirements} required rows={5} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                    </div>

                    <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                        <Link href="/admin/jobs" style={{ padding: "0.6rem 1.2rem", backgroundColor: "transparent", color: "#64748b", borderRadius: "4px", textDecoration: "none", fontWeight: 500 }}>
                            Cancel
                        </Link>
                        <button type="submit" style={{ padding: "0.6rem 1.2rem", backgroundColor: "#2563eb", color: "white", borderRadius: "4px", border: "none", cursor: "pointer", fontWeight: 500 }}>
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* Applications for this job */}
            <div id="applications" style={{ marginTop: "3rem", backgroundColor: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)", marginBottom: "1.5rem" }}>
                    Applications for this position ({job.applications.length})
                </h2>
                {job.applications.length === 0 ? (
                    <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
                        No applications received yet.
                    </div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid #eee", textAlign: "left", backgroundColor: "#f8fafc" }}>
                                    <th style={{ padding: "1rem" }}>Applicant</th>
                                    <th style={{ padding: "1rem" }}>Docs</th>
                                    <th style={{ padding: "1rem" }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {job.applications.map((app) => (
                                    <tr key={app.id} style={{ borderBottom: "1px solid #eee" }}>
                                        <td style={{ padding: "1rem" }}>
                                            <div style={{ fontWeight: 600 }}>{app.name}</div>
                                            <div style={{ fontSize: "0.875rem", color: "#64748b" }}>{app.email}</div>
                                            <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{new Date(app.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td style={{ padding: "1rem" }}>
                                            {app.resumeUrl && (() => {
                                                const isData = app.resumeUrl.startsWith('data:');
                                                const getExt = (url: string) => {
                                                    const parts = url.split(';');
                                                    if (parts.length < 2) return 'pdf';
                                                    const mime = parts[0].split(':')[1];
                                                    if (mime === 'application/pdf') return 'pdf';
                                                    if (mime === 'image/jpeg') return 'jpg';
                                                    if (mime === 'image/png') return 'png';
                                                    return mime.split('/')[1] || 'pdf';
                                                };
                                                const ext = isData ? getExt(app.resumeUrl) : 'pdf';
                                                return (
                                                    <a 
                                                        href={app.resumeUrl} 
                                                        download={`resume-${app.name.replace(/\s+/g, '-')}.${ext}`}
                                                        style={{ color: "#2563eb", textDecoration: "underline", marginRight: "0.5rem", fontWeight: 600 }}
                                                    >
                                                        Resume
                                                    </a>
                                                );
                                            })()}
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
