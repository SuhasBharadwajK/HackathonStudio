import * as vscode from 'vscode';
import * as path from 'path';

export class DesignView {
    public static currentDesignView: DesignView | undefined;

    private static readonly viewType = 'htmlDesignView';
    private static currentDocument: vscode.TextDocument | undefined;

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionPath: string;
    private _disposables: vscode.Disposable[] = [];

    public static get isDesignerActive() {
        if (DesignView.currentDesignView) {
            return DesignView.currentDesignView._panel.visible;
        }

        return false;
    }

    private constructor(extensionPath: string, column: vscode.ViewColumn) {
        this._extensionPath = extensionPath;

        this._panel = vscode.window.createWebviewPanel(DesignView.viewType, "Design View", column, {
            // Enable javascript in the webview
            enableScripts: true,

            localResourceRoots: [
                vscode.Uri.file(path.join(this._extensionPath, 'media'))
            ]
        });

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }

    public static createOrShow(extensionPath: string) {
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

        // If we already have a panel, show it.
        // Otherwise, create a new panel.
        DesignView.currentDocument = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document : undefined;

        if (DesignView.currentDesignView) {
            DesignView.currentDesignView._panel.reveal(column);
        } else {
            DesignView.currentDesignView = new DesignView(extensionPath, column || vscode.ViewColumn.One);
        }

        this.initializeDesignerContent();
    }

    public dispose() {
        DesignView.currentDesignView = undefined;
        DesignView.currentDocument = undefined;

        // Clean up our resources
        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    public static getCurrentDocument() {
        return DesignView.currentDocument;
    }

    public static initializeDesignerContent(){
        var editor = vscode.window.activeTextEditor;
        if (editor) {
            var fileName = this.getFileName(editor.document.fileName);
            var isFileOpenWithSameName = vscode.window.visibleTextEditors.filter(e => this.getFileName(e.document.fileName) === fileName).length > 1;
            if (isFileOpenWithSameName) {
                fileName = this.getFileNameWithDirectory(editor.document.fileName);
            }

            (<DesignView>DesignView.currentDesignView)._panel.title = "Design " + fileName;
            (<DesignView>DesignView.currentDesignView)._panel.webview.html = editor.document.getText();
        }
    }

    private static getFileName(pathToFile: string) {
        var fileNameComponents = pathToFile.split('\\');
        return fileNameComponents[fileNameComponents.length - 1];
    }

    private static getFileNameWithDirectory(pathToFile: string) {
        var fileNameComponents = pathToFile.split('\\');
        return fileNameComponents.splice(fileNameComponents.length - 2, 2).join('\\');
    }
}