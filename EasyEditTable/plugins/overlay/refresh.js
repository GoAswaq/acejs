/*
 * this plugin does the following:
 * - it displays an Export element in the table toolbar, and, when clicked, it will save the contents of the table in an Excel file
 */
var aetuOverlayPluginRefresh = {
    type : 'OVERLAY',
    name : 'refresh',
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

        $('<a class="ace-et-refresh ace-aet-print-hide ace-et-toolbar-el fa-sync" href="#">'+_aceL.reload+'</a>').
        appendTo(tableObj.container.find('.ace-et-toolbar')).
        unbind('click').click(function(e){
            aetuOverlayPluginRefresh.refresh($(this).parents('.ace-et-container').first().attr('aetid'));
        });

    },
    triggerEvent : function(tableObj,configObj,tableId){},//does nothing, needed to comply with the plugin interface,

    refresh : function(tableId){
        if( !this.configObjMap[tableId] ){ return false; }
        this.configObj = this.configObjMap[tableId];

        let tableObj = aetu.getTableById(tableId);
        if( !tableObj ){ return false; }

        tableObj.load();
    }
};
aetuPluginManager.register(aetuOverlayPluginRefresh);