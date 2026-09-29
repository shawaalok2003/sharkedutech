"use client";

import { useState } from 'react';
import styles from './CandidateConsentSection.module.css';

export function CandidateConsentSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedRef, setSubmittedRef] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        qualification: 'Hotel Management Diploma / Degree',
        address: '',
        amountPaid: '',
        receiptNumber: '',
        signatureName: '',
        checklist: {
            cv: true,
            photo: true,
            certificates: true,
            idProof: true,
            experience: false
        },
        termsAgreed: true,
        refundPolicyAgreed: true,
        genuineDocsAgreed: true,
        declarationAgreed: true
    });

    const [uploadedDocs, setUploadedDocs] = useState<{
        cv?: { url: string; fileName: string; size: number };
        photo?: { url: string; fileName: string; size: number };
        certificates?: { url: string; fileName: string; size: number };
        idProof?: { url: string; fileName: string; size: number };
        experience?: { url: string; fileName: string; size: number };
    }>({});
    const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        if (name.startsWith('check_')) {
            const key = name.replace('check_', '');
            setFormData(prev => ({
                ...prev,
                checklist: { ...prev.checklist, [key]: checked }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: checked }));
        }
    };

    const handleFileUpload = async (
        docType: 'cv' | 'photo' | 'certificates' | 'idProof' | 'experience',
        file: File
    ) => {
        setUploadingDoc(docType);
        const fd = new FormData();
        fd.append('file', file);
        fd.append('docType', docType);

        try {
            const res = await fetch('/api/candidate-consent/upload', {
                method: 'POST',
                body: fd
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setUploadedDocs(prev => ({
                    ...prev,
                    [docType]: {
                        url: data.url,
                        fileName: data.fileName,
                        size: data.size
                    }
                }));
                // Auto-mark corresponding checklist item
                setFormData(prev => ({
                    ...prev,
                    checklist: { ...prev.checklist, [docType]: true }
                }));
            } else {
                alert(data.error || 'Failed to upload document.');
            }
        } catch (err) {
            alert('Upload failed. Please check network connection.');
        } finally {
            setUploadingDoc(null);
        }
    };

    const handleRemoveDoc = (docType: 'cv' | 'photo' | 'certificates' | 'idProof' | 'experience') => {
        setUploadedDocs(prev => {
            const copy = { ...prev };
            delete copy[docType];
            return copy;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setIsSubmitting(true);

        const checkedList = Object.entries(formData.checklist)
            .filter(([_, val]) => val)
            .map(([key]) => {
                switch (key) {
                    case 'cv': return 'Updated CV / Resume';
                    case 'photo': return 'Passport-size Photograph';
                    case 'certificates': return 'Educational Certificates';
                    case 'idProof': return 'Identity Proof (Aadhaar / PAN / Passport)';
                    case 'experience': return 'Experience / Relieving Certificates';
                    default: return key;
                }
            });

        try {
            const res = await fetch('/api/candidate-consent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    phone: formData.phone,
                    email: formData.email,
                    qualification: formData.qualification,
                    address: formData.address,
                    amountPaid: formData.amountPaid,
                    receiptNumber: formData.receiptNumber,
                    checklist: checkedList,
                    cvUrl: uploadedDocs.cv?.url || null,
                    photoUrl: uploadedDocs.photo?.url || null,
                    educationCertUrl: uploadedDocs.certificates?.url || null,
                    idProofUrl: uploadedDocs.idProof?.url || null,
                    experienceCertUrl: uploadedDocs.experience?.url || null,
                    documents: Object.keys(uploadedDocs).length > 0 ? uploadedDocs : null,
                    termsAgreed: formData.termsAgreed,
                    refundPolicyAgreed: formData.refundPolicyAgreed,
                    genuineDocsAgreed: formData.genuineDocsAgreed,
                    declarationAgreed: formData.declarationAgreed,
                    signatureName: formData.signatureName || formData.fullName
                })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setSubmittedRef(data.referenceNumber || 'SHARK-CONSENT-SUCCESS');
            } else {
                setErrorMessage(data.error || 'Failed to submit form. Please check your inputs.');
            }
        } catch (err: any) {
            setErrorMessage('Network error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className={styles.section} id="candidate-consent">
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.badge}>
                        ★ Official Candidate Protection Policy
                    </div>
                    <h2 className={styles.title}>
                        Candidate Registration &amp; <span className={styles.highlight}>Consent Form</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Standard Operating Procedure (SOP) for Hospitality Placement Services &amp; 5-Star Employer Matching. 
                        Transparent, legally compliant, and protected by our 100% Refund Guarantee.
                    </p>
                </div>

                <div className={styles.bentoGrid}>
                    {/* Main Guarantee & Details Card */}
                    <div className={styles.guaranteeCard}>
                        <div>
                            <div className={styles.guaranteeBadge}>
                                🛡️ 100% Candidate Protection
                            </div>
                            <h3 className={styles.guaranteeHeading}>
                                Special Registration Policy &amp; 3-Month Refund Guarantee
                            </h3>
                            <p className={styles.guaranteeText}>
                                In accordance with our candidate protection framework, if <strong>Shark International Edutech Pvt. Ltd.</strong> does 
                                not successfully provide a hospitality job placement within <strong>three (3) months</strong> from the date 
                                of completed registration, the full registration amount paid by the candidate will be 
                                <strong> 100% refunded without deduction</strong>.
                            </p>

                            <ul className={styles.clausesList}>
                                <li className={styles.clauseItem}>
                                    <span className={styles.clauseCheck}>✔</span>
                                    <span>Direct Placement Consideration in 400+ Star Hotels across India</span>
                                </li>
                                <li className={styles.clauseItem}>
                                    <span className={styles.clauseCheck}>✔</span>
                                    <span>100% Written Refund Policy backed by Official Company Receipt</span>
                                </li>
                                <li className={styles.clauseItem}>
                                    <span className={styles.clauseCheck}>✔</span>
                                    <span>Strict Data Privacy &amp; Credential Authentication Protocol (Clauses 1–15)</span>
                                </li>
                                <li className={styles.clauseItem}>
                                    <span className={styles.clauseCheck}>✔</span>
                                    <span>Immediate Digital Reference Number &amp; Admin Verification</span>
                                </li>
                            </ul>
                        </div>

                        <div className={styles.actionRow}>
                            <button 
                                className={styles.btnPrimary}
                                onClick={() => setIsModalOpen(true)}
                            >
                                ✍️ Fill &amp; Submit Consent Online
                            </button>
                            <a 
                                href="/Candidate_Consent_Form.pdf" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={styles.btnSecondary}
                                download="Candidate_Consent_Form.pdf"
                            >
                                📥 Download Official PDF Form
                            </a>
                        </div>
                    </div>

                    {/* Preview / Checklist Card */}
                    <div className={styles.previewCard}>
                        <div className={styles.previewHeader}>
                            <h4 className={styles.previewTitle}>Mandatory Document Checklist</h4>
                            <p className={styles.previewSub}>Standard Requirement under Clause 1.3 for Placement Onboarding</p>
                        </div>

                        <div className={styles.checklistGrid}>
                            <div className={styles.checklistItem}>
                                <span>📄</span>
                                <span>Updated Hospitality CV / Resume</span>
                            </div>
                            <div className={styles.checklistItem}>
                                <span>📸</span>
                                <span>Recent Passport-size Photograph</span>
                            </div>
                            <div className={styles.checklistItem}>
                                <span>🎓</span>
                                <span>Educational &amp; Hotel Management Certificates</span>
                            </div>
                            <div className={styles.checklistItem}>
                                <span>🪪</span>
                                <span>Identity Proof (Aadhaar / PAN / Passport)</span>
                            </div>
                            <div className={styles.checklistItem}>
                                <span>💼</span>
                                <span>Experience / Relieving Letters (if applicable)</span>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: 'auto' }}>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
                                Shark International Edutech Pvt. Ltd. &bull; Registered Office: Kolkata - 700157
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Fill & Submit Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => !isSubmitting && setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button 
                            className={styles.closeBtn} 
                            onClick={() => setIsModalOpen(false)}
                            disabled={isSubmitting}
                        >
                            ✕
                        </button>

                        {submittedRef ? (
                            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
                                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fed488', marginBottom: '0.75rem' }}>
                                    Consent Form Successfully Recorded!
                                </h3>
                                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
                                    Thank you, <strong>{formData.fullName}</strong>. Your candidate registration details and signed consent have been officially stored in the Shark Edutech system.
                                </p>
                                <div style={{ background: 'rgba(254, 212, 136, 0.12)', border: '1px solid #fed488', borderRadius: '10px', padding: '1rem', display: 'inline-block', marginBottom: '1.25rem' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Official Reference Number</span>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fed488', marginTop: '0.25rem' }}>
                                        {submittedRef}
                                    </div>
                                </div>
                                <div style={{
                                    background: 'rgba(16, 185, 129, 0.15)',
                                    border: '1px solid #10b981',
                                    borderRadius: '10px',
                                    padding: '0.85rem 1.25rem',
                                    maxWidth: '520px',
                                    margin: '0 auto 2rem auto',
                                    fontSize: '0.9rem',
                                    color: '#6ee7b7',
                                    textAlign: 'center'
                                }}>
                                    📧 <strong>Confirmation Email Sent!</strong> A copy of your submission, official reference code, and refund policy guarantee has been dispatched to <strong>{formData.email}</strong>.
                                </div>
                                <div>
                                    <button 
                                        className={styles.btnPrimary} 
                                        onClick={() => {
                                            setSubmittedRef(null);
                                            setIsModalOpen(false);
                                        }}
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '1.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                                    <span style={{ color: '#fed488', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                        Shark International Edutech Pvt. Ltd.
                                    </span>
                                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', margin: '0.35rem 0' }}>
                                        Candidate Registration &amp; Consent Form
                                    </h3>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                                        Please fill out your verified candidate information. Backed by our 3-month placement / 100% refund guarantee.
                                    </p>
                                </div>

                                {errorMessage && (
                                    <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                        ⚠️ {errorMessage}
                                    </div>
                                )}

                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Full Name (as per Govt. ID) *</label>
                                        <input 
                                            type="text" 
                                            name="fullName"
                                            required
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="e.g. Rahul Sharma"
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Contact Number / WhatsApp *</label>
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+91 98765 43210"
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Email Address *</label>
                                        <input 
                                            type="email" 
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="candidate@example.com"
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Highest Qualification *</label>
                                        <input 
                                            type="text" 
                                            name="qualification"
                                            required
                                            value={formData.qualification}
                                            onChange={handleChange}
                                            placeholder="e.g. BHM / B.Sc Hospitality / Diploma"
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroupFull}>
                                        <label className={styles.label}>Permanent Residential Address *</label>
                                        <textarea 
                                            name="address"
                                            required
                                            rows={2}
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Full address with city, state and PIN code"
                                            className={styles.textarea}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Registration Amount Paid (₹)</label>
                                        <input 
                                            type="text" 
                                            name="amountPaid"
                                            value={formData.amountPaid}
                                            onChange={handleChange}
                                            placeholder="e.g. 15000"
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Official Receipt / Ref Number</label>
                                        <input 
                                            type="text" 
                                            name="receiptNumber"
                                            value={formData.receiptNumber}
                                            onChange={handleChange}
                                            placeholder="e.g. RCP-2026-0891"
                                            className={styles.input}
                                        />
                                    </div>
                                </div>

                                <div className={styles.checkboxGroup}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fed488', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                            3. Document Submission Checklist (Clause 1.3)
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                            📎 Select checkbox &amp; optionally upload document files directly
                                        </span>
                                    </div>

                                    <div className={styles.docChecklistContainer}>
                                        {[
                                            {
                                                key: 'cv' as const,
                                                icon: '📄',
                                                title: 'Updated CV / Resume provided',
                                                accept: '.pdf,.doc,.docx',
                                                hint: 'PDF, DOC or DOCX'
                                            },
                                            {
                                                key: 'photo' as const,
                                                icon: '🖼️',
                                                title: 'Passport-size Photograph submitted',
                                                accept: 'image/*',
                                                hint: 'JPG, PNG or WEBP'
                                            },
                                            {
                                                key: 'certificates' as const,
                                                icon: '🎓',
                                                title: 'Educational & Hospitality Certificates attached',
                                                accept: '.pdf,.jpg,.jpeg,.png,.webp,.doc,.docx',
                                                hint: 'Marksheets, Degree, Diplomas'
                                            },
                                            {
                                                key: 'idProof' as const,
                                                icon: '🪪',
                                                title: 'Identity Proof (Aadhaar / PAN / Passport)',
                                                accept: '.pdf,.jpg,.jpeg,.png,.webp',
                                                hint: 'Govt. Photo Identity Document'
                                            },
                                            {
                                                key: 'experience' as const,
                                                icon: '💼',
                                                title: 'Experience / Relieving Certificates (if applicable)',
                                                accept: '.pdf,.jpg,.jpeg,.png,.webp,.doc,.docx',
                                                hint: 'Experience / Relieving Letters (Optional)'
                                            }
                                        ].map((item) => {
                                            const isChecked = formData.checklist[item.key];
                                            const uploaded = uploadedDocs[item.key];
                                            const isUploading = uploadingDoc === item.key;
                                            const inputId = `file-input-${item.key}`;

                                            return (
                                                <div 
                                                    key={item.key} 
                                                    className={`${styles.docItem} ${uploaded ? styles.docItemUploaded : ''}`}
                                                >
                                                    <div className={styles.docItemTop}>
                                                        <div className={styles.docTitleWrap}>
                                                            <input
                                                                type="checkbox"
                                                                id={`check-${item.key}`}
                                                                name={`check_${item.key}`}
                                                                checked={isChecked}
                                                                onChange={handleCheckboxChange}
                                                                style={{
                                                                    accentColor: '#f59e0b',
                                                                    width: '1.1rem',
                                                                    height: '1.1rem',
                                                                    cursor: 'pointer'
                                                                }}
                                                            />
                                                            <span className={styles.docIcon}>{item.icon}</span>
                                                            <div>
                                                                <label 
                                                                    htmlFor={`check-${item.key}`}
                                                                    className={styles.docTitle}
                                                                    style={{ cursor: 'pointer' }}
                                                                >
                                                                    {item.title}
                                                                </label>
                                                                <div style={{ fontSize: '0.725rem', color: '#94a3b8', marginTop: '2px' }}>
                                                                    {item.hint}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className={styles.docActions}>
                                                            {uploaded ? (
                                                                <>
                                                                    {item.key === 'photo' && (
                                                                        <img 
                                                                            src={uploaded.url} 
                                                                            alt="Preview" 
                                                                            className={styles.docThumbnail}
                                                                        />
                                                                    )}
                                                                    <div className={styles.uploadStatusPill}>
                                                                        <span>✔ {uploaded.fileName.length > 20 ? uploaded.fileName.slice(0, 18) + '...' : uploaded.fileName}</span>
                                                                        <span style={{ opacity: 0.75 }}>({(uploaded.size / 1024).toFixed(0)} KB)</span>
                                                                        <button
                                                                            type="button"
                                                                            title="Remove file"
                                                                            onClick={() => handleRemoveDoc(item.key)}
                                                                            className={styles.removeDocBtn}
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            ) : isUploading ? (
                                                                <div className={styles.uploadingSpinner}>
                                                                    <span>⏳ Uploading...</span>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <input
                                                                        type="file"
                                                                        id={inputId}
                                                                        accept={item.accept}
                                                                        style={{ display: 'none' }}
                                                                        onChange={(e) => {
                                                                            const file = e.target.files?.[0];
                                                                            if (file) handleFileUpload(item.key, file);
                                                                            e.target.value = ''; // Reset input
                                                                        }}
                                                                    />
                                                                    <label 
                                                                        htmlFor={inputId}
                                                                        className={styles.uploadFileBtn}
                                                                    >
                                                                        <span>⬆ Upload File</span>
                                                                    </label>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className={styles.checkboxGroup}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fed488', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                        6. Candidate Declarations &amp; Explicit Consent
                                    </span>
                                    <label className={styles.checkboxLabel}>
                                        <input 
                                            type="checkbox" 
                                            name="termsAgreed"
                                            required
                                            checked={formData.termsAgreed}
                                            onChange={handleCheckboxChange}
                                        />
                                        <span>I confirm that I have read, understood, and agreed to all 15 clauses of the Terms &amp; Conditions of Shark International Edutech Pvt. Ltd.</span>
                                    </label>
                                    <label className={styles.checkboxLabel}>
                                        <input 
                                            type="checkbox" 
                                            name="refundPolicyAgreed"
                                            required
                                            checked={formData.refundPolicyAgreed}
                                            onChange={handleCheckboxChange}
                                        />
                                        <span>I understand and acknowledge that if no job opportunity is successfully provided within 3 months of registration, my full registration fee is refundable upon written request.</span>
                                    </label>
                                    <label className={styles.checkboxLabel}>
                                        <input 
                                            type="checkbox" 
                                            name="genuineDocsAgreed"
                                            required
                                            checked={formData.genuineDocsAgreed}
                                            onChange={handleCheckboxChange}
                                        />
                                        <span>I certify that all documents and qualifications submitted by me are genuine, authentic, and valid.</span>
                                    </label>
                                </div>

                                <div className={styles.declarationBox}>
                                    "I hereby confirm that I have read, understood, and agreed to the above Terms and Conditions and voluntarily consent to participate in the placement and/or training services offered by Shark International Edutech Pvt. Ltd."
                                </div>

                                <div className={styles.formGroup} style={{ marginBottom: '2rem' }}>
                                    <label className={styles.label}>Candidate Digital Signature (Type Full Legal Name) *</label>
                                    <input 
                                        type="text" 
                                        name="signatureName"
                                        required
                                        value={formData.signatureName}
                                        onChange={handleChange}
                                        placeholder="Full Printed Name to serve as Digital Signature"
                                        className={styles.input}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                    <button 
                                        type="button" 
                                        className={styles.btnSecondary} 
                                        onClick={() => setIsModalOpen(false)}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className={styles.btnPrimary}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Recording Consent...' : 'Submit Official Consent Form'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
