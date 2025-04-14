var aetuCellEditPluginTextarea = {
    type : 'CELL_EDIT',
    name : 'textarea',
    instanceMap : {},
    defaultConfigObj : {
        rows : 5,
    },
    configObj : {},
    configObjMap : {},
    configure : function(tableObj,colIdx,configObj){
        let configId = String(tableObj.id)+'-'+colIdx;
        if( !this.configObjMap[configId] ){
            this.configObjMap[configId] = $.extend({},this.defaultConfigObj,configObj);
        }
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

        let record = $.aceOverWatch.record.create({
            target :   $.aceOverWatch.utilities.isVoid(this.instanceMap[id].originalValue,true) ? '' : this.instanceMap[id].originalValue,
            label : tableObj.columns[tableObj.columnsNameMap[fieldname]].title,
            instanceId : id,
            'id' : 1,//hardcoded, as to not be regarded as a new record by the form
        },'id');
        this.getForm().ace('value',record);
        this.form.ace('show');

    },
    forceCellEditDone : function(id){
        this.dissmissEditCellInput(id,'nowhere',false);
    },

    dissmissEditCellInput : function(id,goToNext,updateValue){
        if( !this.instanceMap[id] ){ return; }//this object does not exist
        aetu.cellEditDone(
            id,
            updateValue
                ? this.textAreaField.ace('value')
                : this.instanceMap[id].rowDataObject[this.instanceMap[id].fieldname],
            goToNext);
        delete this.instanceMap[id];
    },
    triggerEvent : function(tableObj,configObj,tableId){},//does nothing, needed to comply with the plugin interface

    getForm : function(){
        if( !this.form ){
            this.form = $('<div id="aet-pf-'+this.id+'" class="ace-hide"></div>').appendTo($('body'));
            $('<div id="aet-pf-'+this.id+'-tpl" class="ace-hide"><div class="ace-col-12 aet-edit-target"></div></div>').appendTo($('body'));
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
                    aetuCellEditPluginTextarea.onFormCustomShow();
                },
                customhide: function (f) {
                    aetuCellEditPluginTextarea.onFormCustomHide();
                },
                oninit : function() {
                    aetuCellEditPluginTextarea.onFormInit();
                },
                onlocalsavesuccessfull: function (target, record) {
                    aetuCellEditPluginTextarea.onFormSaveSuccessfull(record);
                },
                onbeforeloadrecord : function ( form, record) {
                    aetuCellEditPluginTextarea.onFormBeforeLoadRecord(record);
                },
                onafterloadrecord : function ( form, record) {
                    aetuCellEditPluginTextarea.onFormAfterLoadRecord(record);
                },
            });
        }
        return this.form;
    },
    onFormInit : function(){
        this.textAreaField = this.form.find('.aet-edit-target').ace('create',{
            type: 'textarea',
            fieldname: 'target',
        });
    },
    onFormBeforeLoadRecord : function(record){
        this.textAreaField.ace('modify',{
            label : record.val('label'),
            rows : this.instanceMap[record.val('instanceId')].rows
        });
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
aetuPluginManager.register(aetuCellEditPluginTextarea);