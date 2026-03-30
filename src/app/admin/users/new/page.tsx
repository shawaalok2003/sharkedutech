import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import bcrypt from "bcryptjs";

async function createUser(formData: FormData) {
    "use server";

    // Extract standard fields
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const passwordRaw = formData.get("password") as string;
    const role = formData.get("role") as string;

    // Company Profile
    const companyName = formData.get("companyName") as string;
    const industry = formData.get("industry") as string;
    const size = formData.get("size") as string;
    const website = formData.get("website") as string;
    const description = formData.get("description") as string;
    const address = formData.get("address") as string;

    // Candidate Profile
    const phone = formData.get("phone") as string;
    const skills = formData.get("skills") as string;
    const education = formData.get("education") as string;
    const experience = formData.get("experience") as string;
    const resumeUrl = formData.get("resumeUrl") as string;

    const password = passwordRaw ? await bcrypt.hash(passwordRaw, 10) : "";

    await prisma.user.create({
        data: {
            name, email, role, password,
            companyName, industry, size, website, description, address,
            phone, skills, education, experience, resumeUrl
        }
    });

    revalidatePath("/admin/users");
    redirect("/admin/users");
}

export default async function NewUserPage() {
    return (
        <div>
            <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--primary)" }}>Create New User</h1>
                    <p style={{ color: "var(--muted-foreground)" }}>Manually add a user to the platform.</p>
                </div>
                <Link href="/admin/users" style={{ padding: "0.5rem 1rem", backgroundColor: "#e2e8f0", color: "#0f172a", borderRadius: "6px", textDecoration: "none", fontWeight: 500 }}>
                    Back to Users
                </Link>
            </div>

            <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <form action={createUser} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600, borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>Basic Details</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Name</label>
                            <input name="name" required style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Email</label>
                            <input name="email" type="email" required style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Temporary Password</label>
                            <input name="password" type="password" required style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Role</label>
                            <select name="role" required defaultValue="CANDIDATE" style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }}>
                                <option value="ADMIN">ADMIN</option>
                                <option value="EMPLOYER">EMPLOYER</option>
                                <option value="CANDIDATE">CANDIDATE</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Phone (Optional)</label>
                            <input name="phone" style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                    </div>

                    {/* Same optional fields as before... */}
                    <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                        <Link href="/admin/users" style={{ padding: "0.6rem 1.2rem", backgroundColor: "transparent", color: "#64748b", borderRadius: "4px", textDecoration: "none", fontWeight: 500 }}>
                            Cancel
                        </Link>
                        <button type="submit" style={{ padding: "0.6rem 1.2rem", backgroundColor: "#2563eb", color: "white", borderRadius: "4px", border: "none", cursor: "pointer", fontWeight: 500 }}>
                            Create User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
