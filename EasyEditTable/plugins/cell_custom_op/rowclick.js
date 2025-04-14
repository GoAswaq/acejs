var aetuCellCustomOpPluginRowClick = {
    type : 'CELL_CUSTOM_OP',
    name : 'rowclick',
    instanceMap : {},
    defaultConfigObj : {
        customMethodName : '',
    },
    configObj : {},
    configObjMap : {

    },
    configure : function(tableObj,configObj){
        let configId = String(tableObj.id);
        if( !this.configObjMap[configId] ){
            this.configObjMap[configId] = $.extend({},this.defaultConfigObj,configObj);
        }
        this.configObj = this.configObjMap[configId];
    },
    customOperation : function( cell, cellDescriptor){
        let tableObj = cellDescriptor.tableObj;
        let configId = String(tableObj.id);
        let configObj = this.configObjMap[configId];
        if( configObj ){
            $.aceOverWatch.utilities.runIt(configObj.customMethodName,cellDescriptor);
        }
    },

};
aetuPluginManager.register(aetuCellCustomOpPluginRowClick);