"use strict";

/*
    API
    
    #################################
    
    Create new editor instance:    
    
    <div id="holder"></div>
    
    <script>
        var new_editor = new ResponsiveEditor(document.getElementById('holder'));
    </script>
    
    ################################  
    
    Get serialized data, NOT prepared to save in DB:
    
    as STRING
    var data = new_editor.serialize();
    
    as JSON
    var data = new_editor.serialize(true);
    
    ################################
    
    Build editor from serialized data:
    
    var data = new_editor.serialize();
    new_editor.buildFromSerialized(data);
    
    ################################
    
<<<<<<< HEAD
    
    Render to html:
    
    new_editor.renderTo(document.getElementById('target'));
    
    ################################
    
=======
>>>>>>> 2cf9afd2f964cb761c0b9275b1412ac6c8c2f26c

*/


    


var ResponsiveEditor = function(el,data){
    //init editor
    this.initEditor(el); 
    this.initHandlers();
    if(data){
        this.buildFromSerialized(data)
    }else{
        this.createRow();    
    }
}
 
ResponsiveEditor.prototype={
    initEditor:function(holder){
        this.colMinSize = 1;
        this.colNumber=12;
        this.currentBreakpoint = 'large';
        
        var temp = document.createElement('div');
            temp.innerHTML='<div class="responsive-editor break-'+this.currentBreakpoint+'"><div class="row-add"></div></div>';
        
        this.el = temp.firstChild;
        holder.appendChild(this.el);
        
        {
//         var frame1 = document.createElement('iframe');
//        frame1.style.width="100%";
//        frame1.style.border="none";
//        
//        frame1.style.paddingTop="10px";
//        holder.appendChild(frame1);
//        
//        frame1.contentWindow.document.body.style.height='auto'
//        
//        frame1.contentWindow.document.body.innerHTML='<div id="editor" class="responsive-editor break-'+this.currentBreakpoint+'"><div class="row-add"></div></div><link rel="stylesheet" href="app/css/app.css">';
//        
//        setInterval(function () {
//            frame1.style.height = 200+(frame1.contentWindow.document.querySelector('#editor').scrollHeight)+ 'px';
//        },1000);
//        
//                
//        this.el = frame1.contentWindow.document.body.firstChild;
          }
        
        
        
        //init rows;
        this.rows = new Sortable(this.el, {
            group: "rows",
            handle: ".row-handle",
            draggable: ".editor-row",
            ghostClass: "sortable-ghost"
        });
    },
    initHandlers:function() {
        //  add listners
        this.el.addEventListener('click', function (event) {
            //add Row;
            var col,row;
            if (event.target.classList.contains('row-add')) {
               this.createRow();
            }
            // remove Row;
            if (event.target.classList.contains('row-remove')) {
                row = event.target.parentElement;
                row.parentElement.removeChild(row);
                 
            }
            // add Col;
            if (event.target.classList.contains('column-add')) {
                if(this.checkEqualColumns(event.target.parentElement)){//create equal columns
                    event.target.parentElement.insertBefore(this.createCol(), event.target); 
                    this.justifyColumns(event.target.parentElement);
                }else{//create simple column
                    event.target.parentElement.insertBefore(this.createCol({
                        small:this.colMinSize,
                        medium:this.colMinSize,
                        large:this.colMinSize,
                        content:'<p></p>'
                    }), event.target);    
                }
            }
            // remove Col;
            if (event.target.classList.contains('column-remove')) {
                col = event.target.parentElement;
                row = col.parentElement;
                if(col.parentElement.querySelectorAll('.editor-column').length==1){//last column - remove row
                    row.parentElement.removeChild(row);
                }else{
                    if(this.checkEqualColumns(row)){//remove equal columns
                        row.removeChild(col);
                        this.justifyColumns(row);
                    }else{// simple remove column
                        row.removeChild(col);  
                    }
                }
            }
        }.bind(this), false);
        
        //column resize
        this.el.addEventListener('mousedown', this.resizeColumn.bind(this), false);             

    },
    createCol:function(data) {
        var col = document.createElement('div'),
            colContent = document.createElement('div'),
            colHandle = document.createElement('div'),
            colRemove = document.createElement('div'),
            colResize = document.createElement('div'),
            data = data||{size:this.colMinSize,content:'<p></p>'};
        col.className = 'editor-column';
        col.dataset.large = data.large||12;
        col.dataset.medium = data.medium||12;
        col.dataset.small = data.small||12;

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
           return JSON.stringify(contentSerialized);
        }
    },
    buildFromSerialized:function(data){
        [].forEach.call(JSON.parse(data), function (row) {
            this.createRow(row);
        }.bind(this));
    },
    changeBreakpoint:function(breakpoint){
        this.currentBreakpoint=breakpoint;
        this.el.classList.remove('break-small','break-medium','break-large')    
        this.el.classList.add('break-'+breakpoint);
    },
    resizeColumn:function(){
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
    },
    checkEqualColumns:function(row){
        var columns = row.querySelectorAll('.editor-column');
        return [].every.call(columns,function(el){
            return  el.dataset.large==el.dataset.medium && 
                    el.dataset.medium==el.dataset.small && 
                    el.dataset.small==Math.round(this.colNumber/columns.length);
        },this);
    },
    justifyColumns:function(row){
        var columns = row.querySelectorAll('.editor-column');
        [].forEach.call(columns,function(el){
            el.dataset.large=el.dataset.medium=el.dataset.small=Math.round(this.colNumber/columns.length);
        },this)
    },
    renderTo:function(target){
        var html='';
        [].forEach.call(this.serialize(true), function (row) {
            html+='<div class="row '+((row.collapsed)?'collapse':'')+'">';
            [].forEach.call(row.columns, function (column) {
                html +='<div class="columns'
                     +((column.large)?' large-'+column.large:'')
                     +((column.medium)?' medium-'+column.medium:'')
                     +((column.small)?' small-'+column.small:'')
                     +'">';
                html+=column.content;
                html+='</div>';
            }.bind(this));
            html+='</div>';
        }.bind(this));
        target.innerHTML =html;
    }
}







