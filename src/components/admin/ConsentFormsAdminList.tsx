"use client";

import { useState } from "react";
import { ConsentFormItem } from "./ConsentFormItem";
import { Card, CardContent } from "@/components/ui/Card";

interface ConsentFormRecord {
    id: string;
    fullName: string;
    phone: string;
    email: string;
    qualification: string;
    address: string;
    amountPaid: string | null;
    receiptNumber: string | null;
    checklist: string | null;
    cvUrl?: string | null;
    photoUrl?: string | null;
    educationCertUrl?: string | null;
    idProofUrl?: string | null;
    experienceCertUrl?: string | null;
    documents?: string | null;
    termsAgreed: boolean;
    refundPolicyAgreed: boolean;
    genuineDocsAgreed: boolean;
    declarationAgreed: boolean;
    signatureName: string | null;
    status: string;
    adminRemarks: string | null;
    createdAt: Date | string;
}

interface Props {
    initialForms: ConsentFormRecord[];
}

export function ConsentFormsAdminList({ initialForms }: Props) {
    const [forms, setForms] = useState<ConsentFormRecord[]>(initialForms);
    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

    const totalCount = forms.length;
    const pendingCount = forms.filter(f => f.status === "Pending").length;
    const approvedCount = forms.filter(f => f.status === "Approved").length;
    const conditionalCount = forms.filter(f => f.status === "Conditional (Training Req.)").length;

    const handleDelete = (id: string) => {
        setForms(prev => prev.filter(f => f.id !== id));
    };

    const filtered = forms.filter(f => {
        const matchesStatus =
            selectedStatus === "ALL" ||
            f.status.toLowerCase() === selectedStatus.toLowerCase();

        const refCode = `SHARK-CF-${f.id.slice(-6).toUpperCase()}`;
        const q = search.toLowerCase();
        const matchesSearch =
            !search.trim() ||
            f.fullName.toLowerCase().includes(q) ||
            f.email.toLowerCase().includes(q) ||
            f.phone.includes(q) ||
            refCode.toLowerCase().includes(q) ||
            f.qualification.toLowerCase().includes(q) ||
            (f.receiptNumber && f.receiptNumber.toLowerCase().includes(q));

        return matchesStatus && matchesSearch;
    });

    return (
        <div>
            {/* Header & Stats */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                marginBottom: "2rem"
            }}>
                <div style={{
                    background: "linear-gradient(135deg, #002147 0%, #003875 100%)",
                    color: "white",
                    borderRadius: "14px",
                    padding: "1.25rem 1.5rem",
                    boxShadow: "0 4px 15px rgba(0,33,71,0.15)"
                }}>
                    <div style={{ fontSize: "0.85rem", opacity: 0.85, fontWeight: 600 }}>Total Submissions</div>
                    <div style={{ fontSize: "2rem", fontWeight: 900, marginTop: "0.25rem" }}>{totalCount}</div>
                </div>

                <div style={{
                    background: "#ffffff",
                    border: "1px solid #fde68a",
                    borderLeft: "5px solid #d97706",
                    borderRadius: "14px",
                    padding: "1.25rem 1.5rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                }}>
                    <div style={{ fontSize: "0.85rem", color: "#92400e", fontWeight: 700 }}>Pending Review</div>
                    <div style={{ fontSize: "2rem", fontWeight: 900, color: "#b45309", marginTop: "0.25rem" }}>{pendingCount}</div>
                </div>

                <div style={{
                    background: "#ffffff",
                    border: "1px solid #a7f3d0",
                    borderLeft: "5px solid #10b981",
                    borderRadius: "14px",
                    padding: "1.25rem 1.5rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                }}>
                    <div style={{ fontSize: "0.85rem", color: "#065f46", fontWeight: 700 }}>Approved Candidates</div>
                    <div style={{ fontSize: "2rem", fontWeight: 900, color: "#059669", marginTop: "0.25rem" }}>{approvedCount}</div>
                </div>

                <div style={{
                    background: "#ffffff",
                    border: "1px solid #bfdbfe",
                    borderLeft: "5px solid #2563eb",
                    borderRadius: "14px",
                    padding: "1.25rem 1.5rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                }}>
                    <div style={{ fontSize: "0.85rem", color: "#1e40af", fontWeight: 700 }}>Conditional / Training</div>
                    <div style={{ fontSize: "2rem", fontWeight: 900, color: "#2563eb", marginTop: "0.25rem" }}>{conditionalCount}</div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div style={{
                background: "#ffffff",
                padding: "1.25rem",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                marginBottom: "1.5rem",
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <div style={{ flex: "1 1 300px", minWidth: "260px" }}>
                    <input
                        type="text"
                        placeholder="Search by candidate name, phone, email, qualification or reference code..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "0.65rem 1rem",
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            fontSize: "0.9rem",
                            outline: "none",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {[
                        { label: `All (${totalCount})`, val: "ALL" },
                        { label: `Pending (${pendingCount})`, val: "Pending" },
                        { label: `Approved (${approvedCount})`, val: "Approved" },
                        { label: `Conditional (${conditionalCount})`, val: "Conditional (Training Req.)" }
                    ].map(tab => (
                        <button
                            key={tab.val}
                            onClick={() => setSelectedStatus(tab.val)}
                            style={{
                                padding: "0.5rem 0.9rem",
                                borderRadius: "8px",
                                border: selectedStatus === tab.val ? "1px solid #002147" : "1px solid #e2e8f0",
                                background: selectedStatus === tab.val ? "#002147" : "#f8fafc",
                                color: selectedStatus === tab.val ? "#ffffff" : "#475569",
                                fontWeight: 700,
                                fontSize: "0.825rem",
                                cursor: "pointer",
                                transition: "all 0.2s ease"
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div style={{ display: "grid", gap: "1.25rem" }}>
                {filtered.length === 0 ? (
                    <Card style={{ background: "rgba(255, 255, 255, 0.7)", borderStyle: "dashed", borderColor: "#cbd5e1" }}>
                        <CardContent style={{ padding: "4rem 2rem", textAlign: "center", color: "#64748b" }}>
                            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📑</div>
                            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#002147", marginBottom: "0.25rem" }}>
                                {search || selectedStatus !== "ALL" ? "No matching consent submissions found" : "No consent submissions yet"}
                            </h3>
                            <p style={{ fontSize: "0.9rem", color: "#94a3b8", maxWidth: "450px", margin: "0 auto" }}>
                                {search || selectedStatus !== "ALL"
                                    ? "Try clearing your search query or selecting a different status filter tab."
                                    : "New candidate registrations and signed consent forms submitted via the website Home tab will appear here in real time."}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filtered.map(form => (
                        <ConsentFormItem key={form.id} form={form} onDelete={handleDelete} />
                    ))
                )}
            </div>
        </div>
    );
}
