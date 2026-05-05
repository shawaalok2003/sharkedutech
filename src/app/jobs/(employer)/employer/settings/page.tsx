import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";

export default function SettingsPage() {
    const toggleStyle = {
        width: '40px',
        height: '24px',
        backgroundColor: 'var(--primary)',
        borderRadius: '999px',
        position: 'relative' as const,
        cursor: 'pointer',
        display: 'inline-block',
    };

    const toggleKnobStyle = {
        width: '20px',
        height: '20px',
        backgroundColor: 'white',
        borderRadius: '50%',
        position: 'absolute' as const,
        top: '2px',
        left: '18px', // Toggled state
        transition: 'left 0.2s',
    };

    const sectionTitleStyle = {
        fontSize: '1.25rem',
        fontWeight: 600,
        color: 'var(--foreground)',
        marginBottom: '1rem',
    };

    const rowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 0',
        borderBottom: '1px solid var(--border)',
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--primary)' }}>Settings</h1>
                <p style={{ color: 'var(--muted-foreground)', marginTop: '0.5rem' }}>Manage your account preferences.</p>
            </div>

            <div style={{ display: 'grid', gap: '2rem' }}>
                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={rowStyle}>
                            <div>
                                <h4 style={{ fontWeight: 500 }}>Email Notifications</h4>
                                <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Receive emails about new applications.</p>
                            </div>
                            <div style={toggleStyle}><div style={toggleKnobStyle}></div></div>
                        </div>
                        <div style={rowStyle}>
                            <div>
                                <h4 style={{ fontWeight: 500 }}>Job Alerts</h4>
                                <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Get notified when your job posts expire.</p>
                            </div>
                            <div style={toggleStyle}><div style={toggleKnobStyle}></div></div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Account Security</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ ...rowStyle, borderBottom: 'none' }}>
                            <div>
                                <h4 style={{ fontWeight: 500 }}>Change Password</h4>
                                <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Update your password regularly.</p>
                            </div>
                            <Link href="/auth/forgot-password">
                                <Button variant="outline" size="sm">Update</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button style={{ backgroundColor: 'var(--error)', color: 'white' }}>Delete Account</Button>
                </div>
            </div>
        </div>
    );
}
