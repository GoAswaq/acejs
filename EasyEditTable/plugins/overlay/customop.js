/*
 * this plugin does the following:
 * - it executes a custom method after the table has been drawn
 */
var aetuOverlayPluginCustomOperation = {
    type : 'OVERLAY',
    name : 'customop',
    defaultConfigObj : {
        custommethod : null,//function, or the name of a function which will be called if exists: function(tableObj)
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
    drawYourself : function( tableObj ){
        $.aceOverWatch.utilities.runIt(this.configObj.custommethod,tableObj);
    },
    triggerEvent : function(tableObj,configObj,tableId){},//does nothing, needed to comply with the plugin interface,
};
aetuPluginManager.register(aetuOverlayPluginCustomOperation);