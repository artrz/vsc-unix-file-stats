import * as vscode from 'vscode';
import FsCommands from './FsCommands';
import StatsBar from './StatsBar';

let statsBar: StatsBar;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const fsCommands = new FsCommands();

    statsBar = new StatsBar();
    statsBar.update(vscode.window.activeTextEditor);

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('"unix-file-stats" is now active.');

    let changePermissionsCommand = vscode.commands.registerCommand('unix-file-stats.changePermissions', async () => {
        if (await fsCommands.changePermissions()) {
            statsBar.update(vscode.window.activeTextEditor);
            vscode.commands.executeCommand('workbench.action.focusFirstEditorGroup');
        }
    });

    const d1 = vscode.window.onDidChangeActiveTextEditor((textEditor: vscode.TextEditor | undefined) => statsBar.update(textEditor));
    const d3 = vscode.workspace.onDidSaveTextDocument(() => statsBar.update(vscode.window.activeTextEditor));
    const d2 = vscode.workspace.onDidChangeConfiguration(() => {
        statsBar.rebuild();
        statsBar.update(vscode.window.activeTextEditor);
    });

    context.subscriptions.push(statsBar, d1, d2, d3, changePermissionsCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {
    statsBar.dispose();
}
