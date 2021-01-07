
/*******************************************************
 * this is an object to hold various information about the state of the current alias
 */
 if (typeof objCountries === "undefined") var objCountries = {};

 $.extend(objCountries, {
	grid : $('#countries-grid'),
	form : null,	
	
	addButtonCountries: $('#countries-add-button'),
	refreshButtonCountries: $('#countries-refresh-button'),
	saveButtonCountries: $('#countries-save-button'),	
	cancelButtonCountries: $('#countries-cancel-button'),	
});
objCountries.saveButtonCountries.addClass('ace-hide');
objCountries.cancelButtonCountries.addClass('ace-hide');

$('#countries-grid').ace('create',{
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
	
	idfield : '_country_id',
	
	editform : {
		template:'countries-ed-frm-tpl',
		renderto:'countries-ed-frm-renderer',
		type : 'custom',
		
		autoloadfieldsonshow:false,//only load fields on demand
		
		displaysavebtn:false,
		displaycancelbtn:false,
		validate:true,			
		customsavetext:'',		//if lenght > 0 it will be the text displayed on the save button
		customcanceltext:'',		//if lenght > 0 it will be the text displayed on the cancel button
		oninit: function(form) {
			objCountries.form = $(form);
		},
		onshow:function(form){
			        	
		},
		customshow:function(form, containerId){
            $('#'+containerId).addClass('ace-show');
            objCountries.addButtonCountries.addClass('ace-hide');
            objCountries.refreshButtonCountries.addClass('ace-hide');
            objCountries.saveButtonCountries.removeClass('ace-hide');
            objCountries.cancelButtonCountries.removeClass('ace-hide');
        },
        customhide:function(form, containerId){
            $('#'+containerId).removeClass('ace-show');
            objCountries.addButtonCountries.removeClass('ace-hide');
            objCountries.refreshButtonCountries.removeClass('ace-hide');
            objCountries.saveButtonCountries.addClass('ace-hide');
            objCountries.cancelButtonCountries.addClass('ace-hide');
        },
		onbeforeloadrecord:function(form, record){			
		},
		onafterloadrecord:function(form, record){
	    	if ($.aceOverWatch.utilities.isVoid(form)) return;
	    	objCountries.form = $(form);
	    	
	   },
	},
	net : {
		remote : true,
		autoload : false,
		fid  : 280,
	},
	
});
/*******************************************************
 * function called whenever the countries display content
 */
function onDisplayContentForTagcountriesmenutag(tag) {
	refreshCountries();
}


/*******************************************************
 * function called when the countries refresh button is called 
 */
function refreshCountries(){
	$.aceOverWatch.field.grid.reloadPage(objCountries.grid);
}
/*******************************************************
 * function called when then the add countries button is pressed
 */
function addNewCountries(){
	$.aceOverWatch.field.grid.addNewRecord(objCountries.grid);
}
/*******************************************************
 * function called when then the save countries button is pressed
 */
function saveCountries(){
	objCountries.form.ace('save');
}
/*******************************************************
 * function called when then the cancel countries button is pressed
 */
function cancelCountries(){
	objCountries.form.ace('cancel');
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
		title:_L['Currency_ID'],
		fieldname:'_country_currency_id',
	},

	
	
	{
		title:_L['Phone_prefix'],
		fieldname:'_country_phone_prefix',
	},

	
	
	{
		title:_L['Phone_digits_no'],
		fieldname:'_country_phone_digits',
	},

	
	
	{
		title:_L['Phone_mobile_digits'],
		fieldname:'_country_mobile_digits',
	},

	
	
	{
		title:_L['Mobile_prefix'],
		fieldname:'_country_mobile_prefix_digits',
	},

	
	
	{
		title:_L['Country_image_map_coordinates'],
		fieldname:'_country_image_map_coordinates',
	},

	
	
	{
		title:_L['Country_image_over'],
		fieldname:'_country_image_over',
	},

	
	
	{
		title:_L['Country_cities_image'],
		fieldname:'_country_cities_image',
	},

	
	
	{
		title:_L['Country_flag_picture'],
		fieldname:'_country_flag_picture',
	},

	
	
	{
		title:_L['Country_ISO_Code'],
		fieldname:'_country_iso_code',
	},

	
	
	{
		title:_L['Country_ISO_Name'],
		fieldname:'_country_iso_name',
	},

	
		]
*/
