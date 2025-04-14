var aetuCellEditPluginStandardTextInput = {
    type : 'CELL_EDIT',
    name : 'text',
    instanceMap : {},
    configObj : {
        getExtraFieldsToSave : false,//function, or name of a function which returns an object with more fields to be saved
        //function(rowDataObject,fieldname,tblObj,newValue)
    },
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
        if( $.aceOverWatch.utilities.isVoid(this.instanceMap[id].originalValue,true) ){
            this.instanceMap[id].originalValue = '';
        }

        let input = $('<input peid="'+id+'" type="text" value="'+this.instanceMap[id].originalValue+'"/>');

        input.
        change(function(){
            aetuCellEditPluginStandardTextInput.dissmissEditCellInput($(this).attr('peid'),'nowhere',true);//do not go to the next one here
        }).keydown(function (e) {

            switch(e.keyCode){
                case 13://enter
                    aetuCellEditPluginStandardTextInput.dissmissEditCellInput($(this).attr('peid'),'right',true);
                    break;
                case 27://escape
                    aetuCellEditPluginStandardTextInput.dissmissEditCellInput($(this).attr('peid'),'nowhere',false);
                    break;
                case 38: // up arrow
                    aetuCellEditPluginStandardTextInput.dissmissEditCellInput($(this).attr('peid'),'above',true);
                    return false;//because otherwise the table might scroll
                case 40: // down arrow
                    aetuCellEditPluginStandardTextInput.dissmissEditCellInput($(this).attr('peid'),'below',true);
                    return false;//because otherwise the table might scroll
            }

        }).
        focus(function(){$(this).select();});
        container.append(input);
        input.focus();

        this.instanceMap[id].input = input;
    },
    forceCellEditDone : function(id){
        this.dissmissEditCellInput(id,'nowhere',false);
    },

    dissmissEditCellInput : function(id,goToNext,updateValue){
        if( !this.instanceMap[id] ){ return; }//this object does not exist

        let newValue = updateValue ? this.instanceMap[id].input.val() : this.instanceMap[id].rowDataObject[this.instanceMap[id].fieldname];

        let extraFields = null;
        let $res = $.aceOverWatch.utilities.runIt(this.configObj.getExtraFieldsToSave,this.instanceMap[id].rowDataObject,this.instanceMap[id].fieldname,this.instanceMap[id].tableObj,newValue)
        if( $.aceOverWatch.utilities.wasItRan($res) ){
            extraFields = $res;
        }

        aetu.cellEditDone(
            id,
            newValue,
            goToNext,
            extraFields);
        delete this.instanceMap[id];
    },
    triggerEvent : function(tableObj,configObj,tableId){},//does nothing, needed to comply with the plugin interface

    allowToBeTriggeredFromPreviousEditCell : function(){ return true; }

};
aetuPluginManager.register(aetuCellEditPluginStandardTextInput);