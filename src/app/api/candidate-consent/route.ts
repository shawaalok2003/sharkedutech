import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendConsentFormSubmissionEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            fullName,
            phone,
            email,
            qualification,
            address,
            amountPaid,
            receiptNumber,
            checklist,
            cvUrl,
            photoUrl,
            educationCertUrl,
            idProofUrl,
            experienceCertUrl,
            documents,
            termsAgreed,
            refundPolicyAgreed,
            genuineDocsAgreed,
            declarationAgreed,
            signatureName
        } = body;

        if (!fullName || !phone || !email) {
            return NextResponse.json(
                { error: 'Full name, phone/WhatsApp number, and email are required.' },
                { status: 400 }
            );
        }

        const submission = await prisma.candidateConsentForm.create({
            data: {
                fullName: fullName.trim(),
                phone: phone.trim(),
                email: email.trim().toLowerCase(),
                qualification: qualification ? qualification.trim() : 'Not Specified',
                address: address ? address.trim() : 'Not Specified',
                amountPaid: amountPaid ? String(amountPaid).trim() : null,
                receiptNumber: receiptNumber ? String(receiptNumber).trim() : null,
                checklist: checklist ? JSON.stringify(checklist) : null,
                cvUrl: cvUrl ? String(cvUrl).trim() : null,
                photoUrl: photoUrl ? String(photoUrl).trim() : null,
                educationCertUrl: educationCertUrl ? String(educationCertUrl).trim() : null,
                idProofUrl: idProofUrl ? String(idProofUrl).trim() : null,
                experienceCertUrl: experienceCertUrl ? String(experienceCertUrl).trim() : null,
                documents: documents ? (typeof documents === 'string' ? documents : JSON.stringify(documents)) : null,
                termsAgreed: Boolean(termsAgreed),
                refundPolicyAgreed: Boolean(refundPolicyAgreed),
                genuineDocsAgreed: Boolean(genuineDocsAgreed),
                declarationAgreed: Boolean(declarationAgreed),
                signatureName: signatureName ? signatureName.trim() : fullName.trim(),
                status: 'Pending'
            }
        });

        const referenceNumber = `SHARK-CF-${submission.id.slice(-6).toUpperCase()}`;

        // Send confirmation email asynchronously to candidate
        sendConsentFormSubmissionEmail({
            candidateName: submission.fullName,
            candidateEmail: submission.email,
            candidatePhone: submission.phone,
            qualification: submission.qualification,
            amountPaid: submission.amountPaid,
            receiptNumber: submission.receiptNumber,
            referenceCode: referenceNumber
        }).catch(err => console.error('Failed to dispatch candidate submission email:', err));

        return NextResponse.json({
            success: true,
            id: submission.id,
            referenceNumber,
            message: 'Your Candidate Registration & Consent Form has been recorded successfully.'
        }, { status: 201 });
    } catch (error) {
        console.error('Error submitting candidate consent form:', error);
        return NextResponse.json(
            { error: 'Failed to record consent form submission. Please try again.' },
            { status: 500 }
        );
    }
}
