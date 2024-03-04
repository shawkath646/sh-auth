export default function toTitleCase(str: string) {
    return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
    });
}