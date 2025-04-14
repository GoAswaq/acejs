var aetuCellEditPluginStandardCheckboxInput = {
    type : 'CELL_EDIT',
    name : 'checkbox',
    instanceMap : {},
    defaultConfigObj : {
        on : 1,
        off : 0,
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

        let input = $('<input peid="'+id+'" type="checkbox" '+(this.instanceMap[id].originalValue==this.configObj.on?'checked':'')+' />');

        input.
        change(function(){
            aetuCellEditPluginStandardCheckboxInput.dissmissEditCellInput($(this).attr('peid'),'nowhere',true);//do not go to the next one here
        }).keydown(function (e) {

            switch(e.keyCode){
                case 13://enter
                    aetuCellEditPluginStandardCheckboxInput.dissmissEditCellInput($(this).attr('peid'),'right',true);
                    break;
                case 27://escape
                    aetuCellEditPluginStandardCheckboxInput.dissmissEditCellInput($(this).attr('peid'),'nowhere',false);
                    break;
                case 38: // up arrow
                    aetuCellEditPluginStandardCheckboxInput.dissmissEditCellInput($(this).attr('peid'),'above',true);
                    break;
                case 40: // down arrow
                    aetuCellEditPluginStandardCheckboxInput.dissmissEditCellInput($(this).attr('peid'),'below',true);
                    break;
            }

            return false;
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
        aetu.cellEditDone(
            id,
            updateValue
                ? (this.instanceMap[id].input.prop('checked') ? this.configObj.on : this.configObj.off)
                : this.instanceMap[id].rowDataObject[this.instanceMap[id].fieldname],
            goToNext);
        delete this.instanceMap[id];
    },
    triggerEvent : function(tableObj,configObj,tableId){},//does nothing, needed to comply with the plugin interface

    allowToBeTriggeredFromPreviousEditCell : function(){ return true; }

};
aetuPluginManager.register(aetuCellEditPluginStandardCheckboxInput);