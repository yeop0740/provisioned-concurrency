const KST_OFFSET = 9 * 60 * 60 * 1000;

export function convertKSTToUTC(date: Date) {
    return new Date(date.getTime() - KST_OFFSET);
}
