import { workspace } from 'vscode';

export default function<T>(key: string, fallback: T): T {
    return workspace.getConfiguration('fileStats').get<T>(key) ?? fallback;
}
