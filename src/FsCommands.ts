import { InputBoxOptions, window, Uri } from 'vscode';
import { chmodSync, statSync } from 'fs';
import path from 'path';
import config from './config';
import permissionsParser from './permissionsParser';

import * as sudo from 'sudo-prompt';

export default class {
    public async changePermissions(selectedItems?: Uri[]): Promise<void> {
        const paths = [];

        if (selectedItems) {
            paths.push(...selectedItems
                .filter((resource) => statSync(resource.fsPath).isFile())
                .map((resource) => resource.fsPath));
        }
        else if (window.activeTextEditor) {
            paths.push(window.activeTextEditor.document.fileName);
        }
        else {
            return;
        }

        console.log('Selected files:');
        console.log(paths);

        const fileOnly = config<boolean>('hints.basenameOnly', true);
        const maxDisplayed = config<number>('hints.maxNames', 5);

        let selectionHint = '';
        if (paths.length === 1) {
            selectionHint = fileOnly ? path.basename(paths[0]) : paths[0];
        }
        else {
            const hints = fileOnly ? paths.map((x) => path.basename(x)) : [...paths];

            if (maxDisplayed < 1) {
                selectionHint = `${hints.length} selected files`;
            }
            else {
                selectionHint = hints.splice(0, maxDisplayed).join(', ');
                if (hints.length) { selectionHint += ` and ${hints.length} more`; }
            }
        }

        const mode = await this.requestNewPermissions(selectionHint);

        if (mode === undefined) {
            return;
        }

        for (const path of paths) {
            try {
                chmodSync(path, mode);
            }
            catch (e) {
                console.log(e);
                void this.retryAsSudo(path, mode);
            }
        }
    }

    private async requestNewPermissions(selectionHint: string): Promise<string | undefined> {
        const boxAttributes: InputBoxOptions = {
            placeHolder: 'E.g. 644 or rw-r--r--',
            title: `New permissions for ${selectionHint}`,
            prompt: '3 digits notation or 9 letters/dash notation',
        };

        const input = await window.showInputBox(boxAttributes);
        if (input) {
            const mode = permissionsParser(input);
            if (!mode) {
                void window.showErrorMessage(`Invalid permissions: ${input}`);
            }

            return mode;
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
