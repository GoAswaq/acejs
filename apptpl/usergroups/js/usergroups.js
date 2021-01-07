
/*******************************************************
 * this is an object to hold various information about the state of the current alias
 */
 if (typeof objUserGroups === "undefined") var objUserGroups = {};

 $.extend(objUserGroups, {
	grid : $('#usergroups-grid'),
	form : null,	
	
	addButtonUserGroups: $('#usergroups-add-button'),
	refreshButtonUserGroups: $('#usergroups-refresh-button'),
	saveButtonUserGroups: $('#usergroups-save-button'),	
	cancelButtonUserGroups: $('#usergroups-cancel-button'),	
});
objUserGroups.saveButtonUserGroups.addClass('ace-hide');
objUserGroups.cancelButtonUserGroups.addClass('ace-hide');

$('#usergroups-grid').ace('create',{
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
	
	idfield : '_user_group_id',
	
	editform : {
		template:'usergroups-ed-frm-tpl',
		renderto:'usergroups-ed-frm-renderer',
		type : 'custom',
		
		autoloadfieldsonshow:false,//only load fields on demand
		
		displaysavebtn:false,
		displaycancelbtn:false,
		validate:true,			
		customsavetext:'',		//if lenght > 0 it will be the text displayed on the save button
		customcanceltext:'',		//if lenght > 0 it will be the text displayed on the cancel button
		oninit: function(form) {
			objUserGroups.form = $(form);
		},
		onshow:function(form){
			        	
		},
		customshow:function(form, containerId){
            $('#'+containerId).addClass('ace-show');
            objUserGroups.addButtonUserGroups.addClass('ace-hide');
            objUserGroups.refreshButtonUserGroups.addClass('ace-hide');
            objUserGroups.saveButtonUserGroups.removeClass('ace-hide');
            objUserGroups.cancelButtonUserGroups.removeClass('ace-hide');
        },
        customhide:function(form, containerId){
            $('#'+containerId).removeClass('ace-show');
            objUserGroups.addButtonUserGroups.removeClass('ace-hide');
            objUserGroups.refreshButtonUserGroups.removeClass('ace-hide');
            objUserGroups.saveButtonUserGroups.addClass('ace-hide');
            objUserGroups.cancelButtonUserGroups.addClass('ace-hide');
        },
		onbeforeloadrecord:function(form, record){			
		},
		onafterloadrecord:function(form, record){
	    	if ($.aceOverWatch.utilities.isVoid(form)) return;
	    	objUserGroups.form = $(form);
	    	
	   },
	},
	net : {
		remote : true,
		autoload : false,
		fid  : 460,
	},
	
});
/*******************************************************
 * function called whenever the usergroups display content
 */
function onDisplayContentForTagusergroupsmenutag(tag) {
	refreshUserGroups();
}


/*******************************************************
 * function called when the usergroups refresh button is called 
 */
function refreshUserGroups(){
	$.aceOverWatch.field.grid.reloadPage(objUserGroups.grid);
}
/*******************************************************
 * function called when then the add usergroups button is pressed
 */
function addNewUserGroups(){
	$.aceOverWatch.field.grid.addNewRecord(objUserGroups.grid);
}
/*******************************************************
 * function called when then the save usergroups button is pressed
 */
function saveUserGroups(){
	objUserGroups.form.ace('save');
}
/*******************************************************
 * function called when then the cancel usergroups button is pressed
 */
function cancelUserGroups(){
	objUserGroups.form.ace('cancel');
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
		title:_L['Parinte_user_group_ID'],
		fieldname:'_user_group_id_parent',
	},

	
	
	{
		title:_L['Name'],
		fieldname:'_user_group_name',
	},

	
	
	{
		title:_L['Code'],
		fieldname:'_user_group_code',
	},

	
	
	{
		title:_L['STG_user_group'],
		fieldname:'_user_group_left',
		align:'right',
	},

	
	
	{
		title:_L['DRP_user_group'],
		fieldname:'_user_group_right',
		align:'right',
	},

	
	
	{
		title:_L['Default_group_on_register'],
		fieldname:'_ugauc_default_on_register',
		atype:'checkbox',
		renderer:rendererCheckbox,
		align:'center',
	},

	
	
	{
		title:_L['Ugauc_disabled'],
		fieldname:'_ugauc_disabled',
		align:'right',
	},

	
	
	{
		title:_L['Ugauc_allow_aliases'],
		fieldname:'_ugauc_allow_aliases',
		align:'right',
	},

	
		]
*/
