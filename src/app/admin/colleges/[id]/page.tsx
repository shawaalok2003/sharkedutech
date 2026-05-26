import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";

async function updateCollege(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;

    const email = formData.get("email") as string;
    if (email) {
        const candidateUser = await prisma.user.findFirst({
            where: {
                email: email.trim().toLowerCase(),
                role: "CANDIDATE"
            }
        });
        if (candidateUser) {
            redirect(`/admin/colleges/${id}?error=This email is already registered to a Candidate user!`);
        }
    }

    const data = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        location: formData.get("location") as string,
        establishedYear: Number(formData.get("establishedYear")) || null,
        website: formData.get("website") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        address: formData.get("address") as string,
        rating: Number(formData.get("rating")) || null,
        logoUrl: formData.get("logoUrl") as string,
        accreditation: formData.get("accreditation") as string,
        affiliation: formData.get("affiliation") as string,
        ranking: formData.get("ranking") as string,
        campusArea: formData.get("campusArea") as string,
        hostelAvailable: formData.get("hostelAvailable") === "on",
        placementRate: formData.get("placementRate") as string,
        avgPackage: formData.get("avgPackage") as string,
        topRecruiters: formData.get("topRecruiters") as string,
        admissionProcess: formData.get("admissionProcess") as string,
        eligibility: formData.get("eligibility") as string,
        scholarships: formData.get("scholarships") as string,
        facilities: formData.get("facilities") as string,
        applicationFee: Number(formData.get("applicationFee")) || null,
        totalSeats: Number(formData.get("totalSeats")) || null,
    };

    await prisma.college.update({ where: { id }, data });
    revalidatePath("/admin/colleges");
    revalidatePath(`/admin/colleges/${id}`);
    redirect("/admin/colleges");
}

async function deleteCourse(formData: FormData) {
    "use server";
    const courseId = formData.get("courseId") as string;
    const collegeId = formData.get("collegeId") as string;
    await prisma.course.delete({ where: { id: courseId } });
    revalidatePath(`/admin/colleges/${collegeId}`);
}

export default async function EditCollegePage(props: { params: Promise<{ id: string }>, searchParams?: Promise<{ error?: string }> }) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const error = searchParams?.error;

    const college = await prisma.college.findUnique({
        where: { id: params.id },
        include: { courses: true }
    });

    if (!college) return <div style={{ padding: "2rem" }}>College not found.</div>;

    return (
        <div>
            <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--primary)" }}>Edit College</h1>
                    <p style={{ color: "var(--muted-foreground)" }}>Update details for {college.name}.</p>
                </div>
                <Link href="/admin/colleges" style={{ padding: "0.5rem 1rem", backgroundColor: "#e2e8f0", color: "#0f172a", borderRadius: "6px", textDecoration: "none", fontWeight: 500 }}>
                    Back to Colleges
                </Link>
            </div>

            {error && (
                <div style={{ padding: "1rem", marginBottom: "1.5rem", backgroundColor: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "6px", color: "#991b1b", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    ⚠️ {error}
                </div>
            )}

            <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.5rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>College Details</h2>
                <form action={updateCollege} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <input type="hidden" name="id" value={college.id} />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Name</label>
                            <input name="name" defaultValue={college.name} required style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Location</label>
                            <input name="location" defaultValue={college.location} required style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Established Year</label>
                            <input name="establishedYear" type="number" defaultValue={college.establishedYear || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Website</label>
                            <input name="website" defaultValue={college.website || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Email</label>
                            <input name="email" type="email" defaultValue={college.email || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Phone</label>
                            <input name="phone" defaultValue={college.phone || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Address</label>
                            <input name="address" defaultValue={college.address || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Ranking</label>
                            <input name="ranking" defaultValue={college.ranking || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Rating (1-5)</label>
                            <input name="rating" type="number" step="0.1" defaultValue={college.rating || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Accreditation</label>
                            <input name="accreditation" defaultValue={college.accreditation || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Affiliation</label>
                            <input name="affiliation" defaultValue={college.affiliation || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Application Fee</label>
                            <input name="applicationFee" type="number" defaultValue={college.applicationFee || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Total Seats</label>
                            <input name="totalSeats" type="number" defaultValue={college.totalSeats || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <input type="checkbox" name="hostelAvailable" id="hostelAvailable" defaultChecked={college.hostelAvailable || false} style={{ width: "1.2rem", height: "1.2rem" }} />
                            <label htmlFor="hostelAvailable" style={{ fontWeight: 500 }}>Hostel Available</label>
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Logo URL</label>
                            <input name="logoUrl" defaultValue={college.logoUrl || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>

                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Description</label>
                            <textarea name="description" defaultValue={college.description || ""} rows={4} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Facilities</label>
                            <input name="facilities" defaultValue={college.facilities || ""} style={{ width: "100%", padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }} />
                        </div>
                    </div>

                    <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                        <button type="submit" style={{ padding: "0.6rem 1.2rem", backgroundColor: "#2563eb", color: "white", borderRadius: "4px", border: "none", cursor: "pointer", fontWeight: 500 }}>
                            Save College Details
                        </button>
                    </div>
                </form>
            </div>

            <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Manage Courses</h2>
                    <Link href={`/admin/colleges/${college.id}/courses/new`} style={{ padding: "0.5rem 1rem", backgroundColor: "#10b981", color: "white", borderRadius: "6px", textDecoration: "none", fontWeight: 500 }}>
                        + Add Course
                    </Link>
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid #eee", textAlign: "left", backgroundColor: "#f8fafc" }}>
                                <th style={{ padding: "1rem" }}>Course Title</th>
                                <th style={{ padding: "1rem" }}>Level</th>
                                <th style={{ padding: "1rem" }}>Duration</th>
                                <th style={{ padding: "1rem" }}>Seats</th>
                                <th style={{ padding: "1rem" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {college.courses?.map(course => (
                                <tr key={course.id} style={{ borderBottom: "1px solid #eee" }}>
                                    <td style={{ padding: "1rem", fontWeight: 500 }}>{course.title}</td>
                                    <td style={{ padding: "1rem" }}>{course.level}</td>
                                    <td style={{ padding: "1rem" }}>{course.duration}</td>
                                    <td style={{ padding: "1rem" }}>₹{course.fee?.toLocaleString()}</td>
                                    <td style={{ padding: "1rem" }}>
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            <Link href={`/admin/colleges/${college.id}/courses/${course.id}`} style={{ padding: "0.4rem 0.8rem", backgroundColor: "#e2e8f0", color: "#0f172a", borderRadius: "4px", textDecoration: "none", fontSize: "0.875rem" }}>
                                                Edit
                                            </Link>
                                            <form action={deleteCourse}>
                                                <input type="hidden" name="courseId" value={course.id} />
                                                <input type="hidden" name="collegeId" value={college.id} />
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
                </div>
                {(!college.courses || college.courses.length === 0) && (
                    <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                        No courses available in this college.
                    </div>
                )}
            </div>
        </div>
    );
}
