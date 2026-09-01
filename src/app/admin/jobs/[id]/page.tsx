import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import JobImageUploader from "../new/JobImageUploader";

async function updateJob(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const companyName = formData.get("companyName") as string;
    const type = formData.get("type") as string;
    const categorySelect = formData.get("category") as string;
    const customCategory = formData.get("customCategory") as string;
    const category = (categorySelect === "__custom__" && customCategory?.trim()) ? customCategory.trim() : categorySelect;
    const location = formData.get("location") as string;
    const salaryMin = Number(formData.get("salaryMin")) || null;
    const salaryMax = Number(formData.get("salaryMax")) || null;
    const description = formData.get("description") as string;
    const requirements = formData.get("requirements") as string;
    const status = formData.get("status") as string;
    const posterUrl = (formData.get("posterUrl") as string)?.trim() || null;
    const isTopOpportunity = formData.get("isTopOpportunity") === "on";

    await prisma.job.update({
        where: { id },
        data: { 
            title, companyName, type, category, location, salaryMin, salaryMax, description, requirements, status,
            posterUrl, isTopOpportunity
        }
    });

    revalidatePath("/admin/jobs");
    revalidatePath(`/admin/jobs/${id}`);
    revalidatePath("/");
    revalidatePath("/jobs");
    redirect("/admin/jobs");
}

export default async function EditJobPage(props: { params: Promise<{ id: string }> }) {
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

    const categories = [
        "Front Office",
        "Food Production",
        "Food & Beverage",
        "Housekeeping",
        "General Management",
        "Back Office",
        "Accounts",
        "Sales & Marketing",
        "Human Resources",
        "Hotel Operations"
    ];

    return (
        <div>
            <style>{`
                .custom-cat-input { display: none; }
                .cat-wrapper:has(select option[value="__custom__"]:checked) .custom-cat-input { display: block; }
            `}</style>
            <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--primary)" }}>Edit Job Posting</h1>
                    <p style={{ color: "var(--muted-foreground)" }}>Update full details for "{job.title}".</p>
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
                            <JobImageUploader initialPosterUrl={job.posterUrl || ""} />
                        </div>

                        <div style={{ gridColumn: "span 2", padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <input 
                                    name="isTopOpportunity" 
                                    type="checkbox" 
                                    id="isTopOpportunity" 
                                    defaultChecked={job.isTopOpportunity} 
                                    style={{ width: "1.25rem", height: "1.25rem", cursor: "pointer" }} 
                                />
                                <label htmlFor="isTopOpportunity" style={{ fontWeight: 700, cursor: "pointer", color: "#001736" }}>
                                    ⭐ Feature in "Explore Opportunities" Carousel on Homepage
                                </label>
                            </div>
                        </div>

                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Job Title</label>
                            <input name="title" defaultValue={job.title} required style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>

                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Company / Hotel Name</label>
                            <input name="companyName" defaultValue={job.companyName || ""} placeholder="E.g., Marriott International, Hyatt Regency, Taj Hotels" style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Employment Type</label>
                            <select name="type" defaultValue={job.type} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }}>
                                <option value="Full Time">Full Time</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Industrial Training">Industrial Training</option>
                                <option value="On Job Training">On Job Training (OJT)</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>

                        <div className="cat-wrapper">
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Job Category</label>
                            <select name="category" defaultValue={categories.includes(job.category) ? job.category : "__custom__"} required style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }}>
                                {categories.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                                <option value="__custom__">+ Custom Category...</option>
                            </select>
                            <input name="customCategory" className="custom-cat-input" defaultValue={categories.includes(job.category) ? "" : job.category} placeholder="Type custom category name..." style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc", marginTop: "0.5rem" }} />
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Location (City, State)</label>
                            <input name="location" defaultValue={job.location} required style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Status</label>
                            <select name="status" defaultValue={job.status} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }}>
                                <option value="Active">Active</option>
                                <option value="Pending">Pending</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Min Salary (Optional)</label>
                            <input name="salaryMin" type="number" defaultValue={job.salaryMin || ""} placeholder="Leave empty if not specified" style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Max Salary (Optional)</label>
                            <input name="salaryMax" type="number" defaultValue={job.salaryMax || ""} placeholder="Leave empty if not specified" style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>

                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Job Description &amp; Responsibilities</label>
                            <textarea name="description" defaultValue={job.description} required rows={5} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>

                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Requirements &amp; Qualifications</label>
                            <textarea name="requirements" defaultValue={job.requirements || ""} required rows={5} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                    </div>

                    <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                        <Link href="/admin/jobs" style={{ padding: "0.6rem 1.2rem", backgroundColor: "transparent", color: "#64748b", borderRadius: "4px", textDecoration: "none", fontWeight: 500 }}>
                            Cancel
                        </Link>
                        <button type="submit" style={{ padding: "0.6rem 1.5rem", backgroundColor: "#2563eb", color: "white", borderRadius: "4px", border: "none", cursor: "pointer", fontWeight: 600 }}>
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
                                    <th style={{ padding: "1rem" }}>Applicant ID</th>
                                    <th style={{ padding: "1rem" }}>Status</th>
                                    <th style={{ padding: "1rem" }}>Applied Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {job.applications.map((app) => (
                                    <tr key={app.id} style={{ borderBottom: "1px solid #eee" }}>
                                        <td style={{ padding: "1rem", fontWeight: 600 }}>{app.candidateId || app.id}</td>
                                        <td style={{ padding: "1rem" }}>
                                            <span style={{ padding: "0.2rem 0.5rem", borderRadius: "4px", backgroundColor: "#dbeafe", color: "#1e40af", fontSize: "0.85rem" }}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#64748b" }}>
                                            {new Date(app.createdAt).toLocaleDateString()}
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
