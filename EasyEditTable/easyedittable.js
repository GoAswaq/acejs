var aetu = {//aceEasyTableUtils

	lastEditedCell : false,
	aetids : 0,//ace easy table ids
	aetMap : {},//id to table object
	getNextId : function(){ return ++this.aetids; },
	register : function(table){ this.aetMap[table.id] = table; },
	getTableById : function(id){ return this.aetMap[id]; },

	currentEditCellId : false,
	editCellPluginMap : {},

	triggerEditCell : function(cell,forceDismissPreviousEditCell = true,direction='') {
		if( cell.length == 0 ){ return; }//this might happen when the last editable cell in the table finished editing, and tried to find the NEXT available editable cell
		let cellDescriptor = this.getCellDescriptor(cell);
		let pluginObj = cellDescriptor.tableObj.getEditCellPlugin(cellDescriptor.colIdx);
		if( !pluginObj ){
			console.log('No plugin could be found for editing the cell: '+cellDescriptor.colIdx);
			return;
		}
		if( this.currentEditCellId == cellDescriptor.editCellId ){
			return;
		}
		if( forceDismissPreviousEditCell ){
			if( this.editCellPluginMap[this.currentEditCellId] ){
				this.editCellPluginMap[this.currentEditCellId].plugin.forceCellEditDone(this.currentEditCellId);
			}
		}

		if(
			direction === 'right'
			&& !pluginObj.allowToBeTriggeredFromPreviousEditCell()
		){
			return;
		}

		this.currentEditCellId = cellDescriptor.editCellId;
		this.editCellPluginMap[this.currentEditCellId] = {
			plugin : pluginObj,
			cell : cell,
			cellDescriptor : cellDescriptor,
		},
		cell.addClass('aet-fc').html('');
		pluginObj.drawYourself(
			cellDescriptor.tableObj,
			cellDescriptor.editCellId,
			cell,
			cellDescriptor.rowData,
			cellDescriptor.fieldname);
	},
	triggerCustomCellOperation : function(cell){
		let cellDescriptor = this.getCellDescriptor(cell);
		if( !cellDescriptor ){ return; }

		/*
		 * now, lets check if we have plugins
		 */
		if( cellDescriptor.tableObj.cellcustomplugins && typeof(cellDescriptor.tableObj.cellcustomplugins) == 'object' ){
			for(let pluginName in cellDescriptor.tableObj.cellcustomplugins ){
				let plugin = cellDescriptor.tableObj.getCustomCellOperationPlugin(pluginName);
				if( !plugin ){ continue; }//the plugin could not be found
				plugin.customOperation(cell,cellDescriptor);
			}
		}
	},
	triggerResetCell : function(cell){
		let cellDescriptor = this.getCellDescriptor(cell);
		let val = cellDescriptor.tableObj.resetInitialValue(cellDescriptor.rowIdx,cellDescriptor.colIdx);
		cell.html(cellDescriptor.tableObj.formatCellData(cellDescriptor.colIdx,val,cellDescriptor.tableObj.data[cellDescriptor.rowIdx]));
		cellDescriptor.tableObj.performFinalSaveStep(cellDescriptor.rowIdx,cellDescriptor.colIdx,true);
	},

	triggerEditNextCell : function(cell,forceDismissPreviousEditCell = true,direction=''){
		/*
		 * trying to edit the next cell on the row,
		 * or the first editable cell on the next row, if there is one
		 */
		let nextEditCellOnRow = cell.nextAll('.ace-tec');
		if( nextEditCellOnRow.length > 0){
			aetu.triggerEditCell(nextEditCellOnRow.first(),forceDismissPreviousEditCell,direction);
		}else{
			aetu.triggerEditCell(cell.parent().nextAll('[ridx]:first').find('.ace-tec').first(),forceDismissPreviousEditCell,direction);
		}
	},

	triggerEditAboveCell : function(cell,forceDismissPreviousEditCell= true,direction=''){
		aetu.triggerEditCell(cell.parent().prevAll('[ridx]:first').find(':nth-child('+(parseInt(cell.attr('cidx'))+1)+')'),forceDismissPreviousEditCell,direction);
	},
	triggerEditBellowCell : function(cell,forceDismissPreviousEditCell= true,direction=''){
		aetu.triggerEditCell(cell.parent().nextAll('[ridx]:first').find(':nth-child('+(parseInt(cell.attr('cidx'))+1)+')'),forceDismissPreviousEditCell,direction);
	},

	/**
	 * When an edit plugin finishes the editing operations, it calls this method
	 * in most cases only the field associated with the column was changed
	 * but in some situations, some plugins might return multiple fields changed
	 * all these extra fields can be found in the extraFieldValuesObj as key value pairs
	 *
	 * @param cellEditId
	 * @param editValue
	 * @param goToNext
	 * @param extraFieldValuesObj
	 */
	cellEditDone : function(cellEditId,editValue,goToNext=false, extraFieldValuesObj = null){
		console.log('===-> cell edit done');
		if( !this.editCellPluginMap[cellEditId] ){ return; }

		let cell = this.editCellPluginMap[cellEditId].cell;

		let originalValue = this.editCellPluginMap[cellEditId].cellDescriptor.rowData[this.editCellPluginMap[cellEditId].cellDescriptor.fieldname];

		aetuPluginManager.triggerEvent('celleditdone',
			this.editCellPluginMap[cellEditId].cellDescriptor.tableObj.id,
			{
				editValue : editValue,
				originalValue : originalValue,
				rowIdx : this.editCellPluginMap[cellEditId].cellDescriptor.rowIdx,
				colIdx : this.editCellPluginMap[cellEditId].cellDescriptor.colIdx,
			}
		);

		cell.removeClass('aet-fc').html(
			this.editCellPluginMap[cellEditId].cellDescriptor.tableObj.updateAndFormat(
				this.editCellPluginMap[cellEditId].cellDescriptor.rowIdx,
				this.editCellPluginMap[cellEditId].cellDescriptor.colIdx,
				editValue,
				extraFieldValuesObj)
		);

		delete this.editCellPluginMap[cellEditId];
		if( this.currentEditCellId == cellEditId ){
			this.currentEditCellId = false;
		}

		switch( goToNext ){

			case 'right':
				aetu.triggerEditNextCell(cell,false,goToNext);
				break;
			case 'above':
				aetu.triggerEditAboveCell(cell,false,goToNext);
				break;
			case 'below':
				aetu.triggerEditBellowCell(cell,false,goToNext);
				break;

			case 'nowhere'://do ont go anywhere
				break;
		}

	},

	forceReSave : function(cell){
		let cellDescriptor = this.getCellDescriptor(cell);
		cellDescriptor.tableObj.save(cellDescriptor.rowIdx,cellDescriptor.colIdx,cellDescriptor.tableObj.value(cellDescriptor.rowIdx,cellDescriptor.colIdx));
	},

	getCellDescriptor : function(cell){
		/*
		 * lets make sure that we really are on a cell
		 */
		if( !cell.hasClass('cell') ){//this might happen when we clicked on an inner cell element: from a renderer, or an edit plugin
			cell = cell.parents('.cell').first();
		}
		let descriptor = {
			tableObj 	: this.getTableById(cell.parents('.ace-et-container').first().attr('aetid')),
			rowIdx 		: cell.parent().attr('ridx'),
			colIdx 	: cell.attr('cidx'),
		};
		if( descriptor.tableObj === undefined || descriptor.rowIdx === undefined || descriptor.colIdx === undefined){
			return;//not a valid table cell
		}
		descriptor.editCellId = String(descriptor.tableObj.id)+'-'+String(descriptor.rowIdx)+'-'+String(descriptor.colIdx);
		descriptor.rowData = descriptor.tableObj.data[descriptor.rowIdx];
		descriptor.fieldname = descriptor.tableObj.columns[descriptor.colIdx].fieldname;
		return descriptor;
	},

	convertBasicThinkITReportStructureToTableConfig : function(source){
		//the internal setting overrides the thinkIT settings
		return conversionObject = {
			columns : source['columns'],
			idfield : source['idfield'] || source['id_field'],
			showtotalsrow : source['showtotalsrow'] || source['with_totals'],
			subgroups : source['subgroups'] || source['sub_groups'],
			sortBySubgroupsOnce : source['sortBySubgroupsOnce']==1  || source['sortBySubgroupsOnce'] === true,
			virtualfields : source['virtualfields'] || source['virtual_fields'],
			title : source['title'] || source['title'],
			generatedtime : source['generatedtime'],
			overlayplugins : source['overlayplugins'],
			cellcustomplugins : source['cellcustomplugins'],
			dataplugins : source['dataplugins'],
			otherdata : source['otherdata'],
		};
	},

	/**
	 *
	 * @param data - data to sort
	 * @param sortFields - array of objects, where each object has the following structure:
	 *        fieldname - the fieldname to sort by
	 *        ascending - true if we want to sort ascending, false if we want to sort descending
	 * @param virtualfields - the virtual fields information
	 */
	sortByMultipleFields : function(data,sortFields,virtualfields){
		if( data.length == 0 || sortFields.length == 0 ){ return; }
		let paramsArray1 = [];
		let paramsArray2 = [];

		let virtualFieldsMap = {};
		if( virtualfields && virtualfields.length > 0 ){
			for(let idx in virtualfields ){
				virtualFieldsMap[virtualfields[idx].fieldname] = idx;
			}
		}

		for(let idx in sortFields ){
			let prefix = sortFields[idx].ascending !== false ? '' : '-';
			/*
			 * if we have virtual fields for a sort field, we ignore the actual field, and use the virtual fields instead
			 */
			if( virtualFieldsMap[sortFields[idx].fieldname] != undefined && virtualfields[virtualFieldsMap[sortFields[idx].fieldname]].maxVirtualFields > 0){
				for (let idxVF = 0; idxVF < virtualfields[virtualFieldsMap[sortFields[idx].fieldname]].maxVirtualFields; idxVF++ ){
					paramsArray1.push(prefix+'aetu.simpleCompare(a.'+sortFields[idx].fieldname+idxVF+',b.'+sortFields[idx].fieldname+idxVF+')');
					paramsArray2.push(prefix+'aetu.simpleCompare(b.'+sortFields[idx].fieldname+idxVF+',a.'+sortFields[idx].fieldname+idxVF+')');
				}
			}else{
				paramsArray1.push(prefix+'aetu.simpleCompare(a.'+sortFields[idx].fieldname+',b.'+sortFields[idx].fieldname+')');
				paramsArray2.push(prefix+'aetu.simpleCompare(b.'+sortFields[idx].fieldname+',a.'+sortFields[idx].fieldname+')');
			}

		}

		let evalExpression = 'aetu.simpleCompare(['+paramsArray1.join(',')+'],['+paramsArray2.join(',')+']);';
		data.sort(function(a, b){
			return eval(evalExpression);
		});
	},
	simpleCompare : function(x,y){
		return x > y ? 1 : x < y ? -1 : 0;
	}

};

/**
 * constructor for easy edit table
 *
 * @param config object, where keys
 * 		columns: array of columns definitions
 * 		idfield: the field containing the ID of the data displayed in a row
 * 		net
 * 		showtotalsrow
 * 		filterform
 * 		rebuildafterload
 * 		overlayplugins
 * 	    cellcustomplugins
 * 	    dataplugins
 */
function ACEEasyTable(config){

	this.getDataPlugin = function(name){
		if( !this.dataplugins || !(name in this.dataplugins) ){ return false;}
		let plugin = aetuPluginManager.getPlugin('DATA',name);
		plugin.configure(this,this.dataplugins[name]);
		return plugin;
	};

	this.handleDataPluginsConfig = function(config){
		if( typeof(config.dataplugins) == 'object' ) {
			this.dataplugins = {};
			$.extend(this.dataplugins, config.dataplugins);
			delete config.dataplugins;
			if (this.dataplugins && typeof (this.dataplugins) == 'object') {
				for (let pluginName in this.dataplugins) {
					let plugin = this.getDataPlugin(pluginName);
					if (!plugin) {continue;}//the plugin could not be found
					plugin.modifyInitialConfig(config);
				}
			}
		}
	};

	this.handleDataPluginsRowModifications = function(rows){
		if (this.dataplugins && typeof (this.dataplugins) == 'object') {
			for (let pluginName in this.dataplugins) {
				let plugin = this.getDataPlugin(pluginName);
				if (!plugin) {continue;}//the plugin could not be found
				plugin.setupData(rows);
			}
		}
	};

	this.parseConfig = function(config){

		/*
		 * now, lets check if we have data plugins
		 */
		this.handleDataPluginsConfig(config);

		for(let field in config ) {
			if( config[field] != undefined ) {
				this[field] = config[field];
			}
		}

		this.columnsNameMap = {};
		for(let idx in this.columns ){
			this.columnsNameMap[this.columns[idx].fieldname] = idx;
		}

		this.columnsWithVirtualFields = {};//fieldname->idx in virtual fields
		for(let idx in this.virtualfields ){
			if( $.isFunction(this.virtualfields[idx].virtualfieldsparser) || $.isFunction(window[this.virtualfields[idx].virtualfieldsparser]) ){
				this.columnsWithVirtualFields[this.virtualfields[idx].fieldname] = idx;
			}
		}

		this.title = $.aceOverWatch.utilities.isVoid(config.title) ? 'Report' : config.title;
		this.genDate = '';
		this.generatedtime = config.generatedtime;
		if( !$.aceOverWatch.utilities.isVoid(config.generatedtime,true) ){
			this.genDate = ' <span class="ace-aet-gdate">('+config.generatedtime+')</span>';
		}
	};

	this.parseConfig(config);

	this.getHeaderContent = function(){
		let row = [];
		let hasHeaderGroups = false;
		let currentHeaderGroupText = '';
		for(let colIdx = 0; colIdx < this.columns.length; colIdx++){

			let headerGroupRelatedClasses = [];
			let headerAttribute = '';
			if( !$.aceOverWatch.utilities.isVoid(this.columns[colIdx].headergroup,true) ){
				hasHeaderGroups = true;
				headerGroupRelatedClasses.push('ace-aet-header-group');
				if( currentHeaderGroupText != this.columns[colIdx].headergroup ){
					currentHeaderGroupText = this.columns[colIdx].headergroup;
					headerGroupRelatedClasses.push('ace-aet-header-group-start');
					headerAttribute = 'groupname="'+currentHeaderGroupText+'"';
				}
				let nextCol = colIdx+1;
				if(
					nextCol >= this.columns.length
					|| (
							nextCol < this.columns.length
						&&	this.columns[nextCol].headergroup != currentHeaderGroupText
					)
				){
					headerGroupRelatedClasses.push('ace-aet-header-group-end');
					currentHeaderGroupText = '';
				}
			}
			row.push('<div cidx = "'+colIdx+'" class="cell title '+this.columns[colIdx]['aditionalclasses']+' ' +this.columns[colIdx]['aditionalgroupclasses']+' '+(headerGroupRelatedClasses.join(' '))+' " '+headerAttribute+' >'+this.columns[colIdx]['title']+'</div>');
		}
		return '<div class="ace-col-12 ace-et-table-header-row '+(hasHeaderGroups ? 'ace-et-nested-header' : '')+'">'+
					row.join('')+
				'</div>';
	};
	this.getSubgroupFooterContent = function(subgroupOrderIdx,subtotalColumns,subgroupParentId,force = false){
		let row = [];

		/*
		 *... SO.. FOR subgroups totals, the FIRST column contains the TITLE of the SUBGROUP
		 *  ATTENTION -
		 * 		- IF the first column is ALSO a column with an associated TOTAL... well.. tough luck
		 * 	    - that total will not be displayed
		 *      - just redesign the table, and add another column
		 * 		- do not use the first column as a TOTAL's COLUMN
		 */

		for(let colIdx = 0; colIdx < this.columns.length; colIdx++){
			row.push('<div cidx = "'+colIdx+'" class="cell '+this.columns[colIdx]['aditionalclasses']+'">'+
				(	colIdx == 0
				    ? this.getSubgroupFullPath(subgroupParentId)
					: this.getSubgroupFooterColContent(this.columns[colIdx].fieldname,subtotalColumns,subgroupParentId,force)
				)+
				'</div>');
		}
		return '<div class="ace-col-12 ace-et-row-highlight-noedit ace-et-row-group-footer" sgoidx="'+subgroupOrderIdx+'" id="ace-eet-'+this.id+'-gridx-footer-'+subgroupParentId+'" >'+row.join('')+'</div>';
	};
	this.getSubgroupFullPath = function(subgroupIdx){
		if( this.subgroupsMapNameTemp && this.subgroupsMapNameTemp[subgroupIdx] ){
			return this.subgroupsMapNameTemp[subgroupIdx];
		}
		return this.container.find('#ace-eet-'+this.id+'-gridx-'+subgroupIdx+' .ace-aeet-group-full').html();
	};
	this.getAllRowsInGroup = function(groupId){
		let rows = [];
		if( !this.groupsTotalsData[groupId] ){
			return rows;
		}
		rows = rows.concat(rows,this.groupsTotalsData[groupId].rows);
		for(let idx in this.groupsTotalsData[groupId].subgroup ){
			rows = rows.concat(this.getAllRowsInGroup(this.groupsTotalsData[groupId].subgroup[idx]));
		}
		return rows;
	};
	this.getSumSubgroupRecursive = function(fieldname,subgroupId, force = false){
		let sum = 0;
		if( !this.groupsTotalsData[subgroupId].computedRowSum ){
			this.groupsTotalsData[subgroupId].computedRowSum = {};
		}
		if( this.groupsTotalsData[subgroupId].computedRowSum[fieldname] == undefined || force ) {
			for (let ridx in this.groupsTotalsData[subgroupId].rows) {
				let tmpVal = parseFloat(this.data[this.groupsTotalsData[subgroupId].rows[ridx]][fieldname]);
				if (!$.isNumeric(tmpVal)) tmpVal = 0;
				sum += tmpVal;
			}

			for( let idx in this.groupsTotalsData[subgroupId].subgroup ){
				sum += this.getSumSubgroupRecursive(fieldname,this.groupsTotalsData[subgroupId].subgroup[idx],force);
			}

			this.groupsTotalsData[subgroupId].computedRowSum[fieldname] = sum;

		}else{
			sum = this.groupsTotalsData[subgroupId].computedRowSum[fieldname];
		}

		return sum;
	};
	this.getMulSubgroupRecursive = function(fieldname,subgroupId, force = false){
		let mul = 1;
		if( !this.groupsTotalsData[subgroupId].computedRowMul ){
			this.groupsTotalsData[subgroupId].computedRowMul = {};
		}
		if( this.groupsTotalsData[subgroupId].computedRowMul[fieldname] == undefined || force ) {
			for (let ridx in this.groupsTotalsData[subgroupId].rows) {
				let tmpVal = parseFloat(this.data[this.groupsTotalsData[subgroupId].rows[ridx]][fieldname]);
				if (!$.isNumeric(tmpVal)) tmpVal = 1;
				mul *= tmpVal;
			}
			this.groupsTotalsData[subgroupId].computedRowMul[fieldname] = mul;
		}else{
			mul = this.groupsTotalsData[subgroupId].computedRowMul[fieldname];
		}

		for( let idx in this.groupsTotalsData[subgroupId].subgroup ){
			mul += this.getMulSubgroupRecursive(fieldname,this.groupsTotalsData[subgroupId].subgroup[idx],force);
		}

		return mul;
	};
	this.getSubgroupFooterColContent = function(fieldname,subtotalColumns,subgroupParentId, force = false){
		if( !subtotalColumns[fieldname] ){ return ''};

		let totalstype = typeof(subtotalColumns[fieldname]) == 'string' ? subtotalColumns[fieldname] : subtotalColumns[fieldname]['totalstype'];

    	let content = '';
		switch( totalstype ){
			case 'sum':
				content = this.getSumSubgroupRecursive(fieldname,subgroupParentId,force);
				break;

			case 'mul':
				content = this.getMulSubgroupRecursive(fieldname,subgroupParentId,force);
				break;
		}

		return content;
	};

	this.getFooterContent = function(){
		if( !this.showtotalsrow ){ return ''; }
		let row = [];
		for(let colIdx = 0; colIdx < this.columns.length; colIdx++){
			row.push('<div cidx = "'+colIdx+'" class="cell title '+this.columns[colIdx]['aditionalclasses']+'">'+
				(
					colIdx == 0
					? 'Totals'
					: this.getFooterColContent(colIdx)
				)+
				'</div>');
		}
		return '<div class="ace-col-12 ace-et-row-highlight-noedit ace-et-footer">'+row.join('')+'</div>';
	};
	this.getFooterColContent = function(colIdx){
		let content = '';
		if( !this.columns[colIdx] ){
			return content;
		}
		switch( this.columns[colIdx]['totalstype'] ){
			case 'sum':
				content = 0;
				for(let ridx = 0; ridx < this.data.length; ridx++){
					let tmpVal = parseFloat(this.data[ridx][this.columns[colIdx]['fieldname']]);
					if (!$.isNumeric(tmpVal)) tmpVal = 0;
					content += tmpVal;
				}
				break;

			case 'mul':
				content = 1;
				for(let ridx = 0; ridx < this.data.length; ridx++){
					let tmpVal = parseFloat(this.data[ridx][this.columns[colIdx]['fieldname']]);
					if (!$.isNumeric(tmpVal)) tmpVal = 1;
					content *= tmpVal;
				}
				break;
			default:
				content = $.aceOverWatch.utilities.runIt(this.columns[colIdx]['totalstype'], this.data, this.columns[colIdx]['fieldname']);
				if( !$.aceOverWatch.utilities.wasItRan(content) ){
					content = '';
				}
				break;
		}

		let formattedContent = $.aceOverWatch.utilities.runIt(this.columns[colIdx]['totalsrenderer'], content);
		return $.aceOverWatch.utilities.wasItRan(formattedContent) ? formattedContent : content;
	};

	this.getRowContent = function(rowIdx,withSubgroups=false, withSubgroupTotals = false){

		let allNewRows = [];

		if( withSubgroups ){//we need to determine if we are supposed to add a subgroup header

			let fullPath = [];
			let invalidateAll = false;
			let currentSubgroupId = 0;
			let startedToChangeFromIdx = -1;

			let oldGroupParentStack = [];
			if( withSubgroupTotals ){
				for(let idx in this.groupParentStack ){
					oldGroupParentStack[idx] = this.groupParentStack[idx];
				}
			}

			for( let subgroupOrderIdx = 0; subgroupOrderIdx < this['subgroups'].length; subgroupOrderIdx++ ){

				let fieldname = this['subgroups'][subgroupOrderIdx]['fieldname'];
				let subgroupTextValue = this.data[rowIdx][fieldname];

				if(
						this['subgroups'][subgroupOrderIdx].skip
					|| $.aceOverWatch.utilities.isVoid(subgroupTextValue,true)
				) {
					continue;
				}

				if( this['subgroups'][subgroupOrderIdx]['renderer'] ){
					let parsedValue = $.aceOverWatch.utilities.runIt(this['subgroups'][subgroupOrderIdx]['renderer'],subgroupTextValue,this.data[rowIdx]);
					if( $.aceOverWatch.utilities.wasItRan(parsedValue) ){
						subgroupTextValue = parsedValue;
					}
				}

				if( this.data[rowIdx][fieldname] != this.subgroupLastValues[fieldname] || invalidateAll ){

					this.groupIndexCounter++;
					currentSubgroupId = this.groupIndexCounter;

					if( withSubgroupTotals ) {
						if (startedToChangeFromIdx === -1) {
							startedToChangeFromIdx = subgroupOrderIdx;
						}

						let parent = subgroupOrderIdx == 0 ? 0 : this.groupParentStack[subgroupOrderIdx - 1];
						this.groupParentStack[subgroupOrderIdx] = currentSubgroupId;

						if (!this.groupsTotalsData[currentSubgroupId]) {
							this.groupsTotalsData[currentSubgroupId] = {
								parent: parent,
								id: currentSubgroupId,
								subgroup: [],
								rows: [],
								orderidx : subgroupOrderIdx
							}
						}

						if( this.groupsTotalsData[parent] ){
							this.groupsTotalsData[parent]['subgroup'].push(currentSubgroupId);
						}
					}

					/*
					 * if a group header changes, all other subgroups will be changed as well
					 */
					invalidateAll = true;

					let titlePrefix = '';
					for(let idxPrefix = 0; idxPrefix < subgroupOrderIdx; idxPrefix++ ){
						if(
							   this['subgroups'][idxPrefix].skip
							|| $.aceOverWatch.utilities.isVoid(subgroupTextValue,true)
						) { continue; }
						titlePrefix += ' + ';
					}

					this.subgroupLastValues[fieldname] = this.data[rowIdx][fieldname];

					allNewRows.push($('<div class="ace-et-row-highlight-noedit ace-et-group-header ace-col-12" id="ace-eet-'+this.id+'-gridx-'+currentSubgroupId+'"><div class="ace-col-12 cell title ace-no-warp ace-aeet-group">'+
										'<div class="ace-aeet-group-simple">'+titlePrefix+subgroupTextValue+'</div>'+
										'<div class="ace-aeet-group-full"><b>'+titlePrefix+subgroupTextValue + '</b>' +
													(
														fullPath.length > 0
														? ': <i>'+fullPath.join(' > ')+' &gt; <b>'+subgroupTextValue+'</b></i>'
														: ''
													)
										+'</div>'+
									'</div></div>'));
					this.subgroupsMapNameTemp[currentSubgroupId] = fullPath.length == 0 ? (titlePrefix+subgroupTextValue) : fullPath.join(' > ') + ' > ' + subgroupTextValue;

				}else{
					if( withSubgroupTotals ) {
						currentSubgroupId = this.groupParentStack[subgroupOrderIdx];
					}
				}

				fullPath.push(subgroupTextValue);
			}

			if( withSubgroupTotals ) {

				/*
				 * now, before the new subgroup headers, we check to see if we have to add
				 * total footers for the rows subgroups which have just ended
				 */

				if( startedToChangeFromIdx>= 0 && oldGroupParentStack[startedToChangeFromIdx] != 0 && rowIdx > 0 ){
					let offsetSubTotals = 0;
					for(let subgroupOrderIdx =  this.subgroups.length-1; subgroupOrderIdx >= startedToChangeFromIdx; subgroupOrderIdx--){
						if( this.subgroups[subgroupOrderIdx].with_subtotals ){
							allNewRows.splice(offsetSubTotals,0,this.getSubgroupFooterContent(subgroupOrderIdx,this.subgroups[subgroupOrderIdx].subtotals_columns,oldGroupParentStack[subgroupOrderIdx]));
							offsetSubTotals++;
						}
					}
				}

				this.groupsTotalsData[currentSubgroupId]['rows'].push(rowIdx);
				this.data[rowIdx].__subgroupParentId = currentSubgroupId;
			}
		}

		/*
		 * we actually build the row
		 */
		let row = $('<div class="ace-et-data-row ace-col-12" ridx="'+rowIdx+'"></div>');
		let cells = [];
		for(let colIdx = 0; colIdx < this.columns.length; colIdx++){

			let classes = ['cell',this.columns[colIdx]['aditionalclasses']];

			let readonlyClass = '';
			if( !$.aceOverWatch.utilities.isVoid(this.columns[colIdx]['readonlycustom'],true)){
				let res = $.aceOverWatch.utilities.runIt(this.columns[colIdx]['readonlycustom'],this.columns[colIdx]['fieldname'],this.data[rowIdx],colIdx);
				if ($.aceOverWatch.utilities.wasItRan(res)) {
					readonlyClass = res ? 'ace-tnec' : 'ace-tec';
				}
			}
			if( readonlyClass == '' ){
				readonlyClass = this.columns[colIdx]['readonly'] ? 'ace-tnec' : 'ace-tec';
			}
			classes.push(readonlyClass);

			let res = $.aceOverWatch.utilities.runIt(this.columns[colIdx]['getcustombackgroundclasses'],this.columns[colIdx]['fieldname'],this.data[rowIdx],colIdx);
			if ($.aceOverWatch.utilities.wasItRan(res)) {
				classes.push(res)
			}

			let cell = $('<div id="eddrc-'+this.id+'-'+rowIdx+'-'+colIdx+'" cidx="'+colIdx+'" class="'+classes.join(' ')+'">' +
				this.formatCellData(colIdx,this.data[rowIdx][this.columns[colIdx]['fieldname']],this.data[rowIdx]) +
				'</div>');

			cells.push(cell);
		}
		allNewRows.push(row.append(cells));

		if( rowIdx == this.data.length-1 && withSubgroups && withSubgroupTotals ){
			//we have just created the last row...
			//we need to insert the sub footers if needed
			for(let subgroupIdx =  this.subgroups.length-1; subgroupIdx >= 0; subgroupIdx--){
				if( this.subgroups[subgroupIdx].with_subtotals ){
					allNewRows.push(this.getSubgroupFooterContent(subgroupIdx,this.subgroups[subgroupIdx].subtotals_columns,this.groupParentStack[subgroupIdx]));
				}
			}
		}

		return allNewRows;
	};

	this.getAllRowsContent = function(){
		let rows = [];
		let withSubgroups = this['subgroups'] && this['subgroups'].length > 0;
		let withSubgroupTotals = false;

		this.groupsTotalsData = {};
		this.groupIndexCounter = 0;
		this.groupParentStack = [];
		this.subgroupsMapNameTemp = {};//temporary storage for subgroup full names
		this.subtotalsWithCustomRenders = {};//subgroupOrderIdx -> [array of columns with custom renders]

		if( withSubgroups ){

			if( this.sortBySubgroupsOnce ){//this happens only once
				this.sortData(this['subgroups']);
				this.sortBySubgroupsOnce = false;
			}

			/*
			 * lets find out if we have subgroup totals
			 */
			for(let subgroupOrderIdx in this.subgroups ){
				if( typeof(this.subgroups[subgroupOrderIdx].subtotals_columns) == "object" && Object.keys(this.subgroups[subgroupOrderIdx].subtotals_columns).length > 0 ){
					withSubgroupTotals = true;
					break;
				}
			}

			this.subgroupLastValues = {};//field -> value
			for( let subgroupOrderIdx = 0; subgroupOrderIdx < this['subgroups'].length; subgroupOrderIdx++ ){
				this.subgroupLastValues[ this['subgroups'][subgroupOrderIdx]['fieldname'] ] = '----^^^1111!!"£$';//strange random value
				if( withSubgroupTotals ) {
					//initially we set the parent of all possible groups to 0
					//when we build the row, and we will record the parents in the stacks, and reference them whenever we create a new subgroup
					this.groupParentStack.push(0);
					if(  this['subgroups'][subgroupOrderIdx]['subtotals_columns'] ){
						for(let fn in this['subgroups'][subgroupOrderIdx]['subtotals_columns'] ){
							if( this['subgroups'][subgroupOrderIdx]['subtotals_columns'][fn].renderer ){
								if( !this.subtotalsWithCustomRenders[subgroupOrderIdx] ){
									this.subtotalsWithCustomRenders[subgroupOrderIdx] = [];
								}
								this.subtotalsWithCustomRenders[subgroupOrderIdx].push(this.columnsNameMap[fn]);
							}
						}
					}
				}
			}
		}
		for(let rowIdx = 0; rowIdx < this.data.length; rowIdx++){
			rows = rows.concat(this.getRowContent(rowIdx,withSubgroups,withSubgroupTotals));
		}

		this.subgroupsMapNameTemp = null;//releasing this as no longer needed;

		return rows;
	}

	this.runCustomSubtotalsRenderersIfNeeded = function(affectedSubgroups){
		/*
		 * ok.. if we have subtotals, and IF we have custom renderers
		 * ON some subtotals, we need to execute their renderers, and update the displayed values
		 */
		if( Object.keys(this.subtotalsWithCustomRenders).length > 0 ){

			for( let subgroupOrderIdx in this.subtotalsWithCustomRenders ){

				for( let asIdx in affectedSubgroups ){
					let subgroupId = affectedSubgroups[asIdx];
					if( this.groupsTotalsData[subgroupId].orderidx != subgroupOrderIdx ){
						continue;
					}
					let footerRow = this.container.find('#ace-eet-'+this.id+'-gridx-footer-'+subgroupId);

					for(let idx in this.subtotalsWithCustomRenders[subgroupOrderIdx] ) {
						let fn = this.columns[this.subtotalsWithCustomRenders[subgroupOrderIdx][idx]].fieldname;

						let parsedValue = $.aceOverWatch.utilities.runIt(
							this.subgroups[subgroupOrderIdx].subtotals_columns[fn].renderer,
							this,
							fn,
							subgroupId,
							footerRow.find('[cidx="'+this.subtotalsWithCustomRenders[subgroupOrderIdx][idx]+'"]').html()
						);
						if ($.aceOverWatch.utilities.wasItRan(parsedValue)) {
							footerRow.find('[cidx="'+this.subtotalsWithCustomRenders[subgroupOrderIdx][idx]+'"]').html(parsedValue)
						}

					}
				}
			}
		}
	};

	/**
	 *computes the virtual fields, if any are available
	 * - we assume that in the begining all columns have 0 max virtual fields
	 * - we parse every row, and for each column with virtual fields we create them
	 * - we memorize the max number of fields for each column
	 * - we adjust the subgroups
	 */
	this.computeVirtualFieldsIfAny = function(data){

		for(let idx in this.virtualfields ){
			this.virtualfields[idx].maxVirtualFields = 0;
		}

		if( Object.keys(this.columnsWithVirtualFields).length > 0 ){
			for(let rowIdx = 0; rowIdx < data.length; rowIdx++) {
				for (let fieldname in this.columnsWithVirtualFields) {
					let vfIdx = this.columnsWithVirtualFields[fieldname];
					let newVirtualFieldsCount = $.aceOverWatch.utilities.runIt(this.virtualfields[vfIdx].virtualfieldsparser,data[rowIdx]);
					if( newVirtualFieldsCount > this.virtualfields[vfIdx].maxVirtualFields ){
						this.virtualfields[vfIdx].maxVirtualFields = newVirtualFieldsCount;
					}
				}
			}
		}

		if( this.subgroups && this.subgroups.length > 0 ){
			/*
			 * cleaning up existing virtual groups
			 */
			for(let sidx = 0; sidx < this.subgroups.length; ){
				if( this.subgroups[sidx].virtual ){
					this.subgroups.splice(sidx,1);
				}else{
					this.subgroups[sidx].skip = false;
					sidx++;
				}
			}
			/*
			 * creating new ones
			 */
			let deltaOrder = 0;
			for(let sidx = 0; sidx < this.subgroups.length; sidx++ ){

				if( this.subgroups[sidx].virtual ){ continue; }

				if( this.columnsWithVirtualFields[this.subgroups[sidx].fieldname] ){
					this.subgroups[sidx].skip = true;
					let vfIdx = this.columnsWithVirtualFields[this.subgroups[sidx].fieldname];
					for(let ngidx = 1; ngidx <= this.virtualfields[vfIdx].maxVirtualFields; ngidx++ ){
						deltaOrder++;
						let subgroup = {
							'desired_order' : this.subgroups[sidx].desired_order+deltaOrder,
							'fieldname' : this.subgroups[sidx].fieldname+String(ngidx),
							'renderer' : this.subgroups[sidx].renderer,
							'virtual' : true,
						};
						this.subgroups.splice(sidx+ngidx,0,subgroup);
					}

				}else{
					this.subgroups[sidx].desired_order += deltaOrder;
				}
			}
		}

	};

	this.display = function(container=false,data=false){
		if( container === false ){
			container = this.container;
		}
		if( !container ){ return; }

		container.addClass('ace-et-container').html('');

		let toolbar = $('<div class="ace-col-12 ace-et-toolbar"><div class="ace-col-12">'+this.genDate+'<h3 class="ace-et-tbl-title"><b>'+this.title+'</b></h3></div></div>');
		if( data !== false ) {
			this.data = data;
		}
		this.computeVirtualFieldsIfAny(this.data);
		let content = $('<div class="ace-col-12 ace-et-rows-envelope ace-et-main-rows-container">'+this.getHeaderContent()+'</div>').append(this.getAllRowsContent());
		if( this.showtotalsrow ){
			content.append(this.getFooterContent());
		}

		container.attr('aetid',this.id).append([toolbar,content]);

		this.runCustomSubtotalsRenderersIfNeeded(Object.keys(this.groupsTotalsData));

		container.unbind('click').click(function(e){
			if( !e.clientX || !e.clientY ){ return true; }//this happens if we have triggered a click even through jquery
			let target = $(document.elementFromPoint(e.clientX,e.clientY));
			if( !target.hasClass('cell') ){
				target = target.parents('.cell').first();
			}
			if( target.hasClass('ace-tec') ){
				aetu.triggerEditCell(target);
			}else{
				if( target.hasClass('cell-reset') ){
					aetu.triggerResetCell(target.parents('.cell').first());
				}else{
					if( target.hasClass('cell-save') ){
							aetu.forceReSave(target.parents('.cell').first());
					}else{
						aetu.triggerCustomCellOperation(target);
					}
				}
			}

		});
		this.container = container;

		/*
		 * now, lets check if we have plugins
		 */
		if( this.overlayplugins && typeof(this.overlayplugins) == 'object' ){
			for(let pluginName in this.overlayplugins ){
				let plugin = this.getOverlayPlugin(pluginName);
				if( !plugin ){ continue; }//the plugin could not be found
				plugin.drawYourself(this);
			}
		}
	};
	this.reset = function(){

		this.display(this.container,[]);
	}

	this.formatCellData = function(colIdx,value,data){
		if( value === undefined || value === null ){ value = '&nbsp;'; }
		let res = $.aceOverWatch.utilities.runIt(this.columns[colIdx].renderer,value,data,colIdx);
		if( $.aceOverWatch.utilities.wasItRan(res) ){
			return res;
		}
		return value;
	};

	/**
	 * The method sets or retrieves the value for a table cell identified by rowIdx, and cellIdx
	 *
	 * If the newValue is null, the method returns the current value
	 * Otherwise, it updates the current value, and triggeres a save
	 * Attention:
	 * - normally the save is triggered only if the newValue is different from the old one
	 * - exception: unless the force parameter is set to true
	 *
	 * @param rowIdx
	 * @param colIdx
	 * @param newValue
	 * @param force
	 * @param extraFieldValuesObj
	 * 		this optional parameter is taken into consideration only on save operations which modify the given field
	 * 		all field / value pairs found within will be set on the data object,
	 * 		and all these values will be sent to the server to be saved
	 * @returns {null|*}
	 */
	this.value = function(rowIdx,colIdx,newValue=null, force = false, extraFieldValuesObj = null){
		if( !this.data[rowIdx] || !this.columns[colIdx] ){ return; }
		let fieldname = this.columns[colIdx]['fieldname'];
		if( newValue == null ){
			return this.data[rowIdx][fieldname];
		}else{
			if( newValue != this.data[rowIdx][fieldname] || force ) {

				if( !('initial'+fieldname in this.data[rowIdx]) ){
					this.data[rowIdx]['initial'+fieldname] = this.data[rowIdx][fieldname];
				}

				if( extraFieldValuesObj ){
					for(let field in extraFieldValuesObj ){
						if( !('initial'+field in this.data[rowIdx]) ){
							this.data[rowIdx]['initial'+field] = this.data[rowIdx][field];
						}
						this.data[rowIdx][field] = extraFieldValuesObj[field];
					}
				}

				this.data[rowIdx][fieldname] = newValue;
				this.save(rowIdx,colIdx,newValue,extraFieldValuesObj);
				this.signalFooterUpdateNeeded(rowIdx,colIdx);
			}
			return newValue;
		}
	};
	this.setInitialValue = function(rowIdx,colIdx){
		if( !this.data[rowIdx] || !this.columns[colIdx] ){ return false; }
		let fieldname = this.columns[colIdx]['fieldname'];
		this.data[rowIdx]['initial'+fieldname] = this.data[rowIdx][fieldname];
		return this.data[rowIdx][fieldname];
	};
	this.resetInitialValue = function(rowIdx,colIdx){
		if( !this.data[rowIdx] || !this.columns[colIdx] ){ return false; }
		let fieldname = this.columns[colIdx]['fieldname'];
		if( !('initial'+fieldname in this.data[rowIdx]) ){ return this.data[rowIdx][fieldname]; }
		this.data[rowIdx][fieldname] = this.data[rowIdx]['initial'+fieldname];
		return this.data[rowIdx][fieldname];
	};

	/*
	 * this works like this:
	 * - we signal that a column has updated
	 * - we start a timer for the update
	 * - if a timer already exists, we kill it, and start a new ne
	 * - when the timer expires, we update the footer
	 * BUT if the table doesn't want totals, we do nothing
	 */
	this.updateTotalsColumnsMap = [];
	this.timerFooterUpdate = null;
	this.signalFooterUpdateNeeded = function(rowIdx,colIdx){
		if( !this.showtotalsrow || $.aceOverWatch.utilities.isVoid(this.columns[colIdx].totalstype,true) ){
			return;
		}

		//this is the general footer update
		clearTimeout(this.timerFooterUpdate);
		this.updateTotalsColumnsMap[colIdx] = true;
		setTimeout(function(tableObj){
			tableObj.updateFooter();
		},200,this);

		//and this is the subtitle specific update
		this.checkIfSubtotalsRecalculationsAreNeeded(rowIdx,colIdx);
	};
	this.updateFooter = function(){
		for(let colIdx in this.updateTotalsColumnsMap ){
			this.container.find('.ace-et-footer .cell[cidx="'+colIdx+'"]').html(this.getFooterColContent(colIdx));
		}
	};

	this.checkIfSubtotalsRecalculationsAreNeeded = function(rowIdx,colIdx){
		if( !this.data[rowIdx].__subgroupParentId ){ return; }
		let parentGroupIdx = this.data[rowIdx].__subgroupParentId;
		this.latestAffectedGroups = [];
		this.checkIfSubtotalsRecalculationsAreNeededRecursive(parentGroupIdx,colIdx);
		this.runCustomSubtotalsRenderersIfNeeded(this.latestAffectedGroups);
	};

	this.checkIfSubtotalsRecalculationsAreNeededRecursive = function(parentGroupIdx,colIdx){
		if( parentGroupIdx <= 0 || !parentGroupIdx ){ return; }//does not belong to a group, we're done

		//now... lets find ALL subtotals which are associated with the group to which this
		if( !this.groupsTotalsData[parentGroupIdx] ){ return; }//again, nothing to do

		let relatedSubtotals = this.container.find('#ace-eet-'+this.id+'-gridx-footer-'+parentGroupIdx);
		if( relatedSubtotals.length == 1 ){
			this.latestAffectedGroups.push(parentGroupIdx);
			relatedSubtotals.replaceWith(
					this.getSubgroupFooterContent(relatedSubtotals.attr('sgoidx'),
					this.subgroups[relatedSubtotals.attr('sgoidx')].subtotals_columns,
					parentGroupIdx,
				true)
			);
		}

		//now we run again for parents
		this.checkIfSubtotalsRecalculationsAreNeededRecursive(this.groupsTotalsData[parentGroupIdx].parent,colIdx);
	};

	this.updateAndFormat = function(rowIdx,colIdx,newValue, extraFieldValuesObj){
		return this.formatCellData(colIdx,this.value(rowIdx,colIdx,newValue,false,extraFieldValuesObj),this.data[rowIdx]);
	};

	this.disableLoading = function(state){
		this.disableLoadingState = state === true;
	};

	this.lastUsedParams = false;
	this.load = function(extraparams=null, size=null){
		if( this.disableLoadingState ){ return true; }
		let params = {};
		if( this.filterform ){
			let filterRecord = this.filterform.ace('value');
			if( filterRecord ) {
				$.extend(params, filterRecord.convert());
			}
		}
		if( extraparams ){//if specified, the extra-params overwrite the parameters of the filter
			$.extend(params,extraparams);
		}
		this.lastUsedParams = Object.assign({}, params);//to clone the params object

		if( size > 0 ){
			this.getSaveHelper().ace('modify',{net:{size:size}});
		}
		$.aceOverWatch.field.mask(this.container,true);
		$.aceOverWatch.net.load(this.getSaveHelper(), params,{
			onsuccess : function(field, data){
				field.data($.aceOverWatch.settings.aceSettings).parent.onLoadSuccess(data);
			},
			onerror : function(field, data){
				field.data($.aceOverWatch.settings.aceSettings).parent.onLoadError(data);
			},
			oncomplete : function(field, data){
				$.aceOverWatch.field.mask(field.data($.aceOverWatch.settings.aceSettings).parent.container,false);
			},

		});
	}
	this.onLoadSuccess = function(data){
		if( this.rebuildafterload && data.details ){
			this.parseConfig(aetu.convertBasicThinkITReportStructureToTableConfig(data.details));
		}

		this.handleDataPluginsRowModifications(data.rows);

		this.display(this.container,data.rows);
	};
	this.onLoadError = function(data){
		$.aceOverWatch.toast.show('error','Failed to load data: '+data.error);
	};
	this.updateConfiguration = function(configDetails){
		this.parseConfig(configDetails);
		this.handleDataPluginsRowModifications(this.data);
		this.display();
	}
	/**
	 * this function is used to sort the data
	 * sortFields - array of objects, where each object has the following structure:
	 * 		fieldname - the fieldname to sort by
	 * 		ascending - true if we want to sort ascending, false if we want to sort descending
	 */
	this.sortData = function(sortFields){
		aetu.sortByMultipleFields(this.data,sortFields,this.virtualfields);
	},

	/**
	 * the save works like this:
	 * - the value is added in a queue
	 * - after which, an event will be trigger to process the queue one at a time
	 * - when the save is successfully completed, the save process is triggered again
	 * @param rowIdx
	 * @param colIdx
	 * @param newValue
	 * @param extraFieldValuesObj optional object containing field / value pairs to be sent on the save operation
	 */
	this.saveQueue = [];
	this.saveQueueBulk = [];
	this.useBulkSave = false;
	this.save = function(rowIdx,colIdx,newValue,extraFieldValuesObj = null){
		$('#eddrc-'+this.id+'-'+rowIdx+'-'+colIdx).addClass('ace-tnec').removeClass('ace-tec');
		let saveData = {
			rowIdx : rowIdx,
			colIdx : colIdx,
			newValue : newValue,
			processing : false,
			extraFieldValuesObj : extraFieldValuesObj
		};
		if( this.useBulkSave ){
			this.saveQueueBulk.push(saveData);
		}else{
			this.saveQueue.push(saveData);
			setTimeout(function(tableObj){
				tableObj.startProcessSaveQueue();
			},100,this);
		}

	};
	this.startProcessSaveQueueInBulk = function(){
		this.bulkUpdateData = [];
		for(let idx in this.saveQueueBulk ){
			let saveParams = {};
			saveParams[this.idfield] = this.data[this.saveQueueBulk[idx].rowIdx][this.idfield];
			saveParams[this.columns[this.saveQueueBulk[idx].colIdx]['fieldname']] = this.data[this.saveQueueBulk[idx].rowIdx][this.columns[this.saveQueueBulk[idx].colIdx]['fieldname']];

			if( this.saveQueueBulk[idx].extraFieldValuesObj ){
				for( let field in this.saveQueueBulk[idx].extraFieldValuesObj ){
					saveParams[field] = this.saveQueueBulk[idx].extraFieldValuesObj[field];
				}
			}

			this.bulkUpdateData.push(saveParams);
		}
		if( this.bulkUpdateData.length == 0 ){//nothing to do...
			return;
		}
		$.aceOverWatch.net.save(this.getSaveBulkHelper(), {
				_bulk_data_update : JSON.stringify(this.bulkUpdateData)
			},{
				onsuccess : function(field, data){
					field.data($.aceOverWatch.settings.aceSettings).parent.onSaveSuccessBulk(data);
				},
				onerror : function(field, data){
					field.data($.aceOverWatch.settings.aceSettings).parent.onSaveErrorBulk(data);
				},

			},
			'bulkupdate',
			{type : 'post'});
	}
	this.onSaveErrorBulk = function(data){
		console.log('AET: something went wrong with BULK update: we convert the save queue in normal queue and save again');
		for(let idx in this.saveQueueBulk ){
			this.saveQueue.push(this.saveQueueBulk[idx]);
			this.saveQueueBulk = [];
		}
		setTimeout(function(tableObj){
			tableObj.startProcessSaveQueue();
		},100,this);
	};
	this.onSaveSuccessBulk = function(data){

		let errorRows = [];
		for(let idx in data.rows ){
			this.performFinalSaveStep(this.saveQueueBulk[0].rowIdx,this.saveQueueBulk[0].colIdx,data.rows[idx].success,data.rows[idx].error);
			if( !data.rows[idx].success ){
				errorRows.push(this.saveQueueBulk[0].rowIdx);
			}
			this.popSaveQueueBulk();
		}
		if( errorRows.length > 0  ){
			this.container.find('.ace-et-rows-envelope').find('.ace-et-data-row[ridx="'+errorRows[0]+'"]')[0].scrollIntoView();
			$.aceOverWatch.prompt.show('Ca urmare a operatiei de "salvare selectie" au rezultat <b>'+errorRows.length+' erori</b>. Tabelul a fost scrolat la prima eroare gasita.', null, {type:'alert',});
		}
	};
	this.startProcessSaveQueue = function(){

		if( 	this.saveQueue.length == 0 // nothing to save
			|| this.saveQueue[0].processing	//it's already being saved
		){ return; }//nothing to do

		this.saveQueue[0].processing = true;

		let saveParams = {};
		saveParams[this.idfield] = this.data[this.saveQueue[0].rowIdx][this.idfield];
		saveParams[this.columns[this.saveQueue[0].colIdx]['fieldname']] = this.data[this.saveQueue[0].rowIdx][this.columns[this.saveQueue[0].colIdx]['fieldname']];

		if( this.saveQueue[0].extraFieldValuesObj ){
			for( let field in this.saveQueue[0].extraFieldValuesObj ){
				saveParams[field] = this.saveQueue[0].extraFieldValuesObj[field];
			}
		}

		$.aceOverWatch.net.save(this.getSaveHelper(),saveParams,{
			onsuccess : function(field, data){
				field.data($.aceOverWatch.settings.aceSettings).parent.onSaveSuccess(data);
			},
			onerror : function(field, data){
				field.data($.aceOverWatch.settings.aceSettings).parent.onSaveError(data);
			},

		},
		null,
		{type : 'post'});
	};
	this.popSaveQueue  = function(){
		if( this.saveQueue.length == 0 ){ return; }
		$('#eddrc-'+this.id+'-'+this.saveQueue[0].rowIdx+'-'+this.saveQueue[0].colIdx).removeClass('ace-tnec').addClass('ace-tec');
		this.saveQueue.shift();
	},
	this.popSaveQueueBulk  = function(){
		if( this.saveQueueBulk.length == 0 ){ return; }
		$('#eddrc-'+this.id+'-'+this.saveQueueBulk[0].rowIdx+'-'+this.saveQueueBulk[0].colIdx).removeClass('ace-tnec').addClass('ace-tec');
		this.saveQueueBulk.shift();
	},
	this.endProcessSaveQueue = function(){
		this.popSaveQueue();
		setTimeout(function(tableObj){
			tableObj.startProcessSaveQueue();
		},100,this);
	};
	this.onSaveSuccess = function(data){
		this.performFinalSaveStep(this.saveQueue[0].rowIdx,this.saveQueue[0].colIdx,true,'');
		this.endProcessSaveQueue();
	};
	this.onSaveError = function(data){
		this.performFinalSaveStep(this.saveQueue[0].rowIdx,this.saveQueue[0].colIdx,false,data.error);
		this.endProcessSaveQueue();
	};
	this.getCell = function(rowIdx,colIdx){
		return this.container.find('[ridx="'+rowIdx+'"] [cidx="'+colIdx+'"]');
	};

	/**
	 * This method forcefully updates the value in a cell, bypassing the edit plugins
	 * @param rowIdx
	 * @param colIdx
	 * @param value
	 */
	this.forceCellUpdate = function(rowIdx,colIdx,value){
		this.value(rowIdx,colIdx,value);
		this.getCell(rowIdx,colIdx).html(
			this.formatCellData(colIdx,value,this.data[rowIdx])
		);
	};
	this.performFinalSaveStep = function(rowIdx,colIdx,success,error){
		let cell = this.getCell(rowIdx,colIdx);
		if( success ){
			cell.removeClass('ace-error').find('.ace-et-cell-error-trigger').remove();
			if( cell.is(':visible') ) {
				$.aceOverWatch.field.check(cell);
			}
			this.setInitialValue(rowIdx,colIdx);
		}else{
			cell.addClass('ace-error');
			$.aceOverWatch.toast.show('error',error);
			cell.append('<div class="ace-et-cell-error-trigger ">'+
				'<label class="tooltip-trigger">'+
					'<i class="fal fa-exclamation-triangle"></i>'+
					'<span class="tooltip">'+error+'</span>'+
				'</label>'+
				'<label class="tooltip-trigger cell-reset">'+
					'<i class="fa fa-ban cell-reset"></i>'+
					'<span class="tooltip">Reseteaza la valoarea initiale</span>'+
				'</label>'+
				'<label class="tooltip-trigger cell-save">'+
					'<i class="fa fa-save cell-save"></i>'+
					'<span class="tooltip">Salveaza din nou</span>'+
				'</label>'+
			'</div>');
		}

	};
	this.getSaveHelper = function(){
		if( !this.saveHelper ){
			this.saveHelper = $('<div></div').ace('create',{
				type : 'hidden',
				net : $.extend({},this.net),
				parent : this
			});
		}
		return this.saveHelper;
	};
	this.getSaveBulkHelper = function(){
		if( !this.saveBulkHelper ){
			this.saveBulkHelper = $('<div></div').ace('create',{
				type : 'hidden',
				net : $.extend({},this.net),
				parent : this
			});
		}
		return this.saveBulkHelper;
	};

	this.getEditCellPlugin = function(colIdx){
		let plugin = aetuPluginManager.getPlugin('CELL_EDIT',this.columns[colIdx].editplugin);
		plugin.configure(this,colIdx,this.columns[colIdx].editpluginconfig,false);
		return plugin;
	};
	this.getCustomCellOperationPlugin = function(name){
		if( !this.cellcustomplugins || !(name in this.cellcustomplugins) ){ return false;}
		let plugin = aetuPluginManager.getPlugin('CELL_CUSTOM_OP',name);
		plugin.configure(this,this.cellcustomplugins[name]);
		return plugin;
	};
	this.getOverlayPlugin = function(name){
		if( !this.overlayplugins || !(name in this.overlayplugins) ){ return false;}
		let plugin = aetuPluginManager.getPlugin('OVERLAY',name);
		plugin.configure(this,this.overlayplugins[name]);
		return plugin;
	};

	this.id = aetu.getNextId();
	aetu.register(this);
}

/*
 * all plugin objects have to have the following members:
 * 	- type: the name of one of the data members ofm AET_PLUGIN_SUPPORTED_TYPES object
 *  - name: a name by which it is recognized
 *
 */
var AET_PLUGIN_SUPPORTED_TYPES = {
	/*
	 * this type of plugin is responsible for the way the information in a cell is edited
	 * - when the editing is DONE EDITING, the plugin must call the following method:
	 * 		aetu.cellEditDone(
	 * 			id,
	 * 			editValue
	 * 			moveDirection
	 * 		)
	 */
	CELL_EDIT : {
		mandatoryMethods : [
			/*
			 * this method is called by the table when a value needs to be edited
			 * parameters:
			 * 	- tableObj	- the table object which initiated the edit operation
			 *  - id - an ID given by the table to this edit instance; must be used when aetu.cellEditDone is done
			 * 	- container - a jquery object representing the container in which the html elements must be added
			 *  - rowDataObject - a data object with all the current data displayed in the row
			 *  - fieldname	- the fieldname of the column; rowDataObject[fieldname] will represent the data which must be edited
			 */
			'drawYourself',
			/*
			 * this method will be called by the table any time the table wants the editing of a cell to stop
			 * parameters:
			 *  - id	- the ID given by the table to this edit operation
			 */
			'forceCellEditDone',
			/*
			 * this method is called when the table wants to configure the plugin for a given column
			 * parameters:
			 * 	- tableObj	- the table object which initiated the edit operation
			 * 	- colIdx 	- the id of the column for which the plugin will be used
			 *  - configObj - configuration data; plugin specific dependent
			 */
			'configure',
			/*
			 * this method is called when the table is triggering an event to which the plugin listens
			 * parameters
			 *  - tableObj	- the table object which initiated the edit operation
			 *  - configObj - configuration object
			 *  - tableId - data package
			 */
			'triggerEvent',
			 /*
			  * boolean method; if the method returns true, then the plugin allows the cell the start being edited when the edit has finished on the previous
			  * cell in the table; if false, the plugin will not start the edit process
              * parameters: none
			  */
			 'allowToBeTriggeredFromPreviousEditCell'
		]
	},
	/*
	 * this type of plugin modifies the table in some way, plugin specific
	 */
	OVERLAY : {
		mandatoryMethods : [
			/*
			 * this method is called by the table after it has finished drawing itself
			 * parameters:
			 * 	- tableObj	- the table object which initiated the edit operation
			 */
			'drawYourself',
			/*
			 * this method is called when the table wants to configure the plugin for a given column
			 * parameters:
			 * 	- tableObj	- the table object which initiated the edit operation
			 *  - configObj - configuration object
			 */
			'configure',
			/*
			 * this method is called when the table is triggering an event to which the plugin listens
			 * parameters
			 *  - tableObj	- the table object which initiated the edit operation
			 *  - configObj - configuration object
			 *  - tableId - data package
			 */
			'triggerEvent'
		],
	},
	/*
	 * this type of plugin can modify initial table configuration data
	 * and it can also modify the data which is loaded from the server
	 */
	DATA : {
		mandatoryMethods : [
			/*
			 * this method is modifies the initial configuration data
			 * parameters:
			 * 	- configObj	- configuration object
			 */
			'modifyInitialConfig',
			/*
			 * this method is called after the data has been received from the server, and before it is parsed and display
			 * modify as needed
			 * parameters:
			 * 	- rows	- array of rows
			 */
			'setupData'
		],
	},
	/*
	 * this type of plugin can modify initial table configuration data
	 * and it can also modify the data which is loaded from the server
	 */
	CELL_CUSTOM_OP : {
		mandatoryMethods : [
			/*
			 * this method is called when the table wants to configure the plugin for a given column
			 * parameters:
			 * 	- tableObj	- the table object which initiated the edit operation
			 * 	- colIdx 	- the id of the column for which the plugin will be used
			 *  - configObj - configuration data; plugin specific dependent
			 */
			'configure',
		],
	}
};

var aetuPluginManager = {

	pluginTypeMap : {},//type -> { plugins: name -> Obj, default->Obj }
	pluginIdMap : {},//pluginId -> pluginObj

	register : function(pluginObj){
		if( !pluginObj.type || !AET_PLUGIN_SUPPORTED_TYPES[pluginObj.type] ){
			$.aceOverWatch.utilities.log('AET Plugin Register ERROR: object does not contain a supported type', 'error', false);
			return false;
		}
		if( $.aceOverWatch.utilities.isVoid(pluginObj.name,true) ){
			$.aceOverWatch.utilities.log('AET Plugin Register ERROR: object does not have a name', 'error', false);
			return false;
		}
		let missingMandatoryMethod = false;
		AET_PLUGIN_SUPPORTED_TYPES[pluginObj.type].mandatoryMethods.forEach(function(methodName){
			if( !$.isFunction(pluginObj[methodName]) ){
				missingMandatoryMethod = true;
				$.aceOverWatch.utilities.log('AET Plugin Register ERROR: missing mandatory method: '+methodName, 'error', false);
			}
		});
		if( missingMandatoryMethod ){
			return false;
		}

		if( !this.pluginTypeMap[pluginObj.type] ){
			this.pluginTypeMap[pluginObj.type] = {
				plugins : {},
				default : false,
			};
		}
		if( this.pluginTypeMap[pluginObj.type].plugins[pluginObj.name] ){
			$.aceOverWatch.utilities.log('AET Plugin Register ERROR: the plugin has already been registered: '+pluginObj.name, 'error', true);
			return false;
		}

		this.pluginTypeMap[pluginObj.type].plugins[pluginObj.name] = pluginObj;
		/*
		 * the fist plugin registered of a given type becomes the default one
		 */
		if( !this.pluginTypeMap[pluginObj.type].default ){
			this.pluginTypeMap[pluginObj.type].default = pluginObj;
		}
		pluginObj.id = aetu.getNextId();
		this.pluginIdMap[pluginObj.id] = pluginObj;

		return true;
	},

	getPlugin : function(type,name){
		if( !this.pluginTypeMap[type] ){
			return false;
		}
		if( this.pluginTypeMap[type].plugins[name] ){
			return this.pluginTypeMap[type].plugins[name];
		}

		return this.pluginTypeMap[type].default;
	},

	eventsListeners : {},// eventname -> tableId -> pluginId
	addListener : function(pluginObj,eventName,tableId) {
		if (!this.eventsListeners[eventName]) {
			this.eventsListeners[eventName] = {
				tableIds: {}
			};
		}
		if( !this.eventsListeners[eventName].tableIds[tableId] ){
			this.eventsListeners[eventName].tableIds[tableId] = {
				plugins : {}
			};
		}
		this.eventsListeners[eventName].tableIds[tableId].plugins[pluginObj.id] = true;
	},
	triggerEvent : function(eventName, tableId, dataPackage){
		if (!this.eventsListeners[eventName]) { return; }
		if (!this.eventsListeners[eventName].tableIds[tableId]) { return; }
		for(let pluginId in this.eventsListeners[eventName].tableIds[tableId].plugins ){
			this.pluginIdMap[pluginId].triggerEvent(eventName,tableId,dataPackage);
		}
	}
}