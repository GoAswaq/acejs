/*
 * this plugin does the following:
 * - it displays an Export element in the table toolbar, and, when clicked, it will save the contents of the table in an Excel file
 */
var aetuOverlayPluginCustomButton = {
    type : 'OVERLAY',
    name : 'custombutton',
    defaultConfigObj : {
        buttons : [

            // {
            //     title: 'Custom Button',
            //     iconcls : '',
            //     callback : false,
            // }

        ]

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

        for(let idx in this.configObj.buttons ){
            let button = this.configObj.buttons[idx];
            $('<a class="ace-et-custom ace-aet-print-hide ace-et-toolbar-el ace-et-custom-button '+button.iconcls+'" href="#">'+button.title+'</a>').
            appendTo(tableObj.container.find('.ace-et-toolbar')).
            unbind('click').click($.isFunction(button.callback)?button.callback:window[button.callback]);
        }
    },
    triggerEvent : function(tableObj,configObj,tableId){},//does nothing, needed to comply with the plugin interface,

};
aetuPluginManager.register(aetuOverlayPluginCustomButton);