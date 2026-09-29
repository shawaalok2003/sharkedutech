import { prisma } from "@/lib/prisma";
import { ConsentFormsAdminList } from "@/components/admin/ConsentFormsAdminList";

export const dynamic = "force-dynamic";

export default async function ConsentFormsAdminPage() {
    const rawForms = await prisma.candidateConsentForm.findMany({
        orderBy: { createdAt: "desc" },
    });

    // Serialize Date fields to ISO string or keep consistent for client component
    const forms = rawForms.map((f) => ({
        ...f,
        createdAt: f.createdAt.toISOString(),
        updatedAt: f.updatedAt.toISOString(),
    }));

    return (
        <div style={{ padding: "1rem 0", maxWidth: "1200px" }}>
            <div style={{
                marginBottom: "2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "1rem"
            }}>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
                        <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#002147", letterSpacing: "-0.03em", margin: 0 }}>
                            Candidate Registration & Consent Forms
                        </h1>
                        <span style={{
                            padding: "0.25rem 0.75rem",
                            background: "#002147",
                            color: "#ffd700",
                            borderRadius: "999px",
                            fontSize: "0.8rem",
                            fontWeight: 800
                        }}>
                            {forms.length} Total
                        </span>
                    </div>
                    <p style={{ color: "#64748b", fontSize: "0.95rem", margin: 0, maxWidth: "700px" }}>
                        Manage candidate consent forms submitted via the Home Tab. Review qualification details, checklist compliance, payment receipts, and update approval status.
                    </p>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <a
                        href="/Candidate_Consent_Form.pdf"
                        download="Candidate_Consent_Form.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            padding: "0.6rem 1.1rem",
                            background: "#ffffff",
                            border: "1px solid #cbd5e1",
                            borderRadius: "8px",
                            color: "#002147",
                            fontWeight: 700,
                            fontSize: "0.875rem",
                            textDecoration: "none",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
                        }}
                    >
                        📄 Download Blank PDF
                    </a>
                </div>
            </div>

            <ConsentFormsAdminList initialForms={forms as any} />
        </div>
    );
}
