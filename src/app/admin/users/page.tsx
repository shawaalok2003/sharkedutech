import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ResetLinkButton } from "@/components/admin/ResetLinkButton";

async function updateUserRole(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    const role = formData.get("role") as string;
    await prisma.user.update({ where: { id: userId }, data: { role } });
    revalidatePath("/admin/users");
}

async function deleteUser(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    try {
        await prisma.user.delete({ where: { id: userId } });
    } catch (e) {
        console.error("Failed to delete user", e);
    }
    revalidatePath("/admin/users");
}

async function generateResetLink(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
        where: { id: userId },
        data: { resetToken: token, resetTokenExpires: expires }
    });

    revalidatePath("/admin/users");
    // In a real app, you would email this. For now, we'll show it in the UI or copy it.
}

export default async function UsersAdminPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--primary)" }}>Manage Users</h1>
                    <p style={{ color: "var(--muted-foreground)" }}>View, edit roles, and remove users.</p>
                </div>
                <a href="/admin/users/new" style={{ padding: "0.5rem 1rem", backgroundColor: "#0f172a", color: "white", borderRadius: "6px", textDecoration: "none", fontWeight: 500 }}>
                    + Create User
                </a>
            </div>

            <div style={{ overflowX: "auto", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #eee", textAlign: "left", backgroundColor: "#f8fafc" }}>
                            <th style={{ padding: "1rem" }}>Name</th>
                            <th style={{ padding: "1rem" }}>Email</th>
                            <th style={{ padding: "1rem" }}>Role</th>
                            <th style={{ padding: "1rem" }}>Joined</th>
                            <th style={{ padding: "1rem" }}>Password Recovery</th>
                            <th style={{ padding: "1rem" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "1rem", fontWeight: 500 }}>{user.name || "No Name Provided"}</td>
                                <td style={{ padding: "1rem" }}>{user.email}</td>
                                <td style={{ padding: "1rem" }}>
                                    <span style={{
                                        padding: "0.25rem 0.5rem",
                                        borderRadius: "999px",
                                        fontSize: "0.875rem",
                                        backgroundColor: user.role === 'ADMIN' ? '#dcfce7' : '#f1f5f9',
                                        color: user.role === 'ADMIN' ? '#166534' : '#475569',
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: "1rem" }}>{user.createdAt.toLocaleDateString()}</td>
                                <td style={{ padding: "1rem" }}>
                                    <ResetLinkButton 
                                        userId={user.id} 
                                        resetToken={user.resetToken} 
                                        generateAction={generateResetLink} 
                                    />
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        <a href={`/admin/users/${user.id}`} style={{ padding: "0.4rem 0.8rem", backgroundColor: "#e2e8f0", color: "#0f172a", borderRadius: "4px", textDecoration: "none", fontSize: "0.875rem" }}>
                                            Edit Details
                                        </a>
                                        <form action={deleteUser}>
                                            <input type="hidden" name="userId" value={user.id} />
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
                {users.length === 0 && (
                    <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                        No users configured.
                    </div>
                )}
            </div>
        </div>
    );
}
