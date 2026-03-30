export default function SettingsAdminPage() {
    return (
        <div>
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--primary)" }}>Admin Settings</h1>
                <p style={{ color: "var(--muted-foreground)" }}>Configure global platform settings.</p>
            </div>

            <div style={{
                backgroundColor: "white",
                padding: "3rem",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                textAlign: "center",
                color: "#64748b"
            }}>
                <h2 style={{ marginBottom: "1rem" }}>Under Construction</h2>
                <p>Global platform configuration and secret management will be placed here.</p>
            </div>
        </div>
    );
}
