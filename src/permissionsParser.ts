export default function (value: string): string | undefined {
    if (value.length === 3) {
        return /^[0-7][0-7][0-7]$/.exec(value) ? value : undefined;
    }

    if (value.length === 9) {
        const map: Record<string, number> = { 'r': 4, 'w': 2, 'x': 1, '-': 0 };

        return (/^([r-][w-][x-]){3}$/.exec(value))
            ? (map[value[0]] + map[value[1]] + map[value[2]]).toString()
            + (map[value[3]] + map[value[4]] + map[value[5]]).toString()
            + (map[value[6]] + map[value[7]] + map[value[8]]).toString()
            : undefined;
    }

    return undefined;
}
