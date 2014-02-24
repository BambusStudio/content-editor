"use strict";

var editor = document.getElementById('editor');

function createCol(size) {
    var col = document.createElement('div'),
        colContent = document.createElement('div'),
        colRemove = document.createElement('div'),
        colResize = document.createElement('div');
    col.className = 'editor-column';
    colContent.className = 'column-content';
    colContent.setAttribute('contenteditable', 'true');
    colRemove.className = 'column-remove';
    colResize.className = 'column-resize';
    colContent.innerHTML = Math.round(Math.random() * 10);
    col.appendChild(colContent);
    col.appendChild(colResize);
    col.appendChild(colRemove);
    return col;
}

function initColumns(row) {
    var col = new Sortable(row, {
        group: 'column',
        draggable: ".editor-column",
        ghostClass: "sortable-ghost"
    });
}

function createRow() {
    var row = document.createElement('div'),
        rowHandle = document.createElement('div'),
        rowAdd = document.createElement('div'),
        rowRemove = document.createElement('div');
    row.className = 'editor-row';
    rowHandle.className = 'row-handle';
    rowAdd.className = 'column-add';
    rowRemove.className = 'row-remove';
    row.appendChild(rowHandle);
    row.appendChild(createCol());
    row.appendChild(rowAdd);
    row.appendChild(rowRemove);
    initColumns(row);
    return row;
}

//  add listners
editor.addEventListener('click', function (event) {
    //add Row;
    var col;
    if (event.target.classList.contains('row-add')) {
        event.target.parentElement.insertBefore(createRow(), event.target);
    }
    // remove Col;
    if (event.target.classList.contains('row-remove')) {
        col = event.target.parentElement;
        col.parentElement.removeChild(col);
    }
    // add Col;
    if (event.target.classList.contains('column-add')) {
        event.target.parentElement.insertBefore(createCol(), event.target);
    }
    // remove Col;
    if (event.target.classList.contains('column-remove')) {
        col = event.target.parentElement;
        col.parentElement.removeChild(col);
    }
}, false);
//column resize
editor.addEventListener('mousedown', function (event) {
    // resize target;
    var target = event.target.parentElement;
    if (event.target.classList.contains('column-resize')) {
        var startPoint = event.clientX,
            step = editor.querySelector('.editor-row').clientWidth / 12,
            startWidth = Number(target.dataset.size || 1),
            rigthSide = target.getClientRects()[0].right,
            resizer = function (event) {
                //return with limited to inverted size of targetso it can't be scaled in negaivesize.
                //Set step to 50px
                var additinalSize = Math.max(startWidth * -1, Math.round((event.clientX - rigthSide) / step));
                target.dataset.size = Math.max(1, startWidth + additinalSize);

            },
            stopResizer = function (event) {
                window.removeEventListener('mousemove', resizer, false);
                window.removeEventListener('mousemove', stopResizer, false);
            };
        window.addEventListener('mousemove', resizer, false);
        window.addEventListener('mouseup', stopResizer, false);
        event.stopImmediatePropagation();
        event.preventDefault();
    }
}, false);

//init rows;
var rows = new Sortable(editor, {
    group: "rows",
    handle: ".row-handle",
    draggable: ".editor-row",
    ghostClass: "sortable-ghost"
});



function serialize() {
    var rows = editor.querySelectorAll('.editor-row'),
        contentSerialized = [];
    [].forEach.call(rows, function (row) {
        var rowSerialized = [];
        [].forEach.call(row.querySelectorAll('.editor-column'), function (col) {
            var columnSerialized = {
                content: col.getElementsByClassName('column-content')[0].innerHTML,
                size: window.getComputedStyle(col).width
            };
            rowSerialized.push(columnSerialized);
        });
        contentSerialized.push(rowSerialized);
    });
    document.getElementById('console').innerHTML = contentSerialized;
}
