'use strict';
import * as vscode from 'vscode';
import { DesignView } from './design-view';
import { StatusBarIconController } from './statusbar-icon';
import { DesignViewStatus } from './status';

export function activate(context: vscode.ExtensionContext) {
    var iconController = new StatusBarIconController();

    context.subscriptions.push(vscode.commands.registerCommand('kekastudio.openDesignView', () => {
        DesignViewStatus.isDesignViewActive = true;
        DesignView.createOrShow(context.extensionPath);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('kekastudio.openCodeView', () => {
        DesignViewStatus.isDesignViewActive = false;
        var document = DesignView.getCurrentDocument();
        vscode.window.showTextDocument(<vscode.TextDocument>document);
    }));
    
    context.subscriptions.push(iconController);

    vscode.window.onDidChangeActiveTextEditor(onTabSelectEvent);
}

function onTabSelectEvent() {
    DesignViewStatus.isDesignViewActive = DesignView.isDesignerActive;
}

// this method is called when your extension is deactivated
export function deactivate() {
}