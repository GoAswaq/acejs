/*
 * this plugin does the following:
 * - it displays an Export element in the table toolbar, and, when clicked, it will save the contents of the table in an Excel file
 */
var aetuOverlayPluginPrintPage = {
    type : 'OVERLAY',
    name : 'printpage',
    defaultConfigObj : {
        orientation: 'portrait',//can be: landscape
        custombeforeprint : false,//function or the name of a function to be called before printing function(tableObj)
        customafterprint : false,//function or the name of a function to be called before printing function(tableObj)
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

        $('<a class="ace-et-print ace-aet-print-hide ace-et-toolbar-el fa-print" href="#">'+_aceL.print+'</a>').
        appendTo(tableObj.container.find('.ace-et-toolbar')).
        unbind('click').click(function(e){
            aetuOverlayPluginPrintPage.print($(this).parents('.ace-et-container').first().attr('aetid'));
        });

    },
    triggerEvent : function(tableObj,configObj,tableId){},//does nothing, needed to comply with the plugin interface,

    print : function(tableId){
        if( !this.configObjMap[tableId] ){ return false; }
        this.configObj = this.configObjMap[tableId];

        let tableObj = aetu.getTableById(tableId);
        if( !tableObj ){ return false; }

        /*
         * attempting to set orientation css
         */
        let headerPrintStyle = $('head #et-print-style');
        if( headerPrintStyle.length == 0 ){
            headerPrintStyle = $('<style id="et-print-style"></style>').appendTo('head');
        }
        headerPrintStyle.html('@media print {@page { size: '+this.configObj['orientation']+'; }}');

        let res = $.aceOverWatch.utilities.runIt(this.configObj['custombeforeprint'],tableObj);
        if( !$.aceOverWatch.utilities.wasItRan(res) || res == true ){
            window.print();
        }

        $.aceOverWatch.utilities.runIt(this.configObj['customafterprint'],tableObj);

        /*
         * cleanup print stlye
         */
        headerPrintStyle.html('');

    }
};
aetuPluginManager.register(aetuOverlayPluginPrintPage);