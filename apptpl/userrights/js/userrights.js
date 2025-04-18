if (typeof objEmployeeRightsMenu === "undefined") var objEmployeeRightsMenu = {};
$.extend(objEmployeeRightsMenu, {
	userrightsCard : '[tag="userrightstag"]',
	userrightsCardBtns : '#userrights-edit-buttons-grp',

    curentlySelectedEmployeeRec : $.aceOverWatch.record.create(),
    backAction : null,

	filterValue : '',

	getGrid : function(){
		if( !this.editEmployeeRightsGrid ){
			this.editEmployeeRightsGrid = $('#userrights-grid').ace('create',{
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
					if( currVal == -1 ){ return; }
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
					size: 100000,
				},

			});

			showEmployeeRightsGridEditingButtons();

			this.filterEl = $('<div id="user-rights-search-filter" class="ace-col-12"></div>').insertBefore(this.editEmployeeRightsGrid);
			this.filterEl.ace('create',{
				type : 'text',
				placeholder : 'cauta drepturi',
				onchange : refreshUserRights,
				label : _aceL.Filter,
				labelalign : 'left',
				labelwidth : '100px'
			});

		}
		return this.editEmployeeRightsGrid;
	}
});


function showEmployeeRightsEditGrid(rec, backCallback) {
    if ($.aceOverWatch.utilities.isVoid(rec)) rec = $.aceOverWatch.record.create();
    objEmployeeRightsMenu.curentlySelectedEmployeeRec = rec;
    objEmployeeRightsMenu.backAction = backCallback;

    onDisplayContentForTaguserrightsmenutag('userrightstag');
    if( objEmployeeRightsMenu.cardView ) {
		$.aceOverWatch.field.cardview.switchTo(objEmployeeRightsMenu.cardView, objEmployeeRightsMenu.userrightsCard);
	}
	showEmployeeEditButtons(objEmployeeRightsMenu.userrightsCardBtns);
	refreshUserRights();
}

function backFromUserRights() {
    if( $.isFunction(objEmployeeRightsMenu.backAction) ){
        objEmployeeRightsMenu.backAction();
    }else{
        if( $.isFunction(window[objEmployeeRightsMenu.backAction]) ){
            window[objEmployeeRightsMenu.backAction]();
        }
    }
}

function showEmployeeRightsGridEditingButtons(asForm) {
	var showControls = '.ace-grid-controls';
	var hideControls = '.ace-form-controls';
	if ((!$.aceOverWatch.utilities.isVoid(asForm)) && (asForm === true)) {
		showControls = '.ace-form-controls';
		hideControls = '.ace-grid-controls';
	}
	$(objEmployeeRightsMenu.userrightsCardBtns).find(showControls).removeClass('ace-hide');
    $(objEmployeeRightsMenu.userrightsCardBtns).find(hideControls).addClass('ace-hide');
}

/*******************************************************
 * function called whenever the userrights display content
 */
function onDisplayContentForTaguserrightsmenutag(tag) {
    var el = $('[tag="'+tag+'"]');
    el.addClass('ace-show');
    el.removeClass('ace-hide');
    el.siblings(".ace-partial-form").addClass('ace-hide');
    el.siblings(".ace-partial-form").removeClass('ace-show');
    el.siblings(".ace-app-edit-windwow").addClass('ace-hide');
    el.siblings(".ace-app-edit-windwow").removeClass('ace-show');
}

/*******************************************************
 * function called when the userrights refresh button is called
 */
function refreshUserRights(){
    $('#userrights-title-bar-container').html(objEmployeeRightsMenu.curentlySelectedEmployeeRec.val('_user_name'));

    var rec = objEmployeeRightsMenu.curentlySelectedEmployeeRec;
	if ($.aceOverWatch.utilities.isVoid(rec)) rec = objEmployeeMenu.curentlySelectedEmployeeRec;
	if ($.aceOverWatch.utilities.isVoid(rec)) return;

	if( objEmployeeRightsMenu.filterEl ) {
		objEmployeeRightsMenu.filterValue = objEmployeeRightsMenu.filterEl.ace('value');
	}
	objEmployeeRightsMenu.getGrid().ace('refresh',{
		uid:objEmployeeRightsMenu.curentlySelectedEmployeeRec.val('_user_id'),
		tplid: objEmployeeRightsMenu.curentlySelectedEmployeeRec.val('_user_company_designation_id') > 0
			? objEmployeeRightsMenu.curentlySelectedEmployeeRec.val('_user_company_designation_id')
			: objEmployeeRightsMenu.curentlySelectedEmployeeRec.val('_ed_company_designation'), /*for backwords compatibility.. aka.. porter*/
		tpltype : 1,
		rsf : objEmployeeRightsMenu.filterValue
	});
}

/*******************************************************
* function called when the rightstemplates clear button is called
*/
function clearUserRights(){
	$.aceOverWatch.prompt.show(_aceL.surecleardata,function() {
		var target = objEmployeeRightsMenu.editEmployeeRightsGrid;
		var settings = $(target).data($.aceOverWatch.settings.aceSettings);
		if (!settings) return;
		
		var url = settings.net.url;
		if( $.aceOverWatch.utilities.isVoid(url) ){
			url = $.aceOverWatch.utilities.getWorkingURL();
		}
		
		$.aceOverWatch.net.ajax(target, url, {
			cmd : 'update',
			fid : 120,
			uid:settings.net.extraparams.uid,
			rows : returnSetAllRightsArr(target, false)
		}, {
			onsuccess:function(target, data){
				//use load process data to show errors if any
				$.aceOverWatch.net.loadProcessData(target, data, {
					onsuccess: function(target, data) {
						objEmployeeRightsMenu.editEmployeeRightsGrid.ace('refresh');
					},
					onerror: function(target, data) {
						objEmployeeRightsMenu.editEmployeeRightsGrid.ace('refresh');
					},
				});
			},
			onerror:function(target, data){
				//use load process data to show errors
				$.aceOverWatch.net.loadProcessData(target, {success:false, error:_aceL.esc}, {
					onsuccess: function(target, data) {
						objEmployeeRightsMenu.editEmployeeRightsGrid.ace('refresh');
					},
					onerror: function(target, data) {
						objEmployeeRightsMenu.editEmployeeRightsGrid.ace('refresh');
					},
				});
			}
		}, {
			type: 'post'
		});		

	},{type:'question'});
}
/*******************************************************
 * function called when the apply designation default rights button is clicked
 */
function applyDefaultRightsTemplate(){
	$.aceOverWatch.prompt.show(_aceL.sureapplydefrghttpl,function() {
		var target = objEmployeeRightsMenu.editEmployeeRightsGrid;
		var settings = $(target).data($.aceOverWatch.settings.aceSettings);
		if (!settings) return;
		
		var url = settings.net.url;
		if( $.aceOverWatch.utilities.isVoid(url) ){
			url = $.aceOverWatch.utilities.getWorkingURL();
		}
		
		$.aceOverWatch.net.ajax(target, url, {
			cmd : 'applyrightstemplate',
			fid : 120,
			uid:settings.net.extraparams.uid,
			tplid: settings.net.extraparams.tplid,
			tpltype: settings.net.extraparams.tpltype,
		}, {
			onsuccess:function(target, data){
				//use load process data to show errors if any
				if (data.success) {
					$.aceOverWatch.net.loadProcessData(target, data, {
						onsuccess: function(target, data) {
							objEmployeeRightsMenu.editEmployeeRightsGrid.ace('refresh');
						},
						onerror: function(target, data) {
							objEmployeeRightsMenu.editEmployeeRightsGrid.ace('refresh');
						},
					});
				}
				else {
					$.aceOverWatch.prompt.show(data.error,null,{type:'alert'});
				}
			},
			onerror:function(target, data){
				$.aceOverWatch.prompt.show(data.error,null,{type:'alert'});
			}
		}, {
			type: 'post'
		});		
		
	},{type:'question'});
}
/*******************************************************
 * function called when then the add userrights button is pressed
 */
function addNewUserRights(){
	$.aceOverWatch.field.grid.addNewRecord(objEmployeeRightsMenu.editEmployeeRightsGrid);
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
	if( (rec && rec.val('_right_id')===-999) || val == -1 ){
		return '&nbsp;';
	}
	return rendererCheckbox(val, rec);
}

function renderRightName(val, rec) {

	if( !$.aceOverWatch.utilities.isVoid(objEmployeeRightsMenu.filterValue,true) ) {
		val = val.split(new RegExp(objEmployeeRightsMenu.filterValue, 'i')).join('<span style="color:red;">'+objEmployeeRightsMenu.filterValue.toUpperCase()+'</span>');
	}

	if (rec.val('_right_id')===-999) return '<b style="color:#013751;font-size:130%;">'+val+'</b>';//group header
	let description = rec.val('_description');
	if (!$.aceOverWatch.utilities.isVoid(description,true)) {
		description = '<a href="#" class="see-rights-description ace-small-padding-right ace-blue"><i class="fa fa-info"></i></a>';
	}else{
		description = '';
	}

	return description + val + '<div style="float:right"><a href="#" class="check-all-row-rights">All</a> | <a href="#" class="uncheck-all-row-rights">None</a> | <a href="#" class="inverse-all-row-rights">Inverse</a></div>';
}


function installRowChecks(target) {
	$('.check-all-row-rights').unbind().bind('click', function() {
		setRowChecks($(this), 1);
	});
	$('.uncheck-all-row-rights').unbind().bind('click', function() {
		setRowChecks($(this), 2);
	});
	$('.inverse-all-row-rights').unbind().bind('click', function() {
		setRowChecks($(this), 3);
	});
	$('.see-rights-description').unbind().bind('click', function() {
		displayRightDescription($(this));
	});
}

function displayRightDescription(context){
	let target= context.closest('.'+$.aceOverWatch.classes.containerField);
	let settings = target.data($.aceOverWatch.settings.aceSettings);
	let rIdx = context.closest('.'+$.aceOverWatch.classes.gridRow).attr('ridx');
	$.aceOverWatch.prompt.show('<b>'+settings.data[rIdx].val('_name')+'</b><br>'+settings.data[rIdx].val('_description'),null,{type:'alert'});
}

function setRowChecks(context, checkType) {
	let target= context.closest('.'+$.aceOverWatch.classes.containerField);
	let settings = target.data($.aceOverWatch.settings.aceSettings);
	let rIdx = context.closest('.'+$.aceOverWatch.classes.gridRow).attr('ridx');
	
	for(idx in settings.innerColumns) {
		if (idx>0 && settings.data[rIdx].val(settings.innerColumns[idx].fieldname) != -1) {
			if (checkType===1){
				settings.data[rIdx].val(settings.innerColumns[idx].fieldname, 1);
			}
			else
			if (checkType===2)
				settings.data[rIdx].val(settings.innerColumns[idx].fieldname, 0);
			else 
				if (settings.data[rIdx].val(settings.innerColumns[idx].fieldname)==1) settings.data[rIdx].val(settings.innerColumns[idx].fieldname, 0);
				else settings.data[rIdx].val(settings.innerColumns[idx].fieldname, 1);
		}
	}
	settings.editCurrentRow = rIdx;
	target.ace('save');
}

function headerRightClicked(target, clickedHeaderCell, clickedHeaderCellIndex, clickedHeaderColumnInfo) {
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
		if (settings.data[rIdx].val('_right_id')!==-999 && settings.data[rIdx].val(clickedHeaderColumnInfo.fieldname) != -1) {
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
	
	console.log(settings);
	$.aceOverWatch.net.ajax(target, url, {
		cmd : 'update',
		fid : 120,
		uid:settings.net.extraparams.uid,
		rows : resArr
	}, {
		onsuccess:function(target, data){
			//use load process data to show errors if any
			$.aceOverWatch.net.loadProcessData(target, data, {
				onsuccess: function(target, data) {
					objEmployeeRightsMenu.editEmployeeRightsGrid.ace('refresh');
				},
				onerror: function(target, data) {
					objEmployeeRightsMenu.editEmployeeRightsGrid.ace('refresh');
				},
			});
		},
		onerror:function(target, data){
			//use load process data to show errors
			$.aceOverWatch.net.loadProcessData(target, {success:false, error:_aceL.esc}, {
				onsuccess: function(target, data) {
					objEmployeeRightsMenu.editEmployeeRightsGrid.ace('refresh');
				},
				onerror: function(target, data) {
					objEmployeeRightsMenu.editEmployeeRightsGrid.ace('refresh');
				},
			});
		}
	}, {
		type: 'post'
	});
}