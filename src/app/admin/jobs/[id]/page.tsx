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
        include: { employer: true }
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
        </div>
    );
}
