import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { Button } from "@/components/ui/Button";

async function updateUser(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    const updateData: any = { name, email, role };
    
    if (password && password.trim() !== "") {
        updateData.password = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
        where: { id: userId },
        data: updateData
    });

    revalidatePath("/admin/users");
    redirect("/admin/users");
}

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await prisma.user.findUnique({
        where: { id }
    });

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--primary)", marginBottom: "2rem" }}>Edit User</h1>
            
            <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
                <form action={updateUser} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <input type="hidden" name="userId" value={user.id} />
                    
                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Full Name</label>
                        <input name="name" type="text" defaultValue={user.name || ""} required style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Email Address</label>
                        <input name="email" type="email" defaultValue={user.email} required style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>New Password (Leave blank to keep current)</label>
                        <input name="password" type="password" placeholder="••••••••" style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Role</label>
                        <select name="role" defaultValue={user.role} required style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                            <option value="CANDIDATE">Candidate</option>
                            <option value="EMPLOYER">Employer</option>
                            <option value="COLLEGE">College Partner</option>
                            <option value="ADMIN">Super Admin</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                        <Button type="submit" style={{ flex: 1 }}>Update User</Button>
                        <a href="/admin/users" style={{ flex: 1, textAlign: "center", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px", textDecoration: "none", color: "#64748b", fontWeight: 600 }}>Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
