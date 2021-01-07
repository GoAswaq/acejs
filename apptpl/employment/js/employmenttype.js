
/*******************************************************
 * this is an object to hold various information about the state of the current alias
 */
 if (typeof objEmploymentType === "undefined") var objEmploymentType = {};

 $.extend(objEmploymentType, {
	grid : $('#employmenttype-grid'),
	form : null,	
	
	addButtonEmploymentType: $('#employmenttype-add-button'),
	refreshButtonEmploymentType: $('#employmenttype-refresh-button'),
	saveButtonEmploymentType: $('#employmenttype-save-button'),	
	cancelButtonEmploymentType: $('#employmenttype-cancel-button'),	
});
objEmploymentType.saveButtonEmploymentType.addClass('ace-hide');
objEmploymentType.cancelButtonEmploymentType.addClass('ace-hide');

$('#employmenttype-grid').ace('create',{
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
	
	idfield : '_employment_type_id',
	
	editform : {
		template:'employmenttype-ed-frm-tpl',
		renderto:'employmenttype-ed-frm-renderer',
		type : 'custom',
		
		autoloadfieldsonshow:false,//only load fields on demand
		
		displaysavebtn:false,
		displaycancelbtn:false,
		validate:true,			
		customsavetext:'',		//if lenght > 0 it will be the text displayed on the save button
		customcanceltext:'',		//if lenght > 0 it will be the text displayed on the cancel button
		oninit: function(form) {
			objEmploymentType.form = $(form);
		},
		onshow:function(form){
			        	
		},
		customshow:function(form, containerId){
            $('#'+containerId).addClass('ace-show');
            objEmploymentType.addButtonEmploymentType.addClass('ace-hide');
            objEmploymentType.refreshButtonEmploymentType.addClass('ace-hide');
            objEmploymentType.saveButtonEmploymentType.removeClass('ace-hide');
            objEmploymentType.cancelButtonEmploymentType.removeClass('ace-hide');
        },
        customhide:function(form, containerId){
            $('#'+containerId).removeClass('ace-show');
            objEmploymentType.addButtonEmploymentType.removeClass('ace-hide');
            objEmploymentType.refreshButtonEmploymentType.removeClass('ace-hide');
            objEmploymentType.saveButtonEmploymentType.addClass('ace-hide');
            objEmploymentType.cancelButtonEmploymentType.addClass('ace-hide');
        },
		onbeforeloadrecord:function(form, record){			
		},
		onafterloadrecord:function(form, record){
	    	if ($.aceOverWatch.utilities.isVoid(form)) return;
	    	objEmploymentType.form = $(form);
	    	
	   },
	},
	net : {
		remote : true,
		autoload : false,
		fid  : 980,
	},
	
});
/*******************************************************
 * function called whenever the employmenttype display content
 */
function onDisplayContentForTagemploymenttypemenutag(tag) {
	refreshEmploymentType();
}


/*******************************************************
 * function called when the employmenttype refresh button is called 
 */
function refreshEmploymentType(){
	$.aceOverWatch.field.grid.reloadPage(objEmploymentType.grid);
}
/*******************************************************
 * function called when then the add employmenttype button is pressed
 */
function addNewEmploymentType(){
	$.aceOverWatch.field.grid.addNewRecord(objEmploymentType.grid);
}
/*******************************************************
 * function called when then the save employmenttype button is pressed
 */
function saveEmploymentType(){
	objEmploymentType.form.ace('save');
}
/*******************************************************
 * function called when then the cancel employmenttype button is pressed
 */
function cancelEmploymentType(){
	objEmploymentType.form.ace('cancel');
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
		title:_L['Name'],
		fieldname:'_et_name',
	},

	
	
	{
		title:_L['Active'],
		fieldname:'_et_active',
		atype:'checkbox',
		renderer:rendererCheckbox,
		align:'center',
	},

	
		]
*/
