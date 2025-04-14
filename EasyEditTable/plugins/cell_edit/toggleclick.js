var aetuCellEditPluginStandardToggleClick = {
    type : 'CELL_EDIT',
    name : 'toggleclick',
    defaultConfigObj : {
        on : 1,
        off : 0,
        getExtraFieldsToSave : false,//function, or name of a function which returns an object with more fields to be saved
        //function(rowDataObject,fieldname,tblObj,newValue)
    },
    configObj : {},
    configObjMap : {

    },
    configure : function(tableObj,colIdx,configObj){
        let configId = String(tableObj.id)+'-'+colIdx;
        if( !this.configObjMap[configId] ){
            this.configObjMap[configId] = $.extend({},this.defaultConfigObj,configObj);
        }
        this.configObj = this.configObjMap[configId];
    },
    drawYourself : function( tableObj, id, container, rowDataObject, fieldname ){

        let newValue = rowDataObject[fieldname] == this.configObj.on ? this.configObj.off : this.configObj.on;

        let extraFields = null;
        let $res = $.aceOverWatch.utilities.runIt(this.configObj.getExtraFieldsToSave,rowDataObject,fieldname,tableObj,newValue);
        if( $.aceOverWatch.utilities.wasItRan($res) ){
            extraFields = $res;
        }

        aetu.cellEditDone(
            id,
            newValue,
            false,
            extraFields);
    },
    forceCellEditDone : function(id){},//does nothing, needed to comply with the plugin interface
    triggerEvent : function(tableObj,configObj,tableId){},//does nothing, needed to comply with the plugin interface
    allowToBeTriggeredFromPreviousEditCell : function(){ return false; }

};
aetuPluginManager.register(aetuCellEditPluginStandardToggleClick);