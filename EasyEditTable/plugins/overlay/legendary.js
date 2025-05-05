/*
 * this plugin does the following:
 * - add a legend to the table
 * - it expects the existence of a global user define function with the name getEasyEditTableDictionary
 * - the function should return an object with the following structure:
 * {
 *   '[DICTIONARY_NAME]' : {
 *          ....
 *          [ID] : {
              code: [AAAA],
              color: [BBB],
              name: [CCC],
 *          }
 *          ....
 *  }
 *
 *  an alternative to the global getEasyEditTableDictionary is the use of the configuration getDictionary, which has a similar use
 *
 * }
 *
 * The columns for which a legend should be displayed need to have the following property:
 *  - legendarydictionary = the name of the dictionary from the object returned by getEasyEditTableDictionary
 *          which is going to be used to draw the legend
 */
var aetuOverlayPluginLegendary = {
    type : 'OVERLAY',
    name : 'legendary',
    defaultConfigObj : {
        getDictionary : null,//function which returns the dictionaries; if missing, getEasyEditTableDictionary should be used
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

        let dictionaryObj;
        if( this.configObjMap[tableObj.id].getDictionary ){
            let formattedContent = $.aceOverWatch.utilities.runIt(this.configObjMap[tableObj.id].getDictionary);
            dictionaryObj =  $.aceOverWatch.utilities.wasItRan(formattedContent) ? formattedContent : {};
        }else{
            dictionaryObj = $.aceOverWatch.utilities.runIt('getEasyEditTableDictionary');
        }

        if( typeof dictionaryObj !== 'object' ){ return; }

        let legend = $('<div class="aet-legend ace-col-12"><h2 class="ace-col-12">Legenda</h2></div>');
        let atLeastOneLegendAdded = false;
        for(let idx=0;idx<tableObj.columns.length;idx++){
            let dictionaryName = tableObj.columns[idx]['legendarydictionary'];
            if( !$.aceOverWatch.utilities.isVoid(dictionaryName) && dictionaryObj[dictionaryName] ){
                let dictionary = dictionaryObj[dictionaryName];
                let legendContainer = $('<div class="aet-legend-container ace-col-12"></div>').appendTo(legend);
                let legendTitle = $('<div class="aet-legend-title ace-col-12"><h4>'+tableObj.columns[idx]['title']+'</h4></div>').appendTo(legendContainer);
                let legendBody = $('<ul class="aet-legend-body ace-col-12"></ul>').appendTo(legendContainer);
                for(let key in dictionary){
                    let legendItem = $('<li class="aet-legend-item ace-col-12"></li>').appendTo(legendBody);
                    let legendItemColor = $('<div class="aet-legend-item-color ace-col-1">'+dictionary[key].code+': </div>').appendTo(legendItem);
                    let legendItemName = $('<div class="aet-legend-item-name ace-col-11">'+dictionary[key].name+'</div>').appendTo(legendItem);
                    legendItemColor.css('color',dictionary[key].color);
                }
                atLeastOneLegendAdded = true;
            }
        }


        if( atLeastOneLegendAdded ){
            tableObj.container.append(legend);
        }

    },
    triggerEvent : function(tableObj,configObj,tableId){},//does nothing, needed to comply with the plugin interface,

};
aetuPluginManager.register(aetuOverlayPluginLegendary);