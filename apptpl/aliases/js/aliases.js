
/*******************************************************
 * this is an object to hold various information about the state of the current alias
 */
 if (typeof objUsers === "undefined") var objUsers = {};

 $.extend(objUsers, {
 	gridAliases : $('#aliases-grid'),
	formAliases : null,	
	
	addButtonAliases: $('#aliases-add-button'),
	refreshButtonAliases: $('#aliases-refresh-button'),
	saveButtonAliases: $('#aliases-save-button'),	
	cancelButtonAliases: $('#aliases-cancel-button'),	
});
objUsers.saveButtonAliases.addClass('ace-hide');
objUsers.cancelButtonAliases.addClass('ace-hide');

$('#aliases-grid').ace('create',{
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
	
	idfield : '_alias_id',
	
	editform : {
		template:'aliases-ed-frm-tpl',
		renderto:'aliases-ed-frm-renderer',
		type : 'custom',
		
		autoloadfieldsonshow:false,//only load fields on demand
		
		displaysavebtn:false,
		displaycancelbtn:false,
		validate:true,			
		customsavetext:'',		//if lenght > 0 it will be the text displayed on the save button
		customcanceltext:'',		//if lenght > 0 it will be the text displayed on the cancel button
		oninit: function(form) {
			objUsers.formAliases = $(form);
		},
		onshow:function(form){
			        	
		},
		customshow:function(form, containerId){
            $('#'+containerId).addClass('ace-show');
            objUsers.addButtonAliases.addClass('ace-hide');
            objUsers.refreshButtonAliases.addClass('ace-hide');
            objUsers.saveButtonAliases.removeClass('ace-hide');
            objUsers.cancelButtonAliases.removeClass('ace-hide');
        },
        customhide:function(form, containerId){
            $('#'+containerId).removeClass('ace-show');
            objUsers.addButtonAliases.removeClass('ace-hide');
            objUsers.refreshButtonAliases.removeClass('ace-hide');
            objUsers.saveButtonAliases.addClass('ace-hide');
            objUsers.cancelButtonAliases.addClass('ace-hide');
        },
		onbeforeloadrecord:function(form, record){			
		},
		onafterloadrecord:function(form, record){
	    	if ($.aceOverWatch.utilities.isVoid(form)) return;
	    	objUsers.formAliases = $(form);
	    	
	   },
	},
	
	net : {
		remote : true,
		autoload : false,
		fid  : 420,
	},
	
});
/*******************************************************
 * function called whenever the aliases display content
 */
function onDisplayContentForTagaliasesmenutag(tag) {
	var workingTag = objUsers.currentUsersType;
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
			$.aceOverWatch.field.accordion.openTag(objUsers.accordion,workingTag);
			return;//return because the contents will be opened by the accordion's callback
		}
	}
	 
	onUsersTypeSelection(workingTag);
}


/*******************************************************
 * function called when the aliases refresh button is called 
 */
function refreshAliases(){
	$.aceOverWatch.field.grid.reloadPage(objUsers.gridAliases);
}
/*******************************************************
 * function called when then the add aliases button is pressed
 */
function addNewAliases(){
	$.aceOverWatch.field.grid.addNewRecord(objUsers.gridAliases);
}
/*******************************************************
 * function called when then the save aliases button is pressed
 */
function saveAliases(){
	objUsers.formAliases.ace('save');
}
/*******************************************************
 * function called when then the cancel aliases button is pressed
 */
function cancelAliases(){
	objUsers.formAliases.ace('cancel');
}



/*
	Other grid configurables:
	
	gtype:'table',		//the type of grid
							//can be: table OR panel
							//table is the default type
							//			- it displays the list in horizontal rows and columns
							//			- the information about how the grid should be displayed can be found in the columns field
							//panel  is the second way a grid may be displayed
							//			- this type of grid requires a cell template to be specified: rowtpl
	rowtpl:'',
	autoloadrowfields:true,//true if the row form should autoload by itself - eg if the row has a combobox
						
	page:1,				//this is the first page loaded ( first page == 1 )
	pagination:true,
					
	loading : false, 	//this flag tells if there is a active net connection loading the gird data (no matter if the previous result was successfull or not)
	height:false,		
	width:'auto',		//this is the width of the ENTIRE grid container, the on which ACE is being run; the inner grid iside stretches to 100%
					
	columns:[],			//the columns to be displayed; 
						//an array of title / width / fieldname / type (can be normal,checkboxcol or action) For checkboxcol to show a text next to the check on every row use rowtitle property 
	data:[],			//explicit data passed from outside!
	cleardata:false,	//if true, the data is wiped; useful when modifying the grid from the outside, and we want to wipe all the data
					
	displaycheckboxcolselectall : true, //for checkboxcol column type display a checkbox that will (de)select all checkboxes in the 
	hideheader:false,
					
	selectedRow:-1,
	selectedCell:-1,
					
	showsavecolumn: '',		//or begin, or end; WIP!	also effects the default save button on panel grids
	showeditcolumn: 'begin',//or end or set void to hide; also affects the default edit button on panel grids
	showdeletecolumn: 'begin',//or end or whatever	TODO: not yet implemented; also affect the default button on panel grids
	
	editonselect:false,	//true if you trigger an edit when a cell is clicked
	editform: {},
	norecordstpl : '',
					
	classes:'',		//string, custom classes to be added to the grid
					
	//custom callbacks
	onsavesuccessful:null,		//callback on save successfull; parameter: the record 
	onselectionchange:null,		//called when selection was changed: grid, row, column, record
	onrowclick:null,			//same as onselectionchange, but it is triggered ALL the time the row is clicked
	
	//these callbacks affect the panel grid: params(form,record)
	onbeforerowrecordloaded:null,	//a function, or the name of the function to be ran BEFORE the data has been loaded into the row form
	onafterrowrecordloaded:null,	//a function, or the name of the function to be ran AFTER the data has been loaded into the row form

	Grid colums as JS records
	
	columns : [
	
	
	{
		title:_L['Is_it_active'],
		fieldname:'_a_state',
		atype:'combobox',
		align:'right',
	},

	
	
	{
		title:_L['login'],
		fieldname:'_a_login',
	},

	
	
	{
		title:_L['password'],
		fieldname:'_a_password',
	},

	
	
	{
		title:_L['Master_user_ID'],
		fieldname:'_a_master_user_id',
		align:'right',
	},

	
	
	{
		title:_L['Type'],
		fieldname:'_a_type',
		atype:'combobox',
		align:'right',
	},

	
	
	{
		title:_L['Created_on'],
		fieldname:'_a_creation_date',
	},

	
	
	{
		title:_L['Rights_mask'],
		fieldname:'_a_rights',
		align:'right',
	},

	
	
	{
		title:_L['Number_of_entries_commissioned_for'],
		fieldname:'_a_reserved_entries_count',
		align:'right',
	},

	
	
	{
		title:_L['Remaining_entries_to_entere'],
		fieldname:'_a_remaining_entries_count',
		align:'right',
	},

	
	
	{
		title:_L['Was_it_created_automaticall'],
		fieldname:'_a_automatic',
		atype:'combobox',
		align:'right',
	},

	
	
	{
		title:_L['Number_of_created_drafts'],
		fieldname:'_a_stat_draft_created',
		align:'right',
	},

	
	
	{
		title:_L['Number_of_activated_drafts'],
		fieldname:'_a_stat_draft_activated',
		align:'right',
	},

	
		]
*/
