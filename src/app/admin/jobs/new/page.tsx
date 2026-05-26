import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";

async function createJob(formData: FormData) {
    "use server";
    const postAsAdmin = formData.get("postAsAdmin") === "on";
    const employerEmail = formData.get("employerEmail") as string;

    let employerId: string;

    if (postAsAdmin) {
        // Find the Super Admin user
        const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        if (!adminUser) throw new Error("Admin user not found. Please create one first.");
        employerId = adminUser.id;
    } else {
        const employer = await prisma.user.findUnique({ where: { email: employerEmail } });
        if (!employer) {
            throw new Error("Employer with this email not found. Please create the user first.");
        }
        employerId = employer.id;
    }

    const title = formData.get("title") as string;
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

    await prisma.job.create({
        data: {
            title, type, category, location, salaryMin, salaryMax, description, requirements, status,
            employerId
        }
    });

    revalidatePath("/admin/jobs");
    redirect("/admin/jobs");
}

export default function NewJobPage() {
    return (
        <div>
            <style>{`
                .custom-cat-input { display: none; }
                .cat-wrapper:has(select option[value="__custom__"]:checked) .custom-cat-input { display: block; }
            `}</style>
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
                        <div style={{ gridColumn: "span 2", padding: "1rem", backgroundColor: "#f0f9ff", borderRadius: "8px", border: "1px solid #bae6fd", marginBottom: "0.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <input name="postAsAdmin" type="checkbox" id="postAsAdmin" style={{ width: "1.25rem", height: "1.25rem", cursor: "pointer" }} />
                                <label htmlFor="postAsAdmin" style={{ fontWeight: 600, cursor: "pointer", color: "#0369a1" }}>
                                    Post Directly as Shark Edutech (Super Admin)
                                </label>
                            </div>
                            <p style={{ fontSize: "0.875rem", color: "#0c4a6e", marginTop: "0.25rem", marginLeft: "2rem" }}>
                                If checked, this job will be attributed to the portal directly. No employer login required.
                            </p>
                        </div>

                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Employer User Email (Optional if posting as Admin)</label>
                            <input name="employerEmail" type="email" placeholder="user@company.com" style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "#f8fafc" }} />
                            <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>Required only if not posting as Admin.</p>
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
                        <div className="cat-wrapper">
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Category</label>
                            <select name="category" defaultValue="Front Office" style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "white" }}>
                                <optgroup label="Operations">
                                    <option value="Front Office">Front Office</option>
                                    <option value="Back Office">Back Office</option>
                                    <option value="Guest Relations">Guest Relations</option>
                                    <option value="Concierge">Concierge</option>
                                    <option value="Reservations">Reservations</option>
                                </optgroup>
                                <optgroup label="Food & Beverage">
                                    <option value="F&B Service">F&B Service</option>
                                    <option value="Food Production">Food Production (Kitchen)</option>
                                    <option value="Banquet & Events">Banquet &amp; Events</option>
                                    <option value="Bar & Mixology">Bar &amp; Mixology</option>
                                    <option value="Pastry & Bakery">Pastry &amp; Bakery</option>
                                    <option value="Stewarding">Stewarding</option>
                                </optgroup>
                                <optgroup label="Rooms Division">
                                    <option value="Housekeeping">Housekeeping</option>
                                    <option value="Laundry">Laundry</option>
                                    <option value="Engineering & Maintenance">Engineering &amp; Maintenance</option>
                                </optgroup>
                                <optgroup label="Wellness & Recreation">
                                    <option value="Spa & Wellness">Spa &amp; Wellness</option>
                                    <option value="Recreation & Activities">Recreation &amp; Activities</option>
                                </optgroup>
                                <optgroup label="Support Functions">
                                    <option value="Sales & Marketing">Sales &amp; Marketing</option>
                                    <option value="HR & Admin">HR &amp; Admin</option>
                                    <option value="Accounts & Finance">Accounts &amp; Finance</option>
                                    <option value="Purchasing & Stores">Purchasing &amp; Stores</option>
                                    <option value="Security">Security</option>
                                    <option value="IT & Systems">IT &amp; Systems</option>
                                </optgroup>
                                <option value="__custom__">✏️ Other (Custom)</option>
                            </select>
                            <input name="customCategory" className="custom-cat-input" placeholder="Enter your custom category..." style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc", marginTop: "0.5rem" }} />
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
