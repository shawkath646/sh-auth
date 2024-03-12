export default function formatDate(date: Date | string): string {
    const resolvedDate = new Date(date);
    const options = { day: '2-digit' as const, month: 'long' as const, year: 'numeric' as const };
    return resolvedDate.toLocaleDateString('en-US', options);
};