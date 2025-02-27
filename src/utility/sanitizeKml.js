export const sanitizeKml = (kmlText) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(kmlText, "text/xml");

    // Remove potentially unsafe elements (like scripts)
    const disallowedTags = ["script", "style", "iframe", "object", "embed"];
    disallowedTags.forEach(tag => {
        const elements = xmlDoc.getElementsByTagName(tag);
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    });

    // Serialize the cleaned XML back to a string
    const serializer = new XMLSerializer();
    return serializer.serializeToString(xmlDoc);
};

export default sanitizeKml;
