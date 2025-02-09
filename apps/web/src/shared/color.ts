export function getComputedHSL(variable: string): string | null {
    // Get the computed HSL value from CSS variable
    const hslString: string = getComputedStyle(document.body).getPropertyValue(variable).trim();
    
    // Extract HSL values as numbers
    const hslValues: number[] | null = hslString.match(/\d+/g)?.map(Number) || null;
    
    // Ensure valid HSL values are extracted
    if (!hslValues || hslValues.length !== 3) return null;

    return hslToHex(hslValues[0], hslValues[1], hslValues[2]);
}

// Convert HSL to HEX
export function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

    // Convert to HEX
    const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
