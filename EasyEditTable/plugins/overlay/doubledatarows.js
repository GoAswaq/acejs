/*
 * this plugin does the following:
 * - it displays an Export element in the table toolbar, and, when clicked, it will save the contents of the table in an Excel file
 */
var aetuOverlayPluginDoubleDataRows = {
    type : 'OVERLAY',
    name : 'doubledatarows',
    defaultConfigObj : {

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

        if( tableObj.filterform.find('[fieldname="_ddr"]').ace('value') == 1 ) {
            tableObj.container.find('.ace-et-rows-envelope').addClass('ace-et-double-data-rows');
        }else{
            tableObj.container.find('.ace-et-rows-envelope').removeClass('ace-et-double-data-rows');
        }

    },
    triggerEvent : function(tableObj,configObj,tableId){},//does nothing, needed to comply with the plugin interface,

};
aetuPluginManager.register(aetuOverlayPluginDoubleDataRows);