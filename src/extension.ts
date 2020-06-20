
import * as vscode from 'vscode';
import { promisify } from 'util';
import { realpath, stat, readdir, readFileSync } from 'fs';

enum token { invalid, eof, entity, architecture, of, package, body, configuration, library, use, identifier };
class parser
{
    private current_token: token = token.invalid;
    private current_text: string = "";
    private current_line: number = 0;

    private _position: number;
    private _lineno: number;

    constructor(public file: string, public _input: string, public _size: number)
    {
        this._position = 0;
        this._lineno = 0;
    }

    public lex(): token
    {
        // skip any spaces
        while (this._input[this._position] == ' ' && this._position < this._size)
            this._position++;

        while (this._position < this._size)
        {
            switch(this._input[this._position]) {
            case ' ':
                this._position++;
                break;
            case '\r':
                if (this._input[this._position+1] == '\n')
                    this._position = this._position + 2;
                else
                    this._position++;
                this._lineno++;
                continue;
            case '\n':
                this._position++;
                this._lineno++;
                continue;
            case '-':
                if (this._input[this._position+1] == '-')
                {
                    this._position = this._position + 2;
                    while (this._position < this._size)
                    {
                        if (this._input[this._position] == '\r' || this._input[this._position] == '\n')
                            break;
                        this._position++;
                    }
                    continue;
                }
                else
                {
                    this._position++;
                }
                break;
            case '"':
                this._position++;
                this.scan_string();
                break;
            case 'A': case 'a':
            case 'B': case 'b':
            case 'C': case 'c':
            case 'D': case 'd':
            case 'E': case 'e':
            case 'F': case 'f':
            case 'G': case 'g':
            case 'H': case 'h':
            case 'I': case 'i':
            case 'J': case 'j':
            case 'K': case 'k':
            case 'L': case 'l':
            case 'M': case 'm':
            case 'N': case 'n':
            case 'O': case 'o':
            case 'P': case 'p':
            case 'Q': case 'q':
            case 'R': case 'r':
            case 'S': case 's':
            case 'T': case 't':
            case 'U': case 'u':
            case 'V': case 'v':
            case 'W': case 'w':
            case 'X': case 'x':
            case 'Y': case 'y':
            case 'Z': case 'z':
                this.scan_identifier_or_keyword();
                return this.current_token;
            default:
                this._position++;
                break;
                
            }
        }

        if (this._position >= this._size)
            this.current_token = token.eof;
        else
            this.current_token = token.invalid;

        return this.current_token;
    }

    private scan_string(): void
    {
        while (true) {
            if (this._position <= this._size)
                return;

            switch(this._input[this._position]) {
            case '"':
                this._position++;
                return;
            default:
                this._position++;
                break;
            }
        }
    }

    private scan_identifier_or_keyword(): void
    {
        this.current_line = this._lineno;
        let text: string = "";
        while (true) {
            if (this._position >= this._size)
                return;

            switch(this._input[this._position]) {
            case 'A': case 'a': case '0':
            case 'B': case 'b': case '1':
            case 'C': case 'c': case '2':
            case 'D': case 'd': case '3':
            case 'E': case 'e': case '4':
            case 'F': case 'f': case '5':
            case 'G': case 'g': case '6':
            case 'H': case 'h': case '7':
            case 'I': case 'i': case '8':
            case 'J': case 'j': case '9':
            case 'K': case 'k':
            case 'L': case 'l':
            case 'M': case 'm':
            case 'N': case 'n':
            case 'O': case 'o':
            case 'P': case 'p':
            case 'Q': case 'q':
            case 'R': case 'r':
            case 'S': case 's':
            case 'T': case 't':
            case 'U': case 'u':
            case 'V': case 'v':
            case 'W': case 'w':
            case 'X': case 'x':
            case 'Y': case 'y':
            case 'Z': case 'z': case '_':
                text += this._input[this._position++];
                break;
            default:
                if (text.match(/entity/i) !== null)
                    this.current_token = token.entity;
                else if (text.match(/architecture/i) !== null)
                    this.current_token = token.architecture;
                else if (text.match(/of/i) !== null)
                    this.current_token = token.of;
                else if (text.match(/package/i) !== null)
                    this.current_token = token.package;
                else if (text.match(/body/i) !== null)
                    this.current_token = token.body;
                else if (text.match(/configuration/i) !== null)
                    this.current_token = token.configuration;
                else if (text.match(/library/i) !== null)
                    this.current_token = token.library;
                else if (text.match(/use/i) !== null)
                    this.current_token = token.use;
                else
                    this.current_token = token.identifier;
                    this.current_text = text;
                return;
            }
        }
    }

    public parse(): void
    {
        while (this.current_token != token.eof)
        {
            switch (this.lex()) {
            case token.entity:
                if (this.lex() != token.identifier)
                    break;
                let en = this.current_text;

                console.log(`entity ${en}`);
                break;
            case token.architecture:
                if (this.lex() != token.identifier)
                    break;
                let an = this.current_text;
                if (this.lex() != token.of)
                    break;
                if (this.lex() != token.identifier)
                    break;
                let ae = this.current_text;
                console.log(`architecteur ${an} of ${ae}`);
                break;
            case token.package:
                let tk = this.lex();
                if (tk == token.body)
                {
                    if (this.lex() != token.identifier)
                        break;
                    let pb = this.current_text;
                    console.log(`packge body ${pb}`);
                }
                else
                {
                    if (tk != token.identifier)
                        break;
                    let pn = this.current_text;
                    console.log(`package ${pn}`);
                }
                break;
            case token.configuration:
                if (this.lex() != token.identifier)
                    break;
                    let cn = this.current_text;
                    if (this.lex() != token.of)
                    break;
                if (this.lex() != token.identifier)
                    break;
                    let ca = this.current_text;
                    console.log(`configuration ${cn} of ${ca}`);
                
                break;
            case token.library:
            case token.use:
                break;
            default:
                break;
            }

        }
    }
}

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
        console.log("found " + f.size + "vhdl files")
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

        let p = new parser(file, txt, txt.length);
        p.parse();

        console.log('Reading through '+ file);
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
