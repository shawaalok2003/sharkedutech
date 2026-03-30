import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";

async function updateUser(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;

    // Extract standard fields
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
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

    await prisma.user.update({
        where: { id },
        data: {
            name, email, role,
            companyName, industry, size, website, description, address,
            phone, skills, education, experience, resumeUrl
        }
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${id}`);
    redirect("/admin/users");
}

export default async function EditUserPage(props: { params: Promise<{  id: string  }> }) {
    const params = await props.params;
    const user = await prisma.user.findUnique({
        where: { id: params.id }
    });

    if (!user) return <div style={{ padding: "2rem" }}>User not found.</div>;

    return (
        <div>
            <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--primary)" }}>Edit User</h1>
                    <p style={{ color: "var(--muted-foreground)" }}>Update full details for {user.name || user.email}.</p>
                </div>
                <Link href="/admin/users" style={{ padding: "0.5rem 1rem", backgroundColor: "#e2e8f0", color: "#0f172a", borderRadius: "6px", textDecoration: "none", fontWeight: 500 }}>
                    Back to Users
                </Link>
            </div>

            <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <form action={updateUser} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <input type="hidden" name="id" value={user.id} />

                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600, borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>Basic Details</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Name</label>
                            <input name="name" defaultValue={user.name || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Email</label>
                            <input name="email" type="email" defaultValue={user.email} required style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Role</label>
                            <select name="role" defaultValue={user.role} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }}>
                                <option value="ADMIN">ADMIN</option>
                                <option value="EMPLOYER">EMPLOYER</option>
                                <option value="CANDIDATE">CANDIDATE</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Phone</label>
                            <input name="phone" defaultValue={user.phone || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                    </div>

                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600, borderBottom: "1px solid #eee", paddingBottom: "0.5rem", marginTop: "1rem" }}>Company Profile</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Company Name</label>
                            <input name="companyName" defaultValue={user.companyName || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Industry</label>
                            <input name="industry" defaultValue={user.industry || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Size</label>
                            <input name="size" defaultValue={user.size || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Website</label>
                            <input name="website" defaultValue={user.website || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Address</label>
                            <input name="address" defaultValue={user.address || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Description</label>
                            <textarea name="description" defaultValue={user.description || ""} rows={3} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                    </div>

                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600, borderBottom: "1px solid #eee", paddingBottom: "0.5rem", marginTop: "1rem" }}>Candidate Profile</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Skills</label>
                            <input name="skills" defaultValue={user.skills || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Education</label>
                            <input name="education" defaultValue={user.education || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Experience</label>
                            <input name="experience" defaultValue={user.experience || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Resume URL</label>
                            <input name="resumeUrl" defaultValue={user.resumeUrl || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                    </div>

                    <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                        <Link href="/admin/users" style={{ padding: "0.6rem 1.2rem", backgroundColor: "transparent", color: "#64748b", borderRadius: "4px", textDecoration: "none", fontWeight: 500 }}>
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
