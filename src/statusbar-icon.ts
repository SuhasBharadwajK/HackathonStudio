import * as vscode from 'vscode';
import { StatusBarAlignment, window, Disposable } from 'vscode';
import { DesignViewStatus } from './status';

export class StatusBarIconController {
    private _designerViewButton = vscode.window.createStatusBarItem(StatusBarAlignment.Left);
    private _codeViewButton = vscode.window.createStatusBarItem(StatusBarAlignment.Left);
    private _disposable: Disposable;

    constructor() {
        let subscriptions: Disposable[] = [];
        window.onDidChangeActiveTextEditor(this.openDesignerView, this, subscriptions);
        window.onDidChangeActiveTextEditor(this.openCodeView, this, subscriptions);
        this._disposable = Disposable.from(...subscriptions);

        this.openDesignerView();
    }

    public openDesignerView() {
        let editor = vscode.window.activeTextEditor;
        this._designerViewButton.hide();
        if (!editor) {
            return;
        }

        let doc = editor.document;

        // Only update status if the current file is an HTML or a Razor(.cstml) file
        if (!DesignViewStatus.isDesignViewActive && (doc.languageId === "html" || doc.languageId === "razor")) {

            // Update the status bar
            this._designerViewButton.text = `$(paintcan) Open Design View`;
            this._designerViewButton.command = 'kekastudio.openDesignView';
            this._designerViewButton.tooltip = 'Click here to open the HTML design view.';
            this._designerViewButton.show();
        }
    }

    public openCodeView() {
        this._codeViewButton.hide();
        if (DesignViewStatus.isDesignViewActive && !vscode.window.activeTextEditor) {
            this._codeViewButton.text = `$(gist) Open Code View`;
            this._codeViewButton.command = 'kekastudio.openCodeView';
            this._codeViewButton.tooltip = 'Click here to open the HTML code view.';
            this._codeViewButton.show();
        }
    }

    dispose() {
        this._designerViewButton.dispose();
        this._disposable.dispose();
    }
}