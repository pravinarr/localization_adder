import * as vscode from 'vscode';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

let arbPath: string | undefined;
let cachedArbPath: string | undefined;

export function activate(context: vscode.ExtensionContext) {

	const l10nPathKey = 'ARBPath';

	try {
		// Check if the ArbPath is already cached
		if (context.workspaceState.get(l10nPathKey)) {
			// Use the cached path if it is valid
			cachedArbPath = context.workspaceState.get(l10nPathKey);
			if (fs.existsSync(cachedArbPath!)) {
				arbPath = cachedArbPath;
			}
		}

		// If the cached path is not valid, prompt the user to select the l10n.yaml file
		if (!arbPath) {
			vscode.window.showOpenDialog({
				canSelectFiles: true,
				canSelectFolders: false,
				canSelectMany: false,
				filters: {
					'arbFiles': ['arb']
				}
			}).then(fileUri => {
				if (fileUri && fileUri[0]) {
					// Cache the selected path
					arbPath = fileUri[0].fsPath;
					context.workspaceState.update(l10nPathKey, arbPath);
				}
			});
		}

		let disposable = vscode.commands.registerCommand('localization-adder.addLocalization', () => {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				const selection = editor.selection;
				var selectedText = editor.document.getText(selection);
				vscode.window.showInputBox({ prompt: 'Enter the key for the selected text' }).then((key) => {
					if (key) {
						selectedText = selectedText.trim();
						const unquotedText = selectedText.replace(/^['"]\s*(.*?)\s*['"]$/, '$1');
						const arbContents = fs.readFileSync(arbPath!, 'utf8');
                        const arbJson = JSON.parse(arbContents);
                        arbJson[key] = unquotedText;
                        fs.writeFileSync(arbPath!, JSON.stringify(arbJson, null, 2));
						editor.edit((editBuilder) => {
							editBuilder.replace(selection, `AppLocalization.of(context).${key}`);
						});

						// Run flutter pub get
						vscode.commands.executeCommand('flutter.packages.get');
					}
				});
			}
		});

		context.subscriptions.push(disposable);
	} catch (error) {
		vscode.window.showErrorMessage(`An error occurred: ${error}`);
	}
}

export function deactivate() { }