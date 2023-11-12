import * as vscode from 'vscode';
import { access, constants, statSync } from 'fs';
import Formatter from './Formatter';

export default class implements vscode.Disposable {
    private config!: vscode.WorkspaceConfiguration;
    private formatter: Formatter;
    private permissions: vscode.StatusBarItem | undefined;
    private size: vscode.StatusBarItem | undefined;

    public constructor() {
        this.formatter = new Formatter();
        this.loadConfig();
        this.build();
    }

    public update(textEditor: vscode.TextEditor | undefined): void {
        let stats = null;
        let filePath = null;
        if (textEditor) {
            filePath = textEditor.document.fileName;
            try {
                stats = statSync(filePath);
            } catch (e) {
                // may happen when focusing an output window
                console.log(`Unable to get stats for file on path [${filePath}]`);
            }
        }

        if (filePath && stats) {
            this.size && (this.size.text = this.formatter.size(stats.size));

            if (this.permissions) {
                this.permissions.text = this.formatter.permissions(
                    stats.mode,
                    this.getConfig<string>('permissions.format', '')
                );
            }

            if (this.getConfig<boolean>('permissions.warnReadonly', true)) {
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
            this.size && (this.size.text = '');
            this.permissions && (this.permissions.text = '');
        }
    }

    public build(): void {
        if (this.getConfig<boolean>('permissions.enabled', true)) {
            this.permissions = this.createPermissionsItem();
        }
        if (this.getConfig<boolean>('size.enabled', true)) {
            this.size = this.createSizeItem();
        }
    }

    private createPermissionsItem(): vscode.StatusBarItem {
        const item = this.createItem(
            this.getConfig<string>('permissions.position', 'right'),
            this.getConfig<number>('permissions.priority', 0)
        );

        item.tooltip = 'Change permissions';
        item.command = 'unix-file-stats.changePermissions';

        return item;
    }

    private createSizeItem(): vscode.StatusBarItem {
        const item = this.createItem(
            this.getConfig<string>('size.position', 'right'),
            this.getConfig<number>('size.priority', 0)
        );

        return item;
    }

    private createItem(position: string, priority: number): vscode.StatusBarItem {
        const alignment = position === "left"
            ? vscode.StatusBarAlignment.Left
            : vscode.StatusBarAlignment.Right;

        const barItem = vscode.window.createStatusBarItem(alignment, priority);

        barItem.show();

        return barItem;
    }

    public rebuild(): void {
        this.dispose();
        this.loadConfig();
        this.build();
    }

    public dispose(): any {
        this.size && this.size.dispose();
        this.size = undefined;

        this.permissions && this.permissions.dispose();
        this.permissions = undefined;
    }

    private getConfig<T>(key: string, fallback: T): T {
        const value = this.config.get<T>(key);

        return value !== undefined ? value : fallback;
    }

    private loadConfig(): void {
        this.config = vscode.workspace.getConfiguration("fileStats");
    }
}
