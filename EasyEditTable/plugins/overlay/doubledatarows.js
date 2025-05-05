/*
 * this plugin does the following:
 * - it increases the size of of the rows
 * - if the table has a filter form, the rows will be increased only if the filter contains an ace field with the fieldname _ddr, and if its value is 1
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

        //using .children() and not the direct row container, because there might be plugins, like colcheck, who will add extra columns outside the main rows container
        if( !tableObj.filterform || tableObj.filterform.find('[fieldname="_ddr"]').ace('value') == 1 ) {
            tableObj.container.children().addClass('ace-et-double-data-rows');
        }else{
            tableObj.container.children().removeClass('ace-et-double-data-rows');
        }

    },
    triggerEvent : function(tableObj,configObj,tableId){},//does nothing, needed to comply with the plugin interface,

};
aetuPluginManager.register(aetuOverlayPluginDoubleDataRows);