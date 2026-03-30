import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";

async function updateCourse(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const collegeId = formData.get("collegeId") as string;

    const data = {
        title: formData.get("title") as string,
        level: formData.get("level") as string,
        duration: formData.get("duration") as string,
        seats: Number(formData.get("seats")) || null,
        fee: Number(formData.get("fee")) || null,
        status: formData.get("status") as string,
        description: formData.get("description") as string,
        mode: formData.get("mode") as string,
        eligibility: formData.get("eligibility") as string,
    };

    await prisma.course.update({ where: { id }, data });
    revalidatePath(`/admin/colleges/${collegeId}`);
    revalidatePath(`/admin/colleges/${collegeId}/courses/${id}`);
    redirect(`/admin/colleges/${collegeId}`);
}

export default async function EditCoursePage(props: { params: Promise<{  id: string, courseId: string  }> }) {
    const params = await props.params;
    const course = await prisma.course.findUnique({
        where: { id: params.courseId },
        include: { college: true }
    });

    if (!course) return <div style={{ padding: "2rem" }}>Course not found.</div>;

    return (
        <div>
            <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--primary)" }}>Edit Course</h1>
                    <p style={{ color: "var(--muted-foreground)" }}>Update '{course.title}' for {course.college.name}.</p>
                </div>
                <Link href={`/admin/colleges/${course.collegeId}`} style={{ padding: "0.5rem 1rem", backgroundColor: "#e2e8f0", color: "#0f172a", borderRadius: "6px", textDecoration: "none", fontWeight: 500 }}>
                    Back to College
                </Link>
            </div>

            <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "2rem" }}>
                <form action={updateCourse} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <input type="hidden" name="id" value={course.id} />
                    <input type="hidden" name="collegeId" value={course.collegeId} />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Course Title</label>
                            <input name="title" defaultValue={course.title} required style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Level (e.g. Undergraduate)</label>
                            <input name="level" defaultValue={course.level || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Duration (e.g. 4 Years)</label>
                            <input name="duration" defaultValue={course.duration || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Seats</label>
                            <input name="seats" type="number" defaultValue={course.seats || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Total Fee</label>
                            <input name="fee" type="number" defaultValue={course.fee || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Mode (e.g. Full-time)</label>
                            <input name="mode" defaultValue={course.mode || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Status</label>
                            <select name="status" defaultValue={course.status} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Eligibility</label>
                            <textarea name="eligibility" defaultValue={course.eligibility || ""} rows={2} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Description</label>
                            <textarea name="description" defaultValue={course.description || ""} rows={3} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                    </div>

                    <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                        <Link href={`/admin/colleges/${course.collegeId}`} style={{ padding: "0.6rem 1.2rem", backgroundColor: "transparent", color: "#64748b", borderRadius: "4px", textDecoration: "none", fontWeight: 500 }}>
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
