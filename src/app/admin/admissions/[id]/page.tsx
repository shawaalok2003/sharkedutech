import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";

async function updateAdmission(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;

    const data = {
        status: formData.get("status") as string,
        step: Number(formData.get("step")) || 1,
        score: formData.get("score") as string,
        remarks: formData.get("remarks") as string,
        intakeYear: formData.get("intakeYear") as string,
        highestQualification: formData.get("highestQualification") as string,
        percentage: formData.get("percentage") as string,
        entranceExam: formData.get("entranceExam") as string,
        entranceScore: formData.get("entranceScore") as string,
        notes: formData.get("notes") as string,
    };

    await prisma.admissionApplication.update({ where: { id }, data });
    revalidatePath("/admin/admissions");
    revalidatePath(`/admin/admissions/${id}`);
    redirect("/admin/admissions");
}

export default async function EditAdmissionPage(props: { params: Promise<{  id: string  }> }) {
    const params = await props.params;
    const admission = await prisma.admissionApplication.findUnique({
        where: { id: params.id },
        include: { student: true, college: true, course: true }
    });

    if (!admission) return <div style={{ padding: "2rem" }}>Admission Application not found.</div>;

    return (
        <div>
            <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--primary)" }}>Edit Admission</h1>
                    <p style={{ color: "var(--muted-foreground)" }}>Update application for {admission.student?.name || admission.student?.email} to {admission.college.name}.</p>
                </div>
                <Link href="/admin/admissions" style={{ padding: "0.5rem 1rem", backgroundColor: "#e2e8f0", color: "#0f172a", borderRadius: "6px", textDecoration: "none", fontWeight: 500 }}>
                    Back to Admissions
                </Link>
            </div>

            <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <form action={updateAdmission} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <input type="hidden" name="id" value={admission.id} />

                    <div style={{ padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <div style={{ fontWeight: 600 }}>Applying For:</div>
                        <div>College: {admission.college.name}</div>
                        <div>Course: {admission.course?.title || "N/A"}</div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Status</label>
                            <select name="status" defaultValue={admission.status} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }}>
                                <option value="Pending">Pending</option>
                                <option value="Reviewed">Reviewed</option>
                                <option value="Document Required">Document Required</option>
                                <option value="Interview Scheduled">Interview Scheduled</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Application Step (1-4)</label>
                            <input name="step" type="number" defaultValue={admission.step || 1} min={1} max={4} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Highest Qualification</label>
                            <input name="highestQualification" defaultValue={admission.highestQualification || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Percentage / CGPA</label>
                            <input name="percentage" defaultValue={admission.percentage || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Entrance Exam Name</label>
                            <input name="entranceExam" defaultValue={admission.entranceExam || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Entrance Score</label>
                            <input name="entranceScore" defaultValue={admission.entranceScore || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Overall Score / Rating</label>
                            <input name="score" defaultValue={admission.score || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Intake Year</label>
                            <input name="intakeYear" defaultValue={admission.intakeYear || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Remarks (Visible to Student)</label>
                            <textarea name="remarks" defaultValue={admission.remarks || ""} rows={3} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Internal Notes (Admin Only)</label>
                            <textarea name="notes" defaultValue={admission.notes || ""} rows={3} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                    </div>

                    <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                        <Link href="/admin/admissions" style={{ padding: "0.6rem 1.2rem", backgroundColor: "transparent", color: "#64748b", borderRadius: "4px", textDecoration: "none", fontWeight: 500 }}>
                            Cancel
                        </Link>
                        <button type="submit" style={{ padding: "0.6rem 1.2rem", backgroundColor: "#2563eb", color: "white", borderRadius: "4px", border: "none", cursor: "pointer", fontWeight: 500 }}>
                            Save Admission Data
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
