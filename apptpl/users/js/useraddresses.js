 if (typeof objEmployeeMenu === "undefined") var objEmployeeMenu = {};

 $.extend(objEmployeeMenu, {
 	useraddressesCard :'[tag="useraddressestag"]',
 	useraddressesCardBtns : '#useraddresses-edit-buttons-grp',
 	
 	editUserAddressesGrid: $('#useraddresses-grid'),
});

objEmployeeMenu.editUserAddressesGrid.ace('create',{
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
	cleardata : true,
	
	idfield : '_user_address_id',
	
	editform : {
		template:'useraddresses-ed-frm-tpl',
		renderto:'useraddresses-ed-frm-renderer',
		type : 'custom',
		
		autoloadfieldsonshow:false,//only load fields on demand
		
		displaysavebtn:false,
		displaycancelbtn:false,
		validate:true,			
		customsavetext:'',		//if lenght > 0 it will be the text displayed on the save button
		customcanceltext:'',		//if lenght > 0 it will be the text displayed on the cancel button
		oninit: function(form) {
			objEmployeeMenu.formUserAddresses = $(form);
		},
		onshow:function(form){
			        	
		},
		customshow:function(form, containerId){
            $('#'+containerId).addClass('ace-show');
            showUserAddressesGridEditingButtons(true);
        },
        customhide:function(form, containerId){
            $('#'+containerId).removeClass('ace-show');
            showUserAddressesGridEditingButtons(false);
            objEmployeeMenu.currentlyEditedUserAddressesRec = null;
        },
		onbeforeloadrecord:function(form, record){			
		},
		onafterloadrecord:function(form, record){
	    	if ($.aceOverWatch.utilities.isVoid(form)) return;
	    	objEmployeeMenu.formUserAddresses = $(form);
	    	objEmployeeMenu.currentlyEditedUserAddressRec = record;
	    	
	   },
	},
	
	net : {
		remote : true,
		autoload : false,
		fid  : 115,
	},
	
});
showUserAddressesGridEditingButtons();

function showUserAddressesInfo() {
	 $.aceOverWatch.field.cardview.switchTo(objEmployeeMenu.cardView, objEmployeeMenu.useraddressesCard);
	 showEmployeeEditButtons(objEmployeeMenu.useraddressesCardBtns);
	 refreshUserAddresses();
}

function showUserAddressesGridEditingButtons(asForm) {
	var showControls = '.ace-grid-controls';
	var hideControls = '.ace-form-controls';
	if ((!$.aceOverWatch.utilities.isVoid(asForm)) && (asForm === true)) {
		showControls = '.ace-form-controls';
		hideControls = '.ace-grid-controls';
	}
	$(objEmployeeMenu.useraddressesCardBtns).find(showControls).removeClass('ace-hide');
    $(objEmployeeMenu.useraddressesCardBtns).find(hideControls).addClass('ace-hide');
}
/*******************************************************
 * function called when the useraddresses refresh button is called
 */
function refreshUserAddresses() {
	objEmployeeMenu.editUserAddressesGrid.ace('modify',{
		extraparams:{
			appcond : '{"ua_user_id":'+objEmployeeMenu.curentlySelectedEmployeeRec.val('_user_id')+'}'
		}
	});
	$.aceOverWatch.field.grid.reloadPage(objEmployeeMenu.editUserAddressesGrid);
}

/*******************************************************
 * function called when then the add useraddresses button is pressed
 */
function addNewUserAddresses(){
	$.aceOverWatch.field.grid.addNewRecord(objEmployeeMenu.editUserAddressesGrid, {
		_edi_employee_id : objEmployeeMenu.curentlySelectedEmployeeRec.val('_user_id'),
		_user_name : objEmployeeMenu.curentlySelectedEmployeeRec.val('_user_name')
	});
}
/*******************************************************
 * function called when then the save useraddresses button is pressed
 */
function saveUserAddresses(){
	objEmployeeMenu.formUserAddresses.ace('save');
}
/*******************************************************
 * function called when then the cancel useraddresses button is pressed
 */
function cancelUserAddresses(){
	objEmployeeMenu.formUserAddresses.ace('cancel');
}