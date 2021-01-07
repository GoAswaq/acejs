
 if (typeof objCities === "undefined") var objCities = {};

 $.extend(objCities, {
	grid : $('#cities-inline-grid'),
	
	addButtonCities: $('#cities-add-button'),
	refreshButtonCities: $('#cities-refresh-button'),
});

$('#cities-inline-grid').ace('create',{
	type : 'grid',
	gtype : 'table',		
	width:'100%',		
	allowedit : true,
	alloweditinline : true,
	allowadd : false,
	allowdelete : false,
	allowrefresh : false,
	allowsearchfield:false,
	
	showeditcolumn:'',
	displayrowlines:true,
	displaycolumnlines:true,
	
	selectiontype : 'row', //can be row, or cell
	
	idfield : '_city_id',
	net : {
		remote : true,
		autoload : false,
		fid  : 340,
	}
});

/*******************************************************
 * function called whenever the cities display content
 */
function onDisplayContentForTagcitiesmenutag(tag) {
	refreshCities();
}
/*******************************************************
 * function called when the cities refresh button is called 
 */
function refreshCities(){
	$.aceOverWatch.field.grid.reloadPage(objCities.grid);
}
/*******************************************************
 * function called when then the add cities button is pressed
 */
function addNewCities(){
	$.aceOverWatch.field.grid.addNewRecord(objCities.grid);
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
		title:_L['Country_ID'],
		fieldname:'_country_id',
	},

	
	
	{
		title:_L['Parinte_city_ID'],
		fieldname:'_city_id_parent',
	},

	
	
	{
		title:_L['City_phone_prefix'],
		fieldname:'_city_phone_prefix',
	},

	
	
	{
		title:_L['STG_city'],
		fieldname:'_city_left',
		align:'right',
	},

	
	
	{
		title:_L['DRP_city'],
		fieldname:'_city_right',
		align:'right',
	},

	
	
	{
		title:_L['Map_coordinates'],
		fieldname:'_city_image_map_coordinates',
	},

	
	
	{
		title:_L['City_image'],
		fieldname:'_city_image_over',
	},

	
	]
	
	*/
	
	
