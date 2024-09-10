export default class {
    public size(size: number): string {
        switch (true) {
            case size < 1024: return `${size} B`;
            case size < 1048576: return `${Math.floor(size / 10.24) / 100} KB`;
            default: return `${Math.floor(size / 10485.76) / 100} MB`;
        }
    }

    public permissions(permissions: number, format: string): string {
        const numeric = (permissions & parseInt('777', 8)).toString(8);

        return format === 'numbers'
            ? numeric
            : this.permissionToChars(parseInt(numeric[0]))
                + this.permissionToChars(parseInt(numeric[1]))
                + this.permissionToChars(parseInt(numeric[2]));
    }

    private permissionToChars(permission: number): string {
        const binary = permission.toString(2);

        // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
        return (binary[0] === '1' ? 'r' : '-')
            + (binary[1] === '1' ? 'w' : '-')
            + (binary[2] === '1' ? 'x' : '-');
    }
}
