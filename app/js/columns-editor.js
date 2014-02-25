"use strict";
var Editor = function(el){
    this.el = el;
    this.colMinSize = 1;
    this.currentBreakpoint = 'large';
    this.editorSettings={
        uiColor: '#9AB8F3'
    }
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
        this.el.addEventListener('mousedown', function (event) {
            // resize target;
            var target = event.target.parentElement;
            if (event.target.classList.contains('column-content')  ) {
                //event.preventDefault();
                event.stopImmediatePropagation();
            }
            if (event.target.classList.contains('column-resize')) {
                var startPoint = event.clientX,
                    step = this.el.querySelector('.editor-row').clientWidth / 12,
                    startWidth = Number(target.dataset[this.currentBreakpoint] || 1),
                    rigthSide = target.getClientRects()[0].right,
                    resizer = function (event) {
                        //return with limited to inverted size of targetso it can't be scaled in negaivesize.
                        //Set step to 50px
                        var additinalSize = Math.max(startWidth * -1, Math.round((event.clientX - rigthSide) / step));
                        console.log()
                        target.dataset[this.currentBreakpoint] = Math.max(1, startWidth + additinalSize);

                    }.bind(this),
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
            colHandle = document.createElement('div'),
            colRemove = document.createElement('div'),
            colResize = document.createElement('div'),
            data = data||{size:this.colMinSize,content:'<p></p>'};
        col.className = 'editor-column';
        col.dataset.large = data.large||1;
        col.dataset.medium = data.medium||1;
        col.dataset.small = data.small||1;

        colContent.className = 'column-content';
        colContent.setAttribute('contenteditable', 'true');
        colContent.innerHTML = data.content;
        CKEDITOR.inline(colContent,this.editorSettings);
        col.addEventListener('dragend',function(){
            this.removeAttribute('draggable')
        },false)

        colHandle.className = 'column-handle';
        colRemove.className = 'column-remove';
        colResize.className = 'column-resize';

        col.appendChild(colHandle);
        col.appendChild(colContent);
        col.appendChild(colResize);
        col.appendChild(colRemove);


        return col;
    },
    initColumns: function(row) {
        return new Sortable(row, { 
            group: 'column',
            handle: '.column-handle',
            draggable: ".editor-column",
            ghostClass: "sortable-ghost"
            
        });
    },
    createRow: function (data) {
        var row = document.createElement('div'),
            rowHandle = document.createElement('div'),
            rowAdd = document.createElement('div'),
            rowRemove = document.createElement('div'),
            rowCollapse = document.createElement('input');
        
        row.className = 'editor-row';
        rowHandle.className = 'row-handle';
        rowAdd.className = 'column-add';
        rowRemove.className = 'row-remove';
        
        rowCollapse.setAttribute('type','checkbox');
        rowCollapse.value=1;
        if(data&&data.collapsed){
            rowCollapse.setAttribute('checked','checked');    
        }
        row.appendChild(rowCollapse);
        row.appendChild(rowHandle);
        if(data){//build few columns from JSON
            [].forEach.call(data.columns,function(column){
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
    serialize: function(json) {
        var contentSerialized = [];
        [].forEach.call(this.el.querySelectorAll('.editor-row'), function (row) {
            var rowSerialized = {
                collapsed:row.querySelector('input').checked,
                columns:[]
            };
            [].forEach.call(row.querySelectorAll('.editor-column'), function (col) {
                var columnSerialized = {
                    content: col.getElementsByClassName('column-content')[0].innerHTML,
                    large: col.dataset.large||1,
                    medium: col.dataset.medium||col.dataset.large||1,
                    small: col.dataset.small||col.dataset.medium||col.dataset.large||1
                };
                rowSerialized.columns.push(columnSerialized);
            });
            contentSerialized.push(rowSerialized);
        });
        if(json){
           return contentSerialized;  
        }else{
            document.getElementById('console').value = JSON.stringify(contentSerialized);
        }
    },
    buildFromSerialized:function(data){
        [].forEach.call(JSON.parse(data), function (row) {
            this.createRow(row);
        }.bind(this));
    },
    renderTo:function(target){
        var html='';
        
        [].forEach.call(this.serialize(true), function (row) {
            html+='<div class="row '+((row.collapsed)?'collapse':'')+'">';
            [].forEach.call(row.columns, function (column) {
                html +='<div class="columns'
                     +((column.large)?' large-'+column.size:'')
                     +((column.medium)?' medium-'+column.medium:'')
                     +((column.small)?' small-'+column.small:'')
                     +'">';
                html+=column.content;
                html+='</div>';
            }.bind(this));
            html+='</div>';
        }.bind(this));
        target.innerHTML =html;
    },
    changeBreakpoint:function(breakpoint){
        this.currentBreakpoint=breakpoint;
        this.el.classList.remove('break-small','break-medium','break-large')    
        this.el.classList.add('break-'+breakpoint);
    },
}

var editor = new Editor(document.getElementById('editor'));






