
var trixConfig = {
    init : function(){
        Trix.config.textAttributes.red = {
            style: { color: "red" },
            parser: function(element) {
                return element.style.color === "red"
            },
            inheritable: true
        };

        Trix.config.textAttributes.green = {
            style: { color: "green" },
            parser: function(element) {
                return element.style.color === "green"
            },
            inheritable: true
        }

        addEventListener("trix-initialize", function(event) {
            var buttonHTML = '<button type="button" data-trix-attribute="red">&nbsp;Rosu&nbsp;</button><button type="button" data-trix-attribute="green">&nbsp;Verde&nbsp;</button>'

            event.target.toolbarElement.
            querySelector(".trix-button-group.trix-button-group--text-tools").
            insertAdjacentHTML("beforeend", buttonHTML);

            event.target.toolbarElement.
            querySelector(".trix-button-group.trix-button-group--file-tools").remove();
        });

        addEventListener("trix-file-accept", function(event) {
            event.preventDefault();
        });
    }
};

var acEditWidget = {
    getAutoForm : function(){
        if( !this.autoForm ){
            this.autoForm = $('#edit-service-ac-form').ace('create',{
                type: 'form',
                ftype: 'popup',
                template:'edit-service-ac-frm-tpl',
                validate: true,
                displaysavebtn: true,
                sendallfieldsonsave: true,
                autoloadfieldsonshow: true,
                hideonescape : true,
                onshow: function (form) {
                    $(form).addClass('ace-show').removeClass('ace-hide');
                },
                onhide: function (f) {
                    acEditWidget.onHide(f);
                },
                idfield:'_sablon_autocomplete_id',
                net : {
                    remote : true,
                    autoload:false,
                    fid: 4030,
                    size : 10000,
                    url: app_path_main,
                },
                oninit : function(form) {
                    acEditWidget.autoFormInit($(form))
                },
                onbeforesave : function(target, record){

                    record.val('_sa_text',acEditWidget.getCurrentACData(),false);
                    record.setDirty('_sa_entity_id',true);
                    record.setDirty('_sablon_autocomplete_id',true);
                    record.setDirty('_sa_user_id',true);
                    record.setDirty('_sa_entity_type',true);
                    return true;
                },
                onsavesuccessful: function (target, record) {
                    acEditWidget.autoFormSaveSuccessful(record);
                },
                onafterloadrecord : function ( form, record) {
                    acEditWidget.autoFormAfterLoadRecord(record);
                },

            });
        }

        return this.autoForm;
    },

    onGridEditInit : function(f){
        this.gridEditForm = f;
        f.find('.trix-label').after('<trix-editor id="ac-data-trix"></trix-editor>');
        this.trixEditor = document.querySelector('#ac-data-trix');
        f.css('z-index',9991);
    },

    onGridEditAfterLoad : function(record){
        let formatText = record.val('html');
        this.trixEditor.reset();
        if( $.aceOverWatch.utilities.isVoid(formatText,true) || formatText == false ){
            this.trixEditor.editor.insertString(record.val('text'));
        }else{
            this.trixEditor.editor.insertHTML(formatText);
        }
    },

    onGridEditBeforeSave : function(record){
        record.val('text',this.trixEditor.editor.getDocument().toString().slice(0,-2));
        record.val('html',this.trixEditor.value);
        return true;
    },

    getAutoFormGrid : function(){

        if( !this.gridAuto ){

            this.gridAuto = this.autoForm.find('.text-grid').ace('create',{
                type:'grid',
                gtype:'table',
                rowparseastemplate : true,
                norecordstpl:'ac-no-data-text-tpl',
                width:'',
                cleardata:true,
                pagination:false,
                hideheader:true,
                allowadd:false,
                allowdelete:true,
                allowedit:true,
                allowrefresh:false,
                donotredrawselectedrow:true,//need this to avoid flickering/lose of focus on new row when selecting it
                alloweditinline:false,
                idfield:'id',
                pagination:false,

                editonselect: true,
                showeditcolumn: 'end',
                showdeletecolumn: 'end',

                net : {
                    remote : false,
                    size : 10000,
                    url: app_path_main,
                },
                onpreloadsuccessful : function(target, rawData, totalExpectedData){
                },

                editform : {
                    template : 'edit-service-ac-text-frm-tpl',

                    oninit : function(target){
                        acEditWidget.onGridEditInit($(target));
                    },

                    onafterloadrecord : function ( form, record) {
                        acEditWidget.onGridEditAfterLoad(record);
                    },

                    onbeforesave : function(target, record){
                        return acEditWidget.onGridEditBeforeSave(record);
                    }
                },

                columns : [
                    {
                        title:_L.Actiuni,
                        aditionalclasses:'ace-col-1',
                        type:'action',
                        actions:[

                            {
                                callback:function(target, row, call, record){
                                    acEditWidget.moveTextRow(row,true);
                                },
                                iconcls:'far fa-arrow-circle-up',
                            },
                            {
                                callback:function(target, row, call, record){
                                    acEditWidget.moveTextRow(row,false);
                                },
                                iconcls:'far fa-arrow-circle-down',
                            },
                        ]
                    },

                    {
                        title:_L.Text,
                        fieldname:'text',
                        aditionalclasses:'ace-col-7',
                    },
                    {
                        aditionalclasses:'ace-col-1',
                        type:'action',
                        actions:[

                            {
                                callback:function(target, row, call, record){
                                    acEditWidget.moveToCategory(row);
                                },
                                title:_L.Move,
                            },
                        ]
                    },
                    {
                        aditionalclasses:'ace-col-1',
                        type:'action',
                        actions:[

                            {
                                callback:function(target, row, call, record){
                                    acEditWidget.copyToCategory(row);
                                },
                                title:_L.Copiere,
                            },
                        ]
                    },
                ],

            });


        }

        return this.gridAuto;
    },

    moveToCategory : function(initialRow){

        initialRow = parseInt(initialRow);
        this.updateCurrentCategoryTexts();

        $.aceOverWatch.prompt.show(_L.incvm,function(value, cfg){

                acEditWidget.moveToCategoryActual(value,cfg.initialRow);

            },{
                type:'prompt',
                initialRow : initialRow
            }
        );
    },

    moveToCategoryActual : function(categoryName, initialRow){
        if( $.aceOverWatch.utilities.isVoid(categoryName,true) ){
            $.aceOverWatch.toast.show('error', _L.ncnv);
            setTimeout(function(){acEditWidget.moveToCategory(initialRow);},200);
            return;
        }

        let updateAccordion = false;
        if( this.actualAutoCompleteData[categoryName] === undefined ){
            this.actualAutoCompleteData[categoryName] = [];
            updateAccordion = true;
        }

        let textData = this.actualAutoCompleteData[this.currentCategory].splice(initialRow,1)[0];
        this.actualAutoCompleteData[categoryName].push(textData);

        if( updateAccordion ){
            this.setACDAccordion(false);
        }
        this.setTextsForCurrentCategory();
    },

    copyToCategory : function(initialRow){

        initialRow = parseInt(initialRow);
        this.updateCurrentCategoryTexts();

        $.aceOverWatch.prompt.show(_L.incvc,function(value, cfg){

                acEditWidget.copyToCategoryActual(value,cfg.initialRow);

            },{
                type:'prompt',
                initialRow : initialRow
            }
        );
    },

    copyToCategoryActual : function(categoryName, initialRow){
        if( $.aceOverWatch.utilities.isVoid(categoryName,true) ){
            $.aceOverWatch.toast.show('error', _L.ncnv);
            setTimeout(function(){acEditWidget.copyToCategory(initialRow);},200);
            return;
        }

        let updateAccordion = false;
        if( this.actualAutoCompleteData[categoryName] === undefined ){
            this.actualAutoCompleteData[categoryName] = [];
            updateAccordion = true;
        }

        this.actualAutoCompleteData[categoryName].push(this.actualAutoCompleteData[this.currentCategory][initialRow]);

        if( updateAccordion ){
            this.setACDAccordion(false);
        }
    },

    moveTextRow : function(initialRow, upwords){

        initialRow = parseInt(initialRow);
        this.updateCurrentCategoryTexts();

        let initialLength = this.actualAutoCompleteData[this.currentCategory].length;
        if( this.actualAutoCompleteData[this.currentCategory].length <= 1 ){
            return;//nothing to move
        }
        let finalRow = upwords ? initialRow - 1 : initialRow + 1;

        let textData = this.actualAutoCompleteData[this.currentCategory].splice(initialRow,1)[0];
        if( finalRow < 0 ){
            this.actualAutoCompleteData[this.currentCategory].push(textData);
        }else{
            if( finalRow >= initialLength ){
                this.actualAutoCompleteData[this.currentCategory].splice(0,0,textData);
            }else{
                this.actualAutoCompleteData[this.currentCategory].splice(finalRow,0,textData);
            }
        }
        this.setTextsForCurrentCategory();
    },

    autoFormInit : function(f){
        this.navigator = f.find('.navigator');
        this.onlyMany = f.find('.only-many');
        f.css('z-index',9990);
    },
    autoFormAfterLoadRecord : function(record){
        let rawAutoCompleteData = record.val('_sa_text');
        if( $.aceOverWatch.utilities.isVoid( rawAutoCompleteData, true ) ){
            rawAutoCompleteData = '{}';
        }

        this.actualAutoCompleteData = {};
        try {
            this.actualAutoCompleteData = JSON.parse(rawAutoCompleteData);
        }catch(e){
            this.actualAutoCompleteData[_L.General] = rawAutoCompleteData.split('\n');
        }

        this.setACDAccordion(true);
    },
    autoFormSaveSuccessful : function(record){
        $.aceOverWatch.utilities.runIt(this.customOnSaveSuccessful,record);
    },
    onHide : function(){
        $.aceOverWatch.utilities.runIt(this.customOnEditEnd);
    },

    setACDAccordion : function(switchToFirstCatgory){
        let acData = [];
        for(let prop in this.actualAutoCompleteData ){
            acData.push({
                name : prop,
                tag : prop,
            });
        }
        $.aceOverWatch.field.accordion.clearData(this.navigator);
        this.navigator.ace('modify',{
            data : acData
        });

        if( switchToFirstCatgory ){
            if( acData.length > 0 ){
                this.currentCategory = acData[0].tag;
                this.navigator.ace('value',acData[0].tag);
            }else{
                this.currentCategory = false;
                this.clearTexts();
            }
        }

        if( acData.length == 0 ){
            this.onlyMany.addClass('ace-hide');
        }else{
            this.onlyMany.removeClass('ace-hide');
        }
    },

    clearTexts : function(){
        $.aceOverWatch.field.grid.setData(this.getAutoFormGrid(),[],10000,true);
    },

    setTextsForCurrentCategory: function(){
        let gridData = [];
        for(let idx in this.actualAutoCompleteData[this.currentCategory]){
            if( typeof this.actualAutoCompleteData[this.currentCategory][idx] === 'string'){
                gridData.push({
                    id 			: idx+1,
                    text 		: this.actualAutoCompleteData[this.currentCategory][idx],
                    html 	: false,
                });
            }else{
                gridData.push({
                    id 			: idx+1,
                    text 		: this.actualAutoCompleteData[this.currentCategory][idx]['text'],
                    html 	: this.actualAutoCompleteData[this.currentCategory][idx]['html'],
                });
            }
        }
        $.aceOverWatch.field.grid.setData(this.getAutoFormGrid(),gridData,10000,true);
    },

    updateCurrentCategoryTexts : function(){
        let currentData = $.aceOverWatch.field.grid.getData(this.getAutoFormGrid());
        let texts = [];
        for(let idx in currentData ){
            texts.push({
                text 		: currentData[idx].val('text'),
                html 		: currentData[idx].val('html'),
            });
        }
        this.actualAutoCompleteData[this.currentCategory] = texts;
    },

    getCurrentACData : function(){
        this.updateCurrentCategoryTexts();
        return JSON.stringify(this.actualAutoCompleteData);
    },

    onACChangeSelection : function(newCategory){
        if( newCategory != this.currentCategory && this.currentCategory != '' ){
            this.updateCurrentCategoryTexts();
        }
        this.currentCategory = newCategory;
        this.setTextsForCurrentCategory(newCategory);
    },

    addCategory : function(tag){
        $.aceOverWatch.prompt.show(_L.inunc,function(value, cfg){

            acEditWidget.addCategoryActual(value);

        },{type:'prompt'});
    },
    addCategoryActual : function(categoryName){
        if( $.aceOverWatch.utilities.isVoid(categoryName,true) ){
            $.aceOverWatch.toast.show('error', _L.ncnv);
            setTimeout(function(){acEditWidget.addCategory();},200);
            return;
        }

        if( this.actualAutoCompleteData[categoryName] !== undefined ){
            $.aceOverWatch.toast.show('error', _L.csed);
            setTimeout(function(){acEditWidget.addCategory();},200);
            return;
        }

        this.actualAutoCompleteData[categoryName] = [];

        this.setACDAccordion(false);
        this.navigator.ace('value',categoryName);
    },

    modifyCategory : function(){

        $.aceOverWatch.prompt.show(_L.innpcc,function(value, cfg){

            acEditWidget.modifyCategoryActual(value);

        },{type:'prompt'});

    },
    modifyCategoryActual : function(categoryName){

        if( $.aceOverWatch.utilities.isVoid(categoryName,true) ){
            $.aceOverWatch.toast.show('error', _L.ncnv);
            setTimeout(function(){acEditWidget.modifyCategory();},200);
            return;
        }

        if( categoryName == this.currentCategory ){
            $.aceOverWatch.toast.show('error', _L.nntsd);
            setTimeout(function(){acEditWidget.modifyCategory();},200);
            return;
        }

        if( this.actualAutoCompleteData[categoryName] !== undefined ){
            $.aceOverWatch.toast.show('error', _L.csed);
            setTimeout(function(){acEditWidget.modifyCategory();},200);
            return;
        }

        this.actualAutoCompleteData[categoryName] = this.actualAutoCompleteData[this.currentCategory];
        this.deleteCategoryActual(true);
        this.currentCategory = categoryName;
        this.navigator.ace('value',categoryName);
    },
    deleteCategory : function(){

        $.aceOverWatch.prompt.show(_L.sssc,function(value, cfg){

            acEditWidget.deleteCategoryActual(true);

        },{type:'question'});

    },
    deleteCategoryActual : function(switchToFirstCatgory){
        delete this.actualAutoCompleteData[this.currentCategory];
        this.clearTexts();
        this.setACDAccordion(switchToFirstCatgory);
    },

    addText : function(tag){
        $.aceOverWatch.field.grid.addNewRecord(this.getAutoFormGrid());
    },

    display : function(record,customOnSaveSuccessful = false,explicitUserIdForNew = false,explicitEntiyTypeForNew = false,explicitEntiyIdForNew = false, customEditEnd = false){
        this.customOnSaveSuccessful = customOnSaveSuccessful;
        this.customOnEditEnd = customEditEnd;

        if( record.val('_sablon_autocomplete_id') <= 0 ){

            if( record.val('_sa_user_id') <= 0 && explicitUserIdForNew > 0 ) {
                record.val('_sa_user_id', explicitUserIdForNew, false);
            }
            if( record.val('_sa_entity_type') <= 0 && explicitEntiyTypeForNew > 0 ) {
                record.val('_sa_entity_type', explicitEntiyTypeForNew, false);
            }
            if( record.val('_sa_entity_id') <= 0 && explicitEntiyIdForNew > 0 ) {
                record.val('_sa_entity_id', explicitEntiyIdForNew, false);
            }

        }

        this.getAutoForm().ace('show').ace('value',record);
    }
}

function onSMACChange(tag){
    acEditWidget.onACChangeSelection(tag);
}

function onSMACAddCategory(){
    acEditWidget.addCategory();
}
function onSMACModifyCategory(){
    acEditWidget.modifyCategory();
}
function onSMACDeleteCategory(){
    acEditWidget.deleteCategory();
}
function onSMACAddText(){
    acEditWidget.addText();
}


var autoCompleteManager = {
    acIndex : 0,//each time an AC element is created, this index is incremented; it is used to keep track and identify each
    acObjsMap : {},//a map, from index, to the acObject

    removeReference : function(object){
        if( !object || !object.target || object.target.length == 0 ){ return false; }//no where to
        let idx = object.target.attr('acm');
        object.target.attr('acm',false)
        this.acObjsMap[idx] = false;
        delete object;
        return true;
    },

    /*
     * this function ensures that an acObj exists
     * if one is not created in the element pointed by the selector, one will be created
     * IF the callbacks object is defined, its methods will be assigned to the object
     * 	possible callbacks:
     * 		addText : function(text){...}
     * 		deleteInDirection : function( direction ){...}, where direction can beL 'backward or forward
     * 		insertLineBreak : function(){..}
     * 		afterDataLoaded : function(){..}
     *
     * settings: //object with custom settings; allowed settings:
     * 		returnSimpleText : - if true, when building the text to be returned, the object will return simple text,
     * 				and not html encoded text; by default, the value of this is false
     *
     */
    get : function(target, callbacks = false, settings = false){
        if( target.length == 0 ){ return false; }//no where to
        let idx = target.attr('acm');
        if( !idx ){
            idx = ++this.acIndex;
            target.attr('acm',idx);

            this.acObjsMap[idx] = {
                target : target,
                idx : idx,
                callbacks : {},
                created : false,
                returnSimpleText : false,

                create : function(){
                    if( this.created ){ return }
                    this.created = true;

                    let me = this;

                    target.html($('#acm-interface-template').html());

                    this.navigator = target.find('.ac-navigator');
                    this.navigator.ace('create',{
                        type:'accordion',
                        handler: function(tag, tagData, target){
                            me.onACChangeSelection(tag);
                        }

                    });

                    this.navigatorContainer = target.find('.only-many');
                    this.asTpl = target.find('.auto-complete-tpl').ace('create');

                    this.importDataSection = target.find('[name="Import_Data"]');
                    this.importDataSection.dblclick(function() {
                        me.buildCurrentSelectedText();
                    });
                    this.importDataSection.keydown(function(e) {
                        switch( e.keyCode ){
                            case 13:
                                me.buildCurrentSelectedText();
                                break;
                            case 8:
                                me.onDelete('backward');
                                break;
                        }
                    });

                    this.moveSelection = target.find('.auto-complete-move-selection');
                    this.moveSelection.click(function() {
                        me.onMoveSelection();
                    });

                    this.selectAll = target.find('.auto-complete-select-all');
                    this.selectAll.click(function() {
                        me.onSelectAll();
                    });

                    this.deSelectAll = target.find('.auto-complete-deselect-all');
                    this.deSelectAll.click(function() {
                        me.onDeSelectAll();
                    });

                    this.punctuation = target.find('.auto-complete-punctuation');
                    this.punctuation.click(function() {
                        me.onAddText($(this).html());
                    });

                    this.deleteBack = target.find('.auto-complete-backspace');
                    this.deleteBack.click(function() {
                        me.onDelete('backward');
                    });

                    this.newLine = target.find('.auto-complete-enter');
                    this.newLine.click(function() {
                        me.onNewLine();
                    });

                    this.editEl = target.find('.auto-complete-edit');
                    this.editEl.click(function() {
                        me.editCurrent();
                    });

                },

                onACChangeSelection : function(newCategory){
                    this.currentCategory = newCategory;
                    this.clear();

                    for(let idx = 0; idx < this.actualAutoCompleteData[this.currentCategory].length; idx++){

                        if( typeof this.actualAutoCompleteData[this.currentCategory][idx] === 'string'){

                            this.importDataSection.append($('<option>', {
                                value: idx,
                                text: this.actualAutoCompleteData[this.currentCategory][idx],
                            }));

                        }else{
                            this.importDataSection.append($('<option>', {
                                value: idx,
                                text: this.actualAutoCompleteData[this.currentCategory][idx]['text'],
                            }));
                        }
                    }

                    this.importDataSection.focus();
                },

                onMoveSelection : function(){
                    this.buildCurrentSelectedText();
                    this.onDeSelectAll();
                },

                onSelectAll : function(){
                    this.importDataSection.find('option').prop('selected',true);
                },

                onDeSelectAll : function(){
                    this.importDataSection.find('option').prop('selected',false);
                },

                onAddText : function(text){
                    $.aceOverWatch.utilities.runIt(this.callbacks.addText,text);
                },

                onDelete : function(direction){
                    $.aceOverWatch.utilities.runIt(this.callbacks.deleteInDirection,direction);
                },

                onNewLine : function(){
                    $.aceOverWatch.utilities.runIt(this.callbacks.insertLineBreak);
                },

                buildCurrentSelectedText : function(){
                    let asTpl = this.asTpl.ace('value');

                    let txt = '';
                    let txtEditor = '';

                    let me = this;

                    this.importDataSection.find("option:selected").each(function() {

                        let idx = $(this).val();

                        if (txt != "") {
                            if (asTpl) txt += "\n";
                            else txt += " ";
                        }
                        if (txtEditor != "") {
                            if (asTpl) txtEditor += "<br>";
                            else txtEditor += " ";
                        }

                        txt += me.actualAutoCompleteData[me.currentCategory][idx] === 'string'
                            ? me.actualAutoCompleteData[me.currentCategory][idx]
                            : me.actualAutoCompleteData[me.currentCategory][idx]['text'];

                        txtEditor += typeof me.actualAutoCompleteData[me.currentCategory][idx] === 'string'
                            ? me.actualAutoCompleteData[me.currentCategory][idx]
                            : (
                                $.aceOverWatch.utilities.isVoid(me.actualAutoCompleteData[me.currentCategory][idx]['html'])
                                    ? me.actualAutoCompleteData[me.currentCategory][idx]['text']
                                    : me.actualAutoCompleteData[me.currentCategory][idx]['html']
                            )
                    });

                    this.onAddText( this.returnSimpleText ? txt : txtEditor);
                },

                editCurrent : function(){

                    if( !this.currentRecord ){
                        $.aceOverWatch.toast.show('error',_L.scds);
                        return;
                    }

                    $.aceOverWatch.utilities.runIt(this.callbacks.onbeforeedit);

                    let me = this;
                    acEditWidget.display(this.currentRecord,function(){
                            me.setActual();
                        },
                        this.lastUserId,
                        this.lastEntityType,
                        this.lastEntityId,
                        function(){
                            me.onEditEnd();
                        },
                    );
                },

                clear : function(){
                    this.importDataSection.find('option').each(function() {
                        $(this).remove();
                    });
                },

                set : function(data){
                    this.clear();

                    this.currentRecord = (!$.aceOverWatch.utilities.isVoid(data) && !$.aceOverWatch.utilities.isVoid(data.rows) && data.rows.length > 0 )
                        ? $.aceOverWatch.record.create(data.rows[0])
                        : $.aceOverWatch.record.create({

                            _sa_entity_id : this.lastEntityId,
                            _sa_user_id : this.lastUserId,
                            _sa_entity_type : this.lastEntityType,

                        });


                    this.setActual();

                    if( allowAutoCompleteEdit != 1 ){
                        this.editEl.addClass('ace-hide');
                    }else{
                        this.editEl.removeClass('ace-hide');
                    }

                    $.aceOverWatch.utilities.runIt(this.callbacks.afterDataLoaded);
                },

                setActual : function(){

                    let rawAutoCompleteData = this.currentRecord.val('_sa_text');

                    if( $.aceOverWatch.utilities.isVoid( rawAutoCompleteData, true ) ){
                        rawAutoCompleteData = '{}';
                    }

                    this.actualAutoCompleteData = {};
                    try {
                        this.actualAutoCompleteData = JSON.parse(rawAutoCompleteData);
                    }catch(e){
                        this.actualAutoCompleteData[_L.General] = rawAutoCompleteData.split('\n');
                    }

                    /*
                     * we're building now the accordion data
                     */
                    let acData = [];
                    for(let prop in this.actualAutoCompleteData ){
                        acData.push({
                            name : prop,
                            tag : prop,
                        });
                    }
                    $.aceOverWatch.field.accordion.clearData(this.navigator);
                    this.navigator.ace('modify',{
                        data : acData
                    });

                    if( acData.length > 0 ){
                        this.currentCategory = acData[0].tag;
                        this.navigator.ace('value',acData[0].tag);

                        this.navigatorContainer.removeClass('ace-hide');

                    }else{
                        this.currentCategory = false;
                        this.clear();

                        this.navigatorContainer.addClass('ace-hide');
                    }

                },

                onEditEnd : function(){
                    $.aceOverWatch.utilities.runIt(this.callbacks.onafteredit);
                },

                loadData : function(entityType, entityId, userId){

                    if( this.lastEntityType == entityType && this.lastEntityId == entityId && this.lastUserId == userId ){
                        /*
                         * the data for this is already loaded
                         * we just execute the afterDataLoaded callback, if one is defined
                         */
                        $.aceOverWatch.utilities.runIt(this.callbacks.afterDataLoaded);
                        return;
                    }

                    this.lastEntityId = entityId;
                    this.lastUserId = userId;
                    this.lastEntityType = entityType;
                    /*
                     * loading some data...
                     */
                    let params = {
                        eid : entityId,
                        uid : userId,
                        type : entityType,
                    };

                    let me = this;
                    $.aceOverWatch.net.load(autoCompleteManager.getNetHelperServiceAC(),params,{
                        onsuccess : function(field, data){

                            me.set(data);

                        },
                    });
                }

            };

            this.acObjsMap[idx].create();
        }
        let acObj = this.acObjsMap[idx];
        if( callbacks ){
            this.acObjsMap[idx].callbacks = callbacks;
        }

        if( settings ){
            if( settings.returnSimpleText !==  undefined ){
                this.acObjsMap[idx].returnSimpleText = settings.returnSimpleText ? true : false;
            }
        }


        return this.acObjsMap[idx];
    },

    getNetHelperServiceAC : function(med_serv_id){

        if( !this.serviceACHelper ){

            this.serviceACHelper = $('<div></div>').ace('create',{
                net : {
                    cmd: 'getlist',
                    remote : true,
                    autoload : false,
                    fid  : 4030,
                    url: app_path_main,
                },
            });
        }

        return this.serviceACHelper;
    },
}

/**
 *This objects encapsulates the functionality of displaying a POPUP window,
 * for a given ace field; the popup field will contain an autoCompleteManager object,
 * from which the user will be able to add, remove, or insert pre-defined elements
 * to the input element of the ace field
 *
 * which data is loaded for the field is given by the fieldname, or by the ac_fieldname property of the field:
 * it is used as a key, in the fieldnameCategory dictionary, which describes the
 * category and the subcategory for the templates that need to be loaded
 *
 * About ac_fieldname: some fields, which appear in templates, might be populated with different information,
 * when displayed and used in different contexts, the templates for it need to be loaded from different places
 * if the ac_fieldname attribute is defined on the ace field, it will be used instead of the fieldname
 *
 * category codes:
 * 		 '1' => 'SERVICIU_MEDICAL',
 *		 '2' => 'INTERNARE',
 *
 *		 '10' => Internare  - Anamneza
 *		 '11' => Internare  - Consult
 *		 '12' => Internare  - Investigatii
 *
 *
 */
var floatingACWidget = {

    fieldnameCategory : {
        '_fdi_antecedente_heredocolaterale_pacient' : { category: 10, subcategory: 1 },
        '_fdi_antecedente_personale_pacient' : { category: 10, subcategory: 2 },
        '_fdi_conditii_viata_si_munca' : { category: 11, subcategory: 3 },
        '_fdi_comportamente_pacient' : { category: 10, subcategory: 4 },
        '_fdi_medicatie_fond_inainte_internare' : { category: 10, subcategory: 5 },
        '_fdi_istoric_boala' : { category: 10, subcategory: 6 },

        '_fdi_ec_general' : { category: 11, subcategory: 1 },
        '_fdi_ec_obiectiv' : { category: 11, subcategory: 2 },
        '_fdi_ec_stare_generala' : { category: 11, subcategory: 3 },
        '_fdi_ec_talie' : { category: 11, subcategory: 4 },
        '_fdi_ec_greutate' : { category: 11, subcategory: 5 },

        '_fdi_ec_stare_nutritie' : { category: 11, subcategory: 6 },
        '_fdi_ec_stare_constienta' : { category: 11, subcategory: 7 },

        '_fdi_ec_greutate' : { category: 11, subcategory: 8 },
        '_fdi_ec_greutate' : { category: 11, subcategory: 9 },
        '_fdi_ec_greutate' : { category: 11, subcategory: 10 },
        '_fdi_ec_greutate' : { category: 11, subcategory: 11 },
        '_fdi_ec_greutate' : { category: 11, subcategory: 12 },
        '_fdi_ec_greutate' : { category: 11, subcategory: 13 },
        '_fdi_ec_greutate' : { category: 11, subcategory: 14 },

        '_fdi_ec_facies' : { category: 11, subcategory: 15 },
        '_fdi_ec_tegumente' : { category: 11, subcategory: 16 },
        '_fdi_ec_fanere' : { category: 11, subcategory: 17 },
        '_fdi_ec_tesut_adipos_conjunctiv' : { category: 11, subcategory: 18 },
        '_fdi_ec_sistem_ganglionar' : { category: 11, subcategory: 19 },
        '_fdi_ec_sistem_muscular' : { category: 11, subcategory: 20 },
        '_fdi_ec_sistem_osteo_articular' : { category: 11, subcategory: 21 },

        '_fdi_ec_aparat_respirator' : { category: 11, subcategory: 22 },
        '_fdi_ec_aparat_cardiovascular' : { category: 11, subcategory: 23 },
        '_fdi_ec_aparat_digestiv' : { category: 11, subcategory: 24 },
        '_fdi_ec_ficat_etc' : { category: 11, subcategory: 25 },
        '_fdi_ec_aparat_urogenital' : { category: 11, subcategory: 26 },
        '_fdi_ec_sistem_nervos_etc' : { category: 11, subcategory: 27 },

        'cjf_denumire_explorari_functionale' : { category: 12, subcategory: 1 },
        'cjf_denumire_investigatii_radiologice' : { category: 12, subcategory: 2 },
        'cjf_denumire_alte_proceduri' : { category: 12, subcategory: 3 },

        '_fdi_patologie_cunoscuta' : { category: 13, subcategory: 1 },
        '_fdi_evolutia_spitalizarii' : { category: 13, subcategory: 2 },
        '_fdi_recomandari' : { category: 13, subcategory: 3 },

    },

    returnSimpleText : true,
    setWorkingField : function(aceField,onlyIfAutoDeployIsTrue = false){

        this.currentWorkingField = aceField;
        let settings = aceField.data($.aceOverWatch.settings.aceSettings);
        this.fieldname = settings.fieldname;
        this.label = settings.label;

        let acFieldName = aceField.attr('ac_fieldname');
        if( acFieldName && String(acFieldName).length > 0 ){
            this.fieldname = acFieldName;
        }

        let explicitCategory = aceField.attr('ac_category');
        let explicitSubcategory = aceField.attr('ac_subcategory');
        let explicitUserId = aceField.attr('ac_user');
        this.returnSimpleText = aceField.attr('ac_return_simple_text') == 1 ? true : false;
        this.workingTrixField = $('#'+aceField.attr('ac_related_trix_field_id'));

        /*
         * if we have both defined, we overwrite the default / existing one
         */
        if(
            !$.aceOverWatch.utilities.isVoid(explicitCategory,true)
            && !$.aceOverWatch.utilities.isVoid(explicitSubcategory,true)
        ){
            this.fieldnameCategory[this.fieldname] = {
                category :explicitCategory,
                subcategory: explicitSubcategory
            };
        }

        if( !this.fieldnameCategory[this.fieldname] ){
            $.aceOverWatch.toast.show('warning', 'Campul curent nu are asociate date the import.');
            return false;
        }

        this.fieldnameCategory[this.fieldname].user = explicitUserId > 0 ? explicitUserId : 0;

        if( onlyIfAutoDeployIsTrue ) {
            if( $.aceOverWatch.cookies.get('mp-acw-' + this.fieldnameCategory[this.fieldname].category + '-' + this.fieldnameCategory[this.fieldname].subcategory) != 1 ){
                return false;
            }
        }

        return true;
    },

    displayForAceField : function(aceField,onlyIfAutoDeployIsTrue = false){

        if( !this.setWorkingField(aceField,onlyIfAutoDeployIsTrue) ){
            return false;
        }

        this.lastShowedTime = 9999999999999;
        this.getForm().ace('show');
        return true;
    },

    getForm : function(){
        if( !this.form ){
            this.form = $('#floating-ac-widget-form').ace('create',{
                type: 'form',
                ftype: 'popup',
                template:'floating-ac-widget-frm-tpl',
                validate: true,
                displaysavebtn: false,
                sendallfieldsonsave: false,
                autoloadfieldsonshow: false,
                hideonescape : true,
                idfield:'_id',
                net : {
                    remote : false,
                },
                oninit : function(form) {
                    floatingACWidget.onInit($(form))
                },
                onshow : function(){
                    floatingACWidget.onShow();
                },
                onafterloadrecord : function ( form, record) {
                    floatingACWidget.afterLoadRecord(record);
                },

            });
            this.form.addClass('mp-ac-widget-right');

            $.aceOverWatch.eventManager.registerEvent('outsideclick',
                this.form,
                this.form,
                function()       {
                    floatingACWidget.hideIfTimeIsRight();
                }
            );
        }

        return this.form;
    },

    onInit : function(f){
        this.simpleTitle = f.find('.mp-simple-title');
        this.acObject = autoCompleteManager.get(f.find('.test-generic-ac-target'),
            {
                addText: function(text){floatingACWidget.addText(text);},
                deleteInDirection: function(direction){floatingACWidget.deleteInDirection(direction);},
                insertLineBreak: function(){floatingACWidget.insertLineBreak();},

                onbeforeedit : function(){floatingACWidget.hide();},
                onafteredit : function(){floatingACWidget.show();},
            },
            {
                returnSimpleText : this.returnSimpleText
            });
        this.autoDisplayElement = f.find('.auto-display').ace('create');
        f.css('z-index',9980);
    },

    addText : function(text){
        if( this.returnSimpleText ) {
            this.currentWorkingField.ace('value', this.currentWorkingField.ace('value') + text);
        }else{
            this.workingTrixField[0].editor.recordUndoEntry('at');
            this.workingTrixField[0].editor.insertHTML(text);
        }
    },
    deleteInDirection : function(direction="backward"){

        if( this.returnSimpleText ) {
            let value = this.currentWorkingField.ace('value');
            if (!value) {
                return;
            }
            this.currentWorkingField.ace('value', value.slice(0, -1));
        }else{
            this.workingTrixField[0].editor.deleteInDirection(direction);
        }
    },
    insertLineBreak : function(){
        if( this.returnSimpleText ) {
            if (this.currentWorkingField.data($.aceOverWatch.settings.aceSettings).type != 'textarea') {
                return;
            }
            this.currentWorkingField.ace('value', this.currentWorkingField.ace('value') + "\n");
        }else{
            this.workingTrixField[0].editor.recordUndoEntry('ilb');
            this.workingTrixField[0].editor.insertLineBreak();
        }
    },

    lastShowedTime : 9999999999999,
    onShow : function(){

        this.acObject.returnSimpleText = this.returnSimpleText;

        this.lastShowedTime = moment().valueOf();
        this.acObject.loadData(
            this.fieldnameCategory[this.fieldname].category,
            this.fieldnameCategory[this.fieldname].subcategory,
            this.fieldnameCategory[this.fieldname].user,
        );
        this.simpleTitle.html(this.label);

        this.autoDisplayElement.ace('value',$.aceOverWatch.cookies.get('mp-acw-' + this.fieldnameCategory[this.fieldname].category + '-' + this.fieldnameCategory[this.fieldname].subcategory) == 1 ? 1 : 0);
    },
    hideIfTimeIsRight : function(){

        if( this.lastShowedTime = moment().valueOf() - 500 < this.lastShowedTime ){
            /*
              * this to make sure that the form doesn't auto close the moment the badge of the element is clicked
             */
            return;
        }

        if( this.currentWorkingField.has($.aceOverWatch.eventManager.lastOutsideTargetClicked).length != 0 ){
            /*
             * we also don't close the form if the click falls inside the working target
             */
            return;
        }

        if( this.form.hasClass('ace-form-show') ){
            this.form.removeClass('ace-form-show');
        }
    },

    hide : function(){
        this.form.ace('hide');
    },

    show : function(){
        this.form.ace('show');
    },

    onAutoDisplayChange : function(){
        if( !this.form ){
            return;
        }
        let coockieValue = $.aceOverWatch.cookies.get('mp-acw-'+this.fieldnameCategory[this.fieldname].category+'-'+this.fieldnameCategory[this.fieldname].subcategory);
        let currentValue = this.autoDisplayElement.ace('value');
        if( coockieValue == currentValue ){
            return;
        }
        $.aceOverWatch.cookies.set('mp-acw-'+this.fieldnameCategory[this.fieldname].category+'-'+this.fieldnameCategory[this.fieldname].subcategory,currentValue);

        this.setFocusInHandlerIfNeeded(this.currentWorkingField);
    },

    setFocusInHandlerIfNeeded : function(target){
        if( target.attr('fihs') == 1 ){//fihs: focus in handler set
            return;
        }
        target.attr('fihs',1);

        let inputEl = target.find('input.ace-efld,textarea.ace-efld');
        if( inputEl.length == 0 ){
            return;
        }
        inputEl.focusin(function(e){
            floatingACWidget.displayForAceField($(this).parents('.ace-field-container').first(),true);
        });
    },

    setFieldsForAutoDisplay : function(container){
        container.find('[foracw="1"]').each(function(){

            floatingACWidget.setFieldsForAutoDisplayActual($(this));

        });
    },

    setFieldsForAutoDisplayActual : function(target){
        if( !this.setWorkingField(target,true) ){
            return false;
        }
        this.setFocusInHandlerIfNeeded(target);
    }
};
function displayFloatingACWidgetForField(target){
    floatingACWidget.displayForAceField(target);
}
function onACWidgetAutoDisplayChange(){
    floatingACWidget.onAutoDisplayChange();
}


var aetuCellEditPluginTextareaAutoCompleteWM = {
    type : 'CELL_EDIT',
    name : 'textarea_ac_wm',
    instanceMap : {},
    defaultConfigObj : {
        rows : 5,
        oneditdone : null,//function called right before the cell dismisses itself
        //prototype: function(table,rowIdx,fieldname,updateData)

        navigatetonext: false,//if ture, after a value edit change, we'll signal the table to go to the next editable cell
        //otherwise, for this plugin, we do not do that

        returnSimpleText: 1,//so that the data return from the AC is simple text, otherwise it will be rich text
    },
    configObj : {},
    configObjMap : {},
    configure : function(tableObj,colIdx,configObj){
        let configId = String(tableObj.id)+'-'+colIdx;
        this.configObjMap[configId] = $.extend({},this.defaultConfigObj,configObj);
        this.configObj = this.configObjMap[configId];
    },
    drawYourself : function( tableObj, id, container, rowDataObject, fieldname ){
        if( this.instanceMap[id] ){//we are already editing this, nothing else to do
            return;
        }
        this.instanceMap[id] = {
            tableObj : tableObj,
            id: id,
            container: container,
            rowDataObject : rowDataObject,
            fieldname : fieldname,
            originalValue : rowDataObject[fieldname]
        };

        let targetValue = $.aceOverWatch.utilities.isVoid(this.instanceMap[id].originalValue,true) ? '' : this.instanceMap[id].originalValue;
        let record = $.aceOverWatch.record.create({
            target :   targetValue,
            label : tableObj.columns[tableObj.columnsNameMap[fieldname]].title,
            instanceId : id,
            'id' : 1,//hardcoded, as to not be regarded as a new record by the form
            '_serviciu_medical_id': rowDataObject['_serviciu_medical_id'],
            '_medic_consult_id' : rowDataObject['_medic_consult_id'],
        },'id');
        this.getForm().ace('value',record);
        this.textAreaField.attr('ac_return_simple_text',this.configObj.returnSimpleText);


        if( this.configObj.returnSimpleText == 1 ){
            this.textAreaElement.removeClass('ace-hide');
            this.trixContainer.addClass('ace-hide');
        }else{

            /*
             * IF we display a rich text editor, we look to see if we have a field which contains
             * the rich value
             * these fields need to have the name of fieldname + _html
             */
            let richValue = targetValue;
            if( rowDataObject[fieldname+'_html'] ){
                richValue = rowDataObject[fieldname+'_html'];
            }

            this.textAreaElement.addClass('ace-hide');
            this.trixContainer.removeClass('ace-hide');
            $(this.trixEditor[0].editor.element).html(richValue);
        }
        this.form.ace('show');

    },
    forceCellEditDone : function(id){
        this.dissmissEditCellInput(id,'nowhere',false);
    },

    dissmissEditCellInput : function(id,goToNext,updateValue){
        if( !this.instanceMap[id] ){ return; }//this object does not exist

        let value = '';
        let extraFieldValues = {};

        if( updateValue ) {
            if ( this.configObj.returnSimpleText == 1 ) {
                value = this.textAreaField.ace('value');
            } else {
                value = this.trixEditor[0].editor.getDocument().toString();
                extraFieldValues[this.instanceMap[id].fieldname+'_html'] = this.trixEditor[0].value;
            }
        }else{
            value = this.instanceMap[id].rowDataObject[this.instanceMap[id].fieldname];
        }

        aetu.cellEditDone(
            id,
            value,
            this.configObj.navigatetonext ? goToNext : 'nowhere',
            extraFieldValues);

        $.aceOverWatch.utilities.runIt(
            this.configObj.oneditdone,
            this.instanceMap[id].tableObj,
            this.instanceMap[id].container.parent().attr('ridx'),
            this.instanceMap[id].fieldname,
            updateValue
        );

        delete this.instanceMap[id];
    },
    triggerEvent : function(tableObj,configObj,tableId){},//does nothing, needed to comply with the plugin interface

    getForm : function(){
        if( !this.form ){
            this.form = $('<div id="aet-pf-'+this.id+'" class="ace-hide"></div>').appendTo($('body'));
            $('<div id="aet-pf-'+this.id+'-tpl" class="ace-hide">'+
                '<div class="ace-col-12 aet-edit-target" ac_category="1" ac_related_trix_field_id="eet-plugin-ac-trix"></div>'+
                '<div class="ace-col-12 trix-container"></div>'+
                '</div>').appendTo($('body'));
            this.form.ace('create',{
                type:'form',
                ftype: 'popup',
                template:'aet-pf-'+this.id+'-tpl',
                validate: true,
                displaysavebtn: true,
                displaycancelbtn: true,
                sendallfieldsonsave: true,
                hideonescape : true,
                checkdirtyoncancel : false,
                idfield: 'id',
                onshow: function (f) {
                    aetuCellEditPluginTextareaAutoCompleteWM.onFormCustomShow();
                },
                customhide: function (f) {
                    aetuCellEditPluginTextareaAutoCompleteWM.onFormCustomHide();
                },
                oninit : function() {
                    aetuCellEditPluginTextareaAutoCompleteWM.onFormInit();
                },
                onlocalsavesuccessfull: function (target, record) {
                    aetuCellEditPluginTextareaAutoCompleteWM.onFormSaveSuccessfull(record);
                },
                onbeforeloadrecord : function ( form, record) {
                    aetuCellEditPluginTextareaAutoCompleteWM.onFormBeforeLoadRecord(record);
                },
                onafterloadrecord : function ( form, record) {
                    aetuCellEditPluginTextareaAutoCompleteWM.onFormAfterLoadRecord(record);
                },
            });
        }
        return this.form;
    },
    onFormInit : function(){
        this.textAreaField = this.form.find('.aet-edit-target').ace('create',{
            type: 'textarea',
            fieldname: 'target',
            badgeicon: "fa fa-text",
            badgecallback: 'displayFloatingACWidgetForField',
        });
        this.textAreaElement = this.textAreaField.find('textarea');

        this.trixContainer = this.form.find('.trix-container');
        this.trixContainer.addClass('ace-hide').html('<trix-editor id="eet-plugin-ac-trix"></trix-editor>');
        this.trixEditor = $('#eet-plugin-ac-trix');


    },
    onFormBeforeLoadRecord : function(record){
        this.textAreaField.ace('modify',{
            label : record.val('label'),
            rows : this.instanceMap[record.val('instanceId')].rows
        })
            .attr('ac_subcategory',record.val('_serviciu_medical_id'))
            .attr('ac_user',record.val('_medic_consult_id'));
        this.textAreaElement = this.textAreaField.find('textarea');
    },
    onFormAfterLoadRecord : function(record){
        record.val('saveOnHide',false);
        this.currentSavedRecord = record;
    },
    onFormSaveSuccessfull : function(record){
        record.val('saveOnHide',true);
        this.form.ace('cancel');
    },
    onFormCustomShow : function(){
        this.form.addClass('ace-show').removeClass('ace-hide');
        setTimeout(function(target){target.focus();},100,this.textAreaField.find('textarea'));
    },
    onFormCustomHide : function(){
        this.form.removeClass('ace-show').addClass('ace-hide');
        this.dissmissEditCellInput(
            this.currentSavedRecord.val('instanceId'),
            this.currentSavedRecord.val('saveOnHide') ? 'right' : 'nowhere',
            this.currentSavedRecord.val('saveOnHide')
        );
    },
    allowToBeTriggeredFromPreviousEditCell : function(){ return true; }

};
aetuPluginManager.register(aetuCellEditPluginTextareaAutoCompleteWM);

$(function(){
    trixConfig.init();
});