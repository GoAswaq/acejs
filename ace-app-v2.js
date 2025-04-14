/**
 *
 * @param tag
 * @param data
 * @param callback
 *
 * the function is called each time one of the entries in the application menu is clicked
 * the effect of this: it changes the main contents of the window!
 * the card displayed is the one with matching tag attribute
 */
function switchMainMenuContent(tag, data, callback) {
	window.location.hash = tag;
}
/**
 * tag can he a string, or an array; if it is an array, the working tag will be it's first element, will be removed from the the array, and the remaining data will be passed further down
 * @param tag
 */
function internalNavigation(tag, data, callback){

	if( $.isFunction(window['onBeforeInternalNavigation']) ){
		window['onBeforeInternalNavigation'](tag,data);
	}

	var workingTag = tag;
	if( jQuery.type( workingTag ) === "array"){
		if( workingTag.count == 0 ){
			return;//nothing to do
		}

		if( workingTag[0] == 'acenav'){
			$.aceOverWatch.specialHashNavigation.goto(workingTag[1],workingTag[2]);
			return;
		}

		workingTag = workingTag[0];
		tag.shift();
	}else{
		tag = null;
	}

	/*
	 * each menu entry MAY have a function defined, called  onBeforeDisplayContentForTagXXX, where XXX is the name of the tag identifying the content in the main menu
	 * if this method exists, and it returns something different than true, the panel will not be opened
	 */
	let allOk = $.aceOverWatch.utilities.runIt('onBeforeDisplayContentForTag'+workingTag,data, callback);
	if( $.aceOverWatch.utilities.wasItRan() && !allOk ){
		return;
	}

	/*
     * because we might have ended up here through an indirect means, make sure the side menu entry is set as active too
     */
	$.aceOverWatch.field.accordion.setTagAsActive($(window.aceApp.data($.aceOverWatch.settings.aceSettings).sidemenu),workingTag);

	if ($.aceOverWatch.utilities.isVoid(data)) {
		data = tag;
	}

	/*
	 * display the card with the attribute exactly as that of the item clicked
	 */
	$.aceOverWatch.field.cardview.switchTo($('#ace-content'), '[tag="'+workingTag+'"]');

	/*
	 * each of these menu entries should have a function to be called immidietly when it is displayed
	 * this function should be called: onDisplaycontentForTagXXX, where XXX is the name of the tag identifying the content in the main menu
	 */
	$.aceOverWatch.utilities.runIt('onDisplayContentForTag'+workingTag,workingTag, data, callback);

	/*
	 * after every navigation, check to see if the side menu is visible in full screen
	 * if it is, dismiss it
	 */
	if( $.aceOverWatch.utilities.isViewportForMobile() ){
		if( $.aceOverWatch.utilities.isElementInFullScreen(myApp.data('aceSideContainer')) ){
			$.aceOverWatch.utilities.dissmissViewInFullScreen(myApp.data('aceSideContainer'));
		}
	}

}

/**
 *
 * @param $state true: only ace content visible, false: all
 */
function aceAPPContentOnly($state){
	if( $state ){
		if( !$.aceOverWatch.utilities.isVoid(myApp.data('aceTopBar'),true) ) {
			myApp.addClass('ace-no-top-bar');
		}

		if( !$.aceOverWatch.utilities.isVoid(myApp.data('aceSideContainer'),true) ){
			myApp.data('acePresentation').addClass('ace-presentation-hidden-info');
		}
	}else{

		if( !$.aceOverWatch.utilities.isVoid(myApp.data('aceTopBar'),true) ) {
			myApp.removeClass('ace-no-top-bar');
		}

		if( !$.aceOverWatch.utilities.isVoid(myApp.data('aceSideContainer'),true) ){
			myApp.data('acePresentation').removeClass('ace-presentation-hidden-info');
		}
	}
}

/**
 * the method toggles the visible status of the ace side menu
 */
function aceAppSideMenuToggle(){
	if( $.aceOverWatch.utilities.isViewportForMobile() ){
		if( $.aceOverWatch.utilities.isElementInFullScreen(myApp.data('aceSideContainer')) ){
			$.aceOverWatch.utilities.dissmissViewInFullScreen(myApp.data('aceSideContainer'));
		}else{
			$.aceOverWatch.utilities.viewInFullScreen(myApp.data('aceSideContainer'),{
				displayinfullscreencancel:true,
				customclassforpopupwindowwhendisplayed:'ace-main-presentation',
				ondissmissfullscreen : function(target,internal){
					$.aceOverWatch.specialHashNavigation.deregister(target.data($.aceOverWatch.settings.aceSettings).id,internal);
				}
			});
			$.aceOverWatch.specialHashNavigation.register(myApp.data('aceSideContainer').data($.aceOverWatch.settings.aceSettings).id,myApp.data('aceSideContainer'),'mainsidemenu');
		}
	}else{
		myApp.data('acePresentation').toggleClass('ace-presentation-hidden-info');
	}
	myApp.data('aceSideContainer').trigger('acesidemenutoggle');
}

/**
 * the method forces the ace side menu to be visible
 */
function aceAppSideMenuShow(){
	if( $.aceOverWatch.utilities.isViewportForMobile() ){
		if( !$.aceOverWatch.utilities.isElementInFullScreen(myApp.data('aceSideContainer')) ){
			$.aceOverWatch.utilities.viewInFullScreen(myApp.data('aceSideContainer'),{
				displayinfullscreencancel:true,
				customclassforpopupwindowwhendisplayed:'ace-main-presentation',
				ondissmissfullscreen : function(target,internal){
					$.aceOverWatch.specialHashNavigation.deregister(target.data($.aceOverWatch.settings.aceSettings).id,internal);
				}
			});
			$.aceOverWatch.specialHashNavigation.register(myApp.data('aceSideContainer').data($.aceOverWatch.settings.aceSettings).id,myApp.data('aceSideContainer'),'mainsidemenu');
		}
	}else{
		if( myApp.data('acePresentation').hasClass('ace-presentation-hidden-info') ) {
			myApp.data('acePresentation').removeClass('ace-presentation-hidden-info');
		}
	}
	myApp.data('aceSideContainer').trigger('acesidemenutoggle');
}
/**
 * the method forces the ace side menu to be hidden
 */
function aceAppSideMenuHide(){
	if( $.aceOverWatch.utilities.isViewportForMobile() ){
		if( $.aceOverWatch.utilities.isElementInFullScreen(myApp.data('aceSideContainer')) ){
			$.aceOverWatch.utilities.dissmissViewInFullScreen(myApp.data('aceSideContainer'));
		}
	}else{
		if( !myApp.data('acePresentation').hasClass('ace-presentation-hidden-info') ) {
			myApp.data('acePresentation').addClass('ace-presentation-hidden-info');
		}
	}
	myApp.data('aceSideContainer').trigger('acesidemenutoggle');
}

function aceAPPIsSideMenuVisible(){
	return myApp.data('aceSideContainer').is(':visible');
}

function setDocHeight() {
	document.documentElement.style.setProperty('--vh', String(window.innerHeight/100)+'px');
};

(function ( $ ) {

	$.aceOverWatch.settings.usingNewCSSVersion = true;
	$.aceOverWatch.settings.useflex = true;

	$.aceAppOverWatch = {

		/*
		 * these are global settings used throughout the application
		 */
		settings : {
		},

		/*
		 * a collection of classes used for all the ace fields; bunched up all together here for quick access and review
		 */
		classes:{
			menuLinks : 'ace-menu-links',
			menuSeparator : 'ace-separator',

			mainNav : 'ace-main-nav',

			sideContainer : 'ace-side-container',
			sideMenu : 'ace-side-menu',
			sideMenuGlobalTrigger : 'ace-side-menu-trigger',
			sideMenuCurrentItem : 'ace-side-menu-current',
			sideMenuItem : 'ace-side-menu-item',
			sideMenuDropdownItem : 'ace-side-menu-dropdown',
			sideMenuDropdownIcon : 'ace-arrow-icon',
			sideMenuDropdownList : 'ace-side-menu-dropdown-list',
			sideMenuDropdownSubItem : 'ace-side-menu-dropdown-subitem',
		},

		/**
		 * begin qaDirectEditContainer object
		 * creates a form with fields, which can do save operations, etc
		 */
		qaDirectEditContainer : {
			create : function(target, settings){
				if( !settings ){
					//build the options from the properties of the field
					settings = {};

					$.each(target.attributes, function() {
						// this.attributes is not a plain object, but an array
						// of attribute nodes, which contain both the name and value
						if(this.specified) {

							switch( this.name ){
								case 'extraparams':
									settings[this.name] = $.aceOverWatch.getObjectFromText(this.value);
									break;
								case 'displayexpanded':
								case 'autohide':
									settings[this.name] = (this.value=='true');
									break;
								default:
									settings[this.name] = this.value;
									break;
							}
						}

						delete settings.id;
						delete settings.class;
						delete settings.style;
						delete settings.listeners;

					});
				}

				//we are using 2 extend because we do not want the default settings to overwrite the given settings if any
				$.extend(true,settings,$.extend(true,{
					parenttarget: null,
					parentform : null,
					target : target,
					gridSelector : '#'+settings.modulename+'-grid',
					gridprop : {},
					grid : null,
					form : null,
					accordion : null,
					rowtpl : settings.modulename+'clients-grid-row-template',
					editformtpl : settings.modulename+'-ed-frm-tpl',
					editformrenderer : settings.modulename+'-ed-frm-renderer',
					currentlyEditedRecord : null,
					autoloadfirstrecord : true,

					editingbuttonsmoveddtoparent : true,
					titleBar : $(target).find('#'+settings.modulename+'-title-bar'),
					titleBarText : $(target).find('#'+settings.modulename+'-title-bar-container'),

					addButton: null,
					refreshButton: null,
					saveButton: null,
					cancelButton: null,
					initializedmodules : {},
					knowneditforms : {}, //this is an array with all the complex modules (qadirecteditmodule) that i have to autoload - it's edit forms will be situated on the same level as the main form edit renderer
					//also can contain objects with partial forms to be inserted into the main form edit renderer
					/*  Both forms array should consist of object of the following form:
					 	'<NEEDED TAG TO INTERACT WITH THIS TEMPLATE>': {
							app : <TEMPLATE APP NAME>,
							module : <TEMPLATE MODULE NAME>
							path : <TEMPLATE LOADING PATH>,
							tpl : <TEMPLATE NAME>,

							onunselect : <FUNCTION TO BE CALLED WHEN CLICKED IN THE ACCORDION ON ANOTHER MODULE AND THE MODULE WAS HIDDEN - if returns tru then the edit config wont change>
							onbeforeselect : <FUNCTION TO BE CALLED BEFORE SHOWING THE MODULE - NORMALLY WHEN CLICKED IN THE ACCORDION - if returns false the module won't show >
							onselected : <FUNCTION TO BE CALLED WHEN CLICKED IN THE ACCORDION AND THE MODULE SHOWED>
							tplloadedcallback : <FUNCTION TO BE CALLED UPON SUCCESSFULL LOADING OF THE TEMPLATE>,
							tplloadedbeforecallback: <FUNCTION TO BE CALLED BEFORE CALLBACK ON THE LOADED HTML> - default is 'translate'

							<field name="name" ><l>Contracts</l></field>
	                        <field name="tag" >clients-contracts-data</field>
							<field name="tpl_app">base</field>
							<field name="tpl_module">contracts</field>
							<field name="tpl_path">contracts</field>
							<field name="tpl_al">0</field>
							<field name="sweight">0</field>
							<field name="cls"></field>
					    }
					*/
					oncustomshow : null,
					oncustomhide : null,
					oninit : null,
					onbeforeloadrecord : null,
					onsettitle : null,
					onbeforesave : null,//grid callback
					onsavesuccessful : null, //grid callback

					onformsavesuccessful : null, //form edit callback
					onaddnewrecord : null, //if this function exists will rewrite the default add behaviour


					/*
                     * used by the auto load functionality
                     */
					fileloadsufix : '.tpl', //a sufix, which is added to the name of the templates
					fileloadcode : 'tpl',	//code, sent to the server as part of the url, to signiy that a page template is desired

				}, settings ));


				if (($.aceOverWatch.utilities.isVoid(settings.modulename)) || ($.aceOverWatch.utilities.isVoid(settings.modulenameucw))) {
					$.aceOverWatch.utilities.log('qaeditcontainer faield to be created - err 1');
					return false;
				}

				return $.aceAppOverWatch.qaDirectEditContainer.applySettings(target,settings);
			},

			applySettings : function(target,settings){
				settings.grid = $(target).find(settings.gridSelector);

				settings.dependenciesNo = $.map(settings.knowneditforms, function() { return 1; }).length;
				settings.dependenciesLoaded = 0;
				settings.currentList =  settings.modulename;
				settings.currentTitlePrefix = _L[settings.modulenameucw] ? _L[settings.modulenameucw] : settings.modulenameucw;
				settings.currentTitleModule = _L['Basic_data'];

				var titleBar = settings.titleBar;
				if ((!$.aceOverWatch.utilities.isVoid(settings.parenttarget)) && (settings.editingbuttonsmoveddtoparent)) { //the buttons might be moved already
					var parentSettings = settings.parenttarget.data($.aceOverWatch.settings.aceSettings);
					if (!$.aceOverWatch.utilities.isVoid(parentSettings)) titleBar = parentSettings.titleBar;
				}
				settings.addButton = titleBar.find('#'+settings.modulename+'-add-button');
				settings.addButton.addClass($.aceOverWatch.classes.gridButtonsControls);
				settings.refreshButton = titleBar.find('#'+settings.modulename+'-refresh-button');
				settings.refreshButton.addClass($.aceOverWatch.classes.gridButtonsControls);
				settings.saveButton = titleBar.find('#'+settings.modulename+'-save-button');
				settings.saveButton.addClass($.aceOverWatch.classes.formButtonsControls);
				settings.cancelButton = titleBar.find('#'+settings.modulename+'-cancel-button');
				settings.cancelButton.addClass($.aceOverWatch.classes.formButtonsControls);

				//first save the settings because another complex edit form of mine might need it
				var containerField = $(target);
				containerField.data($.aceOverWatch.settings.aceSettings,settings);

				$.each(settings.knowneditforms, function(tag, tplObj) {

					let url = [settings.fileloadcode];
					if( tplObj.app ){
						url.push(tplObj.app);
					}

					if( tplObj.path ){
						url.push(tplObj.path);
					}

					$.extend(true,tplObj,$.extend(true,{
						url: url.join('/'), //needed to load the template remotely
						tpl: tplObj.modulename + settings.fileloadsufix, //needed to load the template remotely
						parseastemplate : settings.rowparseastemplate,
						donotmovebuttonstoparent : false,
						extraselectorforrenderer : '',
						aditionalclasses : '',
						tplloadedbeforecallback: 'translate',
						tplloadedcallback : function (trg) { //needed to load the template remotely
							/*
                             * Before calling the registered tplloadedcallback we move the module's buttons to our main module's buttons area and
                             * all known templates to the body where they belong
                             */
							if (!tplObj.donotmovebuttonstoparent)
								settings.titleBar.append($(trg).find('div.ace-buttons-groups'));

							$.aceOverWatch.utilities.moveTplToBody($(trg).find('#'+tplObj.modulename+'-ed-frm-tpl'));
							$.aceOverWatch.utilities.moveTplToBody($(trg).find('#'+tplObj.modulename+'-grid-no-data'));

							//After the move was performed, we now call the real registered tplloadedcallback
							//console.log('ontplloadedcallback ' +tplObj.ontplloadedcallback);
							if ($.isFunction(window[tplObj.ontplloadedcallback])) {
								window[tplObj.ontplloadedcallback](target, trg);
							}else{
								if ($.isFunction(tplObj.ontplloadedcallback)){
									tplObj.ontplloadedcallback(target, trg);
								}
							}
						},
						onunselect : null, //function to be called when this module is about to be deactiate - normally when the user clicked on another accordion entry
						//if this returns false then the module will stay activated and the newly clicked will not activate
						//this function is called before the onbeforeselect function of the newly clicked module entry in accordion
						onbeforeselect : null, //function to be called before this module is activated (shown) - normally when the user clicked its accordion entry
											   //if it returns false then the module will not be activated (shown)
						onselected : null, //function to be called when this module is activated and shown

					}, tplObj));

					if (
						($.aceOverWatch.utilities.isVoid(tplObj.modulename))
						|| ($.aceOverWatch.utilities.isVoid(tag))
					) { //this module will not load a external template - meaning that it is already loaded

						if (++settings.dependenciesLoaded == settings.dependenciesNo) {//no need to actually load anything is already in the template that is why we increment the loaded dependencies
							$.aceAppOverWatch.qaDirectEditContainer.createGrid(target);
						}
						return;
					}
					/*
					 * This module has a template that has to be loaded remotely - attention for the template to be considered fully loaded
					 * (with all dependencies) you have to fire templatefullyloaded on the
					 * loading DIV created below (it is received as the second parameter on tplloadedcalback function
					 *
					 */
					var tplPlaceholder = $('<div></div>', {
						'class' : 'ace-col-12 ace-partial-form ace-hide auto-load-tpl' + (($.aceOverWatch.utilities.isVoid(tplObj.aditionalclasses))?'':' '+tplObj.aditionalclasses),
						'tag' : tag,
						'app': tplObj.app,
						'path': tplObj.path,
						'url': 'tpl/'+tplObj.app+'/'+tplObj.path,
						'tpl': tplObj.modulename + '.tpl',
					}).on('templatefullyloaded', function(event, trgQADE, trgQADEModule) {

						if (++settings.dependenciesLoaded == settings.dependenciesNo) {
							$.aceAppOverWatch.qaDirectEditContainer.createGrid(target);
						}
					}).appendTo($("#"+settings.modulename+"-ed-frm-tpl .ace-partial-forms-container"+tplObj.extraselectorforrenderer));
					//perform the actual template loading
					$.aceOverWatch.template.loadTemplate(tplPlaceholder, tplObj);
				});

				//check if click is bound to the editing buttons and if not, then the  default click handler will be added
				var ev = $._data(settings.addButton.find('button'), 'events');

				if (!ev || !ev.click) {
					settings.addButton.find('button').unbind('click').on('click', function() {
						if ($.isFunction(settings.onaddnewrecord)) {
							settings.onaddnewrecord(target);
						}
						else {
							if ($.isFunction(window[settings.onaddnewrecord])) {
								window[settings.onaddnewrecord](target);
							}
							else {
								//default behaviour
								$.aceAppOverWatch.qaDirectEditContainer.addNewRecord(target);
							}
						}
					});
				}
				var ev = $._data(settings.refreshButton.find('button'), 'events');
				if (!ev || !ev.click) {
					settings.refreshButton.find('button').unbind('click').on('click', function() {
						$.aceAppOverWatch.qaDirectEditContainer.refreshGrid(target);
					});
				}
				var ev = $._data(settings.saveButton.find('button'), 'events');
				if (!ev || !ev.click) {
					settings.saveButton.find('button').unbind('click').on('click', function() {
						$.aceAppOverWatch.qaDirectEditContainer.saveGrid(target);
					});
				}
				var ev = $._data(settings.cancelButton.find('button'), 'events');
				if (!ev || !ev.click) {
					settings.cancelButton.find('button').unbind('click').on('click', function() {
						$.aceAppOverWatch.qaDirectEditContainer.cancelGridEditing(target);
					});
				}

				if (settings.dependenciesNo === 0) { //if there were no dependencies in the first place - then we proceed to create our grid
					$.aceAppOverWatch.qaDirectEditContainer.createGrid(target);
				}

				return settings;
			},

			quickaccessEntrySelected : function(target, tag, data) {

				var containerField = $(target);
				var settings = containerField.data($.aceOverWatch.settings.aceSettings);
				if (!settings) return;
				settings.currentmodule = tag;
				//here instead of a switch to see if the tag is allowed I am using a shared array that can be used to add known tags to
				if (typeof settings.knowneditforms[tag] === "undefined") {
					$.aceOverWatch.utilities.log('unrecognized personalize tag: '+tag,'error',true);
					return;
				}

				settings.currentList = settings.modulename;//this can change down if there is a function to call
				var qaEntryResult = null;

				var onBeforeSelect = settings.knowneditforms[tag].onbeforeselect;
				var el = containerField.find('#'+settings.editformrenderer).find('.ace-partial-forms-container [tag="'+tag+'"]');

				//for each of it's visible siblings (normally only one should be in this situation) i have to call onunselect - if one returns false I exit and do not activate the current clicked module
				var allOK = true;
				$.each(el.siblings(".ace-partial-form"), function (idx, tmpEl) {
					var tmpEl = $(tmpEl);
					if ((!tmpEl.hasClass('ace-show')) || (tmpEl.hasClass('ace-hide'))) return; //perform this only for shown modules
					var shownTag = tmpEl.attr('tag');
					var onUnselect = settings.knowneditforms[shownTag].onunselect;
					var res = true;
					if ($.isFunction(onUnselect)) {
						res = onSelect(target, shownTag, data);
					}
					else {
						if ($.isFunction(window[onUnselect])) {
							res = window[onUnselect](target, shownTag, data);
						}
					}
					if (res === false) allOK = false;
				});
				//a sibling's onunselect failed
				if (!allOK) return false;

				//all the siblings can be hidden - try to see If the newly module can be shown
				if ($.isFunction(onBeforeSelect)) {
					qaEntryResult = onBeforeSelect(target, tag, data);
				}
				else {
					if ($.isFunction(window[onBeforeSelect])) {
						qaEntryResult = window[onBeforeSelect](target, tag, data);
					}
				}
				if (qaEntryResult === false) return false;
				//this is a known module tag and the select function did not returned an error

				//display the editing buttons for this module
				$.aceAppOverWatch.qaDirectEditContainer.quickaccessDisplayButtonsGrp(target);


				var el = containerField.find('#'+settings.editformrenderer).find('.ace-partial-forms-container [tag="'+tag+'"]');

				el.addClass('ace-show');
				el.removeClass('ace-hide');
				el.siblings(".ace-partial-form").addClass('ace-hide');
				el.siblings(".ace-partial-form").removeClass('ace-show');
				//at the end - call onselected if present and set title

				var onSelected = settings.knowneditforms[tag].onselected;
				if ($.isFunction(onSelected)) {
					onSelected(target, tag, data);
				}
				else {
					if ($.isFunction(window[onSelected])) {
						window[onSelected](target, tag, data);
					}
				}

				if( (!$.aceOverWatch.utilities.isVoid(data)) &&
					(!$.aceOverWatch.utilities.isVoid(data.name))
				){
					settings.currentTitleModule = data.name;
				}


				if ($.isFunction(settings.onsettitle)) {
					res = settings.onsettitle(target, tag, data);
				}
				else {
					if ($.isFunction(window[settings.onsettitle])) {
						res = window[settings.onsettitle](target, tag, data);
					}
					else {
						var title = settings.currentTitlePrefix;
						if ($.aceOverWatch.utilities.isVoid(title)) title='';
						if (!$.aceOverWatch.utilities.isVoid(settings.currentTitleModule)) {
							if ($.aceOverWatch.utilities.isVoid(title)) title += ' - ';
							title += settings.currentTitleModule;
						}

						settings.titleBar.html(title);
					}
				}

			},

			quickaccessDisplayButtonsGrp : function(target) {
				var containerField = $(target);
				var settings = containerField.data($.aceOverWatch.settings.aceSettings);
				if (!settings) return;

				/*
				 * hide all the buttons groups
				 */
				settings.titleBar.find('div.ace-buttons-groups').addClass('ace-hide');
				/*
				 * show the current list buttons groups - it is not the current module because maybe i want to show other buttons
				 */
				settings.titleBar.find("#"+settings.currentList+"-edit-buttons-grp").removeClass('ace-hide');
			},

			createGrid : function(target) {
				var containerField = $(target);
				var settings = containerField.data($.aceOverWatch.settings.aceSettings);
				if (!settings) return;
				if ($.aceOverWatch.utilities.isVoid(settings.grid)) return;

				$.extend(true, settings.gridprop, $.extend(true, {
					type : 'grid',
					gtype: 'panel',

					width:'100%',
					rowtpl:settings.rowtpl,
					rowparseastemplate : settings.rowparseastemplate,
					allowedit : true,
					alloweditinline : false,
					allowadd:false,
					allowdelete:false,
					allowrefresh:false,
					allowsearchfield:false,

					editonselect:true,
					showeditcolumn:'',

					displayrowlines:true,
					displaycolumnlines:true,
					cleardata: true,

					hideheader:true,
					selectiontype : 'row',

					idfield : settings.idfield,
					hideformaftersave : false,

					editform : {
						template:settings.editformtpl,
						renderto:settings.editformrenderer,
						type : 'custom',
						hideaftersave : false,
						parseastemplate : settings.rowparseastemplate,
						autoloadfieldsonshow:false,//only load fields on demand

						displaysavebtn:false,
						displaycancelbtn:false,
						validate:true,
						validateOnlyVisibleSections:false,
						onAfterSectionsValidation:function (target, validSections, invalidSections) {
							$.each(validSections, function(idx, val) {
								$(".ace-accordion[tag='"+val+"']").removeClass('ace-error');
							});
							$.each(invalidSections, function(idx, val) {
								$(".ace-accordion[tag='"+val+"']").addClass('ace-error');
							});
						},
						customsavetext:'',		//if lenght > 0 it will be the text displayed on the save button
						customcanceltext:'',		//if lenght > 0 it will be the text displayed on the cancel button
						oninit: function(form) {
							settings.form = $(form);
							containerField.triggerHandler('qadefullyinitialized', [target, form]);
							settings.saveButton.addClass('ace-hide');
							settings.cancelButton.addClass('ace-hide');

							if ($.isFunction(window[settings.oninit])) {
								window[settings.oninit](target, form);
							}else{
								if ($.isFunction(settings.oninit)){
									settings.oninit(target, form);
								}
							}
						},
						onshow:function(form){
							if ($.isFunction(window[settings.onshow])) {
								window[settings.onshow](target, form);
							}else{
								if ($.isFunction(settings.onshow)){
									settings.onshow(target, form);
								}
							}
						},
						customshow:function(form, containerId){
							$('#'+containerId).addClass('ace-show');
							console.log('#'+containerId +'- customshow from currentList: ' + settings.currentList);

							var titleBar = settings.titleBar;
							if ((!$.aceOverWatch.utilities.isVoid(settings.parenttarget)) && (settings.editingbuttonsmoveddtoparent)) { //the buttons might be moved already
								var parentSettings = settings.parenttarget.data($.aceOverWatch.settings.aceSettings);
								if (!$.aceOverWatch.utilities.isVoid(parentSettings)) titleBar = parentSettings.titleBar;
							}

							$.aceOverWatch.utilities.showGridEditingButtons(titleBar.find("#"+settings.currentList+"-edit-buttons-grp"), true);

							if ($.isFunction(window[settings.oncustomshow])) {
								window[settings.oncustomshow](target, form);
							}else{
								if ($.isFunction(settings.oncustomshow)){
									settings.oncustomshow(target, form);
								}
							}
						},
						customhide:function(form, containerId){
							//console.log('#'+containerId +'- customhide from currentList: ' + settings.currentList);
							$('#'+containerId).removeClass('ace-show');
							var titleBar = settings.titleBar;
							if ((!$.aceOverWatch.utilities.isVoid(settings.parenttarget)) && (settings.editingbuttonsmoveddtoparent)) { //the buttons might be moved already
								var parentSettings = settings.parenttarget.data($.aceOverWatch.settings.aceSettings);
								if (!$.aceOverWatch.utilities.isVoid(parentSettings)) titleBar = parentSettings.titleBar;
							}
							$.aceOverWatch.utilities.showGridEditingButtons(titleBar.find("#"+settings.currentList+"-edit-buttons-grp"), false);

							settings.currentlyEditedRecord = null;
							if ($.isFunction(window[settings.oncustomhide])) {
								window[settings.oncustomhide](target, form);
							}else{
								if ($.isFunction(settings.oncustomhide)){
									settings.oncustomhide(target, form);
								}
							}
						},
						onbeforeloadrecord:function(form, record){
							if ($.isFunction(window[settings.onbeforeloadrecord])) {
								window[settings.onbeforeloadrecord](target, form, record);
							}else{
								if ($.isFunction(settings.onbeforeloadrecord)){
									settings.onbeforeloadrecord(target, form, record);
								}
							}
						},
						onafterloadrecord:function(form, record){
							if ($.aceOverWatch.utilities.isVoid(form)) return;
							settings.form = $(form);
							settings.currentlyEditedRecord = record;

							if ($.isFunction(window[settings.onafterloadrecord])) {
								window[settings.onafterloadrecord](target, form, record);
							}else{
								if ($.isFunction(settings.onafterloadrecord)){
									settings.onafterloadrecord(target, form, record);
								}
							}
						},
						onsavesuccessful : settings.onformsavesuccessful
					},
					net : {
						remote : true,
						autoload : false,
						fid  : settings.fid,
						size : (settings.size > 0 ? settings.size : 25),
					},
					pagination : ( $.aceOverWatch.utilities.isVoid(settings.pagination) ? true : settings.pagination),

					onloadsuccessful: function(target, data, startIdx, endIdx, totalNoRec) {
						if (settings.autoloadfirstrecord)
							$.aceOverWatch.field.grid.selectRow(target, startIdx);
					},
					/***********************************
					 * grid callback definitions start here:
					 ***********************************/
					onafterrowrecordloaded: settings.onafterrowrecordloaded,
					onbeforesave: settings.onbeforesave,
					onsavesuccessful : settings.onsavesuccessful,
				},settings.gridprop));

				settings.grid.ace('create',settings.gridprop);

			},

			refreshGrid : function(target) {
				var containerField = $(target);
				var settings = containerField.data($.aceOverWatch.settings.aceSettings);
				if (!settings) return;
				if ($.aceOverWatch.utilities.isVoid(settings.grid)) return;
				$.aceOverWatch.field.grid.reloadPage(settings.grid);
			},

			addNewRecord : function(target) {
				var containerField = $(target);
				var settings = containerField.data($.aceOverWatch.settings.aceSettings);
				if (!settings) return;
				if ($.aceOverWatch.utilities.isVoid(settings.grid)) return;
				$.aceOverWatch.field.grid.addNewRecord(settings.grid);
			},

			saveGrid : function(target) {
				var containerField = $(target);
				var settings = containerField.data($.aceOverWatch.settings.aceSettings);
				if (!settings) return;
				if ($.aceOverWatch.utilities.isVoid(settings.form)) return;
				settings.form.ace('save');
			},

			cancelGridEditing : function(target) {
				var containerField = $(target);
				var settings = containerField.data($.aceOverWatch.settings.aceSettings);
				if (!settings) return;
				if ($.aceOverWatch.utilities.isVoid(settings.form)) return;
				settings.form.ace('cancel');

			}
		}
	};

	/*****************************************************************
	 * plugin starts here
	 *****************************************************************/

	$.fn.ace_app = function(settings) {
		$.extend(true,settings,$.extend(true,{
			topbar					: '', //hide the topbar if void, otherwise use this as a selector and move the content in the topbar

			sidemenu				: '', //hide the sidemenu if void, otherwise use this as a selector and move the content in the sidebar
			hidesidemenuinitially	: false,//set to TRUE when we want initially the side menu to be hidden until something else happens

			contentselector 		: '', //how to identify each content section to be displayed in the main screen
			withtransparentbackground: true,

		}, settings ));

		window.myApp =  $('<div></div>', {
			id: 'ace-app'
		});
		window.myApp.version = 'v2';
		myApp.data($.aceOverWatch.settings.aceSettings,settings);

		let hasTopbar = false;
		if( settings.topbar && settings.topbar !== '' ){
			myApp.data('aceTopBar',$('<div></div>', {
					id: 'ace-top-bar'
				})
					.addClass($.aceAppOverWatch.classes.mainNav)
					.append( $(settings.topbar).removeClass('ace-hide').detach() )
			);
			hasTopbar = true;
		}else{
			myApp.addClass('ace-no-top-bar');
		}

		if( settings.sidemenu && settings.sidemenu !== '' ){
			myApp.data('aceSideContainer',  $(settings.sidemenu).addClass($.aceAppOverWatch.classes.sideContainer).removeClass('ace-hide').detach());
			myApp.data('aceSideMenu',myApp.data('aceSideContainer').find('.'+$.aceAppOverWatch.classes.sideMenu));
			myApp.data('aceSideContainer').addClass('ace-presentation-info');

			myApp.data('aceSideContainer').addClass('ace-presentation-info');

			/*
			 * on other thing here
			 * - IF we have a sidemenu ( and if we are here, we do have one),
			 * - AND if we have a TOPBAR, than:
			 * - all the top bar menubuttons will be hidden on mobile
			 * - ALSO, all actions which the menubuttons will be transfered to a NEW
			 * - side menu accordion ( if we have an accordion on the side menu )
			 */
			if( hasTopbar ) {
				let menuButtonsElements = myApp.data('aceTopBar').find('[type="menubutton"]');
				if (menuButtonsElements.length > 0) {

					menuButtonsElements.addClass('ace-hide-on-mobile');

					let otherAccordionItem = {
						name: 'Other',
						iconcls: 'fa fa-ellipsis-v',
						cls: 'ace-display-only-on-mobile',
						children: [],
					};

					menuButtonsElements.each(function () {
						let settings = $(this).data($.aceOverWatch.settings.aceSettings);

						if (!settings) {
							return;
						}
						for (let idx in settings.innerItems) {
							if (settings.innerItems[idx].type != 'simple') {
								continue;
							}
							let newAccordionChild = {
								name: settings.innerItems[idx].label,
								tag: $.aceOverWatch.utilities.isVoid(settings.innerItems[idx].tag, true) ? settings.innerItems[idx].label : settings.innerItems[idx].tag,
								value: settings.innerItems[idx].value,
								iconcls: settings.innerItems[idx].iconcls,
								cls: 'ace-display-only-on-mobile',
								idx: idx,
								originalAction: $.aceOverWatch.utilities.isVoid(settings.innerItems[idx].action, true) ? settings.onselect : settings.innerItems[idx].action,
								action: function (tag, tagData) {
									$.aceOverWatch.utilities.runIt(tagData.originalAction, tagData.idx, tagData.tag, tagData.value);
									if ($.aceOverWatch.utilities.isViewportForMobile()) {
										if ($.aceOverWatch.utilities.isElementInFullScreen(myApp.data('aceSideContainer'))) {
											$.aceOverWatch.utilities.dissmissViewInFullScreen(myApp.data('aceSideContainer'));
										}
									}
								}
							};
							otherAccordionItem.children.push(newAccordionChild);
						}
					});

					myApp.data('aceSideMenu').ace('modify', {
						aditionaldata: [otherAccordionItem],
					});

				}
			}



		}
		else {
			myApp.data('aceSideContainer', '');
		}

		myApp.data('aceContent', $('<div></div>', {
				id: 'ace-content'
			})
				.addClass('ace-content ace-presentation-main')
		);

		if (settings.contentselector!=='') {
			myApp.data('aceContent').ace('create', {type:'cardview',contentselector:settings.contentselector});
		}

		myApp.data('acePresentation', $('<div></div>', {
				id: 'ace-main-presentation'
			})
				.addClass('ace-main-presentation ace-presentation-container ace-presentation-ration-10-2 ace-presentation-hide-mobile-info ace-presentation-container-reverse')
				.append(myApp.data('aceContent'))
				.append(myApp.data('aceSideContainer'))
		);
		if( settings.withtransparentbackground ){
			myApp.data('acePresentation').addClass('ace-presentation-transparent-main');
		}
		if( $.aceOverWatch.utilities.isVoid(settings.sidemenu,true) || settings.hidesidemenuinitially ){
			myApp.data('acePresentation').addClass('ace-presentation-hidden-info');
		}

		let middleContainer = $('<div></div>', {
			id: 'ace-middle-container'
			})
			.addClass('ace-general-wrapper')
			.append(myApp.data('aceTopBar'))
			.append(myApp.data('acePresentation'));

		myApp.data('aceMiddleContainer', middleContainer);



		myApp.append(myApp.data('aceMiddleContainer'));


		$(this).append(myApp);
		myApp.direction = (	$('html').css('direction') == 'ltr' || $('html').attr('dir') == "ltr" ) ? 'ltr' : 'rtl';

		/*
		 * keeping a reference to the app object
		 */
		window.aceApp = myApp;//keep a reference to the app object

		/*
		 * handling click on the main app button
		 * - the side menu is being displayed, or hidden
		 * - how this is done, depends if we are on mobile, or not
		 * - trigger event: acesidemenutoggle
		 */
		$('.'+$.aceAppOverWatch.classes.sideMenuGlobalTrigger).click(function() {
			aceAppSideMenuToggle();
		});

		/*
		 * user defined callback to be triggered AFTER the application has been loaded...
		 */
		if( $.isFunction(window['aceAfterAppInit']) ){
			window['aceAfterAppInit']();
		}

		if( $.isFunction(window['aceGeneraErrorHandler']) ){
			$.aceOverWatch.settings.hasGeneralErrorCodeHandler = true;
		}

	};

	// window.addEventListener('popstate', function(event) {
	// 	/*
	// 	 * page change
	// 	 */
	// 	console.log('window navigation detected!');
	// 	console.log('---> '+window.location.pathname);
	// 	console.log('---> '+window.location.hash);
	// 	console.log('---> '+document.referrer);
	// 	console.log(event);
	//
	// 	// if( window.location.hash != '' ) {
	// 	// 	history.pushState(null, null, window.location.pathname);//remaining on current page
	// 	// }
	//
	// }, true);

	//needed for smart height calculation on mobile devices
	addEventListener('resize', setDocHeight);
	addEventListener('orientationchange', setDocHeight);


}( jQuery ));
