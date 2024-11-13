import * as vscode from 'vscode';
import { access, constants, statSync } from 'fs';
import Formatter from './Formatter';
import config from './config';

export default class implements vscode.Disposable {
    private formatter: Formatter;
    private permissions: vscode.StatusBarItem | undefined;
    private size: vscode.StatusBarItem | undefined;

    public constructor() {
        this.formatter = new Formatter();
        this.build();
    }

    public update(textEditor: vscode.TextEditor | undefined): void {
        let stats = null;
        let filePath = null;
        if (textEditor) {
            filePath = textEditor.document.fileName;
            try {
                stats = statSync(filePath);
            }
            catch {
                // may happen when focusing an output window
                console.log(`Unable to get stats for file on path [${filePath}]`);
            }
        }

        if (filePath && stats) {
            if (this.size) {
                this.size.text = this.formatter.size(stats.size);
            }

            if (this.permissions) {
                this.permissions.text = this.formatter.permissions(
                    stats.mode,
                    config<string>('permissions.format', ''),
                );
            }

            if (config<boolean>('permissions.warnReadonly', true)) {
                access(filePath, constants.W_OK, (err) => {
                    if (this.permissions) {
                        this.permissions.backgroundColor = err
                            ? new vscode.ThemeColor('statusBarItem.warningBackground')
                            : undefined;
                    }
                });
            }
        }
        else {
            if (this.size) {
                this.size.text = '';
            }
            if (this.permissions) {
                this.permissions.text = '';
            }
        }
    }

    public build(): void {
        if (config<boolean>('permissions.enabled', true)) {
            this.permissions = this.createPermissionsItem();
        }
        if (config<boolean>('size.enabled', true)) {
            this.size = this.createSizeItem();
        }
    }

    private createPermissionsItem(): vscode.StatusBarItem {
        const item = this.createItem(
            config<string>('permissions.position', 'right'),
            config<number>('permissions.priority', 0),
        );

        item.tooltip = 'Change permissions';
        item.command = 'unix-file-stats.changePermissions';

        return item;
    }

    private createSizeItem(): vscode.StatusBarItem {
        const item = this.createItem(
            config<string>('size.position', 'right'),
            config<number>('size.priority', 0),
        );

        return item;
    }

    private createItem(position: string, priority: number): vscode.StatusBarItem {
        const alignment = position === 'left'
            ? vscode.StatusBarAlignment.Left
            : vscode.StatusBarAlignment.Right;

        const barItem = vscode.window.createStatusBarItem(alignment, priority);

        barItem.show();

        return barItem;
    }

    public rebuild(): void {
        this.dispose();
        this.build();
    }

    public dispose(): void {
        if (this.size) {
            this.size.dispose();
        }

        if (this.permissions) {
            this.permissions.dispose();
        }

        this.size = undefined;
        this.permissions = undefined;
    }
}
