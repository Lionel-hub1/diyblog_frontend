export function stripRichText(value = "", maxLength = 180) {
    const plainText = value
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    if (plainText.length <= maxLength) {
        return plainText;
    }

    return `${plainText.slice(0, maxLength)}...`;
}

function escapeHtml(value = "") {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export function toDisplayHtml(value = "") {
    const containsTags = /<\/?[a-z][\s\S]*>/i.test(value);
    if (containsTags) {
        return value;
    }

    return escapeHtml(value).replace(/\n/g, "<br />");
}
