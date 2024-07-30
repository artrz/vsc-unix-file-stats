import * as vscode from 'vscode';
import FsCommands from './FsCommands';
import StatsBar from './StatsBar';

let statsBar: StatsBar;

// Called when the extension is activated, which is the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const fsCommands = new FsCommands();

    statsBar = new StatsBar();
    statsBar.update(vscode.window.activeTextEditor);

    console.log('"unix-file-stats" is now active.');

    const changePermissionsCommand = vscode.commands.registerCommand('unix-file-stats.changePermissions', async () => {
        try {
            await fsCommands.changePermissions();
            statsBar.update(vscode.window.activeTextEditor);
            void vscode.commands.executeCommand('workbench.action.focusFirstEditorGroup');
        }
        catch (error) { /* empty */ }
    });

    const d1 = vscode.window.onDidChangeActiveTextEditor((textEditor: vscode.TextEditor | undefined) => { statsBar.update(textEditor); });
    const d3 = vscode.workspace.onDidSaveTextDocument(() => { statsBar.update(vscode.window.activeTextEditor); });
    const d2 = vscode.workspace.onDidChangeConfiguration(() => {
        statsBar.rebuild();
        statsBar.update(vscode.window.activeTextEditor);
    });

    context.subscriptions.push(statsBar, d1, d2, d3, changePermissionsCommand);
}

// This method is called when the extension is deactivated
export function deactivate() {
    statsBar.dispose();
}
