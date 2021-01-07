/*******************************************************
 * this is an object to hold various information about the state of the current alias
 */
 if (typeof objEmploymentDesignations === "undefined") var objEmploymentDesignations = {};

 $.extend(objEmploymentDesignations, {
	grid : $('#employmentdesignations-grid'),
	form : null,	
	curentlySelectedTemplateRec : $.aceOverWatch.record.create({}),
	addButtonEmploymentDesignations: $('#employmentdesignations-add-button'),
	refreshButtonEmploymentDesignations: $('#employmentdesignations-refresh-button'),
	saveButtonEmploymentDesignations: $('#employmentdesignations-save-button'),	
	cancelButtonEmploymentDesignations: $('#employmentdesignations-cancel-button'),	
});
 
objEmploymentDesignations.saveButtonEmploymentDesignations.addClass('ace-hide');
objEmploymentDesignations.cancelButtonEmploymentDesignations.addClass('ace-hide');

objEmploymentDesignations.grid.ace('create',{
	type : 'grid',
	gtype : 'table',
	
	width:'100%',
	
	allowedit : true,
	alloweditinline : false,
	allowadd : false,
	allowdelete : false,
	allowrefresh : false,
	allowsearchfield:false,
	
	editonselect:true,
	showeditcolumn:'',
	
	displayrowlines:true,
	displaycolumnlines:true,
	
	selectiontype : 'row',
	
	idfield : '_employment_designation_id',
	
	editform : {
		template:'employmentdesignations-ed-frm-tpl',
		renderto:'employmentdesignations-ed-frm-renderer',
		type : 'custom',
		
		autoloadfieldsonshow:false,//only load fields on demand
		
		displaysavebtn:false,
		displaycancelbtn:false,
		validate:true,			
		customsavetext:'',		//if lenght > 0 it will be the text displayed on the save button
		customcanceltext:'',		//if lenght > 0 it will be the text displayed on the cancel button
		oninit: function(form) {
			objEmploymentDesignations.form = $(form);
		},
		onshow:function(form){
			        	
		},
		customshow:function(form, containerId){
            $('#'+containerId).addClass('ace-show');
            objEmploymentDesignations.addButtonEmploymentDesignations.addClass('ace-hide');
            objEmploymentDesignations.refreshButtonEmploymentDesignations.addClass('ace-hide');
            objEmploymentDesignations.saveButtonEmploymentDesignations.removeClass('ace-hide');
            objEmploymentDesignations.cancelButtonEmploymentDesignations.removeClass('ace-hide');
            refreshRightsTemplates();
        },
        customhide:function(form, containerId){
            $('#'+containerId).removeClass('ace-show');
            objEmploymentDesignations.addButtonEmploymentDesignations.removeClass('ace-hide');
            objEmploymentDesignations.refreshButtonEmploymentDesignations.removeClass('ace-hide');
            objEmploymentDesignations.saveButtonEmploymentDesignations.addClass('ace-hide');
            objEmploymentDesignations.cancelButtonEmploymentDesignations.addClass('ace-hide');
        },
		onbeforeloadrecord:function(form, record){		
			objEmploymentDesignations.curentlySelectedTemplateRec = record;
		},
		onafterloadrecord:function(form, record){
	    	if ($.aceOverWatch.utilities.isVoid(form)) return;
	    	objEmploymentDesignations.form = $(form);
	    	
	   },
	},
	net : {
		remote : true,
		autoload : false,
		fid  : 270,
	},
	
});
/*******************************************************
 * function called whenever the employmentdesignations display content
 */
function onDisplayContentForTagemploymentdesignationsmenutag(tag) {
	refreshEmploymentDesignations();
}


/*******************************************************
 * function called when the employmentdesignations refresh button is called 
 */
function refreshEmploymentDesignations(){
	$.aceOverWatch.field.grid.reloadPage(objEmploymentDesignations.grid);
}
/*******************************************************
 * function called when then the add employmentdesignations button is pressed
 */
function addNewEmploymentDesignations(){
	$.aceOverWatch.field.grid.addNewRecord(objEmploymentDesignations.grid);
}
/*******************************************************
 * function called when then the save employmentdesignations button is pressed
 */
function saveEmploymentDesignations(){
	objEmploymentDesignations.form.ace('save');
}
/*******************************************************
 * function called when then the cancel employmentdesignations button is pressed
 */
function cancelEmploymentDesignations(){
	objEmploymentDesignations.form.ace('cancel');
}


function showEmploymentDesignationEditForm() {
	refreshEmploymentDesignations();
	switchMainMenuContent('employmentdesignations_menutag');
}





if (typeof objEmploymentDesignations === "undefined") var objEmploymentDesignations = {};
$.extend(objEmploymentDesignations, {
	rightstemplatesCard : '[tag="rightstemplatestag"]',
	rightstemplatesCardBtns : '#rightstemplates-edit-buttons-grp',

	editTemplateRightsGrid: $('#rightstemplates-grid'),
});

objEmploymentDesignations.editTemplateRightsGrid.ace('create',{
	type : 'grid',
	gtype : 'table',

	width:'100%',

	allowedit : false,
	alloweditinline : false,
	allowadd : false,
	allowdelete : false,
	allowrefresh : false,
	allowsearchfield:false,

	editonselect:false,
	showeditcolumn:'',
	sendallfieldsonsave : true,

	displayrowlines:true,
	displaycolumnlines:true,

	selectiontype : 'row',

	idfield : '_right_id',
	onrowclick: function(target, row, col, record) {
		var targetField = $(target);
		var settings = targetField.data($.aceOverWatch.settings.aceSettings);
		row = parseInt(row);
		col = parseInt(col);
		if ((col <= 0) || (row < 0))  return;
	
		var currVal = settings.data[row].val(settings.innerColumns[col].fieldname);
		settings.editCurrentRow = row;
		if  (currVal === 0)
			settings.data[row].val(settings.innerColumns[col].fieldname, 1);
		else 
			settings.data[row].val(settings.innerColumns[col].fieldname, 0);
		//at the last save it
		$.aceOverWatch.field.grid.save(target);
	},
	onloadsuccessful : function(target, rec, startIdx, endIdx, totalExpectedData) {
		installRowChecks(target);
	},
	onrowredrawn : function(target,settings, rowIdx) {
		installRowChecks(target);
	},
	net : {
		remote : true,
		autoload : false,
		fid  : 120,
		extraparams :{
			ur_template_type: 1,
		},	
		size: 100000,
	},
	
});


/*******************************************************
 * function called whenever the rightstemplates display content
 */
function onDisplayContentForTagrightstemplatesmenutag(tag) {
	var workingTag = objEmploymentDesignations.currentType;
	if( !$.aceOverWatch.utilities.isVoid(tag) ){
		var wasTagUpdated = false;
		if( jQuery.type( tag ) === "string" ){
			workingTag = tag;
			wasTagUpdated = true;
		}else{
			if( jQuery.type( tag ) === "array"){
				if( tag.length > 0 ){
					workingTag = tag[0];
					wasTagUpdated = true;
				}
			}
		}

		if( wasTagUpdated ){
			$.aceOverWatch.field.accordion.openTag(objEmploymentDesignations.accordion,workingTag);
			return;//return because the contents will be opened by the accordion's callback
		}
	}

	onUsersTypeSelection(workingTag);
}


/*******************************************************
 * function called when the rightstemplates refresh button is called
 */
function refreshRightsTemplates(){
	objEmploymentDesignations.editTemplateRightsGrid.ace('modify',{
		extraparams:{
			uid:objEmploymentDesignations.curentlySelectedTemplateRec.val('_employment_designation_id')
		}
	});
	$.aceOverWatch.field.grid.reloadPage(objEmploymentDesignations.editTemplateRightsGrid);
}

/*******************************************************
 * function called when the rightstemplates apply designation button is called
 */
function edApplyDesignationRights(){
	$.aceOverWatch.prompt.show(_aceL.surecleardata,function() {
		var target = objEmploymentDesignations.editTemplateRightsGrid;
		var settings = $(target).data($.aceOverWatch.settings.aceSettings);
		if (!settings) return;
		
		var url = settings.net.url;
		if( $.aceOverWatch.utilities.isVoid(url) ){
			url = $.aceOverWatch.utilities.getWorkingURL();
		}
		
		$.aceOverWatch.net.ajax(target, url, {
			cmd : 'update',
			fid : 120,
			ur_template_type: 1,
			uid:settings.net.extraparams.uid,
			rows : returnSetAllRightsArr(target, false)
		}, {
			onsuccess:function(target, data){
				//use load process data to show errors if any
				$.aceOverWatch.net.loadProcessData(target, data, {
					onsuccess: function(target, data) {
						$.aceOverWatch.field.grid.reloadPage(objEmploymentDesignations.editTemplateRightsGrid);
					},
					onerror: function(target, data) {
						$.aceOverWatch.field.grid.reloadPage(objEmploymentDesignations.editTemplateRightsGrid);
					},
				});
			},
			onerror:function(target, data){
				//use load process data to show errors
				$.aceOverWatch.net.loadProcessData(target, {success:false, error:_aceL.esc}, {
					onsuccess: function(target, data) {
						$.aceOverWatch.field.grid.reloadPage(objEmploymentDesignations.editTemplateRightsGrid);
					},
					onerror: function(target, data) {
						$.aceOverWatch.field.grid.reloadPage(objEmploymentDesignations.editTemplateRightsGrid);
					},
				});
			}
		}, {
			type: 'post'
		});
		
	},{type:'question'});
	
	
	
}
/*******************************************************
 * function called when the rightstemplates clear button is called
 */
function edClearRightsTemplates(){
	$.aceOverWatch.prompt.show(_aceL.surecleardata,function() {
		var target = objEmploymentDesignations.editTemplateRightsGrid;
		var settings = $(target).data($.aceOverWatch.settings.aceSettings);
		if (!settings) return;
		
		var url = settings.net.url;
		if( $.aceOverWatch.utilities.isVoid(url) ){
			url = $.aceOverWatch.utilities.getWorkingURL();
		}
		
		$.aceOverWatch.net.ajax(target, url, {
			cmd : 'update',
			fid : 120,
			ur_template_type: 1,
			uid:settings.net.extraparams.uid,
			rows : returnSetAllRightsArr(target, false)
		}, {
			onsuccess:function(target, data){
				//use load process data to show errors if any
				$.aceOverWatch.net.loadProcessData(target, data, {
					onsuccess: function(target, data) {
						$.aceOverWatch.field.grid.reloadPage(objEmploymentDesignations.editTemplateRightsGrid);
					},
					onerror: function(target, data) {
						$.aceOverWatch.field.grid.reloadPage(objEmploymentDesignations.editTemplateRightsGrid);
					},
				});
			},
			onerror:function(target, data){
				//use load process data to show errors
				$.aceOverWatch.net.loadProcessData(target, {success:false, error:_aceL.esc}, {
					onsuccess: function(target, data) {
						$.aceOverWatch.field.grid.reloadPage(objEmploymentDesignations.editTemplateRightsGrid);
					},
					onerror: function(target, data) {
						$.aceOverWatch.field.grid.reloadPage(objEmploymentDesignations.editTemplateRightsGrid);
					},
				});
			}
		}, {
			type: 'post'
		});
		
	},{type:'question'});
	
	
	
}
/*******************************************************
 * function called when then the add rightstemplates button is pressed
 */
function addNewRightsTemplates(){
	$.aceOverWatch.field.grid.addNewRecord(objEmploymentDesignations.editTemplateRightsGrid);
}


function returnSetAllRightsArr(target, checked) {
	var settings = $(target).data($.aceOverWatch.settings.aceSettings);
	if (!settings) return;
	
	var checkEl = 0;
	if ((!$.aceOverWatch.utilities.isVoid(checked)) && (checked)) checkEl = 1;
	
	var resArr = [];
	for(rIdx in settings.data) {
		if (rIdx) {
			if (settings.data[rIdx].val('_right_id')!==-999) { 
				var pushEl ={
					_right_id : settings.data[rIdx].val('_right_id'),
				};
				for(cIdx in settings.innerColumns) {
					if (cIdx) {
						pushEl[settings.innerColumns[cIdx].fieldname] = checkEl;
					}
				}
				resArr.push( 
					pushEl
				);
			}
		}
	}
	
	return resArr;
}

function rightCheckRenderer(val, rec) {
	val = parseInt(val);
	if (val === 1) return 'X';
	else return '';
}

function renderRightName(val, rec) {
	if (rec.val('_right_id')===-999) return '<b style="color:#013751;font-size:130%;">'+val+'</b>';
	return val + '<div style="float:right"><a href="#" class="check-all-row-rights">All</a> | <a href="#" class="uncheck-all-row-rights">None</a> | <a href="#" class="inverse-all-row-rights">Inverse</a></div>';
}


function installRowChecks(target) {
	var settings = $(target).data($.aceOverWatch.settings.aceSettings);
	$('.check-all-row-rights').unbind().bind('click', function() {
		setRowChecks(this, target, settings, 1);
	});
	$('.uncheck-all-row-rights').unbind().bind('click', function() {
		setRowChecks(this, target, settings, 2);
	});
	$('.inverse-all-row-rights').unbind().bind('click', function() {
		setRowChecks(this, target, settings, 3);
	});
}

function setRowChecks(context, target, settings, checkType) {
	var cIdx = $(context).closest('.'+$.aceOverWatch.classes.gridCell).attr('cidx');
	var rIdx = $(context).closest('.'+$.aceOverWatch.classes.gridRow).attr('ridx');
	
	for(idx in settings.innerColumns) {
		if (idx>0) {
			if (checkType===1)
				settings.data[rIdx].val(settings.innerColumns[idx].fieldname, 1);
			else
			if (checkType===2)
				settings.data[rIdx].val(settings.innerColumns[idx].fieldname, 0);
			else 
				if (settings.data[rIdx].val(settings.innerColumns[idx].fieldname)==1) settings.data[rIdx].val(settings.innerColumns[idx].fieldname, 0);
				else settings.data[rIdx].val(settings.innerColumns[idx].fieldname, 1);
		}
	}
	settings.editCurrentRow = rIdx;
	$.aceOverWatch.field.grid.save(target);

}

function edHeaderRightClicked(target, clickedHeaderCell, clickedHeaderCellIndex, clickedHeaderColumnInfo) {
	var iconEl = $(clickedHeaderCell).find('i');
	var settings = $(target).data($.aceOverWatch.settings.aceSettings);
	var setCheckValue = 1;
	if ($.aceOverWatch.utilities.isVoid(clickedHeaderColumnInfo.fieldname)) return;
	
	if (iconEl.hasClass('fa-check-square-o')) {
		//should check all
		iconEl.removeClass('fa-check-square-o');
		iconEl.addClass('fa-square-o');
	}
	else {
		iconEl.removeClass('fa-square-o');
		iconEl.addClass('fa-check-square-o');
		setCheckValue = 0;
	}
	//here im biulding a rows array because for now our grid doenst have batch update implemented
	var resArr = [];
	for (rIdx in settings.data) {
		if (settings.data[rIdx].val('_right_id')!==-999) {
			//settgin the new value according to the clicked header type
			settings.data[rIdx].val(clickedHeaderColumnInfo.fieldname, setCheckValue);
			//add the result to the final save array
			var pushEl ={
				_right_id : settings.data[rIdx].val('_right_id'),
			};
			pushEl[clickedHeaderColumnInfo.fieldname] = setCheckValue;
			resArr.push( 
					pushEl
			);//settings.data[rIdx].convert());
		}
	}
	
	var url = settings.net.url;
	if( $.aceOverWatch.utilities.isVoid(url) ){
		url = $.aceOverWatch.utilities.getWorkingURL();
	}
	
	$.aceOverWatch.net.ajax(target, url, {
		cmd : 'update',
		fid : 120,
		uid:settings.net.extraparams.uid,
		ur_template_type: 1,
		rows : resArr
	}, {
		onsuccess:function(target, data){
			//use load process data to show errors if any
			$.aceOverWatch.net.loadProcessData(target, data, {
				onsuccess: function(target, data) {
					$.aceOverWatch.field.grid.reloadPage(objEmploymentDesignations.editTemplateRightsGrid);
				},
				onerror: function(target, data) {
					$.aceOverWatch.field.grid.reloadPage(objEmploymentDesignations.editTemplateRightsGrid);
				},
			});
		},
		onerror:function(target, data){
			//use load process data to show errors
			$.aceOverWatch.net.loadProcessData(target, {success:false, error:_aceL.esc}, {
				onsuccess: function(target, data) {
					$.aceOverWatch.field.grid.reloadPage(objEmploymentDesignations.editTemplateRightsGrid);
				},
				onerror: function(target, data) {
					$.aceOverWatch.field.grid.reloadPage(objEmploymentDesignations.editTemplateRightsGrid);
				},
			});
		}
	}, {
		type: 'post'
	});
}