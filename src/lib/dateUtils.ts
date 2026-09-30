export function formatJobDate(dateInput?: string | Date | null): string {
    if (!dateInput) return "";
    try {
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) return "";
        return d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    } catch {
        return "";
    }
}
