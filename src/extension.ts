
import * as vscode from 'vscode';
import { promisify } from 'util';
import { realpath, stat, readdir, readFileSync } from 'fs';

class vhdl_indexer
{
	private files: string[] = [];
	constructor(public directories: string[]) {}

	async index(): Promise<void>
	{
		let f = new Set<string>();
		await Promise.all(this.directories.map(async (directory) => {
			const files = await this.get_files_from(directory, '\.vhdl?$');
			return (await Promise.all(files.map(file => promisify(realpath)(file)))).forEach(file => f.add(file));
		}))

		for (const _f of f)
		{
			this.skim_through(_f);
			this.files.push(_f);
		}
	}

	private async get_files_from(directory: string, filter: string): Promise<string[]>
	{
		const result: string[] = [];
		const entries = await promisify(readdir)(directory);

		await Promise.all(entries.map(async entry => {
			try
			{
				const path = directory + '/' + entry;
				const file = await promisify(stat)(path);
				if (file.isFile())
				{
					if (entry.match(filter))
					{
						result.push(path);
					}
				}
				else
				{
					result.push(... await this.get_files_from(path, filter));
				}
			}
			catch (e)
			{
				console.log(e);
			}
		}));
		return result;
	}

	private skim_through(file: string): void
	{
		const txt = readFileSync(file, { encoding: 'utf8' });
		if (!txt)
			return;

		console.log('Skimming through '+ file);
	}
}

export function activate(context: vscode.ExtensionContext)
{
	let indexer: vhdl_indexer;
	console.log('Activate find-vhdl-entities');

	let d1 = vscode.commands.registerCommand('find-vhdl-entities.index', async () => {
		const f = vscode.workspace.workspaceFolders;
        const folders = (f ?? []).map(_f => _f.uri.fsPath);
		indexer = new vhdl_indexer(folders);
		await indexer.index();

		vscode.window.showInformationMessage('Indexing');
	});
	context.subscriptions.push(d1);

	let d2 = vscode.commands.registerCommand('find-vhdl-entities.findDesignUnit', () => {
		vscode.window.showInformationMessage('Find design unit');
	});
	context.subscriptions.push(d2);


}

// this method is called when your extension is deactivated
export function deactivate()
{
	console.log('Deactivate find-vhdl-entities');
}
