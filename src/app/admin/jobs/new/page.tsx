import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";

async function createJob(formData: FormData) {
    "use server";
    const employerEmail = formData.get("employerEmail") as string;

    // Find employer
    const employer = await prisma.user.findUnique({ where: { email: employerEmail } });
    if (!employer) {
        throw new Error("Employer with this email not found. Please create the user first.");
    }

    const title = formData.get("title") as string;
    const type = formData.get("type") as string;
    const location = formData.get("location") as string;
    const salaryMin = Number(formData.get("salaryMin")) || null;
    const salaryMax = Number(formData.get("salaryMax")) || null;
    const description = formData.get("description") as string;
    const requirements = formData.get("requirements") as string;
    const status = formData.get("status") as string;

    await prisma.job.create({
        data: {
            title, type, location, salaryMin, salaryMax, description, requirements, status,
            employerId: employer.id
        }
    });

    revalidatePath("/admin/jobs");
    redirect("/admin/jobs");
}

export default function NewJobPage() {
    return (
        <div>
            <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--primary)" }}>Create Job Posting</h1>
                    <p style={{ color: "var(--muted-foreground)" }}>Manually define a new job on behalf of an employer.</p>
                </div>
                <Link href="/admin/jobs" style={{ padding: "0.5rem 1rem", backgroundColor: "#e2e8f0", color: "#0f172a", borderRadius: "6px", textDecoration: "none", fontWeight: 500 }}>
                    Back to Jobs
                </Link>
            </div>

            <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <form action={createJob} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Employer User Email</label>
                            <input name="employerEmail" type="email" required placeholder="user@company.com" style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "#f8fafc" }} />
                            <p style={{ fontSize: "0.8rad", color: "#64748b", marginTop: "0.25rem" }}>Must match an existing employer's registered email.</p>
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Job Title</label>
                            <input name="title" required style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Type</label>
                            <input name="type" placeholder="Full-time, Contract, etc." required style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Location</label>
                            <input name="location" placeholder="Remote, New York, etc." required style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Min Salary</label>
                            <input name="salaryMin" type="number" style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Max Salary</label>
                            <input name="salaryMax" type="number" style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Status</label>
                            <select name="status" defaultValue="Active" style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }}>
                                <option value="Active">Active</option>
                                <option value="Pending">Pending</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Description</label>
                            <textarea name="description" required rows={5} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Requirements</label>
                            <textarea name="requirements" required rows={5} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                    </div>

                    <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                        <Link href="/admin/jobs" style={{ padding: "0.6rem 1.2rem", backgroundColor: "transparent", color: "#64748b", borderRadius: "4px", textDecoration: "none", fontWeight: 500 }}>
                            Cancel
                        </Link>
                        <button type="submit" style={{ padding: "0.6rem 1.2rem", backgroundColor: "#2563eb", color: "white", borderRadius: "4px", border: "none", cursor: "pointer", fontWeight: 500 }}>
                            Post Job
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
