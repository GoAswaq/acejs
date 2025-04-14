/*
 * this plugin does the following:
 * - it inserts a column at the beginning of the table
 * - the data in this column is the index of the row
 */
var aetuOverlayPluginIndexColumn = {
    type : 'DATA',
    name : 'indexcol',
    defaultConfigObj : {
        firstRowIndex: 1,
        fieldname: '_idx',
        title: 'Nr.',
        aditionalclasses: 'ace-thin-col-1',
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
    modifyInitialConfig : function( configObj ){
        if( !configObj['columns'] ){
            configObj['columns'] = [];
        }
        configObj['columns'].splice(0,0, {
            fieldname: '_' + this.configObj['fieldname'],
            aditionalclasses: this.configObj['aditionalclasses'],
            readonly: true,
            title: this.configObj['title'],
        });
    },
    setupData : function( rows ){
        let currentIDx = this.configObj.firstRowIndex;
        for(let idx in rows ){
            rows[idx]['_' + this.configObj.fieldname] = currentIDx;
            currentIDx++;
        }
    },

};
aetuPluginManager.register(aetuOverlayPluginIndexColumn);