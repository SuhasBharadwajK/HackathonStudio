import * as vscode from 'vscode';
import * as path from 'path';
import * as jsdom from 'jsdom';

import { DesignViewStatus } from './status';

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
            retainContextWhenHidden: true,

            localResourceRoots: [
                vscode.Uri.file(path.join(this._extensionPath, 'designer'))
            ]
        });

        this.initializeDesignerContent();

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._panel.onDidChangeViewState(e => {
            if (this._panel.visible) {
                this.initializeDesignerContent();
            }
        }, null, this._disposables);
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
            console.log(DesignView.currentDesignView._panel);
        }
    }

    public dispose() {
        DesignView.currentDesignView = undefined;
        DesignView.currentDocument = undefined;
        DesignViewStatus.isDesignViewActive = false;

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

    public initializeDesignerContent() {
        var editor = vscode.window.activeTextEditor;
        if (editor) {
            var fileName = this.getFileName(editor.document.fileName);
            var isFileOpenWithSameName = vscode.window.visibleTextEditors.filter(e => this.getFileName(e.document.fileName) === fileName).length > 1;
            if (isFileOpenWithSameName) {
                fileName = this.getFileNameWithDirectory(editor.document.fileName);
            }

            this._panel.title = "Design " + fileName;
            this._panel.webview.html = this.getHtmlForWebView();
        }
    }

    private getHtmlForWebView() {
        let editor = vscode.window.activeTextEditor;
        const { JSDOM } = jsdom;
        var html; 
        if (editor) {
            const dom = new JSDOM(editor.document.getText());
            const $ = (require('jquery'))(dom.window);
            html = $('body').html();
            console.log(html);
        }

        const bootstrapPath = vscode.Uri.file(path.join(this._extensionPath, 'designer/css/vendor', 'bootstrap.min.css')).with({ scheme: 'vscode-resource' });
        const iconicPath = vscode.Uri.file(path.join(this._extensionPath, 'designer/css/vendor/iconic/css', 'open-iconic.min.css')).with({ scheme: 'vscode-resource' });
        const appStylesPath = vscode.Uri.file(path.join(this._extensionPath, 'designer/css', 'master.css')).with({ scheme: 'vscode-resource' });
        const jqueryPath = vscode.Uri.file(path.join(this._extensionPath, 'designer/scripts/vendor', 'jquery-3.3.1.min.js')).with({ scheme: 'vscode-resource' });
        const jqueryUIPath = vscode.Uri.file(path.join(this._extensionPath, 'designer/scripts/vendor', 'jquery-ui.min.js')).with({ scheme: 'vscode-resource' });
        const angularPath = vscode.Uri.file(path.join(this._extensionPath, 'designer/scripts/vendor', 'angular.min.js')).with({ scheme: 'vscode-resource' });
        const angularSanitizePath = vscode.Uri.file(path.join(this._extensionPath, 'designer/scripts/vendor', 'angular-sanitize.min.js')).with({ scheme: 'vscode-resource' });
        const appScriptPath = vscode.Uri.file(path.join(this._extensionPath, 'designer/scripts', 'app.js')).with({ scheme: 'vscode-resource' });
        const directivesScriptPath = vscode.Uri.file(path.join(this._extensionPath, 'designer/scripts', 'directives.js')).with({ scheme: 'vscode-resource' });

        return `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <link rel="stylesheet" href="${bootstrapPath}" nonce="${this.getNonce()}">
            <link href="${iconicPath}" rel="stylesheet" nonce="${this.getNonce()}">
            <link rel="stylesheet" href="${appStylesPath}" nonce="${this.getNonce()}">
            <script src="${jqueryPath}" nonce="${this.getNonce()}"></script>
            <script src="${jqueryUIPath}" nonce="${this.getNonce()}"></script>
            <script src="${angularPath}" nonce="${this.getNonce()}"></script>
            <script src="${angularSanitizePath}" nonce="${this.getNonce()}"></script>
            <script src="${appScriptPath}" nonce="${this.getNonce()}"></script>
            <script src="${directivesScriptPath}" nonce="${this.getNonce()}"></script>
            <title>Drag N Drop</title>
        </head>
        
        <body ng-app="dragNdrop">
            <div class="main-container" ng-controller="DragNDropController">
                <div class="draggables-container float-left top-margin">
                    <!-- <div class="draggable bottom-margin" ng-repeat="draggable in draggables" 
                        data-drag="true" data-jqyoui-options="{index: {{$index}}, revert: 'invalid', helper: 'clone'}" 
                        jqyoui-draggable="{animate:true}" ng-model="draggable" ng-show="draggable.name" ng-bind-html="trustAsHtml(draggable.html)">
                    </div> -->
                    <div class="draggable bottom-margin" ng-repeat="draggable in draggables" index="{{$index}}" draggable>{{draggable.name}}</div>
        
                    <div class="col-sm-12 p-0 mt-3">
                        <button class="btn btn-primary mr-4 float-left" ng-click="saveToDom()">Save</button>
                        <button class="btn btn-success mr-4 float-right" ng-click="showPreview()" data-ng-if="!isPrviewActive">Show Preview</button>
                        <button class="btn btn-success mr-4 float-right" ng-click="showPreview()" data-ng-if="isPrviewActive">Hide Preview</button>
                    </div>
                </div>
                <!-- <div class="droppings-container dropzone float-left" ng-model="droppings" jqyoui-droppable="{multiple:true, onDrop: 'dropped'}">
                </div> -->
                <div class="source-html" style="display: none;">${html}</div>
                <div class="droppings-container editor-window dropzone float-left" dropzone source="draggables" sortable data-ng-show="!isPrviewActive">
                    <div class="html-source-container"><div class="html-source">${html}</div></div>
                </div>
                <div class="droppings-container float-left" data-ng-if="isPrviewActive" preview></div>
            </div>
        </body>
        </html>`;
    }

    private getFileName(pathToFile: string) {
        var fileNameComponents = pathToFile.split('\\');
        return fileNameComponents[fileNameComponents.length - 1];
    }

    private getFileNameWithDirectory(pathToFile: string) {
        var fileNameComponents = pathToFile.split('\\');
        return fileNameComponents.splice(fileNameComponents.length - 2, 2).join('\\');
    }

    
    private getNonce() {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}