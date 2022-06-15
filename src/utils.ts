export function HexFormat(value: number, padLength: number): string {
    return value.toString(16).padStart(padLength, "0");
}
