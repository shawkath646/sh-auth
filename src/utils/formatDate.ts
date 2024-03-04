export default function formatDate(date: Date): string {
    const options = { day: '2-digit' as const, month: 'long' as const, year: 'numeric' as const };
    return date.toLocaleDateString('en-US', options);
};