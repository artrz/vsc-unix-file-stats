import { InputBoxOptions, window } from 'vscode';
import { chmodSync } from 'fs';
import * as sudo from 'sudo-prompt';

const permissionsParser = (value: string): string | undefined => {
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
};

export default class {
    public async changePermissions(): Promise<boolean | undefined> {
        if (!window.activeTextEditor) {
            return undefined;
        }

        const path = window.activeTextEditor.document.fileName;
        const boxAttributes: InputBoxOptions = {
            placeHolder: 'E.g. 644 or rw-r--r--',
            title: `New permissions for ${path}`,
            prompt: '3 digits notation or 9 letters/dash notation',
        };

        const input = await window.showInputBox(boxAttributes);
        if (input === undefined) {
            return input;
        }

        const mode = permissionsParser(input);
        if (mode === undefined) {
            void window.showErrorMessage(`Invalid permissions: ${input}`);
            return false;
        }

        try {
            chmodSync(path, mode);

            return true;
        }
        catch (e) {
            console.log(e);

            return this.retryAsSudo(path, mode);
        }
    }

    private async retryAsSudo(path: string, mode: string): Promise<boolean> {
        const error = "Failed to modify '%s'. Not enough privileges.";
        const sel = await window.showErrorMessage(
            error.replace('%s', path),
            { sudo: true, title: 'Execute as Sudo...' },
            { sudo: false, title: 'Discard', isCloseAffordance: true },
        );

        if (!sel?.sudo) {
            return false;
        }

        return new Promise<boolean>((resolve, reject) => {
            const cmd = `chmod ${mode} ${path}`;
            const config = { name: 'Authentication' };

            sudo.exec(cmd, config, (error, stdout, stderr) => {
                if (error) {
                    void window.showErrorMessage(error.message);
                    reject(new Error(error.message));
                }
                else if (stderr) {
                    void window.showErrorMessage(stderr.toString());
                    reject(new Error(stderr.toString()));
                }
                else {
                    resolve(true);
                }
            });
        });
    }
}
