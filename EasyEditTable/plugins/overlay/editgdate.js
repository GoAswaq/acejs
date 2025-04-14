/*
 * this plugin does the following:
 */
var aetuOverlayPluginEditGeneratedDate = {
    type : 'OVERLAY',
    name : 'editgdate',
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

        tableObj.container.find('.ace-et-toolbar .ace-aet-gdate').unbind('click').on('click',function(event) {
            if ( event.ctrlKey ) {

                let tableObj = aetu.getTableById(($(this).parents('.ace-et-container').first().attr('aetid')));
                $.aceOverWatch.prompt.show('Care este noua data?',
                    function(value, cfg){
                        if( !$.aceOverWatch.utilities.isVoid(value,true) ){
                            value = value.trim();
                        }else{
                            value = '';
                        }
                        cfg.tableObj.generatedtime = value;
                        cfg.tableObj.container.find('.ace-et-toolbar .ace-aet-gdate').html(value);
                    },
                    {
                        type:'prompt',
                        value: tableObj.container.find('.ace-et-toolbar .ace-aet-gdate').html(),
                        tableObj : tableObj,
                    }
                );

            }

        });

    },
    triggerEvent : function(tableObj,configObj,tableId){},//does nothing, needed to comply with the plugin interface,

};
aetuPluginManager.register(aetuOverlayPluginEditGeneratedDate);