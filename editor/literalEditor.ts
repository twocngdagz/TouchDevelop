///<reference path='refs.ts'/>

module TDev
{
    export class LiteralEditor {       
        public constructor(public calculator : Calculator, public literal: AST.Literal) { }

        public editor(): HTMLElement { return Util.abstract(); }
        public value(): string { return Util.abstract();}
    }

    export class TextLiteralEditor extends LiteralEditor {
        private res: HTML.AutoExpandingTextArea;
        constructor(public calculator: Calculator, public literal: AST.Literal) {
            super(calculator, literal);

            var opts: HTML.AutoExpandingTextAreaOptions = { showDismiss: true };
            if (Browser.isDesktop && TheEditor.widgetEnabled("stringEditFullScreen"))
                opts.editFullScreenAsync = (t) => EditorHost.editFullScreenAsync(
                    literal.languageHint ? 'inline.' + literal.languageHint : '', t);
            this.res = HTML.mkAutoExpandingTextArea(opts)
            this.res.div.className += " calcStringEdit";
            this.res.textarea.value = literal.data;
            this.res.div.id = "stringEdit";

            this.res.dismiss.id = "inlineEditCloseBtn";
            this.res.onDismiss = () => this.calculator.checkNextDisplay();

            (<any>this.res.div).focusEditor = () => {
                this.res.update();
                Util.setKeyboardFocusTextArea(this.res.textarea);
            };

            this.res.onUpdate = () => {
                TheEditor.selector.positionButtonRows();
            };
        }

        public editor(): HTMLElement { return this.res.div; }
        public value(): string {
            return this.res.textarea.value;
        }
    }

    export class BitMatrixLiteralEditor extends LiteralEditor {
        private root: HTMLElement;
        private table: HTMLTableElement;
        private rows: number;
        private frames: number;
        private bitCells: HTMLElement[];

        constructor(public calculator: Calculator, public literal: AST.Literal) {
            super(calculator, literal);

            this.table = document.createElement('table');
            this.table.className = 'bitmatrix';
            this.table.withClick(() => { });
            var plusBtn = HTML.mkRoundButton("svg:add,black", "add frame", Ticks.noEvent,() => {
                var v = this.serialize(this.frames + 1);
                this.updateTable(v);
            });
            var minusBtn = HTML.mkRoundButton("svg:minus,black", "remove frame", Ticks.noEvent,() => {
                if (this.frames > 1) {
                    var v = this.serialize(this.frames - 1);
                    this.updateTable(v);
                }
            });
            this.root = div('bitmatrix', this.table, div('btns', plusBtn, minusBtn));
            
            this.updateTable(literal.data);
        }

        private updateTable(data: string) {
            function tr(parent: HTMLElement, cl: string) {
                var d = document.createElement('tr');
                d.className = cl;
                parent.appendChild(d);
                return d;
            }
            function td(parent: HTMLElement, cl: string) {
                var d = document.createElement('td');
                d.className = cl;
                parent.appendChild(d);
                return d;
            }

            var bits = (data || "").trim().split(/[\s\r\n]+/).map(s => parseInt(s));
            this.rows = bits.shift() || 5;
            this.frames = bits.shift() || 1;

            this.bitCells = [];
            this.table.innerHTML = ""; // clear table and rebuild
            var hrow = tr(this.table, 'bitheader');
            td(hrow, '');
            for (var j = 0; j < this.frames * this.rows; ++j) td(hrow, 'index').innerText = j.toString();

            // bit matrix
            Util.range(0, this.rows).forEach(i => {
                var row = tr(this.table, 'bitrow');
                td(row, 'index').innerText = i.toString();
                Util.range(0, this.frames * this.rows).forEach(j => {
                    var cell = td(row, 'bit');
                    cell.title = "(" + i + ", " + j + ")";
                    var k = i * this.frames * this.rows + j;
                    this.bitCells[k] = cell;
                    cell.setFlag('on', !!bits[k]);
                    cell.withClick(() => {
                        cell.setFlag('on', !cell.getFlag('on'));
                    });
                });
            });
        }

        public editor(): HTMLElement {
            return this.root;
        }

        private serialize(f: number): string {
            var r = this.rows + " " + f;
            for (var i = 0; i < this.rows; ++i) {
                r += "\n";
                for (var j = 0; j < f * this.rows; ++j) {
                    var k = i * this.rows * this.frames + j;
                    var s = j < this.rows * this.frames ? this.bitCells[k].getFlag("on") ? "1" : "0" : "0";
                    r += s + " ";
                }
            }
            return r;
        }

        public value(): string {
            return this.serialize(this.frames);
        }
    }
}


