'use strict';

class TableTemplate {
    // constructor() { }
    static fillIn(id, dictionary, columnName) {
        // get the table
        // get every element in the table
        // for the first row, replace every element without {}
        // if no column is mentioned, replace all that matched, use existed function
        // for the mentioned column, replace this element without {}
        // TODO: for the one doesn't in?? replace with nothing?
        const table = document.getElementById(id);
        table.style.visibility = "visible";
        const tbody = table.tBodies[0];
        // replace the first row
        const first_tr = tbody.rows[0].cells;
        for (let i = 0; i < first_tr.length; i++) {
            const first_processor = new Cs142TemplateProcessor(first_tr[i].innerHTML);
            first_tr[i].innerHTML = first_processor.fillIn(dictionary);
        }
        // if column is not the argument
        if (columnName === undefined) {
            for (const row of tbody.rows) {
                for (const cell of row.cells) {
                    const template_processor = new Cs142TemplateProcessor(cell.innerHTML);
                    cell.innerHTML = template_processor.fillIn(dictionary);
                }
            }
        }
        
        // if column is in the argument, find the index
        let columnIndex = -1;
        for (let i = 0; i < first_tr.length; i++) {
            if (first_tr[i].innerHTML === columnName) {
                columnIndex = i;
            }
        }
        // if column matched
        if (columnIndex !== -1) {
            for (const row of tbody.rows) {
                const template_processor = 
                new Cs142TemplateProcessor(row.cells[columnIndex].innerHTML);
                row.cells[columnIndex].innerHTML = template_processor.fillIn(dictionary);
            }
        }
        // if colomn not matched, return
        // else {
        //     return;
        // }
    }
}

