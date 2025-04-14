/*
 * this plugin does the following:
 * - it expects that in the configuration to be specified a series of editable columns
 * - each time the value of one of these columns is changed on a row, all other rows which are
 * selected will be modified with the same value
 * Attention:
 * - to work correctly, the table which uses this plugin needs to use the colcheck plugin as well
 */
var aetuOverlayPluginGroupChange = {
    type : 'OVERLAY',
    name : 'groupchange',
    defaultConfigObj : {
        columns : []
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
        let canHaveGroupCols = false;
        let header = tableObj.container.find('.ace-et-main-rows-container .ace-et-table-header-row');
        this.configObj.colIndexes = {};
        for(let idx in this.configObj.columns ){
            let actualIdx = tableObj.columnsNameMap[this.configObj.columns[idx]];
            if( actualIdx == 'undefined' || tableObj.columns[actualIdx].readonly ){ continue; }
            canHaveGroupCols = true;
            this.configObj.colIndexes[actualIdx] = true;
            header.find('[cidx="'+actualIdx+'"]').append('<div class="ace-et-groupchange-plugin-trigger">'+
                '<label class="tooltip-trigger">'+
                '<i class="fa fa-files-o"></i><input type="checkbox">'+
                '<span class="tooltip">Activeaza editare pe selectie</span>'+
                '</label>'+
                '</div>');
        }
        if( !canHaveGroupCols ){
            return;
        }

        aetuPluginManager.addListener(this,'celleditdone',tableObj.id);

    },
    triggerEvent : function(eventName,tableId,configObj){
        this.configObj = this.configObjMap[tableId];
        if( !this.configObj || !(configObj.colIdx in this.configObj.colIndexes) ){
            return;
        }
        let tableObj = aetu.getTableById(tableId);
        if( !tableObj ){ return; }
        let isGroupColChecked = tableObj.container.find('.ace-et-main-rows-container .ace-et-table-header-row [cidx="'+configObj.colIdx+'"] [type="checkbox"]').prop('checked');
        if( !isGroupColChecked ){ return; }//the group functionality is not enabled

        let colCheckPlugin = tableObj.getOverlayPlugin('colcheck');
        if( !colCheckPlugin ){
            $.aceOverWatch.utilities.log('AET groupchange PLUGIN: failed to detect the colcheck plugin on the table id: '+tableId, 'error', false);
            return;
        }
        let checkedRows = colCheckPlugin.getCheckedRows(tableId);
        if( !checkedRows[configObj.rowIdx] ){
            return;
        }
        //delete checkedRows[configObj.rowIdx];

        if( Object.keys(checkedRows).length = 0 ){
            return;
        }
        tableObj.useBulkSave = true;

        for(let rowIdx in checkedRows ){
            tableObj.container.find('.ace-et-main-rows-container .ace-et-data-row[ridx="'+rowIdx+'"] .cell[cidx="'+configObj.colIdx+'"]').removeClass('aet-fc').html(
                tableObj.updateAndFormat(
                    rowIdx,
                    configObj.colIdx,
                    configObj.editValue)
            );
        }
        tableObj.useBulkSave = false;
        tableObj.startProcessSaveQueueInBulk();
    },

};
aetuPluginManager.register(aetuOverlayPluginGroupChange);