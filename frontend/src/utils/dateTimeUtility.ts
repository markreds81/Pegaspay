export const formatIsoDateTimeToLocale = (value?: string | Date): string => {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    return date.toLocaleString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}