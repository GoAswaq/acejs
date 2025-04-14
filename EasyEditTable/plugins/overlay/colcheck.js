/*
 * this plugin does the following:
 * - it detects the div which has the rows
 * - it in its place it adds another div, which will be spit in two: a tiny part of it for the checkbox, the rest for the original rows
 * - everytime a checkbox is checked, a class is set on the corresponding row to indicate selection
 */
var aetuOverlayPluginColcheck = {
    type : 'OVERLAY',
    name : 'colcheck',
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
        let tableHeaderPrefixId = 'ace-eet-'+tableObj.id+'-gridx-';
        this.configObj.rowsContainer = tableObj.container.find('.ace-et-main-rows-container');
        let colCheckEnvelope = $('<div class="ace-col-12 ace-row ace-et-plugin-col-check-envelope">'+
            '<div class="ace-thin-col-1 ace-et-col-check-column"></div>'+
            '<div class="ace-thin-col-23 ace-et-rows-column"></div>'+
            '</div>').insertBefore(this.configObj.rowsContainer);
        this.configObj.rowsContainer.detach().appendTo(colCheckEnvelope.find('.ace-et-rows-column'));
        //now, we need to build the actual rows, and checkboxes :)
        let rows = '';
        this.configObj.rowsContainer.children('div').each(function(){
            let row = $(this);
            let checkbox = '&nbsp;';
            let checkTypeClass=''
            if( row.hasClass('ace-et-table-header-row') ){
                checkbox = '<input type="checkbox" cgb="1"/>';//GLOBAL checkbox
            }else{
                if( row.hasClass('ace-et-data-row') ){
                    checkTypeClass='aet-row-check';
                    checkbox = '<input type="checkbox"  ridx="'+row.attr('ridx')+'" cgb="2"/>';//ROW checkbox
                }else{
                    if( row.hasClass('ace-et-group-header') ){//HEADER checkbox
                        checkTypeClass='aet-group-check';
                        checkbox = '<input type="checkbox"  gridx="'+row.attr('id').substr(tableHeaderPrefixId.length)+'" cgb="3"/>';//ROW checkbox
                    }

                }
            }
            //we do not use .css('height') because this rounds up the value, and it will trigger a wrong height computation
            rows += '<div class="'+row.attr('class')+' '+checkTypeClass+'" style="height:'+row[0].getBoundingClientRect().height+'px;">'+checkbox+'</div>';
        });
        colCheckEnvelope.find('.ace-et-col-check-column').html(rows);
        colCheckEnvelope.find('.ace-et-col-check-column').find('input[cgb="3"]').change(function(){//dealing with clicks on GROUP checkboxes
            let checked = $(this).prop('checked');
            let groupId = $(this).attr('gridx');
            let tableObj = aetu.getTableById($(this).parents('.ace-et-container').first().attr('aetid'));
            //need to find all rows belonging to this group
            let rows = tableObj.getAllRowsInGroup(groupId);
            let rowsEnvelope = tableObj.container.find('.ace-et-rows-envelope');
            let checksEnvelope = tableObj.container.find('.ace-et-col-check-column');
            for(let idx in rows ){
                if( checked ){
                    rowsEnvelope.find('[ridx="'+rows[idx]+'"]').addClass('ace-et-data-row-selected');
                    checksEnvelope.find('input[ridx="'+rows[idx]+'"]').prop('checked',true);
                }else{
                    rowsEnvelope.find('[ridx="'+rows[idx]+'"]').removeClass('ace-et-data-row-selected');
                    checksEnvelope.find('input[ridx="'+rows[idx]+'"]').prop('checked',false);
                }
            }

        });
        colCheckEnvelope.find('.ace-et-col-check-column').find('input[cgb="2"]').change(function(){//dealing with clicks on ROW checkboxes
            let rIdx = $(this).attr('ridx');
            let targetRow = $(this).parents('.ace-et-plugin-col-check-envelope').first().find('.ace-et-main-rows-container .ace-et-data-row[ridx="'+rIdx+'"]');
            if( $(this).prop('checked') ){
                targetRow.addClass('ace-et-data-row-selected');
            }else{
                targetRow.removeClass('ace-et-data-row-selected');
            }
        });
        colCheckEnvelope.find('.ace-et-col-check-column').find('input[cgb="1"]').change(function(){//dealing with clicks on THE GLOBAL checkbox
            let checked = $(this).prop('checked');
            $(this).parent().parent().find('input').prop('checked',checked);
            if( checked ){
                $(this).parents('.ace-et-plugin-col-check-envelope').first().find('.ace-et-main-rows-container .ace-et-data-row').addClass('ace-et-data-row-selected');
            }else{
                $(this).parents('.ace-et-plugin-col-check-envelope').first().find('.ace-et-main-rows-container .ace-et-data-row').removeClass('ace-et-data-row-selected');
            }
        });

    },
    triggerEvent : function(tableObj,configObj,tableId){},//does nothing, needed to comply with the plugin interface,

    getCheckedRows : function(tableId){
        let selectedRowsMap = {};
        if( !this.configObjMap[tableId] ){ return selectedRowsMap; }
        this.configObj = this.configObjMap[tableId];

        let tableObj = aetu.getTableById(tableId);
        if( !tableObj ){ return selectedRowsMap; }

        tableObj.container.find('.ace-et-col-check-column .aet-row-check input:checked').each(function(){
            selectedRowsMap[$(this).attr('ridx')] = true;
        });

        return selectedRowsMap;
    }

};
aetuPluginManager.register(aetuOverlayPluginColcheck);