export function convertToCamelCase(source: string) {
    return source
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
}

export function convertToPascalCase(str: string): string {
    return str
        .toLowerCase()
        .replace(/(?:^|[^a-zA-Z0-9]+)(.)/g, (_, char) => char.toUpperCase());
}

export function convertToSnakeCase(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, "_");
}

export function convertToUpperCaseAll(str: string): string {
    return str.toUpperCase();
}
