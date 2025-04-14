/*
 * this plugin does the following:
 * - it displays an Export element in the table toolbar, and, when clicked, it will save the contents of the table in an Excel file
 */
var aetuOverlayPluginExportExcel = {
    type : 'OVERLAY',
    name : 'exportexcel',
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

        $('<a class="ace-et-expx ace-aet-print-hide ace-et-toolbar-el" href="#">Export</a>').
        appendTo(tableObj.container.find('.ace-et-toolbar')).
        unbind('click').click(function(e){
            aetuOverlayPluginExportExcel.exportToExcel($(this).parents('.ace-et-container').first().attr('aetid'));
        });

    },
    triggerEvent : function(tableObj,configObj,tableId){},//does nothing, needed to comply with the plugin interface,

    exportToExcel : function(tableId){
        if( !this.configObjMap[tableId] ){ return false; }
        this.configObj = this.configObjMap[tableId];

        let tableObj = aetu.getTableById(tableId);
        if( !tableObj ){ return false; }

        //we use a plugin, and for tableObj we need the data to be an actual table
        let headerParts = [];
        for(let colIdx = 0; colIdx < tableObj.columns.length; colIdx++){
            headerParts.push('<th>'+tableObj.columns[colIdx]['title']+'</th>');
        }
        let header = '<tr>'+headerParts.join('')+'</tr>';
        let rows = [];
        for(let rowIdx = 0; rowIdx < tableObj.data.length; rowIdx++){

            let row = [];
            for(let colIdx = 0; colIdx < tableObj.columns.length; colIdx++){

                row.push('<td>' +
                    tableObj.data[rowIdx][tableObj.columns[colIdx]['fieldname']] +
                    '</td>');
            }

            rows.push('<tr>'+row.join('')+'</tr>');
        }

        $('body').append('<div id="tmp-hidden-tbl-container" class="ace-hide"></div>');
        $('#tmp-hidden-tbl-container').html('<table>'+header+rows.join('')+'</table>');
        TableToExcel.convert(document.querySelector("#tmp-hidden-tbl-container"),{
            name: "export.xlsx",
            sheet: {
                name: "Sheet 1"
            }
        });
        $('#tmp-hidden-tbl-container').remove();

    }
};
aetuPluginManager.register(aetuOverlayPluginExportExcel);