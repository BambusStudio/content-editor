var editor = document.getElementById('editor');
    function createRow(){
        var row = document.createElement('div');
        var rowHandle = document.createElement('div');
        var rowAdd = document.createElement('div');
        var rowRemove = document.createElement('div');
        row.className = 'editor-row';
        rowHandle.className = 'row-handle';
        rowAdd.className = 'column-add';
        rowRemove.className ='row-remove';
        row.appendChild(rowHandle);
        row.appendChild(createCol());
        row.appendChild(rowAdd);
        row.appendChild(rowRemove);
        initColumns(row);
        return row;
    }

    function createCol(size){
        var col = document.createElement('div');
        var colContent = document.createElement('div');
        var colRemove = document.createElement('div');
        var colResize = document.createElement('div');
        col.className = 'editor-column';
        colContent.className = 'column-content';
        colContent.setAttribute('contenteditable','true');
        colRemove.className = 'column-remove';
        colResize.className = 'column-resize';
        colContent.innerHTML = Math.round(Math.random()*10);
        col.appendChild(colContent);
        col.appendChild(colResize);
        col.appendChild(colRemove);
        return col;
    }
    function resizeCol(){

    }
    function initColumns(row){
        new Sortable(row, {
            group: 'column',
            draggable: ".editor-column",
            ghostClass: "sortable-ghost"
        });
    }
    function serialize(){
        var rows = editor.querySelectorAll('.editor-row');
        var contentSerialized = [];
        [].forEach.call(rows,function(row){
            var rowSerialized = [];
            [].forEach.call(row.querySelectorAll('.editor-column'),function(col){
                var columnSerialized = {
                    content:col.getElementsByClassName('column-content')[0].innerHTML,
                    size:window.getComputedStyle(col).width
                };
                rowSerialized.push(columnSerialized);
            });
            contentSerialized.push(rowSerialized);
        });
        console.log(contentSerialized)
    }
    function cleanUpSize(size){
        return Math.round(size/(100/12))*100/12;
    }
    //  add listners
    editor.addEventListener('click',function(event){
        //add Row;
        if(event.target.classList.contains('row-add')){
            event.target.parentElement.insertBefore(createRow(),event.target);
        }
        // remove Col;
        if(event.target.classList.contains('row-remove')){
            var col = event.target.parentElement;
            col.parentElement.removeChild(col);
        }
        // add Col;
        if(event.target.classList.contains('column-add')){
            event.target.parentElement.insertBefore(createCol(),event.target)
        }
        // remove Col;
        if(event.target.classList.contains('column-remove')){
            var col = event.target.parentElement;
            col.parentElement.removeChild(col);
        }
    },false);
    //column resize
    editor.addEventListener('mousedown',function(event){
        // resize target;
        var target = event.target.parentElement;
        if(event.target.classList.contains('column-resize')){
            var startPoint = event.clientX;
            var step = editor.querySelector('.editor-row').clientWidth/12;
            var startWidth = Number(target.dataset.size||1);
            var rigthSide = target.getClientRects()[0].right;
            console.log(rigthSide)
            var resizer = function(event){
                //return with limited to inverted size of targetso it can't be scaled in negaivesize.
                //Set step to 50px
                var additinalSize = Math.max(startWidth*-1,Math.round((event.clientX-rigthSide)/step));
                target.dataset.size = Math.max(1,startWidth+additinalSize);

            }
            var stopResizer = function(event){
                window.removeEventListener('mousemove',resizer,false)
                window.removeEventListener('mousemove',stopResizer,false)
            }
            window.addEventListener('mousemove',resizer,false)
            window.addEventListener('mouseup',stopResizer,false)
            event.stopImmediatePropagation();
            event.preventDefault();
        }
    },false)


    //init rows;
    new Sortable(editor, {
        group: "rows",
        handle: ".row-handle",
        draggable: ".editor-row",
        ghostClass: "sortable-ghost"
    });
