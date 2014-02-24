"use strict";
var Editor = function(el){
    this.el = el;
    this.colMinSize = 1;
    //init rows;
    this.rows = new Sortable(this.el, {
        group: "rows",
        handle: ".row-handle",
        draggable: ".editor-row",
        ghostClass: "sortable-ghost"
    });
    this.initHandlers();
}

Editor.prototype={
    initHandlers:function() {
        //  add listners
        this.el.addEventListener('click', function (event) {
            //add Row;
            var col;
            if (event.target.classList.contains('row-add')) {
               this.createRow();
            }
<<<<<<< HEAD
=======
            if (event.target.classList.contains('column-content') && !event.target.classList.contains('cke_editable')) {
                event.preventDefault();
                CKEDITOR.inline( event.target,{
                    toolbar: 'Basic',
                    uiColor: '#9AB8F3'
                });
                //CKEDITOR.replace(event.target);
            }
>>>>>>> c371778d8aaa59a7f01753a7a1d427dfeccd8223
            // remove Col;
            if (event.target.classList.contains('row-remove')) {
                col = event.target.parentElement;
                col.parentElement.removeChild(col);
            }
            // add Col;
            if (event.target.classList.contains('column-add')) {
                event.target.parentElement.insertBefore(this.createCol(), event.target);
            }
            // remove Col;
            if (event.target.classList.contains('column-remove')) {
                col = event.target.parentElement;
                col.parentElement.removeChild(col);
            }
        }.bind(this), false);
        //column resize
<<<<<<< HEAD

        this.el.addEventListener('mousedown', function (event) {
            // resize target;
            var target = event.target.parentElement;

            if (event.target.classList.contains('column-content')  ) {
                //event.preventDefault();
=======
        this.el.addEventListener('mousedown', function (event) {
            // resize target;
            var target = event.target.parentElement;

            if (event.target.classList.contains('column-content')  ) {
                event.preventDefault();
>>>>>>> c371778d8aaa59a7f01753a7a1d427dfeccd8223
                event.stopImmediatePropagation();
            }
            if (event.target.classList.contains('column-resize')) {
                var startPoint = event.clientX,
                    step = this.el.querySelector('.editor-row').clientWidth / 12,
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
        }.bind(this), false);
    },
    createCol:function(data) {
        var col = document.createElement('div'),
            colContent = document.createElement('div'),
<<<<<<< HEAD
            colMove = document.createElement('div'),
=======
>>>>>>> c371778d8aaa59a7f01753a7a1d427dfeccd8223
            colRemove = document.createElement('div'),
            colResize = document.createElement('div'),
            data = data||{size:this.colMinSize,content:'<p>text</p>'};
        col.className = 'editor-column';
        col.dataset.size = data.size;
<<<<<<< HEAD

        colContent.className = 'column-content';
        colContent.setAttribute('contenteditable', 'true');
        colContent.innerHTML = data.content;

        CKEDITOR.inline( colContent,{toolbar: 'Basic',uiColor: '#9AB8F3'});

        colMove.className = 'column-move';
        colRemove.className = 'column-remove';
        colResize.className = 'column-resize';

        col.appendChild(colMove);
        col.appendChild(colContent);
        col.appendChild(colResize);
        col.appendChild(colRemove);


=======
        colContent.className = 'column-content';
        colContent.setAttribute('contenteditable', 'true');
        colRemove.className = 'column-remove';
        colResize.className = 'column-resize';
        colContent.innerHTML = data.content;
        col.appendChild(colContent);
        col.appendChild(colResize);
        col.appendChild(colRemove);
>>>>>>> c371778d8aaa59a7f01753a7a1d427dfeccd8223
        return col;
    },
    initColumns: function(row) {
        return new Sortable(row, {
            group: 'column',
<<<<<<< HEAD
            handle: '.column-remove',
=======
>>>>>>> c371778d8aaa59a7f01753a7a1d427dfeccd8223
            draggable: ".editor-column",
            ghostClass: "sortable-ghost"
        });
    },
    createRow: function (data) {
        var row = document.createElement('div'),
            rowHandle = document.createElement('div'),
            rowAdd = document.createElement('div'),
            rowRemove = document.createElement('div');
        row.className = 'editor-row';
        rowHandle.className = 'row-handle';
        rowAdd.className = 'column-add';
        rowRemove.className = 'row-remove';
        row.appendChild(rowHandle);
        if(data){//build few columns from JSON
            [].forEach.call(data,function(column){
                row.appendChild(this.createCol(column));
            }.bind(this))
        }else{//build new column
            row.appendChild(this.createCol());
        }
        row.appendChild(rowAdd);
        row.appendChild(rowRemove);
        this.initColumns(row);
        this.el.insertBefore(row, this.el.getElementsByClassName('row-add')[0]);
    },
    serialize: function() {
        event.preventDefault();
        var rows = this.el.querySelectorAll('.editor-row'),
            contentSerialized = [];
        [].forEach.call(rows, function (row) {
            var rowSerialized = [];
            [].forEach.call(row.querySelectorAll('.editor-column'), function (col) {
                var columnSerialized = {
                    content: col.getElementsByClassName('column-content')[0].innerHTML,
                    size: col.dataset.size
                };
                rowSerialized.push(columnSerialized);
            });
            contentSerialized.push(rowSerialized);
        });
        document.getElementById('console').value = JSON.stringify(contentSerialized);
    },
    buildFromSerialized:function(_data){
        event.preventDefault();
        var data;

        try{data = JSON.parse(_data)}
        catch(error){console.error(error)}

        [].forEach.call(data, function (row) {
            console.log(row)
            this.createRow(row);
//            var rowSerialized = [];
//            [].forEach.call(row.querySelectorAll('.editor-column'), function (col) {
//                var columnSerialized = {
//                    content: col.getElementsByClassName('column-content')[0].innerHTML,
//                    size: col.dataset.size
//                };
//                rowSerialized.push(columnSerialized);
//            });
//            contentSerialized.push(rowSerialized);
        }.bind(this));
    }
}

var editor = new Editor(document.getElementById('editor'));












