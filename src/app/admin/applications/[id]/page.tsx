import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";

async function updateApplication(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const resumeUrl = formData.get("resumeUrl") as string;
    const coverLetter = formData.get("coverLetter") as string;
    const answers = formData.get("answers") as string;
    const status = formData.get("status") as string;

    await prisma.application.update({
        where: { id },
        data: { name, email, resumeUrl, coverLetter, answers, status }
    });

    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${id}`);
    redirect("/admin/applications");
}

export default async function EditApplicationPage(props: { params: Promise<{  id: string  }> }) {
    const params = await props.params;
    const app = await prisma.application.findUnique({
        where: { id: params.id },
        include: { job: true, applicant: true }
    });

    if (!app) return <div style={{ padding: "2rem" }}>Application not found.</div>;

    return (
        <div>
            <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--primary)" }}>Edit Application</h1>
                    <p style={{ color: "var(--muted-foreground)" }}>Update application by {app.name} for {app.job?.title}.</p>
                </div>
                <Link href="/admin/applications" style={{ padding: "0.5rem 1rem", backgroundColor: "#e2e8f0", color: "#0f172a", borderRadius: "6px", textDecoration: "none", fontWeight: 500 }}>
                    Back to Applications
                </Link>
            </div>

            <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <form action={updateApplication} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <input type="hidden" name="id" value={app.id} />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Applicant Name</label>
                            <input name="name" defaultValue={app.name} required style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Applicant Email</label>
                            <input name="email" type="email" defaultValue={app.email} required style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Status</label>
                            <select name="status" defaultValue={app.status} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }}>
                                <option value="New">New</option>
                                <option value="Reviewed">Reviewed</option>
                                <option value="Shortlisted">Shortlisted</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Resume URL</label>
                            <input name="resumeUrl" defaultValue={app.resumeUrl || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Cover Letter</label>
                            <textarea name="coverLetter" defaultValue={app.coverLetter || ""} rows={5} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Answers (JSON format)</label>
                            <textarea name="answers" defaultValue={app.answers || ""} rows={3} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc", fontFamily: "monospace" }} />
                        </div>
                    </div>

                    <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                        <Link href="/admin/applications" style={{ padding: "0.6rem 1.2rem", backgroundColor: "transparent", color: "#64748b", borderRadius: "4px", textDecoration: "none", fontWeight: 500 }}>
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
