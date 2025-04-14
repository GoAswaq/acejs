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
	internalNavigation(tag, data, callback);
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
		workingTag = workingTag[0];
		tag.shift();
	}else{
		tag = null;
	}

	/*
	 * each menu entry MAY have a function defined, called  onBeforeDisplayContentForTagXXX, where XXX is the name of the tag identifying the content in the main menu
	 * if this methos exists, and it returns something different than true, the panel will not be opened
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

}

(function ( $ ) {

	$.aceAppOverWatch = {
		
		/*
		 * these are global settings used throughout the application
		 */
		settings : {	
			totalmargin : 220,
			totalmargin_sec : 56,
			no_margin : 0,
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
		 * this function is needed to adjust the paddings of the ace-content, depending if the menu is expanded or not
		 * it needs to be ran whenever the dimensions of the side menu are detected
		 * 
		 */
		checkSize : function (){
			
			let el = window.aceApp.data('aceContent');
			
			if( el.length == 0 ){
				/*
				 * nothing to do, because there is no such field in the document
				 */
				return;
			}
			
			/*
			 * determining the attribute which needs to be corrected based on document alignament
			 */
			let css_atribute_name = window.aceApp.direction == 'ltr' ? 'padding-left' : 'padding-right';    

			/*
			 * in this object there will be placed the new css values
			 */
			let newCSS = {};
			
			/*
			 * add an extra check for with the isfunction.. because sometimes it gets called when it's not
			 */
			let side = window.aceApp.data('aceSideContainer');
		    if( 
		    		el.css("clear") == 'both'
    			&& side
    			&& !side.hasClass('ace-hide')
			){
	    		if(window.aceApp.data('aceSideMenu').hasClass('ace-expand')) {

					newCSS[css_atribute_name] = side.width();
				}
				else {
					newCSS[css_atribute_name] = $.aceAppOverWatch.settings.totalmargin_sec;
				}
		    }
			else {
				newCSS[css_atribute_name] = $.aceAppOverWatch.settings.no_margin;
			}
		    
		    el.css(newCSS);
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
			bottombar				: '', //hide the bottombar if void, otherwise use this as a selector and move the content in the bottombar 
			sidemenu				: '', //hide the sidemenu if void, otherwise use this as a selector and move the content in the sidebar
			
			contentselector 		: '', //how to identify each content section to be displayed in the main screen
			
			
			groupsidebarwithcontent	: false,//set to true, to group the side bar and the content together in their own container
			
        }, settings ));
		
		var myApp =  $('<div></div>', {
	        id: 'ace-app'
	    });
		myApp.data($.aceOverWatch.settings.aceSettings,settings);
		
		if( settings.topbar && settings.topbar !== '' ){
			myApp.data('aceTopBar',$('<div></div>', {
					id: 'ace-top-bar'
				})
				.addClass($.aceAppOverWatch.classes.mainNav)
				.append( $(settings.topbar).removeClass('ace-hide').detach() )
			);
		}

		if( settings.sidemenu && settings.sidemenu !== '' ){
			myApp.data('aceSideContainer',  $(settings.sidemenu).addClass($.aceAppOverWatch.classes.sideContainer).removeClass('ace-hide').detach());
			myApp.data('aceSideMenu',myApp.data('aceSideContainer').find('.'+$.aceAppOverWatch.classes.sideMenu));
		}
		else myApp.data('aceSideContainer', '');

		myApp.data('aceContent', $('<div></div>', {
				id: 'ace-content'
			})
			.addClass('ace-content')
		);
		
		if (settings.contentselector!=='') {
			myApp.data('aceContent').ace('create', {type:'cardview',contentselector:settings.contentselector});
		}
		
		if (settings.groupsidebarwithcontent===true) {
			myApp.data('aceMiddleContainer', $('<div></div>', {
					id: 'ace-middle-container'
				})
				.addClass('ace-general-wrapper')
				.append(myApp.data('aceTopBar'))
				.append(myApp.data('aceInfoTopBar'))
				.append(
						$('<div></div>', {
							id: 'ace-grouped-topside-container'
						})		
						.addClass('ace-wrapper')
						.append(myApp.data('aceSideContainer'))
						.append(myApp.data('aceContent'))
				)
			);
		}
		else {
			myApp.data('aceMiddleContainer', $('<div></div>', {
				id: 'ace-middle-container'
			})
			.addClass('ace-general-wrapper')
			.append(myApp.data('aceTopBar'))
			.append(myApp.data('aceInfoTopBar'))
			.append(myApp.data('aceSideContainer'))
			.append(myApp.data('aceContent'))
		);
		}
		myApp.append(myApp.data('aceMiddleContainer'));
		
		if  (settings.bottombar!=='') {
			myApp.append($('<div></div>', {
					id: 'ace-bottom-bar'
				})
				.addClass('ace-footer')
				.append( $(settings.bottombar).removeClass('ace-hide').detach() )
			);
		}
		    
		$(this).append(myApp);
		myApp.direction = (	$('html').css('direction') == 'ltr' || $('html').attr('dir') == "ltr" ) ? 'ltr' : 'rtl';
		
		/*
		 * keeping a reference to the app object
		 */
		window.aceApp = myApp;//keep a reference to the app object
		
		$.aceAppOverWatch.checkSize();
		$(window).on('resize', $.aceAppOverWatch.checkSize);
		
		if (myApp.data('aceSideContainer')!=='') {
			$('.'+$.aceAppOverWatch.classes.sideMenuGlobalTrigger).click(function() {
				myApp.data('aceSideContainer').toggleClass('ace-hide');
                $.aceAppOverWatch.checkSize($('.ace-content'));
			});
		}

		/*
		 * user defined callback to be triggered AFTER the application has been loaded...
		 */
		if( $.isFunction(window['aceAfterAppInit']) ){
			window['aceAfterAppInit']();
		}

    };
    
    
}( jQuery ));
