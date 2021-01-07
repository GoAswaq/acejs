$('.ace-entries-menu-trigger').click(function(e){
	console.log('')
	e.preventDefault();
    $('#users-grid-panel').addClass('ace-show');
});

/*******************************************************
 * this is an object to hold various information about the state of the current alias
 */
 if (typeof objUsers === "undefined") var objUsers = {};

 $.extend(objUsers, {
 	grid : $('#users-grid'),
	form : null,
	accordion : $('#users-accordion'),

	currentUsersType:'users-general-data',
	titleBar : $('#users-title-bar-container'),
	
	addButtonUsers: $('#users-add-button'),
	refreshButtonUsers: $('#users-refresh-button'),
	saveButtonUsers: $('#users-save-button'),	
	cancelButtonUsers: $('#users-cancel-button'),	
});
objUsers.saveButtonUsers.addClass('ace-hide');
objUsers.cancelButtonUsers.addClass('ace-hide');

if (typeof objUsers.knownQuickAccessEntries === "undefined") objUsers.knownQuickAccessEntries = [];
objUsers.knownQuickAccessEntries['users-general-data']=true;
objUsers.knownQuickAccessEntries['users-account-data']=true;
objUsers.knownQuickAccessEntries['users-preferences-data']=true;

$('#users-grid').ace('create',{
	type : 'grid',
	gtype:"panel",
	
	width:'100%',
	rowtpl:"users-grid-row-template",

    allowadd:false,
    allowdelete:false,
    displayrowlines:false,
    hideheader:true,
    showeditcolumn: '',
    editonselect:false,
    
	
	editonselect:true,
	showeditcolumn:'',
	
	displayrowlines:true,
	displaycolumnlines:true,
	
	selectiontype : 'row',
	
	idfield : '_user_id',
	
	editform : {
		template:'users-ed-frm-tpl',
		renderto:'users-ed-frm-renderer',
		type : 'custom',
		
		autoloadfieldsonshow:false,//only load fields on demand
		
		displaysavebtn:false,
		displaycancelbtn:false,
		validate:true,			
		customsavetext:'',		//if lenght > 0 it will be the text displayed on the save button
		customcanceltext:'',		//if lenght > 0 it will be the text displayed on the cancel button
		oninit: function(form) {
			objUsers.form = $(form);
			$(objUsers.form).trigger('usersefoninit', [form]);
		},
		onshow:function(form){
			$(objUsers.form).trigger('usersefonshow', [form]);
		},
		customshow:function(form, containerId){
            $('#'+containerId).addClass('ace-show');
            objUsers.addButtonUsers.addClass('ace-hide');
            objUsers.refreshButtonUsers.addClass('ace-hide');
            objUsers.saveButtonUsers.removeClass('ace-hide');
            objUsers.cancelButtonUsers.removeClass('ace-hide');
			$(objUsers.form).trigger('usersefcustomshow', [form, containerId]);
        },
        customhide:function(form, containerId){
            $('#'+containerId).removeClass('ace-show');
            objUsers.addButtonUsers.removeClass('ace-hide');
            objUsers.refreshButtonUsers.removeClass('ace-hide');
            objUsers.saveButtonUsers.addClass('ace-hide');
            objUsers.cancelButtonUsers.addClass('ace-hide');
			$(objUsers.form).trigger('usersefcustomhide', [form, containerId]);
        },
		onbeforeloadrecord:function(form, record){			
			$(objUsers.form).trigger('usersefonbeforeloadrecord', [form, record]);
		},
		onafterloadrecord:function(form, record){
	    	if ($.aceOverWatch.utilities.isVoid(form)) return;
	    	objUsers.form = $(form);
	    	
	    	objUsers.form.find('[type="uploadbutton"]').ace('modify',{
	    		extraparams:{
	    			appcond : '{"u.user_id":'+record.val('_user_id')+'}'
	    		}
	    	});
	    	
			$(objUsers.form).trigger('usersefonafterloadrecord', [form, record]);
	   },
	},
	
	net : {
		remote : true,
		autoload : false,
		fid  : 110,
	},
	onloadsuccessful: function(target, data, startIdx, endIdx, totalNoRec) {
		$.aceOverWatch.field.grid.selectRow(target, startIdx);
		$(objUsers.grid).trigger('usersefonloadsuccessful', [target, data, startIdx, endIdx, totalNoRec]);
	},
    /***********************************
     * grid callback definitions start here:
     ***********************************/
    onafterrowrecordloaded:function(form, record){
    	//doing custom work on each panel in the grid
    	var f = $(form);
		if ((!$.aceOverWatch.utilities.isVoid(record.val('_user_picture_path'))) && (record.val('_user_picture_path')!='')) {
			f.find('.user-image').attr('src',record.val('_user_picture_path'));
		}	
		$(objUsers.grid).trigger('usersefonafterrowrecordloaded', [form, record]);
    },
});

/*******************************************************
 * function called whenever the users display content
 */
function onDisplayContentForTagusersmenutag(tag) {
	console.log('Tag: '+tag);
	//if I click the main menu link and the current accordion link is with drop down - Then this code will automatically open its sons 
	if ((($.aceOverWatch.utilities.isVoid(tag)) || (tag==='')) && !(($.aceOverWatch.utilities.isVoid(objUsers.currentUsersType)) || (objUsers.currentUsersType===''))) {
		window.location.hash = "usersmenutag/" + objUsers.currentUsersType;
		return;
	}
	refreshUsers();
	onUsersTypeSelection(objUsers.currentUsersType);
}
/*******************************************************
 * this function is called whenever the services accordion is clicked, and changes the displayed data in the right panel
 *
 * @param tag - a string identifying the type of information selected
 */
function onUsersTypeSelection(tag, data){
	console.log('clicked' + tag);
	
	if( data && data.name ){
		objUsers.titleBar.html(_L.Users + ' - ' + data.name);
	}
	
	objUsers.currentUsersType = tag;
	
	//here instead of a switch to see if the tag is allowed I am using a shared array that can be used to add known tags to
	if (typeof objUsers.knownQuickAccessEntries[tag] === "undefined") {
		$.aceOverWatch.utilities.log('unrecognized personalize tag: '+tag,'error',true);
		return;
	}

	if ($.isFunction(objUsers.knownQuickAccessEntries[tag])) {
		if (objUsers.knownQuickAccessEntries[tag](tag, data) === false) return false;
	}
	else 
	if ($.isFunction(window[objUsers.knownQuickAccessEntries[tag]])) {
		if (window[objUsers.knownQuickAccessEntries[tag]](tag, data) === false) return false;	
	}

	//TODO - transform this into a switch field
	var el = $('#'+tag);
	el.addClass('ace-show');
	el.removeClass('ace-hide');
	el.siblings(".ace-partial-form").addClass('ace-hide');
	el.siblings(".ace-partial-form").removeClass('ace-show');
}


/*******************************************************
 * function called after the profile image has been saved successfully
 */
function onUsersUserpictureUploadSuccessfull(target, url, data){
	//$('#modify-some-pic-somewhere').attr('src',url+'?'+Date.now()); or some doc
}


/*******************************************************
 * function called when the users refresh button is called 
 */
function refreshUsers(){
	$.aceOverWatch.field.grid.reloadPage(objUsers.grid);
}
/*******************************************************
 * function called when then the add users button is pressed
 */
function addNewUsers(){
	$.aceOverWatch.field.grid.addNewRecord(objUsers.grid);
}
/*******************************************************
 * function called when then the save users button is pressed
 */
function saveUsers(){
	objUsers.form.ace('save');
}
/*******************************************************
 * function called when then the cancel users button is pressed
 */
function cancelUsers(){
	objUsers.form.ace('cancel');
}