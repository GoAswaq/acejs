/**
 * some details - test silviu
 * **
 * .ace is the plugin, the public interface
 * .aceOverWatch - is the object which contains all/most of the functionality
 ****/


/**
 * parameters for creating a field:
 * **
 * type - the type of control
 * 			text
 * 			combobox
 *
 * tooltip - a text for tooltip
 * listeners - an object, which may have one of these user defined methods: change and click
 * 			change and click
 *
 * Grid Specific
 * columns - an array of items describing the row columns
 * 			title - name of the column
 * 			fieldname - the name of the data field from the data collection from which the data is retrieved for this column
 * 			width - the width of the column
 * 			type - the type of column
 * 						normal
 * 						action - can have one or more butons/links/whatevers
 * 		    renderer - for normal columns, it is a function which will format the value display in some way or another
 * 						parameters: value, record
 * 			align - left, right, center
 * data - array of data to be placed on rows
 *
 * pagination - true - displaying pagination controls
 * page - current page (starts with 1)
 *
 * listeners:{
 * 		- oncellclick..
 * }
 *
 * showeditcolumn	- begin, end, default(begin)
 * editform - the id of a div which contains the edit fields
 ****/
(function ( $ ) {
    $.aceOverWatch = {

        //these are global settings used throughout the application
        settings : {
            fieldPrefix:'ace',		//add as a prefix in front of all created fields
            aceSettings:'as',			//the name of the data object which holds the settings for each fields
            overviewids:0,			//add special property to all fields, to identify them somehow; TODO - when cloning them, make it so this id is increased
            url:null,				//this is the custom URL of the place to which ace directs all network calls
            debugEnabled:false,		//if true, debug type logs will be displayed
            showAllLogsAsToasts:false,//if true, all LOGS will be shown as a toast

            useflex:false,/*some html syntax has been changed to use flex functionality; to keep backwards compatibility to some themes, this should only be set to true IF we use a new, flex theme*/
        },//end settings

        /**
         * begin classes object
         * a collection of classes used for all the ace fields; bunched up all together here for quick access and review
         **/
        classes:{
            hide:'ace-hide',
            aceautogen : 'ace-auto-gen',
            acetplautogen : 'ace-tpl-auto-gen', //used to auto create elements after the HTML was rendered from a template
            containerField:'ace-field-container',
            fieldValue:'ace-efld',		//effective field; marks the actual HTML element that contains the field VALUE
            empty:'ace-empty',		//class used to signal that a valued field has an empty value
            clickable:'ace-clickable',
            displayField:'ace-display-field',
            textField:'ace-text-field',
            comboField:'ace-combo-field',
            buttonField:'ace-button-field',
            datepickerField:'ace-datepicker-field',
            autocompleteField:'ace-autocomplete-field',
            autocompleteCellIgnore:'ace-ignore-cell',
            label:'ace-label',
            badge:'ace-badge',
            radio:'ace-radio-field',
            check:'ace-checkbox-field',
            aswitch:'ace-switch-field',
            fieldcell: 'ace-field-cell',

            chipsField:'ace-chips-field',
            chip:'ace-chip',
            chipRemove:'ace-chip-remove',

            autocompleteTemplate:'ace-autocomplete-details-field',
            autocompleteInnerTemplate:'ace-autocomplete-details-inner-field',
            autocompleteClearButton:'ace-autocomplete-clear-button',
            autocompleteLink:'ace-autocomplete-extra-link',

            breadcrumbsField:'ace-breadcrumbs-field',
            breadcrumbsSeparator:'ace-breadcrumbs-separator',
            breadcrumbsLink:'ace-breadcrumbs-link',
            breadcrumbsActive:'ace-breadcrumbs-active',

            textareaField:'ace-text-editor',
            
            progressbarField:'ace-progress-bar',
            progressbarInner:'ace-progress-inner-bar',
            
            wizardField:'ace-wizard-field',
            wizardTopBar:'ace-wizard-top-bar',
            wizardBottomBar:'ace-wizard-bottom-bar',
            wizardContainer:'ace-wizard-container',
            wizardProgressBar:'ace-wizard-progress-bar',
            wizardNext : 'ace-wizard-next-button',
            wizardPrev : 'ace-wizard-prev-button',
            wizardFinal: 'ace-wizard-final-button',
            wizardStep : 'ace-wizard-step',

            cardView : 'ace-card-view',
            cardViewItem : 'ace-card-view-item',
            tabView : 'ace-tab-view',
            tabViewItem : 'ace-tab-view-item',
            tabViewItem : 'ace-tab-view-item',

            grid:'ace-grid',
            gridCell:'ace-grid-cell',
            gridCellAction:'ace-grid-action-cell',
            gridCellCheckBoxCol:'ace-grid-checkboxcol-cell',
            gridCellSelected:'ace-grid-cell-selected',
            gridCellNavigated:'ace-grid-cell-selected',	//TODO - create a different class for this! :)
            gridCellDirty:'ace-grid-cell-dirty',
            gridCellSort :'ace-column-sort',
            gridHeader:'ace-grid-header',
            gridFooterTotals:'ace-grid-footer-totals',
            gridFooterWithTotals:'ace-grid-footer-with-totals',
            gridFooter:'ace-grid-footer',
            gridBody:'ace-grid-body',
            gridRow:'ace-grid-row',
            gridSubgroupRow:'ace-grid-subgroup-row',
            gridInfiniteScroll:'ace-grid-infinite-scroll',
            gridPagination:'ace-grid-pagination',
            gridPaginationTP:'ace-grid-pagination-tp',//tp - total pages
            gridTopToolbar:'ace-grid-top-toolbar',
            gridActionButton:'ace-grid-action-button',
            gridActionCheckBoxCol:'ace-grid-action-checkboxcol',
            gridActionCheckAllBoxCol : 'ace-grid-action-check-all-boxcol',
            gridAutoComplete:'ace-grid-auto-complete',//marks a grid by being used by an autocomplete field to find stuff
            gridScrollView:'ace-grid-scrollview',
            gridSearch:'ace-grid-search',
            gridRowLines:'ace-grid-row-lines',
            gridRowSelected:'ace-grid-row-selected',
            gridColumnLines:'ace-grid-column-lines',
            gridEditInlineControls:'ace-grid-inline-ctrls',
            gridInlineRow:'ace-grid-inline-row',
            gridCellTemplate:'ace-grid-cell-template',
            gridPanelSaveButton:'ace-grid-panel-save-button',
            gridPanelCancelButton:'ace-grid-panel-cancel-button',
            gridPanelDeleteButton:'ace-grid-panel-delete-button',
            gridPanelEditButton:'ace-grid-panel-edit-button',
            
            gridNHeader:'ace-nested-grid-header',
            gridNHeaderCol:'ace-grid-groupped-header-col',
            gridNHeaderColLast:'ace-grid-grouped-header-col-last',
            gridNHeaderTitle:'ace-grid-groupped-header-title',
            gridNHeaderTitle50:'ace-grid-groupped-header-title-50',

            gridButtonsControls : 'ace-grid-controls',
            formButtonsControls : 'ace-form-controls',

            menubutton:'ace-dropdown',
            menubuttonActive:'ace-button-active',
            menubuttonTrigger:'ace-dropdown-trigger-click',
            menuDropDown:'ace-dropdown-list',
            menuDropDownLink:'ace-advanced-search-trigger',
            menubuttonGroupLabel : 'ace-group-label',
            icon : 'ace-icon',
            iconAfter: 'ace-icon-after',
            iconButton: 'ace-iconbutton',
            iconButtonSingleLine: 'ace-iconbutton-singleline',
            iconButtonTrigger:'ace-dropdown-trigger-click',
            imageUploadButton:'ace-image-upload-button',
            fileUploadButton:'ace-file-upload-button',
            fileRemoveButton:'ace-file-remove',

            fileUpload:'ace-file-upload',
            fileUploadPlaceholder:'ace-file-upload-placeholder',
            fileUploadIconType:'ace-file-type-icon',
            fileUploadButtonsContainer : 'ace-upload-buttons-container',
            filterFormContainer : 'ace-filter-form-container',
            imageUpload:'ace-image-upload',
            aceRounded:'ace-rounded',
            cardButton:'ace-card-button-deprecated',
            photoRemove:'ace-photo-remove',
            docRemove:'ace-doc-remove',

            radioSimple:'ace-radio',
            separator : 'ace-separator',

            template:'ace-template-container',
            formIgnore:'ace-form-fields-ignore',
            section:'ace-section-container',

            formPopup:'ace-form-popup',
            formShow:'ace-form-show',
            formInner:'ace-form-inner',
            formFooter:'ace-form-footer',
            formContainer:'ace-form-container',

            textAlignLeft:'ace-ta-lft',
            textAlignRight:'ace-ta-rght',
            textAlignCenter:'ace-ta-center',

            clear:'ace-clear',

            mask:'ace-mask-el',		//used by the mask and prompt popup
            prompt:'ace-prompt-el', //used by the prompt popup
            promptInner:'ace-prompt-inner-el', //used by the prompt inner popup
            promptInnerButtons:'ace-prompt-inner-buttons', //used by the prompt inner popup
            maskDiv:'ace-mask-div',

            buttonBar:'ace-button-bar',

            error:'ace-error',
            hideErrors: 'ace-hide-errors',
            required:'ace-error-req',
            errorMsg:'ace-error-msg',

            toast:'ace-toast',
            toastError:'ace-toast-error',
            toastErrorIcon:'fa fa-times',
            toastSuccess:'ace-toast-success',
            toastSuccessIcon:'fa fa-check',
            toastWarning:'ace-toast-warning',
            toastWarningIcon:'fa fa-exclamation',
            toastHelp:'ace-toast-help',
            toastHelpIcon:'fa fa-question-circle',
            toastHide:'ace-toast-hide',
            toastIcon:'ace-toast-icon',
            toastText:'ace-toast-text',

            triggerBtnContainer: 'ace-trigger-btn-container',
            dataSearch : 'ace-data-search',
            dataSearchPanel : 'ace-search-panel',
            dataAdvSearchPanel : 'ace-adv-search-panel',
            quickSearchField : 'ace-quick-search-fld',
            advSearchField : 'ace-adv-search-fld',

            col12: 'ace-col-12',
            col11: 'ace-col-11',
            col10: 'ace-col-10',
            col9: 'ace-col-9',
            col8: 'ace-col-8',
            col7: 'ace-col-7',
            col6: 'ace-col-6',
            col5: 'ace-col-5',
            col4: 'ace-col-4',
            col3: 'ace-col-3',
            col2: 'ace-col-2',
            col1: 'ace-col-1',

            collDelete: 'ace-col-delete',
            collEdit: 'ace-col-edit',

            scrollView: 'ace-scrollview',

            fontAwesomePrefix :'fa',
            addIcon: 'ace-add-icon',
            arrowIcon: 'ace-arrow-icon',
            editIcon: 'ace-edit-icon',
            refreshIcon: 'ace-refresh-icon',
            defaultDownArrow: 'fa fa-angle-down',
            defaultAddIcon: 'fa fa-plus',
            defaultEditIcon: 'fa fa-pencil',
            defaultUpArrow: 'fa fa-angle-up',
            defaultRefreshIcon: 'fa fa-sync',
            defaultCircle: 'fa fa-circle',
            loadingIcon : 'fa fa-spinner fa-spin fa-fw',
            moreMenuIcon : 'fa fa-ellipsis-v',
            editIcon2 : 'fa fa-pencil-square-o',
            trashIcon : 'fa fa-trash',
            calendarIcon : 'fa fa-calendar',
            uploadIcon : 'fa fa-upload',
            nextIcon : 'fa fa-angle-right',
            prevIcon : 'fa fa-angle-left',
            right:'ace-right',
            left:'ace-left',
            show:'ace-show',
            helpIcon:'far fa-question-circle',
            helpLabel:'ace-label-help-icon',

            accordionItem : 'ace-accordion',
            accordionItemIcon : 'ace-accordion-icon',
            accordionItemExpanded : 'ace-accordion-item-expanded',
            accordionItemRemoteLoad : 'ace-accordion-item-remote-load',
            accordionItemRemoteLoaded : 'ace-accordion-item-remote-loaded',
            accordionItemRemoteLoading : 'ace-accordion-item-remote-loading',
            accordionList : 'ace-accordion-list',
            accordionActive : 'ace-active',
            
            accordionCheck : 'ace-accordion-checkbox',
            checked : 'ace-checked',
            iconChecked : 'fa-check-circle',
            iconPlus : 'fa-plus-circle',
            
            appContent : 'ace-content',
            appMobileWindow : 'ace-mobile-window',
            
            parseTpl : 'ace-pt',
        },//end classes object

        defaults: {
            labelsuffix: ':',
        },
        /**
         *
         * outsideclick - click outside of an element
         */
        eventManager : {

            isDocumentClickHandlerRunning : false,

            eventsCollections : {

            },

            unregisterEvent : function(eventname, testField){
                var settings = testField.data($.aceOverWatch.settings.aceSettings);
                if( !settings ){
                    return;
                }

                if( !$.aceOverWatch.eventManager.eventsCollections[eventname] ){
                    return;
                }

                delete $.aceOverWatch.eventManager.eventsCollections[eventname][settings.id];
            },

            registerEvent : function(eventname, testField, targetField, method){

                if( !$.aceOverWatch.eventManager.eventsCollections.hasOwnProperty(eventname) ){
                    $.aceOverWatch.eventManager.eventsCollections[eventname] = [];
                }


                var settings = testField.data($.aceOverWatch.settings.aceSettings);
                if( !settings ){

                }

                $.aceOverWatch.eventManager.eventsCollections[eventname][settings.id] = {
                    testField : testField,
                    targetField : targetField,
                    method : method
                };


                if( $.aceOverWatch.eventManager.isDocumentClickHandlerRunning ){
                    return true;
                }

                $.aceOverWatch.eventManager.isDocumentClickHandlerRunning = true;

                $(document).on('click', function(event) {

                    if( !jQuery.contains(document, event.target) ){
                        return;
                    }

                    /*
					 * ok.. lets deal with various events..
					 * first.. outsideclick
					 */
                    for(var idx in $.aceOverWatch.eventManager.eventsCollections['outsideclick'] ){

                        /*
						 * test if the click was generated from OUTSIDE of the registered element..
						 */
                        if( $.aceOverWatch.eventManager.eventsCollections['outsideclick'][idx]['testField'].has(event.target).length == 0 ){
                            $.aceOverWatch.eventManager.eventsCollections['outsideclick'][idx].method($.aceOverWatch.eventManager.eventsCollections['outsideclick'][idx]['targetField']);
                        }

                    }

                });
            },


        },


        /**
         * begin cache object
         * this is the cache! some network fields can cache their results; if so, the first successful call is cached, and all other calls will get their results from cache
         */
        cacheManager : {
            cache :[],
            /**
             * key based array for the cache
             * key = > {
             *		data = > object			//the object cached
             *		state => 0,1,2..		// 0 - loading, 1 available, 2 add as needed
             *		listeners => [			//array of functions to run on update callback(data)
             *			listener1,
             *			listener2,
             *			listener3,
             *		]
             * }
             */

            /**
             * the function updates an EXISTING KEY and calls the listeners
             * if deleteListeners is true, the listeners will be deleted
             *
             * if the KEY doesn't exist, it will be created
             * if the object is void (null or undefined), then the state goes to 0 ( loading), and nothing will be done to/with the listeners
             */
            update:function(key, object, deleteListeners){

                var cache = $.aceOverWatch.cacheManager.cache[key];

                if( $.aceOverWatch.utilities.isVoid(cache) ){

                    cache = {
                        data : object,
                        listeners : []
                    };

                    $.aceOverWatch.cacheManager.cache[key] = cache;

                }

                cache.data = object;
                cache.state = $.aceOverWatch.utilities.isVoid(object) ? 0 : 1;

                if( cache.state == 1 ){//we have valid data

                    var listeners = cache.listeners;
                    if( deleteListeners ){
                        cache.listeners = [];
                    }

                    //call all listeners
                    for(var idx in listeners){
                        if( jQuery.isFunction(listeners[idx]) ){
                            listeners[idx](cache.data);
                        }
                    }
                }
            },

            //if the the key is undefined, the function will return undefined
            //if the key exists, we return an object with two fields:
            //		state	- the state of the data
            //		data	- the cached data; it will be void if the state is 0
            //if the state is 0, and listener is a function, the listener will be added to the listeners stack
            get:function(key,listener){
                var cache = $.aceOverWatch.cacheManager.cache[key];
                if( $.aceOverWatch.utilities.isVoid(cache) ){
                    return undefined;
                }

                var res = {
                    state : cache.state,
                    data : cache.data
                };

                if( res.state == 0 && jQuery.isFunction(listener) ){
                    cache.listeners.push(listener);
                }

                return res;
            }

        },

        /**
         * begin screenmask object
         * screenMask - used to create screen wide masks while doing some background data
         */
        screenMask : {
            mask:null,
            maskMsg:null,
            maskInner:null,
            show:function(msg, withLoader = false){
                this.create();
                
                /*
                 * if we display a loader, the msg will be added to the loader itself
                 * in which case, the mask message will be an empty string ( necessary, otherwise the div will not be displayed
                 */
                let displayMsg = withLoader ? '&nbsp' : msg;
                if( displayMsg ){
                	this.maskMsg.html(displayMsg);
                	this.maskInner.removeClass($.aceOverWatch.classes.hide);
                }else{
                	this.maskInner.addClass($.aceOverWatch.classes.hide);
                }
                if( !withLoader ){
                	this.loaderEl.addClass($.aceOverWatch.classes.hide);
                }else{
                	
                	if( msg ){
                		this.loaderTextEl.attr('data-loadtext',msg);
                	}else{
                		this.loaderTextEl.attr('data-loadtext','');
                	}
                	
                    this.loaderEl.removeClass($.aceOverWatch.classes.hide);
                }

                this.mask.fadeIn();
            },
            hide:function(){
                if( !this.mask ){
                	return;
                }
                this.mask.fadeOut();
            },
            create : function(){
            	if( this.mask ){
            		return;
            	}
            	$('<div class="ace-screen-mask '+ ' '+$.aceOverWatch.classes.mask +'" id="ace_mask_el"><div id="ace_mask_el_div"><h2 id="ace_mask_el_msg"></h2>'+
                        $.aceOverWatch.utilities.getLoaderCode()+
                        +'</div></div>').appendTo('body');
                this.mask = $('#ace_mask_el');
                this.maskInner = $('#ace_mask_el_div');
                this.maskMsg = $('#ace_mask_el_msg');
                this.loaderEl = this.mask.find('.ace-loader');
                this.loaderTextEl = this.loaderEl.find('.ace-loader-text');
            }
        },//end screen mask

        /**
         * begin prompt object
         * prompt - used to display simple popups for displaying messages or asking for something
         */
        prompt : {
            wnd:null,
            msg:null,
            cancelBtn:null,
            okBtn:null,
            input:null,

            // cfg - configuration object; used to set things up in the prompt window, and also to pass arguments to the callbackOk function
            // default properties:
            //		- type - can be: question, alert, prompt (default)
            //		- value - a value to be set on the input field
            // if a callbackOk is specified, the function will be called when pressing the ok button, with two parameters:
            //  1 - the value of the input field
            //  2 - the configuration file
            // okText -> custom ok Text
            // cancelText -> custom Cancel Text
            show:function(msg,callbackOk,cfg){

            	if( !cfg ){
            		cfg = {
        				type : 'prompt'
            		}
            	}

                let okText = $.aceOverWatch.utilities.isVoid(cfg.okText, true) ? _aceL.ok : cfg.okText;
                let cancelText = $.aceOverWatch.utilities.isVoid(cfg.cancelText, true) ? _aceL.cancel : cfg.cancelText;

                if( !this.wnd ){
                    //without the tabindex attribute, the div cannot receive focus
                    $('<div tabindex="0" class="'+ $.aceOverWatch.classes.hide + ' '+$.aceOverWatch.classes.mask + ' ' + $.aceOverWatch.classes.prompt+'" id="mask_el_prompt">\
							<div class="'+$.aceOverWatch.classes.promptInner+'">\
								<p id="mask_el_prompt_msg"></p>\
								<input id="mask_el_prompt_in"  type="text">\
								'+($.aceOverWatch.settings.useflex?'<div class="'+$.aceOverWatch.classes.buttonBar+'">':'')+'\
									<button id="mask_el_prompt_cancel">'+ cancelText +'</button>\
									<button id="mask_el_prompt_ok">'+okText+'</button>\
							   '+($.aceOverWatch.settings.useflex?'</div>':'')+'\
							</div>\
						</div>').appendTo('body');

                    this.wnd = $('#mask_el_prompt');
                    this.msg = $('#mask_el_prompt_msg');
                    this.input = $('#mask_el_prompt_in');

                    this.okBtn = $('#mask_el_prompt_ok');
                    this.cancelBtn = $('#mask_el_prompt_cancel');

                    this.okBtn.on('click',function(){$.aceOverWatch.prompt.onOk();});
                    this.cancelBtn.on('click',function(){$.aceOverWatch.prompt.onCancel();});

                    this.wnd.keyup(function (e) {
                        switch(e.keyCode){
                            case 27://escape
                            	$.aceOverWatch.prompt.onCancel();
                                break;
                        }
                    });
                }else{
                	
                	this.okBtn.html(okText);
                	this.cancelBtn.html(cancelText);
                	
                }

                this.wnd.data("callbackOk",callbackOk);
                this.wnd.data("cfg",cfg);

                this.msg.html(msg);
                this.cancelBtn.show();
                this.okBtn.show();
                this.input.show();
                this.wnd.removeClass($.aceOverWatch.classes.error);

                var focusEl = null;

                var value = '';
                if( cfg ){
                    if( !$.aceOverWatch.utilities.isVoid(cfg.value,true) ){
                        value = cfg.value;
                    }
                    switch(cfg.type){
                        case 'question':	//displays message, button ok and cancel
                        	this.input.hide();
                            focusEl = this.cancelBtn;
                            break;
                        case 'prompt':		// asks for a message
                            focusEl = this.input;

                            focusEl.attr('placeholder',(cfg.placeholder?cfg.placeholder:'...'));
                            this.input.unbind('keyup').keyup(function (e) {

                                switch(e.keyCode){
                                    case 13://enter
                                        $.aceOverWatch.prompt.onOk();
                                        break;
                                }
                            });

                            break;
                            
                        case 'mask': //should be removed...
                        	this.input.hide();
                        	this.cancelBtn.hide();
                        	this.okBtn.hide();
                            break;

                        case 'alert':		//button ok
                        default:
                        	this.cancelBtn.hide();
                        	this.input.hide();
                            focusEl = this.okBtn;
                            this.wnd.addClass($.aceOverWatch.classes.error);
                            break;
                    }
                    if (!$.aceOverWatch.utilities.isVoid(cfg.okBtnText)) {
                    	this.okBtn.html(cfg.okBtnText);
                    }
                    if (!$.aceOverWatch.utilities.isVoid(cfg.cancelBtnText)) {
                    	this.cancelBtn.html(cfg.cancelBtnText);
                    }
                }
                this.input.val(value);
                this.wnd.removeClass($.aceOverWatch.classes.hide);
                this.wnd.show();

                if(focusEl){
                    focusEl.focus();
                }
            },

            onCancel:function(ignoreCancelCallback){
                this.wnd.fadeOut();

                if( !ignoreCancelCallback ){
                	let cfg = this.wnd.data('cfg');
                    
                	if( cfg ){
                		$.aceOverWatch.utilities.runIt(cfg.callbackCancel,cfg);
                	}
                }
            },

            onOk:function(){
                var callback = this.wnd.data('callbackOk');

                if( jQuery.isFunction(callback) ){
                    this.wnd.hide('fast',function(){
                        callback($.aceOverWatch.prompt.input.val(),$.aceOverWatch.prompt.wnd.data("cfg"));
                    });
                }else{
                    $.aceOverWatch.prompt.onCancel(true);
                }
            }
        },//end prompt object

        /**
         * begin toast object
         * toast - used to display simple notifications which do not interfere with the user's activity
         */
        toast : {
            wnd:null,
            iconDiv:null,
            msgP:null,
            mainToastId:'ace-main-toast',
            lastIconClass:'',
            lastToastClass:'',
            timeout:2000,
            timeoutHelp:10000,
            timeoutID:null,
            history:[],//a history of messages!

			/**
			 * @param string type error, success, warning, help
			 * @param string type the message to display 
			 */
            show : function(type, message){
            	this.create();

                this.wnd.removeClass(this.lastToastClass);
                this.iconDiv.removeClass(this.lastIconClass);

                switch(type){
                    case 'error':
                    	this.lastToastClass = $.aceOverWatch.classes.toastError;
                    	this.lastIconClass = $.aceOverWatch.classes.toastErrorIcon;
                        break;
                    case 'success':
                        this.lastToastClass = $.aceOverWatch.classes.toastSuccess;
                        this.lastIconClass = $.aceOverWatch.classes.toastSuccessIcon;
                        break;
                    case 'warning':
                        this.lastToastClass = $.aceOverWatch.classes.toastWarning;
                        this.lastIconClass = $.aceOverWatch.classes.toastWarningIcon;
                        break;
                    case 'help':
                        this.lastToastClass = $.aceOverWatch.classes.toastHelp;
                        this.lastIconClass = $.aceOverWatch.classes.toastHelpIcon;
                        break;
                    default:
                        return;
                }

                this.history.splice(0,0,{
                    type:type,
                    message:message,
                    time:new Date().toISOString(),
                });
                
                if( this.history.length > 20 ){
                	this.history.splice(20,this.history.length-20);
                }                

                this.wnd.addClass(this.lastToastClass);
                this.iconDiv.addClass(this.lastIconClass);
                this.msgP.html(message);

                this.wnd.removeClass($.aceOverWatch.classes.toastHide);

                clearTimeout(this.timeoutID);
                this.timeoutID = setTimeout(function(){$.aceOverWatch.toast.hide();}, type !== 'help' ? this.timeout : this.timeoutHelp);
            },

            hide : function(){
            	if( !this.wnd ){
            		return;
            	}
                this.wnd.addClass($.aceOverWatch.classes.toastHide);
            },
            
            create : function(){
            	if( this.wnd ){
            		return;
            	}

                $('<div id= "'+this.mainToastId+'" class="'+$.aceOverWatch.classes.toast+' '+$.aceOverWatch.classes.toastHide+'">\
						<div class="'+$.aceOverWatch.classes.toastIcon+'">\
							<span></span>\
				        </div>\
						<div class="'+$.aceOverWatch.classes.toastText+'">\
				            <p></p>\
				        </div>\
					</div>').appendTo('body');

                this.wnd = $('#'+this.mainToastId);
                this.iconDiv = this.wnd.find('.'+$.aceOverWatch.classes.toastIcon+' span');
                this.msgP = this.wnd.find('.'+$.aceOverWatch.classes.toastText+' p');

                this.wnd.click(function() {
                	$.aceOverWatch.toast.wnd.addClass($.aceOverWatch.classes.toastHide);
                });
            }
        },//end toast object

        /**
         * begin record object
         * records should be all used by all the controls which process data
         */
        record : {
            isRecord: function(obj){
                return (obj && $.isFunction(obj.val) && typeof obj.data == 'object')
            },
            create : function(data,identityName){
                var record = {
                    identity : '',//this is the name of the record's identity
                    data : {	//this is an object which holds all the properties of the record

                    },
                    val:function(fieldName,value,clean){
                        switch(arguments.length){
                            case 1://only field name, return current value
                                if( this.data[fieldName] == null ){
                                    return null;
                                }
                                return this.data[fieldName].value;
                                break;
                            case 2://setting the field value
                            case 3://for extra info
                                if( this.data[fieldName] ){
                                    this.data[fieldName].value = value;
                                    if( clean === true ){
                                        this.data[fieldName].original = value;
                                        this.data[fieldName].isDirty = false;
                                    }else{

                                        //if we have set the clean flag to FALSE, then set this value to be dirty, because that's what we want!
                                        if( !$.aceOverWatch.utilities.isVoid(clean) &&  clean === false ){
                                            this.data[fieldName].isDirty = true;
                                        }else{
                                            if (($.aceOverWatch.utilities.isVoid(value, true)) && ($.aceOverWatch.utilities.isVoid(this.data[fieldName].original, true))) this.data[fieldName].isDirty = false;
                                            else this.data[fieldName].isDirty = (value != this.data[fieldName].original);
                                        }
                                    }
                                }else{
                                    this.data[fieldName] = {
                                        value:value,
                                        original:value,
                                        isDirty:false
                                    };

                                    if( !$.aceOverWatch.utilities.isVoid(clean) && clean===false ){
                                        this.data[fieldName].isDirty = true;
                                    }
                                }
                                return true;
                                break;
                            default:
                                return true;
                        }
                    },
                    //state - true to set the field as dirty; false to set it as not dirty
                    setDirty:function(fieldName,state){
                        if( this.data[fieldName] ){
                            this.data[fieldName].isDirty = (state == true);
                        }
                    },
                    getOriginal:function(fieldName){
                    	return this.data[fieldName].original;
                	},
                    makeItAllDirty:function(){
                        for(property in this.data){
                            this.data[property].isDirty = true;
                        }
                    },
                    makeItAllNotDirty:function(){
                        for(property in this.data){
                            this.data[property].isDirty = false;
                        }
                    },
                    makeItAllClean:function(reverse){
                        for(property in this.data){
                            this.data[property].isDirty = false;

                            if( reverse === true ){
                                this.data[property].original = this.data[property].value;
                            }else{
                                this.data[property].value = this.data[property].original;
                            }
                        }
                    },
                    isDirty:function(fieldName){
                        if( this.data[fieldName] ){
                            return this.data[fieldName].isDirty;
                        }
                        return false;
                    },
                    clean:function(fieldName){
                        if( this.data[fieldName] ){
                            this.data[fieldName].value = this.data[fieldName].original;
                            this.data[fieldName].isDirty = false;
                        }
                        return this.data[fieldName].value;
                    },
                    cleanAll:function(){
                        for( var fieldname in this.data ){
                            this.clean(fieldname);
                        }
                    },
                    reset:function(){
                        //empties the data
                        this.data = {};
                    },
                    //if data object is specified, it will convert the object into internal data structure
                    //if no data object is specified, it will convert the internal field structure to a simple object
                    convert:function(data, extraInfo){
                        if( data ){
                            //on conversion from normal object to record, extraInfo holds the name of the identity field
                            this.identity = extraInfo;

                            if( typeof data !== 'object' ){
                                return false;
                            }
                            for(prop in data){
                                this.val(prop,data[prop],true);
                            }

                        }else{
                            //on conversion from record to normal object, extraInfo can be true or false: (isDirty)
                            // on true, only dirty fields and the identity will be added
                            // on false, all fields will be added

                            var simpleObj = {};
                            for(prop in this.data){
                                if( extraInfo && !this.isDirty(prop) ){
                                    continue;
                                }
                                simpleObj[prop] = this.val(prop);
                            }
                            return simpleObj;
                        }
                    },
                    loadFromOtherRecord:function(otherRecord,asDirty){
                        for(property in otherRecord.data){
                            this.val(property, otherRecord.val(property),asDirty===true?false:true);
                        }
                    },

                };

                record.convert(data,identityName);
                return record;
            }
        },//end record object

        /**
         * begin utilities object
         * this is a series of functions which are used globaly by all other components of ace
         */
        utilities : {

        	/**
        	 * true, if the last runIt call actually executed a function
        	 * use wasItRan to interogate the value
        	 */
        	wasLastFunctionRan : false,
        	runIt : function(functionName,...args){
        		this.wasLastFunctionRan = false;
        		if( $.isFunction(functionName)){
        			this.wasLastFunctionRan = true;
        			return functionName(...args);
                }else{
                    if( $.isFunction(window[functionName])){
                    	this.wasLastFunctionRan = true;
                    	return window[functionName](...args);
                    }
                }
        	},
        	wasItRan : function(){
        		return this.wasLastFunctionRan;	
        	},

            getLoaderCode : function($text=''){
                return '<div class="ace-loader ace-loader-overlay" style="min-height:200px">'+
                    '<div class="ace-loader-spinner"></div>'+
                    '<div class="ace-loader-text" data-loadtext="'+$text+'"></div>'+
                    '</div>'
            },

            /**
             * use this function to show/hide buttons
             */
            showGridEditingButtons : function(target, asForm) {
                var showControls = '.'+$.aceOverWatch.classes.gridButtonsControls;
                var hideControls = '.'+$.aceOverWatch.classes.formButtonsControls;
                if ((!$.aceOverWatch.utilities.isVoid(asForm)) && (asForm === true)) {
                    showControls = '.'+$.aceOverWatch.classes.formButtonsControls;
                    hideControls = '.'+$.aceOverWatch.classes.gridButtonsControls;
                }
                $(target).find(showControls).removeClass($.aceOverWatch.classes.hide);
                $(target).find(hideControls).addClass($.aceOverWatch.classes.hide);
            },


            /**
             * use this function to get the currently set URL to which to direct all network calls
             * if no custom URL has been defined, the function will return the contents the global variable app_path
             **/
            getWorkingURL : function(){
                //in the case there is NO custom url specified, then return the url will be returned from the global variable app_path
            	let workingURL = $.aceOverWatch.settings.url
            					 ? $.aceOverWatch.settings.url
				 				 : window.app_path;
            	
            	if( $.aceOverWatch.utilities.isVoid(workingURL,true) ){
            		/*
            		 * we want to ignore the # and everything after them
            		 */
            		let currentUrl = location.href; 
            		let diezLocation = currentUrl.search('#');
            		if( diezLocation != -1 ){
            			currentUrl = currentUrl.substr(0,diezLocation);
            		}
            		return currentUrl;
            	}
            	
            	return workingURL;
            },

            /**
             * the function is used to provide a unique ace id to all created fields
             **/
            getNextoverviewid : function(){
                return ++$.aceOverWatch.settings.overviewids;
            },


            /**
             * used by some fields for custom information display
             * customRenderer can be a function, or the name of a global function, which takes two parameters: a value, and a record
             * the function should return a html content
             * if no function is specified, or the function does not exist, the renderer returns teh value directly
             **/
            renderer : function(value, record, customRenderer, addSpaceAsSufix = true){
                return ($.isFunction(customRenderer) ? customRenderer(value,record) : $.isFunction(window[customRenderer]) ? window[customRenderer](value, record) : value +(addSpaceAsSufix ? '&nbsp;' : ''));
            },

            /**
             * the function returns an object from parsing a string in this format: key_1=value1;key2_="value2";key3=false
             * the function is used to pass arguments to various fields directly from the html code
             **/
            getObjectFromText : function(text, noeval){
                var obj = {};
                if (typeof text !== "string"){
                    return obj;
                }

                var props = text.split(';');
                for(var idx in props){
                    var pair = props[idx].split('=');

                    if( pair.length != 2 ){
                        continue;
                    }
                    if (noeval === true)
                        obj[String(pair[0]).trim()] = pair[1];
                    else
                        obj[String(pair[0]).trim()] = eval(pair[1]);
                }

                return obj;
            },

            /**
             * returns true if parameter is undefined or null
             */
            isVoid : function(val,veryAsStringToo) {
                if ((veryAsStringToo==='undefined')||(veryAsStringToo===null)) veryAsStringToo=false;
                if (($.type(val) === "undefined") || ($.type(val) === "null") || (veryAsStringToo && val==="")) return true;
                return false;
            },
            /**
             * returns true if parameter is undefined or null
             */
            isChecked : function(val,veryAsStringToo) {
                if ((val === "true") || (val === true) || (val === "1") || (val === 1) || (val === "on")) return true;
                return false;
            },

            /**
             * utility to display log messages, both in console, as well as in a toast
             * message - the message to be display; can be anything; only string or numeric messages will be displayed in a toast
             * logType - error, success, warning; default is error
             * showToast - default is false; will be overwritten by the global setting showAllLogsAsToasts, if set to true
             **/
            log : function(message, logType = 'error', showToast = false) {
            	
            	if( $.aceOverWatch.settings.showAllLogsAsToasts === true ){
            		showToast = true;
            	}

                var color = 'green';
                switch(logType){
                    case 'error':
                        color = 'red';
                        break;
                    case 'debug':

                        if( !$.aceOverWatch.settings.debugEnabled){
                            return;
                        }

                        color = 'blue';
                        break;
                }

                var lCss = 'color:'+color;

                switch ($.type(message)) {
                    case "string":
                    case "number":

                        if (showToast) {
                            $.aceOverWatch.toast.show(logType, message);
                        }

                        console.log('%c------ ACE ['+logType+'] -> '+message,lCss);

                        break;
                    default:

                        console.log('%c------ BEGIN ACE ['+logType+'] -------',lCss);
                        console.log(message);
                        console.log('%c------ END ACE ['+logType+'] -------',lCss);

                        break;
                }
            },


            /**
             * trying to retrieve simple array data from a HTML structure like this:
             * <simplearray>
             * 		<item>
             * 			data to be pushed on the array
             * 		</item>
             *		.......................
             *</simplearray>
             ***/
            getAsociatedDataSimpleArr : function(target,storeNameTag, recordNameTag){
                if( !storeNameTag ){
                    storeNameTag = 'simplearray';
                }
                if( !recordNameTag ){
                    recordNameTag = 'item';
                }

                var data = [];
                var store = $(target).children(storeNameTag);

                if( store.length != 1 ){
                    return data;
                }

                store.children(recordNameTag).each(function(){
                    data.push($(this).html())
                });

                return data;
            },

            /**
             * trying to retrieve data from a HTML structure like this:
             * <store>
             * 		<record>
             * 			<field name="field_name_01">value_field_name_01</field>						<!-- example for: simple value field -->
             *
             * 			<field name="field_name_02" type="record">									<!-- example for: record field -->
             * 					<record>
             * 						.......................
             * 					</record>
             * 			</field>
             *
             * 			<field name="field_name_02" type="array">									<!-- example for: array field -->
             * 				<array>
             * 					<record>
             * 						.......................
             * 					</record>
             *
             * 					<record>
             * 						.......................
             * 					</record>
             *
             * 					.......................
             * 				</array>
             * 			</field>
             * 			.......................
             * 		</record>
             *		.......................
             *</store>
             ***/
            getAsociatedDataArr : function(target,storeNameTag, recordNameTag){
                if( !storeNameTag ){
                    storeNameTag = 'store';
                }
                if( !recordNameTag ){
                    recordNameTag = 'record';
                }

                var data = [];
                var store = $(target).children(storeNameTag);

                if( store.length != 1 ){
                    return data;
                }

                store.children(recordNameTag).each(function(){
                    let record = {};
                    let el = $(this); 
                    if( el[0].tagName == 'FIELD' ){
                        $.aceOverWatch.utilities.getAsociatedFieldData($(this),record);
                    }else{
                    	el.children('field').each(function(){
                            $.aceOverWatch.utilities.getAsociatedFieldData($(this),record);
                        });
                    }
                    data.push(record);
                });

                return data;
            },

            /**
             * works together with getAsociatedDataArr to build objects from a HTML data structure
             */
            getAsociatedFieldData : function(field, record){
                var name = field.attr('name');

                switch(field.attr('type')){
                    case 'array':
                        record[name] = $.aceOverWatch.utilities.getAsociatedDataArr(field,'array');
                        break;
                    case 'simplearray':
                        record[name] = $.aceOverWatch.utilities.getAsociatedDataSimpleArr(field,'simplearray');
                        break;
                    case 'record':
                        record[name] = $.aceOverWatch.utilities.getAsociatedDataArr(field,'record','field');
                        //ok - for record fields I expect the record to be an object, not an array as it is as result of the above
                        //so.. we'll build an object atm from all the items of the array using the fields in its items
                        var obj = {};
                        for( var idx in record[name] ){
                            for( var prop in record[name][idx] ){
                                if( record[name][idx].hasOwnProperty(prop) ){
                                    
                                    try {
                                    	obj[prop] = eval(record[name][idx][prop]);
                                    }
                                    catch (e) {
                                    	obj[prop] = record[name][idx][prop];
                                    }
                                    
                                }
                            }
                        }
                        record[name] = obj;
                        break;
                    case 'bool':
                        record[name] = (field.html() === "true");
                        break;
                    case 'textobject':
                        record[name] = $.aceOverWatch.utilities.getObjectFromText(field.html());
                        break;
                    default:
                        record[name] = field.html();
                        break;
                }
            },

            /**
             * calculatest the hash of a string
             */
            hashIt:function(text){
                var hash = 0, i, chr, len;
                if (text.length === 0) return hash;
                for (i = 0, len = text.length; i < len; i++) {
                    chr   = text.charCodeAt(i);
                    hash  = ((hash << 5) - hash) + chr;
                    hash |= 0; // Convert to 32bit integer
                }
                return hash;
            },

            moveTplToBody:function(tplObject) {
                if (typeof tplObject === 'string')
                    $('body').append($.find(tplObject).detach());
                else
                    $('body').append(tplObject.detach());
            },

            parseAsAceTemplate : function(target, rec, veryAsStringToo) {
                if (!target.selector) target=$(target);

                var operations_attributes = {
                    hide_if_field_is_void : 'ace_pt_hide_void',
                    hide_if_field_is_not_void : 'ace_pt_hide_not_void',
                    hide_if_fn_returns_true : 'ace_pt_hide_fn_true',
                    hide_if_fn_returns_false: 'ace_pt_hide_fn_false',
                    ace_template_var_tag: 'atv',
                    ace_template_var_renderer: 'atv_renderer',
                    ace_template_var_fld: 'atv_fld',
                    ace_template_attr_list: 'atv_attrs',
                    ace_template_attr_values: 'atv_attrs_values',
                    ace_template_reuse_var_tag: 'atvreuse',
                }

                target.find('.'+$.aceOverWatch.classes.parseTpl + '['+operations_attributes.ace_template_attr_list+']').each(function() {
                	let el=$(this);
                    var attr_list_str = el.attr(operations_attributes.ace_template_attr_list);
                    var attr_list = attr_list_str.split(",");

                    var attr_values_str = el.attr(operations_attributes.ace_template_attr_values);
                    var attr_values = attr_values_str.split(",");

                    if (attr_list.length != attr_values.length) return;
                    for(idx in attr_list) {
                        var val=attr_values[idx];
                        if( $.isFunction(attr_values[idx]) ){
                            val = attr_values[idx](target, rec);
                        }else{
                            if( $.isFunction(window[attr_values[idx]]) ){
                                val = window[attr_values[idx]](target, rec);
                            }
                        }
                        if (attr_list[idx] === 'class') val += ' ' + $.aceOverWatch.classes.parseTpl; //add this class again otherwise when i need to reparse it i will not as it was rewritten
                        el.attr(attr_list[idx], val);
                    }
                });

                target.find('.'+$.aceOverWatch.classes.parseTpl + '['+operations_attributes.hide_if_field_is_void+']').each(function() {
                	let el=$(this);
                    if (($.aceOverWatch.utilities.isVoid(rec)) || ($.aceOverWatch.utilities.isVoid(rec.val(el.attr(operations_attributes.hide_if_field_is_void)), veryAsStringToo))) el.addClass($.aceOverWatch.classes.hide);
                    else el.removeClass($.aceOverWatch.classes.hide);

                });

                target.find('.'+$.aceOverWatch.classes.parseTpl + '['+operations_attributes.hide_if_field_is_not_void+']').each(function() {
                    let el=$(this);
                    if (($.aceOverWatch.utilities.isVoid(rec)) || ($.aceOverWatch.utilities.isVoid(rec.val(el.attr(operations_attributes.hide_if_field_is_not_void)), veryAsStringToo))) el.removeClass($.aceOverWatch.classes.hide);
                    else el.addClass($.aceOverWatch.classes.hide);
                });

                target.find('.'+$.aceOverWatch.classes.parseTpl + '['+operations_attributes.hide_if_fn_returns_true+']').each(function() {
                    let el=$(this);
                    var fnName = el.attr(operations_attributes.hide_if_fn_returns_true);

                    if (!$.aceOverWatch.utilities.isVoid(fnName)) {
                        if( $.isFunction(fnName) ){
                            if (fnName(target, rec)===true)  el.addClass($.aceOverWatch.classes.hide);
                            else  el.removeClass($.aceOverWatch.classes.hide);
                        }else{
                            if( $.isFunction(window[fnName]) ){
                                if (window[fnName](target, rec)===true) el.addClass($.aceOverWatch.classes.hide);
                                else  el.removeClass($.aceOverWatch.classes.hide);
                            }
                        }
                    }
                    else el.addClass($.aceOverWatch.classes.hide);
                });

                target.find('.'+$.aceOverWatch.classes.parseTpl + '['+operations_attributes.hide_if_fn_returns_false+']').each(function() {
                    let el=$(this);
                    var fnName = el.attr(operations_attributes.hide_if_fn_returns_false);

                    if (!$.aceOverWatch.utilities.isVoid(fnName)) {
                        if( $.isFunction(fnName) ){
                            if (fnName(target, rec)===false)  el.addClass($.aceOverWatch.classes.hide);
                            else  el.removeClass($.aceOverWatch.classes.hide);
                        }else{
                            if( $.isFunction(window[fnName]) ){
                                if (window[fnName](target, rec)===false) el.addClass($.aceOverWatch.classes.hide);
                                else  el.removeClass($.aceOverWatch.classes.hide);
                            }
                        }
                    }
                    else el.removeClass($.aceOverWatch.classes.hide);
                });


                target.find(operations_attributes.ace_template_var_tag).replaceWith(function() {
                    let el=$(this);
                    var fldName = el.html();
                    var fldRenderer = el.attr(operations_attributes.ace_template_var_renderer);
                    if ($.aceOverWatch.utilities.isVoid(rec)) return null;
                    var res = rec.val(fldName);
                    if (!$.aceOverWatch.utilities.isVoid(fldRenderer)) {
                        if( $.isFunction(fldRenderer) ){
                            res = fldRenderer(rec.val(fldName), rec);
                        }else{
                            if( $.isFunction(window[fldRenderer]) ){
                                res = window[fldRenderer](rec.val(fldName), rec);
                            }
                        }
                    }
                    return res;
                });

                target.find(operations_attributes.ace_template_reuse_var_tag).each(function() {
                    let el=$(this);
                    var fldName = el.attr(operations_attributes.ace_template_var_fld);
                    var fldRenderer = el.attr(operations_attributes.ace_template_var_renderer);
                    if ($.aceOverWatch.utilities.isVoid(rec)) return null;
                    var res = rec.val(fldName);
                    if (!$.aceOverWatch.utilities.isVoid(fldRenderer)) {
                        if( $.isFunction(fldRenderer) ){
                            res = fldRenderer(rec.val(fldName), rec);
                        }else{
                            if( $.isFunction(window[fldRenderer]) ){
                                res = window[fldRenderer](rec.val(fldName), rec);
                            }
                        }
                    }
                    el.html(res);
                });


            },

            /**
             * this method expects that target to be an element containing various ace fields,
             * and the record, an ace record
             * the method applies the values found in the record, to the fields in the template,
             * and returns the content as a SIMPLE html
             */
            parseTemplateAndGetSimpleHtml : function(target, record) {

                let r = $.aceOverWatch.record.isRecord(record)
                    ? record
                    : $.aceOverWatch.record.create(record);

                if (!target.selector) target=$(target);
                for(fieldname in r.data){
                    target.find('[fieldname="'+fieldname+'"]').ace('value',r.val(fieldname),null,r);
                }
                return target.html();
            },

            boolVal : function(val) {
                if ((val === true) || (val === "true") || (val === 1) || (val === "1")) return true;
                return false;
            },

            floatValOrZero : function(rec, fieldname) {
                if ($.aceOverWatch.utilities.isVoid(rec)) return 0;
                if (!$.aceOverWatch.record.isRecord(rec)) return 0;
                if ($.aceOverWatch.utilities.isVoid(fieldname)) return 0;

                var tmpVal = rec.val(fieldname);
                if (!$.isNumeric(tmpVal)) tmpVal = 0;

                tmpVal = parseFloat(tmpVal);
                return tmpVal;
            },

            intValOrZero : function(rec, fieldname) {
                if ($.aceOverWatch.utilities.isVoid(rec)) return 0;
                if (!$.aceOverWatch.record.isRecord(rec)) return 0;
                if ($.aceOverWatch.utilities.isVoid(fieldname)) return 0;

                var tmpVal = rec.val(fieldname);
                if (!$.isNumeric(tmpVal)) tmpVal = 0;

                tmpVal = parseInt(tmpVal);
                return tmpVal;
            },

            returnRecordFromForm: function(target) {
                var tmpRec = $.aceOverWatch.record.create();
                $.aceOverWatch.field.form.retrieveNewRecordData(target, tmpRec, function (rec) { return true;}, true, false, true);
                return tmpRec;
            },

            validateEmail: function(target, email, returnedErrObj) {
                var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{1,4})+$/;
                if (!regex.test(email)) {
                    returnedErrObj.errMsg = _aceL.invem;
                    return false;
                }
                return true;
            },

            buildLabelTxt: function(settings, labelTxt) {
                if (this.isVoid(settings)) return labelTxt;
                if(
                    ( !this.isVoid(settings['helptxt'])) ||
                    ( !this.isVoid(settings['helptpl']))
                )
                {
                    if( settings['helpiconcls'] == null) {
                        settings['helpiconcls'] = $.aceOverWatch.classes.helpIcon;
                    }
                    labelTxt += ' <i class="'+$.aceOverWatch.classes.helpLabel+' '+settings['helpiconcls']+'"></i>';
                }
                return labelTxt;
            },

            activateLabelHelp: function(target, settings) {
                if (this.isVoid(settings)) return true;
                if( settings.helpiconcls != null) {
                    $(target).find('i.' + $.aceOverWatch.classes.helpLabel).click(function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        if ( !$.aceOverWatch.utilities.isVoid(settings.helptxt)) {
                            $.aceOverWatch.toast.show('help', settings.helptxt);
                        }
                        else {
                            $.aceOverWatch.toast.show('help', $('#' + settings.helptpl).html());
                        }
                        return false;
                    });
                }
            }
        },//end utilities object

        /**
         * begin net object
         * the objects handles all NET queries to the server
         */
        net : {

            /**
             * loads an array of data from a server
             * expects a json parsed array from the server
             * if the json contains the field: success, with the value true, then the operation was a success
             * otherwise an error message is expected to be found in the field: error
             * the parameters for the call are taken from the net member of the target's settings
             * extra parameters may be given in the extra paramters object
             **/
            load : function(target, extraparams, callbacks){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);
                if( settings == null ){
                    return false;
                }

                if( settings.net == null || settings.net.fid == null || settings.net.remote != true ){
                    return false;
                }

                var data = {};

                if (( $.aceOverWatch.utilities.isVoid(settings.net.sendrawdata) ) || (!settings.net.sendrawdata)) {
                    if (extraparams) {
                        $.extend(true, data, $.aceOverWatch.record.isRecord(extraparams) ? extraparams.convert(false, false) : extraparams);
                    }

                    if ($.aceOverWatch.utilities.isVoid(data['fid'])) {
                        //if no fid has been given in extraparams, then set the fid as the one from net
                        data['fid'] = settings.net.fid;
                    }

                    if (settings.net.query && settings.net.query.length > 0) {
                        data.query = settings.net.query;//this is a search text which the server may use to do some filtering for the data
                    }
                    if (settings.net.queries && settings.net.queries.length > 0) {
                        data.queries = settings.net.queries;//this is a search text which the server may use to do some filtering for the data
                    }

                    if (settings.net.extraparams) {//more extra parameters, if they exist
                        $.extend(true, data, settings.net.extraparams);
                    }

                    /** start filtering data *
                     * a json through which the retrieved data may further be filtered
                     */
                    if (settings.net.filter && settings.net.filter.fields) {//TODO: add general test for the amount of properties in fields too
                        data.extra_filter = {};
                        if (settings.net.filter.allconditions === true) {
                            data.extra_filter.meet = 0;
                        } else {
                            data.extra_filter.meet = 1;
                        }

                        if (settings.net.filter.exactmatch === true) {
                            data.extra_filter.strict = 1;
                        } else {
                            data.extra_filter.strict = 0;
                        }

                        if (settings.net.filter.fields) {
                            data.extra_filter.data = settings.net.filter.fields;
                        } else {
                            data.extra_filter.data = {};
                        }
                        data.extra_filter = JSON.stringify(data.extra_filter);
                    }
                    if (settings.net.advancedfilter && settings.net.advancedfilter.fields) {//this will be used to have advanced filtering
                        data.filter = {};
                        if (settings.net.advancedfilter.allconditions === true) {
                            data.filter.meet = 0;
                        } else {
                            data.filter.meet = 1;
                        }

                        if (settings.net.advancedfilter.exactmatch === true) {
                            data.filter.strict = 1;
                        } else {
                            data.filter.strict = 0;
                        }

                        if (settings.net.advancedfilter.fields) {
                            data.filter.data = settings.net.advancedfilter.fields;
                        } else {
                            data.filter.data = {};
                        }
                        data.filter = JSON.stringify(data.filter);
                    }
                    /** end filtering data */

                    /** begin pagination ****/
                    if ($.aceOverWatch.utilities.isVoid(data['limit'])) {
                        data.limit = settings.net.size;
                    }
                    if ($.aceOverWatch.utilities.isVoid(data['start'])) {
                        data.start = settings.net.start;
                    }
                }
                else {
                    data = settings.net.sendrawdata;
                }

                /** end pagination ****/
                if( settings.net.cacheit ){
                    //if this is a cacheble query... try to see if we already have the data
                    //if we have it, process that one!
                    //if we don't have it, at ALL, create an entry in the cache, mark it as loading, and load it, and cache it's result
                    //if the query fails, delete the entry from cache, after notifying who needs to be notified (cacheManager does this internally)
                    //if the data is loading, add another listener!

                    cacheKey = $.aceOverWatch.utilities.hashIt(JSON.stringify(data));
                    settings.net.cacheKey = cacheKey;

                    fromCache = $.aceOverWatch.cacheManager.get(cacheKey,function(dataFound){
                        $.aceOverWatch.net.loadProcessData(target, dataFound, callbacks,true);
                    });

                    if( $.aceOverWatch.utilities.isVoid(fromCache) ){
                        //there was no key to be found! set the data as being loaded
                        $.aceOverWatch.cacheManager.update(cacheKey);
                    }else{
                        if(fromCache.state == 0 ){
                            return;// this guy will be notofied by his cached listener when the data has been loaded
                        }else{
                            //we found it!
                            $.aceOverWatch.net.loadProcessData(target, fromCache.data, callbacks,true);
                            return;
                        }
                    }
                }

                var url = settings.net.url;
                if( $.aceOverWatch.utilities.isVoid(url) ){
                    url = $.aceOverWatch.utilities.getWorkingURL();
                }

                /*
				 * storing the last parameters sent on the wire, in case we want to reuse them
				 */
                settings.net.lastUsedData = data;

                /*
				 * if we want to view in NEW window... then open the query in a new window
				 */
                if( settings.innewwindow == true ){
                    window.open(url + '?'+$.param( data ),'_blank');
                    return true;
                }

                $.aceOverWatch.net.ajax(target, url, data, {
                    onsuccess:function(target, data){

                        $.aceOverWatch.net.loadProcessData(target, data, callbacks);

                    },
                    onerror:function(target, data){
                        var errData = {success:false, error:_aceL.esc};
                        if (!$.isPlainObject(data)) {
                            try {
                                data = JSON.parse(data);
                            }
                            catch (e) {
                                data = {};
                            }
                        }
                        $.extend(true,errData, data);
                        $.aceOverWatch.net.loadProcessData(target, errData, callbacks);
                    },
                    oncomplete : function(target, responseText){
                        if( 	callbacks
                            && $.isFunction(callbacks.oncomplete)
                        ){
                            callbacks.oncomplete();
                        }
                    }
                }, settings.net.requestoptions);
            },

            //forceNotCaching is used when this function is called from data retrieved from the cache; so in this case, don't cach it again!
            //generic function to save a record on the server, and expects a certain format when called back
            save : function(target, record, callbacks, customCmd, options ){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);

                if( settings == null ){
                    return false;
                }

                if( !record || record === null && typeof record !== 'object'){
                    return false;
                }

                if( $.isFunction(settings.onbeforesave) && settings.onbeforesave(target, record, true) != true ){
                    return false;
                }
                
                if( settings.net.fid == null || settings.net.remote != true ){
                    if( $.isFunction(settings.onlocalsavesuccessfull) && settings.onlocalsavesuccessfull(target, record) != true ){
                        return false;
                    }
                    return false;
                }

                var data = {};
                var haveExtraCmd = false;//true if in extraparams, or in extrasaveparams there is a cmd parameter explicitdly set; if it exists, then.. don't set the default cmd

                //by default, only dirty fields are being sent
                if( settings.net.extraparams ){//more extra parameters, if they exist
                    $.extend(true,data,settings.net.extraparams);
                }
                $.extend(true,data,($.aceOverWatch.record.isRecord(record)?record.convert(false,true) : record) );

                //some fields may have extra parameters that should be sent ONLY with the save operation.. and nothing else...
                if( settings.net.extrasaveparams ){//more extra parameters, if they exist
                    $.extend(true,data,settings.net.extrasaveparams);
                }

                var defaultCmdParam = '';
                var defaultCmd = data.cmd;
                if( $.aceOverWatch.utilities.isVoid(data.cmd) ){
                    delete data.cmd; //sometimes i get a null and i do not want to send to the wire eg ... cmd=create&cmd=& ....
                    defaultCmdParam = '&cmd='+ (( !$.aceOverWatch.utilities.isVoid(customCmd) ) ? customCmd : 'update');
                    defaultCmd = ( !$.aceOverWatch.utilities.isVoid(customCmd) ? customCmd : 'update');
                }

                var url = settings.net.url;
                if( $.aceOverWatch.utilities.isVoid(url) ){
                    url = $.aceOverWatch.utilities.getWorkingURL();
                }

                //if there is a save in progress, don't let another one start
                if( settings.net.saveInProgress == true ){
                    return;
                }
                settings.net.saveInProgress = true;

                if( !options ){
                    options = {}
                }

                settings.net.lastUsedData = data;

                /*
				 * if we want to view in NEW window... then open the query in a new window
				 */
                if( settings.innewwindow == true ){
                    settings.net.saveInProgress = false;
                    data.fid = settings.net.fid;
                    if( !data.cmd ){
                        data.cmd = ( !$.aceOverWatch.utilities.isVoid(customCmd) ) ? customCmd : 'update';
                    }
                    window.open(url + '?'+$.param( data ),'_blank');
                    return true;
                }

                var saveUrl = url;
                if ((settings.net.saveasrawdata) || (options.saveasrawdata)) data = JSON.stringify(data);
                if (!options.differentoperationsurls) saveUrl = url + '?fid='+settings.net.fid+defaultCmdParam;
                else {
                    switch (defaultCmd) {
                        case 'update':
                            if (!$.aceOverWatch.utilities.isVoid(options.updateurl)) saveUrl = options.updateurl;
                            break;
                        case 'create':
                            if (!$.aceOverWatch.utilities.isVoid(options.createurl)) saveUrl = options.createurl;
                            break;
                        case 'delete':
                            if (!$.aceOverWatch.utilities.isVoid(options.deleteurl)) saveUrl = options.deleteurl;
                            break;
                    }
                }

                if (options.differentoperationsmethods) {
                    switch (defaultCmd) {
                        case 'update':
                            if (!$.aceOverWatch.utilities.isVoid(options.updatemethod)) options.type = options.updatemethod;
                            break;
                        case 'create':
                            if (!$.aceOverWatch.utilities.isVoid(options.createmethod)) options.type = options.createmethod;
                            break;
                        case 'delete':
                            if (!$.aceOverWatch.utilities.isVoid(options.deletemethod)) options.type = options.deletemethod;
                            break;
                    }
                }

                if (!options.differentoperationsurls) saveUrl = url + '?fid='+settings.net.fid+defaultCmdParam;
                $.aceOverWatch.net.ajax(target, saveUrl,
                    data,
                    {
                        onsuccess:function(target, data){
                            var settings = $(target).data($.aceOverWatch.settings.aceSettings);
                            if (settings!=null) {
                                //based on the caller's type - maybe i have to perform some clearing of the loading trails just in case it enters on the error and my callback doesn't get to be called to clear the loadding trails
                                switch (settings['type']){
                                    case 'accordionitem':
                                        //for this I have to reset the state for the user to be able to reload again
                                        $.aceOverWatch.field.accordion.removeLoadingItemIndicators(settings.target, target);
                                        break;
                                }
                            }

                            if( data.success != true ){

                                var hadErrorCallback = false;
                                if( callbacks ){
                                    if( $.isFunction(callbacks.onerror) ){
                                        callbacks.onerror(target, data);
                                        hadErrorCallback = true;
                                    }else{
                                        if( $.isFunction(window[callbacks.onerror]) ){
                                            window[callbacks.onerror](target, data);
                                            hadErrorCallback = true;
                                        }
                                    }
                                }

                                if( !hadErrorCallback ){
                                    $.aceOverWatch.prompt.show(data.error,null,{type:'alert'});
                                }

                                return;
                            }


                            if( settings == null ){
                                return;
                            }

                            switch (settings['type']){
                                case 'grid':
                                    $.aceOverWatch.field.grid.saveSuccessful(target,data.data);
                                    break;
                                case 'imageuploadbutton':
                                    settings['type'] = 'uploadbutton';
                                    settings['atype'] = 'image';  //no break here ;)
                                case 'uploadbutton':
                                    $.aceOverWatch.field.uploadbutton.uploadSuccessful(target,data.data);
                                    break;
                                case 'form':
                                    $.aceOverWatch.field.form.saveSuccessful(target,data.data);
                                    break;
                                case 'accordionitem':
                                    $.aceOverWatch.field.accordion.saveSuccessful(target,data.data);
                                    break;
                                default:
                                    $.aceOverWatch.field.saveSuccessful(target,data.data);
                                    break;
                            }

                            if( callbacks ){
                                if( $.isFunction(callbacks.onsuccess) ){
                                    callbacks.onsuccess(target, data);
                                }else{
                                    if( $.isFunction(window[callbacks.onsuccess]) ){
                                        window[callbacks.onsuccess](target, data);
                                    }
                                }
                            }
                        },

                        oncomplete : function(target, responseText){
                            var settings = $(target).data($.aceOverWatch.settings.aceSettings);
                            if( settings ){
                                settings.net.saveInProgress = false;
                            }

                            if( callbacks ){
                                if( $.isFunction(callbacks.oncomplete) ){
                                    callbacks.oncomplete(target, responseText);
                                }else{
                                    if( $.isFunction(window[callbacks.oncomplete]) ){
                                        window[callbacks.oncomplete](target, responeText);
                                    }
                                }
                            }
                        },

                        onerror:function(target, data){
                            var hadErrorCallback = false;
                            if( callbacks ){
                                if( $.isFunction(callbacks.onerror) ){
                                    callbacks.onerror(target, data);
                                    hadErrorCallback = true;
                                }else{
                                    if( $.isFunction(window[callbacks.onerror]) ){
                                        window[callbacks.onerror](target, data);
                                        hadErrorCallback = true;
                                    }
                                }
                            }
                            if( !hadErrorCallback ){
                                $.aceOverWatch.prompt.show(_aceL.esc,null,{type:'alert'});
                            }
                        }
                    },
                    options
                );
            },

            //if it is non void, the data will not be cached!
            loadProcessData :function(target, data, callbacks, forceNotCaching){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);
                if( settings == null ){
                    return;
                }

                if( $.aceOverWatch.utilities.isVoid(forceNotCaching) && settings.net.cacheit ){
                    //cache it! :D this will signall all other listeners too
                    $.aceOverWatch.cacheManager.update(settings.net.cacheKey,data,true);
                }

                //based on the caller's type - maybe i have to perform some clearing of the loading trails just in case it enters on the error and my callback doesn't get to be called to clear the loadding trails
                switch (settings['type']){
                    case 'accordionitem':
                        //for this I have to reset the state for the user to be able to reload again
                        $.aceOverWatch.field.accordion.removeLoadingItemIndicators(settings.target, target);
                        break;
                }

                if( data.success != true ){

                    var hadErrorCallback = false;
                    if( callbacks ){
                        if( $.isFunction(callbacks.onerror) ){
                            callbacks.onerror(target, data);
                            hadErrorCallback = true;
                        }else{
                            if( $.isFunction(window[callbacks.onerror]) ){
                                window[callbacks.onerror](target, data);
                                hadErrorCallback = true;
                            }
                        }
                    }

                    if( !hadErrorCallback ){
                        $.aceOverWatch.prompt.show(data.error,null,{type:'alert'});
                    }

                    switch (settings['type']){
                        case 'grid':
                            $.aceOverWatch.field.grid.forceStopLoading(target);
                            break;
                    }

                    return;
                }

                data.totalCount = parseInt(data.totalCount);
                if( isNaN(data.totalCount) ){
                    data.totalCount = 0;
                }

                switch (settings['type']){
                    case 'combobox':
                        $.aceOverWatch.field.combobox.setData(target,data.rows,data.totalCount);
                        break;
                    case 'radiogroup':
                        $.aceOverWatch.field.radiogroup.setData(target,data.rows,data.totalCount);
                        break;
                    case 'grid':
                        $.aceOverWatch.field.grid.setData(target,data.rows,data.totalCount,false,data);
                        break;
                    case 'accordionitem':
                        $.aceOverWatch.field.accordion.setData(settings.target, target,data.rows,data.totalCount);
                        break;
                    case 'form':
                        //if the element is a form, then send it the FIRST row of the retrieved set.
                        //if no element has been returned, display an error

                        if( !$.aceOverWatch.utilities.isVoid(data.rows) && data.rows.length > 0  ){
                            $.aceOverWatch.field.form.loadRecord(target, $.aceOverWatch.record.create(data.rows[0]));
                        }else{
                        	
                        	if( !$.aceOverWatch.utilities.isVoid(data.data) ){
                        		$.aceOverWatch.field.form.loadRecord(target, $.aceOverWatch.record.create(data.data));
                        	}else{
                        	
	                            if( callbacks && $.isFunction(callbacks.onerror) ){
	                                callbacks.onerror(target, data);
	                            }else{
	                                $.aceOverWatch.prompt.show(_aceL.nodata,null,{type:'alert'});
	                            }
                        	}
                        }
                        break;
                }

                if( callbacks ){
                    if( $.isFunction(callbacks.onsuccess) ){
                        callbacks.onsuccess(target, data);
                    }else{
                        if( $.isFunction(window[callbacks.onsuccess]) ){
                            window[callbacks.onsuccess](target, data);
                        }
                    }
                }
            },

            saveImage : function(target, destinationField, file, callbacks, otherFields, customCmd){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);

                var frmData = new FormData(), frmDataElCount = 0; //used to count elements couse the iterator do not return the number of els inside it
                if (!$.aceOverWatch.utilities.isVoid(file)) {
                    frmData.append(destinationField, file);
                    frmDataElCount++;
                }

                $.each(otherFields, function(key, val) {
                    frmData.append(key, val);
                    frmDataElCount++;
                });

                if (frmDataElCount <= 0) {
                    switch (settings['type']){
                        case 'imageuploadbutton':
                            settings['type']='uploadbutton';
                            settings['atype']='image'; //no break here ;)
                        case 'uploadbutton':
                            $.aceOverWatch.field.uploadbutton.uploadSuccessful(target,{});
                            break;
                        default:
                            $.aceOverWatch.field.saveSuccessful(target,{});
                            break;
                    }

                    if( callbacks && $.isFunction(callbacks.onsuccess) ){
                        callbacks.onsuccess(target, data);
                    }
                    return true;
                }

                if( settings.net.extraparams ){//more extra parameters, if they exist

                    for( prop in settings.net.extraparams ){
                        frmData.append(prop, settings.net.extraparams[prop]);
                    }
                }
                var cmd = 'update';
                if( !$.aceOverWatch.utilities.isVoid(customCmd) ){
                    cmd = customCmd;
                }

                var url = settings.net.url;
                if( $.aceOverWatch.utilities.isVoid(url) ){
                    url = $.aceOverWatch.utilities.getWorkingURL();
                }

                settings.net.lastUsedData = frmData;

                $.aceOverWatch.net.ajax(target, url + '?fid='+settings.net.fid+'&cmd='+cmd,
                    frmData,
                    {
                        onsuccess:function(target, data){
                            if( data.success != true ){

                                if( callbacks && $.isFunction(callbacks.onerror) ){
                                    callbacks.onerror(target, data);
                                }else{
                                    $.aceOverWatch.prompt.show(data.error,null,{type:'alert'});
                                }

                                return;
                            }

                            var settings = $(target).data($.aceOverWatch.settings.aceSettings);
                            if( settings == null ){
                                return;
                            }

                            switch (settings['type']){
                                case 'imageuploadbutton':
                                    settings['type']='uploadbutton';
                                    settings['atype']='image'; //no break here ;)
                                case 'uploadbutton':
                                    $.aceOverWatch.field.uploadbutton.uploadSuccessful(target,data.data);
                                    break;
                                default:
                                    $.aceOverWatch.field.saveSuccessful(target,data.data);
                                    break;
                            }

                            if( callbacks && $.isFunction(callbacks.onsuccess) ){
                                callbacks.onsuccess(target, data);
                            }
                        },
                    },
                    {
                        type:'POST',
                        contentType:false,
                        processData:false,
                    }
                );

            },

            delete_ : function(target, data, callbacks ){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);

                if( settings == null ){
                    return false;
                }

                if( settings.net.fid == null || settings.net.remote != true ){
                    return false;
                }

                if( !data || data === null && typeof data !== 'object'){
                    return false;
                }

                var _data = {};
                $.extend(true,_data,data );

                if( settings.net.extraparams ){//more extra parameters, if they exist
                    $.extend(true,_data,settings.net.extraparams);
                }

                var url = settings.net.url;
                if( $.aceOverWatch.utilities.isVoid(url) ){
                    url = $.aceOverWatch.utilities.getWorkingURL();
                }

                settings.net.lastUsedData = _data;
                $.aceOverWatch.net.ajax(target, url + '?fid='+settings.net.fid+'&cmd=del', _data, {
                    onsuccess:function(target, data){
                        var settings = $(target).data($.aceOverWatch.settings.aceSettings);
                        if (settings!=null) {
                            //based on the caller's type - maybe i have to perform some clearing of the loading trails just in case it enters on the error and my callback doesn't get to be called to clear the loadding trails
                            switch (settings['type']){
                                case 'accordionitem':
                                    //for this I have to reset the state for the user to be able to reload again
                                    $.aceOverWatch.field.accordion.removeLoadingItemIndicators(settings.target, target);
                                    break;
                            }
                        }
                        if( data.success != true ){
                            if( callbacks && $.isFunction(callbacks.onerror) ){
                                callbacks.onerror(target, data);
                            }else{
                                $.aceOverWatch.prompt.show(data.error,null,{type:'alert'});
                            }
                            return;
                        }

                        if( settings == null ){
                            return;
                        }

                        switch (settings['type']){
                            case 'grid':
                                $.aceOverWatch.field.grid.deleteSuccessful(target,data.data,data);
                                break;
                            case 'radiogroup':
                                $.aceOverWatch.field.radiogroup.deleteSuccessful(target,data.data,data);
                                break;
                            case 'accordionitem':
                                $.aceOverWatch.field.accordion.deleteSuccessful(target,data.data,data);
                                break;
                        }

                        if( callbacks ){
                            if( $.isFunction(callbacks.onsuccess) ){
                                callbacks.onsuccess(target, data);
                            }
                        }
                    }
                },{
                    type:'POST'
                });
            },

            //ajax call - it sends the data object to the url specified, and expects to receives something
            //callbacks - a set of functions to be called; supported so far:
            //			- onsuccess
            //			- onerror
            //			- oncomplete
            ajax : function(target, url, data, callbacks, options){
                $.aceOverWatch.field.mask(target,true);

                var type = 'get';
                var contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
                var processData = true;

                if( options ){
                    if( !$.aceOverWatch.utilities.isVoid(options.type) ){
                        type = options.type;
                    }

                    if( !$.aceOverWatch.utilities.isVoid(options.contentType) ){
                        contentType = options.contentType;
                    }

                    if( !$.aceOverWatch.utilities.isVoid(options.processData) ){
                        processData = options.processData;
                    }
                }

                $.ajax({
                    url: url,

                    dataType : 'json',
                    target:target,
                    data:data,
                    callbacks:callbacks,

                    type:type,
                    contentType:contentType,
                    processData:processData,

                    beforeSend : function () {
                        //TODO in case we want to add stuff
                    },
                    complete : function (jqXHRObj, textStatus) {
                        $.aceOverWatch.field.mask(this.target,false);
                        var dataObj = null;
                        try {
                            dataObj = JSON.parse(jqXHRObj.responseText);
                        }
                        catch (e) {

                        }
                        if( this.callbacks && $.isFunction(this.callbacks.oncomplete) ){
                            this.callbacks.oncomplete(this.target, jqXHRObj.responseText, dataObj);
                        }
                    },
                    error : function(jqXHRObj, textStatus, errorThrown) {
                        var dataObj = null;
                        try {
                            dataObj = JSON.parse(jqXHRObj.responseText);
                        }
                        catch (e) {

                        }
                        if( this.callbacks && $.isFunction(this.callbacks.onerror) ){
                            this.callbacks.onerror(this.target, jqXHRObj.responseText, dataObj);
                        }else{
                            $.aceOverWatch.prompt.show(_aceL.esc,null,{type:'alert'});
                        }
                    },
                    success : function (data, textStatus, jqXHR) {
                        if( this.callbacks && $.isFunction(this.callbacks.onsuccess) ){
                            this.callbacks.onsuccess(this.target, data);
                        }
                    },

                });
            },

            reuseLastParametersInNewWindow : function(target, extraparams){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);
                if( settings == null ){
                    return false;
                }

                if( settings.net == null || settings.net.fid == null || settings.net.remote != true ){
                    return false;
                }

                var data = settings.net.lastUsedData;

                if( extraparams ){
                    $.extend(true, data, $.aceOverWatch.record.isRecord(extraparams)?extraparams.convert(false,false) : extraparams );
                }

                var url = settings.net.url;
                if( $.aceOverWatch.utilities.isVoid(url) ){
                    url = $.aceOverWatch.utilities.getWorkingURL();
                }

                window.open(url + '?fid='+settings.net.fid+'&'+$.param( data ),'_blank');

            }
        },//end net object

        /**
         * begin template object
         * this object handles the dynamic loading of templates and scripts on an as needed bases!
         **/
        template : {

            /**
             * the function loads a html file from the server into the dome
             * the content is going to be placed inside the body of the target element
             * settings :
             */
            loadTemplate : function(target, settings) {
                if( !settings ){
                    //build the options from the properties of the field
                    settings = {};

                    $.each(target.attributes, function() {
                        // this.attributes is not a plain object, but an array
                        // of attribute nodes, which contain both the name and value
                        if(this.specified) {

                            switch( this.name ){
                                case 'extraparams':
                                    settings[this.name] = $.aceOverWatch.utilities.getObjectFromText(this.value);
                                    break;
                                /*
					    	 case 'displayexpanded':
					    		settings[this.name] = (this.value=='true');
					    		break;
					    	*/
                                default:
                                    settings[this.name] = this.value;
                                    break;
                            }
                        }
                    });
                };

                $.extend(true,settings, $.extend(true,{
                    url : '',
                    tpl :'',
                    tplloadedbeforecallback : null,		//this function is called BEFORE the ace field with the ace-auto-gen class are automatically created
                    tplloadedcallback : null			//this function is called AFTER the ace field with the ace-auto-gen class are automatically created
                }, settings ));

                if (settings.tpl==='') return;

                if ($(target).hasClass('ace-tpl-loaded')) {
                	return;
                }
                $(target).addClass('ace-tpl-loaded');
                	
                $.ajax(settings.url+'/'+settings.tpl+'.html', {
                    cache: true,
                    dataType :'html',
                    error : function(jqXHR, textStatus, errorTxt) {
                        if ($.isFunction(settings.tplloadedcallback)){
                        	settings.tplloadedcallback(false, 'Eroare: ' +errorTxt);
                        }
                    },
                    success: function(data, textStatus, jqXHR) {
                    	
                        $(target).html(data);
                        
                        $.aceOverWatch.utilities.runIt(settings.tplloadedbeforecallback,target);

                        if (!$(target).hasClass('ace-tpl-skip-auto-create-data')) {
                            $(target).find('.ace-auto-loadtpl').ace('loadtpl');
                            $(target).find('.ace-auto-gen').ace('create');
                        }
                        
                        $.aceOverWatch.utilities.runIt(settings.tplloadedcallback,target);
                    }
                });
                
            },

            /**
             * the function dynamically loads one or multiple js scripts from the server
             * tplScripts - can be the name of a script, or an array containing script names
             */
            loadScripts : function(tplScripts, onSuccessCallback) {
                if (!$.isArray(tplScripts)) tplScripts=new Array(tplScripts);

                for (tplScript in tplScripts) {
                    $.getScript(tplScripts[0], function( data, textStatus, jqxhr ){
                        if( $.isFunction(onSuccessCallback)){
                            onSuccessCallback();
                        }
                    }).fail(function( jqxhr, settings, exception ) {
                        $.aceOverWatch.utilities.log(_aceL.loadscripterr+tplScripts[0]+'<br>'+settings+'<br>'+exception, 'error', true);
                        $.aceOverWatch.utilities.log(jqxhr);
                        $.aceOverWatch.utilities.log(settings);
                        $.aceOverWatch.utilities.log(exception);
                    });
                }
            }
        }
    };

    /**
     * begin field object
     * a manager for all the various ace fields
     * contains both global field functions, as well as the definitions of the variosu field objects
     **/
    $.aceOverWatch.field = {

        /**
         * @return True if the target is an ace field, false otherwise
         */
        isField : function(target){
            return  !$.aceOverWatch.utilities.isVoid( $(target).data($.aceOverWatch.settings.aceSettings) );
        },

        //this creates a new field
        create : function(target, settings){
            var overviewid = $.aceOverWatch.utilities.getNextoverviewid();

            if( !settings ){
                //build the options from the properties of the field
                settings = {};

                $.each(target.attributes, function() {
                    // this.attributes is not a plain object, but an array
                    // of attribute nodes, which contain both the name and value
                    if(this.specified) {

                        switch( this.name ){
                            case 'net':
                            case 'validation':
                            case 'editform':
                            case 'extrasaveparams':
                            case 'extraparams':
                            case 'editform':
                            case 'gridsettings':
                            case 'defaultdata':
                                settings[this.name] = $.aceOverWatch.utilities.getObjectFromText(this.value);
                                break;
                            case 'extraparamsnoeval':
                                settings[this.name] = $.aceOverWatch.utilities.getObjectFromText(this.value, true);
                                break;
                            case 'hideheader':
                            case 'allowedit':
                            case 'alloweditinline':
                            case 'allowadd':
                            case 'allowdelete':
                            case 'allowrefresh':
                            case 'allowsearchfield':
                            case 'displaycancelbtn':
                            case 'displaysavebtn':
                            case 'displayrowlines':
                            case 'displaycolumnlines':
                            case 'editonselect':
                            case 'hideaftersave':
                            case 'readonly':
                            case 'cacheit':
                            case 'cleardata':
                            case 'textbellowicon':
                            case 'alwayssend':
                            case 'neversend':
                            case 'displaycheckboxcolselectall':
                            case 'isdirectfilterfield'://filters related
                            case 'filterafterreset'://
                            case 'hideafterfilter'://
                            case 'includeemptyvalues'://
                            case 'enablekeybasednavigation':
                            case 'hideonescape':
                            case 'deletenextonesonclick':
                            case 'iswizard':
                            case 'showsaveonadd':
                            case 'showcancelonadd':
                            case 'visible':
                            case 'hidden':
                            case 'donotredrawselectedrow':
                            case 'showaddbutton':
                            case 'onlywhenvisible':
                            case 'autosaveonselectfile':
                            case 'checked':
                            case 'displayextralink':
                            case 'snal'://strong not auto load
                            case 'pagination':
                            case 'showtotalsrow':
                            case 'infinitescroll':
                            case 'forceerror':
                            case 'triggeronchange':
                            case 'autosearchonfocus':
                            case 'allowsort':
                            case 'hidesorticonuntilfirstclick':
                            case 'enablekeynavigation':
                            case 'stayongridafterfocusout':
                            case 'rowparseastemplate':
                            case 'usequeries':
                            case 'enabledexpand':
                            case 'tooglecheckonrowclick':
                            case 'withcheckboxes':
                            case 'checkall':
                            case 'autoselect':
                            case 'enablehomelink':
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
                type:'text',
                id:$.aceOverWatch.settings.fieldPrefix+'-'+overviewid,
                fieldname:'',			//by default, let this empty if NO fieldname has been specified

                label:'',
                labelalign:'top',		//can be left, top, etc, as they are implemented
                labelwidth:'',			//width of the label

                badge:'',
                badgealign:'right',
                badgewidth:'',

                tooltip:'',

                usequeries : false,
                queriesglue : ';',

                net:{			//object that keeps net related data, if any
                    fid:null,
                    autoload:false,

                    autosave:false,			//some fields may detect they've been changed, in which case they will try and save themselves, if they can; EXPERIMENTAL!!!!
                    autosavesamevalue:false,//by default, autosave does not save the same value twice in a row.. set this to true to do so
                    idfieldname:null,		//in order for a field to save itself, it also needs the have set these two properties: idfieldname, and idfieldvalue
                    idfieldvalue:null,		//these two fields are needed by the server to save the data..
                    //TODO - make it so, that in the future, these fields to be skipped in certain cases?

                    readonly:false,			//set to true if the field cannot be edited!

                    remote:false,
                    start:0,	//start index for the remote data
                    size:25,	//amount of items expected

                    query:'',			//search query
                    queries:'',			//search queries..

                    extraparams:{},		//other parameters to send on ALL requests
                    filter:{			//think it filter control
                        allconditions:false,
                        exactmatch:false,
                        fields:{}		//field / value pairs
                    },

                    maxPages:1,//not set directly, computed valute
                    totalExpectedRowsCount:1,

                    cacheit:false			//if true, it will attempt the get the existing data from cache; if it doesn't exist, load it and place it in cache
                    //calls to the same cached thing will wait until the first one returns
                    //only successful calls are cached
                },
                alwayssend:false,		//send to true, if a field should always be sent on the net, even though it is not dirty
                neversend:false,		//never send, if though they are dirty; only sent if explicitdly set
                validation:{
                	forceerror : false, //set this to true, to skip the display of warnings, and just display the error directly
                	tries:0,			//the number of validation tries
                    validate:true,
                    minval:null,
                    maxval:null,
                    minlength:null,
                    maxlength:null,
                    allowempty:true,
                    onlywhenvisible:false,//validate the field, only when the field is visible
                    
                },

                parent : null,	//some elements may belong to some others.. like a form to a grid


                //some functions which may be passed to elements
                onbeforesave : null,	//if it exists, and returns != 0, then the fields will not be able to save themselves ( those that can do that in the first place )
                onsuccess : null,		// param: data, if exists, it is called after a network operation was successfull; data is the object retrieved from the net
                onerror : null,			// param: data, if exists, it is called after a network operation returned with an error; data is the object retrieved from the net

            }, settings ));

            //settings.id = $.aceOverWatch.settings.fieldPrefix + '-'+$.aceOverWatch.settings.fieldPrefix + settings.fieldname;


            return $.aceOverWatch.field.applySettings(target,settings);
        },

        //this function modifies an existing field
        modify : function(target, options){

            var settings = $(target).data($.aceOverWatch.settings.aceSettings);
            if( !settings ){
                return;
            }

            //some fields may not be changed...
            delete options.type;
            delete options.overviewid;

            if( !options.net ){
                options.net = {};
            }

            options.net.autoload = false;//if data was loaded, don't re-load it

            $.extend(true, settings, options );

            return $.aceOverWatch.field.applySettings(target,settings);
        },

        applySettings : function(target,settings){
            var fieldHTML = '', addEmptyCls = true;

            if( typeof settings.extraparams == 'object' ){
                $.extend(true,settings.net.extraparams,settings.extraparams);
                delete settings.extraparams;
            }
            if( typeof settings.extraparamsnoeval == 'object' ){
                $.extend(true,settings.net.extraparams,settings.extraparamsnoeval);
                delete settings.extraparamsnoeval;
            }

            var fieldObj = $.aceOverWatch.field.getFieldObjectFromType(settings.type);
            if( fieldObj && $.isFunction(fieldObj.create) ){
                fieldHTML = fieldObj.create(target,settings);		//custom object create function
            }

            if( !fieldHTML || fieldHTML.length == 0 ){
                return target;
            }

            var containerField = $(target);

            containerField.html(fieldHTML);
            containerField.addClass($.aceOverWatch.classes.containerField);

            if(settings.ignoreLabels !== true && containerField.find('.'+$.aceOverWatch.classes.label).length){
                /*
				 * first.. remove the previous.. label alignement class, if any..
				 */
                if( !$.aceOverWatch.utilities.isVoid(settings.previouslabelalign) ){
                    containerField.removeClass('ace-label-align-'+settings.previouslabelalign);
                }

                /*
				  * add the class for the NEW alignement
				  */
                containerField.addClass('ace-label-align-'+settings.labelalign);

                /*
			      * set the previous label align state, for future modifications
			      */
                settings.previouslabelalign = settings.labelalign;
            }
            containerField.data($.aceOverWatch.settings.aceSettings,settings);

            var targetEl = containerField.find('.'+$.aceOverWatch.classes.fieldValue);

            /*REMOVED THIS.. add individual stuff on each controller
			 *
			 * /**
			 * start event handling
			 * **

			var targetEl = containerField.find('.'+$.aceOverWatch.classes.fieldValue);
			if( $.isFunction(settings.listeners.click) ){
				targetEl.unbind().on('click',settings.listeners.click);
			}
			if( $.isFunction(settings.listeners.change) ){
				targetEl.unbind().on('change',settings.listeners.change);
			}*/

            if (addEmptyCls) {
                targetEl.on('keyup', function(){
                	let el = $(this);
                    if( el.val() == ""){
                    	el.addClass($.aceOverWatch.classes.empty);
                    }else{
                    	el.removeClass($.aceOverWatch.classes.empty);
                    }
                });
            }

            /**
             * end event handling
             * ***/

            //at this point there might be some other stuff to do, like linking JS scripts and stuff, AFTER the field has been added to the dom
            //these operations will take place in each field's afterInit function
            if( fieldObj && $.isFunction(fieldObj.afterInit) ){
                fieldHTML = fieldObj.afterInit(target,{all:true});		//custom object afterInit function
            }

            //binding the error icon tap
            containerField.find('.'+$.aceOverWatch.classes.errorMsg).click(function(){
                $.aceOverWatch.toast.show('error',$(this).data('msg'));
            });

            if( settings.net.autoload ){
                var callbacks = {};
                if( settings.onsuccess ){
                    callbacks['onsuccess'] = settings.onsuccess;
                }
                if( settings.onerror ){
                    callbacks['onerror'] = settings.onerror;
                }
                $.aceOverWatch.net.load(target,null,callbacks);
            }

            $.aceOverWatch.utilities.activateLabelHelp(target, settings);
            return target;
        },

        show : function(target, options){
            var settings = $(target).data($.aceOverWatch.settings.aceSettings);

            if  (!$.aceOverWatch.utilities.isVoid(settings)) {
                var fieldObj = $.aceOverWatch.field.getFieldObjectFromType(settings.type);
                if( fieldObj && $.isFunction(fieldObj.show) ){
                    return fieldObj.show(target);//custom object show function
                }
            }

            $(target).show();//in case there is no custom show function for the field
            return target;
        },

        hide : function(target, options){
            var settings = $(target).data($.aceOverWatch.settings.aceSettings);

            var fieldObj = $.aceOverWatch.field.getFieldObjectFromType(settings.type);
            if( fieldObj && $.isFunction(fieldObj.hide) ){
                return fieldObj.hide(target);		//custom object show function
            }

            $(target).hide();//in case there is no custom show function for the field
            return target;
        },

        validate : function(target, options, debugValidate){
            var containerField = $(target);
            var settings = containerField.data($.aceOverWatch.settings.aceSettings);
            if( !settings ){
                return true;//returning true if the field is not created or something happend with the settings..... I think.. TODO: investigate this...
            }
            let config = settings.validation;

            if( !config ){
                return true;//returning true if the field is not created or something happend with the settings..... I think.. TODO: investigate this...
            }
            if( typeof debugValidate === "undefined" ){
                debugValidate = {};
            }
            debugValidate.fieldname = settings.fieldname;

            if( !config.validate ){
                debugValidate.s1 = 'no validation needed';
                return true;//if not validation is needed, return true
            }

            if( config.onlywhenvisible ){
                debugValidate.s2 = 'only for visible';
                if( !containerField.is(':visible') ){
                    debugValidate.s3 = 'field is hidden';
                    return true;
                }
            }

            if( options && options.resetTries == true ){
                debugValidate.s4 = 'tries were resetted to 0';
                config.tries = 0;//needed when displaying the same form again and again
            }

            config.tries++;
            debugValidate.s5 = 'tries: '+config.tries;

            if( config.tries <= 2 ){	//because an EDIT form might have been displayed imedietly after a NEW form, so some fields have the warning class even on the first step
                debugValidate.s6 = 'tries <=2 removed class required';
                containerField.removeClass($.aceOverWatch.classes.required);
            }

            var value =	$.aceOverWatch.field.value(target);
            var textValue = String(value);
            var nrValue = parseFloat(value);
            if( isNaN(nrValue) ){
                nrValue = 0;
            }

            debugValidate.s7 = 'text = ' + textValue;
            debugValidate.s8 = 'float = ' + nrValue;

            var isValid = true;
            var errMsg = '';

            var errorObj = {//use this object to return an error message from the custom validation function
                errMsg : '',
                displayWarning : false,
                markWithErrorClass : true,
            };

            var fieldObj = $.aceOverWatch.field.getFieldObjectFromType(settings.type);
            if( fieldObj && $.isFunction(fieldObj.validate) ){
                debugValidate.s9 = 'validate from obj';
                if( !fieldObj.validate(target, value, errorObj) ){
                    debugValidate.s10 = 'invalid';
                    isValid = false;
                }
            }
            
            
            let res = $.aceOverWatch.utilities.runIt(config.customvalidation,target, value, errorObj);
            if( $.aceOverWatch.utilities.wasItRan() && !res ){
            	debugValidate.s12 = 'custom validation - invalid';
                isValid = false;
            }

            if( !config.allowempty && (value == null || typeof value == "undefined" || String(value).length == 0) ){
                debugValidate.s15 = 'invalid - empty not allowed';
                isValid = false;
                errorObj.errMsg = _aceL.vvv;
                if( config.tries == 1 && config.forceerror !== true){
                    debugValidate.s16 = 'only warning';
                    errorObj.displayWarning = true;
                }
            }

            if( isValid && config.minval != null ){
                if( isNaN(nrValue) || nrValue < config.minval ){
                    debugValidate.s17 = 'invalid - minval';
                    isValid = false;
                    errorObj.errMsg = _aceL.vmiv + ' ' + config.minval;
                }
            }

            if( isValid && config.maxval != null ){
                if( isNaN(nrValue) || nrValue > config.maxval ){
                    debugValidate.s18 = 'invalid - maxval';
                    isValid = false;
                    errorObj.errMsg = _aceL.vmmv + ' ' + config.maxval;
                }
            }

            if( isValid && config.minlength != null ){
                if( textValue.length < config.minlength ){
                    debugValidate.s19 = 'invalid - minlen';
                    isValid = false;
                    errorObj.errMsg = _aceL.vmil + ' ' + config.minlength;
                }
            }

            if( isValid && config.maxlength != null ){
                if( textValue.length > config.maxlength ){
                    debugValidate.s20 = 'invalid - maxlen';
                    isValid = false;
                    errorObj.errMsg = _aceL.vmml + ' ' + config.maxlength;
                }
            }
            if( isValid && config.email != null ){
                if (!$.aceOverWatch.utilities.validateEmail(target, textValue, errorObj)){
                    debugValidate.s21 = 'invalid - email';
                    isValid = false;

                }
            }

            if( isValid ){
                debugValidate.s21 = 'VALID';
                containerField.removeClass($.aceOverWatch.classes.error);
            }else{
                debugValidate.s22 = 'INVALID';
                if( config.tries == 1 && config.forceerror !== true){
                    debugValidate.s23 = 'warning only (tries - '+config.tries+') (force err '+ config.forceerror + ')';
                    errorObj.displayWarning = true;
                }

                if( errorObj.displayWarning ){
                    containerField.addClass($.aceOverWatch.classes.required);
                    containerField.removeClass($.aceOverWatch.classes.error);
                }else{
                    containerField.find('.'+$.aceOverWatch.classes.errorMsg).data('msg',errorObj.errMsg);
                    if( errorObj.markWithErrorClass ){
                        containerField.addClass($.aceOverWatch.classes.error);
                    }
                }

            }

            if( !isValid ){
                $.aceOverWatch.utilities.log({
                    msg : ' Validation :> INVALID FIELD FOUND ',
                    field : target,
                    settings : settings
                },'debug');

            }

            return isValid;
        },

        //some fields may be given a record.. to set data, or whatever; for example when a form is populated with data
        //TODO: when the record is missing, make is so it returns the record?
        record : function(target, record){
            var settings = $(target).data($.aceOverWatch.settings.aceSettings);

            if( settings == null ){
                return false;
            }

            switch(settings.type){
                case 'grid':
                    //TODO: add functionality to this? add the record to the grid!
                    break;
                case 'form':
                    $.aceOverWatch.field.form.loadRecord(target,record);
                    break;
                default:
                    $.aceOverWatch.field.value(target,record[settings.fieldname]);
                    break;
            }

        },

        /**
         * function used to set or get the values from a field
         * if value is null or missing, the function will not set value of the field
         * if value is present, the value is set
         * some fields may recieve an extra object, depending on each type of field 
         */
        value : function(target, value, extra, record){
            var settings = $(target).data($.aceOverWatch.settings.aceSettings);

            if( settings == null ){
                return false;
            }

            var fieldObj = $.aceOverWatch.field.getFieldObjectFromType(settings.type);
            if( fieldObj && $.isFunction(fieldObj.val) ){
                return fieldObj.val(target,value, extra, record);		//custom object val function
            }

            /*
             * generic val functionality, in lack of something particular to each type of field
             */

            var targetElement = $(target).find('.'+$.aceOverWatch.classes.fieldValue);
            if( targetElement.length == 0 ){
                return null;
            }
            if( value == null ){
                return targetElement.val();
            }

            settings.lastValueSet = value;
            settings.value = value;//saving the raw value

            if( settings.type != 'combobox' ){//TODO - make val functions for combobox!
                String(value).length > 0 ? targetElement.removeClass($.aceOverWatch.classes.empty) : targetElement.addClass($.aceOverWatch.classes.empty);
            }

            return targetElement.val(value).triggerHandler('change');//for a change event as well
        },
        
        /**
         * this method modifies or retrieves the settings of the object
         * no extra operations are performed 
         */
        settings : function(target, newSettings){
        	var settings = target.data($.aceOverWatch.settings.aceSettings);
        	
        	if( settings == null ){
                return false;
            }
        	
        	if( newSettings == null ){
                return settings;
            }
        	
        	if( typeof newSettings == 'object' ){
        		$.extend(true, settings, newSettings );
        		return settings;
        	}
        	
        	return false;
        },
        
        /**
         * this method modifies or retrieves the net extra params of an object
         * IF replace is true, the new parameters will be replaced entirely
         */
        netparams : function(target, newparams, replace = false ){
        	
        	var settings = target.data($.aceOverWatch.settings.aceSettings);
        	
        	if( settings == null ){
                return false;
            }
        	
        	if( newparams == null ){
                return settings.net.extraparams;
            }
        	
        	if( typeof newparams == 'object' ){
        		
        		if( replace ){
        			settings.net.extraparams = newparams;
        		}else{
        			$.extend(true, settings.net.extraparams, newparams );
        		}
        	}
        	
        	return false;
        },
        

        /**
         * used to mask a field during an operation, to prevent user interaction
         */
        mask : function(target, mask){
            var containerField = $(target);
            var settings = containerField.data($.aceOverWatch.settings.aceSettings);
            if( !settings ){
                return false;
            }
            
            if( mask && (settings.loading || settings.type == 'hidden') ){
            	return false;
            }

            var existingMask = $('body').children('.'+$.aceOverWatch.classes.maskDiv+'[maceid="'+settings.id+'"]');

            if( mask == true ){ //display mask
                if( existingMask.length != 0 ){
                    return; //mask already exists
                }

                let extraOffset = 5;//so that the mask will be a bit bigger than the element at all times

                let extraHeight = parseInt(containerField.css('padding-top'))+parseInt(containerField.css('padding-bottom'))+parseInt(containerField.css('margin-top'))+parseInt(containerField.css('margin-bottom'));
                let extraWidth = parseInt(containerField.css('padding-right'))+parseInt(containerField.css('padding-left'))+parseInt(containerField.css('margin-right'))+parseInt(containerField.css('margin-left'));

                let top = containerField.offset().top;
                let height = containerField.height();
                if( height == 0 ){
                    height = containerField.children('div').outerHeight();
                }

                top -= extraHeight / 2 + extraOffset;
                let left = containerField.offset().left - extraWidth / 2 - extraOffset;

                let x = $('<div maceid="'+settings.id+'"></div>').addClass($.aceOverWatch.classes.maskDiv+' '+$.aceOverWatch.classes.fontAwesomePrefix).css({
                    left: left,
                    top: top,
                    height: height+extraHeight*2+extraOffset*2,
                    width: containerField.width()+extraWidth*2+extraOffset*2,
                }).appendTo($('body')).fadeIn('slow');

            }else{///hide mask
                if( existingMask.length == 0 ){
                    return;
                }

                existingMask.fadeOut('slow',function(){
                	let el = $(this);
                    let settings = containerField.data($.aceOverWatch.settings.aceSettings);
                    if( !settings ){
                        return false;
                    }
                    el.remove();
                })
            }
        },

        /**
         * finds an array of jquery elements INSIDE the target whose 'settings' match those in 'options'
         */
        find : function(target,option){
            var containerField = $(target);
            var settings = containerField.data($.aceOverWatch.settings.aceSettings);

            var fields =  $();//creating a jquery object

            if (!settings ){
                return 	fields;
            }

            $(containerField).find('.'+$.aceOverWatch.classes.containerField).each(function(){
                var areDifferent = false;
                var settings = $(this).data($.aceOverWatch.settings.aceSettings);

                for( var prop in option ){
                    if( option.hasOwnProperty(prop) && option[prop] != settings[prop] ){
                        areDifferent = true;
                        break;
                    }
                }

                if( !areDifferent ){
                    fields = fields.add(this);
                }

            });

            return fields;
        },


        
        cancel : function(target, validate){
            var containerField = $(target);
            var settings = containerField.data($.aceOverWatch.settings.aceSettings);

            var fieldObj = $.aceOverWatch.field.getFieldObjectFromType(settings.type);
            if( fieldObj && $.isFunction(fieldObj.cancel) ){
                return fieldObj.cancel(target, validate);
            }
        },

        /**
         * tries to autosave a field
		 *  only works for some fields, which fit several criteria
		 *  - settings.fieldname
		 *  - settings.net.autosave == true
		 *  - settings.net.idfieldname		//these two identify the record on the server side
		 *  - settings.net.idfieldvalue ( positive!!!! ) ; doesn't work for negative values
		 *  
		 *  - ALSO! if the field has itself a SAVE function, that function will be ran instead!
         */
        save : function(target, validate){

            var containerField = $(target);
            var settings = containerField.data($.aceOverWatch.settings.aceSettings);

            //testing to see if the object knows how to save itself!
            var fieldObj = $.aceOverWatch.field.getFieldObjectFromType(settings.type);
            if( fieldObj && $.isFunction(fieldObj.save) ){
                return fieldObj.save(target);		//custom object save function
            }

            if( settings.net.autosave != true || settings.net.idfieldname == null || String(settings.net.idfieldname).length == 0 || settings.net.idfieldvalue == null ){
                return false;
            }

            if( validate && !$.aceOverWatch.field.validate(target) ){
                return false;
            }

            var currentValue = containerField.ace('value');
            if( 		!settings.net.autosavesamevalue
                && 	settings.net.lastautoaavevalue == currentValue ){
                return;//do not save the save value as last time
            }
            settings.net.lastautoaavevalue = currentValue;

            var obj = {};
            obj[settings.net.idfieldname] = settings.net.idfieldvalue;
            obj[settings.fieldname] = currentValue;

            //an answer to a successful operation will come on saveSuccessful function bellow
            return $.aceOverWatch.net.save(target, obj , {
                onsuccess: settings.onsuccess,
                onerror:settings.onerror,
                onbeforesave:settings.onbeforesave,
            });
        },

        //a response to an autosave field operation
        //for the moment we assume this may appear only as a response to an auto save field..
        saveSuccessful : function(target, data){
            var containerField = $(target);
            var settings = containerField.data($.aceOverWatch.settings.aceSettings);

            if( settings.net.autosave != true ){
                return;
            }

            //for now, do something only if this field is INSIDE a form.. and if it is, notify the form
            //TODO: in the future, is more stuff needs to happen here, add the relevant logic

            var form = containerField.closest('.'+$.aceOverWatch.classes.formContainer).parent();

            if( form ){
                //$.aceOverWatch.field.grid.saveSuccessful(target,data.data);

                var fs = form.data($.aceOverWatch.settings.aceSettings);
                if(fs.parentNet){
                    /*
					 * we are in a row form... notify the grid
					 */
                    $.aceOverWatch.field.grid.saveSuccessful(fs.parent,data);
                }else{
                    $.aceOverWatch.field.form.updateRecord(form,settings.fieldname, data[settings.fieldname]);
                }


            }
        },

        /**
         * the function returns the field object based on type
         * WARNING: the TYPE of the object is also the OBJECT'S name! if this isn't the case, then do a translation... like the 'switch' type
         * if the object isn't found, the function returns undefined
         */
        getFieldObjectFromType : function(typeName){
            switch( typeName ){
                case 'switch':
                    typeName = 'aswitch';
                    break;
                case 'imageuploadbutton':
                    typeName = 'uploadbutton';
                    break;
            }

            return $.aceOverWatch.field[typeName];
        },

        /**
         * From here on down begins the creation of specific fields
         ***/

        /**
         * begin label object
         * SIMPLE helper object to create the body of a label used by several fields: display, input, password, combobox, datepicker, autocomplate, etc
         * at this point, this is not a TRUE ace field, just a helper; maybe transform in the future if the need requires
         */
        label : {
            create : function(settings){
                $.extend(true, settings, $.extend(true,{
                    aditionalclasses : null,
                    labelsuffix: $.aceOverWatch.defaults.labelsuffix,
                    labelwidth:'',
                    labelwidthmin:'',
                    labelwidthmax:'',
                }, settings ) );

                var text = '';

                if( String(settings.label).length == 0 ){
                    return '';
                }else{
                    text = settings.label+settings.labelsuffix;
                }

                text = $.aceOverWatch.utilities.buildLabelTxt(settings, text);

                var classes = [$.aceOverWatch.classes.label];

                if (!$.aceOverWatch.utilities.isVoid(settings.aditionalclasses))
                    classes.push(settings.aditionalclasses);

                var styles = [];
                let widthSet = false;
                if( settings.labelwidth.length > 0 ){
                    styles.push('width:'+settings.labelwidth);
                    widthSet = true;
                }
                if( settings.labelwidthmin.length > 0 ){
                    styles.push('min-width:'+settings.labelwidthmin);
                }

                if( settings.labelwidthmax.length > 0 ){
                    styles.push('max-width:'+settings.labelwidthmax);
                }

                return '<label class="'+classes.join(' ')+'" style="'+styles.join(';')+'">'+text+'</label>';
            }
        },//end label object

        /**
         * begin badge object
         * SIMPLE helper object to create the body of a badge used by several fields: display, input, password, combobox, datepicker, autocomplate, etc
         * at this point, this is not a TRUE ace field, just a helper; maybe transform in the future if the need requires
         */
        badge : {
            create : function(settings){
                var text = settings.badge;

                if( String(settings.badge).length == 0 ){
                    return '';
                }

                var classes = [$.aceOverWatch.classes.badge];
                var styles = [];
                if( settings.badgewidth.length > 0 ){
                    styles.push('width:'+settings.badgewidth);
                }
                return '<span class="'+classes.join(' ')+'" style="'+styles.join(';')+'">'+text+'</span>';
            }
        },//end badge object

        /**
         * begin breadcrumbs object
         *
         * This object displays breadcrumbs!
         * Example: from > here > to > there
         * a breadcrumb has a name, and an information attached to it
         * when clicked, a breadcrumb will notify the client if a callback is specified
         * also, it will delete all other elements coming after it (default behavior, can be changed)
         *
         */
        breadcrumbs : {
            create : function(target,settings){

                $.extend(true, settings, $.extend(true,{
                    separator : ' > ',
                    homename : _aceL.home,		  //the name of the first element
                    displayhomewhennobreadcrumbs:true,//if false, if there are no custom breadcrumbs, the home will not be displayed
                    enablehomelink:true,		//if false, the home link, if dislayed, will not be clickable
                    renderer:null,	//a function,or the name of a function used to format the content of a breadcomb: renderer(target, index, value, record)

                    data : [],		//array of breadcrumbs RECORDS
                    // when set from outside, on create, or modify, it can be a simple array of objects; if that is the case, it will be converted to records array based on the type of the first element
                    // fields of objects:
                    // - name - the text displayed on the breadcrumb
                    // - value - the value associated with the breadcrumb
                    // - hidden - true if it should be hidden

                    breadcrumbclick:null, //a function, or the name of a function to be called when a breadcrumb is clicked.. breadcrumbclick(target, index, value)

                    deletenextonesonclick:true,	//true if on click, if next elements should be deleted
                    iswizard:false,	//if true when activating one breadcrumb, the next ones will be disabled!

                    autoselect : false,//if true set after creation/modification the step to the first, or the
                    				   //attention! this field resets to false after every use
                    currentindex : false,//this is the index of the last triggered breadcrumb 
                    
                }, settings ) );


                if( settings.data.length == 0 ){
                    settings.data = $.aceOverWatch.utilities.getAsociatedDataArr(target);
                }

                //convert data to inner data format
                if( settings.data.length > 0 && !$.aceOverWatch.record.isRecord(settings.data[0]) ){
                    var innerData = [];
                    for(var idx = 0; idx < settings.data.length; idx++){
                        innerData.push($.aceOverWatch.record.create(settings.data[idx]));
                    }
                    settings.data = innerData;
                }


                var fieldHtml = '<div class="'+$.aceOverWatch.classes.breadcrumbsField+'" >';
                fieldHtml += '</div>';

                return fieldHtml;
            },

            afterInit : function(target, what){

                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                //now.. we build the breadcrumbs - for now.. let's build them all each time, see that it works, and afterwords imrpove it!!
                var breadcrumbsHtml = '';

                var renderer = null;
                if( $.isFunction(settings.renderer)){
                    renderer = settings.renderer;
                }else{
                    if( $.isFunction(window[settings.renderer])){
                        renderer = window[settings.renderer];
                    }
                }

                if( settings.displayhomewhennobreadcrumbs ){
                    //add the header..
                    var disabled = settings.enablehomelink ? '' : 'disabled="disabled"';
                    breadcrumbsHtml += '<a href="#" idx="-1" class="'+$.aceOverWatch.classes.breadcrumbsLink+' ' + $.aceOverWatch.classes.breadcrumbsActive+' " '+disabled+' >'+
                        (renderer ? renderer(target, -1, settings.homename) : settings.homename)+
                        '</a>';
                }

                for(var idx in settings.data ){
                    var hideClass = '';
                    if( settings.data[idx].val('hidden') == true ){
                        hideClass = $.aceOverWatch.classes.hide;
                    }
                    breadcrumbsHtml += ' <span class="'+$.aceOverWatch.classes.breadcrumbsSeparator+' '+hideClass+'" idx="'+idx+'">' + settings.separator + '</span><a href="#" idx="'+idx+'" class="'+$.aceOverWatch.classes.breadcrumbsLink+' '+hideClass+'">'+
                        (renderer ? renderer(target, idx, settings.data[idx].val('name'), settings.data[idx]) : settings.data[idx].val('name')) +
                        '</a>';
                }

                targetField = containerField.find('.'+$.aceOverWatch.classes.breadcrumbsField);
                targetField.html(breadcrumbsHtml);

                targetField.find('a.'+$.aceOverWatch.classes.breadcrumbsLink).unbind().bind('click',function(e){
                	let bc = $(this);
                    var target = bc.closest('.'+$.aceOverWatch.classes.containerField);
                    var settings = target.data($.aceOverWatch.settings.aceSettings);

                    var idx = parseInt(bc.attr('idx'));
                                        

                    bc.addClass($.aceOverWatch.classes.breadcrumbsActive);
                    bc.siblings().removeClass($.aceOverWatch.classes.breadcrumbsActive);

                    /*
                     * delete other breadcrumbs if so desired
                     */
                    if( settings.deletenextonesonclick ){
                        bc.nextAll().remove();
                        settings.data.splice(idx+1,settings.data.length-idx-1);
                    }

                    if( settings.iswizard ){
                        bc.attr('disabled',false);
                        bc.nextAll().attr('disabled','disabled');
                        bc.prevAll('disabled',false);
                    }

                    var value = null;
                    if( idx >= 0 ){
                        value = settings.data[idx].val('value');

                        if( $.aceOverWatch.utilities.isVoid(value) ) {
                            value = settings.data[idx].val('name');
                        }
                    }

                    /*
                     * calling the callback if defined
                     */
                    if( $.isFunction(settings.breadcrumbclick)){
                        settings.breadcrumbclick(target, idx, value);
                    }else{
                        if( $.isFunction(window[settings.breadcrumbclick])){
                            window[settings.breadcrumbclick](target, idx, value);
                        }
                    }
                    
                    settings.currentindex = idx;

                    return false;

                });
                
                if( settings.autoselect && settings.currentindex !== false ){
                	settings.autoselect = false;
                	this.switchTo(target, settings.currentindex);
                }
            },

            /**
             * sets the visibility of a breadcrumb
             * @param index - the index of the breadcrumb
             * @param visibility - true if visible, false otherwise
             * @param indexIsValue - true if the index parameter is NOT an actual index, but the VALUE of a breadcrumb
             */
            setVisibility : function(target, index, visibility, indexIsValue){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if( $.aceOverWatch.utilities.isVoid(indexIsValue) ){
                    indexIsValue = false;
                }
                if( indexIsValue ){
                    var realIndex = -1;
                    //if the index provides is instead the value of a breadcrumb.. FIND it's index!
                    for(var idx in settings.data){
                        if( settings.data[idx].val('value') == index ){
                            realIndex = idx;
                            break;
                        }
                    }
                    if( realIndex == -1 ){
                        return false;
                    }
                    index = realIndex;//found it's proper index! yay!
                }

                if( index < 0 || index > settings.data.length ){
                    return;
                }

                if( visibility != true ){
                    visibility = false;
                }

                settings.data[index].val('hidden',!visibility);
                if( visibility ){
                    containerField.find('[idx="'+index+'"]').removeClass($.aceOverWatch.classes.hide);
                }else{
                    containerField.find('[idx="'+index+'"]').addClass($.aceOverWatch.classes.hide);
                }
            },

            /**
             * return true if the breadcrumb is visible.. false otherwise
             * @param index - the index of the breadcrumb
             */
            checkVisibility:function(target, index){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);

                if( index < -1 || index > settings.data.length ){
                    return false;
                }
                
                if( index == -1 ){
                	return settings.displayhomewhennobreadcrumbs;
                }

                return settings.data[index].val('hidden') != true;
            },

            /**
             * removes the last breadcrumb
             */
            removeLastIndex : function(target){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if( settings.data.length > 0 ){
                    settings.data.splice(settings.data.length-1,1);
                    $.aceOverWatch.field.breadcrumbs.afterInit(target);
                }
            },
            
            /**
             * removes the last breadcrumb
             */
            getCurrentIndex : function(target){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);
                if( settings ){
                	return settings.currentindex;
                }
            },


            /**
             * this val functions a bit different thant that of other fields..
             * if val is null, it will return the fields data array
             * if not...
             * 	if we received an array... well... replace all the data with it
             *  otherwise, we'll add the new data as a breadcrumb
             */
            val : function(target, value){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if( $.aceOverWatch.utilities.isVoid(value) ) {
                    return settings.data;
                }

                /*
                 * if we received an array... well... replace all the data with it
                 */
                if( value instanceof Array ){

                    if( value.length > 0 && !$.aceOverWatch.record.isRecord(value[0]) ){
                        var innerData = [];
                        for(var idx = 0; idx <value.length; idx++){
                            innerData.push($.aceOverWatch.record.create(value[idx]));
                        }
                        settings.data = innerData;
                    }else{
                        settings.data = value;
                    }

                }else{

                    let record = null;

                    /*
                     * we make sure what is have is a record, or we transform it into a record,
                     * and we added this element as a new breadcrumb
                     */
                    if (!$.isPlainObject(value)) {
                        record = $.aceOverWatch.record.create({
                            name:value,
                            value:value
                        });
                    }else{


                        /*
                         * we have an object.. so.. test if record or not
                         */
                        if( !$.aceOverWatch.record.isRecord(value) ){
                            record = $.aceOverWatch.record.create(value);
                        }else{
                            record = value;
                        }
                    }

                    /*
                     * now.. in record, we have the new data...
                     * the default behaviour of this is to add the breadcrumb..//TODO... later on, add more.. like replace, or delete
                     * 
                     */
                    settings.data.push(record);
                }

                //build it!
                $.aceOverWatch.field.breadcrumbs.afterInit(target);
            },

            /*
			 * change data of exiting
			 * if index is -1.. change the LAST one!
			 */
            changeExistingData : function(target, index, newData ){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                var record = null;
                //we have an object.. so.. test if record or not
                if( !$.aceOverWatch.record.isRecord(newData) ){
                    record = $.aceOverWatch.record.create(newData);
                }else{
                    record = newData;
                }

                if( index >= 0 ){
                    if( settings.data[index] ){
                        settings.data[index] = record;
                    }
                }else{
                    if(
                        index == -1
                        &&	settings.data.length > 0
                    ){
                        settings.data[settings.data.length-1] = record;
                    }
                }

                /*
				 * build it!
				 */
                $.aceOverWatch.field.breadcrumbs.afterInit(target);
            },

            /*
             * swiches to the specified index
             */
            switchTo : function(target, index){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                containerField.find('a[idx="'+index+'"]').triggerHandler('click');
            },
            
            gotoNextIndex : function(target){

            	var settings = $(target).data($.aceOverWatch.settings.aceSettings);
            	
            	let index = this.getCurrentIndex(target);
            	
                index++;
                for( ; index < settings.data.length; index++ ){
                	if( this.checkVisibility(target, index) ){
                		break;
                	}
                }
                if( index > settings.data.length ){
                	return;
                }

            	this.switchTo(target,index);
            },
            
            gotoPreviousIndex : function(target){
        		var settings = $(target).data($.aceOverWatch.settings.aceSettings);
            	
            	let index = this.getCurrentIndex(target);
            	
                index--;
                for( ; index >= -1; index-- ){
                	if( this.checkVisibility(target, index) ){
                		break;
                	}
                }
                if( index < -1 ){
                	return;
                }

            	this.switchTo(target,index);
            },

            switchToLastIndex : function(target){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                containerField.find('a[idx="'+(settings.data.length-1)+'"]').triggerHandler('click');
            }

        },

        /**
         * begin display object
         * this field allows the display of a text, preceeded by an optionsl label
         */
        display : {
            create : function(target,settings){
                $.extend(true, settings, $.extend(true,{
                    value:'',		//the value which is going to be displayed
                    renderer:null,	//a function,or the name of a function used to format the value in some way
                    aditionalclasses : null,
                    labeladitionalclasses : null,
                }, settings ) );

                var fldClasses = [$.aceOverWatch.classes.fieldValue];
                if (!$.aceOverWatch.utilities.isVoid(settings.aditionalclasses))
                    fldClasses.push(settings.aditionalclasses);

                settings.aditionalclasses = settings.labeladitionalclasses; //to use on the label creation


                /*
				 * if we have a renderer, and an initial value, then process the value through the renderer!
				 */
                var displayValue = settings['value'];
                if( $.isFunction(settings.renderer)){
                    displayValue = settings.renderer(settings['value']);
                }else{
                    if( $.isFunction(window[settings.renderer])){
                        displayValue = window[settings.renderer](settings['value']);
                    }
                }

                var fieldHtml = '<div class="'+$.aceOverWatch.classes.displayField+'" >';
                fieldHtml += '<span class="'+fldClasses.join(' ')+'" aceid="'+settings.id+'">'+displayValue+'</span>';
                fieldHtml += $.aceOverWatch.field.label.create(settings);
                fieldHtml += $.aceOverWatch.field.badge.create(settings);		//uncomment if we want badges on this one too..
                fieldHtml += '<span class='+$.aceOverWatch.classes.errorMsg+'></span>';
                fieldHtml += '</div>';

                return fieldHtml;
            },

            val : function(target, value, extra, record){
                var containerField = $(target);
                var targetElement = containerField.find('.'+$.aceOverWatch.classes.fieldValue);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if( targetElement.length == 0 ){
                    return null;
                }
                if( value == null ){
                    return targetElement.html();
                }else{

                    settings.value = value;//saving the raw value

                    if( $.isFunction(settings.renderer)){
                        return targetElement.html(settings.renderer(value,record));
                    }else{
                        if( $.isFunction(window[settings.renderer])){
                            return targetElement.html(window[settings.renderer](value,record));
                        }
                    }

                    return targetElement.html(value);
                }
            }
        },//end display object

        /**
         * begin hidden object
         * ***/
        hidden : {
            create : function(target,settings){
                $.extend(true,settings, $.extend(true,{
                    value:'',
                    onchange:null,	//function, or the name of a function to be called when the value changes; onchange(target, value, event)
                    //private settings
                    timerId:null,	 //in case of autosave, this will contain the id of the timer used by the keyup event to detect changes
                }, settings ) );
                fieldHtml = '<input type="hidden" class="'+$.aceOverWatch.classes.fieldValue+'" aceid="'+settings.id+'" value="'+settings['value']+'" >';
                return fieldHtml;
            },
            afterInit : function(target, what){

                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                clearTimeout(settings.timerId); //making sure we kill whatever existing timer we have here
                var inputField = containerField.find('input');

                inputField.unbind('change').change(function (e) {
                	let el = $(this);
                	var target = el.closest('.'+$.aceOverWatch.classes.containerField);
                    var settings = target.data($.aceOverWatch.settings.aceSettings);

                    //run a callback as well, if it exists
                    if( $.isFunction(settings.onchange)){
                        settings.onchange(target,el.val(),e);
                    }else{
                        if( $.isFunction(window[settings.onchange])){
                            window[settings.onchange](target,el.val(),e);
                        }
                    }
                });
            },
        },//end hidden object

        /**
         * begin textcurrency
         *
         * it is built OVER the text controll
         * the value set is always considered to be in the valuecurrencyid
         * the value displayed is always considered to be in displaycurrencyid
         *
         * to work correctly, the application/page/site which uses this control
         * needs to define 4 global functions:
         * 1 -	ace_helper_get_badge_for_currency(currencyId) which has to return the currency code
         * 2 -	ace_helper_convert_currency_value(value,fromCurrencyId,toCurrencyId) which has to return the value converted from the currency, to the currency       *
         * 3 -  ace_helper_get_default_currency_display() - should return the default currency for display
         * 4 -  ace_helper_get_default_currency_value() - should return the default currency for value
         *
         *  always, the value found in settings.value is going to be the VALUE in value currency
         *
         *  ATTENTION: renderer does not work for this field!
         *     USE INSTEAD: renderercurrency
         */
        textcurrency : {

            create : function(target,settings){

                let defaultdisplaycurrencyid = 0;
                let defaultvaluecurrencyid = 0;
                let defaultbadge = 'ACE';

                if( $.isFunction(window['ace_helper_get_default_currency_display']) ){
                    defaultdisplaycurrencyid = window['ace_helper_get_default_currency_display']();
                }

                if( $.isFunction(window['ace_helper_get_default_currency_value']) ){
                    defaultvaluecurrencyid = window['ace_helper_get_default_currency_value']();
                }

                $.extend(true,settings, $.extend(true,{
                    badge : defaultbadge,
                    displaycurrencyid : defaultdisplaycurrencyid,	//the currency in which the VALUE of the input is displayed
                    valuecurrencyid : defaultvaluecurrencyid,	//the currency in which the actual VALUE of the control is set
                    value : 0,
                    exception : false,
                    renderercurrency : false,//use this instead of renderer to format the value displayed
                    updatevaluefromdisplayedvalue : false,//use this to update the value from the current displayed text
                    // the flag will automatically be set to false, after every use

                    previousDisplayCurrencyId : 0,//never set this from outside
                }, settings ) );

                if( $.isFunction(window['ace_helper_get_badge_for_currency']) ){
                    settings.badge = window['ace_helper_get_badge_for_currency'](settings.displaycurrencyid);
                }

                if( settings.updatevaluefromdisplayedvalue === true ){
                    /*
                     * in this case, we modify the internal value to that of the displayed field ( converted, ofc);
                     */
                    let inputEl = $(target).find('input');
                    if( inputEl.length == 1 ){
                        settings.value = $.aceOverWatch.field.textcurrency.convertValue(inputEl.val(),settings.previousDisplayCurrencyId,settings.valuecurrencyid,settings.exception);
                    }
                }
                settings.previousDisplayCurrencyId = settings.displaycurrencyid;
                settings.updatevaluefromdisplayedvalue = false;

                settings.displayvalue = $.aceOverWatch.field.textcurrency.convertValue(settings.value,settings.valuecurrencyid,settings.displaycurrencyid,settings.exception);
                if( $.isFunction(settings.renderercurrency)){
                    settings.displayvalue = settings.renderercurrency(settings.displayvalue);
                }else{
                    if( $.isFunction(window[settings.renderercurrency])){
                        settings.displayvalue = window[settings.renderercurrency](settings.displayvalue);
                    }
                }
                settings.renderer = function(){
                    return settings.displayvalue;
                }

                return $.aceOverWatch.field.text.create(target,settings);
            },

            afterInit : function(target, what){
                $.aceOverWatch.field.text.afterInit(target,what);
            },

            val : function(target, value, extra, record){

                var containerField = $(target);
                var targetElement = containerField.find('.'+$.aceOverWatch.classes.fieldValue);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if( value != null ){
                    /*
                     * we need to convert the value from the value currency, to the display currency
                     */
                    settings.displayvalue = $.aceOverWatch.field.textcurrency.convertValue(value,settings.valuecurrencyid,settings.displaycurrencyid,settings.exception);

                    if( $.isFunction(settings.renderercurrency)){
                        settings.displayvalue = settings.renderercurrency(settings.displayvalue);
                    }else{
                        if( $.isFunction(window[settings.renderercurrency])){
                            settings.displayvalue = window[settings.renderercurrency](settings.displayvalue);
                        }
                    }

                    settings.renderer = function(){
                        return settings.displayvalue;
                    }
                }

                res  = $.aceOverWatch.field.text.val(target, value, extra, record);

                if( res == null ){
                    return null;
                }

                if( value == null ){
                    /*
                     * we need to convert the res from the display currency, to the value currency
                     */
                    res = $.aceOverWatch.field.textcurrency.convertValue(res,settings.displaycurrencyid,settings.valuecurrencyid,settings.exception);
                    settings.value = res;
                }

                return res;
            },

            convertValue : function(value,fromCurrency,toCurrency,exception){
                if(  exception !== false && parseFloat(value) == parseFloat(exception) ){
                    return exception;
                }
                if( $.isFunction(window['ace_helper_convert_currency_value']) ){
                    return window['ace_helper_convert_currency_value'](value,fromCurrency,toCurrency);
                }
                return value;
            }
        },

        /**
         * begin text object
         * this field allows the display and the EDITING of a text, preceeded by an optional label
         * the field may attempt to save itself if net autosave is true, and the rest of the data is specified as well
         */
        text : {
            create : function(target,settings){
                $.extend(true,settings, $.extend(true,{
                    value:'',
                    onchange:null,	//function, or the name of a function to be called when the value changes; onchange(target, value, event)
                    onenter:null,	//function, or the name of a function to be called when enter is pressed(target, value)
                    renderer:null,	//function, or the name of a function to modify the set value

                    //private settings
                    timerId:null,	 //in case of autosave, this will contain the id of the timer used by the keyup event to detect changes
                }, settings ) );

                var fieldHtml = '<div class="'+$.aceOverWatch.classes.textField+'" >';

                var tooltip = '';
                if( settings['tooltip'] ){
                    tooltip = ' data-toggle="tooltip" data-placement="bottom" data-trigger="hover" data-original-title="'+settings['tooltip']+'" ';
                }
                var placeholder= '';
                if( settings['placeholder'] ){
                    placeholder = ' placeholder="'+settings['placeholder']+'" ';
                }

                var autocomplete = settings.autocomplete ? ' autocomplete = "'+settings.autocomplete+'" ' : '';

                /*
				 * if we have a renderer, and an initial value, then process the value through the renderer!
				 */
                settings.displayValue = settings['value'];
                if( $.isFunction(settings.renderer)){
                    settings.displayValue = settings.renderer(settings['value']);
                }else{
                    if( $.isFunction(window[settings.renderer])){
                        settings.displayValue = window[settings.renderer](settings['value']);
                    }
                }

                var inputMaxLen = "";
                if ((settings.validation.maxlength != null) && (settings.validation.maxlength != "")) {
                    inputMaxLen = " maxlength="+settings.validation.maxlength + " ";
                }

                fieldHtml += '<input type="text" class="'+$.aceOverWatch.classes.fieldValue+(String(settings['displayValue']).length==0?' '+$.aceOverWatch.classes.empty:'')+'" aceid="'+settings.id+'" name="'+settings['fieldname']+'" '+tooltip+placeholder+' ' + (settings['readonly'] ? 'readonly="readonly"' : '') +' ' + autocomplete + inputMaxLen + ' >';
                fieldHtml += $.aceOverWatch.field.label.create(settings);
                fieldHtml += $.aceOverWatch.field.badge.create(settings);


                fieldHtml += '<span class='+$.aceOverWatch.classes.errorMsg+'></span>';
                fieldHtml += '</div>';

                return fieldHtml;
            },

            afterInit : function(target, what){

                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                clearTimeout(settings.timerId); //making sure we kill whatever existing timer we have here
                var inputField = containerField.find('input');

                /*
				 * displaying an initial value.. if we have one
				 */
                if( !$.aceOverWatch.utilities.isVoid(settings.displayValue) ){
                    inputField.val(settings.displayValue);
                }

                inputField.unbind('click').click(function(){//select all text on click
                    $(this).select();
                });

                inputField.unbind('change').change(function (e) {
                	
                	let el = $(this);
                    var target = el.closest('.'+$.aceOverWatch.classes.containerField);
                    var settings = target.data($.aceOverWatch.settings.aceSettings);

                    settings.value = el.val();
                    $.aceOverWatch.utilities.runIt(settings.onchange,target, settings.value,e);
                });

                if(
                		settings.net.autosave == true
                    ||	settings.onenter
                ){

                    //ok.. we have autosave.. so....
                    //each time something is being typed, it will trigger a timer of 2 seconds(?).. if at the end of the timer, the value is different than the last value saved... the field will try to save itself

                    inputField.keyup(function (e) {
                    	let el = $(this);
                        var target = el.closest('.'+$.aceOverWatch.classes.containerField);
                        var settings = target.data($.aceOverWatch.settings.aceSettings);

                        clearTimeout(settings.timerId);

                        switch(e.keyCode){
                            case 13://enter

                                /*
                                 * ok... in case the field doesn't have a fid of its own.. we look at the parent, if there is one
                                 * in the parent, we look at the net, or at the parentNet fields, and we get the fid and remote from there
                                 */
                                if( settings.net.autosave == true ){
                                    if( !settings.net.fid ){
                                        if( settings.parentform ){
                                            var pfd = settings.parentform.data($.aceOverWatch.settings.aceSettings);
                                            if( pfd.net && pfd.net.fid ){
                                                settings.net.fid = pfd.net.fid;
                                                settings.net.remote  = true;
                                            }else{
                                                if( pfd.parentNet && pfd.parentNet.fid ){
                                                    settings.net.fid = pfd.parentNet.fid;
                                                    settings.net.remote  = true;
                                                }
                                            }
                                        }
                                    }

                                    $.aceOverWatch.field.save(target,true);
                                }
                                
                                $.aceOverWatch.utilities.runIt(settings.onenter,target,el.val(),e);

                                break;
                            case 27://escape
                                //do nothing in this case, for now... change if needed?
                                break;
                            default:
                                if( settings.net.autosave ){
                                    settings.timerId = setTimeout(function(){
                                        $.aceOverWatch.field.save(target,true);
                                    },2000);
                                }
                                break;
                        }
                    });

                }
            },

            /**
             * @param target
             * @param value
             * @param extra - object, which might hold certain flags
             *                         triggerchange - if === false, then the change event will not be triggered automatically after setting a value
             * @param record
             * @returns
             */
            val : function(target, value, extra, record){
                var containerField = $(target);
                var targetElement = containerField.find('.'+$.aceOverWatch.classes.fieldValue);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if( targetElement.length == 0 ){
                    return null;
                }

                if( !extra ){
                    extra = {};
                }

                if( value == null ){
                    settings.value = targetElement.val();
                    return settings.value;
                }else{

                    String(value).length > 0 ? targetElement.removeClass($.aceOverWatch.classes.empty) : targetElement.addClass($.aceOverWatch.classes.empty);

                    settings.value = value;//saving the raw value

                    if( $.isFunction(settings.renderer)){
                        if( extra.triggerchange != false ){
                            targetElement.val(settings.renderer(value,record)).triggerHandler('change');
                        }else{
                            targetElement.val(settings.renderer(value,record));
                        }
                        targetElement.triggerHandler('keyup');
                        return targetElement;
                    }else{
                        if( $.isFunction(window[settings.renderer])){
                            if( extra.triggerchange != false ){
                                targetElement.val(window[settings.renderer](value,record)).triggerHandler('change');
                            }else{
                                targetElement.val(window[settings.renderer](value,record));
                            }
                            targetElement.triggerHandler('keyup');
                            return targetElement;
                        }
                    }

                    if( extra.triggerchange != false ){
                        return targetElement.val(value).triggerHandler('change');//for a change event as well
                    }else{
                        return targetElement.val(value);
                    }
                }
            }
        },//end text object

        /**
         * begin chips
         */

        chips : {

            create : function(target,settings){

                $.extend(true,settings, $.extend(true,{

                    nextnewvalue: -1,	//the next value to be automatic assigned to a new chip
                    deltavalue:-1,		//after an automatic value assigned, the next new value will be modified by this ammount
                    //by default, the values are going into the NEGATIVE

                    maxchipcount:100,

                    allowduplicates:false,//true if we should allow duplicate values

                    data : [],		//array of chips RECORDS
                    // when set from outside, on create, or modify, it can be a simple array of objects; if that is the case, it will be converted to records array based on the type of the first element
                    // fields of objects:
                    // - name - the text displayed on the chip
                    // - value - the value associated with the chip

                    onremove:null,//function, or the name of a function to be called when a chip has been removed onremove(target, idx, record)
                    onadd:null,//function, or the name of a function to be called when a chip has been added onadd(target, record)
                    customallowadd:null,//function, or the name of a function to be called, for custom persmission to add a value customallowadd(target, value)
                                        //the function, if it exists, needs to return true, otherwise the value will not be added

                    visible : true,//if false, the input field will be hidden

                    inputtype : 'input',//can also be combobox
                    selectiondata : [],//used by the combobox, if inputtyype = combobox
                    		//the data may be specified directly in the HTML using a <storecombo>...</storecombo> structure
                    
                    valuename:'id',
                    displayname:'name',
                    
                    placeholder : '',

                }, settings ) );

                settings.maxchipcount = parseInt(settings.maxchipcount);

                if( settings.data.length == 0 ){
                    settings.data = $.aceOverWatch.utilities.getAsociatedDataArr(target);
                }

                //convert data to inner data format
                if( settings.data.length > 0 && !$.aceOverWatch.record.isRecord(settings.data[0]) ){
                    var innerData = [];
                    for(var idx = 0; idx < settings.data.length; idx++){
                        innerData.push($.aceOverWatch.record.create(settings.data[idx]));
                    }
                    settings.data = innerData;
                }

                var placeholder= '';
                if( settings['placeholder'] ){
                    placeholder = ' placeholder="'+settings['placeholder']+'" ';
                }
                var tooltip = '';
                if( settings['tooltip'] ){
                    tooltip = ' data-toggle="tooltip" data-placement="bottom" data-trigger="hover" data-original-title="'+settings['tooltip']+'" ';
                }

                var fieldHtml = '<div class="'+$.aceOverWatch.classes.chipsField+'" >';

                for(var idx in settings.data ){
                    fieldHtml += $.aceOverWatch.field.chips.getChipHtml(target,idx, settings);
                }

                switch( settings.inputtype ){
                    case 'combobox':
                    	
                    	if( settings.selectiondata.length == 0 ){
                    		settings.selectiondata = $.aceOverWatch.utilities.getAsociatedDataArr(target,'storecombo');
                    	}
                    	
                        fieldHtml += '<select placeholder="" class="'+$.aceOverWatch.classes.fieldValue+ ((settings['readonly'] || !settings['visible'])? (' '+$.aceOverWatch.classes.hide+' ') : '') +'" aceid="'+settings.id+'" '+tooltip+placeholder+' ' + (settings['readonly'] ? 'readonly="readonly"' : '') +'></select>';

                        break;
                    case 'input':
                    case 'default':
                        fieldHtml += '<input type="text" class="'+$.aceOverWatch.classes.fieldValue+ ((settings['readonly'] || !settings['visible'])? (' '+$.aceOverWatch.classes.hide+' ') : '') +'" aceid="'+settings.id+'" '+tooltip+placeholder+' ' + (settings['readonly'] ? 'readonly="readonly"' : '') +'>';
                        break;
                }

                fieldHtml += '</div>';

                return fieldHtml;
            },

            updateAvailableComboOptions : function(settings){
                if( !settings.selectField ){
                    return;
                }
                let chipsMap = {};
                for(let idx in settings.data){
                    chipsMap[settings.data[idx].val('value')] = true;
                }
                settings.selectField.val('');

                let optionsHtml = '<option value=""></option>';
                let newOptionsCount = 1;
                for(let valueIdx in settings.selectiondata ){

                    let value = '';
                    let display = '';
                    if( $.aceOverWatch.record.isRecord(settings.selectiondata[valueIdx]) ){
                        value = settings.selectiondata[valueIdx].val(settings.valuename);
                        display = settings.selectiondata[valueIdx].val(settings.displayname);
                    }else{
                        value = settings.selectiondata[valueIdx][settings.valuename];
                        display = settings.selectiondata[valueIdx][settings.displayname]
                    }

                    if( chipsMap[value] ){
                        continue;
                    }
                    optionsHtml += '<option value="'+value+'"'+'>'+
                        display+
                        '</option>';
                    newOptionsCount++;
                }
                if( newOptionsCount == settings.selectField.find('option').length ){
                    return;
                }
                settings.selectField.html(optionsHtml);
            },

            afterInit : function(target, what){

                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                clearTimeout(settings.timerId); //making sure we kill whatever existing timer we have here

                switch( settings.inputtype ){
                    case 'combobox':
                        var selectField = containerField.find('select');
                        settings.selectField = selectField;
                        selectField.unbind('change').bind('change',function(e){
                            $.aceOverWatch.field.chips.addChip(target,$(this).find('option:selected').text(),$(this).val());
                        });
                        $.aceOverWatch.field.chips.updateAvailableComboOptions(settings);
                        break;

                    case 'input':
                    case 'default':

                        var inputField = containerField.find('input');
                        inputField.keyup(function (e) {

                            var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);

                            switch(e.keyCode){
                                case 13://enter
                                    var value = $(this).val();
                                    $(this).val('');
                                    $.aceOverWatch.field.chips.addChip(target,value);
                                    break;
                            }
                        });

                        break;
                }
                
                /*
                 * becuse the elements have been recreated, we rebind all delete buttons
                 */
                $.aceOverWatch.field.chips.bindRemoveEvent(target,-1);
            },

            addChip : function(target, chipName, value){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                if ($.aceOverWatch.utilities.isVoid(settings)) return;
                chipName = String(chipName);
                if( chipName.length == 0 ){
                    return; //don't create empty chips
                }
                if( settings.data.length >= settings.maxchipcount ){
                    return false;
                }

                if( $.isFunction(settings.customallowadd)){
                    if( !settings.customallowadd(target,chipName) ){
                        return;
                    }
                }else{
                    if( $.isFunction(window[settings.customallowadd])){
                        if( !window[settings.customallowadd](target,chipName) ){
                            return;
                        }
                    }
                }

                if( !settings.allowduplicates ){
                    //check to see if we have a duplicate
                    for(var idx = 0; idx < settings.data.length; idx++ ){
                        if( settings.data[idx].val('name') == chipName ){
                            return;//duplicate found, don't allow
                        }
                    }
                }

                //if no custom value was added..compute a new one
                if( $.aceOverWatch.utilities.isVoid(value) ) {
                    value = settings.nextnewvalue;
                    settings.nextnewvalue += settings.deltavalue;
                }

                settings.data.push($.aceOverWatch.record.create({
                    name : chipName,
                    value : value,
                }));

                let inputFieldType = '';
                switch( settings.inputtype ){
                    case 'combobox':
                        $.aceOverWatch.field.chips.updateAvailableComboOptions(settings);
                        inputFieldType = 'select';
                        break;
                    case 'input':
                    default:
                        inputFieldType = 'input';
                        break;
                }

                $($.aceOverWatch.field.chips.getChipHtml(target,settings.data.length-1)).insertBefore(containerField.find(inputFieldType));
                $.aceOverWatch.field.chips.bindRemoveEvent(target,settings.data.length-1);

                if( $.isFunction(settings.onadd)){
                    settings.onadd(target,settings.data[settings.data.length-1]);
                }else{
                    if( $.isFunction(window[settings.onadd])){
                        window[settings.onadd](target,settings.data[settings.data.length-1]);
                    }
                }


            },

            removeLastChip : function(target, index){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                if ($.aceOverWatch.utilities.isVoid(settings)) return;
                if( settings && settings.data && settings.data.length > 0 ){
                    $(target).find('.ace-chip[idx="'+(settings.data.length-1)+'"] a').trigger('click');
                }
            },

            getData : function(target){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                if ($.aceOverWatch.utilities.isVoid(settings)) return;
                return settings.data;
            },

            /**
             * array of objects, or array of records
             */
            setData : function(target,data){

                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                if ($.aceOverWatch.utilities.isVoid(settings)) return;
                settings.data = data

                if( settings.data.length > 0 && !$.aceOverWatch.record.isRecord(settings.data[0]) ){
                    var innerData = [];
                    for(var idx = 0; idx < settings.data.length; idx++){
                        innerData.push($.aceOverWatch.record.create(settings.data[idx]));
                    }
                    settings.data = innerData;
                }

                //remove all existing chips
                containerField.find('.'+$.aceOverWatch.classes.chip).remove();

                //build new chips
                var chipsHtml = '';
                for(var idx in settings.data ){
                    chipsHtml += $.aceOverWatch.field.chips.getChipHtml(target,idx);
                }

                let inputFieldType = '';
                switch( settings.inputtype ){
                    case 'combobox':
                        $.aceOverWatch.field.chips.updateAvailableComboOptions(settings);
                        inputFieldType = 'select';
                        break;
                    case 'input':
                    default:
                        inputFieldType = 'input';
                        break;
                }

                $(chipsHtml).insertBefore(containerField.find(inputFieldType));
                $.aceOverWatch.field.chips.bindRemoveEvent(target,-1);

            },

            getChipHtml : function(target, idx, explicitSettings = false){
                let settings = explicitSettings == false
                			   ? $(target).data($.aceOverWatch.settings.aceSettings)
        					   : explicitSettings

                let workingData = settings.data;

                if( !workingData ){

                    $.aceOverWatch.utilities.log({
                        msg : 'Invalid chip data..',
                        field : target,
                        settings : settings
                    },'debug');

                    return '';
                }

                if( idx < 0 || idx > (workingData.length - 1) ){
                    return '';
                }
                
                return '<span class="'+$.aceOverWatch.classes.chip+'" idx="'+idx+'">'+workingData[idx].val('name')+(settings.readonly ? '' : '<a href="#" class="'+$.aceOverWatch.classes.chipRemove+'">X</a>')+'</span>';

            },
            /**
             *bind remove to click to elements
             *index if -1, then all chips will be binded
             *otherwise, only the specific chip
             */
            bindRemoveEvent : function(target, index){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                var selector =  '.'+$.aceOverWatch.classes.chip;
                if( index != -1 ){
                    selector += '[idx="'+index+'"]';
                }
                selector += ' a';

                containerField.find(selector).unbind('click').bind('click',function(e){
                    e.preventDefault();

                    var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                    var settings = target.data($.aceOverWatch.settings.aceSettings);

                    var chip = $(this).closest('.'+$.aceOverWatch.classes.chip);

                    var chipIdx = parseInt(chip.attr('idx'));
                    //remove the item from data... and the element
                    var removedChipData = settings.data[chipIdx];
                    settings.data.splice(chipIdx,1);
                    chip.remove();

                    //now.. go through all other chip html elements, and adjust their indexes accordinly
                    for(var idx = chipIdx+1; idx <= settings.data.length; idx++){
                        target.find('[idx="'+idx+'"]').attr('idx',idx-1);//for all the rest of the elements, we decrease their idx attribute by one
                    }

                    if( $.isFunction(settings.onremove)){
                        settings.onremove(target,chipIdx,removedChipData);
                    }else{
                        if( $.isFunction(window[settings.onremove])){
                            window[settings.onremove](target,chipIdx,removedChipData);
                        }
                    }

                    switch( settings.inputtype ){
                        case 'combobox':
                            $.aceOverWatch.field.chips.updateAvailableComboOptions(settings);
                            break;
                        case 'input':
                        default:
                            break;
                    }

                    return false
                });

            },
            
            val : function(target,value){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);

            	if( value == null ){
                    return this.getData(target);
                }else{
                	this.setData(target,value);
                }
            }

        },


        /**
         * begin password object
         * MASKED input field
         * DOES NOT SUPPORT autosave currently
         */
        password : {
            create : function(target,settings){
                $.extend(true,settings, $.extend(true,{
                    value:'',

                    /*
					 * as oposed to a TEXT field, the onchange is triggered ONLY when ENTER is PRESSED
					 */
                    onchange:null,	//function, or the name of a function to be called when the value changes; onchange(target, value, event)

                    //private settings
                    timerId:null,	 //in case of autosave, this will contain the id of the timer used by the keyup event to detect changes
                }, settings ) );

                var fieldHtml = '<div class="'+$.aceOverWatch.classes.textField+'" >';

                var placeholder= '';
                if( settings['placeholder'] ){
                    placeholder = ' placeholder="'+settings['placeholder']+'" ';
                }

                var tooltip = '';
                if( settings['tooltip'] ){
                    tooltip = ' data-toggle="tooltip" data-placement="bottom" data-trigger="hover" data-original-title="'+settings['tooltip']+'" ';
                }

                fieldHtml += '<input type="password" class="'+$.aceOverWatch.classes.fieldValue+(String(settings['value']).length==0?' '+$.aceOverWatch.classes.empty:'')+'" aceid="'+settings.id+'" value="'+settings['value']+'" name="'+settings['fieldname']+'"  '+tooltip+placeholder+' ' + (settings['readonly'] ? 'readonly="readonly"' : '') +'>';
                fieldHtml += $.aceOverWatch.field.label.create(settings);
                fieldHtml += $.aceOverWatch.field.badge.create(settings);


                fieldHtml += '<span class='+$.aceOverWatch.classes.errorMsg+'></span>';
                fieldHtml += '</div>';

                return fieldHtml;
            },

            afterInit : function(target, what){

                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                var inputField = containerField.find('input');

                inputField.unbind('click').click(function(){//select all text on click
                    $(this).select();
                });

                inputField.keyup(function (e) {
                    var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                    var settings = target.data($.aceOverWatch.settings.aceSettings);

                    switch(e.keyCode){
                        case 13://enter

                            //run a callback as well, if it exists
                            if( $.isFunction(settings.onchange)){
                                settings.onchange(target,$(this).val(),e);
                            }else{
                                if( $.isFunction(window[settings.onchange])){
                                    window[settings.onchange](target,$(this).val(),e);
                                }
                            }

                            break;
                        case 27://escape
                            //do nothing in this case, for now... change if needed?
                            break;
                        default:
                            break;
                    }
                });


            },
        },//end password object

        /**
         * begin textarea field
         */
        textarea : {
            create : function(target,settings){
                $.extend(true,settings, $.extend(true,{
                    value:'',
                    rows:'5',

                    //private settings
                    timerId:null,	 //in case of autosave, this will contain the id of the timer used by the keyup event to detect changes
                    onfocusin : false,
                }, settings ) );

                var fieldHtml = '<div class="'+$.aceOverWatch.classes.textareaField+'" >';

                var tooltip = '';
                if( settings['tooltip'] ){
                    tooltip = ' data-toggle="tooltip" data-placement="bottom" data-trigger="hover" data-original-title="'+settings['tooltip']+'" ';
                }

                var placeholder= '';
                if( settings['placeholder'] ){
                    placeholder = ' placeholder="'+settings['placeholder']+'" ';
                }

                fieldHtml += '<textarea class="'+
                    $.aceOverWatch.classes.fieldValue+(String(settings['value']).length==0?' '+$.aceOverWatch.classes.empty:'')+
                    '" aceid="'+settings.id+
                    '" name="'+settings['fieldname']+
                    '"  '+tooltip+' ' + (settings['readonly'] ? 'readonly="readonly"' : '') +
                    ' rows="'+settings.rows+'" "'+placeholder+'">'
                    +settings['value']+'</textarea>';

                fieldHtml += $.aceOverWatch.field.label.create(settings);
                //fieldHtml += $.aceOverWatch.field.badge.create(settings);	//uncomment if we want badges here


                fieldHtml += '<span class='+$.aceOverWatch.classes.errorMsg+'></span>';
                fieldHtml += '</div>';

                return fieldHtml;
            },

            afterInit : function(target,what){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                containerField.find('textarea').focusin(function (e) {
                    var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                    var settings = target.data($.aceOverWatch.settings.aceSettings);

                    settings.onFocusIn = $.isFunction(settings.onfocusin)
                        ? settings.onfocusin
                        : (
                            $.isFunction(window[settings.onfocusin])
                                ? window[settings.onfocusin]
                                : false
                        );

                    if( settings.onFocusIn !== false ){
                        settings.onFocusIn(target);
                    }
                });
            }

        },//end textarea object
        
        /**
         * begin progressbar field
         */
        progressbar : {
        	create : function(target,settings){
        		$.extend(true,settings, $.extend(true,{
        			value:0,
        			withtext:true,
        			
        			onprogress : null,//user define method function(target, progressInterval)
        			progressinterval : null,
        			
        			//private settings
        			timerId:false,
        			progressIntervals : {},
        		}, settings ) );
        		
        		settings.value = parseInt(settings.value);
        		if( settings.value < 0 ){
        			settings.value = 0;
        		}else{
        			if( settings.value > 100 ){
        				settings.value = 100;
        			}
        		}
        		if( $.aceOverWatch.utilities.isVoid(settings.baseValue) ){
        			settings.baseValue = settings.value;
        		}
        		
        		if( !$.aceOverWatch.utilities.isVoid(settings.progressinterval) ){
        			settings.progressIntervals = {};
        			if( !$.isArray(settings.progressinterval) ){
        				settings.progressinterval = String(settings.progressinterval).split(',');
        			} 
        			for(let idx in settings.progressinterval){
        				settings.progressIntervals[parseInt(settings.progressinterval[idx])] = true;
        			}
        		}
        		
        		var fieldHtml = '<div class="'+[$.aceOverWatch.classes.progressbarField,$.aceOverWatch.classes.fieldValue].join(' ')+'" >\
        								<div class="'+$.aceOverWatch.classes.progressbarInner+'"></div>\
								</div>';
        		
        		return fieldHtml;
        	},
        	
        	afterInit : function(target,what){
        		var containerField = $(target);
        		var settings = containerField.data($.aceOverWatch.settings.aceSettings);
        		
        		settings.innerBar = containerField.find('.'+$.aceOverWatch.classes.progressbarInner);
        		
        		this.move(containerField);
        	},
        	
        	move : function(target){
        		var settings = target.data($.aceOverWatch.settings.aceSettings);
        		if( !settings ){
        			return;
        		}
        		
        		let hasItMoved = false;
        		if( settings.baseValue != settings.value ){
	    			if( settings.baseValue > settings.value ){
	    				settings.baseValue--;
	    			}else{
	    				settings.baseValue++;
	    			}
	    			hasItMoved = true;
        		}
    			
        		let width = settings.baseValue+'%';
    			settings.innerBar.css('width',width);
    			settings.innerBar.html(settings.withtext ? width : '');
    			
    			if( hasItMoved && settings.progressIntervals[settings.baseValue] ){
    				$.aceOverWatch.utilities.runIt(settings.onprogress,target, settings.baseValue);	
    			}
        		
        		if( settings.baseValue < 0 || settings.baseValue > 100 || settings.baseValue == settings.value ){
        		
	        		if( settings.timerId ){
		        		clearInterval(settings.timerId);
		        		settings.timerId = false;
	        		}
	        		
	        		return;
        		}
        		
        		if( !settings.timerId ){
        			settings.timerId = setInterval($.aceOverWatch.field.progressbar.move,10,target);
        		}

        	},
        	
        	val : function(target,value){
        		var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if( value == null ){
                    return settings.baseValue;
                }else{
                	settings.value = parseInt(value);
                    this.move(containerField);
                }
            } 
        	
        },//end progressbar object
        
        /**
         * begin wizard
         */
        wizard : {
        	create : function(target,settings){
        		$.extend(true,settings, $.extend(true,{
        			
    			   progressbar : {
    				 withprogressbar : true,
    				 withtext : false,
    				 displayposition: 'top',//can also be bottom
    			   },
    			   
    			   nextbuttontext : _aceL.next,
    			   nextbuttonicon : 'fal fa-forward',
    			   nextbuttonposition : 'bottom',//can also be top
    			   
    			   previousbuttontext : _aceL.prev,
    			   previousbuttonicon : 'fal fa-backward',
    			   previousbuttonposition : 'bottom',//can also be top
    			   
    			   finalbuttontext : _aceL.finalize,	
    			   finalbuttonicon : 'fal fa-check',
    			   finalbuttonposition : 'bottom',//can also be top
        			
    			   /*
    			    * each element in the steps array needs to be an object, which describe the step.
    			    * the steps will be shown in the order given 
    			    * each step will be built as a form
    			    * 
    			    * recognized properties are:
    			    * - tag	-		a tag to identify a step, or a group of steps
    			    * 				if it contains commas, the value will be treated as a comma separated string in which each term is a tag
    			    * 				can also be set directly as an array of single tags
    			    * 				default value: default
    			    * 
    			    * - visible - 	if the step is visible; if it isn't, when navigating betwen the steps they will be jumped
    			    * 				default value: true
    			    * 
    			    * 
    			    * - savedataon - Can be either of these values:
    			    * 				next, prev, both, none
    			    * 				for the next or both values, the step will save its current fields when moving forword
    			    * 				for the prev or both values, the step will save its current fields when moving backwords
    			    * 				default value: next 
    			    * 
    			    * 				ATTENTION:
    			    * 					- if the data fails to be saved, 
    			    * 					the wizard will not change its current step
    			    * 
    			    * - validate -  if true, the step form will validate it's members before the form is saved
    			    * 			    ATTENTION: the validation of the fields is performed, only IF the step performs a saving operation
    			    * 							when the step is changed; savedataon
    			    * 				default value: true
    			    * 
		    		* - customvalidation - optional method; will be called BEFORE the step form save itself
		    		* 				ATTENTION: the method is called, only IF the step performs a saving operation 
		    		* 						when the step is changed; see savedataon
    			    * 				
    			    * 				If the method returns false, the step will not be changed   
    			    * 				function(stepForm, record)
    			    * 
    			    * 
    			    * - oncustomstepchange - optional method; if present, this method will be called 
    			    * 				RIGHT BEFORE the step is about to be changed!
    			    * 
    			    * 				This allows the user to perform custom operations
    			    * 				IF the method returns false, the next step will not be loaded
    			    * 				function(wizard, record, forword) 		
    			    * 					
    			    * - template -  the id of a template which will be used to create the step
    			    * - net -		a net object, with the standard fields: remote, fid, extraparams, etc
    			    * 				if the net settings is remote, the step will send its data to the server, and will proceed to the next step only on a success message
    			    * 
    			    * - idfield - the name of the field from record which holds the identity data
    			    * 
    			    * - autoloadon - Can be either of these values 
    			    * 				next, prev, both, none
    			    * 				for the next or both values, the step will load some data from the server, right after it was displayed, when the wizard advanced at this step
    			    * 				for the prev or both values, the step will load some data from the server, right after it was displayed, when the wizard returned at this step
    			    * 				default value: none
    			    * 
    			    * 				ATTENTION:
    			    * 					- the step will perform this action, only if the net.remote field setting is set to true, and a net.fid value exists
    			    * 
    			    * 				
    			    * 
    			    * - onbeforeloadstepdata - these are optional methods,which are called, if they exist, before and after the data is loaded in a step form
    			    * - onafterloadstepdata		function(form, record)
    			    * 
    			    * 
    			    */
    			   steps : [],
    			   
    			   onwizardend : null,//user defined method, which is going to be called when the finalize button will be pressed
    			   						//function(wizard,record)
    			   
    			   overviewform : null, //if defined, it should be an existing form
    			   						//every time data is saved in a step, it will be also loaded in this form
    			   
        		}, settings ) );
        		
        		if( $.isArray(settings.steps) &&  settings.steps.length > 0 ){
                	settings.innerSteps = [];
                	for(let idx in settings.steps ){
                		settings.steps[idx].created = false;
                		settings.steps[idx].savedataonnext = false;
                		settings.steps[idx].savedataonprev = false;
                		settings.steps[idx].autoloadonnext = false;
                		settings.steps[idx].autoloadonprev = false;
                		
                		/*
                		 * making sure that the form will not have autoload true
                		 */
                		if( typeof settings.steps[idx].net != 'object' ){
                			settings.steps[idx].net = {}
                		};
                		settings.steps[idx].net.autoload = false;

                		/*
                		 * transforming the tags, from strings or array into an object
                		 * for easy tag search
                		 */
                		if( !$.aceOverWatch.utilities.isVoid(settings.steps[idx].tag) ){
                			
                			if( !$.isArray(settings.steps[idx].tag) ){
                				settings.steps[idx].tag = String(settings.steps[idx].tag).split(',');
                			}
                			
                			let tagObj = {};
                			for(let tidx in settings.steps[idx].tag){
                				tagObj[settings.steps[idx].tag[tidx]] = true;
                			}
                			
                			settings.steps[idx].tag = tagObj;
                		}
                		
                		
                		let stepData = $.extend(true, {
                					tag : {'default' : true},
                					visible : true,
                					validate : true,
                					savedataon : 'next',
                						
            						net : {
            							remote : false,
            						}
            						
        						},settings.steps[idx]);
                		
                		switch( stepData['savedataon'] ){
                		case 'next':
                			stepData['savedataonnext'] = true;
                			break;
                		case 'prev':
                			stepData['savedataonprev'] = true;
                			break;
                		case 'both':
                			stepData['savedataonnext'] = true;
                			stepData['savedataonprev'] = true;
                			break;
                		}
                		
                		switch( stepData['autoloadon'] ){
                		case 'next':
                			stepData['autoloadonnext'] = true;
                			break;
                		case 'prev':
                			stepData['autoloadonprev'] = true;
                			break;
                		case 'both':
                			stepData['autoloadonnext'] = true;
                			stepData['autoloadonprev'] = true;
                			break;
                		}
                		
                		settings.innerSteps.push($.aceOverWatch.record.create(stepData));
                	}
                	settings.steps = null;
                }
        		
        		return this.rebuildField(settings);
        		
        	},
        	
        	rebuildField : function(settings){
        		let progressBar = settings.progressbar.withprogressbar ? '<div class="'+[$.aceOverWatch.classes.wizardProgressBar,$.aceOverWatch.classes.col12].join(' ')+'"></div>' : '';
                let nextButton = '<div class="'+$.aceOverWatch.classes.wizardNext+'"></div>';
                let prevButton = '<div class="'+$.aceOverWatch.classes.wizardPrev+'"></div>';
                let finalButton = '<div class="'+$.aceOverWatch.classes.wizardFinal+'"></div>';
                
                let topElements = [];
                let bottomElements = [];
                if( settings.progressbar.displayposition == 'top' ){
                	topElements.push(progressBar);
                }else{
                	bottomElements.push(progressBar);
                }
                
                if( settings.progressbar.previousbuttonposition == 'top' ){
                	topElements.push(prevButton);
                }else{
                	bottomElements.push(prevButton);
                }
                
                if( settings.progressbar.nextbuttonposition == 'top' ){
                	topElements.push(nextButton);
                }else{
                	bottomElements.push(nextButton);
                }
                
                if( settings.progressbar.finalbuttonposition == 'top' ){
                	topElements.push(finalButton);
                }else{
                	bottomElements.push(finalButton);
                }
                
                if( $.aceOverWatch.utilities.isVoid(settings.currentRecord) ){
                	settings.currentRecord = $.aceOverWatch.record.create({});
                }
                
                settings.visibleStepsCount = 0;
                let stepContainers = [];
                settings.firstVisibleStep = -1;
                
                let lastVisibleStepFound = -1;
                
                for(let idx in settings.innerSteps ){
                	settings.innerSteps[idx].val('created',false);
                	
                	if( settings.innerSteps[idx].val('visible') ){
                		
                		settings.innerSteps[idx].val('stepNumber',settings.visibleStepsCount);//needs to be zero index
                		
                		settings.visibleStepsCount++;
                		if( settings.firstVisibleStep == -1 ){
                			settings.firstVisibleStep = parseInt(idx);
                		}
                		lastVisibleStepFound = parseInt(idx);
                		
                		stepContainers.push('<div class="'+[$.aceOverWatch.classes.wizardStep,$.aceOverWatch.classes.col12].join(' ')+'" step="'+idx+'" id="aw-'+settings.id+'-step-'+idx+'"></div>');
                	}
                }
                settings.lastVisibleStep = lastVisibleStepFound;
                
                if( $.aceOverWatch.utilities.isVoid(settings.currentStepIndex) ){
                	settings.currentStepIndex = settings.firstVisibleStep;
                }
                if( settings.currentStepIndex < settings.firstVisibleStep ){
                	settings.currentStepIndex = settings.firstVisibleStep;
                }else{
                	if( settings.currentStepIndex > lastVisibleStepFound ){
                		settings.currentStepIndex = settings.lastVisibleStepFound;
                	}else{

                		while( settings.currentStepIndex >= 0 && !settings.innerSteps[settings.currentStepIndex].val('visible') ){
                			settings.currentStepIndex--;
                		}
                	}
                }
                settings.currentStepIndex = parseInt(settings.currentStepIndex);
                
        		var fieldHtml = '<div class="'+[$.aceOverWatch.classes.wizardField,$.aceOverWatch.classes.col12].join(' ')+'" >\
	        		<div class="'+[$.aceOverWatch.classes.wizardTopBar,$.aceOverWatch.classes.col12].join(' ')+'">'
	        			+ topElements.join('') +
	        		'</div>\
	        		<div class="'+[$.aceOverWatch.classes.wizardContainer,$.aceOverWatch.classes.col12].join(' ')+'">'
	        			+ stepContainers.join('') +
	        		'</div>\
	        		<div class="'+[$.aceOverWatch.classes.wizardBottomBar,$.aceOverWatch.classes.col12].join(' ')+'">'
	        			+ bottomElements.join('') +
	        		'</div>\
        		</div>';
        		
        		return fieldHtml;
        	},
        	
        	afterInit : function(target,what){
        		var containerField = $(target);
        		var settings = containerField.data($.aceOverWatch.settings.aceSettings);
        		
        		if( settings.progressbar.withprogressbar ){
        			settings.progressBar = containerField.find('.'+$.aceOverWatch.classes.wizardProgressBar).ace('create',{
        				type : 'progressbar',
        				withtext : settings.progressbar.withtext 
        			});
        		}else{
        			settings.progressBar = false;
        		}
        		
        		settings.nextButton = containerField.find('.'+$.aceOverWatch.classes.wizardNext).ace('create',{
        				type : 'button',
        				value : settings.nextbuttontext,
        				iconcls : settings.nextbuttonicon,
        				iconposition : 'after',
        				action : function(button){ $.aceOverWatch.field.wizard.moveToNext(button.parents('.'+$.aceOverWatch.classes.wizardField).first().parent()); }
        			});
        		settings.finalButton = containerField.find('.'+$.aceOverWatch.classes.wizardFinal).ace('create',{
        			type : 'button',
        			value : settings.finalbuttontext,
        			iconcls : settings.finalbuttonicon,
        			action : function(button){ $.aceOverWatch.field.wizard.moveToNext(button.parents('.'+$.aceOverWatch.classes.wizardField).first().parent()); }
        		});
        		settings.previousButton = containerField.find('.'+$.aceOverWatch.classes.wizardPrev).ace('create',{
        			type : 'button',
        			value : settings.previousbuttontext,
        			iconcls : settings.previousbuttonicon,
        			action : function(button){ $.aceOverWatch.field.wizard.moveToPrevious(button.parents('.'+$.aceOverWatch.classes.wizardField).first().parent()); }
        		});
        		
        		settings.cardView = containerField.find('.'+$.aceOverWatch.classes.wizardContainer).ace('create',{
        			type : 'cardview',
        			contentselector : '.'+$.aceOverWatch.classes.wizardStep,
        			restricttoparent : true,
        		});
        		
        		this.moveTo(containerField, settings.currentStepIndex, false);
        	},
        	
        	reset : function(target){
        		var settings = target.data($.aceOverWatch.settings.aceSettings);
        		settings.currentRecord = $.aceOverWatch.record.create({});
        		this.moveToActual(target,settings.firstVisibleStep);
        	},
        	
        	/**
        	 * the method sets the vizibility of some steps using the data from the visibilityObj
        	 * Each property in visibilityObj represents the name of a step tag, and its value needs to be of type boolean
        	 * All steps of given tags will be set vizibile, or invizibile based on these settings 
        	 */
        	setTagVisibility : function(target, visibilityObj){
        		var settings = target.data($.aceOverWatch.settings.aceSettings);
        		
        		let atLeastOneChangeMade = false;
        		for( let idx in settings.innerSteps ){
        			
        			for( let tag in visibilityObj ){
        				if( settings.innerSteps[idx].val('tag')[tag] === true && settings.innerSteps[idx].val('visible') != visibilityObj[tag] ){
        					settings.innerSteps[idx].val('visible',visibilityObj[tag]);
        					atLeastOneChangeMade = true;
        				}
        			}
        		}
        		
        		if( !atLeastOneChangeMade ){
        			/*
        			 * nothing else to do
        			 */
        			return;
        		}
        			
    			for( let idx in settings.innerSteps ){
    				settings.innerSteps[idx].val('created',false);
    			}
    			
        		target.html(this.rebuildField(settings));
        		this.afterInit(target,{all:true});
        		
        		/*
        		 * we recompute the prevous nextRequestedStep, just in case something has changed
        		 */
        		settings.nextRequestedStep = this.getNextVisibleStepFromStep(settings,settings.previousCurrentStep);
        	},
        	
        	getNextVisibleStepFromStep : function(settings, step){
        		let nextStep = -1;
        		if( step == settings.lastVisibleStep ){
        			nextStep = settings.lastVisibleStep+1;
        		}else{
        		
	        		if( step > settings.lastVisibleStep ){
	        			nextStep = settings.firstVisibleStep;
	        		}else{
	        			for(let idx = step+1; idx <= settings.lastVisibleStep; idx++ ){
	        				if( settings.innerSteps[idx].val('visible') ){
	        					nextStep = parseInt(idx);
	        					break;
	        				}
	        			}
	        		}
	        		
        		}
        		return nextStep;
        	},
        	
        	moveToNext : function(target){
        		var settings = target.data($.aceOverWatch.settings.aceSettings);
        		this.moveTo(target, this.getNextVisibleStepFromStep(settings,settings.currentStepIndex), settings.innerSteps[settings.currentStepIndex].val('savedataonnext'));
        	},
        	
        	moveToPrevious : function(target){
        		var settings = target.data($.aceOverWatch.settings.aceSettings);
        		
        		if( settings.currentStepIndex == settings.firstVisibleStep ){
        			return;
        		}
        		
        		let nextStep = -1;
        		if( settings.currentStepIndex < settings.firstVisibleStep ){
        			nextStep = settings.lastVisibleStep;
        		}else{
        			for(let idx = settings.currentStepIndex-1; idx >= settings.firstVisibleStep; idx-- ){
        				if( settings.innerSteps[idx].val('visible') ){
        					nextStep = idx;
        					break;
        				}
        			}
        		}
        		
        		this.moveTo(target, nextStep, settings.innerSteps[settings.currentStepIndex].val('savedataonprev'));
        	},
        	
        	moveTo : function(target, nextStep, withVerification){
        		
        		var settings = target.data($.aceOverWatch.settings.aceSettings);
        		
        		let forword = nextStep > settings.previousCurrentStep ? true : false; 
        		
        		if( withVerification ){
        			settings.previousCurrentStep = settings.currentStepIndex;
        			settings.nextRequestedStep = nextStep;
        			settings.innerSteps[settings.currentStepIndex].val('form').ace('save');
        			return;
        		}else{
        			
        			let result = $.aceOverWatch.utilities.runIt(settings.innerSteps[settings.currentStepIndex].val('oncustomstepchange'), target, settings.currentRecord, forword);
            		if( $.aceOverWatch.utilities.wasItRan() && result !== true ){
            			/*
            			 * if a custom operation is performed, we'll move to the next step ONLY if the custom method returns a true  
            			 */
            			return;
            		}
        			
        		}

        		this.moveToActual(target, nextStep);
        	},
        	
        	beforeMoveToLastRequestedStep : function(target){
        		var settings = target.data($.aceOverWatch.settings.aceSettings);
        		
        		let result = $.aceOverWatch.utilities.runIt(settings.innerSteps[settings.currentStepIndex].val('oncustomstepchange'), target, settings.currentRecord, settings.nextRequestedStep > settings.previousCurrentStep ? true : false);
        		if( $.aceOverWatch.utilities.wasItRan() && result !== true ){
        			/*
        			 * if a custom operation is performed, we'll move to the next step ONLY if the custom method returns a true  
        			 */
        			return;
        		}
        		
        		this.moveToLastRequestedStep(target);
        	},
        	
        	moveToLastRequestedStep : function(target){
        		var settings = target.data($.aceOverWatch.settings.aceSettings);
        		
        		let actualNextStep = settings.nextRequestedStep; 
        		
        		if( 	settings.nextRequestedStep < settings.innerSteps.length
    				&& 	!settings.innerSteps[settings.nextRequestedStep].val('visible')
				){
        			/*
        			 * if the step has for some reason beome not visible, we recompute the next one, 
        			 * based on the current step that was at the time this one was initially computed
        			 */
        			actualNextStep = this.getNextVisibleStepFromStep(settings,settings.previousCurrentStep);
        		}
        		
        		this.moveToActual(target, actualNextStep);
        	},
        	
        	moveToActual : function(target, nextStep){
        		
        		var settings = target.data($.aceOverWatch.settings.aceSettings);
        		
        		if( settings.overviewform ){
        			settings.overviewform.ace('value',settings.currentRecord);
        		}
        		
        		nextStep = parseInt(nextStep);
        		
        		if( nextStep > settings.lastVisibleStep ){
        			$.aceOverWatch.utilities.runIt(settings.onwizardend,target,settings.currentRecord);        			
        			return;
        		}
        		
        		let forword = nextStep > settings.currentStepIndex;
        		let backwords = nextStep < settings.currentStepIndex;
        		
    			settings.currentStepIndex = parseInt(nextStep);
    			
    			let net = settings.innerSteps[settings.currentStepIndex].val('net');
        		
        		if( !settings.innerSteps[settings.currentStepIndex].val('created') ){
        			settings.innerSteps[settings.currentStepIndex].val('created',true);
        			let form = settings.cardView.find('[step="'+settings.currentStepIndex+'"]').ace('create',{
        				type : 'form',
        				ftype : 'custom',
        				template : settings.innerSteps[settings.currentStepIndex].val('template'),
                        renderto : 'aw-'+settings.id+'-step-'+settings.currentStepIndex,
                        displaysavebtn : false,
                        displaycancelbtn : false,
                        
                        validate : settings.innerSteps[settings.currentStepIndex].val('validate'),
                        
                        net : $.aceOverWatch.utilities.isVoid(net) ? {} : net, 
                        
                        onlocalsavesuccessfull : function(form, record){
                        	$.aceOverWatch.field.wizard.beforeMoveToLastRequestedStep($(form).parents('.'+$.aceOverWatch.classes.wizardField).first().parent());
                        },
                        onsavesuccessful : function(form, data){
                        	$.aceOverWatch.field.wizard.beforeMoveToLastRequestedStep($(form).parents('.'+$.aceOverWatch.classes.wizardField).first().parent());
                        },
                        
                        onbeforesave : function(form, record){
                        	var s = $(form).parents('.'+$.aceOverWatch.classes.wizardField).first().parent().data($.aceOverWatch.settings.aceSettings);
                        	let forword = settings.nextRequestedStep > settings.previousCurrentStep;
                        	let res = $.aceOverWatch.utilities.runIt(s.innerSteps[settings.currentStepIndex].val('customvalidation'),form,record,forword);
                        	
                        	if( $.aceOverWatch.utilities.wasItRan() && !res ){
                        		return false;
                        	}
                        	
                        	return true;
                        },
                        onbeforeloadrecord : settings.innerSteps[settings.currentStepIndex].val('onbeforeloadstepdata'),
                        onafterloadrecord : settings.innerSteps[settings.currentStepIndex].val('onafterloadstepdata'),
        			});
        			
        			settings.innerSteps[settings.currentStepIndex].val('form',form);
        		}
        		
        		$.aceOverWatch.field.cardview.switchTo(settings.cardView,settings.innerSteps[settings.currentStepIndex].val('stepNumber'));
        		
        		if( settings.currentStepIndex == settings.firstVisibleStep ){
        			settings.previousButton.addClass('ace-hide');
        		}else{
        			settings.previousButton.removeClass('ace-hide');
        		}
        		
        		if( settings.currentStepIndex == settings.lastVisibleStep ){
        			settings.nextButton.addClass('ace-hide');
        			settings.finalButton.removeClass('ace-hide');
        		}else{
        			settings.nextButton.removeClass('ace-hide');
        			settings.finalButton.addClass('ace-hide');
        		}
        		
        		let form = settings.innerSteps[settings.currentStepIndex].val('form'); 
        		
        		form.ace('settings',{alwayskeeprecordreference:false});
        		form.ace('value',settings.currentRecord);
        		
        		if( settings.progressBar ){
        			settings.progressBar.ace('value',(settings.innerSteps[settings.currentStepIndex].val('stepNumber')+1)*100 / settings.visibleStepsCount);
        		} 
        		
        		if( 
    				   net
    				&& !$.aceOverWatch.utilities.isVoid(net.fid)
        			&& (	
        					( forword && settings.innerSteps[settings.currentStepIndex].val('autoloadonnext') )
        				||	( backwords && settings.innerSteps[settings.currentStepIndex].val('autoloadonprev') )
    				)
				){
        			form.ace('settings',{alwayskeeprecordreference:true});
        			form.ace('load');
        		}
        	},
        	
        	val : function(target,value){
        		var containerField = $(target);
        		var settings = containerField.data($.aceOverWatch.settings.aceSettings);
        		
        		if( value == null ){
        			return settings.currentRecord;
        		}else{
        			
        			if( $.aceOverWatch.record.isRecord(value) ){
        				settigs.currentRecord = value;
        			}else{
        				$.aceOverWatch.record.create(value);
        			}
        			
        			this.moveTo(containerField,settings.currentStepIndex,false);
        		}
        	} 
        	
        },//end progressbar object

        /**
         * begin switch object
         * this field displays an on / off switch, preceeded by an optional label
         * the field may attempt to save itself if net autosave is true, and the rest of the data is specified as well
         */
        aswitch : {

            create : function(target,settings){
                $.extend(true,settings, $.extend(true,{
                    on:1,
                    off:0,
                    checked:false,
                    onchange:null,	//function, or the name of a function to be called when the value changes; onchange(target, value)
                }, settings ) );

                var fieldHtml = '<div class="'+$.aceOverWatch.classes.aswitch+'" tabindex="0">';

                var classes = $.aceOverWatch.classes.label;
                if( settings['label'] == null){
                    settings['label'] = '';
                }

                var tooltip = '';
                if( settings['tooltip'] ){
                    tooltip = ' data-toggle="tooltip" data-placement="bottom" data-trigger="hover" data-original-title="'+settings['tooltip']+'" ';
                }

                var readonlyCode = '';
                if( settings['readonly'] ){
                    readonlyCode = 'onclick="return false"';
                }

                /*
                 * making sure, that if we give a default value, equal to that of on, the switch will appear checked
                 * otherwise, the checked status will be given by the current checked status
                 */
                if( settings.value !== undefined ){
                    if( settings.value == settings.on || parseInt(settings.value) == parseInt(settings.on) ){
                        settings.checked = true;
                    }else{
                        settings.checked = false;
                    }
                }

                fieldHtml += '<label class="'+classes+'" '+tooltip+'>'+$.aceOverWatch.field.label.create(settings)+
                    '<input class="'+$.aceOverWatch.classes.fieldValue+'" aceid="'+settings.id+'" value="" type="checkbox" '+(settings.checked?'checked':'')+' name="'+settings['fieldname']+'" '+tooltip+' ' + readonlyCode +' ><span></span></label>';

                fieldHtml += '<span class='+$.aceOverWatch.classes.errorMsg+'></span>';
                fieldHtml += '</div>';

                return fieldHtml;
            },

            afterInit : function(target, what){

                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                clearTimeout(settings.timerId); //making sure we kill whatever existing timer we have here

                //if( settings.net.autosave == true ){

                containerField.find('input').change(function (e) {
                    let el = $(this);
                    var target = el.closest('.'+$.aceOverWatch.classes.containerField);
                    var settings = target.data($.aceOverWatch.settings.aceSettings);

                    settings.checked = el.prop('checked');

                    if( settings.checked ){
                    	settings.value = this.on;
                    }else{
                    	settings.value = this.off;
                    }

                    if( settings.net.autosave == true ){

                        //	.. we have autosave.. so....
                        //each time something is being typed, it will trigger a timer of 2 seconds(?).. if at the end of the timer, the value is different than the last value saved... the field will try to save itself

                        clearTimeout(settings.timerId);
                        settings.timerId = setTimeout(function(){
                            $.aceOverWatch.field.save(target,true);
                        },2000);
                    }

                    if( $.isFunction(settings.onchange)){
                        settings.onchange(target,$.aceOverWatch.field.aswitch.val(target));
                    }else{
                        if( $.isFunction(window[settings.onchange])){
                            window[settings.onchange](target,$.aceOverWatch.field.aswitch.val(target));
                        }
                    }
                });
                //}
            },

            val : function(target,value){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);

                var targetElement = $(target).find('.'+$.aceOverWatch.classes.fieldValue);
                if( targetElement.length == 0 ){
                    return null;
                }

                if( value == null ){
                    return targetElement.prop('checked') ? settings.on: settings.off;
                }else{
                	settings.value = value;//saving the raw value
                    return targetElement.prop('checked',( value == settings.on ));
                }
            }
        },//end switch object

        /**
         * begin checkbox object
         * this field displays an on / off switch, preceeded by an optional label
         * the field may attempt to save itself if net autosave is true, and the rest of the data is specified as well
         */
        checkbox : {

            create : function(target,settings){
                $.extend(true,settings, $.extend(true,{
                    on:1,
                    off:0,
                    checked:false,
                    onchange:null,	//function, or the name of a function to be called when the value changes; onchange(target, value)
                }, settings ) );

                var fieldHtml = '<div class="'+$.aceOverWatch.classes.check+'" tabindex="0">';

                var classes = $.aceOverWatch.classes.label;
                if( settings['label'] == null){
                    settings['label'] = '';
                }

                settings['label'] = $.aceOverWatch.utilities.buildLabelTxt(settings, settings['label']);

                var tooltip = '';
                if( settings['tooltip'] ){
                    tooltip = ' data-toggle="tooltip" data-placement="bottom" data-trigger="hover" data-original-title="'+settings['tooltip']+'" ';
                }

                var readonlyCode = '';
                if( settings['readonly'] ){
                    readonlyCode = 'onclick="return false"';
                }

                /*
                 *
                 * making sure, that if we give a default value, equal to that of on, the switch will appear checked
                 * otherwise, the checked status will be given by the current checked status
                 */
                if( settings.value !== undefined ){
	                if( settings.value == settings.on || parseInt(settings.value) == parseInt(settings.on) ){
	                    settings.checked = true;
	                }else{
	                	settings.checked = false;
	                }
                }

                fieldHtml += '<label class="'+classes+'" '+tooltip+'><input class="'+$.aceOverWatch.classes.fieldValue+'" aceid="'+settings.id+'" value="" '+(settings.checked?'checked':'')+' type="checkbox" name="'+settings['fieldname']+'" '+tooltip+' ' + readonlyCode +' ><span>'+settings['label']+'</span></label>';
                fieldHtml += '<span class='+$.aceOverWatch.classes.errorMsg+'></span>';
                fieldHtml += '</div>';

                return fieldHtml;
            },

            afterInit : function(target, what){

                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                clearTimeout(settings.timerId); //making sure we kill whatever existing timer we have here


                containerField.find('input').change(function (e) {
                    let el = $(this);
                    var target = el.closest('.'+$.aceOverWatch.classes.containerField);
                    var settings = target.data($.aceOverWatch.settings.aceSettings);

                    settings.checked = el.prop('checked');
                    if( settings.checked ){
                    	settings.value = this.on;
                    }else{
                    	settings.value = this.off;
                    }

                    if( settings.net.autosave == true ){

                        //ok.. we have autosave.. so....
                        //each time something is being typed, it will trigger a timer of 2 seconds(?).. if at the end of the timer, the value is different than the last value saved... the field will try to save itself
                        clearTimeout(settings.timerId);
                        settings.timerId = setTimeout(function(){
                            $.aceOverWatch.field.save(target,true);
                        },2000);
                    }
                    if( $.isFunction(settings.onchange)){
                        settings.onchange(target,$.aceOverWatch.field.checkbox.val(target));
                    }else{
                        if( $.isFunction(window[settings.onchange])){
                            window[settings.onchange](target,$.aceOverWatch.field.checkbox.val(target));
                        }
                    }

                });
            },

            val : function(target,value){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);

                var targetElement = $(target).find('.'+$.aceOverWatch.classes.fieldValue);
                if( targetElement.length == 0 ){
                    return null;
                }

                if( value == null ){
                    return targetElement.prop('checked') ? settings.on: settings.off;
                }else{
                	settings.value = value;//saving the raw value
                    return targetElement.prop('checked',(( value == settings.on ) || (value === true)|| (value === "true")));
                }
            }
        },//end checkbox object

        /**
         * begin combobox object
         * this field displays a not editable combobox based on the html SELECT tag
         * the field may attempt to save itself if net autosave is true, and the rest of the data is specified as well
         */
        combobox : {

            create : function(target,settings){
                $.extend(true,settings, $.extend(true,{
                    value:'',
                    data:[],
                    valuename:'id',
                    displayname:'name',
                    onchange:null,		//a function, or the name of a function in window which is going to be called when the value changes
                    // onchange(target, value, record)
                    renderer:null,	//function, or the name of a function to modify the set value / value, record
                }, settings ) );
                var fieldHtml = '<div class="'+$.aceOverWatch.classes.comboField+'" >';

                var tooltip = '';
                if( settings['tooltip'] ){
                    tooltip = ' data-toggle="tooltip" data-placement="bottom" data-trigger="hover" data-original-title="'+settings['tooltip']+'" ';
                }
                var selectOptionsHtml = "", hasOptions = false;

                if( settings.data.length == 0 ){
                    settings.data = $.aceOverWatch.utilities.getAsociatedDataArr(target);
                }

                var containerField = $(target);
                var alreadySelectedValue = containerField.ace('value');
                //convert data to inner data format
                if( settings.data.length > 0 && !$.aceOverWatch.record.isRecord(settings.data[0]) ){
                    var innerData = [];
                    for(var idx = 0; idx < settings.data.length; idx++){
                        innerData.push($.aceOverWatch.record.create(settings.data[idx]));
                    }
                    settings.data = innerData;
                }
                
                if( $.isFunction(settings.renderer)){
                    settings.actualRenderer = settings.renderer;
                }else{
                    if( $.isFunction(window[settings.renderer])){
                        settings.actualRenderer = window[settings.renderer];
                    }else{
                        settings.actualRenderer = $.aceOverWatch.field.combobox.renderer;
                    }
                }

                if( settings.data != null && settings.data instanceof Array ){

                    for(var valueIdx in settings.data ){
                        selectOptionsHtml += '<option value="'+settings.data[valueIdx].val(settings['valuename'])+'"'+((settings.data[valueIdx].val(settings['valuename'])==settings.value)?' selected':'')+'>'+
                            settings.actualRenderer(settings.data[valueIdx].val(settings['displayname']), settings.data[valueIdx])+
                            '</option>';
                    }
                }
                settings.lastValueSet = settings.value;

                fieldHtml += '<select class="'+$.aceOverWatch.classes.fieldValue+(selectOptionsHtml.length==0?' '+$.aceOverWatch.classes.empty:'')+'" aceid="'+settings.id+'" value="" type="select" name="'+settings['fieldname']+'" '+tooltip+' ' + (settings['readonly'] ? 'disabled="disabled"' : '') +' >';
                fieldHtml += selectOptionsHtml;
                fieldHtml += '</select>';
                fieldHtml += $.aceOverWatch.field.label.create(settings);
                fieldHtml += $.aceOverWatch.field.badge.create(settings);
                fieldHtml += '<span class='+$.aceOverWatch.classes.errorMsg+'></span>';
                fieldHtml += '</div>';

                return fieldHtml;
            },

            renderer:function(value, record){
                return value;
            },

            setData : function(target,dataArr,totalExpectedData,addToExisting){
                var targetField = $(target);
                var settings = targetField.data($.aceOverWatch.settings.aceSettings);
                if( !settings ){
                    return;
                }
                //settings.loading = false;

                var targetElement = targetField.find('.'+$.aceOverWatch.classes.fieldValue);

                targetElement.empty();

                var foundLastValueSet = false, isEmpty=true;

                if( addToExisting !== true ){
                    settings.data = [];
                }
                for(var rowIdx in dataArr){

                    if( !$.aceOverWatch.record.isRecord(dataArr[rowIdx]) ){
                        dataArr[rowIdx] = $.aceOverWatch.record.create(dataArr[rowIdx]);
                    }

                    settings.data.push(dataArr[rowIdx]);

                }

                for(var rowIdx in settings.data){
                    isEmpty=false;

                    //var option = $('<option></option>').attr("value", settings.data[rowIdx].val(settings['valuename'])).text(settings.actualRenderer(settings.data[rowIdx].val(settings['displayname']), settings.data[rowIdx]));
                    var option = $('<option>'+settings.actualRenderer(settings.data[rowIdx].val(settings['displayname']), settings.data[rowIdx])+'</option>').attr("value", settings.data[rowIdx].val(settings['valuename']));

                    if( settings.lastValueSet == settings.data[rowIdx].val(settings['valuename']) ){
                        foundLastValueSet = true;
                        option.attr("selected", 'selected');
                    }

                    targetElement.append(option);
                }

                //used to signal a empty value in the field - so we can style the label
                if (isEmpty) {
                    targetElement.addClass($.aceOverWatch.classes.empty);
                }
                else {
                    targetElement.removeClass($.aceOverWatch.classes.empty);
                }

                //set the default value
                if( foundLastValueSet ){
                    targetElement.val(settings.lastValueSet).triggerHandler('change');
                }else{//just trigger the change
                    targetElement.triggerHandler('change');
                }
            },

            //should return the current records
            getData : function(target){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);
                return settings.data;
            },

            checkValueExists : function(target,value){
                return $(target).find('option[value="'+value+'"]').length == 1;
            },

            getFirstValue : function(target){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);
                if( !settings || !settings.data || settings.data.length == 0 ){
                    return '';
                }

                return settings.data[0].val(settings.valuename);
            },

            /**
             * should retrieve the current record
             * if onlyText is true, only the value of the current displayfield will be return, and not the entire record
             */
            getRecord : function(target, onlyText = false){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                if( !settings ){
                    return null;
                }
                var value = containerField.ace('value');
                for(var idx = 0; idx < settings.data.length; idx++){
                    if( settings.data[idx].val(settings.valuename) == value ){
                        return onlyText ? settings.data[idx].val(settings.displayname) : settings.data[idx];
                    }
                }
                return null;
            },

            /**
             * this method attempts to select the item, which is found in the select list
             * from the current position, with an offeset of the value specified
             * ex:
             * 		set offset to 1, to attemtp to select the next one available
             * 		set offset to -1, to attempt to select the previous one
             * 		it works, only if there is data loaded
             * 		it will not go out of bonds ( it will circle around )
             */
            selectIndexOffset : function(target,offset){
                if( isNaN(offset) || offset == 0 ){
                    return;
                }

                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                if( !settings.data || settings.data.length ==  0 ){
                    return false;
                }

                let selectEl = containerField.find('select');
                let selectedIndex = parseInt(selectEl.prop('selectedIndex'));
                if( isNaN(selectedIndex) ){
                    if( offset >  0 ){
                        selectedIndex = settings.data.length;
                    }else{
                        selectedIndex = 0;
                    }
                }

                if( offset <  0 ){
                    /*
                     * mirror
                     */
                    selectedIndex = settings.data.length - selectedIndex - 1;
                }

                let finalIndex = (selectedIndex + Math.abs(offset)) % settings.data.length;
                if( offset <  0 ){
                    finalIndex = settings.data.length - finalIndex - 1;
                }

                containerField.ace('value',settings.data[finalIndex].val(settings.valuename));
            },

            afterInit : function(target, what){

                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                clearTimeout(settings.timerId); //making sure we kill whatever existing timer we have here

                containerField.find('select').change(function (e) {
                    var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                    var settings = target.data($.aceOverWatch.settings.aceSettings);

                    if( settings.net.autosave == true ){

                        //ok.. we have autosave.. so....
                        //each time something is being typed, it will trigger a timer of 2 seconds(?).. if at the end of the timer, the value is different than the last value saved... the field will try to save itself

                        clearTimeout(settings.timerId);
                        settings.timerId = setTimeout(function(){
                            $.aceOverWatch.field.save(target,true);
                        },2000);
                    }

                    settings.value = $(this).val();//update the value on change...
                    /*
					 * in some cases, the value might be set in form, and at this time the combo box is not exactly set.. soooooo if there is a lastvalueset, but the value is void.. the override the value with the last value set
					 */
                    if( $.aceOverWatch.utilities.isVoid(settings.value) ){
                        settings.value = settings.lastValueSet;
                    }else{
                        settings.lastValueSet = settings.value;
                    }

                    //run a callback as well, if it exists
                    if( $.isFunction(settings.onchange)){
                        settings.onchange(target,settings.value,settings.data[$(this).prop('selectedIndex')]);
                    }else{
                        if( $.isFunction(window[settings.onchange])){
                            window[settings.onchange](target,settings.value,settings.data[$(this).prop('selectedIndex')]);
                        }
                    }

                });
            },

        },//end combobox object

        /**
         * begin radiogroup object
         * this field displays a radiobutton group
         * the field may attempt to save itself if net autosave is true, and the rest of the data is specified as well
         */
        radiogroup : {

            create : function(target,settings){
                $.extend(true,settings, $.extend(true,{
                    data:[],		//this is static data..^^
                    displayname:'name',
                    valuename:'id',
                    onchange:null, //function or name of function to call when radiogroup has changed

                    allowedit:false,
                    allowdelete:false,
                    allowadd:false,

                    showsaveonadd:true,		//on the add form, display the save button if true
                    showcancelonadd:true,	//on the add form, display the cancel button if true

                    addentryposition:'last',// values: first, or last; - if allowadd, addEntryPosition displays where the add entry will be positioned
                    valueaddcode:'_#$%_',//a code for the add new value
                    customaddtext:_aceL.add,

                    lastValueEdited:'',

                    idfield:'',

                    template:'',//the id of a div which contains the template for the editing form

                    renderer:null, //a function, or the name of a global function which returns a formated text if present to display a custom data for the radiogroup renderer(index, innerDataRecordsList)

                    onsavesuccessful : null,//function, or the name of a global function to be called after a save was successfull: onsavesuccessful(target, record, wasAnEdit)
                                            // wasAnEdit - true if it was an edit of an existing entry; false if a new one was added

                    customformshow : null,//function, or the name of a function to be called when the editing form is displayed: customformshow(form)

                    // - private members
                    innerData : [],	// - this is an array of records

                    addstaticdatatofront : false,

                    /*
					 * if no radio button is set, and this is SET, we'll return this as the field's value
					 */
                    defaultunsetvalue:undefined,

                }, settings ) );

                var fieldHtml = '<div class="'+$.aceOverWatch.classes.radio+'" >';
                fieldHtml += '<span class='+$.aceOverWatch.classes.errorMsg+'></span>';

                var classes = $.aceOverWatch.classes.label;
                settings.labelalign = 'top';//always use top alignament with this one
                fieldHtml += $.aceOverWatch.field.label.create(settings);
                //fieldHtml += $.aceOverWatch.field.badge.create(settings);//uncomment if we want badges on this one..

                /*	//not sure where to place the tooltip?
				var tooltip = '';
				if( settings['tooltip'] ){
					tooltip = ' data-toggle="tooltip" data-placement="bottom" data-trigger="hover" data-original-title="'+settings['tooltip']+'" ';
				}*/

                if( settings.data.length == 0 ){
                    settings.data = $.aceOverWatch.utilities.getAsociatedDataArr(target);
                }

                fieldHtml += $.aceOverWatch.field.radiogroup.buildRadioGroup(settings, true);

                fieldHtml += '</div>';

                return fieldHtml;
            },


            /**
             * internal function to rebuild the html of the radiogroup
             * - rebuildInnerData - true if the inner data should be rebuilt (based on the static data:  data)
             * - extraData - array of extra data to be added to the inner data
             *****/
            buildRadioGroup:function(settings, rebuildInnerData, extraData){

                if( !$.aceOverWatch.utilities.isVoid(settings.form) ){
                    settings.form.detach(); //otherwise strange things happen..
                }

                if( rebuildInnerData ){
                    settings.innerData = [];
                }

                if( rebuildInnerData && settings.addstaticdatatofront ){
                    if( settings.data.length > 0 && !$.aceOverWatch.record.isRecord(settings.data[0]) ){
                        for(var idx = 0; idx < settings.data.length; idx++){
                            settings.innerData.push($.aceOverWatch.record.create(settings.data[idx]));
                        }
                    }else{
                        for(var idx = 0; idx < settings.data.length; idx++){
                            settings.innerData.push(settings.data[idx]);
                        }
                    }
                }

                //if we have extra data... add it to the inner data
                if( extraData instanceof Array ){

                    if( extraData.length > 0 && !$.aceOverWatch.record.isRecord(extraData[0]) ){
                        for(var idx = 0; idx < extraData.length; idx++){
                            settings.innerData.push($.aceOverWatch.record.create(extraData[idx]));
                        }
                    }else{
                        for(var idx = 0; idx < extraData.length; idx++){
                            settings.innerData.push(extraData[idx]);
                        }
                    }
                }

                if( rebuildInnerData && !settings.addstaticdatatofront ){
                    if( settings.data.length > 0 && !$.aceOverWatch.record.isRecord(settings.data[0]) ){
                        for(var idx = 0; idx < settings.data.length; idx++){
                            settings.innerData.push($.aceOverWatch.record.create(settings.data[idx]));
                        }
                    }else{
                        for(var idx = 0; idx < settings.data.length; idx++){
                            settings.innerData.push(settings.data[idx]);
                        }
                    }
                }

                //now.... we'll build the radiobuttons html
                var radios = [];
                for( var idx in settings.innerData ){

                    var displayText = settings.innerData[idx].val(settings.displayname);

                    if( $.isFunction(settings.renderer) ){
                        displayText = settings.renderer(idx, settings.innerData);
                    }else{
                        if($.isFunction(window[settings.renderer])){
                            displayText = window[settings.renderer](idx, settings.innerData);
                        }
                    }

                    settings.innerData[idx].val('radioActualText',displayText);

                    var icons = [];

                    if(
                        (											//the case when the static memebers are in front
                            idx >= settings.data.length
                            && settings.addstaticdatatofront
                        )
                        ||
                        (											//the case when the static memebers are at the back
                            idx < (settings.innerData.length - settings.data.length )
                            && !settings.addstaticdatatofront
                        )

                    ){//we are doing this becaue the deleting and editing are disabled for STATIC radio members

                        if( settings.allowedit ){
                            icons.push('<a action="edit" idx="'+idx+'" ><i class="'+$.aceOverWatch.classes.editIcon2+'"></i></a>')
                        }

                        if( settings.allowdelete ){
                            icons.push('<a action="delete" idx="'+idx+'" ><i class="'+$.aceOverWatch.classes.trashIcon+'"></i></a>')
                        }
                    }

                    var name=settings.fieldname;
                    if( !settings.fieldname ){
                        name=settings.id
                    }
                    radios.push('<label idx="'+idx+'" class="'+$.aceOverWatch.classes.label+'"><input type="radio" name="'+name+'" value="'+settings.innerData[idx].val(settings.valuename)+'" ' + (settings['readonly'] ? 'disabled="disabled"' : '') +' ><span>'+settings.innerData[idx].val('radioActualText')+'</span>'+icons.join('')+'</label>');
                }

                if( settings.allowadd ){

                    var name=settings.fieldname;
                    if( !settings.fieldname ){
                        name=settings.id
                    }

                    var addElement = '<label class="'+$.aceOverWatch.classes.label+'" idx="new"><input type="radio" name="'+name+'" value="'+settings.valueaddcode+'" ' + (settings['readonly'] ? 'readonly="readonly"' : '') +' ><span>'+settings.customaddtext+'</span></label>';
                    if(settings.addentryposition == 'first' ){
                        radio.splice(0,0,addElement);
                    }else{
                        if(settings.addentryposition == 'last' ){
                            radios.push(addElement);
                        }else{
                            if(settings.addentryposition == 'beforestatic' ){
                                radios.splice(settings.innerData.length-settings.data.length,0,addElement);
                            }
                        }

                    }
                }

                return radios.join('');
            },

            val : function(target,value){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);

                var name=settings.fieldname;
                if( !settings.fieldname ){
                    name=settings.id
                }

                if( value == null ){
                    settings.value = $(target).find('input[name="'+name+'"]:checked').val();

                    if(
                        settings.value === undefined
                        &&	settings.defaultunsetvalue !== undefined
                    ){
                        return settings.defaultunsetvalue;
                    }else{
                        return settings.value;
                    }

                }else{
                    settings.value = value;

                    $(target).find('input[name="'+name+'"]').prop('checked',false);


                    if( settings.triggeronchange === true ){
                        var r = settings.innerData[$(target).find('input[name="'+name+'"][value="'+value+'"]').closest('label').attr('idx')];
                        if( r ){
                            /*
							 * we trigger the change on this only if we have a record..
							 */
                            if( $.isFunction(settings.onchange)){
                                settings.onchange(target,value,r);
                            }else{
                                if( $.isFunction(window[settings.onchange])){
                                    window[settings.onchange](target,value,r);
                                }
                            }
                        }
                    }

                    return $(target).find('input[name="'+name+'"][value="'+value+'"]').prop('checked',true);
                }
            },

            setData : function(target, dataArr, totalExpectedData, rebuildAll ){

                if( $.aceOverWatch.utilities.isVoid(rebuildAll) ){
                    rebuildAll = true;
                }

                var targetField = $(target);
                var settings = targetField.data($.aceOverWatch.settings.aceSettings);
                if( !settings ){
                    return;
                }

                fieldHtml = $.aceOverWatch.field.radiogroup.buildRadioGroup(settings, rebuildAll, dataArr);

                targetField.find('label').remove();
                targetField.find('span').after(fieldHtml);

                $.aceOverWatch.field.radiogroup.afterInit(target);
            },

            afterInit : function(target, what){

                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                clearTimeout(settings.timerId); //making sure we kill whatever existing timer we have here

                //ok.. we have autosave.. so....
                //each time something is being typed, it will trigger a timer of 2 seconds(?).. if at the end of the timer, the value is different than the last value saved... the field will try to save itself

                containerField.find('input[type=radio]').unbind('change').change(function (e) {

                    var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                    var settings = target.data($.aceOverWatch.settings.aceSettings);

                    var value = $(this).val();

                    //if the value we changed to, is different than the value for which the edit form was last displayed.. detach the form if it exists..
                    if( settings.lastValueEdited != value && !$.aceOverWatch.utilities.isVoid(settings.form) ){
                        settings.form.detach();
                    }

                    //displaying the edit form to add a new row..
                    if( settings.allowadd && settings.valueaddcode == value ){
                        $.aceOverWatch.field.radiogroup.add(target);
                        return;
                    }

                    if( settings.net.autosave == true ){

                        //ok.. we have autosave.. so....
                        //each time something is being typed, it will trigger a timer of 2 seconds(?).. if at the end of the timer, the value is different than the last value saved... the field will try to save itself

                        clearTimeout(settings.timerId);
                        settings.timerId = setTimeout(function(){
                            $.aceOverWatch.field.save(target,true);
                        },2000);
                    }


                    var r = settings.innerData[$(this).closest('label').attr('idx')];
                    
                    settings.value = value;

                    if( $.isFunction(settings.onchange)){
                        settings.onchange(target,value,r);
                    }else{
                        if( $.isFunction(window[settings.onchange])){
                            window[settings.onchange](target,value,r);
                        }
                    }

                });

                if( settings.allowedit ){
                    containerField.find('a[action="edit"]').unbind('click').click(function(e){
                        e.preventDefault();

                        var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                        $.aceOverWatch.field.radiogroup.edit(target, $(this).attr('idx'));

                        return false;
                    });

                    containerField.find('a[action="delete"]').unbind('click').click(function(e){
                        e.preventDefault();

                        var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                        $.aceOverWatch.field.radiogroup.delete_(target, $(this).attr('idx'));
                        return false;
                    });
                }

                if( settings.value ){
                    $.aceOverWatch.field.radiogroup.val(target,settings.value);
                }
            },

            /**
             * should retrieve the current record..
             */
            getRecord : function(target){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                if( !settings ){
                    return null;
                }
                var value = containerField.ace('value');
                for(var idx = 0; idx < settings.innerData.length; idx++){
                    if( settings.innerData[idx].val(settings.valuename) == value ){
                        return settings.innerData[idx];
                    }
                }
                return null;
            },

            edit : function(target, index){

                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                settings.lastValueEdited = settings.innerData[index].val(settings.valuename);
                $.aceOverWatch.field.radiogroup.val(target,settings.lastValueEdited);//making sure the clicked row is selected

                $.aceOverWatch.field.radiogroup.buildEditForm(target);

                //ok... we have the form.. now.. lets display it!
                settings.form.detach();//making sure the form is detached... from its former place
                ///now.. re-attach it... and make it visible
                containerField.find('label[idx="'+index+'"]').after(settings.form);

                $.aceOverWatch.field.form.loadRecord(settings.form,settings.innerData[index]);

                settings.editingExisting = true;

                if( !settings.showsaveonadd ){
                    settings.formSaveButton.removeClass($.aceOverWatch.classes.hide);
                }
                if( !settings.showcancelonadd ){
                    settings.formCancelButton.removeClass($.aceOverWatch.classes.hide);
                }

                settings.form.ace('show');
            },

            //edits the current selected value
            editCurrent : function(target){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                //TODO...
                //$.aceOverWatch.field.radiogroup.edit(target, $(this).attr('idx'));
            },

            add : function(target){

                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                settings.lastValueEdited = settings.valueaddcode;
                $.aceOverWatch.field.radiogroup.val(target,settings.lastValueEdited);//making sure the clicked row is selected

                $.aceOverWatch.field.radiogroup.buildEditForm(target);

                //ok... we have the form.. now.. lets display it!
                settings.form.detach();//making sure the form is detached...
                ///now.. re-attach it... and make it visible
                containerField.find('label[idx="new"]').after(settings.form);

                var params = {};
                params[settings.idfield] = -1;

                var newRecord = $.aceOverWatch.record.create(params);
                $.aceOverWatch.field.form.loadRecord(settings.form,newRecord);

                settings.editingExisting = false;

                if( !settings.showsaveonadd ){
                    settings.formSaveButton.addClass($.aceOverWatch.classes.hide);
                }
                if( !settings.showcancelonadd ){
                    settings.formCancelButton.addClass($.aceOverWatch.classes.hide);
                }

                settings.form.ace('show');
            },

            delete_ : function(target, index){

                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                var question = _aceL.are_you_sure_delete_spec.replace("%s",settings.innerData[index].val('radioActualText'));

                $.aceOverWatch.prompt.show(question,function() {

                    $.aceOverWatch.field.radiogroup.val(target,settings.innerData[index].val(settings.valuename));//making sure the clicked row is selected

                    settings.deletetingIndex = index;
                    if( settings.net.remote == true ){
                        var deleteData = {
                            rows:[{}]
                        };
                        deleteData.rows[0][settings.idfield] = settings.innerData[index].val(settings.idfield);
                        $.aceOverWatch.net.delete_(target,deleteData);
                    }else{
                        $.aceOverWatch.field.radiogroup.deleteSuccessful(target);
                    }

                },{type:'question'});

            },

            /**
             * data - data from the wire, if it exists..
             */
            deleteSuccessful : function(target, data, retData){

                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                settings.innerData.splice(settings.deletetingIndex, 1);
                $.aceOverWatch.field.radiogroup.setData(target,[],0,false);//the record should have changed on the form
            },

            /**
             * build edit form
             */
            buildEditForm : function(target ){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                //if we don't have a form, create it!
                //render it to a on the fly created div, and we'll move that one wherever we need it (bellow each editable radio row

                if( !$.aceOverWatch.utilities.isVoid(settings.form) ){
                    return;
                }

                var formSettings = {
                    type:'form',
                    ftype:'custom',
                    template:settings.template,
                    renderto:settings.id+'-form',
                    autoloadfieldsonshow:false,
                    oninit:function(form){
                        //generating all ace fields with auto gen from the form
                        $(form).find('.ace-auto-gen').ace('create');
                    },
                    customshow : function(form, renderTo){
                        var f = $(form);

                        var target = f.closest('.'+$.aceOverWatch.classes.radio).parent();
                        var settings = target.data($.aceOverWatch.settings.aceSettings);

                        if( $.isFunction(settings.customformshow)){
                            settings.customformshow(target);
                        }else{
                            if( $.isFunction(window[settings.customformshow])){
                                window[settings.customformshow](target);
                            }
                        }

                        //needed, otherwise it will become a popup..
                        f.removeClass($.aceOverWatch.classes.hide);
                    },
                    customhide : function(form){
                        /*settings.form.addClass($.aceOverWatch.classes.hide);

						if( !settings.editingExisting ){
							//if we were on an ADD.. then un-select the option
							$.aceOverWatch.field.radiogroup.val(target,'');
						}*/

                        var f = $(form);
                        var target = f.closest('.'+$.aceOverWatch.classes.radio).parent();
                        var settings = target.data($.aceOverWatch.settings.aceSettings);

                        settings.form.addClass($.aceOverWatch.classes.hide);

                        if( !settings.editingExisting ){
                            //if we were on an ADD.. then un-select the option
                            $.aceOverWatch.field.radiogroup.val(target,'');
                        }

                    },
                    onshow:function(form){
                        //also.. load the countries as well..
                    },
                    onsavesuccessful:function(form, data){

                        var f = $(form);
                        var target = f.closest('.'+$.aceOverWatch.classes.radio).parent();
                        var settings = target.data($.aceOverWatch.settings.aceSettings);

                        settings.form.addClass($.aceOverWatch.classes.hide);

                        var record = settings.form.ace('value');
                        if( settings.editingExisting ){//it was an edit..
                            $.aceOverWatch.field.radiogroup.setData(target,[],0,false);//the record should have changed on the form
                        }else{
                            //it was a new operation... so..
                            $.aceOverWatch.field.radiogroup.setData(target,[record],0,false);
                        }

                        $.aceOverWatch.field.radiogroup.val(target,record.val(settings.idfield));///selecting the last element we operated

                        if( $.isFunction(settings.onsavesuccessful) ){
                            settings.onsavesuccessful(target,record,settings.editingExisting);
                        }else{
                            if($.isFunction(window[settings.onsavesuccessful])){
                                window[settings.onsavesuccessful](target,record,settings.editingExisting);
                            }
                        }
                    },
                    net:settings.net,
                    idfield : settings.idfield,
                };

                settings.form = $('<div class="ace-col-12" id="'+formSettings.renderto+'"></div>');
                settings.form.ace('create',formSettings);

                if( !settings.showsaveonadd ){
                    settings.formSaveButton = settings.form.find('.'+$.aceOverWatch.classes.formFooter+' button[action="save"]');
                }
                if( !settings.showcancelonadd ){
                    settings.formCancelButton = settings.form.find('.'+$.aceOverWatch.classes.formFooter+' button[action="cancel"]');
                }

            },

            /**
             * the function needs to return FALSE if a save hasn't been triggered
             */
            save : function(target){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if( $.aceOverWatch.utilities.isVoid(settings.form) ){
                    return false;
                }

                if(settings.form.is(':visible')){
                    return settings.form.ace('save');
                }
                return false;
            }
        },//end radiogroup object

        /**
         * begin datepicker object
         * supports autosave
         * TODO: add support for readonly
         */
        datepicker : {

            create : function(target,settings){
                $.extend(true,settings, $.extend(true,{
                    value:'',
                    format:'yy-mm-dd',
                    onclose:null,	//user defined functions to be called on close and on select events
                    onchange:null,
                    onselect:null,
                }, settings ) );

                var fieldHtml = '<div class="'+$.aceOverWatch.classes.datepickerField+'" >';

                var tooltip = '';
                if( settings['tooltip'] ){
                    tooltip = ' data-toggle="tooltip" data-placement="bottom" data-trigger="hover" data-original-title="'+settings['tooltip']+'" ';
                }

                fieldHtml += '<input class="'+$.aceOverWatch.classes.fieldValue+(String(settings['value']).length==0?' '+$.aceOverWatch.classes.empty:'')+'" aceid="'+settings.id+'" value="'+settings['value']+'" '+tooltip+'>';
                fieldHtml += $.aceOverWatch.field.label.create(settings);
                fieldHtml += $.aceOverWatch.field.badge.create(settings);
                fieldHtml += '<span class='+$.aceOverWatch.classes.errorMsg+'></span>';
                fieldHtml += '</div>';

                return fieldHtml;
            },

            afterInit : function(target, what){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                clearTimeout(settings.timerId); //making sure we kill whatever existing timer we have here

                if( what.all ){
                    var inputEl = containerField.find('.'+$.aceOverWatch.classes.fieldValue);
                    inputEl.datepicker('destroy').removeAttr("id");//this needs to be done so that the item works correctly when cloned!
                    containerField.find('button').remove();

                    var options = {
                        onClose:function(){

                            var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                            var settings = target.data($.aceOverWatch.settings.aceSettings);

                            if( $.isFunction(settings.onclose)){
                                settings.onclose(target,target.ace('value'));
                            }else{
                                if( $.isFunction(window[settings.onclose])){
                                    window[settings.onclose](target,target.ace('value'));
                                }
                            }
                        },
                        onSelect:function(date,el){

                            var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                            var settings = target.data($.aceOverWatch.settings.aceSettings);

                            if( settings.net.autosave == true ) {

                                //ok.. we have autosave.. so....
                                clearTimeout(settings.timerId);
                                settings.timerId = setTimeout(function(){
                                    $.aceOverWatch.field.save(containerField,true);
                                },2000);

                            }

                            $(this).triggerHandler('change');

                            (String(date).length==0)?
                                $(this).addClass($.aceOverWatch.classes.empty):
                                $(this).removeClass($.aceOverWatch.classes.empty);
                        },
                        showOn			:'both',
                        showOtherMonths	: true,
                        changeMonth		: true,
                        changeYear		: true,
                        yearRange		: "-100:+100",
                        buttonText		: '<i class="'+$.aceOverWatch.classes.calendarIcon+'"></i>',
                        nextText		: '<i class="'+$.aceOverWatch.classes.nextIcon+'"></i>',
                        prevText		: '<i class="'+$.aceOverWatch.classes.prevIcon+'"></i>',
                        dayNamesMin		: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                    };
                	
                    inputEl.datepicker(options).datepicker('option','dateFormat',settings.format);
                    inputEl.datepicker('setDate',settings.value);
                    
                    if( settings.readonly ){
                        inputEl.datepicker(options).datepicker('option','disabled',true);
                    }

                    if( $.isFunction(settings.onselect)){
                        inputEl.select(settings.onselect);
                    }else{
                        if( $.isFunction(window[settings.onselect])){
                            inputEl.select(window[settings.onselect]);
                        }
                    }

                    inputEl.change( function(){

                        var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                        var settings = target.data($.aceOverWatch.settings.aceSettings);

                        target.find('.'+$.aceOverWatch.classes.fieldValue).removeClass($.aceOverWatch.classes.empty);
                        
                        settings.value = target.ace('value');

                        if( $.isFunction(settings.onchange)){
                            settings.onchange(target,settings.value);
                        }else{
                            if( $.isFunction(window[settings.onchange])){
                                window[settings.onchange](target,settings.value);
                            }
                        }

                    });
                }
            },

            val : function(target,value){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if( value == null ){
                    return $.datepicker.formatDate(settings.format,containerField.find('.'+$.aceOverWatch.classes.fieldValue).datepicker('getDate'));
                }else{
                    (String(value).length==0)?
                        containerField.find('.'+$.aceOverWatch.classes.fieldValue).addClass($.aceOverWatch.classes.empty):
                        containerField.find('.'+$.aceOverWatch.classes.fieldValue).removeClass($.aceOverWatch.classes.empty);

                    if ((typeof value !== "string") && (!(value instanceof Date))) value = "";
                    containerField.find('.'+$.aceOverWatch.classes.fieldValue).datepicker('setDate',value);

                    return true;
                }
            }

        },//end datepicker object

        /**
         * begin autocomplete object
         * - it is an text edit field, which opens a grid with partial results, and it allows the selection of the results from inside the grid

         *- to use the details template:
         *  a) set the template field to point at the id of the template to be used to display details
         *     ex: template:'this_is_the_id'		//no# in front of it
         *
         *     user [record_field_name] to delimit where to set information from the last selected record
         *
         *  b) use height for the height of the autocomple area
         *  	ex: height:'100px'
         *          height:'10%;
         *
         *
         *
         */
        autocomplete : {

            create : function(target,settings){

                $.extend(true,settings, $.extend(true,{
                    value:'', //the value that will be sent on save
                    extravalue: '', //the value that is displayed in the text box

                    fieldname:'',	//
                    displayname:'',//when in a form, the field from which the initial search param will be taken
                    displayrenderer:null,

                    searchname:'',	//the name of the field from which the auto complete will extract the displayed information when searching on the net
                    valuename:'',	//the field from the searched record from which the actual value of the field is taken

                    timerId:null,		//hold the id of the timer used by the input autocomplete
                    timertimeout:3000,		//hold the id of the timer used by the input autocomplete
                    minlength:5,		//the minimul lenght of the search field

                    searchwide:'100%',	//the wide of the search grid
                    template:null,		//the ID of a template to display the information we have found
                    height:null,			//the height of the template

                    //callback functions
                    onbeforeload : null, //called before loading of new query for remote fields f(target, grid)
                    onclose:null,	//called when the search grid has been closes by pressing escape or something else
                    onselect:null,	//called when a value has been selected through the search grid
                    oninputelkeyup:null,	//called when a key up event triggered on the input el of the autocomplete
                    onvaluecleared: null,
                    gridrowrenderer:null, //function or the name of a function to customize the look of the grid row... params(value, record);
                    gridsettings : null,
                    onbeforegridshow: null,
                    onaftergridshow: null,
                    onbeforegridhide: null,
                    onaftergridhide: null,
                    onloadsuccessful : null, // function or the name of a function to be called when search data is loaded in the grid

                    displayclearbutton:true,//true if we are to display a button to clear the value of the autofield
                    clearbuttontext:'X',
                    clearvalue:'',

                    displayextralink:false,
                    extralinkurl:'',	//the url for an extra link
                    extralinktext:'',	//link text; if missing, it will be extralinkurl
                    extralinkcallback:'',//function or name of the function what to do when clicking the link; //extralinkcallback(target, event);

                    autosearchonfocus : false, //true to autodeploy the search, on focus
                    onetimesearchparams : false,//set this with: setOneTimeSearchParams, to an object which will be given to the next search only

                    onafterinit :null, //called just after init

                    usequeries : false,//set to true, to use the chips method of writing queries

                    //
                    chipssettings : {},
                    lBSTime : 0,//last backspace press time; for the purpose of computing double backspace

                    ///////////////////
                    usingTemplate : false,//set on creation bases on weather or not we have a template for displaying data

                    ignorecellcontainer : 0,/*set this value to 1 for when we want to display the autocomplete in a grid panel row*/

                    bindtoexternalgridid : false,
                }, settings ) );

                settings.actualDisplayClearButton = settings['displayclearbutton'] && !settings['readonly'];

                //what is this?
                if ((!$.aceOverWatch.utilities.isVoid(settings.onselect)) && ($.aceOverWatch.utilities.isVoid(settings.onselect))){
                    settings.onselect = settings.onselect;
                }
                if( settings.valuename.length == 0 ){
                    settings.valuename = settings.searchname;
                }

                let classes = [$.aceOverWatch.classes.autocompleteField];
                if( settings.ignorecellcontainer == 1 ){
                    classes.push($.aceOverWatch.classes.autocompleteCellIgnore);
                }
                var fieldHtml = '<div class="'+classes.join(' ')+'" >';

                var tooltip = '';
                if( settings['tooltip'] ){
                    tooltip = ' data-toggle="tooltip" data-placement="bottom" data-trigger="hover" data-original-title="'+settings['tooltip']+'" ';
                }

                var placeholder= '';
                if( settings['placeholder'] ){
                    placeholder = ' placeholder="'+settings['placeholder']+'" ';
                }

                var inputF = '<input type="text" class="'+$.aceOverWatch.classes.fieldValue+(String(settings['value']).length==0?' '+$.aceOverWatch.classes.empty:'')+'" aceid="'+settings.id+'" value="'+settings['extravalue']+'" '+tooltip+' ' + (settings['readonly'] ? 'readonly="readonly"' : '') +' ' + placeholder + ' >';

                if( settings.displayextralink ){
                    fieldHtml += '<a class="'+$.aceOverWatch.classes.autocompleteLink+'" href="'+settings.extralinkurl+'" target="_blank">'+settings.extralinktext+'</a>';
                }

                fieldHtml += $.aceOverWatch.field.badge.create(settings);

                var clearButton = '';

                if( settings.actualDisplayClearButton ){
                    clearButton = '<button class="'+$.aceOverWatch.classes.autocompleteClearButton+'">'+settings.clearbuttontext+'</button>';
                }

                if( !$.aceOverWatch.utilities.isVoid(settings.template) ){
                    //if we have a template defined, set the template container; by default it's hidden..

                    var height = '';
                    if( settings.height ){
                        height += 'height:'+settings.height+';';
                    }

                    fieldHtml +='<div class="'+$.aceOverWatch.classes.autocompleteTemplate+'" style="'+height+'">'
                        +'<div class="'+$.aceOverWatch.classes.autocompleteInnerTemplate+' ace-hide"></div>'
                        +inputF
                        +$.aceOverWatch.field.label.create(settings);
                    +clearButton;
                    +'</div>';
                    settings.usingTemplate = true;
                }else{
                    settings.usingTemplate = false;
                    fieldHtml += inputF;
                    fieldHtml += $.aceOverWatch.field.label.create(settings);
                    fieldHtml += clearButton;
                }

                fieldHtml += '<span class='+$.aceOverWatch.classes.errorMsg+'></span>';
                fieldHtml += '</div>';

                return fieldHtml;
            },

            afterInit : function(target, what){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                var inputEl = containerField.find('.'+$.aceOverWatch.classes.fieldValue);
                settings.inputEl = inputEl;

                if ($.aceOverWatch.utilities.isVoid(settings.gridsettings)) settings.gridsettings = {};
                $.extend(true,settings.gridsettings, $.extend(true,{
                    type:'grid',
                    allowdelete:false,
                    allowedit:false,
                    allowadd:false,
                    allowrefresh:false,
                    hideheader:true,
                    classes:$.aceOverWatch.classes.hide,
                    cleardata:true,
                    width:settings.searchwide,
                    selectiontype : false,
                    columns:[
                        {
                            width:settings.searchwide,
                            fieldname:settings.searchname,
                            renderer:settings.gridrowrenderer,
                        }
                    ],
                    net:{},//settings.net,
                    autoload:false,
                    onselectionchange:function(grid,row,idx,record){
                        $.aceOverWatch.field.autocomplete.val(grid.parent().closest('.'+$.aceOverWatch.classes.containerField),record);
                    },
                    onloadsuccessful : function(grid, data, startIdx, endIdx, totalExpectedData){
                        if (($.aceOverWatch.utilities.isVoid(grid)) || (!$.isFunction(grid.parent))) return;
                        $.aceOverWatch.field.autocomplete.onloadsuccessful(grid.parent().closest('.'+$.aceOverWatch.classes.containerField),data, startIdx, endIdx, totalExpectedData);
                    },
                    hideonescape:true,
                    enablekeybasednavigation:true,
                    oncustomkeypresshandler:function(target, keyPressedEvent, explicitSpecialCode){

                        if( keyPressedEvent ){

                            //ok.. if we pressed a printable character... ADD it to the input element

                            /*var charcode = e.charCode;
                            var char = String.fromCharCode(charcode);
                            console.log(char);*/

                            var keycode = keyPressedEvent.charCode;
                            var isPrintableCharacter =
                                (keycode >= 32 && keycode <= 126 );

                            //(keycode > 47 && keycode < 58)   || // number keys
                            //keycode == 32 || keycode == 13   || // spacebar & return key(s) (if you want to allow carriage returns)
                            //(keycode > 64 && keycode < 91)   || // letter keys
                            //(keycode > 95 && keycode < 112)  || // numpad keys
                            //(keycode > 185 && keycode < 193) || // ;=,-./` (in order)
                            //(keycode > 218 && keycode < 223);   // [\]' (in order)

                            if( isPrintableCharacter ){
                                //console.log('[pressed a printable chacater in the grid...] :> ' + String.fromCharCode(keycode));

                                //ok now.. want to add the character to the value already present in the input

                                //this is the input field...
                                var ifld = $(target).parent().closest('.'+$.aceOverWatch.classes.containerField).find('.'+$.aceOverWatch.classes.fieldValue);
                                ifld.val(ifld.val()+String.fromCharCode(keycode)).triggerHandler('keyup');


                            }else{
                                //console.log('[non printable character] ' + String.fromCharCode(keycode));
                            }
                        }else{
                            switch( explicitSpecialCode ){
                                case 8://backspace
                                    let ifld = $(target).parent().closest('.'+$.aceOverWatch.classes.containerField).find('.'+$.aceOverWatch.classes.fieldValue);
                                    let val = ifld.val();
                                    if( val && val.length > 0 ){
                                        val = val.substr(0,val.length-1);
                                        ifld.val(val).triggerHandler('keyup');
                                    }
                                    break;
                            }
                        }

                    }
                },settings.gridsettings));

                if( settings.bindtoexternalgridid ){
                    settings.externalGrid = $('#'+settings.bindtoexternalgridid);
                }else{

                    //applying the net settings here, otherwise, they are going to be re-written by those of the grid's
                    $.extend(true,settings.gridsettings.net,settings.net);

                    var searchGrid = $('<div class="'+[$.aceOverWatch.classes.gridAutoComplete, $.aceOverWatch.classes.hideErrors].join(' ')+'" tabindex="0"></div>').ace('create',settings.gridsettings).hide().insertAfter(inputEl);
                    searchGrid.parent().addClass($.aceOverWatch.classes.formIgnore);

                    searchGrid.keyup(function(e){
                        switch(e.keyCode){
                            case 27://escape.. the grid will have hidden itself, because of the hideonescape
                                //so.. now.. transfer the focus to the inputEl
                                var target = $(this).parent().closest('.'+$.aceOverWatch.classes.containerField);
                                target.find('.'+$.aceOverWatch.classes.fieldValue).focus();
                                $.aceOverWatch.field.autocomplete.renderTemplateIfNecessary(target);
                                break;
                        }
                    });

                    $.aceOverWatch.eventManager.registerEvent('outsideclick',
                        containerField,
                        searchGrid,
                        function(el)       {
                            el.fadeOut(1);
                        }
                    );

                    /*
                     * dealing with queries CHIPS, if this is the case!
                     */

                    if( settings.usequeries === true ){

                        $.extend(true,settings.chipssettings, $.extend(true,{

                            type:'chips',
                            allowduplicates : false,
                            visible : false,

                            onremove : function(target, index, record){
                                $.aceOverWatch.field.autocomplete.search($(target).closest('.'+$.aceOverWatch.classes.autocompleteField).parent());
                            }

                        },settings.chipssettings));

                        settings.chips = $('<div class="'+$.aceOverWatch.classes.col12+'"></div>').ace('create',settings.chipssettings);
                        searchGrid.find('.'+$.aceOverWatch.classes.grid).prepend(settings.chips);
                    }
                }

                var templateField = containerField.find('.'+$.aceOverWatch.classes.autocompleteInnerTemplate);
                templateField.unbind('click').click(function(e){
                    e.stopImmediatePropagation();
                    var autoEl = $(this).closest('.'+$.aceOverWatch.classes.containerField);

                    autoEl.find('.'+$.aceOverWatch.classes.autocompleteInnerTemplate).addClass($.aceOverWatch.classes.hide);

                    var inputF = autoEl.find('.'+$.aceOverWatch.classes.fieldValue);
                    inputF.removeClass($.aceOverWatch.classes.hide);
                    inputF.focus();

                });

                if( 	settings.autosearchonfocus
                    &&	!settings.readonly
                ){
                    inputEl.unbind('focus').bind('focus',function(){

                        var autoEl = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                        $.aceOverWatch.field.autocomplete.search(autoEl);

                    });
                }


                //treating key down in the input
                inputEl.keyup(function (e) {
                    var autoEl = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                    var settings = autoEl.data($.aceOverWatch.settings.aceSettings);
                    
                    if( e.keyCode == undefined ){
                    	let currentValue = $(this).val();
                    	if( currentValue.length > 0 ){
                    		e.keyCode = currentValue.charCodeAt(currentValue.length -1)
                    	}
                    }

                    clearTimeout(settings.timerId);


                    if( settings.readonly ){
                        return;
                    }

                    switch(e.keyCode){
                        case 13://enter
                            $.aceOverWatch.field.autocomplete.search(autoEl)
                            break;
                        case 27://escape
                            if( !settings.bindtoexternalgridid ){
                                autoEl.find('.'+$.aceOverWatch.classes.gridAutoComplete).fadeOut(1);
                                if( $.isFunction(settings.onclose) ){
                                    settings.onclose(target);
                                }
                            }
                            break;
                        case 32://space
                            if( settings.usequeries ){
                                let searchValue = settings.inputEl.val().trim();
                                if( searchValue.length > 0 ){
                                    $.aceOverWatch.field.chips.addChip(settings.chips,searchValue,searchValue);
                                    settings.inputEl.val('');
                                    settings.inputEl.focus();
                                }
                            }
                            break;

                        case 40://down arrow
                            if( !settings.bindtoexternalgridid ){
                                $.aceOverWatch.field.autocomplete.showGrid(autoEl.find('.'+$.aceOverWatch.classes.gridAutoComplete));
                            }
                            break;

                        case 8://backspace

                            if( settings.usequeries ){

                                let cBSTime = moment().valueOf();
                                let diff = cBSTime - settings.lBSTime;

                                if( diff <= 600 ){//a bit more than half a second...
                                    /*
                                     * we delete the last chip!
                                     */
                                    $.aceOverWatch.field.chips.removeLastChip(settings.chips);
                                }
                                settings.lBSTime = cBSTime;
                            }
                            break;


                        default:
                            if ($.isNumeric(settings.timertimeout)) settings.timertimeout = parseInt(settings.timertimeout);
                            if (settings.timertimeout > 0) {
                                settings.timerId = setTimeout(function () {
                                    $.aceOverWatch.field.autocomplete.search(autoEl);
                                }, settings.timertimeout);
                            }
                            break;
                    }

                    if( $.isFunction(settings.oninputelkeyup) ){
                        settings.oninputelkeyup(target, settings.inputEl.val());
                    }
                    else
                    if ($.isFunction(window[settings.oninputelkeyup])) {
                        window[settings.oninputelkeyup](target, settings.inputEl.val());
                    }

                });

                if( settings.actualDisplayClearButton ){
                    containerField.find('.'+$.aceOverWatch.classes.autocompleteClearButton).unbind('click').click(function(e){
                        e.stopImmediatePropagation();
                        var autoEl = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                        $.aceOverWatch.field.autocomplete.clearValue(autoEl);
                    });
                }

                if( settings.displayextralink ){
                    containerField.find('.'+$.aceOverWatch.classes.autocompleteLink).unbind('click').click(function(e){
                        console.log('Clicked display extra link');
                        e.stopImmediatePropagation();

                        var autoEl = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                        var settings = autoEl.data($.aceOverWatch.settings.aceSettings);

                        if ($.isFunction(settings.extralinkcallback)) {
                            return settings.extralinkcallback(autoEl,e);
                        }else{
                            if ($.isFunction(window[settings.extralinkcallback])) {
                                return  window[settings.extralinkcallback](autoEl,e);
                            }
                        }


                    });
                }

                if ($.isFunction(settings.onafterinit)) {
                    return settings.onafterinit(target);
                }else{
                    if ($.isFunction(window[settings.onafterinit])) {
                        return  window[settings.onafterinit](target);
                    }
                }

                $.aceOverWatch.field.autocomplete.renderTemplateIfNecessary(target);

                settings.onLoadSuccessful = false;
                if ($.isFunction(settings.onloadsuccessful)) {
                    settings.onLoadSuccessful = settings.onloadsuccessful;
                }else{
                    if ($.isFunction(window[settings.onloadsuccessful])) {
                        settings.onLoadSuccessful = window[settings.onloadsuccessful];
                    }
                }
            },

            onloadsuccessful : function(target, data, startIdx, endIdx, totalExpectedData){
                var settings = target.data($.aceOverWatch.settings.aceSettings);
                if( settings.onLoadSuccessful ){
                    settings.onLoadSuccessful(target, data, startIdx, endIdx, totalExpectedData);
                }
            },

            showGrid : function(target){
                var gridField = $(target);
                var settings = gridField.data($.aceOverWatch.settings.aceSettings);

                if( settings.bindtoexternalgridid ){
                    return;
                }

                if( $.isFunction(settings.onbeforegridshow) ){
                    if (settings.onbeforegridshow(target)===false) return;
                }
                else
                if ($.isFunction(window[settings.onbeforegridshow])) {
                    if (window[settings.onbeforegridshow](target)===false) return;
                }

                var autoEl = gridField.parent().closest('.'+$.aceOverWatch.classes.containerField);
                gridField.css({
                    "maxWidth": $(autoEl).width()
                });
                gridField.removeClass($.aceOverWatch.classes.hide);

                gridField.fadeIn(100).position({
                    my:        "left top",
                    at:        "left bottom",
                    of:        autoEl.find('.'+$.aceOverWatch.classes.fieldValue),
                    collision: "fit"
                });

                gridField.focus();

                if( $.isFunction(settings.onaftergridshow) ){
                    if (settings.onaftergridshow(target)===false) return;
                }
                else
                if ($.isFunction(window[settings.onaftergridshow])) {
                    if (window[settings.onaftergridshow](target)===false) return;
                }

            },
            hideGrid : function(target) {
                $.aceOverWatch.field.autocomplete.hideSelectionGrid(target);
            },

            setOneTimeSearchParams : function(target, oneTimeSearchParams){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                if( !settings ){
                    return;
                }
                settings.onetimesearchparams = oneTimeSearchParams;
            },

            /**
             * the function triggeres the search..
             * selectFirstResult - if true, the field will autoselect the FIRST result it finds...
             */
            search : function(target,selectFirstResult, selectOnlyIfSingle = false, explicitFilter = false){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                if( !settings ){
                    return;
                }
                var inputEl = containerField.find('.'+$.aceOverWatch.classes.fieldValue);

                /*
                 * if we are using the chips / usequeries, attempt to add the current selection to the chips! :)
                 */
                var query = inputEl.val();

                if( settings.usequeries ){

                    let searchValue = inputEl.val().trim();
                    if( searchValue.length > 0 ){
                        $.aceOverWatch.field.chips.addChip(settings.chips,searchValue,searchValue);
                        settings.inputEl.val('');
                        settings.inputEl.focus();
                    }

                    let chipsData = $.aceOverWatch.field.chips.getData(settings.chips);
                    let queryValues = [];
                    for(let idx in chipsData ){
                        queryValues.push(chipsData[idx].val('value'));
                    }
                    query = queryValues.join(settings.queriesglue);

                }

                if( selectOnlyIfSingle ){
                    selectOnlyIfSingle = true;
                }


                if( query.length < settings.minlength ){
                    return;
                }

                var grid = settings.bindtoexternalgridid
                    ? settings.externalGrid
                    : containerField.find('.'+$.aceOverWatch.classes.gridAutoComplete);

                if( $.isFunction(settings.onbeforeload) ){
                    if (settings.onbeforeload(target, grid, query)===false) return;
                }
                else
                if ($.isFunction(window[settings.onbeforeload])) {
                    if (window[settings.onbeforeload](target, grid, query)===false) return;
                }


                if (grid.hasClass($.aceOverWatch.classes.hide)) {
                    $.aceOverWatch.field.autocomplete.showGrid(grid);
                }
                else{

                    if(
                        !settings.bindtoexternalgridid
                    ){
                        grid.fadeIn(100);
                    }
                }
                grid.find('[ridx]').first().focus();

                let params = {};
                $.extend(params,settings.net.extraparams);

                let originalParams = {};
                if( settings.onetimesearchparams !== false ){
                    let gs = grid.data($.aceOverWatch.settings.aceSettings);
                    $.extend(originalParams,gs.net.extrapara);

                    $.extend(params,settings.onetimesearchparams);
                }

                let originalFilter = {};
                if( explicitFilter ){
                    let gs = grid.data($.aceOverWatch.settings.aceSettings);
                    $.extend(originalFilter,gs.net.filter);
                    gs.net.filter = explicitFilter;
                }

                $.aceOverWatch.field.grid.val(grid,{
                    page:1,
                    selectfirstresult:selectFirstResult,
                    selectonlyifsingle:selectOnlyIfSingle,
                    net:{
                        extraparams: params,
                        query: settings.usequeries ? '' : query,
                        queries: settings.usequeries ? query : '',
                    }
                });
                $.aceOverWatch.field.grid.reloadPage(grid);

                if( settings.onetimesearchparams !== false ){
                    /*
                     * removing the explicit params we have just set
                     */
                    let gs = grid.data($.aceOverWatch.settings.aceSettings);
                    gs.net.extraparams = originalParams;

                    settings.onetimesearchparams = false;
                }

                if( explicitFilter ){
                    let gs = grid.data($.aceOverWatch.settings.aceSettings);
                    gs.net.filter = originalFilter;
                }
            },

            /**
             * value is null: the function returns the current value
             *
             * value is not an object: the current value is set to this one
             * 						if extra is present, the extra will become the extravalue ( the searchname), that which is displayed in the field
             *
             *  					returns the new value
             *
             * value is an object:
             *  					in this case, the call has most likely came from the field's on grid selection..
             *
             * 					  the field valuename is diven to the value
             * 					  the field searchname is given to the extravalue
             *
             * 					  returns the new value
             */
            val : function(target, value, extra){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                var inputField = containerField.find('.'+$.aceOverWatch.classes.fieldValue);

                var oldValue = settings.value;

                if( value != null ){

                    var recordData = null;

                    if( typeof value == 'object' ){

                        recordData = $.aceOverWatch.record.isRecord(value) ? value : $.aceOverWatch.record.create(value);
                        settings.value = recordData.val(settings.valuename);
                        settings.extravalue = recordData.val(settings.searchname);


                        if( $.isFunction(settings.displayrenderer) ){
                            hasRenderer = true;
                            inputField.val(settings.displayrenderer(settings.value, recordData));
                        }
                        else
                        if ($.isFunction(window[settings.displayrenderer])) {
                            hasRenderer = true;
                            inputField.val(window[settings.displayrenderer](settings.value, recordData));
                        }
                        else {
                            inputField.val(recordData.val(settings.searchname));
                        }

                        (String(recordData.val(settings.searchname)).length==0)?
                            inputField.addClass($.aceOverWatch.classes.empty):
                            inputField.removeClass($.aceOverWatch.classes.empty);

                    }else{
                        //in case it's a simple value...
                        settings.value = value;

                        if( extra ){
                            settings.extravalue = extra;


                            if( $.isFunction(settings.displayrenderer) ){
                                hasRenderer = true;
                                inputField.val(settings.displayrenderer(extra, null));
                            }
                            else
                            if ($.isFunction(window[settings.displayrenderer])) {
                                hasRenderer = true;
                                inputField.val(window[settings.displayrenderer](extra, null));
                            }
                            else {
                                inputField.val(extra);
                            }

                            (String(extra).length==0)?
                                inputField.addClass($.aceOverWatch.classes.empty):
                                inputField.removeClass($.aceOverWatch.classes.empty);
                        }else{
                            settings.extravalue = '';

                            if( $.isFunction(settings.displayrenderer) ){
                                hasRenderer = true;
                                inputField.val(settings.displayrenderer(value, null));
                            }
                            else
                            if ($.isFunction(window[settings.displayrenderer])) {
                                hasRenderer = true;
                                inputField.val(window[settings.displayrenderer](value, null));
                            }
                            else {
                                inputField.val(value);
                            }

                            (String(value).length==0)?
                                inputField.addClass($.aceOverWatch.classes.empty):
                                inputField.removeClass($.aceOverWatch.classes.empty);
                        }
                    }

                    $.aceOverWatch.field.autocomplete.hideSelectionGrid(target);

                    settings.lastSelectedRecord = recordData;

                    if( $.isFunction(settings.onselect) ){
                        settings.onselect(target, settings.value, recordData);
                    }
                    else
                    if ($.isFunction(window[settings.onselect])) {
                        window[settings.onselect](target, settings.value, recordData);
                    }

                    /**
                     * NOW.. IF we have set a value.... SO...
                     * IF we have a RECORD
                     * and IF we have a value! HIDE the input field, and show the template field, parsed with data
                     */
                    $.aceOverWatch.field.autocomplete.renderTemplateIfNecessary(target);

                    inputField.triggerHandler('change');
                }

                if( oldValue != settings.value && settings.net.autosave == true ){
                    //if we have a new value, and autosave.. try to save itself...if....

                    //in case this field is part of a FORM, then test to see if this new value, isn't the same as that of the form's current record
                    //if it IS the same, then don't save itself, because its value has just been set to what it needs to be
                    var shouldSaveMyself = true;
                    if( settings.parentform ){
                        var fr = settings.parentform.ace('value');
                        if( fr && fr.val(settings.fieldname) == settings.value ){
                            shouldSaveMyself = false;
                        }
                    }

                    if( shouldSaveMyself ){
                        $.aceOverWatch.field.save(target,true);
                    }
                }

                return settings.value;
            },

            searchVal : function(target){
                return $(target).find('input').val();
            },

            /*
			 * should retrieve the current record
			 */
            getRecord : function(target){
                let containerField = $(target);
                let settings = containerField.data($.aceOverWatch.settings.aceSettings);
                if( !settings ){
                    return null;
                }
                return settings.lastSelectedRecord;
            },

            hideSelectionGrid: function(target) {
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if( settings.bindtoexternalgridid ){
                    return;
                }

                if( !settings ){
                    return;
                }
                if( $.isFunction(settings.onbeforegridhide) ){
                    if (settings.onbeforegridhide(target)===false) return;
                }
                else
                if ($.isFunction(window[settings.onbeforegridhide])) {
                    if (window[settings.onbeforegridhide](target)===false) return;
                }


                if( containerField.find('.'+$.aceOverWatch.classes.gridAutoComplete).is(":visible") ){
                    containerField.find('.'+$.aceOverWatch.classes.gridAutoComplete).fadeOut(1);
                }

                if( $.isFunction(settings.onaftergridhide) ){
                    if (settings.onaftergridhide(target)===false) return;
                }
                else
                if ($.isFunction(window[settings.onaftergridhide])) {
                    if (window[settings.onaftergridhide](target)===false) return;
                }

            },

            clearValue : function(target) {
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if( !settings ){
                    return;
                }

                this.val(target,settings.clearvalue);
                
                if( settings.usequeries ){
                	$.aceOverWatch.field.chips.setData(settings.chips,[]);
                }


                if( $.isFunction(settings.onvaluecleared) ){
                    settings.onvaluecleared(target);
                }
                else
                if ($.isFunction(window[settings.onvaluecleared])) {
                    window[settings.onvaluecleared](target);
                }
                
                if( settings.bindtoexternalgridid ){
                	$.aceOverWatch.field.autocomplete.search(target);
                }

            },

            renderTemplateIfNecessary : function(target){
                //renders the template information, if necessary!
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if( !settings ){//??
                    return;
                }

                if( !settings.usingTemplate ){
                    return;
                }

                var inputField = containerField.find('.'+$.aceOverWatch.classes.fieldValue);
                inputField.addClass($.aceOverWatch.classes.hide);
                /*var labelField = containerField.find('.'+$.aceOverWatch.classes.label);
				labelField.addClass($.aceOverWatch.classes.hide);*/

                var templateField = containerField.find('.'+$.aceOverWatch.classes.autocompleteInnerTemplate);

                var templateContent = '';


                //settings.extravalue - if not record is selected...

                if( $.aceOverWatch.utilities.isVoid(settings.lastSelectedRecord) ){
                    //if we don't have an extra selected record... try to display the extravalue.. if no extra value.. display the placeholder.. if no placeholder...?? then display the label

                    if( !$.aceOverWatch.utilities.isVoid(settings.extravalue) && String(settings.extravalue).length > 0 ){
                        templateContent = settings.extravalue;
                    }else{

                        if( !$.aceOverWatch.utilities.isVoid(settings.placeholder) && String(settings.placeholder).length > 0 ){
                            templateContent = settings.placeholder;
                        }else{
                            if( !$.aceOverWatch.utilities.isVoid(settings.label) && String(settings.label).length > 0){
                                templateContent = settings.label;
                            }else{
                                templateContent = '...';//??
                            }
                        }

                    }

                    templateContent = '<p>' + templateContent + '</p>';


                }else{
                    //we have a record, lets build our template..

                    templateContent = $('#'+settings.template).html();

                    for(fieldname in settings.lastSelectedRecord.data){
                        //need to escape first this in order to work with the regular expression...
                        //templateContent = templateContent.replace(new RegExp('['+fieldname+']', 'g'), settings.lastSelectedRecord.val(fieldname));
                        templateContent = templateContent.split('['+fieldname+']').join(settings.lastSelectedRecord.val(fieldname));
                    }

                }


                templateField.html(templateContent);
                templateField.removeClass($.aceOverWatch.classes.hide);
            },



        },//end autocomplete object

        /**
         * begin button object
         */
        button : {
            create: function(target,settings){
                $.extend(true,settings, $.extend(true,{
                    value:'',		//the text to appear on the button
                    action:'',		//an attribute string, reprezenting an action, like: save, edit, delete, etc; other controlles will try to take advantage of this and use this attribute as a hook
                    iconcls:'',
                    iconposition:'before',//before or after
                    readonly : false,
                    faprefix: '',//$.aceOverWatch.classes.fontAwesomePrefix,
                    buttoncls : '', //class to be added to the button object
                }, settings ) );	//example: grids of type 'panel' use this to link buttons found in their row template with default actions: edit, delete, save, etc

                var tooltip = '';
                if( settings['tooltip'] ){
                    tooltip = ' data-toggle="tooltip" data-placement="bottom" data-trigger="hover" data-original-title="'+settings['tooltip']+'" ';
                }
                var disabled = settings.readonly == true ? ' disabled ' : 'false';

                if (!$.aceOverWatch.utilities.isVoid(settings.buttoncls)) settings.buttoncls = ' '+settings.buttoncls;

                var buttonContent = '';
                if (settings.iconposition == 'before') {
                    buttonContent = (settings.iconcls!==''?'<div class="'+[settings.faprefix,settings.iconcls,$.aceOverWatch.classes.icon].join(' ')+'"></div>':'')+'<span>'+settings['value']+'</span>';
                }
                else {
                    buttonContent = '<span>'+settings['value']+'</span>'+(settings.iconcls!==''?'<div class="'+[settings.faprefix,settings.iconcls,$.aceOverWatch.classes.icon,$.aceOverWatch.classes.iconAfter].join(' ')+'"></div>':'');

                }
                var fieldHtml = '<div class="'+$.aceOverWatch.classes.buttonField+'">\
									<button action="'+settings.action+'" type="button"  class="'+$.aceOverWatch.classes.fieldValue+settings.buttoncls+'" aceid="'+settings.id+'" '+tooltip+disabled+'>'+
                                    buttonContent+
                                    '</button>\
									<span class='+$.aceOverWatch.classes.errorMsg+'></span>\
								</div>';

                return fieldHtml;
            },
            afterInit : function( target, what ){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                containerField.find('.'+$.aceOverWatch.classes.buttonField+ ' button').unbind('click').click(function(){

                    var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                    var settings = target.data($.aceOverWatch.settings.aceSettings);

                    var field = $(this).closest('.'+$.aceOverWatch.classes.buttonField).parent();

                    if ( (!$.aceOverWatch.utilities.isVoid(settings.action)) && ($.isFunction(settings.action)) ){
                        settings.action(field);
                    }
                    else
                    if ((settings.action!=='') && ($.isFunction(window[settings.action]))){
                        window[settings.action](field);
                    }

                    if( $.isFunction(settings.onClick) ){
                        settings.onClick(field);
                    }

                    return false;
                });
            },

            /**
             *forceValueSet -  usually, the value of the button will not be set, IF the button doesn't have a fieldname..
             *				send this parameter to true to change it anyway
             *				- SM: it's done like this, because otherwise, their values might get set accidentily by the FORM
             */
            val : function(target,value,forceValueSet){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                
                if( $.aceOverWatch.utilities.isVoid(value) ){
                    return containerField.find('button span').html();
                }

                if(settings.fieldname == '' && !forceValueSet){
                    return null;
                }

                containerField.find('button span').html(value);
                return true;

            }
        },//end button object

        /**
         * begin iconbutton object
         */
        iconbutton : {
            create: function(target,settings){
                $.extend(true,settings, $.extend(true,{
                    value:'',		//the text to appear on the button
                    action:'',		//an attribute string, reprezenting an action, like: save, edit, delete, etc; other controlles will try to take advantage of this and use this attribute as a hook
                    iconcls: '',
                    onClick : null,
                    readonly : false,
                    textbellowicon:true,	//by default the text is bellow the icon
                }, settings ) );

                var classes = [$.aceOverWatch.classes.iconButton];
                if( !settings.textbellowicon ){
                    classes.push($.aceOverWatch.classes.iconButtonSingleLine);
                }
                
                var disabled = settings.readonly == true ? ' disabled ' : 'false';

                var fieldHtml = '<div class="'+$.aceOverWatch.classes.iconButton+'" >';

                var classes = [
                    $.aceOverWatch.classes.iconButtonTrigger,
                    $.aceOverWatch.classes.fontAwesomePrefix+' '+settings.iconcls
                ];

                fieldHtml += '<a class="'+classes.join(' ')+'" action="'+settings.action+'" '+disabled+'>'+settings.value+'</a>';

                if( settings.textbellowicon ){
                    fieldHtml += '<br/>';
                }

                fieldHtml += '</div>';
                return fieldHtml;
            },

            afterInit : function( target, what ){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                containerField.find('.'+$.aceOverWatch.classes.iconButtonTrigger).unbind().click(function(){

                    var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                    var settings = target.data($.aceOverWatch.settings.aceSettings);

                    if ( (!$.aceOverWatch.utilities.isVoid(settings.action)) && ($.isFunction(settings.action)) ){
                        settings.action.call(target);
                    }
                    else
                    if ((settings.action!=='') && ($.isFunction(window[settings.action]))){
                        window[settings.action](target);
                    }

                    if( $.isFunction(settings.onClick) ){
                        settings.onClick(target);
                    }
                    return false;
                });
            },
            
            /**
             *forceValueSet -  usually, the value of the button will not be set, IF the button doesn't have a fieldname..
             *				send this parameter to true to change it anyway
             *				- SM: it's done like this, because otherwise, their values might get set accidentily by the FORM
             */
            val : function(target,value,forceValueSet){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                
                if( $.aceOverWatch.utilities.isVoid(value) ){
                    return containerField.find('a').html();
                }

                if(settings.fieldname == '' && !forceValueSet){
                    return null;
                }

                containerField.find('a').html(value);
                return true;

            }
        },//end icon button object

        /**
         * begin uploadbutton
         * it encapsulates an upload and photo deletion
         */
        uploadbutton : {

            create : function(target, settings){

                $.extend(true,settings, $.extend(true,{
                    value:'',		//the text to appear on the button
                    iconcls: '',
                    destinationfield:'',	//the field in which the file is going to be uploaded
                    filetypeiconfield : '', //the field used to extract file type icon for a download
                    
                    enableviewlink : false,
                    
                    deletecode:'-',			//if the delete code if false, or void, the delete button will not be displayed!
                    autosaveonselectfile : true,
                    rounded:false,	//true to make the label round
                    width:'',
                    height:'',
                    trashicon:'fa-trash',
                    atype : 'image',
                    placeholder : _aceL.nofile,
                    maximagesize:0,			//in bytes, the size of the biggest image allowed to be uploaded
                    //0 - unlimited size

                    deletetriggeredfrombutton:false,
                    uploadtriggeredfrombutton:false,
                    currentdoc:'',
                    currentdocfilename:'',
                    currentdociconcls:'fa fa-file-o',
                    explicitfilenamefield:'',//optional - set this to the name of the field, which, will contain the name of the disk file after an upload operation
                    						 //if exists, it will be used to display the name of the file

                    readonly:false,			//if true, the upload and delete buttons won't be created

                    uploadparameters : {},	//name value pairs to be sent to the server to upload the image
                    deleteparameters : {},  //name value pairs to be sent to the server to delete the image

                    onuploadsuccessful:null,	//custom callback, to be called after a successfull upload!: unuploadsuccessfull(target, docURL, data)
                    sendaditionalfieldsonsave : null, //function to return a object with aditional fields to be sent along with the upload; return an empty object {}, if nothing is to be added
                    sendaditionalfieldsondelete : null, //function to return a object with aditional fields to be sent along with the delete op; return an empty object {}, if nothing is to be added

                    onbeforesave:null, 	//called before the upload process actually begins, AFTER it has passed through the validations params:(target, otherFields); if it returns false, the upload will not take place
                    onbeforeclick:null	//called before the click! if it returns false, the click will not be triggered
                }, settings ) );
                settings.deletetriggeredfrombutton = false;
                settings.uploadtriggeredfrombutton = false;
                if (settings.filetypeiconfield==='') { //if the filetypeiconfield was not specified then I assume that if the field name finishes with "_path" the iconcls shoudld finish instead of "_path" in "_iconcls"
                    if (settings.fieldname.substr(settings.fieldname.length-5)==='_path') {
                        settings.filetypeiconfield = settings.fieldname.substr(0, settings.fieldname.length-5)+'_iconcls';
                    }
                }
                if( !(jQuery.type( settings.uploadparameters )==='object') ){
                    settings.uploadparameters = $.aceOverWatch.utilities.getObjectFromText(settings.uploadparameters);
                }

                if( !(jQuery.type( settings.deleteparameters )==='object') ){
                    settings.deleteparameters = $.aceOverWatch.utilities.getObjectFromText(settings.deleteparameters);
                }
                var style = [];
                var classes = [$.aceOverWatch.classes.fileUpload];
                if (settings.atype=='image') {
                    classes.push($.aceOverWatch.classes.imageUpload);
                    style.push('background-image: url('+settings.currentdoc+')');
                }
                
                if( settings.readonly ){
                	classes.push('ace-readonly');
                }

                if( settings.rounded ){
                    classes.push($.aceOverWatch.classes.aceRounded);
                }

                if(settings.width.length > 0 ){
                    style.push('width:'+settings.width+' !important');
                }
                if(settings.height.length > 0 ){
                    style.push('height:'+settings.height+' !important');
                }
                if (settings.atype=='image') {
                    var buttons = settings.readonly == false ? '<div class="'+[$.aceOverWatch.classes.cardButton,$.aceOverWatch.classes.photoRemove].join(' ')+'"></div><input type="file" />' : '';

                    //adding the template class here becauset the field controls present inside an upload image button must NOT be targeted as separte fields of a form
                    var fieldHtml = '<div class="'+$.aceOverWatch.classes.imageUploadButton+' '+$.aceOverWatch.classes.formIgnore+'" ><label style="'+style.join(';')+'" class="'+classes.join(' ')+'">'+buttons+'</label>'
                    				+(
                						settings.enableviewlink
                						? '<div class="ace-col-12"><a class="view-link" href="#">'+_aceL.view+'</a></div>'
        								: ''
            						)+
                    				'</div>';
                }
                else {
                    //console.log(settings.destinationfield+ ' ----> ' +settings.currentdociconcls);
                    //if (settings.currentdociconcls=='') settings.currentdociconcls='fa-file-o';

                    //adding the template class here becauset the field controls present inside an upload image button must NOT be targeted as separte fields of a form
                    var  fieldHtml = '<div class="'+$.aceOverWatch.classes.fileUpload+' '+$.aceOverWatch.classes.formIgnore +'">';
                    fieldHtml += $.aceOverWatch.field.label.create(settings);
                    fieldHtml += $.aceOverWatch.field.badge.create(settings);
                    fieldHtml += '<label style="'+style.join(';')+'" class="'+classes.join(' ')+'">';
                    fieldHtml += '	<i class="'+$.aceOverWatch.classes.fontAwesomePrefix+' '+settings.currentdociconcls+' '+$.aceOverWatch.classes.fileUploadIconType+'"></i>';
                    fieldHtml += '		<span class="'+$.aceOverWatch.classes.fileUploadPlaceholder+'">'+(settings.currentdocfilename!==''?settings.currentdocfilename:settings.placeholder)+'</span>';

                    if( !settings.readonly ){
                    fieldHtml += '			<div class="'+$.aceOverWatch.classes.fileUploadButtonsContainer+'">';
                    fieldHtml += '				<div class="'+$.aceOverWatch.classes.fileUploadButton+' ace-label-align-top">';
                    fieldHtml += '					<div class="'+$.aceOverWatch.classes.iconButton+'">';
                    fieldHtml += '						<a class="'+$.aceOverWatch.classes.menubuttonTrigger+' '+$.aceOverWatch.classes.uploadIcon+' '+$.aceOverWatch.classes.imageUploadButton+'"><span>'+_aceL.upload+'</span></a>';
                    fieldHtml += '					</div>';
                    fieldHtml += '				</div>';

                    if( !$.aceOverWatch.utilities.isVoid(settings.deletecode,true) ){
                        fieldHtml += '				<div class="'+$.aceOverWatch.classes.fileRemoveButton+' ace-label-align-top">';
                        fieldHtml += '					<div class="'+$.aceOverWatch.classes.iconButton+'">';
                        fieldHtml += '						<a class="'+$.aceOverWatch.classes.menubuttonTrigger+' '+$.aceOverWatch.classes.trashIcon+' '+$.aceOverWatch.classes.docRemove+'"><span>'+_aceL.remove+'</span></a>';
                        fieldHtml += '					</div>';
                        fieldHtml += '				</div>';
                    }

                    fieldHtml += '		</div>';
                    }

                    fieldHtml += '		<input type="file">';
                    fieldHtml += '</label>';

                    fieldHtml += '</div>​';
                }
                return fieldHtml;
            },

            afterInit : function( target, what ){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                if (settings.atype=='image') {
                    containerField.find('div.'+ $.aceOverWatch.classes.photoRemove).ace('create',{
                        type : 'iconbutton',
                        iconcls :  settings.trashicon,
                        action : function(){
                            $.aceOverWatch.field.uploadbutton.delFile(target);
                        }
                    });
                }
                else {
                    containerField.find('.'+$.aceOverWatch.classes.docRemove).unbind('click').click(function (e) {

                        var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                        var settings = target.data($.aceOverWatch.settings.aceSettings);

                        settings.deletetriggeredfrombutton=true;
                        $.aceOverWatch.field.uploadbutton.delFile(target);
                    });
                    containerField.find('.'+$.aceOverWatch.classes.fileUploadButton).unbind('click').click(function (e) {

                        var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                        var settings = target.data($.aceOverWatch.settings.aceSettings);

                        settings.uploadtriggeredfrombutton=true;
                    });
                }

                if( settings.enableviewlink ){
                    containerField.find('.view-link').unbind('click').click(function (e) {
                        var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                        var settings = target.data($.aceOverWatch.settings.aceSettings);
                        window.open(settings.currentdoc, '_tab');
                    });

                }

                containerField.find('input').unbind().change(function(e){

                    var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                    var settings = target.data($.aceOverWatch.settings.aceSettings);

                    if (settings.autosaveonselectfile) {
                        $.aceOverWatch.field.uploadbutton.uploadFile(target);
                    }

                }).click(function (e){

                    var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                    var settings = target.data($.aceOverWatch.settings.aceSettings);

                    if ($.isFunction(settings.onbeforeclick)) {
                        if( !settings.onbeforeclick(target) ){
                            return false;
                        }
                    }else{
                        if ($.isFunction(window[settings.onbeforeclick])) {
                            if( !window[settings.onbeforeclick](target) ){
                                return false;
                            }
                        }
                    }

                    //here the veent will be triggered even if the user clicked upload or delete buttons
                    if ((settings.atype!='image')) {
                        if (settings.uploadtriggeredfrombutton) {
                            settings.uploadtriggeredfrombutton=false;;//reset this after  dealing with upload click
                            //e.stopPropagation();
                            return true;
                        }
                        else
                        if (settings.deletetriggeredfrombutton) {
                            settings.deletetriggeredfrombutton = false;//reset this after  dealing with delete click
                            e.preventDefault();
                            return false;
                        }
                        else {
                            if (settings.currentdoc!='') {
                                window.open(settings.currentdoc, '_tab');
                                e.preventDefault();
                                return false;
                            }
                        }

                        //if (settings.currentdoc!='') e.preventDefault();
                    }
                });
            },
            uploadFile : function(target) {
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                var fileInput = containerField.find('input');

                if (($.aceOverWatch.utilities.isVoid(fileInput)) ||
                    ($.aceOverWatch.utilities.isVoid(fileInput.length)) ||
                    (fileInput.length <= 0)
                ) {
                    return;
                }

                var saveNow = true;
                var file = fileInput[0].files[0];
                if ($.aceOverWatch.utilities.isVoid(file)) {
                    saveNow = false;
                }
                else {
                    name = file.name;
                    size = file.size;
                    type = file.type;

                    if(file.name.length < 1) {
                        saveNow = false;
                    }
                }

                $.extend(true,settings.net.extraparams,settings.uploadparameters);
                var otherFields = {};

                if ($.isFunction(settings.sendaditionalfieldsonsave)) {
                    $.extend(true,otherFields,settings.sendaditionalfieldsonsave(target));
                }else{
                    if ($.isFunction(window[settings.sendaditionalfieldsonsave])) {
                        $.extend(true,otherFields,window[settings.sendaditionalfieldsonsave](target));
                    }
                }

                if ($.isFunction(settings.onbeforesave)) {
                    if( !settings.onbeforesave(target,otherFields) ){
                        return false;
                    }
                }else{
                    if ($.isFunction(window[settings.onbeforesave])) {
                        if( !window[settings.onbeforesave](target,otherFields) ){
                            return false;
                        }
                    }
                }



                if (saveNow) {
                    if(settings.maximagesize != 0 && file.size > settings.maximagesize ) {
                        $.aceOverWatch.prompt.show( _aceL.fztb + String(parseFloat(settings.maximagesize) / 1024 / 1024)+' MB!',null,{type:'alert'});
                        return;
                    }
                    if (settings.atype=='image') {
                        if(file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/gif' && file.type != 'image/jpeg' && file.type != 'image/bmp') {
                            $.aceOverWatch.prompt.show( _aceL.uif,null,{type:'alert'});
                            return;
                        }
                    }

                    $.aceOverWatch.net.saveImage(target, settings.destinationfield, file, {},otherFields );
                }
                else {
                    if (Object.keys(otherFields).length !== 0 || otherFields.constructor !== Object) {
                        var saveRec = $.aceOverWatch.record.create(otherFields,'_document_id');
                        saveRec.makeItAllDirty();
                        $.aceOverWatch.net.save(target, saveRec, {});
                    }
                }
            },

            delFile : function(target) {
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                if (($.aceOverWatch.utilities.isVoid(settings.currentdoc)) || (settings.currentdoc===settings.deletecode)|| (settings.currentdoc.indexOf('?')===0)) {
                    $.aceOverWatch.prompt.show( _aceL.fupld,null,{type:'alert'});
                    return false;
                }
                $.aceOverWatch.prompt.show(_aceL.suredel,function() {
                    var delData = {};
                    delData[settings.deletefield] = settings.deletecode;

                    if ($.isFunction(settings.sendaditionalfieldsondelete)) {
                        $.extend(true,delData,settings.sendaditionalfieldsondelete(target));
                    }else{
                        if ($.isFunction(window[settings.sendaditionalfieldsondelete])) {
                            $.extend(true,delData,window[settings.sendaditionalfieldsondelete](target));
                        }
                    }
                    
                    if( settings.currentdocfilename && settings.currentdocfilename.length > 0 ){
                    	delData['delete_file_name'] = settings.currentdocfilename;
                    }

                    $.extend(true,settings.net.extraparams,settings.deleteparameters);
                    $.aceOverWatch.net.save(target, delData );
                },{type:'question'});


            },

            val : function(target, value, extra, record){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                var new_val = '', new_iconcls = '';
                //if the given value is an object this means that i can get the new url and the new iconclass
                if ($.isPlainObject(value)) {
                    if(! $.aceOverWatch.utilities.isVoid(value.url) ) new_val = value.url;
                    if(! $.aceOverWatch.utilities.isVoid(value.iconcls) ) new_iconcls = value.iconcls;
                }
                else {
                    //otherwise i get only a new url in the value
                    new_val = value;
                }

                if( $.aceOverWatch.utilities.isVoid(new_val) ){
                    return settings.currentdoc;
                }else{
                    if (new_val===settings.deletecode) {//the doc was just deleted or not set yet
                        if (settings.atype=='image') containerField.find('label').css('background-image','none');
                        else containerField.find('.'+$.aceOverWatch.classes.fileUploadPlaceholder).html(settings.placeholder); //set the text to initial placeholder
                        settings.currentdoc = '';
                        settings.currentdocfilename = '';
                    }
                    else { //i have a doc url
                        settings.currentdoc = new_val;
                        settings.currentdocfilename = '';
                        if (new_val!=='') settings.currentdoc+='?'+Date.now(); //if is not void then i add a timestamp to be sure i get the last version all the time ...
                        
                        if(
                     		   settings.explicitfilenamefield.length > 0
             			){
                     		if( value.data ){
                     			settings.currentdocfilename = value.data[settings.explicitfilenamefield];
                     		}else{
                     			if( record ){
                     				settings.currentdocfilename = record.val(settings.explicitfilenamefield);
                     			}
                     		}
                     	}else{
                     		let docParts = new_val.split('/');
                             settings.currentdocfilename = docParts[docParts.length-1];
                     	}
                        
                        
                        if (settings.atype=='image') {
                            containerField.find('label').css('background-image','url('+settings.currentdoc+')');
                        }
                        else {
                            if (new_val!=='') {
                                containerField.find('.'+$.aceOverWatch.classes.fileUploadPlaceholder).html(settings.currentdocfilename);
                            }
                            else containerField.find('.'+$.aceOverWatch.classes.fileUploadPlaceholder).html(settings.placeholder); //set the text to initial placeholder
                        }
                    }

                    if( !$.aceOverWatch.utilities.isVoid(new_iconcls) ){
                        containerField.find('i.'+$.aceOverWatch.classes.fileUploadIconType).removeClass(settings.currentdociconcls);
                        settings.currentdociconcls = new_iconcls;
                        containerField.find('i.'+$.aceOverWatch.classes.fileUploadIconType).addClass(settings.currentdociconcls);
                    }
                }
            },

            uploadSuccessful : function(target,data){
            	if( !data ){
            		data = {};
            	}
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);
                var docsrc = data[settings.fieldname];
                if ($.aceOverWatch.utilities.isVoid(docsrc)) {
                    if (settings.atype=='image') docsrc=settings.deletecode;//force the hide of the image if it was deleted or if by default the software returns void string for files that are not on the disk
                    else docsrc='';
                }
                //set the value of this field
                $(target).ace('value',{
                    url:docsrc,
                    iconcls:data[settings.filetypeiconfield],
                    data : data,
                });

                //I have to set the returned path on the form's record if there is a form because that path should be passed back to a grid or something not to be needed for a reload just to get this value
                var myForm = $(target).closest('.'+$.aceOverWatch.classes.formContainer).parent();
                if (myForm.length>0) {
                    var myRec = myForm.ace('value');
                    if (myRec) {
                        myRec.val(settings.fieldname, data[settings.fieldname]);
                    }
                }
                if ($.isFunction(settings.onuploadsuccessful)) {
                    settings.onuploadsuccessful(target, data[settings.fieldname], data);
                }else{
                    if ($.isFunction(window[settings.onuploadsuccessful])) {
                        window[settings.onuploadsuccessful](target, data[settings.fieldname], data);
                    }
                }
                $(target).find('input').val('');

            }

        },

        /**
         * begin menubutton object
         * this field transforms a div into a button, which when press will present a menu down bellow
         * a callback needs to be specified which will execute stuff based on the index of the subitem pressed
         */
        menubutton : {
            create : function(target,settings){

                $.extend(true,settings, $.extend(true,{
                    items:[],		//a list of items to be displayed
                    onselect:null,	//a function which is going to be executed when a menu item is pressed

                    value: "",
                    iconcls: "",	//custom icon; if not specified, it the standard elipses will be used
                    //private fields:
                    innerItems:[],
                }, settings ));

                //if no items exist and none were give, try to find some in the html data tags
                if( settings.innerItems.length == 0 && !settings.items || !settings.items instanceof Array || settings.items.length == 0 ){
                    settings.items = $.aceOverWatch.utilities.getAsociatedDataArr(target,'items');
                }

                if( settings.items.length > 0 ){
                    settings.innerItems = [];

                    for(var idx in settings.items){
                        settings.innerItems.push(
                            $.extend(true, {
                                    type:'simple',		//default type; other can be: radio, checkbox, separator
                                    name:'',			//for radio buttons, a name to group them?
                                    label:'',			//the text to be displayed
                                    tag:'',				//used to group several items
                                    hidden:false,
                                    value:'',
                                    iconcls:'',
                                    action:null,		//to define a custom action
                                    
                                    checked:false,		//if true, and if the item is of types checkbox and radiogroups, the item will be checked
                                    image:''			//for image entries, it represents the url to the image it needs to be displayed
                                },
                                settings.items[idx])
                        );
                    }

                }


                fieldHtml = '';

                var fieldHtml = '<div class="'+$.aceOverWatch.classes.menubutton+'" >';

                var classes = [
                    'ace-advanced-expand',
                    'ace-input',
                    $.aceOverWatch.classes.menubuttonTrigger,
                ];


                if ($.aceOverWatch.utilities.isVoid(settings.iconcls, true)) {
                    settings.iconcls = $.aceOverWatch.classes.moreMenuIcon;
                }

                fieldHtml += '<a class="'+classes.join(' ')+'"><div class="'+settings.iconcls+'"></div> '+($.aceOverWatch.utilities.isVoid(settings.value)?'':settings.value)+'</a>';
                fieldHtml += '<ul class="'+$.aceOverWatch.classes.menuDropDown+'">';

                //now.. lets build the menu entries
                for(var idx in settings.innerItems){
                    var item = settings.innerItems[idx];
                    fieldHtml += $.aceOverWatch.field.menubutton.buildItemFromDataObject(item,idx);
                }

                fieldHtml += '</ul>';
                fieldHtml += '</div>';

                return fieldHtml;
            },

            /**
             * removes all the menu entries with the specified tag
             */
            removeAllTagItems : function(target, tag){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                containerField.find('li[tag="'+tag+'"]').remove();

                /*for(var idx in settings.innerItems){
					if(settings.innerItems[idx].tag==tag){
						settings.innerItems.splice(idx,1);
					}
				}*/

                for(var idx = 0; idx < settings.innerItems.length; ){
                    if(settings.innerItems[idx].tag==tag){
                        settings.innerItems.splice(idx,1);
                    }else{
                        idx++;
                    }
                }

            },

            /**
             * inserts new elements after the item with the specified tag
             */
            insertElementsAfterTag : function(target, tag, items){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                var targetLi = containerField.find('li[tag="'+tag+'"]').first();
                if( targetLi.length == 0 ){
                    return;//the tag was not found
                }
                //find the index of the li
                var idx = parseInt(targetLi.attr('idx'));

                //ok.. insert the items INTO the innerItems
                settings.innerItems.splice.apply(settings.innerItems, [idx+1, 0].concat(items));

                var htmlCode = '';

                for(var idx in settings.innerItems){
                    var item = settings.innerItems[idx];
                    htmlCode += $.aceOverWatch.field.menubutton.buildItemFromDataObject(item,idx);
                }

                //ok.. now.. replace the existing menu entries with ALL the new ones...
                containerField.find('.'+$.aceOverWatch.classes.menuDropDown).empty();
                containerField.find('.'+$.aceOverWatch.classes.menuDropDown).append(htmlCode);

                $.aceOverWatch.field.menubutton.afterInit(target);
            },

            /**
             * returns a menu entry item from the data specified
             */
            buildItemFromDataObject : function(dataObj,idx){
                var item = '';

                let hiddenClass = dataObj['hidden'] ? $.aceOverWatch.classes.hide : '';
                let checked = (dataObj.checked ? 'checked="checked"' : '')

                switch(dataObj.type){
                    case 'radio':
                        item += '<li idx="'+idx+'" tag="'+dataObj['tag']+'" class="ace-col-12 '+hiddenClass+'"><label class="'+$.aceOverWatch.classes.label+'"><input type="radio" class="'+$.aceOverWatch.classes.radioSimple+'" name="'+dataObj.name+'" '+checked+'><span>'+dataObj.label+'</span></label></li>';
                        break;
                    case 'checkbox':
                        item += '<li idx="'+idx+'" tag="'+dataObj['tag']+'" class="ace-col-12"><label class="'+$.aceOverWatch.classes.label+'"><input type="checkbox" '+checked+'><span>'+dataObj.label+'</span></label></li>';
                        break;
                    case 'separator':
                        item += '<li class="ace-col-12 '+$.aceOverWatch.classes.separator+'" tag="'+dataObj['tag']+'"></li>';
                        break;
                    case 'grouplabel':
                        item += '<li idx="'+idx+'" tag="'+dataObj['tag']+'" class="ace-col-12 '+$.aceOverWatch.classes.menubuttonGroupLabel+' '+hiddenClass+'">'+dataObj.label+'</li>';
                        break;
                    case 'image':
                        item += '<li idx="'+idx+'" tag="'+dataObj['tag']+'" class="ace-col-12 '+hiddenClass+'"><a class="'+$.aceOverWatch.classes.menuDropDownLink+'"><img src="'+dataObj['image']+'" />'+dataObj.label+'</a></li>';
                        break;
                    case 'simple':
                    default:
                        var elIcon = '';
                        if (!$.aceOverWatch.utilities.isVoid(dataObj.iconcls)) elIcon = '<i class="'+dataObj.iconcls+'"></i>';
                        item += '<li idx="'+idx+'" tag="'+dataObj['tag']+'" class="ace-col-12 '+hiddenClass+'"><a class="'+$.aceOverWatch.classes.menuDropDownLink+'">'+elIcon+dataObj.label+'</a></li>';
                        break;
                }

                return item;
            },

            afterInit : function( target, what ){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                containerField.find('.'+$.aceOverWatch.classes.menubuttonTrigger).unbind('click').click(function(){
                    $.aceOverWatch.field.menubutton.toogle(this);
                    return false;
                });

                containerField.find('.'+$.aceOverWatch.classes.menuDropDown+' li').unbind('click').click(function(){

                    var containerField = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                    var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                    var idx = $(this).attr('idx');
                    switch( settings.innerItems[idx].type ){
                        case 'separator':
                        case 'grouplabel':
                            return;//don't do anything in this case

                        case 'radio':
                            $(this).find('input').prop('checked',true);
                            break;

                        case 'checkbox':
                            var el = $(this).find('input');
                            el.prop('checked',!el.prop('checked'));
                            break;
                    }

                    if ( (!$.aceOverWatch.utilities.isVoid(settings.innerItems[idx].action)) && ($.isFunction(settings.innerItems[idx].action)) ){
                        settings.innerItems[idx].action(idx,settings.innerItems[idx]['tag'],settings.innerItems[idx]['value']);
                    }
                    else
                    if ((settings.innerItems[idx].action!=='') && ($.isFunction(window[settings.innerItems[idx].action]))){
                        window[settings.innerItems[idx].action](idx,settings.innerItems[idx]['tag'],settings.innerItems[idx]['value']);
                    }

                    $.aceOverWatch.field.menubutton.toogle(this);

                    if( $.isFunction(settings.onselect) ){
                        settings.onselect(idx,$(this).attr('tag'),$(this).attr('value'));
                    }else{
                        if ($.isFunction(window[settings.onselect])) {
                            window[settings.onselect](idx,settings.innerItems[idx]['tag'],settings.innerItems[idx]['value']);
                        }

                    }
                    return false;
                });


                $.aceOverWatch.eventManager.registerEvent('outsideclick',
                    containerField,
                    containerField,
                    function(el)       {
                        el.find('.'+$.aceOverWatch.classes.menubuttonTrigger).removeClass($.aceOverWatch.classes.menubuttonActive);
                        el.find('.'+$.aceOverWatch.classes.menuDropDown).hide();
                    }
                );

            },

            /**
             * shows the entry at indexess specied from the menu
             *
             * * @param tags - an array of tags
             */
            hideEntriesAtTags:function(target, tags){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                for(var idx in tags ){
                    var el = containerField.find('li[tag="'+tags[idx]+'"]');
                    el.addClass($.aceOverWatch.classes.hide);
                    var index = parseInt(el.attr('idx'));
                    if( settings.innerItems[index] ){
                        settings.innerItems[index].hidden = true;
                    }
                }
            },

            /**
             * shows the entries at indexess specied from the menu
             *
             * * @param tags - an array of tags
             */
            showEntriesAtTags:function(target, tags){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                for(var idx in tags ){
                    let el = containerField.find('li[tag="'+tags[idx]+'"]');
                    el.removeClass($.aceOverWatch.classes.hide);
                    let index = parseInt(el.attr('idx'));
                    if( settings.innerItems[index] ){
                        settings.innerItems[index].hidden = false;
                    }
                }
            },

            //the function will flip the visibility of the menu bar
            toogle: function(insideEl){
                var containerField = $(insideEl).closest('.'+$.aceOverWatch.classes.containerField);
                containerField.find('.'+$.aceOverWatch.classes.menubuttonTrigger).toggleClass($.aceOverWatch.classes.menubuttonActive);
                containerField.find('.'+$.aceOverWatch.classes.menuDropDown).fadeToggle( 100 );;
            }
        },// end begin menubutton object

        /**
         * begin form object
         * creates a form with fields, which can do save operations, etc
         */
        form : {

            create : function(target, settings){

                $.extend(true,settings, $.extend(true,{
                    ftype:'popup',			//or something else!
                    savetype:'GET',			//set it to post to save the data as post.. helpful when sending BIG amounts of data
                    template:'',
                    renderto:'',
                    parseastemplate:false,
                    displaysavebtn:true,
                    displaycancelbtn:true,

                    hideonescape : false,

                    validate:false,			//true if form will try to validate the fields
                    makeelementvisible:null,	//a function, or the name of a function which will make a field visible
                    //params( target, element )
                    //we do it like this, becase the scrolling needs to be on a case by case bases.. don't think a general appraoch might be

                    validateOnlyVisibleSections:false, //only takes effect if the form has sections; if true, only the visible sections will be validated
                    onAfterSectionsValidation:null, //called after a form with sections is validated! function(target, validSectionsArray, invalidSectionsArray)
                    // 			validSectionsArray and invalidSectionsArray - array of the section's tags

                    customsavetext:'',		//if lenght > 0 it will be the text displayed on the save button
                    customcanceltext:'',		//if lenght > 0 it will be the text displayed on the cancel button

                    customfooterbuttons : [],	//an array describing other buttons to be added to the form\
                    /**
                     * [
                     * 	{
                     * 		text : 'press me',				//the text to display
                     * 		handler : function(target){		//the function which is called when the button is pressed
                     * 				... stuff....
                     * 		},
                     * 		class:''						//custom classes to add to it
                     *  }
                     * 	.....
                     * ]
                     */
                    parent:null,			//the ace object to which this form belongs

                    readonly:false,			//if true, ALL ace controlls inside will be marked as readonly
                    checkdirtyoncancel:true,	//by default, the form checks if it is dirty on cancel; if it is, it will ask if the user is sure

                    //user custom functions:
                    record:null,			//the record used to display stuff
                    oninit:null,			//called when the form is created and added to the dom	params:(form)
                    onshow:null,			//called when the form is displayed						params:(form)
                    customshow:null,		//the one implementing this function is expected to provide a way to display the form	params:(form,conainerId)
                    customhide:null,		//the one implementing this function is expected to provide a way to hide the form	params:(form,conainerId)
                    onlocalsavesuccessfull:null,//called when form saves something successfully LOCALY, not remotely!(target, record)
                    onsavesuccessful:null,	//called when form saves something successfull.. (target, record)
                    onsaveerror:null,	//called when form saves something and success:false returns
                    hideaftersave : true,
                    sendallfieldsonsave : false, //true to send all fields on save

                    onbeforeloadrecord:null,//a function, or the name of a function to be called BEFORE a record is loaded in the form	params:(form, record)
                    onafterloadrecord:null,//a function, or the name of a function to be called AFTER a record is loaded in the form	params:(form, record)

                    onbeforesave:null, 	//called before the saving process actually begins, AFTER it has passed through the validations params:(form, record)
                    //the function MUST return true if the form is to save itself

                    autoloadfieldsonshow:true,//if true, the fields which load remotely detected on the form will be loaded (comboboxes, and grids)

                    assignedToGridRowIdx:-2,	//if this is used by a grid to display row elements, then this is the row it displays; used to set current edit row when the form wants to save itself

                    idfield : '',
                    createcmd: 'create',

                    enablekeynavigation : false,//true, if we want to enable key navigation
                    autosaveonlastenter : true,	//only when enablekeynavigation is true; if TRUE, when enter is pressed on the last ace field with an input field, then the form will attempt to save itself

                    customclasses : '', //a string of css classes to be added to the form-container div, for extra customization
                    
                    alwayskeeprecordreference : false,//if set to true, the record will always keep its current reference over multiple load record operations

                }, settings ));

                if( jQuery.isFunction(window[settings.customshow]) ){
                    settings.customshow = window[settings.customshow];
                }
                if( jQuery.isFunction(window[settings.customhide]) ){
                    settings.customhide = window[settings.customhide];
                }

                var makeelementvisible = null;
                if ($.isFunction(settings.makeelementvisible)) {
                    makeelementvisible = settings.makeelementvisible;
                }else{
                    if ($.isFunction(window[settings.makeelementvisible])) {
                        makeelementvisible = window[settings.makeelementvisible];
                    }
                }
                settings.makeelementvisible = makeelementvisible;

                if( settings.idfield ){
                    settings.net.idfieldname = settings.idfield;
                }

                if( $('#'+settings.template).length == 0 ){ //no template found, don't create edit form
                    $.aceOverWatch.utilities.log('Failed to create form. No templated detected! :> '+'#'+settings.template);
                    return '';
                }

                if( settings.ftype == 'popup'){
                    $(target).addClass($.aceOverWatch.classes.formPopup);
                }else{
                    $(target).removeClass($.aceOverWatch.classes.formPopup);//just in case it was modified
                }

                /*
                 * need to set this for the layout to work in some cases in firefox
                 */
                var style = '';
                if( settings.forcefullheight === true ){
                    style = ' style="height:100%;" ';
                }


                //TODO: do some verifications of these parameters to make sure all are as they should
                var fieldHtml = '<div class="'+$.aceOverWatch.classes.formContainer+' ' + settings.customclasses+'"'+style+'><div class="'+$.aceOverWatch.classes.formInner+'" '+style+'></div><br class="'+$.aceOverWatch.classes.clear+'"/>';

                //set the footer
                var footerButtons = [];
                var footerClasses = [$.aceOverWatch.classes.formFooter];

                if( !settings.displaysavebtn && !settings.displaycancelbtn && settings.customfooterbuttons.length == 0 ){
                    footerClasses.push($.aceOverWatch.classes.hide);
                }else{

                    if( settings.displaysavebtn ){
                        footerButtons.push('<button action="save">'+((settings.customsavetext && settings.customsavetext.length > 0)?settings.customsavetext:_aceL.save)+'</button>');
                    }
                    if( settings.displaycancelbtn ){
                        footerButtons.push('<button action="cancel">'+((settings.customcanceltext && settings.customcanceltext.length > 0)?settings.customcanceltext:_aceL.cancel)+'</button>');
                    }

                    for(var idx in settings.customfooterbuttons){
                        footerButtons.push('<button customaction="'+idx+'" class="'+settings.customfooterbuttons[idx].class+'">'+settings.customfooterbuttons[idx].text+'</button>');
                    }

                }
                fieldHtml += '<div class="'+footerClasses.join(' ')+'">'+footerButtons.join('')+'</div>';
                fieldHtml += '<span class='+$.aceOverWatch.classes.errorMsg+'></span></div>';

                return fieldHtml;
            },

            validate : function(target, vlaue, errorObj ){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);
                errorObj.displayWarning = true;
                errorObj.markWithErrorClass = false;
                let isValid = settings.fields.ace('validate');
                if( !isValid ){
                    $.aceOverWatch.toast.show('error',_aceL.vchk);
                }
                return isValid;
            },

            /**
             * retrieves the form which contains the specified field
             * @param aceField jscript object
             */
            getParentForm : function(field){

                var settings = field.data($.aceOverWatch.settings.aceSettings);
                if( 		!$.aceOverWatch.utilities.isVoid(settings)
                    && 	!$.aceOverWatch.utilities.isVoid(settings.parentForm)
                ){
                    /*
                     * if ace field, and has a parent form set.. return it
                     */
                    return settings.parentForm;
                }else{
                    /*
                     * no ace field, or no form set... search upwords for a container form
                     */
                    return field.closest('.'+$.aceOverWatch.classes.formContainer).closest('.'+$.aceOverWatch.classes.containerField)
                }

            },

            afterInit : function(target,what){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                var innerEl = containerField.find('.'+$.aceOverWatch.classes.formInner);

                //cloaning the elements from the template
                innerEl.html( $('#'+settings['template']).children().clone(true,true) );

                //some elements from the template might need some extra stuff to do to make them usable
                //the datepicker is one of them; if it is only cloned, all the events from the clone will be transfered to the one from the template!
                innerEl.find('.'+$.aceOverWatch.classes.containerField).each(function(){

                    var settings = $(this).data($.aceOverWatch.settings.aceSettings);
                    if( !settings ){
                        return;
                    }

                    //here we need to get the settings to a new reference! otherwise all the fields will share the same one in all instances of the template
                    //and this is not good
                    var newSettings = {};
                    $.extend(true,newSettings, settings);
                    settings = newSettings;
                    $(this).data($.aceOverWatch.settings.aceSettings,settings);

                    if( settings.readonly ){
                        $(this).ace('modify',{readonly:true});
                    }else{
                        //on modify, after init is already ran... so for datepicker fields, if they just got themselves readonly, there is no need to run this AGAIN! I hope
                        //TODO: verify this
                        if( settings.type == 'datepicker'){
                            $.aceOverWatch.field.datepicker.afterInit(this,{all:true});
                        }
                    }

                });

                //setting up the default buttons actions
                containerField.find('[action="save"]').unbind('click').on('click',function(e){

                    var target = $.aceOverWatch.field.form.getParentForm($(this));

                    e.stopImmediatePropagation();
                    $.aceOverWatch.field.form.save(target);

                });

                containerField.find('[action="delete"]').unbind('click').on('click',function(e){
                    var target = $.aceOverWatch.field.form.getParentForm($(this));

                    e.stopImmediatePropagation();
                    $.aceOverWatch.field.form.deleteRecord(target);
                });

                containerField.find('[action="cancel"]').unbind('click').on('click',function(e){
                    var target = $.aceOverWatch.field.form.getParentForm($(this));

                    e.stopImmediatePropagation();
                    $.aceOverWatch.field.form.cancel(target, function(target) {
                        var containerField = $(target);
                        var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                        if (!settings) return;
                        var parent = $(settings.parent);
                        if (!parent) return;
                        if (!parent.data) return;

                        var parentSettings = parent.data($.aceOverWatch.settings.aceSettings);
                        if (!parentSettings) return;

                        if (!$.aceOverWatch.utilities.isVoid(parentSettings.rowedittpl))
                            $.aceOverWatch.field.grid.inlineDissmissRowEdit(settings.parent, true); //redraw the editing row
                    });
                });

                //setting up the custom buttons actions
                containerField.find('button[customaction]').unbind('action').on('click',function(){

                    var target = $.aceOverWatch.field.form.getParentForm($(this));
                    var settings = target.data($.aceOverWatch.settings.aceSettings);

                    var idx = parseInt($(this).attr('customaction'));
                    if( idx >= 0 && idx < settings.customfooterbuttons.length ){
                        if( jQuery.isFunction(settings.customfooterbuttons[idx].handler) ){
                            settings.customfooterbuttons[idx].handler(target);
                        }
                    }
                });

                //doing user custom initialization
                if( jQuery.isFunction(settings.oninit) ){
                    settings.oninit(target);
                }

                if( settings.hideonescape === true ){

                    /*need this to make the form catch key events*/
                    if( !containerField.attr('tabindex') ){
                        containerField.attr('tabindex',0);
                    }

                    containerField.keyup(function (e) {
                        switch(e.keyCode){
                            case 27://escape
                                e.preventDefault();
                                $.aceOverWatch.field.form.hide(this);
                                return false;
                                break;
                        }
                    });

                }

                $.aceOverWatch.field.form.setFields(target);
            },

            /*
             * computes the list of ace-fields found inside the form
             */
            setFields : function(target){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                if( !settings ){
                    return false;
                }

                //determine ALL the elements in the form, minus those present in templates and those present in other forms... or grids
                var mainFormContainer = containerField.find('.'+$.aceOverWatch.classes.formContainer).first();
                settings.fields = mainFormContainer.find('.'+$.aceOverWatch.classes.containerField).not(mainFormContainer.find('.'+$.aceOverWatch.classes.formContainer+', .'+$.aceOverWatch.classes.template+', .'+$.aceOverWatch.classes.gridContainer+', .'+$.aceOverWatch.classes.formIgnore).find('.'+$.aceOverWatch.classes.containerField));

                //determine if we have sections..
                settings.sections = {};
                var sections = mainFormContainer.find('.'+$.aceOverWatch.classes.section).not(mainFormContainer.find('.'+$.aceOverWatch.classes.formContainer+', .'+$.aceOverWatch.classes.template).find('.'+$.aceOverWatch.classes.section));

                //a section can be broken in multiple parts.. all sections with the same tag are part of the same section
                sections.each(function(){
                    var tag = $(this).attr('tag');
                    if( !settings.sections[tag] ){
                        settings.sections[tag] = [];
                    }
                    settings.sections[tag].push({
                        container:$(this),
                        fields : $(this).find('.'+$.aceOverWatch.classes.containerField).not(mainFormContainer.find('.'+$.aceOverWatch.classes.formContainer+', .'+$.aceOverWatch.classes.template).find('.'+$.aceOverWatch.classes.containerField)),
                    });
                });


                /*
                 * assign each of these fields an unique index; we'll use these to determine to which field we should jump when the enter key is pressed
                 * also.. keep a reference pointing at the parent form
                 */
                var tabIndex = 0;
                settings.fields.each(function(){

                    var settings = $(this).data($.aceOverWatch.settings.aceSettings);
                    if( $.aceOverWatch.utilities.isVoid(settings) ){
                        return;
                    }
                    settings.aceTabIndex = (tabIndex++);
                    settings.parentForm = containerField;

                });

                //now, to simplify navigation, place a handler on the enter key being pressed, and move to next element, or, if at the end, trigger form saving
                if( settings.enablekeynavigation ){
                    settings.fields.unbind('keyup').keyup(function(e){

                        e.stopImmediatePropagation();

                        if( e.keyCode == 13 ){
                            var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                            var settings = target.data($.aceOverWatch.settings.aceSettings);
                            
                            if(
                            		settings.type == 'button'
                                || 	settings.type == 'iconbutton'
                                || 	settings.type =='autocomplete'
                                || 	settings.type=='chips'
                                || 	settings.type=='textarea'
                            	||	settings.type == 'breadcrumbs'
                        		||	settings.type == 'progressbar'
                    			||	settings.type == 'wizard'
                        		)
                            {	//TODO add more type to which custom navigation should not be imlemented
                                //don't do custom navigation for these buttons...
                                return;
                            }

                            //console.log('enter was pressed here! ace tab index: '+settings.aceTabIndex);

                            var form = $.aceOverWatch.field.form.getParentForm($(this));
                            var formSettings = form.data($.aceOverWatch.settings.aceSettings);

                            //ok... now.... now go to the next field which is NOT hidden/display or readonly
                            var nextFieldtoFocus = null;


                            if (!$.aceOverWatch.utilities.isVoid(settings)) {

                                for(var idx = settings.aceTabIndex+1; idx < formSettings.fields.length; idx++){
                                    var el = $(formSettings.fields[idx]);
                                    if( el.is(':visible') ){
                                        var fs = el.data($.aceOverWatch.settings.aceSettings);
                                        if( fs.type != 'display' && fs.type != 'hidden' && fs.readonly != false ){
                                            nextFieldtoFocus = el;
                                            break;
                                        }
                                    }
                                }
                            }
                            //if we have found a field to jump to.. jump to!
                            if(nextFieldtoFocus){
                                nextFieldtoFocus.find('input,select').first().focus();
                            }else{
                                //ok.. we weren't able to find a field to jump to next.. in this case...
                                //signal the form to save itself (the default behavioru), OR, jump to the first field, whichever it might be
                                if( formSettings.autosaveonlastenter ){
                                    $.aceOverWatch.field.form.save(form)
                                }else{
                                    if( formSettings.fields.length > 0 ){
                                        $(formSettings.fields[0]).find('input,select').first().focus();
                                    }
                                }
                            }
                        }

                    });
                }
            },

            //returns true if all is well, the record was loaded correctly
            //if something went wrong with the creation of the form, like the fact there was not template specified,
            //then there won't be any settings, and the loading will fail
            loadRecord : function(target,record, keepCurrentRecordReference){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if( !settings ){
                    return false;
                }

                /*
                 * in SOME cases.. we want to update the record OVER the current instance..
                 */
                if( keepCurrentRecordReference === true || settings.alwayskeeprecordreference === true ){
                    $.extend(true,settings.record,$.aceOverWatch.record.isRecord(record) ? record : $.aceOverWatch.record.create(record));
                }else{
                    settings.record = $.aceOverWatch.record.isRecord(record) ? record : $.aceOverWatch.record.create(record);
                }

                if( settings.net.idfieldname ){
                    settings.net.idfieldvalue = settings.record.val(settings.net.idfieldname);
                }

                if ($.isFunction(settings.onbeforeloadrecord)) {
                    if (settings.onbeforeloadrecord(target, settings.record)===false) return false;
                }else{
                    if ($.isFunction(window[settings.onbeforeloadrecord])) {
                        if (window[settings.onbeforeloadrecord](target, settings.record)===false) return false;
                    }
                }

                /*
                 * in some cases, during before load operations, other fields might have appeared in the form
                 * if that is the case, then the recompute_fields should be explicitdly set to true if the user
                 * desires to set data in those fields automatically!
                 */
                if(settings.record && settings.record.val('recompute_fields') == true ){
                    $.aceOverWatch.field.form.setFields(target);
                }

                //find all the field containers
                settings.fields.each(function(){
                    var fieldSettings = $(this).data($.aceOverWatch.settings.aceSettings);


                    if ($.aceOverWatch.utilities.isVoid(fieldSettings)) {
                        $.aceOverWatch.utilities.log('Unknonw field settings','error');
                        $.aceOverWatch.utilities.log(this,'error');
                        return;
                    }
                    fieldSettings.parentform = containerField;//all fields, if they are part of a form will have this member pointing at it


                    if(
                        ( fieldSettings.fieldname == '' )
                        &&
                        !(
                            !$.aceOverWatch.utilities.isVoid(fieldSettings.renderer)
                            &&
                            fieldSettings.type == 'display'
                        )
                    ){
                        return;//no custom field name, no gata setting or gathering
                    }

                    if(settings.record.val(fieldSettings.fieldname) == null ){
                        //doing this to create the field, because I need it to exist
                        //use the default value found in the form
                        //record.val(fieldSettings.fieldname,$(this).ace('value')); //modified by Silviu so it will not load the previous data from another edited field
                        settings.record.val(fieldSettings.fieldname,"");
                    }

                    if( fieldSettings.net.autosave ){
                        fieldSettings.net.fid = settings.net.fid;
                        fieldSettings.net.remote = settings.net.remote;
                        fieldSettings.net.idfieldname = settings.net.idfieldname;
                        fieldSettings.net.idfieldvalue = settings.net.idfieldvalue;
                    }

                    var extra = '';
                    if( fieldSettings.type == 'autocomplete' && fieldSettings.displayname.length > 0 ){
                        extra = settings.record.val(fieldSettings.displayname);
                    }
                    if( fieldSettings.type !== 'uploadbutton') {
                        $(this).ace('value',settings.record.val(fieldSettings.fieldname),extra,settings.record);
                    }
                    else {
                        var upldVal = {
                            url:settings.record.val(fieldSettings.fieldname),
                            iconcls:settings.record.val(fieldSettings.filetypeiconfield),
                        };
                        $(this).ace('value',upldVal,extra,settings.record);
                    }
                });

                if (settings.parseastemplate) {
                    //I have to parse the template
                    $.aceOverWatch.field.form.parseTemplate(target, settings.record);
                }

                if ($.isFunction(settings.onafterloadrecord)) {
                    if (settings.onafterloadrecord(target, settings.record)===false) return false;
                }else{
                    if ($.isFunction(window[settings.onafterloadrecord])) {
                        if (window[settings.onafterloadrecord](target, settings.record)===false) return false;
                    }
                }
                return true;
            },

            parseTemplate : function(target, rec, addSpaceAsSufix = true) {
                var containerField = $(target);

                containerField.find('acetpl').replaceWith(function(){
                    return $.aceOverWatch.utilities.renderer(rec.val($(this).attr('fieldname')),rec,$(this).attr('renderer'),addSpaceAsSufix);
                });
                containerField.find('[acetplclass]').addClass(function(){
                    return $(this).addClass($.aceOverWatch.utilities.renderer(rec.val($(this).attr('fieldname')),rec,$(this).attr('classtplrenderer')),addSpaceAsSufix);
                });
                containerField.find('[acetplstyle]').addClass(function(){
                    return $(this).addClass($.aceOverWatch.utilities.renderer(rec.val($(this).attr('fieldname')),rec,$(this).attr('styletplrenderer')),addSpaceAsSufix);
                });
            },

            updateRecord : function(target,fieldname, fieldvalue){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                if( !settings ){
                    return false;
                }

                if( settings.record ){
                    settings.record.val(fieldname,fieldvalue, true);//true to set the field as being clean, saved
                }

                //if the form is attached to a grid, or something else, notify it the record has been changed

                //notify the parent that data has changed
                //if the form doesn't have a parent, it is considered standalone
                var parentSettings = settings.parent ? $(settings.parent).data($.aceOverWatch.settings.aceSettings) : settings;

                switch(parentSettings.type){
                    case 'grid':
                        $.aceOverWatch.field.grid.redrawRow($(settings.parent), parentSettings, parentSettings.editCurrentRow);
                        break;
                    default:
                        break;
                }
            },

            clear : function(target){
                $.aceOverWatch.field.form.loadRecord(target,$.aceOverWatch.record.create());
            },

            isDirty : function(target){
                var containerField = $(target);
                var isDirty=false;

                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                if( ! settings) return false;

                if( !settings.record ){
                    return isDirty;
                }
                settings.fields.each(function(){
                    var fieldSettings = $(this).data($.aceOverWatch.settings.aceSettings);

                    let recordValue = settings.record.val(fieldSettings.fieldname);
                    let currentValue =  $(this).ace('value');
                    if( recordValue === null ){
                        recordValue = '';
                    }
                    if( currentValue === null ){
                        currentValue = '';
                    }

                    if( 	!$.aceOverWatch.utilities.isVoid(fieldSettings)
                        && 	!$.aceOverWatch.utilities.isVoid(fieldSettings.fieldname)
                        &&	fieldSettings.neversend != true
                        && 	(fieldSettings.fieldname.length > 0)
                        && 	!$.aceOverWatch.utilities.isVoid(settings.record)
                        && 	fieldSettings.type != 'display'//added this for 2 main reasons:
                        								   //-displays may have renderers, which will distort the information, and appear dirty even when they shouldn't actually be
                        								   //-display fields shoulnd't be used anyway to send / modify information, so they don't count
                        && recordValue != currentValue
                    ){
                        isDirty = true;
                        return false;//to break the each look, because we found at least one item which is dirty
                    }

                });

                return isDirty;
            },
            cancel : function(target, onformcanceledcallback, forcecancel) {
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if( !settings ){
                    $.aceOverWatch.utilities.log('cancel on invalid element!', 'debug', true);
                    return;
                }

                if ($.aceOverWatch.utilities.isVoid(forcecancel)) forcecancel = false;
                //if it is a new record then I would like to delete it
                var newRecord = false;
                var idFieldName = settings.idfield;
                if ($.aceOverWatch.utilities.isVoid(idFieldName)) idFieldName = '__newrecord';

                if( settings.record ){
                    var recId = settings.record.val(idFieldName);
                    if (!$.isNumeric(recId)) recId = -1;
                    if (recId <= 0) newRecord = true;
                }

                if ((forcecancel!==true) && settings.checkdirtyoncancel && $.aceOverWatch.field.form.isDirty(target)) {
                    $.aceOverWatch.prompt.show(_aceL.unsaved,function() {
                        if (newRecord) $.aceOverWatch.field.form.deleteRecord(target, true); //force delte - no other checks
                        $.aceOverWatch.field.form.hide(target);
                        if( $.isFunction(onformcanceledcallback) ){
                            onformcanceledcallback(target);
                        }else{
                            if( $.isFunction(window[onformcanceledcallback]) ){
                                onformcanceledcallback(target);
                            }
                        }
                        $(target).parents('.'+$.aceOverWatch.classes.appMobileWindow).removeClass('ace-show');
                        $('.'+$.aceOverWatch.classes.appContent).css('z-index','3');
                    },{type:'question'});

                }
                else {
                    if (newRecord) $.aceOverWatch.field.form.deleteRecord(target, true);//force delte - no other checks
                    $.aceOverWatch.field.form.hide(target);
                    if( $.isFunction(onformcanceledcallback) ){
                        onformcanceledcallback(target);
                    }else{
                        if( $.isFunction(window[onformcanceledcallback]) ){
                            onformcanceledcallback(target);

                        }
                    }
                }

            },

            /**
             * the function updates the internal record with the modified information from the fields
             *
             * ABOUT... the second and third parameters...
             * sometimes we might want the values of some fields to be placed in an extra record as well....
             * - extraRecord - must be a record which will receive the data !!! Note this should be a record
             * - extraFieldVerificationFunction - must be a function which will take as a parameter the field itself, and return true or false, if it's value should or not be added to the extra record...
             * - extraIncludeNormal - if true, the extra field will also be included into the normal record... if not.. not...
             * - alltoExtraOnly - if true, there's going to be no validation, and ALL the field's values will be added TO the extra record, and nothing will be updated to the form's record
             *
             *  who uses this extra functionality:
             *   - atm, the filter field; when retrieving the data, the filter object needs the extra record to know which fields to send directly to the server, and not as part of the filter
             *
             */
            retrieveNewRecordData:function(target,extraRecord,extraFieldVerificationFunction, extraIncludeNormal, alltoExtraOnly, surpressMessages){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if( settings.validate && alltoExtraOnly  != true ){

                    //ok.. if we have sections.. we'll validate the sections^^ otherwise, we'll validate the entire fields
                    if( Object.keys(settings.sections).length > 0 ){

                        var validSections = [];
                        var invalidSections = [];

                        for(var tag in settings.sections ){

                            if( settings.validateOnlyVisibleSections ){
                                //test to see there is at least one visible subsection!
                                var atLeastOneSubSectionVisible = false;

                                for(var idxSubsection in settings.sections[tag] ){
                                    if( settings.sections[tag][idxSubsection].container.is(':visible') ){
                                        atLeastOneSubSectionVisible = true;
                                        break;
                                    }
                                }

                                if( !atLeastOneSubSectionVisible ){//jump to next section! this one's invisible, so therefor valid!
                                    validSections.push(tag);
                                    continue;
                                }
                            }

                            //now.. let's validate ALL subsections!
                            var isSectionValid = true;
                            for(var idxSubsection in settings.sections[tag] ){
                                isSectionValid = isSectionValid && settings.sections[tag][idxSubsection].fields.ace('validate');
                            }

                            if( isSectionValid ){
                                validSections.push(tag);
                            }else{
                                invalidSections.push(tag);
                            }
                        }

                        //execute callback, if one is defined!
                        if( $.isFunction(settings.onAfterSectionsValidation) ){
                            settings.onAfterSectionsValidation(target, validSections, invalidSections);
                        }else{
                            if( $.isFunction(window[settings.onAfterSectionsValidation]) ){
                                window[settings.onAfterSectionsValidation](target, validSections, invalidSections);
                            }
                        }


                        if( invalidSections.length > 0 ){
                            return false;//invalid form!
                        }

                    }else{

                        if( !settings.fields.ace('validate') ){
                            if( settings.makeelementvisible ){
                                //notify the app to make the field visible
                                settings.makeelementvisible(containerField,settings.fields.filter('.'+$.aceOverWatch.classes.containerField+'.'+$.aceOverWatch.classes.error).first());
                            }
                            if (surpressMessages!==true){
                                $.aceOverWatch.toast.show('error',_aceL.vchk);
                            }
                            return false;
                        }

                    }
                }


                var setFirstValueAsDirty = false;//true, if the record didn't exist, so all new fields should be given an empty value, so who do have values from the form will be set as dirty and set on the net
                if( !settings.record && !alltoExtraOnly ){
                    settings.record = $.aceOverWatch.record.create();
                    setFirstValueAsDirty = true;
                }

                //find all the field containers
                var excludedTypes = ['display','form','grid','button','iconbutton','breadcrumbs','progressbar','wizard'];

                var testForExtraRecordFields = $.aceOverWatch.record.isRecord(extraRecord) && jQuery.isFunction(extraFieldVerificationFunction);

                settings.fields.each(function(){

                    var fs = $(this).data($.aceOverWatch.settings.aceSettings);

                    if( $.aceOverWatch.utilities.isVoid(fs) ){
                        return;
                    }

                    //some fields are not to be included when gathering data....
                    if( excludedTypes.indexOf(fs.type) != -1){
                        return;
                    }

                    if( fs.fieldname == '' ){
                        return;//no custom field name, no gata setting or gathering
                    }

                    //doing extra record verification
                    if( testForExtraRecordFields && extraFieldVerificationFunction(fs) ){
                        extraRecord.val(fs.fieldname, $(this).ace('value'));
                        if( extraIncludeNormal != true ){
                            return;
                        }
                    }
                    /*
                     * if we're only interested in updating the extra record, stop here..
                     */
                    if( alltoExtraOnly == true ){
                        return;
                    }

                    /*
                     * making sure we have the correct settings obj
                     */
                    var settings = $.aceOverWatch.field.form.getParentForm($(this)).data($.aceOverWatch.settings.aceSettings);

                    if( setFirstValueAsDirty ){
                        //setting an empty value first, if needed, to consider this value as dirty
                        settings.record.val(fs.fieldname,'');
                    }

                    settings.record.val(fs.fieldname,$(this).ace('value'));

                    if( fs.neversend ){
                        settings.record.setDirty(fs.fieldname,false);
                    }
                    if(
                        fs.alwayssend
                        || (
                            setFirstValueAsDirty
                            &&	!fs.neversend
                        )
                    ){
                        settings.record.setDirty(fs.fieldname,true);
                    }
                });

                return true;
            },

            save : function(target){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                //gets the new information from the form's fields
                if( !$.aceOverWatch.field.form.retrieveNewRecordData(target) ){
                    return;
                }

                //notify the parent that data has changed
                //if the form doesn't have a parent, it is considered standalone
                var parentSettings = settings.parent ? $(settings.parent).data($.aceOverWatch.settings.aceSettings) : settings;
                var callbacks = {
                    onsuccess : settings.onsavesuccessful,
                    onerror : settings.onsaveerror,
                    onlocalsavesuccessfull: settings.onlocalsavesuccessfull,
                };

                if( jQuery.isFunction(settings.onbeforesave) ){
                    if( !settings.onbeforesave(target, settings.record) ){
                        $.aceOverWatch.utilities.log('OBS method failed', 'warning', false);
                        return false;
                    }
                }else{
                    if ($.isFunction(window[settings.onbeforesave])) {
                        if( !window[settings.onbeforesave](target, settings.record) ){
                            $.aceOverWatch.utilities.log('OBS method failed', 'warning', false);
                            return false;
                        }
                    }
                }

                if (settings.sendallfieldsonsave) {
                    settings.record.makeItAllDirty();
                }
                switch(parentSettings.type){
                    case 'grid':
                        if( settings.assignedToGridRowIdx != -2 ){//-2 is the default value
                            var sgrid = $(settings.parent).data(($.aceOverWatch.settings.aceSettings));
                            sgrid.editCurrentRow = settings.assignedToGridRowIdx;
                        }

                        $.aceOverWatch.field.grid.save(settings.parent,callbacks);
                        //if the save is a success, the grid will make sure to do something with the form
                        break;
                    case 'form':


                        if( settings.net.remote == true ){

                            if ($.aceOverWatch.utilities.isVoid(settings.saveoptions)) {
                                settings.saveoptions = {};
                                if (!$.aceOverWatch.utilities.isVoid(settings.savetype))
                                {
                                    settings.saveoptions['type'] = settings.savetype;
                                }

                            }
                        }


                        if( settings.net.idfieldname ){
                            settings.record.setDirty(settings.net.idfieldname,true);
                        }
                        if ((settings.net.idfieldname!=='')&&(parseInt(settings.record.val(settings.net.idfieldname))===-1))
                            $.aceOverWatch.net.save(target,settings.record,callbacks,settings.createcmd,settings.saveoptions);
                        else
                            $.aceOverWatch.net.save(target,settings.record,callbacks,null,settings.saveoptions);
                        break;
                    case 'accordion':
                        $.aceOverWatch.field.accordion.save(settings.accordionparnetitem,settings.record,callbacks);
                        break;
                    default:
                        $.aceOverWatch.field.form.hide(target);
                        break;
                }
            },

            deleteRecord : function(target, forceDelete){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                //gets the new information from the form's fields

                if (($.aceOverWatch.utilities.isVoid(forceDelete)) || (!forceDelete)) {
                    if ( !$.aceOverWatch.field.form.retrieveNewRecordData(target) ) return;
                }

                //notify the parent that data has changed
                //if the form doesn't have a parent, it is considered standalone
                var parentSettings = settings.parent ? $(settings.parent).data($.aceOverWatch.settings.aceSettings) : settings;
                var callbacks = {
                    onsuccess : settings.onsavesuccessful,
                    onerror : settings.onsaveerror,
                };

                if (($.aceOverWatch.utilities.isVoid(forceDelete)) || (!forceDelete)) {
                    if( jQuery.isFunction(settings.onbeforedelete) ){
                        if (!settings.onbeforedelete(target, settings.record)) return false;
                    }else{
                        if ($.isFunction(window[settings.onbeforedelete])) {
                            if (!window[settings.onbeforedelete](target, settings.record)) return false;
                        }
                    }
                }

                switch(parentSettings.type){
                    case 'grid':
                        if( settings.assignedToGridRowIdx == -2 ) return;
                        $.aceOverWatch.field.grid.deleteRecord(settings.parent,settings.assignedToGridRowIdx,0,settings.record,forceDelete);
                        break;
                    default:
                        $.aceOverWatch.field.form.hide(target);
                        break;
                }
            },

            saveSuccessful : function(target,rawData){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);
                settings.record.convert(rawData);

                /*
                 * some things, even though they might not have been returned, must be set to clean, to ensure that further modifications are possible
                 */
                settings.record.makeItAllClean(true);

                if (settings.hideaftersave) {
                    $.aceOverWatch.field.form.hide($(target));
                }
            },

            show : function(target){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if( jQuery.isFunction(settings.onshow) ){
                    settings.onshow(target);
                }

                if( settings.validate ){
                    settings.fields.ace('validate',{resetTries:true});
                }

                if( settings.ftype != 'popup' && jQuery.isFunction(settings.customshow) ){
                    settings.customshow(target, settings.renderto);//custom show logic
                }else{
                    containerField.addClass($.aceOverWatch.classes.formShow);
                }

                if( settings.autoloadfieldsonshow ){
                    /*
                     * now go through ALL fields, and load those with remote data
                     */
                    var innerEl = containerField.find('.'+$.aceOverWatch.classes.formInner);

                    innerEl.find('.'+$.aceOverWatch.classes.containerField).each(function(){

                        var settings = $(this).data($.aceOverWatch.settings.aceSettings);
                        if( !settings ){
                            return;
                        }
                        /*
                         * snl - strong not autoload
                         */
                        if( settings.net.remote && (settings.net.snal != true) ){
                            $(this).ace('load');
                        }

                    });

                }

            },

            hide : function(target){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if( !settings ){
                    return;
                }

                if( jQuery.isFunction(settings.customhide) ){
                    settings.customhide(target, settings.renderto);//custom hide logic
                }else{
                    containerField.removeClass($.aceOverWatch.classes.formShow);
                }
            },


            /**
             * the function sets or gets the current record of the form
             */
            val : function(target,record, keepCurrentRecordReference){

                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if( $.aceOverWatch.utilities.isVoid(record) ) {
                    return settings.record;
                }else{
                    $.aceOverWatch.field.form.loadRecord(target,record, keepCurrentRecordReference);
                    return true;
                }

            }
        },//end form object

        /**
         * begin filter object
         *
         * - the filter is a wrapper over the form, with some extra bits added;
         * - the filter has ALL the functionality of a form
         *
         * - the filter object is used to apply 'filters' to server queries
         * - all ace-fields defined in form which have the fieldname attribute set will be passed to the targetfield
         *
         * - new settings explenations:
         * - targetfield - a jquery object of the ace-field which will receive the filter settings
         * - allconditions - the filter condition is constructed with AND or with OR between all the condition's fields; use true for all conditions, or false for at least one condition
         * - exactmatch	- if the conditions should be strict ( = ) or loose (like) when verified on the server side
         *
         * - conditionmatches and strictness can be modified from the form itself, IF the impementation implements ace-fields which have the attribute [name] equall to [allconditions] and/or [exactmatch]
         * if these fields exist, their values are going to be used when applying the filter
         *
         * - custom actions
         * - filter - to deploy the filter
         * - reset - to clear the filter
         */
        filter : {
            create : function(target, settings){
                //checkdirtyoncancel - false;

                $.extend(true,settings, $.extend(true,{

                    targetfield:null,			//this is the field to which the filter will be applied;
                    targetfieldrefreshfn : null, //this is the function that refreshes the target field
                    allconditions:false,	//values true or false
                    //if false, all filter conditions must match
                    //if true, at least one condition must match
                    exactmatch:true,			//valeus true or false
                    //if true, the conditions will be strict: uses equal(=) operand on the server side to verify conditions
                    //if false, the conditions will be NOT strict: uses (like) operand on the server side to verify conditions
                    filterafterreset:true,
                    hideafterfilter:true,
                    includeemptyvalues:false,	//if true, it will include empty values as well

                    //overwrites for the default form settings
                    checkdirtyoncancel:false,	//setting this to false by default for filters..
                    displaysavebtn:false,
                    displaycancelbtn:false,

                    onapplyfilter: null, //callback to be called with the filter object everytime someone is using it
                    onresetfilter: null, //callback to be called everytime the filter form resets

                    filterformtrigger : null,
                    filterformbadge : null,
                    filterformclear : null,

                    defaultdata : {},


                    oninit : function(form){
                        var containerField = $(target);
                        var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                        containerField.removeClass('ace-show');

                        if (!$.aceOverWatch.utilities.isVoid(settings.filterformtrigger)) {
                            settings.filterformtrigger.click(function(e){
                                e.preventDefault();

                                if( containerField.hasClass('ace-show') ){
                                    containerField.ace('hide');
                                } else{
                                    containerField.ace('show');
                                }
                                return false;
                            });
                        }

                        if (!$.aceOverWatch.utilities.isVoid(settings.filterformclear)) {
                            settings.filterformclear.click(function (e) {
                                e.preventDefault();

                                $.aceOverWatch.field.filter.reset(containerField);


                                if( $.isFunction(settings.targetfieldrefreshfn) ){
                                    settings.targetfieldrefreshfn();
                                } else{
                                    if($.isFunction(window[settings.targetfieldrefreshfn])){
                                        window[settings.targetfieldrefreshfn]();
                                    }
                                }

                                return false;
                            });
                        }

                        if( jQuery.isFunction(settings.onfilterinit) ){
                            settings.onfilterinit(form);
                        }
                    },
                    customshow:function(form, containerId){
                        $(form).addClass('ace-show');
                    },
                    customhide:function(form, containerId){
                        $(form).removeClass('ace-show');
                    },
                    onapplyfilterinternal : function(filter, filterEnh, directFields) {
                        var containerField = $(target);
                        var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                        let withActiveFilter = false;
                        if( 	settings.defaultdata
                            &&	Object.keys(settings.defaultdata).length > 0
                        ){
                            /*
                             * we verify that the default fields match the values in the current filter
                             */
                            for(let prop in settings.defaultdata ){

                                if(
                                    settings.defaultdata[prop] ==  filter.fields[prop]
                                    ||	settings.defaultdata[prop] ==  directFields[prop]
                                ){
                                    continue;
                                }

                                if(
                                    $.aceOverWatch.utilities.isVoid(settings.defaultdata[prop],true)
                                    &&	$.aceOverWatch.utilities.isVoid(filter.fields[prop],true)
                                    &&	$.aceOverWatch.utilities.isVoid(directFields[prop],true)
                                ){
                                    continue;
                                }

                                withActiveFilter = true;
                            }

                            if( !withActiveFilter ){
                                /*
                                 * lets check to see if we have fields set which are NOT part of the default data set
                                 */
                                for(let prop in filter.fields ){
                                    if( settings.defaultdata[prop] === undefined ){
                                        withActiveFilter = true;
                                        break;
                                    }
                                }
                            }
                            if( !withActiveFilter ){
                                /*
                                 * lets check to see if we have direct fields set which are NOT part of the default data set
                                 */
                                for(let prop in directFields ){
                                    if( settings.defaultdata[prop] === undefined ){
                                        withActiveFilter = true;
                                        break;
                                    }
                                }
                            }

                        }else{

                            var haveDirectFieldsWithValues = false;//with values: non void, non zero!
                            if(
                                directFields
                                && 	Object.keys(directFields).length > 0
                            ){
                                for( prop in directFields ){
                                    if(
                                        !$.aceOverWatch.utilities.isVoid(directFields[prop],true)
                                        &&	(
                                            typeof directFields[prop] === 'string'
                                            ||	directFields[prop] != 0
                                        )
                                    ){
                                        haveDirectFieldsWithValues = true;
                                        break;
                                    }
                                }
                            }

                            withActiveFilter = (
                                    (!$.aceOverWatch.utilities.isVoid(filter)) &&
                                    (!$.aceOverWatch.utilities.isVoid(filter.fields)) &&
                                    (Object.keys(filter.fields).length > 0)
                                )
                                ||	haveDirectFieldsWithValues;
                        }

                        if(	withActiveFilter ) {
                            if( settings.filterformbadge ){
                                settings.filterformbadge.removeClass($.aceOverWatch.classes.hide);
                            }
                            if( settings.filterformclear ){
                                settings.filterformclear.removeClass($.aceOverWatch.classes.hide);
                            }
                        }else{
                            if( settings.filterformbadge ){
                                settings.filterformbadge.addClass($.aceOverWatch.classes.hide);
                            }
                            if( settings.filterformclear ){
                                settings.filterformclear.addClass($.aceOverWatch.classes.hide);
                            }
                        }

                        if( $.isFunction(settings.onapplyfilter) ){
                            settings.onapplyfilter(filter, filterEnh);
                        }else{
                            if($.isFunction(window[settings.onapplyfilter])){
                                window[settings.onapplyfilter](filter, filterEnh);
                            }
                        }
                    },

                }, settings ));


                settings.allconditions = settings.allconditions ? 1 : 0;
                settings.exactmatch = settings.exactmatch ? 1 : 0;

                $(target).addClass($.aceOverWatch.classes.filterFormContainer);
                return $.aceOverWatch.field.form.create(target, settings);
            },

            afterInit : function(target,what){
                $.aceOverWatch.field.form.afterInit(target, what);

                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                containerField.find('[action="filter"]').unbind('click').on('click',function(e){
                    var target = $(this).closest('.'+$.aceOverWatch.classes.filterFormContainer);
                    e.stopPropagation();
                    $.aceOverWatch.field.filter.filter(target);
                });

                containerField.find('[action="reset"]').unbind('click').on('click',function(e){
                    var target = $(this).closest('.'+$.aceOverWatch.classes.filterFormContainer);
                    e.stopPropagation();
                    $.aceOverWatch.field.filter.reset(target);
                });

                containerField.find('[action="allconditions"]').unbind('click').on('click',function(e){
                    e.stopPropagation();
                    settings.allconditions = !settings.allconditions;
                });
                containerField.find('[action="exactmatch"]').unbind('click').on('click',function(e){
                    e.stopPropagation();
                    settings.exactmatch = !settings.exactmatch;
                });

                //initializing these two elements...
                var allconditions = containerField.find('[name="allconditions"]');
                if( allconditions.length > 0 ){
                    allconditions.ace('value',settings.allconditions)
                }
                var exactmatch = containerField.find('[name="exactmatch"]');
                if( exactmatch.length > 0 ){
                    exactmatch.ace('value',settings.exactmatch)
                }
            },

            /**
             * the function builds the current filter, and applies it to the target
             */
            getFilter: function(target, filterFromAnotherObject){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                var extraRecord = $.aceOverWatch.record.create();

                if ($.aceOverWatch.utilities.isVoid(filterFromAnotherObject)) {
                    filterFromAnotherObject = {};
                }

                //before we do anything else, check to see if we have.. the fields with the name: allconditions and exactmatch; if we have them, their values will overwrite the default ones
                var allconditions = containerField.find('[name="allconditions"]');
                if( allconditions.length > 0 ){
                    settings.allconditions = parseInt(allconditions.ace('value'));
                }
                var exactmatch = containerField.find('[name="exactmatch"]');
                if( exactmatch.length > 0 ){
                    settings.exactmatch = parseInt(exactmatch.ace('value'));
                }

                //update internal record with the date from the fields, and get direct fields related data into extraRecord
                $.aceOverWatch.field.filter.retrieveNewRecordData(target, extraRecord, $.aceOverWatch.field.filter.extraFieldVerification, false );

                //get the record
                var record = $.aceOverWatch.field.filter.val(target);

                //////////
                var filter = {
                    allconditions : settings.allconditions == 1,
                    exactmatch: settings.exactmatch == 1,
                }
                var fields = {};			//these are the fields which are going be part of the filter expression
                var directFields = {};

                //now... get the fields data
                for(fieldname in record.data){
                    var fld = containerField.find('[fieldname="'+fieldname+'"]');
                    if (fld.attr('filterasvar') == 'true') {
                        directFields[fieldname] = fld.ace('value');
                        continue;
                    }

                    var value = record.val(fieldname);
                    if( !settings.includeemptyvalues && String(value).length == 0 ){
                        continue;
                    }
                    fields[fieldname] = value;
                }
                filter.fields = fields;

                //now.. get the directFields...
                for(fieldname in extraRecord.data){
                    var value = extraRecord.val(fieldname);
                    if( !settings.includeemptyvalues && String(value).length == 0 ){
                        continue;
                    }
                    directFields[fieldname] = value;
                }


                //If I have chained filters - for example - a part of the filter is shown and the other one (advanced is on a floating panel)
                if ($.aceOverWatch.record.isRecord(filterFromAnotherObject.extraRecord)) {
                    extraRecord.loadFromOtherRecord(filterFromAnotherObject.extraRecord,true);
                }
                if (!$.aceOverWatch.utilities.isVoid(filterFromAnotherObject.filter)) {
                    $.extend(filter, filterFromAnotherObject.filter);
                }
                if (!$.aceOverWatch.utilities.isVoid(filterFromAnotherObject.directFields)) {
                    for(fieldname in filterFromAnotherObject.directFields){
                        directFields[fieldname] = filterFromAnotherObject.directFields[fieldname];
                    }
                }
                if ($.aceOverWatch.record.isRecord(filterFromAnotherObject.record)) {
                    record.loadFromOtherRecord(filterFromAnotherObject.record,true);
                }


                return {
                    extraRecord: extraRecord,
                    filter: filter,
                    directFields: directFields,
                    record: record,
                };
            },
            filter: function(target, filterFromAnotherObject){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                var filterData = $.aceOverWatch.field.filter.getFilter(target, filterFromAnotherObject);

                /*
                 * all direct fields present in normal fields need to be removed
                 */
                for(let prop in filterData.directFields ){
                    delete filterData.filter.fields[prop];
                }

                if( !$.aceOverWatch.utilities.isVoid(settings.targetfield) ){

                    var targetFieldSettings = settings.targetfield.data($.aceOverWatch.settings.aceSettings);

                    /*
					 * now... remove from net.filter, all the fields which CAN be set from this filter..
					 * otherwise, the fields which are not set currently, but were sent previously, will still be sent
					 */
                    var targetFilter = targetFieldSettings.net.filter;
                    for(field in targetFilter.fields){
                        if( filterData.record.val(field) != null ){
                            delete targetFilter.fields[field];
                        }
                    }

                    var extraparams = targetFieldSettings.net.extraparams;
                    for(field in extraparams){
                        if( filterData.extraRecord.val(field) != null ){
                            delete extraparams[field];
                        }
                    }

                    /*
                     * IF the target is a grid, lets use VALUE, instead of MODIFY ( uppercase here are just for visibility )
                     * when a grid is using value, it will not be re-written, its edit form will not be destroed and recreated, etc
                     * 
                     */
                    settings.targetfield.ace( (targetFieldSettings.type == 'grid') ? 'value' : 'modify',{
                        net : {
                            filter : filterData.filter
                        },
                        extraparams : filterData.directFields,

                        cleardata: true,		//to wipe existing data
                        page:1,					//in case it has pages, to get back to page 1
                    });
                    settings.targetfield.ace('load');
                }

                //hide the filter if we so chose to
                if( settings.hideafterfilter ){
                    $.aceOverWatch.field.filter.hide(target);
                }

                if( $.isFunction(settings.onapplyfilterinternal) ){
                    settings.onapplyfilterinternal(filterData.filter, settings.fields, filterData.directFields);
                }else{
                    if($.isFunction(window[settings.onapplyfilterinternal])){
                        window[settings.onapplyfilterinternal](filterData.filter, settings.fields, filterData.directFields);
                    }
                }

            },

            /**
             * this function is used to determine if the a field's value should be sent directly to the server or not
             * - returns yes if the field has the property: isdirectfilterfield = true
             *
             * @param field - a jquery ace object
             */
            extraFieldVerification : function(field){
                return field.isdirectfilterfield === true;
            },

            /**
             * the function clears the current filter
             */
            reset: function(target){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                $.aceOverWatch.field.filter.clear(target);

                /*
                 * if we have a default deta set, we'll load it!
                 */
                if( 	settings.defaultdata
                    &&	Object.keys(settings.defaultdata).length > 0
                ){
                    $.aceOverWatch.field.filter.loadRecord(target, $.aceOverWatch.record.create(settings.defaultdata) );
                }

                //apply the filter... if we want to//
                if( settings.filterafterreset ){
                    $.aceOverWatch.field.filter.filter(target);
                }

                if( $.isFunction(settings.onresetfilter) ){
                    settings.onresetfilter();
                }else{
                    if($.isFunction(window[settings.onresetfilter])){
                        window[settings.onresetfilter]();
                    }
                }

            },

            loadRecord : function(target,record){
                $result = $.aceOverWatch.field.form.loadRecord(target, record);

                if( !$result ){
                    return false;
                }

                return true;
            },

            updateRecord : function(target,fieldname, fieldvalue){
                $.aceOverWatch.field.form.updateRecord(target,fieldname, fieldvalue);
            },

            clear : function(target){
                $.aceOverWatch.field.form.clear(target);
            },

            isDirty : function(target){
                return $.aceOverWatch.field.form.isDirty(target);
            },
            cancel : function(target) {
                $.aceOverWatch.field.form.cancel(target);
            },

            retrieveNewRecordData:function(target, extraRecord, extraFieldVerification, extraIncludeNormal){
                $.aceOverWatch.field.form.retrieveNewRecordData(target, extraRecord, extraFieldVerification, extraIncludeNormal);
            },

            save : function(target){
                $.aceOverWatch.field.form.save(target);
            },

            saveSuccessful : function(target,rawData){
                $.aceOverWatch.field.form.saveSuccessful(target,rawData);
            },

            show : function(target){
                $.aceOverWatch.field.form.show(target);
            },

            hide : function(target){
                $.aceOverWatch.field.form.hide(target);
            },

            val : function(target,record){
                return $.aceOverWatch.field.form.val(target,record);
            }
        },

        /**
         * begin grid object
         **/
        grid : {

            create : function(target,settings){
                $.extend(true,settings, $.extend(true,{
                	/*
                	 * the type of grid we are dealing with: table, or panel
                	 * table : 
                	 * 	- it displays the list in horizontal rows and columns
                	 *  - the information about how the grid should be displayed can be found in the columns field
                	 * panel:
                	 * - this type of grid requires a cell template to be specified: rowtpl
                	 * - each row will display a copy of the template, and the ace fields in will will be filled with information from the fields with the same name of the data row
                	 */
                    gtype:'table',		

                    /*
                     * ATTENTION
                     * the code related to these settings is project specific: StaffM.
                     * TODO: move the functionality IN the StaffM project, or we need to write it in a GENERAL FORM
                     */
                    rowgrouptpl:'',//ATTENTION: code related to another PROJECT! should be removed!
                    onshouldinsertgridsubgrouprow : null,
                    onaftergridsubgrouprowinserted : null,
                    

                    rowtpl:'',
                    rowedittpl:'',	//set this for custom row template inline edit

                    rowparseastemplate:false, //if the rowtpl should also be parsed as template in the form
                    autoloadrowfields:true,//true if the row form should autoload by itself
                    validaterowformfields:true,//true, the row form fields will autovalidate on SAVE!

                    stoprowclickpropagation : false,

                    page:1,				//this is the first page loaded ( first page == 1 )
                    pagination:true,
                    
                    infinitescroll:false,
                    infinitescrollfactor:1, //in situations in which more than one row might be displayed on one line, set this
                                            //to the max number of rows expected to be drawn on one line + 1

                    freezeTotalExpectedRowsCount : false,//set to true, when the client specifies a CUSTOM of totalExpectedRowsCount
                    							//while true, this value will not be overwritten by data returned from the SERVER

                    loading : false, 	//this flag tells if there is a active net connection loading the gird data (no matter if the previous result was successfull or not)
                    height:false,
                    width:'auto',		//this is the width of the ENTIRE grid container, the on which ACE is being run; the inner grid inside stretches to 100%
                    
                    /*
                     * the columns is an array, in which each element is an object, that defined the properties of a column.
                     * These properties are described a bit bellow..
                     * search for the text between the brackets in the code bellow: [begin column for grid]
                     */
                    columns:[],	

                    /*
                     * The next settings are for determing IF the grid should display an aditional row in the footer, in which teh totals for some of the columns will be display
                     * showtotalsrow - set to true, to display the row
                     * ontotalsrecalculated - optional custom method to be called after the total of a column is recalculated and redrawn
                     * 						  function(function(idx, columnFieldName, cellElement))
                     * totalscolumns - optional custom set of columns to be used to draw the totals row; same properties as the normal columns array
                     * The columns which should have their total displayed need to have an aditional field specified:
                     * 	- totalsoprenderer 
                     * For the totalsoprenderer may have one of these three predefined values, or be a custom method, or the name of a custom method to be called to compute the total in a special way.
                     * The predefined methods are:
                     * 	- count: display the number of elements in the page
                     *  - sum: displays the sum of all the values in the column ( converted to float, 0 if invalid )
                     *  - prod: displays the product of all the values in the column ( converted to float, 1 if invalid )
                     *  - custom function name or function: function(totalsDataArr, columnFieldName) -> text to be displayed
                     */
                    showtotalsrow:false,
                    ontotalsrecalculated:null,
                    totalscolumns: [], //an array as colums to be used for displaying footer's totals instead of the columns metadata (to have different columns than the main grid)

                    data:[],			//explicit data passed from outside!
                    cleardata:false,	//if true, the data is wiped; useful when modifying the grid from the outside, and we want to wipe all the data

                    allowedit: true,
                    alloweditinline: false,
                    inlineautosave : false,
                    stayongridafterfocusout: false,
                    allowadd: true,
                    allowdelete: true,
                    allowrefresh:true,
                    alwayssaveinlineoneditorclose:true, //save the record even if the field is not dirty
                    addnewrecordstodataset : true, // if true, when adding a new record, the record will be saved in the existing data set
                    // this is the standard behaviour, ONLY modify this for custom behaviour!

                    displayloadingmask : true, /*when true, when a grid loads data from server, a loading now text will appear in its content*/

                    allowsearchfield:false,
                    serachtext:_aceL.search,
                    searchonkeydown : false,

                    aditionalDeleteInfo:[],//array of strings, each element representing the name of a field; in case of a delete, these fields and values will be sent to the client side as well with the index of the row to be deleted

                    displayrowlines:true,
                    displaycolumnlines:true,
                    displaycheckboxcolselectall : true, //for checkboxcol column type display a checkbox that will (de)select all checkboxes in the

                    suppressdeletemessage: false,

                    hideheader:false,

                    previousSelectedRow : -1,
                    selectedRow:-1,
                    selectedCell:-1,
                    
                    selectiontype:'row',//can be row, or cell
                    donotredrawselectedrow:false,	//in some cases, we don't want to redraw the row when it becomes selected... in this case, set this field to true;

                    showsavecolumn: '',		//or begin, or end; WIP!	also effects the default save button on panel grids
                    showeditcolumn: 'begin',//or end or set void to hide; also affects the default edit button on panel grids
                    showdeletecolumn: 'begin',//or end or whatever	TODO: not yet implemented; also affect the default button on panel grids

                    editcolumnname : '',
                    editcolumnwidth : '80px',
                    editcolumnwidthclass : $.aceOverWatch.classes.col1,

                    deletecolumnname : '',
                    deletecolumnwidth : '80px',
                    deletecolumnwidthclass : $.aceOverWatch.classes.col1,
                    deletecolumniconcls : '',
                    deletecolumncustomrowdisplay : false,//function, or the name of a function which, if provided, will be called to verify, IF the delete button should be displayed for a given row

                    editonselect:false,	//true if you trigger an edit when a cell is clicked
                    
                    editform: {},
                    hideformaftersave : true,
                    norecordstpl : '',
                    createtplrenderedautogenfields : false, //this flag is used to know if the returned page was the template for norecords defined above in norecordstpl variable.
                    										//If so, then I create the ace elements from it defined with the class $.aceOverWatch.classes.acetplautogen
                    
                    sendallfieldsonsave : false, //mark all record as dirty before saving
                    disablesaveokmsg : false,	//set to true, to disable the save was ok msg after a successfull save

                    selectfirstresult : false, //if true... when data is loaded in the grid, the first element will be selected automatically..
                    						//this is a ONE TIME use, after it, it will be reset to FALSE...
                    selectonlyifsingle : false, //selects only if ONLY ONE RESULT has been found!

                    classes:'',		//string, custom classes to be added to the grid

                    //custom callbacks
                    onsavesuccessful:null,		//callback on save successfull; parameter: the record
                    onpreloadsuccessful:null,	//called right after the data has been loaded from the server; the client can do cutom filtering on it if so desiring, before it is processed
                    							//function(target,dataArr, totalExpectedData);
                    onloadsuccessful:null,		// called when the data has been loaded from the server, and the information displayed
                    							//function(target,settings.data, startIdx, endIdx, totalExpectedData);
                    onrowredrawn:null,			//function(target,settings, rowIdx);
                    oninitrow : null,			//callback when a row grid is created

                    onselectionchange:null,		//called when selection was changed: grid, row, column, record: function(target, row, col, record)
                    onrowclick:null,			//same as onselectionchange, but it is triggered ALL the time the row is clicked: function(target, row, col, record)
                    onmouseenterleave:null,		//if set, the function will be called each time the mouse enters OVER row, or leave the row: function(target, row, record, state)
                    onbeforemouseenterleave:null,		//if set, the function will be called each time the mouse enters OVER row, or leave the row: function(target, row, record, state)
                    							//1 for mouse enter, 2 for mouse leave
                    							//return false to cancel default behaviour
                    onafterdelete:null,			//function called after a delete operation.. function(target, record);
                    onbeforedelete:null,		//function called before a delete operation.. function(target, record, rowIdx);
                    							// if return false, the delete operation will not take place
                    
                    onmodifydeleteinfo:null,	//function called to modify the delete data, before it is sent to the server
                    							// function(target,currentDeleteData,record)

                    //these callbacks affect the panel grid: params(form,record)
                    onbeforerowrecordloaded:null,	//a function, or the name of the function to be ran BEFORE the data has been loaded into the row form
                    onafterrowrecordloaded:null,	//a function, or the name of the function to be ran AFTER the data has been loaded into the row form

                    rowformsaveonlastenter : true,
                    rowenablekeynavigation : true,

                    onbeforerowedit:null, //function that  gets the grid, the row and the reocord. return false to cancel
                    onbeforerowsave:null,

                    //ATTENTION: for the two callbacks bellow: the first param, target, is going to be GRID itself, and NOT the row form that triggered the save!
                    onrowsaveerror : null,	//custom error function for the row form: params(target, data)
                    onrowsavesuccessful : null,	//custom successful function for the row form: params(target, data)
                    

                    /*
                     * these two methods, if defined, should return a html code which will be inserted BEFORE, or AFTER a raw
                     */
                    oninsertgridsubgrouprow : null, //returns a html coded text, to be added bellow a row function(rowIdx, record)
                    oninsertgriduppergrouprow : null,//returns a html coded text, to be added above a row function(rowIdx, record)
                    
                    onrefreshstaticpage : null,//custom call, when the grid wants to refresh the data currently displayed in the page function(target, page, pageSize)
                    						   //if all ok, the function should return an array of data

                    getcustomdeletestring : null,//custom function which returns a delete string confirmation: params(target, rowIdx, colIdx, record)

                    //these fields can't be set from outside
                    editCurrentRow:-1,	//the row currently being edited
                    editCurrentCell:-1,//in case of inline edit, the cell currently being edited

                    idfield:'',			//this is the name of the identity field

                    innerColumns:[],

                    createcmd:'create',

                    enablekeybasednavigation:false, //if true, they grid will handele up and down arrows to go from one row to the next, and enter to select the current row
                    hideonescape:false,
                    oncustomkeypresshandler:null,//function, or the name of a function to handle extra operations on keydown.. param(target, event, explicitSpecialCode)
                    enablekeynavigation:true,	/*true, to go to next available field when pressing enter*/

                    currentNavigatedIndex:-1,//this is the index of the row currently navigated with the arrow keys; it gets reset to -1 whenever a page reloads

                    tooglecheckonrowclick : false,//set it to true, if you want that ALL col checkboxes, if any, to be tooggled at any row click
                    						//attention: donotredrawselectedrow should be set to tue as well, otherwise it may not work correctly!

                    /*
					 * private setting, to ignore some label logic
					 */
                    ignoreLabels : true,

                }, settings ));

                if( settings.infinitescroll ){
                    settings.pagination = false;
                }


                if( $.isFunction(settings.oncustomkeypresshandler) ){
                    //do nothing, we have the function, it's ok
                }else{
                    if($.isFunction(window[settings.oncustomkeypresshandler])){
                        settings.oncustomkeypresshandler = window[settings.oncustomkeypresshandler];
                    }else{
                        settings.oncustomkeypresshandler = null;
                    }
                }

                settings.onAfterDelete = null;
                if( $.isFunction(settings.onafterdelete)) {
                    settings.onAfterDelete = settings.onafterdelete;
                }else{
                    if( jQuery.isFunction(window[settings.onafterdelete]) ){
                        settings.onAfterDelete = window[settings.onafterdelete];
                    }
                }
                settings.onBeforeDelete = null;
                if( $.isFunction(settings.onbeforedelete)) {
                    settings.onBeforeDelete = settings.onbeforedelete;
                }else{
                    if( jQuery.isFunction(window[settings.onbeforedelete]) ){
                        settings.onBeforeDelete = window[settings.onbeforedelete];
                    }
                }

                settings.onModifyDeleteInfo = null;
                if( $.isFunction(settings.onmodifydeleteinfo)) {
                    settings.onModifyDeleteInfo = settings.onmodifydeleteinfo;
                }else{
                    if( jQuery.isFunction(window[settings.onmodifydeleteinfo]) ){
                        settings.onModifyDeleteInfo = window[settings.onmodifydeleteinfo];
                    }
                }

                settings.actualCustomDeleteString = null;
                if( $.isFunction(settings.getcustomdeletestring)) {
                    settings.actualCustomDeleteString = settings.getcustomdeletestring;
                }else{
                    if( jQuery.isFunction(window[settings.getcustomdeletestring]) ){
                        settings.actualCustomDeleteString = window[settings.getcustomdeletestring];
                    }
                }

                settings.onMouseEnterLeave = null;
                if( $.isFunction(settings.onmouseenterleave)) {
                    settings.onMouseEnterLeave = settings.onmouseenterleave;
                }else{
                    if( jQuery.isFunction(window[settings.onmouseenterleave]) ){
                        settings.onMouseEnterLeave = window[settings.onmouseenterleave];
                    }
                }
                settings.onBeforeMouseEnterLeave = null;
                if( $.isFunction(settings.onbeforemouseenterleave)) {
                    settings.onBeforeMouseEnterLeave = settings.onbeforemouseenterleave;
                }else{
                    if( jQuery.isFunction(window[settings.onbeforemouseenterleave]) ){
                        settings.onBeforeMouseEnterLeave = window[settings.onbeforemouseenterleave];
                    }
                }

                $(target).css({
                    width:settings.width
                });

                settings.net.idfieldname = settings.idfield;

                //making sure the net limits are set in accordance with the current page
                if( settings.net.remote ){
                    settings.net.start = (settings.page-1) * settings.net.size;
                }

                //dealing with the edit form
                $.extend(true,settings.editform, $.extend(true,{
                    type:'popup',
                    template:'',
                    renderto:'',				//specify this manually to create the edit form in THAT div
                    displaysavebtn:true,
                    displaycancelbtn:true,
                    parent:target,
                    net:{},
                    hideaftersave : settings.hideformaftersave,
                }, settings.editform ));

                //overwriting the form's net with the grid's net object
                settings.editform.net = settings.net;

                var form = settings.editform;
                //decided to set from outside the form type using the 'type' field, and not the proper 'ftype' for consistency' sake, to be in line with all other fields
                var type = form.ftype;
                if( $.aceOverWatch.utilities.isVoid(type) ){
                    type = form.type;
                }
                switch(type){
                    case 'popup':
                        form.renderto = settings.id+'-form';
                        if(
                            settings.allowedit
                            &&	$('#'+form.renderto).length == 0
                        ){
                            $('body').append('<div class="'+$.aceOverWatch.classes.formPopup+'" id="'+form.renderto+'"></div>');
                        }
                        break;
                    case 'custom':
                        //expecting the renderto div to exist
                        if( $('#'+form.renderto).length == 0 ){
                            $.aceOverWatch.utilities.log('Failed to create Grid! Custom edit form specified, with no render to!');
                            return "";
                        }

                        break;
                    default:
                        $.aceOverWatch.utilities.log('Failed to create Grid! Invalid edit form type specified: ' + type);
                        return "";
                };

                /*
				 * don't create the form if it's an inline edit
				 * also, we don't create the form if no template has been given
				 */
                if(
                    	settings.alloweditinline != true
                    &&  String(settings.editform.template.length) > 0
                    &&	settings.allowedit

                ){
                    form.ftype=type;
                    form.type='form';
                    $('#'+form.renderto).ace('create',form);
                }

                if( settings.cleardata ){
                    settings.data = [];
                    settings.page = 1;
                }
                if( settings.data.length == 0 ){
                    settings.data = $.aceOverWatch.utilities.getAsociatedDataArr(target);
                }

                //convert data to inner data format
                if( settings.data.length > 0 && !$.aceOverWatch.record.isRecord(settings.data[0]) ){
                    var innerData = [];
                    for(var idx = 0; idx < settings.data.length; idx++){
                        innerData.push($.aceOverWatch.record.create(settings.data[idx]));
                    }
                    settings.data = innerData;
                }

                if(
                    settings.net.totalExpectedRowsCount < settings.data.length
                    && !settings.freezeTotalExpectedRowsCount
                ){
                    settings.net.totalExpectedRowsCount = settings.data.length;
                }
                $.aceOverWatch.field.grid.calculateMaxPages(settings);

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                if( settings.innerColumns.length == 0 && !settings.columns || !settings.columns instanceof Array || settings.columns.length == 0 ){
                    settings.columns = $.aceOverWatch.utilities.getAsociatedDataArr(target,'columns');
                }

                if( settings.columns.length > 0 ){
                    settings.innerColumns = [];

                    for(var idx in settings.columns){
                        settings.innerColumns.push(settings.columns[idx]);
                    }

                    if( settings.allowdelete != false && settings.showdeletecolumn != "" ){
                        let delName = settings.deletecolumnname.length > 0 ? settings.deletecolumnname : _aceL['delete'];
                    	let delColumn = {
                            title: _aceL['delete'], 
                            type:'action',
                            aditionalclasses:[settings.deletecolumnwidthclass,$.aceOverWatch.classes.collDelete].join(' '),
                            actions:[{
                                title: delName,
                                callback:$.aceOverWatch.field.grid.deleteRecord,
                                iconcls : settings.deletecolumniconcls,
                                actionrenderer : settings.deletecolumncustomrowdisplay
                            }]
                        };
                        if (settings.deletecolumnwidth > 0) delColumn['width'] = settings.deletecolumnwidth;


                        switch(settings.showdeletecolumn){
                            case 'begin':
                                settings.innerColumns.unshift(delColumn);
                                break;
                            case 'end':
                                settings.innerColumns.push(delColumn);
                                break;
                            default:
                                delete delColumn
                                break;
                        }
                    }

                    //for inline editing, displaying the edit button doesn't make sense
                    if( settings.allowedit != false && settings.showeditcolumn != "" && settings.alloweditinline != true){
                    	let editName = settings.editcolumnname.length > 0 ? settings.editcolumnname : _aceL['edit'];
                    	var editColumn = {
                            title:editName,
                            type:'action',
                            aditionalclasses:[settings.editcolumnwidthclass,$.aceOverWatch.classes.collEdit].join(' '),
                            actions:[{
                                title: editName,
                                callback:$.aceOverWatch.field.grid.editRecord,
                            }]
                        };
                        if (settings.editcolumnwidth > 0) editColumn['width'] = settings.editcolumnwidth;

                        switch(settings.showeditcolumn){
                            case 'begin':
                                settings.innerColumns.unshift(editColumn);
                                break;
                            case 'end':
                                settings.innerColumns.push(editColumn);
                                break;
                            default:
                                delete editColumn
                                break;
                        }
                    }

                }

                if (settings.showtotalsrow) {
                    settings.totalsColumns = [];
                    /*
                     * use these if we have
                     */
                    if (($.isArray(settings.totalscolumns)) && (settings.totalscolumns.length > 0)) {
                        for(var idx in settings.totalscolumns){
                            settings.totalsColumns.push(settings.totalscolumns[idx]);
                        }
                    } else {
                        settings.totalsColumns = settings.innerColumns;
                    }
                }

                if( settings.gtype == 'panel' ){
                	/*
                	 * if we are on a panel grid we replace all the columns with ONE column of type form
                	 */

                    settings.innerColumns = [

                        {

                            title : '',
                            width : '100%',
                            atype : 'form',
                            //fieldname not required for this...

                        }

                    ];

                    if (settings.showtotalsrow) {
                        settings.totalsColumns = [

                            {

                                title : '',
                                width : '100%',
                                atype : 'form',
                                //fieldname not required for this...

                            }

                        ];
                    }
                }

                /*
				 * because the columns are used only for the setting of the inner columns, we get rid of them now
				 */
                settings.columns = [];
                settings.totalscolumns = [];

                /**
                 * creating the grid toolbar
                 *****/
                var gridTopToolbar = '<div class="'+$.aceOverWatch.classes.gridTopToolbar+'" >';
                var areThereElementsInToptoolbar = false;
                if( settings.allowadd != false ){
                    areThereElementsInToptoolbar = true;
                    gridTopToolbar += '<button action="add">'+_aceL.add+'</button>';
                }
                if( settings.allowrefresh != false ){
                    areThereElementsInToptoolbar = true;
                    gridTopToolbar += '<button action="refresh">'+_aceL.refresh+'</button>';
                }
                if( settings.allowsearchfield != false ){
                    areThereElementsInToptoolbar = true;
                    gridTopToolbar += '<input class="'+$.aceOverWatch.classes.gridSearch+'" placeholder="'+settings.serachtext+'">';
                }
                if( areThereElementsInToptoolbar ){
                    gridTopToolbar+='</div>';
                }else{
                    gridTopToolbar = '';
                }

                /**
                 * creating the grid header
                 */

                    //ok.. let's build the grid header!
                var headerClasses = [$.aceOverWatch.classes.gridHeader];
                var footerClasses = [$.aceOverWatch.classes.gridFooter];
                if( settings.hideheader ){
                    headerClasses.push($.aceOverWatch.classes.hide);
                }
                var footerTotalsClasses = [$.aceOverWatch.classes.gridFooterTotals];
                if( !settings.showtotalsrow ){
                    footerTotalsClasses.push($.aceOverWatch.classes.hide);
                }
                else {
                    footerClasses.push($.aceOverWatch.classes.gridFooterWithTotals);
                }

                var gridHeader = '';
                var gridTotals = '';


                var currGroupHeaderCells = '';
                var haveGroupHeaderCells = false;
                var currGroupHeaderArr = [];
                for(var idx in settings.innerColumns){
                    var column = settings.innerColumns[idx];
                    /*begin column for grid*/
                    column = $.extend(true, {
                        title:'',
                        type:'normal', //normal, action, checkboxcol
                        atype:'text',		//atype - ace type; by default, it is text; used atm for creating edit fields. All atypes = [combobox, checkbox, switch, autocomplete, datepicker, text, form]
                        fieldname:'',
                        renderer:null,		//the renderer might be a function itself, or the name of a global function ( found in window )
                        
                        actionrenderer:null,  //function to return true or false to display/hide a action button on a action column
                        actiontitlerenderer:null,  //function to return the title for a action column
                        
                        aditionalclasses:'',
                        aditionalheaderclasses:'',
                        
                        align:'left',
                        
                        iconcls:'', //used to display a icon
                        
                        classes:[],
                        styles:[],
                        
                        rowtitle:'', //used by the checkboxcol to show a text next to the checkbox on each row
                        groupheader : '', //a text to group cells by
                        oncolumntitleclick:null,	//function(target, clickedHeaderCell, clickedHeaderColIdx, clickedHeaderColDefinition)

                        allowsort : false,
                        hidesorticonuntilfirstclick : true,
                        
                        sortdir : '', //should be '', asc or desc - for '' the sort icon is hidden
                        sortasciconcls : 'fa-caret-up',
                        sortdesciconcls : 'fa-caret-down',
                        
                        /*
                         * used to display the totals of a column
                         */
                        totalsoprenderer: null,//predefined values: count, sum, prod. custom function name or function: function(totalsDataArr, columnFieldName) -> text to be displayed


                        acetplclass : '', //set true to render a class returned by the classtplrenderer property
                        classtplrenderer : '', //function used to return a class based on the currenct record row - called only when acetplclass = true

                    },column);


                    column.classes = [];
                    column.classes.push($.aceOverWatch.classes.gridCell);

                    if( column.type == 'action' ){
                        column.classes.push($.aceOverWatch.classes.gridCellAction);
                    }
                    if( column.type == 'checkboxcol' ){
                        column.classes.push($.aceOverWatch.classes.gridCellCheckBoxCol);
                    }

                    if (!$.aceOverWatch.utilities.isVoid(column.width)) column.styles.push('width:'+column.width);


                    switch(column['align']){
                        case 'left':
                            column.classes.push($.aceOverWatch.classes.textAlignLeft);
                            break;
                        case 'right':
                            column.classes.push($.aceOverWatch.classes.textAlignRight);
                            break;
                        case 'center':
                            column.classes.push($.aceOverWatch.classes.textAlignCenter);
                            break;
                    }
                    if (!$.aceOverWatch.utilities.isVoid(column.aditionalclasses))
                        column.classes.push(column.aditionalclasses);


                    if (column.groupheader != currGroupHeaderCells) {
                        currGroupHeaderCells = column.groupheader;
                        haveGroupHeaderCells = true;
                        if ($.aceOverWatch.utilities.isVoid(currGroupHeaderArr[currGroupHeaderCells])) currGroupHeaderArr[currGroupHeaderCells]=0;
                    }

                    if (currGroupHeaderCells != '') {
                        currGroupHeaderArr[currGroupHeaderCells]++;
                    }
                    settings.innerColumns[idx] = column;
                }


                if (haveGroupHeaderCells){
                	headerClasses.push($.aceOverWatch.classes.gridNHeader);
                }
                
                gridHeader = '<div class="'+headerClasses.join(' ')+'" >';

                currGroupHeaderCells = '';
                var currGroupHeaderCellNo = 0;
                var groupHeaderClass = [];
                var groupHeaderColAttr = '';


                for(var idx in settings.innerColumns){

                    var column = settings.innerColumns[idx];
                    var columnicon = column.iconcls!='' ? '<i class="'+column.iconcls+'"></i>' : '';

                    var columnaditionalheaderclasses = [column.aditionalheaderclasses];
                    if (( $.isFunction(column.oncolumntitleclick) ) || ( $.isFunction(window[column.oncolumntitleclick]) )){
                        columnaditionalheaderclasses.push($.aceOverWatch.classes.clickable);
                    }

                    if (column.groupheader != currGroupHeaderCells) {
                        currGroupHeaderCells = column.groupheader;
                        currGroupHeaderCellNo = 0;
                        groupHeaderColAttr = '';
                        groupHeaderClass = [];
                    }
                    if (currGroupHeaderCells != '') {
                        //if I am on a groupped header cell
                        groupHeaderClass.push($.aceOverWatch.classes.gridNHeaderCol);
                        currGroupHeaderCellNo++;
                        if (currGroupHeaderCellNo == Math.ceil(currGroupHeaderArr[currGroupHeaderCells]/2)) {
                            //for the even cols no we have to shift the before element with 50% left to show it on the center
                            if (currGroupHeaderArr[currGroupHeaderCells] % 2 === 0) groupHeaderClass.push($.aceOverWatch.classes.gridNHeaderTitle50);
                            else groupHeaderClass.push($.aceOverWatch.classes.gridNHeaderTitle);
                            groupHeaderColAttr = ' groupname="'+currGroupHeaderCells+'"';
                        }
                        else {
                            groupHeaderColAttr = '';
                        }
                        if (currGroupHeaderCellNo == currGroupHeaderArr[currGroupHeaderCells])
                            groupHeaderClass.push($.aceOverWatch.classes.gridNHeaderColLast);
                    }
                    else {
                        groupHeaderClass = [];
                        groupHeaderColAttr = '';
                    }

                    var columnsorticon = '';
                    if (column.allowsort) {
                        columnaditionalheaderclasses.push($.aceOverWatch.classes.clickable);

                        columnsorticon = '<i class="'+$.aceOverWatch.classes.gridCellSort+' '+column.sortasciconcls + (column.hidesorticonuntilfirstclick?" ace-hide ace-right":"")+ '"></i>';
                    }

                    if ((column.type != 'checkboxcol') || (!settings.displaycheckboxcolselectall))
                        gridHeader += '<div class="' + [].concat(column.classes,groupHeaderClass,columnaditionalheaderclasses).join(' ') + '" style="' + column.styles.join(';') + '" ' + groupHeaderColAttr + ' hcidx="' + idx + '" tabindex="0">' + columnicon + column.title + columnsorticon+ '</div>';
                    else
                        gridHeader += '<div class="'+[].concat(column.classes,groupHeaderClass,columnaditionalheaderclasses).join(' ')+'" style="'+column.styles.join(';')+'" '+groupHeaderColAttr+' hcidx="'+idx+'" tabindex="0">'+columnicon+
                            '<div class="'+$.aceOverWatch.classes.check+'"><label class="'+$.aceOverWatch.classes.label+'"><input class="'+$.aceOverWatch.classes.fieldValue+' '+$.aceOverWatch.classes.gridActionCheckAllBoxCol+'" type="checkbox" idx="-1"><span></span></label></div>' +
                            '<begindivwithsubgroups>'+column.title+'<enddivwithsubgroups>'+columnsorticon+'</div>';


                    settings.innerColumns[idx] = column;
                }

                gridHeader += '</div>';



                if( settings.showtotalsrow ) {
                    
                    for (var idx in settings.totalsColumns) {
                        var column = settings.totalsColumns[idx];
                        /*begin column for grid*/
                        column = $.extend(true, {
                            title: '',
                            type: 'normal', //normal, action, checkboxcol
                            atype: 'text',		//atype - ace type; by default, it is text; used atm for creating edit fields. All atypes = [combobox, checkbox, switch, autocomplete, datepicker, text, form]
                            fieldname: '',
                            renderer: null,		//the renderer might be a function itself, or the name of a global function ( found in window )
                            actionrenderer: null,  //function to return true or false to display/hide a action button on a action column
                            actiontitlerenderer: null,  //function to return the title for a action column
                            aditionalclasses: '',
                            aditionalheaderclasses: '',
                            align: 'left',
                            iconcls: '', //used to display a icon
                            classes: [],
                            styles: [],
                            rowtitle: '', //used by the checkboxcol to show a text next to the checkbox on each row
                            groupheader: '', //a text to group cells by
                            oncolumntitleclick: null,	//function(target, clickedTotalsCell, clickedTotalsColIdx, clickedTotalsColDefinition)

                            allowsort: false,
                            hidesorticonuntilfirstclick: true,
                            sortdir: '', //should be '', asc or desc - for '' the sort icon is hidden
                            sortasciconcls: 'fa fa-caret-up',
                            sortdesciconcls: 'fa fa-caret-down',


                            acetplclass: '', //set true to render a class returned by the classtplrenderer property
                            classtplrenderer: '', //function used to return a class based on the currenct record row - called only when acetplclass = true

                        }, column);


                        column.classes = [$.aceOverWatch.classes.gridCell];

                        if (column.type == 'action') {
                            column.classes.push($.aceOverWatch.classes.gridCellAction);
                        }
                        if (column.type == 'checkboxcol') {
                            column.classes.push($.aceOverWatch.classes.gridCellCheckBoxCol);
                        }

                        if (!$.aceOverWatch.utilities.isVoid(column.width)) column.styles.push('width:' + column.width);


                        switch (column['align']) {
                            case 'left':
                                column.classes.push($.aceOverWatch.classes.textAlignLeft);
                                break;
                            case 'right':
                                column.classes.push($.aceOverWatch.classes.textAlignRight);
                                break;
                            case 'center':
                                column.classes.push($.aceOverWatch.classes.textAlignCenter);
                                break;
                        }
                        if (!$.aceOverWatch.utilities.isVoid(column.aditionalclasses)) column.classes.push(column.aditionalclasses);

                        settings.totalsColumns[idx] = column;
                    }

                	gridTotals = '<div class="'+footerTotalsClasses.join(' ')+'" >';

                    for(var idx in settings.totalsColumns){

                        var column = settings.totalsColumns[idx];

                        var columnaditionalheaderclasses = [column.aditionalheaderclasses];
                        if (( $.isFunction(column.oncolumntitleclick) ) || ( $.isFunction(window[column.oncolumntitleclick]) )){
                            columnaditionalheaderclasses.push($.aceOverWatch.classes.clickable);
                        }

                        gridTotals += '<div class="' + [].concat(column.classes,columnaditionalheaderclasses).join(' ')  + '" style="' + column.styles.join(';') + '" ' + ' tridx="' + idx + '" totalscalculation="'+($.aceOverWatch.utilities.isVoid(column.totalscalculation)?'':column.totalscalculation)+'">' + ($.aceOverWatch.utilities.isVoid(column.totalstext)?'&nbsp;':column.totalstext) + '</div>';

                        settings.totalsColumns[idx] = column;
                    }

                    gridTotals += '</div>';
                }


                settings.gridHeader = gridHeader;
                settings.footerTotalsRow = gridTotals;

                //let build the rest of the body now

                styleBody=[];
                if( settings.height != false ){
                    styleBody.push('height:100%');
                }

                var gridBody = '<div class="'+$.aceOverWatch.classes.gridBody + ' '+$.aceOverWatch.classes.gridScrollView+'" style="'+styleBody.join(';')+'">';
                gridBody += $.aceOverWatch.field.grid.getPageHtml(settings);
                gridBody += '</div>';

                if( settings.gtype == 'table' && settings.alloweditinline && settings.allowedit && !settings.inlineautosave){
                    //create save row div - it will be displayed underneath the row being edited!
                    gridBody += '<div class="'+$.aceOverWatch.classes.gridEditInlineControls+'"><button action="save">'+_aceL.save+'</button><button action="cancel">'+_aceL.cancel+'</button></div>'
                }

                settings.gridBody = gridBody;

                /*
				 * currently only the pagination is displayed in the grid.. soo.. if no pagination... no footer
				 * should not negatively influence anything
				 */
                var gridFooter = '';
                if( settings.pagination ){

                    gridFooter = '<div class="'+footerClasses.join(' ')+'" >';

                    if (settings.showtotalsrow) {
                        gridFooter += settings.footerTotalsRow;
                    }
                    gridFooter += '<div class="'+$.aceOverWatch.classes.gridPagination+'" >\
						<button jt="0" >&lt;&lt;</button>\
						<button jt="-1">&lt;</button>\
						&nbsp;<div><span>'+_aceL.page+'</span><input type="number" value="'+settings.page+'"><span>' + _aceL.of + '&nbsp;</span><span class="'+$.aceOverWatch.classes.gridPaginationTP+'">0</span>&nbsp;</div>\
						<button jt="1">&gt;</button>\
						<button jt="2">&gt;&gt;</button>\
					';

                    gridFooter += '</div>';
                } else{
                    if (settings.showtotalsrow) {
                        gridFooter += '<div class="'+footerClasses.join(' ')+'" >' + settings.footerTotalsRow + '</div>';
                    }
                }
                settings.gridFooter = gridFooter;

                //building the big grid

                styleGrid=['width:100%'];
                if( settings.height != false ){
                    styleGrid.push('height:'+settings.height);
                }

                var fieldHtml = '<div class="'+$.aceOverWatch.classes.grid+' ' + (settings.infinitescroll ? $.aceOverWatch.classes.gridInfiniteScroll : '' )  +'" style="'+styleGrid.join(';')+'">';
                fieldHtml += gridTopToolbar;
                fieldHtml += gridHeader;
                fieldHtml += gridBody;
                fieldHtml += settings.gridFooter;
                fieldHtml += '<span class='+$.aceOverWatch.classes.errorMsg+'></span>';
                fieldHtml += '</div>';//end - grid

                return fieldHtml;
            },

            afterInit : function(target,what){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                /**
                 *  first check if I have some fields loaded from a template that have to be autocreated
                 */
                if (settings.createtplrenderedautogenfields) {
                    containerField.find('.'+$.aceOverWatch.classes.acetplautogen).ace('create');
                    settings.createtplrenderedautogenfields = false;

                    /*
					 * also, lets add some hooks for special actions..
					 */
                    containerField.find('a[action],button[action],input[type="button"][action]').unbind().on('click',function(e){

                        e.preventDefault();
                        let el = $(this);
                        let target = el.closest('.'+$.aceOverWatch.classes.containerField);

                        let action = el.attr('action');
                        switch( action ){
                            case 'add':
                                $.aceOverWatch.field.grid.addNewRecord(target);
                                break;
                            case 'refresh':
                                $.aceOverWatch.field.grid.reloadPage(target);
                                break;
                            default:
                            	
                            	if( $.isFunction(action)) {
                            		action(el);
                                }else{
                                    if( jQuery.isFunction(window[action]) ){
                                        window[action](el);
                                    }
                                }
                            	
                            	break;
                        }

                        return false;
                    });
                }

                containerField.attr('agrid',true);//to mark the div as containing a grid! useful when an ace control within a grid wants to find its parent grid

                if( what.all == true ){
                    containerField.addClass(settings.classes);
                }

                /*
				 * enable pagination
				 */
                if( (what.all == true || what.pagination == true ) && settings.pagination ){

                    $.aceOverWatch.field.grid.setPaginationButtons(target);

                    containerField.find('.'+$.aceOverWatch.classes.gridPagination).find('button').unbind().on('click',function(){

                        var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                        var settings = target.data($.aceOverWatch.settings.aceSettings);

                        var oldPage = settings.page;

                        switch($(this).attr('jt')){
                            case '0'://go to first page
                                settings.page = 1;
                                break;
                            case '-1':
                                if( settings.page > 1 ){
                                    settings.page--
                                }
                                break;
                            case '1'://advance one page
                                if( settings.page < settings.net.maxPages ){
                                    settings.page++;
                                }
                                break;
                            case '2'://advance to last page
                                settings.page = settings.net.maxPages;
                                break;
                        }

                        if( oldPage != settings.page ){
                            if( settings.net.remote ){
                                settings.net.start = (settings.page-1) * settings.net.size;
                                $.aceOverWatch.net.load(target);
                            }else{
                                $.aceOverWatch.field.grid.displayPage(target);
                            }
                        }
                    });

                    containerField.find('.'+$.aceOverWatch.classes.gridPagination).find('input').unbind().on('change',function(){


                        var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                        var settings = target.data($.aceOverWatch.settings.aceSettings);

                        var page = parseInt($(this).val());
                        if(isNaN(page)){
                            return;
                        }

                        if( page < 1 || page > settings.net.maxPages ){
                            page = settings.page;
                            $(this).val(settings.page);
                        }

                        if( page != settings.page ){
                            settings.page = page;
                            if( settings.net.remote ){
                                settings.net.start = (settings.page-1) * settings.net.size;
                                $.aceOverWatch.net.load(target);
                            }else{
                                $.aceOverWatch.field.grid.displayPage(target);
                            }
                        }
                    });
                }

                /*
				 *
				 */
                if( what.all == true  && settings.infinitescroll ){

                    var scrollingArea = containerField.find('.'+$.aceOverWatch.classes.gridScrollView);
                    scrollingArea.unbind('scroll').on('scroll',function(){
                        $.aceOverWatch.field.grid.infiniteLoadIfNeeded($(this));
                    });
                    scrollingArea.trigger('scroll');
                }

                //enable row actions
                if( (what.all == true || what.rowActions == true ) ){

                    //this deals with clicks on action buttons
                    containerField.find('.'+$.aceOverWatch.classes.gridActionButton).unbind().on('click',function(){

                        var aIdx = $(this).attr('aidx');//action idx
                        var cIdx = $(this).closest('.'+$.aceOverWatch.classes.gridCell).attr('cidx');
                        var rIdx = $(this).closest('.'+$.aceOverWatch.classes.gridRow).attr('ridx');

                        var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                        var settings = target.data($.aceOverWatch.settings.aceSettings);

                        if( !settings ){
                            return;
                        }

                        if( settings.innerColumns[cIdx].actions instanceof Array ){
                            if( $.isFunction(settings.innerColumns[cIdx].actions[aIdx].callback) ){
                                settings.innerColumns[cIdx].actions[aIdx].callback(target,rIdx,cIdx,settings.data[rIdx]);
                            }else{
                                if( $.isFunction(window[settings.innerColumns[cIdx].actions[aIdx].callback]) ){
                                    window[settings.innerColumns[cIdx].actions[aIdx].callback](target,rIdx,cIdx,settings.data[rIdx]);
                                }
                            }
                        }

                    });
                    //this deals with clicks on checkboxes for checkboxcols
                    containerField.find('.'+$.aceOverWatch.classes.gridActionCheckBoxCol).unbind().on('click',function(){

                        var cIdx = $(this).closest('.'+$.aceOverWatch.classes.gridCell).attr('cidx');
                        var rIdx = $(this).closest('.'+$.aceOverWatch.classes.gridRow).attr('ridx');

                        var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                        var settings = target.data($.aceOverWatch.settings.aceSettings);

                        if( !settings ){
                            return;
                        }

                        if( $.isFunction(settings.innerColumns[cIdx].callback) ){
                            settings.innerColumns[cIdx].callback(target, $(this).prop('checked'), rIdx,cIdx,settings.data[rIdx], this);
                        }else{
                            if( $.isFunction(window[settings.innerColumns[cIdx].callback]) ){
                                window[settings.innerColumns[cIdx].callback](target, $(this).prop('checked'), rIdx,cIdx,settings.data[rIdx], this);
                            }
                        }

                    });
                    //this deals with clicks on HEADER checkboxes for checkboxcols
                    containerField.find('.'+$.aceOverWatch.classes.gridActionCheckAllBoxCol).unbind('click').on('click',function(){
                        var headColChecked = $(this).prop('checked');

                        containerField.find('.'+$.aceOverWatch.classes.gridActionCheckBoxCol).each(function( index ) {
                            $.aceOverWatch.field.grid.setColCheckState($(this), headColChecked, true);
                        });

                    });

                    //this handles the click on cells
                    containerField.find('.'+$.aceOverWatch.classes.gridCell).unbind('click').on('click',function(){

                        var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                        var settings = target.data($.aceOverWatch.settings.aceSettings);

                        var cIdx = $(this).attr('cidx');//action idx

                        if( typeof cIdx == 'undefined' || settings.innerColumns[cIdx].type == 'action'|| settings.innerColumns[cIdx].type == 'checkboxcol'){
                            return;//don't implement click thingies for action windows... the interaction with those is done through the action buttons
                        }

                        var rIdx = $(this).closest('.'+$.aceOverWatch.classes.gridRow).attr('ridx');

                        //begin selection logic
                        var redrawCurrentRow = false;
                        if(
                            rIdx != settings.selectedRow
                            ||	settings.forceReselectRow
                        ){
                            settings.previousSelectedRow = settings.selectedRow;
                            settings.selectedRow = rIdx;

                            if( !settings.donotredrawselectedrow ){
                                $.aceOverWatch.field.grid.redrawRow(target, settings, settings.previousSelectedRow);
                            }

                            settings.selectedCell = cIdx;
                            redrawCurrentRow = true;

                        }else{
                            if( settings.selectiontype == 'cell' && cIdx != settings.selectedCell ){
                                settings.selectedCell = cIdx;

                                redrawCurrentRow = true;
                            }
                        }
                        settings.forceReselectRow = false;

                        if( redrawCurrentRow == true ){

                            if( !settings.donotredrawselectedrow ){
                                $.aceOverWatch.field.grid.redrawRow(target, settings, rIdx);
                            }
                            //this was redrawned because the selection was changed... so.. now.. if we have a callback for this event, call it
                            if( $.isFunction(settings.onselectionchange)) {
                                settings.onselectionchange(target, rIdx, cIdx, settings.data[rIdx]);
                            }else{
                                if( jQuery.isFunction(window[settings.onselectionchange]) ){
                                    window[settings.onselectionchange](target, rIdx, cIdx, settings.data[rIdx]);
                                }
                            }
                        }
                        //end selection logic

                        /**
                         * If the panel grid has two row templates, then on click I have to see if I have to show the editor or the display template
                         */
                        if (!$.aceOverWatch.utilities.isVoid(settings.rowedittpl,true)) {
                            var record = settings.data[rIdx];
                            var rowForm = target.find('[rid="'+rIdx+'"]');
                            var rowFormSettings = rowForm.data($.aceOverWatch.settings.aceSettings);

                            if( rowFormSettings.template != settings.rowedittpl ){
                                var cell = $(this).find('.'+$.aceOverWatch.classes.gridRow+'[gid="'+settings.id+'"][ridx="'+rIdx+'"] .'+$.aceOverWatch.classes.gridCell+'[cidx="'+cIdx+'"]');
                                var data = cell.data('eCfg');
                                if( data == null ){
                                    data = {
                                        isEditing : false,
                                        originalValue:'',
                                    };
                                    cell.data('eCfg',data);
                                }

                                if( data.isEditing ){
                                    return;
                                }

                                settings.editCurrentRow = rIdx; //set this current row as the editing one
                                settings.editingRecord = record;
                                settings.editCurrentCell = cIdx;
                                data.isEditing = true;

                                rowForm.ace('modify',{
                                    type:'form',
                                    template:settings.rowedittpl,
                                });
                                $.aceOverWatch.field.form.loadRecord(rowForm, record); //loading the record now
                            }

                        }
                        
                        if( $.isFunction(settings.onrowclick)) {
                            settings.onrowclick(target, rIdx, cIdx, settings.data[rIdx]);
                        }else{
                            if( jQuery.isFunction(window[settings.onrowclick]) ){
                                window[settings.onrowclick](target, rIdx, cIdx, settings.data[rIdx]);
                            }
                        }

                        if(  settings.gtype == 'table' && settings.allowedit && settings.alloweditinline ){
                            $.aceOverWatch.field.grid.inlineEdit(target,rIdx,cIdx);
                        }else{
                            if (settings.allowedit && settings.editonselect && !settings.alloweditinline){
                                $.aceOverWatch.field.grid.editRecord(target,rIdx,0,settings.data[rIdx]);
                            }
                        }

                        if( settings.innerColumns[cIdx].type == 'normal' && settings.innerColumns[cIdx].atype == 'autocomplete'){
                            return false;//inline autocomplete behaves WRONG if click events are not stopped from propagading here
                        }


                        /*
                         * stopping this event from propagating in SOME situations: 
                         * this might be needed, for example, when dealing with nested grids
                         */
                        if( settings.stoprowclickpropagation ){
                        	return false;
                        }
                        
                        if( settings.tooglecheckonrowclick ){
                        	$(this).closest('.'+$.aceOverWatch.classes.gridRow).find('.'+$.aceOverWatch.classes.gridActionCheckBoxCol).trigger('click');
                        }
                    });

                    /*
                     * this handles the click on header cells - leave here to overwrite the ones above
                     */
                    containerField.find('.'+$.aceOverWatch.classes.gridHeader+' .'+$.aceOverWatch.classes.gridCell +'.'+$.aceOverWatch.classes.clickable).unbind('click').on('click',function(){
                        let el = $(this);
                        var target = el.closest('.'+$.aceOverWatch.classes.containerField);
                        var settings = target.data($.aceOverWatch.settings.aceSettings);

                        var hcIdx = el.attr('hcidx');//action idx
                        if( typeof hcIdx == 'undefined' || settings.innerColumns[hcIdx].type == 'action'|| settings.innerColumns[hcIdx].type == 'checkboxcol'){
                            return;//don't implement click thingies for action windows... the interaction with those is done through the action buttons
                        }

                        var reloadGrid = false;
                        //Here I deal with the title column click for sorting purposes
                        if (((settings.innerColumns[hcIdx].allowsort == true) || (settings.innerColumns[hcIdx].allowsort == "true")) && (settings.innerColumns[hcIdx].fieldname !== '')) {

                            if (settings.innerColumns[hcIdx].sortdir == 'asc') {
                                settings.innerColumns[hcIdx].sortdir = 'desc';
                                el.find('.'+$.aceOverWatch.classes.gridCellSort).removeClass(settings.innerColumns[hcIdx].sortasciconcls);
                                el.find('.'+$.aceOverWatch.classes.gridCellSort).addClass(settings.innerColumns[hcIdx].sortdesciconcls);
                            }
                            else if (settings.innerColumns[hcIdx].sortdir == 'desc') {
                                settings.innerColumns[hcIdx].sortdir = '';
                                el.find('.'+$.aceOverWatch.classes.gridCellSort).removeClass(settings.innerColumns[hcIdx].sortasciconcls);
                                el.find('.'+$.aceOverWatch.classes.gridCellSort).removeClass(settings.innerColumns[hcIdx].sortdesciconcls);
                            }
                            else {
                                settings.innerColumns[hcIdx].sortdir = 'asc';
                                el.find('.'+$.aceOverWatch.classes.gridCellSort).addClass(settings.innerColumns[hcIdx].sortasciconcls);
                                el.find('.'+$.aceOverWatch.classes.gridCellSort).removeClass(settings.innerColumns[hcIdx].sortdesciconcls);
                            }

                            if ($.aceOverWatch.utilities.isVoid(settings.orderbyarr)) {
                                settings.orderbyarr = {};
                            }
                            if (settings.innerColumns[hcIdx].sortdir !== '') {
                            	el.find('.' + $.aceOverWatch.classes.gridCellSort).removeClass($.aceOverWatch.classes.hide);
                                settings.orderbyarr[settings.innerColumns[hcIdx].fieldname] = settings.innerColumns[hcIdx].sortdir;
                            }
                            else {
                            	el.find('.' + $.aceOverWatch.classes.gridCellSort).addClass($.aceOverWatch.classes.hide);
                                settings.orderbyarr[settings.innerColumns[hcIdx].fieldname] = null;
                            }


                            if ($.aceOverWatch.utilities.isVoid(settings.net.extraparams)) {
                                settings.net.extraparams = {};
                            }

                            settings.net.extraparams['orderby'] = JSON.stringify(settings.orderbyarr);
                            reloadGrid = true;
                        }
                        
                        $.aceOverWatch.utilities.runIt(settings.innerColumns[hcIdx].oncolumntitleclick, target, $(this), hcIdx, settings.innerColumns[hcIdx]);

                        if (reloadGrid) {
                            $.aceOverWatch.field.grid.reloadPage(target);
                        }
                    });



                    /**
                     * If there is no onmouseenterleave callback setup in constructor
                     * and the panel grid do not use two row templates (one for displaying data and one for editing it)
                     * then the mouseenter and mouseleave events will not be bind.
                     *
                     * Otherwise, I do the logic for the roweditpl and call the callback if setup
                     */
                    if (( !settings.onMouseEnterLeave ) && ($.aceOverWatch.utilities.isVoid(settings.rowedittpl,true)) ){
                        //unbing any existing mouse enter/leave events, if any..
                        containerField.find('.'+$.aceOverWatch.classes.gridRow).unbind('mouseenter');
                        containerField.find('.'+$.aceOverWatch.classes.gridRow).unbind('mouseleave');
                    }else{
                        containerField.find('.'+$.aceOverWatch.classes.gridRow).unbind('mouseenter').mouseenter(function(){

                            var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                            var settings = target.data($.aceOverWatch.settings.aceSettings);

                            var rIdx = $(this).attr('ridx');

                            if (settings.onBeforeMouseEnterLeave) {
                                if (settings.onBeforeMouseEnterLeave(target, rIdx, settings.data[rIdx], 1) === false) return;
                            }

                            if (!$.aceOverWatch.utilities.isVoid(settings.rowedittpl,true)) {
                                var editForm = target.find('[rid="'+rIdx+'"]');
                                var editFormSettings = editForm.data($.aceOverWatch.settings.aceSettings);
                                var record = settings.data[rIdx];
                            }

                            if ( settings.onMouseEnterLeave ) settings.onMouseEnterLeave(target, rIdx, settings.data[rIdx], 1);
                        });

                        containerField.find('.'+$.aceOverWatch.classes.gridRow).unbind('mouseleave').mouseleave(function(){

                            var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                            var settings = target.data($.aceOverWatch.settings.aceSettings);

                            var rIdx = $(this).attr('ridx');

                            if (settings.onBeforeMouseEnterLeave) {
                                if (settings.onBeforeMouseEnterLeave(target, rIdx, settings.data[rIdx], 2) === false) return;
                            }

                            if (!$.aceOverWatch.utilities.isVoid(settings.rowedittpl,true)) {
                                var editForm = target.find('[rid="'+rIdx+'"]');
                                var editFormSettings = editForm.data($.aceOverWatch.settings.aceSettings);
                                var record = settings.data[rIdx];
                                //trigger the save.. IF the row is opened for editing...
                                if (settings.editCurrentRow == rIdx ) {
                                    if (record.isDirty()){
                                        //saving the row form...
                                        $.aceOverWatch.field.form.save(editForm);
                                    }
                                    else {
                                        $.aceOverWatch.field.form.cancel(editForm, function(target) {
                                            var containerField = $(target);
                                            var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                                            if (!settings) return;
                                            $.aceOverWatch.field.grid.inlineDissmissRowEdit(settings.parent, true); //redraw the editing row
                                        }); //cancel edit
                                    }
                                }
                            }

                            if ( settings.onMouseEnterLeave ) settings.onMouseEnterLeave(target, rIdx, settings.data[rIdx], 2);
                        });

                    }

                    //this handles the row forms!
                    containerField.find('div.'+$.aceOverWatch.classes.gridCellTemplate).each(function (index, element) {
                        var currentRow = parseInt($(this).attr('rid'));
                        //if a specific raw was marked for being updated, only update that one raw
                        if( !$.aceOverWatch.utilities.isVoid(what.rid) && currentRow != parseInt(what.rid) ){
                            return;
                        }

                        var customFormButtons = [];
                        if( settings.allowedit && !settings.alloweditinline && settings.showeditcolumn != '' ){
                            customFormButtons.push({
                                'text' :	_aceL.edit,
                                'class': 	$.aceOverWatch.classes.gridPanelEditButton,
                                'handler':function(targetForm){
                                    $.aceOverWatch.field.grid.editRecord(target,currentRow,0,settings.data[currentRow]);
                                }
                            });
                        }
                        if( settings.allowedit && settings.alloweditinline && settings.showsavecolumn != ''){
                            customFormButtons.push({
                                'text' :	_aceL.save,
                                'class': 	$.aceOverWatch.classes.gridPanelSaveButton,
                                'handler':function(targetForm){
                                    $.aceOverWatch.field.form.save(target);
                                }
                            });
                        }
                        if( settings.allowdelete && settings.showdeletecolumn != ''){
                            customFormButtons.push({
                                'text' :	_aceL['delete'],
                                'class': 	$.aceOverWatch.classes.gridPanelDeleteButton,
                                'handler':function(targetForm){
                                    $.aceOverWatch.field.grid.deleteRecord(target,currentRow,0,settings.data[currentRow]);
                                }
                            });
                        }


                        var readonly = settings.alloweditinline ? false : true;

                        //creates the form and loads the record in it!


                        rowForm = $(this);
                        $(this).ace('create',{
                            type:'form',
                            template:settings.rowtpl,
                            idfield : settings.idfield,
                            ftype:'custom',
                            parseastemplate : settings.rowparseastemplate,
                            renderto:settings.id+'-r-'+currentRow,
                            assignedToGridRowIdx:currentRow,
                            customshow:function(formElement,target){
                                $(formElement).show();
                            },
                            autoloadfieldsonshow:settings.autoloadrowfields,
                            parent:target,
                            displaysavebtn:false,
                            displaycancelbtn:false,
                            readonly:readonly,
                            validate:settings.validaterowformfields,

                            checkdirtyoncancel:false,
                            autosaveonlastenter:settings.rowformsaveonlastenter,
                            enablekeynavigation : settings.rowenablekeynavigation,

                            parentNet : settings.net,

                            customfooterbuttons:customFormButtons,

                            onsaveerror : settings.onrowsaveerror
                                ? settings.onrowsaveerror
                                : null,

                            onsavesuccessful : settings.onrowsavesuccessful
                                ? settings.onrowsavesuccessful
                                : null,
                            oninit:function(form){
                                //now call the function passed in the constructor load record if case
                                if( $.isFunction(settings.oninitrow) ){
                                    return settings.oninitrow(form);
                                }
                                else{
                                    if($.isFunction(window[settings.oninitrow])){
                                        return window[settings.oninitrow](form);
                                    }
                                }
                            },
                            onafterloadrecord:  function(target, record){
                                var f = $(target);
                                var shouldInsertGroupRow = false;
                                if( $.isFunction(settings.onshouldinsertgridsubgrouprow) ){
                                    shouldInsertGroupRow = settings.onshouldinsertgridsubgrouprow(target, record);
                                }
                                else{
                                    if($.isFunction(window[settings.onshouldinsertgridsubgrouprow])){
                                        shouldInsertGroupRow = window[settings.onshouldinsertgridsubgrouprow](target, record);
                                    }
                                }
                                if (shouldInsertGroupRow) {
                                    var myParent = f.parents('.'+$.aceOverWatch.classes.gridRow);
                                    var beforeParentSibling = myParent.prev('.'+$.aceOverWatch.classes.gridRow);
                                    var insertStyle="";
                                    if (beforeParentSibling.length > 0) {
                                        insertStyle = 'style="padding-top: '+ $(beforeParentSibling[0]).css('height') + ';display: block;width: max-content;"';
                                    }
                                    var newDiv = $( "<div class='"+$.aceOverWatch.classes.gridSubgroupRow+"' "+insertStyle+"></div>" );

                                    if (!$.aceOverWatch.utilities.isVoid(settings.rowgrouptpl)) {
                                        newDiv.html($('#dashboard-contracts-headnurse-row-template').html());
                                    }
                                    if( $.isFunction(settings.onaftergridsubgrouprowinserted) ){
                                        settings.onaftergridsubgrouprowinserted(newDiv, target, record);
                                    }
                                    else{
                                        if($.isFunction(window[settings.onaftergridsubgrouprowinserted])){
                                            window[settings.onaftergridsubgrouprowinserted](newDiv, target, record);
                                        }
                                    }
                                    newDiv.insertBefore( myParent );

                                }

                                //now call the function passed in the constructor load record if case
                                if( $.isFunction(settings.onafterrowrecordloaded) ){
                                    return settings.onafterrowrecordloaded(target, record);
                                }
                                else{
                                    if($.isFunction(window[settings.onafterrowrecordloaded])){
                                        return window[settings.onafterrowrecordloaded](target, record);
                                    }
                                }
                            },
                            onbeforeloadrecord: function(target, record){
                                /**
                                 * If this grid panel has two form templates for each row (rowtpl and rowedittpl) then for editing we will use the editing form (rowedittpl)
                                 * and for displaying we will use the display form (rowtpl)
                                 */
                                if (!$.aceOverWatch.utilities.isVoid(settings.rowedittpl,true)) {
                                    var form = $(target);
                                    var formSettings = form.data($.aceOverWatch.settings.aceSettings);

                                    var newRecord = false;
                                    var idFieldName = formSettings.idfield;
                                    if ($.aceOverWatch.utilities.isVoid(idFieldName)) idFieldName = '__newrecord';

                                    var recId = record.val(idFieldName);
                                    if (!$.isNumeric(recId)) recId = -1;
                                    if (recId <= 0) newRecord = true;

                                    if( newRecord ){ //force edit for a new record
                                        if (formSettings.template != settings.rowedittpl) {
                                            settings.editCurrentRow = formSettings.assignedToGridRowIdx; //set the row as being edited
                                            form.ace('modify',{
                                                type:'form',
                                                template:settings.rowedittpl,
                                            });
                                        }

                                    }
                                }

                                //now call the function passed in the constructor load record if case
                                if( $.isFunction(settings.onbeforerowrecordloaded) ){
                                    return settings.onbeforerowrecordloaded(target, record);
                                }
                                else{
                                    if($.isFunction(window[settings.onbeforerowrecordloaded])){
                                        return window[settings.onbeforerowrecordloaded](target, record);
                                    }
                                }

                                return true;
                            },
                            onbeforesave:function(target, record){

                                var containerField = $(target);

                                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                                if (!settings) return;

                                var grid = $(settings.parent);
                                if (!grid) return;

                                /**
                                 * If this grid panel has two form templates for each row (rowtpl and rowedittpl) then before save I set this record as being old so i can display it in the row
                                 */
                                if (!$.aceOverWatch.utilities.isVoid(settings.rowedittpl,true)) {
                                    var containerField = $(target);
                                    var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                                    if (!settings) return;
                                    /*if( __isediting == 1){ //if it was new I add another one
										 $.aceOverWatch.field.grid.addData(grid,{
											 __isediting:1,
										 });
									 }*/
                                }

                                //now call the function passed in the constructor load record if case
                                if( $.isFunction(settings.onbeforerowsave) ){
                                    return settings.onbeforerowsave(target, record);
                                }
                                else{
                                    if($.isFunction(window[settings.onbeforerowsave])){
                                        return window[settings.onbeforerowsave](target, record);
                                    }
                                }

                                var gs = grid.data($.aceOverWatch.settings.aceSettings);
                                if( $.isFunction(gs.onbeforerowsave) ){
                                    return gs.onbeforerowsave(target, record);
                                }
                                else{
                                    if($.isFunction(window[gs.onbeforerowsave])){
                                        return window[gs.onbeforerowsave](target, record);
                                    }
                                }

                                return true;
                            }
                        }).ace('loadrecord',settings.data[currentRow]).ace('show');

                        rowForm.find('[action="cancel"]').unbind('click').click(function(e){
                            e.stopImmediatePropagation();//for some reason, for remote grids, it gets triggered twice.. don't know why; so I placed this for immidiete stop
                            var form = $(this).closest('.'+$.aceOverWatch.classes.formContainer).closest('.'+$.aceOverWatch.classes.containerField);
                            $.aceOverWatch.field.form.cancel(form, function(target) {

                                var containerField = $(target);
                                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                                if (!settings) return;
                                var gridSettings = $(settings.parent).data($.aceOverWatch.settings.aceSettings);
                                //make sure that the grid knows the curelntly editedRecord
                                gridSettings.editCurrentRow = settings.assignedToGridRowIdx; //set the row as being edited
                                $.aceOverWatch.field.grid.inlineDissmissRowEdit(settings.parent, true); //redraw the editing row
                            }); //cancel edit
                        });

                        rowForm.find('[action="save"]').unbind('click').click(function(e){
                            e.stopImmediatePropagation();//for some reason, for remote grids, it gets triggered twice.. don't know why; so I placed this for immidiete stop
                            var form = $(this).closest('.'+$.aceOverWatch.classes.formContainer).closest('.'+$.aceOverWatch.classes.containerField);
                            $.aceOverWatch.field.form.save(form);
                        });

                        $(this).find('[action="edit"]').unbind('click').click(function(e){
                            e.preventDefault();
                            $.aceOverWatch.field.grid.editRecord(target,currentRow,0,settings.data[currentRow]);
                            return false;
                        });

                        $(this).find('[action="delete"]').unbind('click').click(function(e){
                            e.stopImmediatePropagation();//for some reason, for remote grids, it gets triggered twice.. don't know why; so I placed this for immidiete stop
                            var rowId = $(this).closest('.'+$.aceOverWatch.classes.formContainer).closest('.'+$.aceOverWatch.classes.containerField).attr('rid');
                            $.aceOverWatch.field.grid.deleteRecord(target,rowId,0,settings.data[rowId]);
                        });

                    });

                    if (settings.infinitescroll ){
                        containerField.find('.'+$.aceOverWatch.classes.gridScrollView).trigger('scroll');
                    }
                    
                    if( what.all == true || what.totals == true ){
                    	this.calculateGridTotals(containerField);
                    }
                }

                //various toolbar buttons..
                if( (what.all == true || what.toolbars == true ) ){
                    var toolbar = containerField.find('.'+$.aceOverWatch.classes.gridTopToolbar);
                    toolbar.find('button').unbind().on('click',function(e){

                        e.preventDefault();

                        var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                        var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                        switch( $(this).attr('action') ){
                            case 'add':

                                $.aceOverWatch.field.grid.addNewRecord(target);

                                break;
                            case 'refresh':
                                $.aceOverWatch.field.grid.reloadPage(target);
                                break;
                        }
                    });

                    toolbar.find('.'+$.aceOverWatch.classes.gridSearch).keyup(function (e) {

                        var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                        var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                        clearTimeout(settings.searchTimerId); //making sure we kill whatever existing timer we have here

                        switch(e.keyCode){
                            case 13:
                                $.aceOverWatch.field.grid.search(target, $(this).val());
                                break;
                            case 27://escape
                                $(this).val('');
                                settings.net.query = '';
                                $.aceOverWatch.field.grid.search(target,'');
                                break;
                            default:
                                if( settings.searchonkeydown ){

                                    settings.searchTimerId = setTimeout(function(){
                                        $.aceOverWatch.field.grid.search(target, $(target).find('.'+$.aceOverWatch.classes.gridSearch).val());
                                    },300);
                                }
                                break;
                        }
                    });

                }

                //enable inline editing controls if they are enabled
                if(
                    (
                        what.all == true
                        ||  what.rowActions == true
                    )
                    && 	settings.alloweditinline
                    && settings.allowedit
                ){

                    containerField.find('.'+$.aceOverWatch.classes.gridEditInlineControls).find('button').unbind().on('click',function(){

                        var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                        var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                        switch( $(this).attr('action') ){
                            case 'save':
                                $.aceOverWatch.field.grid.inlineSaveCurrentRow(target);
                                break;
                            case 'cancel':
                                $.aceOverWatch.field.grid.inlineDissmissRowEdit(target,true);
                                break;
                        }

                    });
                }

                //key based navigation
                if( what.all == true ){
                    containerField.unbind('keyup').keyup(function(e){

                        e.stopImmediatePropagation();

                        var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                        var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                        
                        ///////////////////////////////////
                        switch(e.keyCode){
                            case 27://escape
                                if( settings.hideonescape){
                                    $(this).fadeOut(1);
                                }
                                break;
                            case 37: // left arrow - go to previous page

                                if( settings.page > 1 && settings.enablekeybasednavigation ){
                                    settings.page--;
                                    $.aceOverWatch.field.grid.reloadPage(target,false,true);
                                }
                                break;
                            case 39: // right arrow - go to next mage

                                if( settings.page < settings.net.maxPages && settings.enablekeybasednavigation ){
                                    settings.page++;
                                    $.aceOverWatch.field.grid.reloadPage(target,false,true);
                                }
                                break;

                            case 38: // up arrow
                                if( settings.enablekeybasednavigation ){
                                    $.aceOverWatch.field.grid.navigateToRow(target,-1);
                                }
                                break;
                            case 40: // down arrow
                                if( settings.enablekeybasednavigation ){
                                    $.aceOverWatch.field.grid.navigateToRow(target,1);
                                }
                                break;
                            case 13://enter
                                e.stopPropagation();
                                if( settings.enablekeybasednavigation ){
                                    $.aceOverWatch.field.grid.selectRow($(this),settings.currentNavigatedIndex);
                                }
                                return false;//because we don't want it to propagate, because it might do for some unwanted behaviour in several cases (enter on autocomplete grid for example)
                                break;
                        }
                        
                        if( settings.oncustomkeypresshandler ){
                        	settings.oncustomkeypresshandler($(this), false, e.keyCode);
                        }
                        
                        return false;

                    });

                    //if we use settings.oncustomkeypresshandler, we'll need the keypress event to be able to print the printable character...
                    if( settings.oncustomkeypresshandler ){

                        containerField.unbind('keypress').keypress(function(e){
                            var settings = $(this).data($.aceOverWatch.settings.aceSettings);
                            settings.oncustomkeypresshandler($(this), e, false);
                        });

                    }
                }
            },

            /*
			 * the function moves the current navigated row by a deltaRow, up and down; usually it's called when the key based navigation is in place, and the user pressed the arrow up or arrow down buttons
			 */
            navigateToRow:function(target, deltaRow){

                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                var previousRow = settings.currentNavigatedIndex;

                //this bit is needed in case we just jumped on a new page, different than the fist; in this case, adjust the starting index just before the first displayed row
                if( settings.currentNavigatedIndex < 0 ){
                    settings.currentNavigatedIndex = settings.startPageRowIndex-1;
                }

                settings.currentNavigatedIndex += deltaRow;
                if(settings.currentNavigatedIndex < settings.startPageRowIndex ){
                    settings.currentNavigatedIndex = settings.endPageRowIndex-1;
                }else{
                    if( settings.currentNavigatedIndex >= settings.endPageRowIndex ){
                        settings.currentNavigatedIndex = settings.startPageRowIndex;
                    }
                }

                if( previousRow != settings.currentNavigatedIndex ){
                    $.aceOverWatch.field.grid.redrawRow(target, settings, previousRow);						//to get rid of the existing selection
                    $.aceOverWatch.field.grid.redrawRow(target, settings, settings.currentNavigatedIndex);	//to make the new selection
                }
            },

            /*
			 * if no rowIdx is specified, the grid will re-select the last selected row, if one was selected
			 */
            selectRow: function(target, rowIdx){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                if( rowIdx < 0 || rowIdx === undefined ){
                    if( settings.selectedRow < 0 || settings.selectedRow === undefined){

                        if( settings.previousSelectedRow < 0 || settings.previousSelectedRow === undefined){
                            return false;
                        }
                        rowIdx = settings.previousSelectedRow;
                    }else{
                        rowIdx = settings.selectedRow;
                    }

                }

                if(
                		!settings.data
            		||
                		(
                					settings.data
                				&&	settings.data.length <= rowIdx //less of equal, because the rowIdx starts with zero 
                		)
        		){
                    return false;
                }

                settings.forceReselectRow = true;
                containerField.find('.'+$.aceOverWatch.classes.gridRow+'[gid="'+settings.id+'"][ridx="'+rowIdx+'"]').children('.'+$.aceOverWatch.classes.gridCell).first().triggerHandler('click');
                settings.selectedRow = rowIdx;
                return true;
            },

            unselectRow: function(target){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if( settings.selectedRow < 0 ){
                    return;
                }

                let currentSelectedRow = settings.selectedRow;
                settings.selectedRow = -1;
                $.aceOverWatch.field.grid.redrawRow(target,settings, currentSelectedRow);

            },

            selectCurrentRow: function(target){

                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if( settings.editCurrentRow >= 0 ){
                    return $.aceOverWatch.field.grid.selectRow(target, settings.editCurrentRow);
                }
                return false;
            },

            /**
             * initialData -  a simple object whose properties will be added to the editing record
             */
            addNewRecord: function(target, initialData){
            	var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                
                if( !settings || !settings.allowedit ){
                	$.aceOverWatch.utilities.log(_aceL.eona);
                	return;
                }

                settings.editingRecord = {};
                settings.editingRecord[settings.idfield] = -1;
                settings.editingRecord = $.aceOverWatch.record.create(settings.editingRecord);

                //if we have specified initial data.. add the fields to the editing record
                if( initialData && typeof initialData == 'object' ){
                    for(var property in initialData ){
                        settings.editingRecord.val(property,initialData[property],false);
                    }
                }

                $.aceOverWatch.field.grid.editRecord(target,-1,0,settings.editingRecord);
            },

            calculateMaxPages : function(settings){
                settings.net.maxPages = parseInt(settings.net.totalExpectedRowsCount / settings.net.size);
                if( settings.net.maxPages * settings.net.size < settings.net.totalExpectedRowsCount ){
                    settings.net.maxPages++;//in case of incomplete pages
                }
            },

            search : function(target, queryObj, asAdvancedFilter){
                var settings =  $(target).data($.aceOverWatch.settings.aceSettings);
                if ($.aceOverWatch.utilities.isVoid(settings)){
                    return;
                }

                settings.cleardata = true;

                /*
				 * for the moment, disable the current selection when a page is re-loaded
				 */
                if ((jQuery.type( queryObj )==='number') || (jQuery.type( queryObj )==='string') || (jQuery.type( queryObj )==='date')) {
                    //this is a full text search
                    settings.net.query = queryObj;
                    settings.net.filter = null;
                }
                else
                if ((jQuery.type( queryObj )==='object') || (jQuery.type( queryObj )==='array')) {
                    //this is a filtering search
                    if (asAdvancedFilter===true) {
                        settings.net.advancedfilter = queryObj;
                    }
                    else {
                        settings.net.filter = queryObj;
                    }
                    settings.net.query = '';
                }
                else return;
                settings.page = 1;
                $.aceOverWatch.field.grid.reloadPage(target);
            },

            reloadPage : function(target, keepeditform, forceKeepData){
                var settings =  $(target).data($.aceOverWatch.settings.aceSettings);

                if( !settings ){
                    return;
                }
                
                $.aceOverWatch.field.grid.inlineDissmissRowEdit(target);

                if (keepeditform !== true) $.aceOverWatch.field.grid.hideEditForm(target);

                /*
				 * for the moment, disable the current selection when a page is re-loaded
				 */
                settings.previousSelectedRow = settings.selectedRow;
                settings.selectedRow = -1;
                settings.selectedCell = -1;
                settings.currentNavigatedIndex = -1;
                if( settings.cleardata && !forceKeepData ){
                    settings.data = [];
                    settings.page = 1;
                }
                if( settings.net.remote ){
                    settings.net.start = (settings.page-1) * settings.net.size;
                    settings.loading = true; //set the loading state for the current grid

                    if( settings.displayloadingmask ){
                        $.aceOverWatch.field.grid.displayPage(target);
                    }

                    $.aceOverWatch.net.load(target);			//the results are gouing to be processed by the setData function

                }else{
                	
                	let newStaticPageData = $.aceOverWatch.utilities.runIt(settings.onrefreshstaticpage,target,settings.page,settings.net.size);
                	if( $.isArray(newStaticPageData) ){
                		/*
                		 * if the page we have just reloaded is NOT the last page, we allow at max: settings.net.size elements to be rewritten
                		 * if the page we have just reloaded IS the last page, we allow items to be added to the grid, as it is necessary
                		 */
                		let maxExpectedItems = settings.data.length;
                		if( settings.page < settings.net.maxPages ){
                			if( newStaticPageData.length > settings.net.size ){
                				newStaticPageData.splice(settings.net.size,newStaticPageData.length-settings.net.size);
                			}
                		}else{
                			let possibleNewLength = (settings.page-1) * settings.net.maxPages + newStaticPageData.length; 

                			if( possibleNewLength > settings.data.length ){
                				maxExpectedItems = possibleNewLength;
                			}
                		}
                		
                		this.setData(target, newStaticPageData, maxExpectedItems);
                	}else{
                		$.aceOverWatch.field.grid.displayPage(target);
                	}
                	
                }
            },

            calculateGridTotals : function(target) {
                var settings = target.data($.aceOverWatch.settings.aceSettings);

                if (settings.showtotalsrow) {
                    var totalsBody = target.find('.'+$.aceOverWatch.classes.gridFooterTotals);
                    var totalsDataArr = [];
                    var startIdx = (settings.page-1)*settings.net.size;
                    var endIdx = settings.page*settings.net.size;
                    for( let didx = startIdx; didx < endIdx; didx++ ){
                        if ($.aceOverWatch.utilities.isVoid(settings.data[didx])) continue;
                        totalsDataArr.push(settings.data[didx]);
                    }


                    for(var idx in settings.totalsColumns) {
                        let column = settings.totalsColumns[idx];
                        if( $.aceOverWatch.utilities.isVoid(column.totalsoprenderer) && $.aceOverWatch.utilities.isVoid(column.fieldname) ){
                        	continue;
                        }
                        var totalCellValue = 0;
                        switch (column.totalsoprenderer) {
                            
                        	case 'count': //computes the number of elements displayed in the page
                                totalCellValue = totalsDataArr.length;
                                break;
                                        
                            case 'sum': //computes the sum of all elements converted into decimal numbers
                            			//if something can't be converted into decimal, it will be treated as 0 (neutral)
                                $.each(totalsDataArr, function (idx, rec) {
                                    let tmpVal = parseFloat(rec.val(column.fieldname));
                                    if (!$.isNumeric(tmpVal)) tmpVal = 0;
                                    totalCellValue += tmpVal;
                                });
                                break;
                            case 'mul': //multiplies all elements converted into decimal numbers
                            			 //if something can't be converted into decimal, it will be treated as 1 ( neutral )
                            	totalCellValue = 1;
                            	$.each(totalsDataArr, function (idx, rec) {
                            		let tmpVal = parseFloat(rec.val(column.fieldname));
                            		if (!$.isNumeric(tmpVal)) tmpVal = 1;
                            		totalCellValue *= tmpVal;
                            	});
                            	break;
                            	
                            default:	//by default, it should be a function, or the name of a function with 2 parameters( dataArr, columnName), that returns a value
                               	
                    			totalCellValue = $.aceOverWatch.utilities.runIt(column.totalsoprenderer, totalsDataArr, column.fieldname);
                    			if( !$.aceOverWatch.utilities.wasItRan() ){
                    				continue;
                    			}

                                break;
                        }


                        let cellTarget = totalsBody.find('[tridx="'+idx+'"]');
                        cellTarget.html(totalCellValue);
                        $.aceOverWatch.utilities.runIt(settings.ontotalsrecalculated, idx, column.fieldname, cellTarget);
                    }


                }

            },
            displayPage : function(target){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                $.aceOverWatch.field.grid.inlineDissmissRowEdit(target);//making sure the inline thingy is closed

                var body = containerField.find('.'+$.aceOverWatch.classes.gridBody);

                var newRows = $.aceOverWatch.field.grid.getPageHtml(settings);

                /*
				 * for page 1 - in the case of an infinite scroll, wipe the data!
				 */
                if( settings.infinitescroll && settings.page > 1 ){

                    /*
					 * if ADD the new rows to the existing body
					 */
                    body.append(newRows);

                }else{
                    /*
					 * we replace the entire body with the new generated rows!
					 */
                    body.html(newRows);
                }

                if(settings.infinitescroll ){
                    /*
					 * ok.. now.. we need to compute the HEIGHT of all the rows...
					 */
                    settings.actualPageHeight = 0;
                    body.find('.'+$.aceOverWatch.classes.gridRow).each(function(){
                        var rowHeight = parseInt($(this).css('height'));
                        if( rowHeight == 0 ){

                            $(this).children('div').each(function(){
                                var childRow = parseInt($(this).css('height'));
                                if( childRow > rowHeight ){
                                    rowHeight = childRow;
                                }
                            });

                        }
                        settings.actualPageHeight += rowHeight;
                    });
                }

                $.aceOverWatch.field.grid.setPaginationButtons(containerField);
                $.aceOverWatch.field.grid.afterInit(containerField,{rowActions:true,totals:true});
            },

            setPaginationButtons : function(target){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                var paginationDiv = containerField.find('.'+$.aceOverWatch.classes.gridPagination);

                paginationDiv.find('input').val(settings.page);
                paginationDiv.find('span.'+$.aceOverWatch.classes.gridPaginationTP).html(settings.net.maxPages);

                if( settings.net.maxPages == 1 ){
                    paginationDiv.find('button').hide();
                }else{
                    paginationDiv.find('button').show();
                    if( settings.page == 1 ){
                        paginationDiv.find('button[jt="0"]').prop('disabled', true);
                        paginationDiv.find('button[jt="-1"]').prop('disabled', true);
                    }else{
                        paginationDiv.find('button[jt="0"]').prop('disabled', false);
                        paginationDiv.find('button[jt="-1"]').prop('disabled', false);
                    }

                    if( settings.page >= settings.net.maxPages ){
                        paginationDiv.find('button[jt="1"]').prop('disabled', true);
                        paginationDiv.find('button[jt="2"]').prop('disabled', true);
                    }else{
                        paginationDiv.find('button[jt="1"]').prop('disabled', false);
                        paginationDiv.find('button[jt="2"]').prop('disabled', false);
                    }
                }
            },

            getPageHtml : function(settings){
                /*
                 * bases on the value of settings, get the HTML of the current rows
                 */

                if(	   settings.loading
                    && settings.displayloadingmask
                ){
                	return $.aceOverWatch.utilities.getLoaderCode(_aceL.ld);
                }

                settings.startPageRowIndex = (settings.page-1)*settings.net.size;
                if( settings.startPageRowIndex >= settings.data.length ){

                    if (settings.norecordstpl != '') {
                        settings.createtplrenderedautogenfields = true;

                        let content = $('#'+settings.norecordstpl).clone(true, true).html();
                        if( !content ){
                        	return '';
                        }
                        return content;
                    }
                    return '';//nothing to do, not enough data
                }

                settings.endPageRowIndex = settings.page*settings.net.size;
                if( settings.endPageRowIndex > settings.net.totalExpectedRowsCount ){
                    settings.endPageRowIndex = settings.net.totalExpectedRowsCount;
                }
                if( settings.endPageRowIndex > settings.data.length ){//can happen when not enough rows are in cache
                    settings.endPageRowIndex = settings.data.length;
                }

                /*
				 * IF we are NOT on an grid with INFINITE scroll, then, each page is unique.. OTHERWISE.. the contents on the current PAGE will be ADDED to the current existing rows
				 */
                pageHtml = '';
                for(var idx = settings.startPageRowIndex; idx < settings.endPageRowIndex; idx++){
                    pageHtml += $.aceOverWatch.field.grid.getRowHtml(idx,settings);
                }

                return pageHtml;
            },

            getRowHtml : function(idx,settings){
                var ridx = idx;
                if( idx < 0 ){
                    ridx = -idx;
                }

                var rowClasses = [$.aceOverWatch.classes.gridRow];

                if( settings.displayrowlines == true ){
                    rowClasses.push($.aceOverWatch.classes.gridRowLines);
                }
                if( settings.displaycolumnlines == true ){
                    rowClasses.push($.aceOverWatch.classes.gridColumnLines);
                }

                /*
				 * without clear here.. we might have problems.. with the rows alignaments..
				 */
                if( settings.gtype == 'table' ){
                    rowClasses.push($.aceOverWatch.classes.clear);

                    /*
					 * adding a class to the entire selected row
					 */
                    if( 		ridx == settings.selectedRow
                        && 	settings.selectiontype == 'row'
                    ){
                        rowClasses.push($.aceOverWatch.classes.gridRowSelected);
                    }
                }


                var subRow = "";
                var subRowRes = "";
                var subRowAdditionalClasses = " ";
                if( $.isFunction(settings.oninsertgridsubgrouprow) ){
                    subRowRes = settings.oninsertgridsubgrouprow(idx, settings.data[idx]);
                }
                else{
                    if($.isFunction(window[settings.oninsertgridsubgrouprow])){
                        subRowRes = window[settings.oninsertgridsubgrouprow](idx, settings.data[idx]);
                    }
                }

                
                if ($.isPlainObject(subRowRes)) {
                    if ($.aceOverWatch.utilities.isVoid(subRowRes.html, true)) subRowRes.html = "";
                    subRow = subRowRes.html;
                    if (!$.aceOverWatch.utilities.isVoid(subRowRes.additionalclasses, true)) {
                        if ($.isArray(subRowRes.additionalclasses)) subRowAdditionalClasses = subRowRes.additionalclasses.join(' ');
                        else subRowAdditionalClasses = subRowRes.additionalclasses;
                    }
                }
                else {
                    subRow = subRowRes;
                }

                if (subRow != "") {
                    var selectedClass = ( ridx == settings.selectedRow &&
                        (
                            settings.selectiontype == 'row'
                            ||
                            cIdx == settings.selectedCell
                        )
                    ) ? $.aceOverWatch.classes.gridCellSelected :'';
                    subRow = "<div class='ace-thin-col-24 ace-small-padding " + $.aceOverWatch.classes.gridSubgroupRow + " " + selectedClass +  " " + subRowAdditionalClasses + "' " + 'style="display: block;width: max-content;"' + ">" + subRow + "</div>";
                    rowClasses.push('ace-flex-wrap-yes');
                }
                
                let upperRow = "";
                if( $.isFunction(settings.oninsertgriduppergrouprow) ){
                    upperRow = settings.oninsertgriduppergrouprow(idx, settings.data[idx]);
                }
                else{
                    if($.isFunction(window[settings.oninsertgriduppergrouprow])){
                        upperRow = window[settings.oninsertgriduppergrouprow](idx, settings.data[idx]);
                    }
                }
                if (upperRow != "") {
                    var selectedClass = ( ridx == settings.selectedRow &&
                        (
                            settings.selectiontype == 'row'
                            ||
                            cIdx == settings.selectedCell
                        )
                    ) ? $.aceOverWatch.classes.gridCellSelected :'';
                    upperRow = "<div class='ace-thin-col-24 ace-small-padding " + $.aceOverWatch.classes.gridSubgroupRow + " " + selectedClass + "' " + 'style="display: block;width: max-content;"' + ">" + upperRow + "</div>";
                    rowClasses.push('ace-flex-wrap-yes');
                }

                let rowHtml = '<div class="'+rowClasses.join(' ')+'" gid="'+settings.id+'" ridx="'+ridx+'">'+upperRow;

                for(let cIdx in settings.innerColumns){
                    var column = settings.innerColumns[cIdx];

                    var selectedClass = ( ridx == settings.selectedRow &&
                        (
                            settings.selectiontype == 'row'
                            ||
                            cIdx == settings.selectedCell
                        )
                    ) ? $.aceOverWatch.classes.gridCellSelected :'';

                    var navigatedClass = ( ridx == settings.currentNavigatedIndex ) ? $.aceOverWatch.classes.gridCellNavigated : '';
                    
                    if( settings.selectiontype === false ){
                    	/*
                    	 * IF selecting type is explicit set to false, EXACTLY, disable the selection classes!!
                    	 */
                    	selectedClass = '';
                    	navigatedClass = '';
                    }

                    var dirtyClass = '';
                    if( settings.data[idx] ){
                        dirtyClass = settings.data[idx].isDirty(column.fieldname) ? $.aceOverWatch.classes.gridCellDirty : '';
                    }

                    var columnClassRenderer = '';
                    if (
                    		!$.aceOverWatch.utilities.isVoid(column.acetplclass)
                        &&	(column.acetplclass == 'true') || (column.acetplclass == true)
                    	&&	!$.aceOverWatch.utilities.isVoid(column.classtplrenderer)
                    	&&	idx >= 0	
                    ) {
                        columnClassRenderer = ' '+$.aceOverWatch.utilities.renderer(settings.data[idx].val(column.fieldname),settings.data[idx],column.classtplrenderer);
                    }

                    rowHtml += '<div data-label="'+column.title+ '" class="'+column.classes.join(' ')+' ' + selectedClass+' '+dirtyClass+' ' + navigatedClass + columnClassRenderer + '" style="'+column.styles.join(';')+'" cidx="'+cIdx+'">';

                    if( 	idx >= 0
                        && 	!$.aceOverWatch.utilities.isVoid(settings.data[idx])
                    ){

                        switch(column.type){
                            case 'normal':


                                if( settings.gtype == 'table' ) {

                                    var val = settings.data[idx].val(column.fieldname);
                                    if( val == null ){
                                        val = '';
                                    }

                                    rowHtml += $.aceOverWatch.utilities.renderer(val,settings.data[idx],column.renderer);

                                }else{
                                    //else, it is a panel grid; the form will be created by afterInit function when called with rowActions:true
                                    rowHtml += '<div class="'+$.aceOverWatch.classes.gridCellTemplate+'" rid="'+ridx+'" id="'+settings.id+'-r-'+ridx+'" style="width:100%"></div>';
                                }


                                break;
                            case 'action':

                                if( column.actions instanceof Array ){
                                    for( let aIdx = 0; aIdx < column.actions.length; aIdx++ ){

                                        var colAction = column.actions[aIdx];

                                        if( $.isFunction(column.actionrenderer) ){
                                            if (column.actionrenderer(aIdx,settings.data[idx], column)===false) continue;
                                        }else{
                                            if($.isFunction(window[column.actionrenderer])){
                                                if(window[column.actionrenderer](aIdx,settings.data[idx], column)===false) continue;
                                            }
                                        }
                                        if( $.isFunction(colAction.actionrenderer) ){
                                            if (colAction.actionrenderer(aIdx,settings.data[idx], column)===false) continue;
                                        }else{
                                            if($.isFunction(window[colAction.actionrenderer])){
                                                if(window[colAction.actionrenderer](aIdx,settings.data[idx], column)===false) continue;
                                            }
                                        }

                                        var colTitle = ($.aceOverWatch.utilities.isVoid(column.actions[aIdx]['title']) ? '' : column.actions[aIdx]['title']);
                                        if( $.isFunction(colAction.actiontitlerenderer) ){
                                            colTitle = colAction.actiontitlerenderer(aIdx,settings.data[idx], column);
                                        }else{
                                            if($.isFunction(window[colAction.actiontitlerenderer])){
                                                colTitle = window[colAction.actiontitlerenderer](aIdx,settings.data[idx], column);
                                            }
                                        }

                                        var tooltip = '';
                                        if( colAction.tooltip ){
                                            tooltip = ' title="'+colAction.tooltip+'" ';
                                        }
                                        rowHtml += '<button class="'+$.aceOverWatch.classes.gridActionButton+' '+((!$.aceOverWatch.utilities.isVoid(column.actions[aIdx]['classes'])) ? column.actions[aIdx]['classes']:'')+'" aidx="'+aIdx+'"'+tooltip+'>'+($.aceOverWatch.utilities.isVoid(column.actions[aIdx]['iconcls']) ? '' : '<i class="'+column.actions[aIdx]['iconcls']+'"></i>')+colTitle+'</button>';
                                    }
                                }

                                break;
                            case 'checkboxcol':

                                rowHtml +=  '<div class="'+$.aceOverWatch.classes.check+'"><label class="'+$.aceOverWatch.classes.label+'"><input class="'+$.aceOverWatch.classes.fieldValue+' '+$.aceOverWatch.classes.gridActionCheckBoxCol+'" type="checkbox" idx="'+idx+'" '+(settings.data[idx].val(column.fieldname) == 1 ? 'checked="checked"' : '')+'><span>'+column['rowtitle']+'</span></label></div>';

                                break;
                        }
                    }else{
                        rowHtml += '<div class="'+column.classes.join(' ')+'" style="'+column.styles.join(';')+'" cidx="'+cIdx+'">&nbsp</div>';
                    }

                    rowHtml += '</div>';
                }

                rowHtml += subRow;
                rowHtml += '</div>';



                return rowHtml;
            },

            redrawRow : function(target, settings, ridx){
            	var containerField = $(target);

                if( !settings ){
                    var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                }
                containerField.find('.'+$.aceOverWatch.classes.gridRow+'[gid="'+settings.id+'"][ridx="'+ridx+'"]').replaceWith($.aceOverWatch.field.grid.getRowHtml(ridx,settings));
                this.afterInit(containerField,{rowActions:true,rid:ridx,totals:true});
                
                $.aceOverWatch.utilities.runIt(settings.onrowredrawn, containerField, settings, ridx);
            },

            editRecord : function(target, rowIdx, colIdx, record){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);

                if( $.isFunction(settings.onbeforerowedit) ){
                    if (settings.onbeforerowedit(target, rowIdx, colIdx, record)===false) return;
                }else{
                    if($.isFunction(window[settings.onbeforerowedit])){
                        if(window[settings.onbeforerowedit](target, rowIdx, colIdx, record)===false) return;
                    }
                }

                settings.editCurrentRow = rowIdx;

                var form = $('#'+settings.editform.renderto);
                if( $.aceOverWatch.field.form.loadRecord(form,record) ){
                    $.aceOverWatch.field.form.show(form);
                }else{
                    //it failed, so... get back to the greed with the operation a success,
                    if( settings.alloweditinline && settings.allowedit /*&& settings.net.remote*/ ){
                        //ok... add the record to the top of the current page
                        var targetRowIdx = (settings.page-1)*settings.net.size;
                        settings.data.splice(targetRowIdx,0,record);
                        settings.net.totalExpectedRowsCount++;
                        $.aceOverWatch.field.grid.calculateMaxPages(settings);
                        $.aceOverWatch.field.grid.displayPage(target);

                        if( settings.gtype != 'panel' ){
                            //find first cell which isn't an action
                            var cellIdx = -1;
                            for(var idx = 0; idx < settings.innerColumns.length; idx++){
                                if( settings.innerColumns[idx].type == 'normal') {
                                    cellIdx = idx;
                                    break;
                                }
                            }
                            //this will show an editor only for the first not-action column
                            if( cellIdx != -1 ){
                                $.aceOverWatch.field.grid.inlineEdit(target,targetRowIdx,cellIdx);
                            }
                        }
                    }else{
                        $.aceOverWatch.field.grid.save(target);
                    }
                }
            },

            deleteRecordFinal : function(target, rowIdx) {
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);
                settings.editCurrentRow = rowIdx;

                var newRecord = false;
                var idFieldName = settings.idfield;
                if ($.aceOverWatch.utilities.isVoid(idFieldName)) idFieldName = '__newrecord';

                if( ($.isArray(settings.data)) && (!$.aceOverWatch.utilities.isVoid(settings.data[settings.editCurrentRow])) && ($.isFunction(settings.data[settings.editCurrentRow].val))){
                    var recId = settings.data[settings.editCurrentRow].val(idFieldName);
                    if (!$.isNumeric(recId)) recId = -1;
                    if (recId <= 0) newRecord = true;
                }

                if( settings.onBeforeDelete ){
                    if( !settings.onBeforeDelete(target, settings.data[settings.editCurrentRow], rowIdx) ){
                        return;
                    }
                }

                /*
				 * for new records - they were not saved to DB i just delete them
				 */
                if(( settings.net.remote == true ) && (!newRecord)){
                    var deleteData = {
                        rows:[{}]
                    };
                    deleteData[settings.idfield] = settings.data[settings.editCurrentRow].val(settings.idfield);
                    deleteData.rows[0][settings.idfield] = settings.data[settings.editCurrentRow].val(settings.idfield);

                    if( settings.aditionalDeleteInfo.length > 0  ){
                        for(var idx in settings.aditionalDeleteInfo){
                            deleteData.rows[0][settings.aditionalDeleteInfo[idx]] = settings.data[settings.editCurrentRow].val(settings.aditionalDeleteInfo[idx]);
                        }

                    }

                    if( settings.onModifyDeleteInfo ){
                        settings.onModifyDeleteInfo(target, deleteData, settings.data[settings.editCurrentRow]);
                    }

                    $.aceOverWatch.net.delete_(target,deleteData);
                }else{
                    $.aceOverWatch.field.grid.deleteSuccessful(target);
                }

            },
            deleteRecord : function(target, rowIdx, colIdx, record, forceDelete){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);

                if (($.aceOverWatch.utilities.isVoid(forceDelete)) || (!forceDelete)) {

                    $.aceOverWatch.prompt.show(
                        settings.actualCustomDeleteString
                            ? settings.actualCustomDeleteString(target, rowIdx, colIdx, record)
                            : _aceL.are_you_sure_delete,
                        function(value, cfg){
                            $.aceOverWatch.field.grid.deleteRecordFinal(cfg.target, cfg.rowIdx);

                        },{target:target, rowIdx:rowIdx, type:'question'});
                }
                else {
                    $.aceOverWatch.field.grid.deleteRecordFinal(target, rowIdx);
                }
            },

            deleteSuccessful : function(target,record,data){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);
                if( !record ){
                    record = settings.data[settings.editCurrentRow];
                }

                settings.data.splice(settings.editCurrentRow,1);
                settings.net.totalExpectedRowsCount--;
                $.aceOverWatch.field.grid.calculateMaxPages(settings);
                $.aceOverWatch.field.grid.displayPage(target);
                if (!settings.suppressdeletemessage) $.aceOverWatch.toast.show('success',_aceL.deleted_ok);

                if( settings.onAfterDelete ){
                    settings.onAfterDelete(target, record, data);
                }
            },

            save : function(target,callbacks){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);
                /*
                 * the last edited row is -> settings.editCurrentRow
                 */

                if( settings.net.remote == true ){

                    if ($.aceOverWatch.utilities.isVoid(settings.saveoptions)) {
                        settings.saveoptions = {};
                        if (!$.aceOverWatch.utilities.isVoid(settings.savetype))
                        {
                            settings.saveoptions['type'] = settings.savetype;
                        }

                    }

                    if( settings.editCurrentRow == -1 ){
                        if (settings.sendallfieldsonsave) {
                            settings.editingRecord.makeItAllDirty();
                        }
                        settings.editingRecord.setDirty(settings.idfield,true);
                        $.aceOverWatch.net.save(target,settings.editingRecord,callbacks,settings.createcmd,settings.saveoptions);
                    }else{
                        if (settings.sendallfieldsonsave) {
                            settings.data[settings.editCurrentRow].makeItAllDirty();
                        }
                        settings.data[settings.editCurrentRow].setDirty(settings.idfield,true);//settings the identity as dirty; otherwise the identity won't be sent on updates

                        if ((settings.idfield!=='')&&(parseInt(settings.data[settings.editCurrentRow].val(settings.idfield))===-1))
                            $.aceOverWatch.net.save(target,settings.data[settings.editCurrentRow],callbacks,settings.createcmd,settings.saveoptions);
                        else
                            $.aceOverWatch.net.save(target,settings.data[settings.editCurrentRow],callbacks,null,settings.saveoptions);
                    }

                }else{
                	
                	settings.data[settings.editCurrentRow].makeItAllClean(true);

                    if( settings.editCurrentRow == -1 ){
                        settings.data.unshift(settings.editingRecord);
                        settings.net.totalExpectedRowsCount++;
                        $.aceOverWatch.field.grid.calculateMaxPages(settings);
                        $.aceOverWatch.field.grid.displayPage(target)
                    }else{
                        /*
                         * static data... so redraw the affected row only
                         */
                        $.aceOverWatch.field.grid.redrawRow(target, settings, settings.editCurrentRow);
                        settings.editCurrentRow = -1;
                    }
                    
                    if( settings.alloweditinline ){
                    	$(target).find('.'+$.aceOverWatch.classes.gridEditInlineControls).hide();
                    }else{
						if( settings.hideformaftersave ){
	                        $.aceOverWatch.field.grid.hideEditForm(target);
	                    }
                    }
						
					if( 	callbacks
						&& 	$.isFunction(callbacks.onlocalsavesuccessfull)
					){
						callbacks.onlocalsavesuccessfull(target, settings.editingRecord);
                    }
				}
            },

            getEditForm : function(target) {
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);
                if (!settings) return false;
                if (!settings.editform) return false;
                return  $('#'+settings.editform.renderto);
            },

            showEditForm : function(target) {
                var form = $.aceOverWatch.field.grid.getEditForm(target);
                if  (form !== false) $.aceOverWatch.field.form.show(form);
            },

            hideEditForm : function(target) {
                var form = $.aceOverWatch.field.grid.getEditForm(target);
                if  (form !== false) $.aceOverWatch.field.form.hide(form);
            },

            saveSuccessful : function(target,rawData){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);


                var positionIdx = settings.editCurrentRow;
                if( settings.editCurrentRow != -1){
                    settings.data[settings.editCurrentRow].convert(rawData);

                    /*
					 * some things, even though they might not have been returned, must be set to clean, to ensure that further modifications are possible
					 */
                    settings.data[settings.editCurrentRow].makeItAllClean(true);

                    $.aceOverWatch.field.grid.redrawRow(target, settings, settings.editCurrentRow);

                }else{
                    positionIdx = 0;
                    settings.editingRecord.convert(rawData);

                    /*
					 * some things, even though they might not have been returned, must be set to clean, to ensure that further modifications are possible
					 */
                    settings.editingRecord.makeItAllClean(true);

                    if( settings.addnewrecordstodataset ){
	                    settings.data.unshift(settings.editingRecord);
	                    settings.net.totalExpectedRowsCount++;
                    }
                    $.aceOverWatch.field.grid.calculateMaxPages(settings);
                    $.aceOverWatch.field.grid.displayPage(target)

                    /*
					 * because we just added a row, the curred edit row should be 0..
					 * we do this, in case the edit form remained opened, to prevent
					 * multiple rows to being added
					 */
                    settings.editCurrentRow = 0;

                }

                if( settings.alloweditinline ){
                    $.aceOverWatch.field.grid.inlineDissmissRowEdit(target);
                }

                if (settings.editform.hideaftersave) {
                    var form = $('#'+settings.editform.renderto);
                    $.aceOverWatch.field.form.hide(form);
                }

                if( !settings.disablesaveokmsg ){
                    $.aceOverWatch.toast.show('success',_aceL.saved_ok);
                }

                if( $.isFunction(settings.onsavesuccessful) ){
                    settings.onsavesuccessful(target,settings.data[positionIdx]);
                }else{
                    if($.isFunction(window[settings.onsavesuccessful])){
                        window[settings.onsavesuccessful](target,settings.data[positionIdx]);
                    }
                }
            },

            /**
             * add data to existing
             */
            addData:function(target, data){
                var targetField = $(target);
                var settings = targetField.data($.aceOverWatch.settings.aceSettings);

                settings.data.splice(0, 0, $.aceOverWatch.record.isRecord(data) ? data : $.aceOverWatch.record.create(data));
                settings.net.totalExpectedRowsCount++;
                $.aceOverWatch.field.grid.calculateMaxPages(settings);
                $.aceOverWatch.field.grid.displayPage(target);
            },
            
            forceStopLoading : function(target){
            	var targetField = $(target);
                var settings = targetField.data($.aceOverWatch.settings.aceSettings);
                settings.loading = false;
                $.aceOverWatch.field.grid.displayPage(target);
            },

            /**
             * called after a load operation has been performed by the overwatch net object
             *
             * @params boolean clearExistingData		- set it to true to explicit delete existing data
             * @params additionalData - possible additional data; in the case of net calls, it is the raw data received from the server
             */
            setData : function(target, dataArr, totalExpectedData, clearExistingData = false, additionalData = false){
                var targetField = $(target);
                var settings = targetField.data($.aceOverWatch.settings.aceSettings);
                var updatePaginationToolbar = false;

                var initialDataLength = 0;
                if (dataArr) {
                    initialDataLength = dataArr.length;

                    /*
					 * this is a precaution, in case more data have been sent than expected..
					 * careful.. I am not sure if this breaks anything.. yet..
					 */
                    /*if(
								   !$.aceOverWatch.utilities.isVoid(totalExpectedData)
								&& initialDataLength >  totalExpectedData
					){
						totalExpectedData = initialDataLength;
					}*/
                }

                if( $.isFunction(settings.onpreloadsuccessful) ){
                    settings.onpreloadsuccessful(target,dataArr, totalExpectedData, additionalData);
                }else{
                    if($.isFunction(window[settings.onpreloadsuccessful])){
                        window[settings.onpreloadsuccessful](target,dataArr, totalExpectedData, additionalData);
                    }
                }

                //modify the final data based on the amount of items added or removed in the custom preloading logic
                if (dataArr) {
                    var finalDataLength =  dataArr.length;
                    totalExpectedData = Math.max(0,totalExpectedData+finalDataLength-initialDataLength);
                }
                if( 	totalExpectedData == 0
                    && dataArr
                    && dataArr.length > 0
                ){
                    totalExpectedData = dataArr.length;
                }

                settings.loading = false;//mark for loading done

                if( 	!$.aceOverWatch.utilities.isVoid(totalExpectedData)
                    && 	settings.net.totalExpectedRowsCount != totalExpectedData
                    &&	!settings.freezeTotalExpectedRowsCount
                ){
                    updatePaginationToolbar = true;
                    settings.net.totalExpectedRowsCount = totalExpectedData;
                    $.aceOverWatch.field.grid.calculateMaxPages(settings);
                }

                $.aceOverWatch.field.grid.calculateMaxPages(settings);

                if( clearExistingData === true ){
                    settings.data = [];
                    settings.page = 1;
                }

                //depending on what page we are, we'll set the received data
                var startIdx = (settings.page-1)*settings.net.size;
                var endIdx = settings.page*settings.net.size;
                if (dataArr) {
                	
                	let actualEndIdx = endIdx;
                    if( 	!settings.net.remote
                		&&	dataArr.length > settings.net.size
            		){
                    	/*
                         * in the case of local grids ( not remote ), we might get more information than the one to be displayed currently on the page
                         * in this case, we'll update the rest of the grid with whatever new data we actuall got
                         */
                		actualEndIdx += Math.min(dataArr.length-settings.net.size,settings.net.totalExpectedRowsCount - endIdx);
                    }
                	
                    for( let idx = startIdx; idx < actualEndIdx; idx++ ){
                        if( $.aceOverWatch.utilities.isVoid(dataArr[idx-startIdx]) ){
                        	continue;
                        }
                        if( settings.data[idx] ){
                            settings.data[idx].reset();
                            settings.data[idx].convert(dataArr[idx-startIdx]);
                        }else{

                            settings.data[idx] = $.aceOverWatch.record.isRecord(dataArr[idx-startIdx])
                                ? dataArr[idx-startIdx]
                                : $.aceOverWatch.record.create(dataArr[idx-startIdx]);
                        }
                    }
                    
                }

                $.aceOverWatch.field.grid.displayPage(target);

                if( $.isFunction(settings.onloadsuccessful) ){
                    settings.onloadsuccessful(target,settings.data, startIdx, endIdx, totalExpectedData, additionalData);
                }else{
                    if($.isFunction(window[settings.onloadsuccessful])){
                        window[settings.onloadsuccessful](target,settings.data, startIdx, endIdx, totalExpectedData, additionalData);
                    }
                }

                //////////////////////////////////////////////////////
                //selectRow: function(target, rowIdx){}
                if( settings.selectfirstresult ){
                	
                	if( 
                				settings.selectonlyifsingle == false
                			||	dataArr.length == 1
        			){
                	
	                    if( startIdx < endIdx ){
	                        $.aceOverWatch.field.grid.selectRow(target, startIdx);
	                    }
	                    
                	}
                	
                	settings.selectfirstresult = false;
                }

                /*
				 * also, lets make sure, that, if the checkall button was pressed, it is now disabled!
				 */
                targetField.find('.'+$.aceOverWatch.classes.gridActionCheckAllBoxCol).prop('checked',false);
            },

            getData : function(target){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);
                if( !settings ){
                    return false;
                }
                return settings.data;
            },

            inlineEdit : function(target,rowIdx,cellIdx){
                var targetField = $(target);
                var settings = targetField.data($.aceOverWatch.settings.aceSettings);
                if( !settings ){
                    return;
                }

                if( rowIdx != settings.editCurrentRow ){
                    $.aceOverWatch.field.grid.inlineDissmissRowEdit(target);//making sure the inline controls are hidden in case they were visible
                }
                settings.editCurrentRow = rowIdx;
                settings.editCurrentCell = cellIdx;

                var cell = targetField.find('.'+$.aceOverWatch.classes.gridRow+'[gid="'+settings.id+'"][ridx="'+rowIdx+'"] .'+$.aceOverWatch.classes.gridCell+'[cidx="'+cellIdx+'"]');
                var data = cell.data('eCfg');
                if( data == null ){
                    data = {
                        isEditing : false,
                        originalValue:'',
                    };
                    cell.data('eCfg',data);
                }

                if( data.isEditing ){
                    return;
                }

                data.originalValue = settings.data[rowIdx].val(settings.innerColumns[cellIdx].fieldname);
                if( data.originalValue == null ){
                    data.originalValue = '';
                }

                data.isEditing = true;
                cell.data('eCfg',data);

                var editElement = null;
                var editElementCore = null;

                switch( settings.innerColumns[cellIdx].atype ){
                    case 'combobox':
                        editElement = $('<div></div>').ace('create',{
                            type:'combobox',
                            displayname:settings.innerColumns[cellIdx].displayname,
                            valuename:settings.innerColumns[cellIdx].valuename,
                            data:settings.innerColumns[cellIdx].data,
                            net:settings.innerColumns[cellIdx].net,
                            labelalign:'left',
                            label: $.aceOverWatch.utilities.isVoid(settings.innerColumns[cellIdx].label,true)
                                ? ''
                                : settings.innerColumns[cellIdx].label
                        });

                        editElement.ace('value',data.originalValue);
                        editElementCore = editElement.find('select');
                        editElementCore.focusout(function(){
                            $.aceOverWatch.field.grid.inlineDissmissCellInput(this,true);
                        }).keyup(function (e) {
                            switch(e.keyCode){
                                case 13:
                                    $.aceOverWatch.field.grid.inlineDissmissCellInput(this,true);
                                    break;
                                case 27://escape
                                    $.aceOverWatch.field.grid.inlineDissmissCellInput(this,false);
                                    break;
                            }
                        }).focusout(function(e){
                            $.aceOverWatch.field.grid.inlineDissmissCellInput(this,true);
                        });
                        break;
                    case 'checkbox':
                    case 'switch':
                        editElement = $('<div></div>').ace('create',{
                            type:settings.innerColumns[cellIdx].atype,
                            on:settings.innerColumns[cellIdx].on,
                            off:settings.innerColumns[cellIdx].off,
                            labelalign:'left',
                            label: $.aceOverWatch.utilities.isVoid(settings.innerColumns[cellIdx].label,true)
                                ? ''
                                : settings.innerColumns[cellIdx].label
                        });

                        editElement.ace('value',data.originalValue);
                        editElement.focusout(function(){
                            $.aceOverWatch.field.grid.inlineDissmissCellInput(this,true);
                        }).keyup(function (e) {
                            switch(e.keyCode){
                                case 13:
                                    $.aceOverWatch.field.grid.inlineDissmissCellInput(this,true);
                                    break;
                                case 27://escape
                                    $.aceOverWatch.field.grid.inlineDissmissCellInput(this,false);
                                    break;
                            }
                        }).focusout(function(e){
                            $.aceOverWatch.field.grid.inlineDissmissCellInput(this,true);
                        });
                        editElementCore = editElement;
                        break;
                    case 'autocomplete':
                        editElement = $('<div></div>').ace('create',{
                            type:'autocomplete',
                            displayname:settings.innerColumns[cellIdx].displayname,
                            valuename:settings.innerColumns[cellIdx].valuename,
                            searchname:settings.innerColumns[cellIdx].searchname,
                            fieldname:settings.innerColumns[cellIdx].fieldname,
                            minlength:settings.innerColumns[cellIdx].minlength,
                            net:settings.innerColumns[cellIdx].net,

                            onclose:function(el){
                                $.aceOverWatch.field.grid.inlineDissmissCellInput($(el).find('input'),false);
                            },
                            onselect:function(el){
                                $.aceOverWatch.field.grid.inlineDissmissCellInput($(el).find('input'),true);
                            }
                        });

                        editElement.ace('value',settings.data[rowIdx]);

                        editElementCore = editElement.find('input');
                        editElementCore.focusout(function(){

                            var grid = $(this).closest('.'+$.aceOverWatch.classes.autocompleteField).find('.'+$.aceOverWatch.classes.gridAutoComplete);
                            if( !grid.is(":visible") ){
                                $.aceOverWatch.field.grid.inlineDissmissCellInput(this,true);
                            }

                        }).keyup(function (e) {
                            switch(e.keyCode){
                                case 13:
                                    $.aceOverWatch.field.grid.inlineDissmissCellInput(this,true);
                                    break;
                                case 27://escape
                                    $.aceOverWatch.field.grid.inlineDissmissCellInput(this,false);
                                    break;
                            }
                        }).focusout(function(e){
                            $.aceOverWatch.field.grid.inlineDissmissCellInput(this,true);
                        });
                        break;
                    case 'datepicker':
                        editElement = $('<div></div>').ace('create',{
                            type:'datepicker',
                            firstselect : true,
                            onclose:function(){
                                $.aceOverWatch.field.grid.inlineDissmissCellInput(this,false);
                            },
                            onselect:function(target) {
                                var targetField = $(target);
                                var settings = targetField.data($.aceOverWatch.settings.aceSettings);
                                if (settings.firstselect) {
                                    settings.firstselect = false;
                                    return;
                                }
                                $.aceOverWatch.field.grid.inlineDissmissCellInput(this,true);
                            }
                        });
                        editElement.ace('value',data.originalValue);
                        editElementCore = editElement.find('input');
                        break;
                    case 'text':
                    default:
                        var editElement = $('<input type="text" value="'+data.originalValue+'">');
                        editElementCore = editElement;

                        editElementCore.focusout(function(e){
                            if (settings.stayongridafterfocusout) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            $.aceOverWatch.field.grid.inlineDissmissCellInput(this,true);
                        }).keydown(function (e) {
                            switch(e.keyCode) {
                                case 9://tab
                                    if (settings.stayongridafterfocusout) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        $.aceOverWatch.field.grid.inlineDissmissCellInput(this, true);
                                    }
                            }
                        }).keyup(function (e) {
                            switch(e.keyCode) {
                                case 13:
                                    $.aceOverWatch.field.grid.inlineDissmissCellInput(this,true);
                                    break;
                                case 27://escape
                                    $.aceOverWatch.field.grid.inlineDissmissCellInput(this,false);
                                    break;

                                    break;
                            }
                        }).focusout(function(e){
                            $.aceOverWatch.field.grid.inlineDissmissCellInput(this,true);
                            if (settings.stayongridafterfocusout) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        });

                        break;
                }

                var rowDiv = targetField.find('.'+$.aceOverWatch.classes.gridRow+'[gid="'+settings.id+'"][ridx="'+rowIdx+'"]');
                var ctrlDiv = targetField.find('.'+$.aceOverWatch.classes.gridEditInlineControls);

                rowDiv.addClass($.aceOverWatch.classes.gridInlineRow);
                /*
				ctrlDiv.css({
					'left': rowDiv.offset().left+rowDiv.width()/2-ctrlDiv.width()/2,
			        'top': (rowDiv.offset().top + rowDiv.height())
				}).show();
				*/

                ctrlDiv.fadeIn(100).position({
                    my:        "left top",
                    at:        "center bottom",
                    of:        rowDiv,
                    collision: "fit"
                });

                cell.html(editElement);//displaying the input element



                editElementCore.focus();

                if( $.isFunction(settings.onafterinlineeditdisplay) ){
                    settings.onafterinlineeditdisplay(target,rowIdx,cellIdx, editElementCore);
                }else{
                    if($.isFunction(window[settings.onafterinlineeditdisplay])){
                        window[settings.onafterinlineeditdisplay](target,rowIdx,cellIdx, editElementCore);
                    }
                }
            },

            inlineDissmissCellInput : function(target,save){
                var input = $(target);
                var parentCell = input.closest('.'+$.aceOverWatch.classes.gridCell);
                var eData = parentCell.data('eCfg');
                if( !eData || !eData.isEditing ){
                    return;
                }

                if( save ){
                    var grid = parentCell.closest('.'+$.aceOverWatch.classes.containerField+'[agrid=true]');
                    var settings = grid.data($.aceOverWatch.settings.aceSettings);

                    var cell = input.closest('.'+$.aceOverWatch.classes.gridCell);
                    var cIdx = cell.attr('cidx');
                    var rIdx = input.closest('.'+$.aceOverWatch.classes.gridRow).attr('ridx');

                    /*
					 * IF we are NOT on a remote grid, the save/cancel frame does NOT appear, and we consider the data saved correctly!
					 */
                    var cleanSave = settings.net.remote ? (settings.alwayssaveinlineoneditorclose? false : "checkisdirty") : true; //did this to force the check if isDirty on this record cause the data is not setup to be saved anyway

                    switch( settings.innerColumns[cIdx].atype ){
                        case 'checkbox':
                        case 'switch':
                            settings.data[rIdx].val(settings.innerColumns[cIdx].fieldname,$(target).ace('value'),cleanSave);
                            break;
                        case 'combobox':
                            settings.data[rIdx].val(settings.innerColumns[cIdx].fieldname,parentCell.find('.'+$.aceOverWatch.classes.containerField).ace('value'),cleanSave);
                            break;
                        case 'autocomplete':
                            var autoEl = $(parentCell.find('.'+$.aceOverWatch.classes.containerField)[0]);
                            settings.data[rIdx].val(settings.innerColumns[cIdx].fieldname,$.aceOverWatch.field.autocomplete.val(autoEl),cleanSave);

                            if( settings.innerColumns[cIdx].displayname && settings.innerColumns[cIdx].fieldname != settings.innerColumns[cIdx].displayname ){
                                settings.data[rIdx].val(settings.innerColumns[cIdx].displayname,$.aceOverWatch.field.autocomplete.searchVal(autoEl),cleanSave);
                            }

                            break;
                        case 'datepicker':
                            settings.data[rIdx].val(settings.innerColumns[cIdx].fieldname,input.val(),cleanSave);
                            break;
                        default:
                            if (
                                ($.aceOverWatch.utilities.isVoid(settings.data[rIdx].val(settings.innerColumns[cIdx].fieldname))) ||
                                (!$.aceOverWatch.utilities.isVoid(input.val()))
                            ) cleanSave = false;//force save this as dirty
                            settings.data[rIdx].val(settings.innerColumns[cIdx].fieldname,input.val(),cleanSave);
                    }

                    var saveInlineEditing = settings.alwayssaveinlineoneditorclose;
                    if( settings.net.remote && settings.data[rIdx].isDirty(settings.innerColumns[cIdx].fieldname) ){
                        //mark the cell as not saved
                        cell.addClass($.aceOverWatch.classes.gridCellDirty);
                        saveInlineEditing = true;
                    }

                    parentCell.html( $.aceOverWatch.utilities.renderer(settings.data[rIdx].val(settings.innerColumns[cIdx].fieldname), settings.data[rIdx], settings.innerColumns[cIdx].renderer) );
                    eData.isEditing = false;
                    parentCell.data('eCfg',eData);

                    if ((settings.inlineautosave) && (saveInlineEditing)) {
                        $.aceOverWatch.field.grid.inlineSaveCurrentRow(grid);
                    }
                    else {
                        if (settings.inlineautosave) { //still have to dismiss it
                            $.aceOverWatch.field.grid.inlineDissmissRowEdit(grid, cleanSave);
                        }
                    }

                }else{//not saving
                    parentCell.html(eData.originalValue);
                    eData.isEditing = false;
                    parentCell.data('eCfg',eData);
                }
            },

            inlineSaveCurrentRow : function(target){
                var targetField = $(target);
                var settings = targetField.data($.aceOverWatch.settings.aceSettings);
                $.aceOverWatch.field.grid.save(target,{
                    onsuccess: settings.onsavesuccessful,
                });
            },

            inlineDissmissRowEdit : function(target,clean){
                var targetField = $(target);
                var settings = targetField.data($.aceOverWatch.settings.aceSettings);
                
                if( !settings.alloweditinline || !settings.allowedit ){
                	return;
                }
                
                let inlineControls = $('.'+$.aceOverWatch.classes.gridEditInlineControls);
                if( !inlineControls.is(':visible') ){
                	/*
                	 * nothing to do, we're not editing anything
                	 */
                	return;
                }
                	
                targetField.find('.'+$.aceOverWatch.classes.gridRow+'[gid="'+settings.id+'"][ridx="'+settings.editCurrentRow+'"]').removeClass($.aceOverWatch.classes.gridInlineRow);

                if( clean == true && settings.editCurrentRow >= 0 && settings.editCurrentRow < settings.data.length ){
                	/*
                     * go through all columns, and for the dirty values replace the original values, and remove the dirty cell mark
                     */
                    for(var cIdx in settings.innerColumns){
                        if( settings.data[settings.editCurrentRow].isDirty(settings.innerColumns[cIdx].fieldname) ){
                            settings.data[settings.editCurrentRow].clean(settings.innerColumns[cIdx].fieldname);
                        }
                    }
                }
                if( settings.editCurrentRow >= 0 && settings.editCurrentRow < settings.data.length ){
                    $.aceOverWatch.field.grid.redrawRow(target,settings, settings.editCurrentRow);
                }

                inlineControls.hide();
                settings.editCurrentRow = -1;
            },

            //in this case, we just expect value to be an object, and we just paste it over internal settings
            val : function(target, value){
                if( typeof value !== 'object' ){
                    return;
                }
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                $.extend(true,settings, value);

                if( settings.cleardata ){
                    settings.data = [];
                    settings.page = 1;
                }

                return settings;
            },

            /**
             * the method determines IF the last row of the grid is visible, AND if it is, determines if we are to load the next page or not!
             */
            infiniteLoadIfNeeded : function(scrollingRegion){
                var grid = scrollingRegion.closest('.'+$.aceOverWatch.classes.containerField);
                var settings = grid.data($.aceOverWatch.settings.aceSettings);

                var lastRow = scrollingRegion.find('.'+$.aceOverWatch.classes.gridRow).last();

                if( lastRow.length == 0 ){
                    /*
					 * no rows, nothing to do
					 */
                    return true;
                }

                if( settings.loading ){
                    /*
					 * we are already in the process of loading something.. no need to check again
					 */
                    return true;
                }

                /*
				 * aproximating.. scrolled all the way, + / -
				 */

                if(
                    settings.actualPageHeight <= (scrollingRegion.scrollTop() + scrollingRegion.height() +20) * settings.infinitescrollfactor /* testing if the ROW is ABOVE the bottom line...*/

                ) {

                    //console.log(' - last row IS MAYBE visible - ridx = '+lastRow.attr('ridx'));



                    if( settings.page < settings.net.maxPages ){
                        settings.page++;

                        //console.log(' LOADING THE NEXT PAGE :> !'+settings.page);

                        if( settings.net.remote ){
                            settings.net.start = (settings.page-1) * settings.net.size;
                            settings.loading = true;
                            $.aceOverWatch.net.load(grid);
                        }else{
                            $.aceOverWatch.field.grid.displayPage(grid);
                        }

                    }else{
                        //console.log('LAST PAGE LOADED!!!!');
                    }


                } else {
                    //console.log(' - last row IS MAYBE NOT visible - ridx = '+lastRow.attr('ridx'));
                }

            },

            /*begin checkboxcol functions*/
            setColCheckState : function(obj, checkedState, triggerClick){
                if (obj.prop('checked') == checkedState) {
                	return;
                }
                if (triggerClick){
                    obj.prop('checked', checkedState).triggerHandler('click');
                }
                else{
                    obj.prop('checked', checkedState);
                }
            },

            uncheckAllCols : function(target, triggerClick){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if (!settings) return false;

                return containerField.find('.'+$.aceOverWatch.classes.gridActionCheckBoxCol)
                    .filter(function () { return $(this).prop('checked') === true; })
                    .each (function () {
                        $.aceOverWatch.field.grid.setColCheckState($(this), false, triggerClick);
                    });
            },
            checkAllCols : function(target, triggerClick){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if (!settings) return false;

                return containerField.find('.'+$.aceOverWatch.classes.gridActionCheckBoxCol)
                    .filter(function () { return $(this).prop('checked') === false; })
                    .each (function () {
                        $.aceOverWatch.field.grid.setColCheckState($(this), true, triggerClick);
                    });
            },

            getColCheckedNo : function(target){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if (!settings) return false;

                return containerField.find('.'+$.aceOverWatch.classes.gridActionCheckBoxCol)
                    .filter(function () { return $(this).prop('checked') === true; })
                    .length;
            },

            getColCheckedRecords : function(target){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if (!settings) return false;

                var res = [];

                containerField.find('.'+$.aceOverWatch.classes.gridActionCheckBoxCol)
                    .filter(function () { return $(this).prop('checked') === true; })
                    .each(function() {
                    	let el = $(this);
                        var rIdx = el.closest('.'+$.aceOverWatch.classes.gridRow).attr('ridx');

                        var settings = el.closest('.'+$.aceOverWatch.classes.containerField).data($.aceOverWatch.settings.aceSettings);

                        if( !settings ){
                            return;
                        }

                        res.push(settings.data[rIdx]);
                    });
                return res;
            }
            /*end checkboxcol functions*/

        },//end grid object

        /**
         * begin accordion object
         * the object display an accodion type list, and if it has multiple levels, it will look similar to a tree view!
         */
        accordion : {

            create : function(target, settings){

                $.extend(true,settings, $.extend(true,{
                    beforeclick : null, //customhandler to be called before click - if it returns false then the click action is reversed
                    handler:null, 		//custom handler function to do stuff when an item in the tree view is clicked
                    // handler(tag)
                    // the tag identifies the information on one of the items in the list
                    //if the item doesn't have a tag set, the handler will not be called

                    activetag:'',		//the currently active tag
                    aditionaldata:[], //used to add new items to the accordion
                    cleardata : false,

                    data : [],			//array the data being displayed, in a format like this:

                    /**
                     * [
                     * 	{
                     * 		'name':'....',
                     * 		'tag':1,
                     * 		'iconcls':'some icon classes',
                     * 		'net' : '...',  //use net to perform remote loading on click -
                     * 		'editable: true/false* //in this case the arrow for children will not be displayed, instead a + sign will be to perform a add operation on this module.
                     * 								//Also the loaded children will have a edit icon next to them
                     *
                     *       'cls' : '...', //css class(es) to be added to each element
                     *       
                     *       tpl_al : '', //set it to '1' to signal that the accordion desires to create an autoload template
                     *       tpl_app : '' //the name of the application module from which the template belongs to
                     *       tpl_path : '' //the path within the application folder where the template is found on disk
                     *       tpl_module : '',//the name of the module to be loaded
                     *       
                     *       The request sent to the server will be of this form:
                     *       	fileloadcode / tpl_app / tpl_path / [tpl_module + fileloadsufix ]
                     *       To this, the server is expected to return a file identified by:
                     *       	tpl_app / tpl_path / [tpl_module + fileloadsufix + .html ]
                     *       
                     * 	},
                     * 	{
                     * 		'name':'....',
                     * 		'tag':2
                     * 		'children':[
                     * 			{
                     * 				'name':'....',
                     * 				'tag':'xxx'
                     * 			},
                     * 			....
                     * 		]
                     * 	},
                     * .....
                     * ]
                     */
                    dictionary : {},    //an object to be used as dictionary for quick access accordion taga based on tag

                    withcheckboxes : false,
                    checkall : false,

                    enabledexpand : true,//if false, the accordeon will not expand, or collaps, when an item is clicked
                    tooglecheckonrowclick : false,//set it to true, if you want the accordion to trigger a check on the element we click
                    //works only if withcheckboxes is marked as true
                    
                    remoteidfield : '_id',		//when loading remote data from the server, this will be the field which denotes the id of the new items loaded
                    remotenamefield : '_name',	//the name of a field from which the display text will be retrieved
                    
                    /*
                     * used by the auto load functionality
                     */
                    fileloadsufix : '.tpl', //a sufix, which is added to the name of the templates
                	fileloadcode : 'tpl',	//code, sent to the server as part of the url, to signiy that a page template is desired

                }, settings ));

                if( settings.cleardata ){
                    settings.data = [];
                }else{

                    if( settings.data.length == 0 ){
                        settings.data = $.aceOverWatch.utilities.getAsociatedDataArr(target);
                    }

                }

                if (settings.aditionaldata.length > 0) {
                    settings.data = settings.data.concat(settings.aditionaldata); //if I have to add aditional items at runtime
                    settings.aditionaldata = [];
                }

                if( !$.isFunction(settings.handler) && $.isFunction(window[settings.handler]) ){
                    settings.handler = window[settings.handler];
                }

                /*
				 * used when setting the value..
				 */
                settings.initialActiveTag = settings.activetag;

                var fieldHtml = '<div class="'+$.aceOverWatch.classes.scrollView+'">';

                //now.. we build the UL thingy! :D
                var level = 0;	//deeper we go in a tree, we increase the level

                fieldHtml += $.aceOverWatch.field.accordion.parse_data(level,settings,settings.data);

                return fieldHtml;
            },


            /**
             * recursive function to build the tree level
             */
            parse_data:function(level, settings, data, renderEditIcon){
                var fieldHtml = '';
                if ((renderEditIcon===undefined)||(renderEditIcon===null)) renderEditIcon=false;
                if( $.isArray(data) ){

                    for(var idx in data){
                        fieldHtml += $.aceOverWatch.field.accordion.parse_data(level, settings, data[idx]);
                    }
                }else{
                    //it is an object!

                    var classes = [$.aceOverWatch.classes.accordionItem];

                    if( data.cls ){
                        classes.push(data.cls);
                    }

                    if( data.tag == settings.activetag ){
                        classes.push($.aceOverWatch.classes.accordionActive);
                    }

                    if (!(typeof data.iconcls == "string" && data.iconcls.length > 0 )) data.iconcls = '';

                    var iconCode = '<i class="'+ $.aceOverWatch.classes.accordionItemIcon+' '+data.iconcls+'"></i>';


                    var labelText = iconCode + '<p>' + data.name + '</p>';
                    var rightIcon = '';

                    var hasChildren = ($.isArray(data.children) && data.children.length > 0 );
                    var remoteLoading = (!$.aceOverWatch.utilities.isVoid(data.net));
                    var editable = ((!$.aceOverWatch.utilities.isVoid(data.net)) && (!$.aceOverWatch.utilities.isVoid(data.editable)));
                    if ((!$.aceOverWatch.utilities.isVoid(data.reloadonexpand)) && ((data.reloadonexpand==true)||(data.reloadonexpand=='true'))) data.reloadonexpand = true;
                    else data.reloadonexpand = false;
                    if (remoteLoading) {
                        if (editable) rightIcon += '<i class="'+$.aceOverWatch.classes.addIcon+' '+ $.aceOverWatch.classes.right + ' ' + $.aceOverWatch.classes.defaultAddIcon+'"></i>';
                        if (!data.reloadonexpand) rightIcon += '<i class="'+$.aceOverWatch.classes.refreshIcon+' '+ $.aceOverWatch.classes.right + ' ' + $.aceOverWatch.classes.defaultRefreshIcon+'"></i>'
                        classes.push($.aceOverWatch.classes.accordionItemRemoteLoad);
                    }
                    else {
                        if( hasChildren ){
                            rightIcon += '<i class="'+$.aceOverWatch.classes.arrowIcon+' '+ $.aceOverWatch.classes.right + ' ' + $.aceOverWatch.classes.defaultDownArrow+'"></i>';
                        }
                        else {
                            if (renderEditIcon) rightIcon += '<i class="'+$.aceOverWatch.classes.editIcon+' '+ $.aceOverWatch.classes.right + ' ' + $.aceOverWatch.classes.defaultEditArrow+'"></i>';;
                        }
                    }

                    var tag = '';
                    if( !$.aceOverWatch.utilities.isVoid(data.tag) ){
                        tag = data.tag;
                    }
                    var parentTag = '';
                    if( !$.aceOverWatch.utilities.isVoid(data.parenttag) ){
                        parentTag = data.parenttag;
                    }

                    var checkboxIcon = '';
                    if( settings.withcheckboxes ){
                        checkboxIcon += '<i class="'+[$.aceOverWatch.classes.accordionCheck,$.aceOverWatch.classes.fontAwesomePrefix,$.aceOverWatch.classes.iconPlus,$.aceOverWatch.classes.left].join(' ')+'"></i>';
                    }

                    var row = '<a class="'+classes.join(' ')+'" href="'+tag+'" tag="'+tag+'"'+ (parentTag!==''?' parenttag="'+parentTag+'"':'')+'>'+checkboxIcon+rightIcon+labelText+'</a>';

                    if( level > 0 ){
                        row = '<li'+ (data.cls ? data.cls : '' ) +'>' + row + '</li>';
                    }
                    if (remoteLoading) {
                        row += '<ul class="'+$.aceOverWatch.classes.accordionList+'" remotetag="'+tag+'" level="'+level+'"></ul>';
                    }
                    else {
                        if( hasChildren ){
                            row += '<ul class="'+$.aceOverWatch.classes.accordionList+'">'+
                                $.aceOverWatch.field.accordion.parse_data(level+1,settings,data.children)+
                                '</ul>';
                        }
                    }

                    fieldHtml += row;

                    settings.dictionary[tag] = data;
                    
                    /*
                     * now check the autoload template flag and if so I create the autoload templates
                     */

                    if (data.tpl_al === '1') {
                    	let url = [];
                    	if( settings.fileloadcode ){
                    		url.push(settings.fileloadcode);
                    	}
                    	if( data.tpl_app ){
                    		url.push(data.tpl_app);
                    	}
                    	if( data.tpl_path ){
                    		url.push(data.tpl_path);
                    	}
                    	
                        let tplData = {
                            'class': 'ace-app-edit-windwow ace-hide ace-auto-loadtpl '+(data.cls ? data.cls : ''),
                            tag : tag,
                            url : url.join('/'),
                            tpl : data.tpl_module+settings.fileloadsufix,
                            tplloadedcallback : data.tpl_module+'_tpl_loaded',
                            tplloadedbeforecallback: 'translate'
                        };

                        $.aceOverWatch.template.loadTemplate($('<div></div>', tplData).appendTo($(document.body)), tplData);
                    }
                }

                return fieldHtml;
            },
            afterInit : function(target,what){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                /*
                 * handles the lick on checkboxes
                 */
                containerField.find('.'+$.aceOverWatch.classes.accordionItem +' .' + $.aceOverWatch.classes.accordionCheck).unbind("click").click( function(e) {
                    let el = $(this);
                    let isChecked = el.hasClass($.aceOverWatch.classes.checked);
                    let parentEl = el.parent();
                    let tags = [parentEl.attr('tag')];
                    el.toggleClass([$.aceOverWatch.classes.checked,$.aceOverWatch.classes.iconChecked,$.aceOverWatch.classes.iconPlus].join(' '));

                    var settings = parentEl.parents('.ace-field-container').first().data($.aceOverWatch.settings.aceSettings);

                    if( settings.checkall ){

                        let nextEl = parentEl.next();
                        if( !nextEl.is('ul')){
                            //might not be on the first level.. so check if we are in an li, if so, check the next of the parent!
                            let grandParent = parentEl.parent();
                            if( grandParent.is('li') ){
                                nextEl = grandParent.next();
                                if( !nextEl.is('ul')){
                                    nextEl = false;
                                }
                            }else{
                                nextEl = false;
                            }
                        }

                        if( nextEl ){

                            let children = nextEl.find('.'+$.aceOverWatch.classes.accordionCheck);
                            if( isChecked ){
                                children.removeClass('ace-checked fa-check-circle').addClass('fa-plus-circle');
                            }else{
                                children.addClass('ace-checked fa-check-circle').removeClass('fa-plus-circle');
                            }

                            nextEl.find('.'+$.aceOverWatch.classes.accordionItem).each(function(){
                                tags.push($(this).attr('tag'));
                            });
                        }

                    }

                    for(idx in tags ){
                        settings.dictionary[tags[idx]].checked = !isChecked;
                    }

                    if( $.isFunction(settings.onchecked) ){
                        settings.onchecked(tags,settings.dictionary[tags[0]]);
                    }else{
                        if($.isFunction(window[settings.onchecked])){
                            window[settings.onchecked](tags,settings.dictionary[tags[0]]);
                        }
                    }

                    return false;//not to send the click to other even handlers!
                });

                /*
                 * handles the click on dynamic add
                 */
                containerField.find('.'+$.aceOverWatch.classes.accordionItem +' .' + $.aceOverWatch.classes.addIcon).unbind("click").click( function(e) {
                    e.preventDefault();
                    /*
                     * first create form if i haven't a;ready
                     */
                    var clickedItem = $(this).closest('.'+$.aceOverWatch.classes.accordionItem);
                    if  (!$.aceOverWatch.field.accordion.createRemoteItemForm(target, clickedItem)){
                    	return;
                    }

                    var clickedItemSettings = $.aceOverWatch.field.accordion.getRemoteItemData(target, clickedItem);

                    clickedItemSettings.editingRecord = {};
                    clickedItemSettings.editingRecord[clickedItemSettings.idfield] = -1;
                    clickedItemSettings.editingRecord = $.aceOverWatch.record.create(clickedItemSettings.editingRecord);

                    var form = $('#'+clickedItemSettings.editform.renderto);
                    if( $.aceOverWatch.field.form.loadRecord(form, clickedItemSettings.editingRecord, this) ){
                        $.aceOverWatch.field.form.show(form);
                    }

                    return false; //not to send the click to the other event handler
                });

                /*
                 * handles the click on refresh
                 */
                containerField.find('.'+$.aceOverWatch.classes.accordionItem +' .' + $.aceOverWatch.classes.refreshIcon).unbind("click").click( function(e) {

                    var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                    e.preventDefault();
                    $.aceOverWatch.field.accordion.openTag(target, $(this).attr('tag'));

                });

                /*
                 * handles the click on an item!
                 */
                containerField.find('.'+$.aceOverWatch.classes.accordionItem).unbind("click").click( function(e) {

            		let el = $(this);
                	
                    var target = el.closest('.'+$.aceOverWatch.classes.containerField);
                    var settings = target.data($.aceOverWatch.settings.aceSettings);

                    e.preventDefault();
                    var tag = el.attr('href');
                    var parenttag = tag; //for items that are remotely loaded at runtime I have to enter on the same handler for all clicked items but with different data

                    if ((!$.aceOverWatch.utilities.isVoid(el.attr('parenttag'))) && (el.attr('parenttag').length>0)){
                        parenttag=el.attr('parenttag'); //if there is a parent tag then I will call the handler with the parent tag so I can enter the same point for all the records of this parent
                    }

                    if( $.isFunction(settings.beforeclick) ){
                        if (settings.beforeclick(parenttag,settings.dictionary[tag])===false) return false;
                    }else{
                        if($.isFunction(window[settings.beforeclick])){
                            if (window[settings.beforeclick](parenttag,settings.dictionary[tag])===false) return false;
                        }
                    }

                    //testing to see if it has children!
                    //first make sure we create the settings
                    var clickedItemSettings = $.aceOverWatch.field.accordion.getRemoteItemData(target, this);

                    if ($.aceOverWatch.field.accordion.reloadItem(target, this)) return true; //return because it is on loading state

                    $.aceOverWatch.field.accordion.displaySubItems(target, el);

                    if( 	settings.tooglecheckonrowclick
                        && settings.withcheckboxes
                    ){
                        if( el.find('.ace-checked').length == 0 ){
                            $.aceOverWatch.field.accordion.checkTag(target,tag);
                        }else{
                            $.aceOverWatch.field.accordion.uncheckTag(target,tag);
                        }
                    }

                    /*
                     * IF this trigger is a result of the accordion being created, or modified with an active item, 
                     * then, in this case, we do NOT trigger the custom handler
                     */
                    if( 
                    			settings.activetag == tag
                    		&&	settings.customHandlerForActiveTagBecauseCreation === true
            		){
                    	settings.customHandlerForActiveTagBecauseCreation = false;
                    	return;
                    }
                    settings.activetag = tag;

                    if( ( !$.aceOverWatch.utilities.isVoid(tag) && tag.length > 0 ) && ($.aceOverWatch.utilities.isVoid(clickedItemSettings.net))){ //if it is remotely loading then i dont call the handler
                        if( $.isFunction(settings.handler) ){
                            settings.handler(parenttag,settings.dictionary[tag]);
                        }else{
                            if($.isFunction(window[settings.handler])){
                                window[settings.handler](parenttag,settings.dictionary[tag]);
                            }
                        }
                    }
                });
                
                if(  !$.aceOverWatch.utilities.isVoid(settings.activetag) ){
                	settings.customHandlerForActiveTagBecauseCreation = true;
                	this.openTag(target,settings.activetag);
                }

            },

            getCheckedLeaves : function(target){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                let checkedLeafTags = [];
                for(let tag in settings.dictionary ){
                    if(
                        (
                            settings.dictionary[tag].children === undefined
                            ||	(
                                $.isArray(settings.dictionary[tag].children)
                                &&	settings.dictionary[tag].children.length == 0
                            )
                        )
                        &&	settings.dictionary[tag].checked
                    ){
                        checkedLeafTags.push(tag);
                    }
                }

                return checkedLeafTags;
            },
            getCheckedTags : function(target){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                let checkedTags = [];
                for(let tag in settings.dictionary ){
                    if( settings.dictionary[tag].checked ){
                        checkedTags.push(tag);
                    }
                }

                return checkedTags;
            },


            clearData : function(target){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                settings.data = [];
                containerField.ace('modify',{});
            },

            getRemoteItemData : function(target, remoteItem) {
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                //if clickedItem item doesn't have any data setup Im setting it now becuase i might need the parent accordion (target) on callbacks and some other data
                if (!$(remoteItem).data($.aceOverWatch.settings.aceSettings)) {
                    var changedData = false;
                    //I have to setup remoteItem because of the net.load that I have to perform
                    $(remoteItem).data($.aceOverWatch.settings.aceSettings,$.extend(true, settings.dictionary[$(remoteItem).attr('tag')],$.extend(true,{
                        type:'accordionitem',
                        target:target,
                        tag:$(remoteItem).attr('tag'),
                        editable:true,
                        
                        idfield : settings.remoteidfield,
                        namefield : settings.remotenamefield,
                        
                        editform: {},
                    }, settings.dictionary[$(remoteItem).attr('tag')])));
                    var remoteItemSettings = $(remoteItem).data($.aceOverWatch.settings.aceSettings);

                    //maybe I have to parse remoteItem
                    if( (jQuery.type( remoteItemSettings.net )==='string') ){
                        remoteItemSettings.net = $.extend(true, {
                            query:'',			//search query
                            queries:'',			//search queries..
                        },$.aceOverWatch.utilities.getObjectFromText(remoteItemSettings.net));

                        changedData = true;
                    }
                    if (!$.aceOverWatch.utilities.isVoid(remoteItemSettings.net)) remoteItemSettings.net.idfieldname = remoteItemSettings.idfield;

                    if( (jQuery.type( remoteItemSettings.extraparams )==='string') ){
                        remoteItemSettings.extraparams = $.aceOverWatch.utilities.getObjectFromText(remoteItemSettings.extraparams);
                        changedData = true;
                    }
                    if( (jQuery.type( remoteItemSettings.editform )==='string') ){
                        remoteItemSettings.editform = $.aceOverWatch.utilities.getObjectFromText(remoteItemSettings.editform);
                        changedData = true;
                    }
                    if (changedData) {
                        //write them back to my data if case
                        $(remoteItem).data($.aceOverWatch.settings.aceSettings, remoteItemSettings);
                    }
                }
                else var remoteItemSettings = $(remoteItem).data($.aceOverWatch.settings.aceSettings);

                return remoteItemSettings;
            },

            createRemoteItemForm : function (target, remoteItem) {
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                var remoteItemSettings = $.aceOverWatch.field.accordion.getRemoteItemData(target, remoteItem);
                if (!remoteItemSettings.editable) return false;

                $.extend(true,remoteItemSettings.editform, $.extend({
                    type:'popup',
                    template:'',
                    renderto:'',				//specify this manually to create the edit form in THAT div
                    displaysavebtn:true,
                    displaycancelbtn:true,
                    parent:target,
                    net:{},
                    hideaftersave : true,
                }, remoteItemSettings.editform));

                remoteItemSettings.editform.net = remoteItemSettings.net;
                remoteItemSettings.editform.accordionparnetitem = remoteItem;
                remoteItemSettings.editform.extraparams = remoteItemSettings.extraparams;

                var form = remoteItemSettings.editform;
                //decided to set from outside the form type using the 'type' field, and not the proper 'ftype' for consistency' sake, to be in line with all other fields
                var type = form.ftype;
                if( $.aceOverWatch.utilities.isVoid(type) ){
                    type = form.type;
                }
                switch(type){
                    case 'popup':
                        form.renderto = remoteItemSettings.tag+'-form';
                        $('body').append('<div class="'+$.aceOverWatch.classes.formPopup+'" id="'+form.renderto+'"></div>');
                        break;
                    case 'custom':
                        //expecting the renderto div to exist
                        if( $('#'+form.renderto).length == 0 ){
                            return false;
                        }
                        break;
                    default:
                        return false;
                };

                form.ftype=type;
                form.type='form';

                //write the form back
                remoteItemSettings.editform = form;
                remoteItem.data($.aceOverWatch.settings.aceSettings, remoteItemSettings);
                //Here I create the form!!!!
                $('#'+form.renderto).ace('create',form);
                return '#'+form.renderto;

            },

            displaySubItems : function(target, clickedItem) {
            	
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                var nextEl = clickedItem.next();
                var elExpanded = false;
                if( nextEl.is('ul')){

                	if( settings.enabledexpand ){
                		nextEl.toggleClass( $.aceOverWatch.classes.show ); //clickedItem works if we are on the first level.. if not... look at else
                		if (!clickedItem.hasClass($.aceOverWatch.classes.accordionItemRemoteLoad)){
                			clickedItem.children('.'+$.aceOverWatch.classes.arrowIcon).toggleClass($.aceOverWatch.classes.defaultDownArrow+' '+$.aceOverWatch.classes.defaultUpArrow);
                		}
                	}
                    if (nextEl.hasClass($.aceOverWatch.classes.show)) elExpanded = true;
                    
                }else{
                    //might not be on the first level.. so check if we are in an li, if so, check the next of the parent!
                    var parent = clickedItem.parent();
                    if( parent.is('li') ){
                        var nextEl = parent.next();
                        if( nextEl.is('ul')){
                        	if( settings.enabledexpand ){
                        		nextEl.toggleClass( $.aceOverWatch.classes.show );
                        		if (!clickedItem.hasClass($.aceOverWatch.classes.accordionItemRemoteLoad)){
                        			clickedItem.children('.'+$.aceOverWatch.classes.arrowIcon).toggleClass($.aceOverWatch.classes.defaultDownArrow+' '+$.aceOverWatch.classes.defaultUpArrow);
                        		}
                        	}
                            if (nextEl.hasClass($.aceOverWatch.classes.show)) elExpanded = true;
                        }
                    }
                }

                //make sure ALL it's parents are visible :)
                clickedItem.parentsUntil(containerField,'ul').addClass($.aceOverWatch.classes.show);

                $(target).find('*').removeClass($.aceOverWatch.classes.accordionActive);
                clickedItem.addClass($.aceOverWatch.classes.accordionActive);

                if (elExpanded) clickedItem.addClass($.aceOverWatch.classes.accordionItemExpanded);
                else clickedItem.removeClass($.aceOverWatch.classes.accordionItemExpanded);

                if (
                    (!clickedItem.hasClass($.aceOverWatch.classes.accordionItemExpanded))
                    &&
                    (!$.aceOverWatch.utilities.isVoid(clickedItem.data($.aceOverWatch.settings.aceSettings)))
                    &&
                    (!$.aceOverWatch.utilities.isVoid(clickedItem.data($.aceOverWatch.settings.aceSettings).reloadonexpand))
                    &&
                    (clickedItem.data($.aceOverWatch.settings.aceSettings).reloadonexpand)
                ) {
                    //if the node is expanded and it should reload on expand then i remove the loaded class
                    clickedItem.removeClass($.aceOverWatch.classes.accordionItemRemoteLoaded);
                }
            },

            setTagAsActive:function(target, tag){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                containerField.find('.'+$.aceOverWatch.classes.accordionItem).removeClass($.aceOverWatch.classes.accordionActive);
                containerField.find('.'+$.aceOverWatch.classes.accordionItem+'[tag="'+tag+'"]').addClass($.aceOverWatch.classes.accordionActive);
            },

            changeDisplayForTag:function(target, tag, display){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                containerField.find('.'+$.aceOverWatch.classes.accordionItem+'[tag="'+tag+'"] p').html(display);
                /*
				 * TODO: update internal data
				 */
            },

            //hide tag..
            hideTag : function(target, tag){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                //find the accordion item
                containerField.find('.'+$.aceOverWatch.classes.accordionItem+'[href="'+tag+'"]').addClass($.aceOverWatch.classes.hide);
            },
            //show tag - the reverse of hide tag
            showTag : function(target, tag){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                //find the accordion item
                containerField.find('.'+$.aceOverWatch.classes.accordionItem+'[href="'+tag+'"]').removeClass($.aceOverWatch.classes.hide);
            },

            //forcelly selects and opend the tag :)
            openTag : function(target, tag){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                //close all opened things
                containerField.find('ul').removeClass($.aceOverWatch.classes.show);

                //find the accordion item
                let el = containerField.find('.'+$.aceOverWatch.classes.accordionItem+'[href="'+tag+'"]');
                if( el.length > 0 ){
                    el.triggerHandler('click');
                }else{
                    containerField.find('.'+$.aceOverWatch.classes.accordionItem).removeClass($.aceOverWatch.classes.accordionActive);
                }
            },

            checkTag : function(target, tag){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if( !settings.withcheckboxes ){
                    return;
                }

                let cbEl = containerField.find('.'+$.aceOverWatch.classes.accordionItem+'[tag="'+tag+'"] .'+$.aceOverWatch.classes.accordionCheck);
                if( cbEl.length == 0 ){
                    return;
                }

                if( cbEl.hasClass($.aceOverWatch.classes.checked) ){
                    /*
                     * doing this to FORCE all children too!
                     */
                    cbEl.toggleClass([$.aceOverWatch.classes.checked,$.aceOverWatch.classes.iconChecked,$.aceOverWatch.classes.iconPlus].join(' '));
                }

                cbEl.trigger('click');
            },
            uncheckTag : function(target, tag){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if( !settings.withcheckboxes ){
                    return;
                }

                let cbEl = containerField.find('.'+$.aceOverWatch.classes.accordionItem+'[tag="'+tag+'"] .'+$.aceOverWatch.classes.accordionCheck);
                if( cbEl.length == 0 ){
                    return;
                }

                if( !cbEl.hasClass($.aceOverWatch.classes.checked) ){
                    /*
                     * doing this to FORCE all children too!
                     */
                    cbEl.toggleClass([$.aceOverWatch.classes.checked,$.aceOverWatch.classes.iconChecked,$.aceOverWatch.classes.iconPlus].join(' '));
                }

                cbEl.trigger('click');
            },

            /*
             * makes sure all tags are expanded!
             */
            openAllTags : function(target){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                containerField.find('ul').addClass($.aceOverWatch.classes.show);
                containerField.find('.fa-angle-down').removeClass('fa-angle-down').addClass('fa-angle-up');
            },

            closeAllTags : function(target){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                containerField.find('ul').removeClass($.aceOverWatch.classes.show);
                containerField.find('.fa-angle-up').removeClass('fa-angle-up').addClass('fa-angle-down');
            },

            setLoadingItemIndicators : function(target, clickedItem) {
                var containerField = $(target);
                var settings = $(containerField).data($.aceOverWatch.settings.aceSettings);
                var tag = $(clickedItem).attr('tag');

                $(clickedItem).find('.'+$.aceOverWatch.classes.accordionItemIcon).toggleClass(settings.dictionary[tag].iconcls);
                $(clickedItem).find('.'+$.aceOverWatch.classes.accordionItemIcon).toggleClass($.aceOverWatch.classes.loadingIcon);
                $(clickedItem).addClass($.aceOverWatch.classes.accordionItemRemoteLoading);
            },

            removeLoadingItemIndicators : function(target, clickedItem) {
                var containerField = $(target);
                var settings = $(containerField).data($.aceOverWatch.settings.aceSettings);
                var tag = $(clickedItem).attr('tag');

                $(clickedItem).find('.'+$.aceOverWatch.classes.accordionItemIcon).toggleClass(settings.dictionary[tag].iconcls);
                $(clickedItem).find('.'+$.aceOverWatch.classes.accordionItemIcon).toggleClass($.aceOverWatch.classes.loadingIcon);
                $(clickedItem).removeClass($.aceOverWatch.classes.accordionItemRemoteLoading);
            },

            reloadItem : function(target, clickedItem, forceReload) {
                if ((forceReload===undefined)||(forceReload===null)) forceReload=false;

                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                if ($(clickedItem).hasClass($.aceOverWatch.classes.accordionItemRemoteLoad)) {
                    var clickedItemSettings = $.aceOverWatch.field.accordion.getRemoteItemData(target, clickedItem);

                    //if is already loading then I return
                    if (($(clickedItem).hasClass($.aceOverWatch.classes.accordionItemRemoteLoading)) && (!forceReload)) return true;


                    //clickedItem item will load remotely and will behave differentely therefore I'm starting the loading process
                    if (
                        (!$(clickedItem).hasClass($.aceOverWatch.classes.accordionItemRemoteLoaded)) ||
                        (forceReload)
                    ) {
                        //the item wasn't loaded yet therefore I start the loading process on it and return
                        $.aceOverWatch.field.accordion.setLoadingItemIndicators(target, clickedItem);
                        $.aceOverWatch.net.load(clickedItem, clickedItemSettings.extraparams);
                        return true;
                    }
                }
                return false;//not loading for now
            },

            delItem : function(target, itemTag, delId, callbacks) {
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                var itemSettings = settings.dictionary[itemTag];
                var parentItem = $(target).find('[tag="'+itemSettings.parenttag+'"]');
                var parentItemSettings = settings.dictionary[itemSettings.parenttag];

                var deleteData = {
                    rows:[{}]
                };
                deleteData.rows[0][parentItemSettings.idfield] = delId;

                $.aceOverWatch.prompt.show(_aceL.are_you_sure_delete,function() {
                    $.aceOverWatch.field.accordion.setLoadingItemIndicators(target, parentItem);
                    $.aceOverWatch.net.delete_(parentItem, deleteData, callbacks); //net settings are on parent :D
                },{type:'question'});

            },

            deleteSuccessful : function(target,record, data){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);

                $.aceOverWatch.field.accordion.reloadItem(settings.target, target, true); //force reload
                $.aceOverWatch.field.accordion.displaySubItems(settings.target, $(target)); //force display of reloaded items
                $.aceOverWatch.toast.show('success',_aceL.deleted_ok);
            },


            save : function(target, record, callbacks){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);
                //the last edited row is -> settings.editCurrentRow

                settings.editingRecord.setDirty(settings.idfield,true);//settings the identity as dirty; otherwise the identity won't be sent on updates
                if( settings.editingRecord.val(settings.idfield) <= 0 ){
                    $.aceOverWatch.net.save(target,settings.editingRecord,callbacks,'create');
                }else{
                    $.aceOverWatch.net.save(target,settings.editingRecord,callbacks);
                }
            },

            saveSuccessful : function(target,rawData){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);

                if (settings.editform.hideaftersave) {
                    var form = $('#'+settings.editform.renderto);
                    $.aceOverWatch.field.form.hide(form);
                }
                $.aceOverWatch.toast.show('success',_aceL.saved_ok);

                $.aceOverWatch.field.accordion.reloadItem(settings.target, target, true);

                if( $.isFunction(settings.onsavesuccessful) ){
                    settings.onsavesuccessful(target,settings.data[positionIdx]);
                }else{
                    if($.isFunction(window[settings.onsavesuccessful])){
                        window[settings.onsavesuccessful](tag,settings.data[positionIdx]);
                    }
                }
            },

            setData : function(target, clickedItem, rows,totalCount) {
                $(clickedItem).addClass($.aceOverWatch.classes.accordionItemRemoteLoaded);
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                var itemSettings = $(clickedItem).data($.aceOverWatch.settings.aceSettings);
                if (!settings) return;
                var ulPlaceholder = $(clickedItem).next();
                var level = parseInt(ulPlaceholder.attr('level'));
                if (!$.isNumeric(level)) return;

                var dataRows = [];
                for(i=0;i<rows.length;i++) {
                    dataRows.push({
                        name: rows[i][itemSettings.namefield],
                        id:rows[i][itemSettings.idfield],
                        parenttag: itemSettings.tag,
                        tag : itemSettings.tag+'_'+rows[i][itemSettings.idfield],
                        action: itemSettings.action,
                        //net: itemSettings.net, //if sent
                        idfield: itemSettings.idfield, //if sent
                        //extraparams: itemSettings.extraparams, //if sent
                    });
                }

                var loadedChildren = $.aceOverWatch.field.accordion.parse_data(level+1,settings,dataRows);
                ulPlaceholder.html(loadedChildren);
                $.aceOverWatch.field.accordion.afterInit(target);

                $.aceOverWatch.field.accordion.displaySubItems(target, $(clickedItem));
            },

            toogle : function(target) {
            	/*
            	 * obsolete, to be removed
            	 */
            },

            expand : function(target) {
            	/*
            	 * obsolete, to be removed
            	 */
            },

            contract : function(target) {
            	/*
            	 * obsolete, to be removed
            	 */
            },

            val : function(target, value, extra, record){
                var settings = $(target).data($.aceOverWatch.settings.aceSettings);

                if( settings == null ){
                    return false;
                }

                if( value == null ){
                    return settings.activetag;
                }

                /*
				 * if the tag provided is invalid, go to initial active tag
				 */
                if( $.aceOverWatch.utilities.isVoid(settings.dictionary[value]) ){
                    return $.aceOverWatch.field.accordion.openTag(target,settings.initialActiveTag);
                }

                return $.aceOverWatch.field.accordion.openTag(target,value);
            }
        },

        /**
         * begin pagination object
         **/
        pagination : {

            create : function(target, settings){

                $.extend(true,settings, $.extend(true,{
                    maxPages:1,	//the max pages
                    page:1,		//the current page
                    //callbacks
                    onPageChanged:null		//a custom function with one parameter! the current page!
                }, settings ));

                var fieldHtml = '<div class="'+$.aceOverWatch.classes.datepickerField+'" >';

                fieldHtml += $.aceOverWatch.field.label.create(settings);
                fieldHtml += $.aceOverWatch.field.badge.create(settings);

                var tooltip = '';
                if( settings['tooltip'] ){
                    tooltip = ' data-toggle="tooltip" data-placement="bottom" data-trigger="hover" data-original-title="'+settings['tooltip']+'" ';
                }

                fieldHtml += '<div class="'+$.aceOverWatch.classes.gridPagination+'" >\
					<button jt="0" >&lt;&lt;</button>\
					<button jt="-1">&lt;</button>\
					&nbsp;<div><span>'+_aceL.page+'</span><input type="number" value="'+settings.page+'"><span>' + _aceL.of + '&nbsp;</span><span class="'+$.aceOverWatch.classes.gridPaginationTP+'">0</span></div>\
					<button jt="1">&gt;</button>\
					<button jt="2">&gt;&gt;</button>\
				';

                fieldHtml += '<span class='+$.aceOverWatch.classes.errorMsg+'></span>';
                fieldHtml += '</div>';

                return fieldHtml;
            },

            afterInit : function(target,what){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                $.aceOverWatch.field.pagination.update(target);

                /*
                 * handling click on pagination buttons
                 */
                containerField.find('.'+$.aceOverWatch.classes.gridPagination).find('button').unbind().on('click',function(){

                    var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                    var settings = target.data($.aceOverWatch.settings.aceSettings);

                    var newPage = settings.page;

                    switch($(this).attr('jt')){
                        case '0'://go to first page
                            newPage = 1;
                            break;
                        case '-1':
                            if( newPage > 1 ){
                                newPage--
                            }
                            break;
                        case '1'://advance one page
                            if( newPage < settings.maxPages ){
                                newPage++;
                            }
                            break;
                        case '2'://advance to last page
                            newPage = settings.maxPages;
                            break;
                    }

                    if( newPage != settings.page ){
                    	$.aceOverWatch.field.grid.inlineDissmissRowEdit(target);
                        $.aceOverWatch.field.pagination.onPageChange(target,settings,newPage);
                    }
                });

                /*
                 * handling direct custom page modification
                 */
                containerField.find('.'+$.aceOverWatch.classes.gridPagination).find('input').unbind().on('change',function(){

                    var target = $(this).closest('.'+$.aceOverWatch.classes.containerField);
                    var settings = target.data($.aceOverWatch.settings.aceSettings);

                    var page = parseInt($(this).val());
                    if(isNaN(page)){
                        return;
                    }

                    if( page < 1 || page > settings.maxPages ){
                        page = settings.page;
                        $(this).val(settings.page);//this updates the input field with the adjusted page value
                    }

                    if( page != settings.page ){
                    	$.aceOverWatch.field.grid.inlineDissmissRowEdit(target);
                        $.aceOverWatch.field.pagination.onPageChange(target,settings,page);
                    }
                });
            },

            onPageChange : function(target, settings, page){
                if( !settings ){
                    return;
                }

                if( settings.page != page ){
                    settings.page = page;
                    if( $.isFunction(settings.onPageChanged) ){
                        settings.onPageChanged(settings.page);
                    }
                }

                $.aceOverWatch.field.pagination.update(target);
            },

            update : function(target){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                var paginationDiv = containerField.find('.'+$.aceOverWatch.classes.gridPagination);

                paginationDiv.find('input').val(settings.page);
                paginationDiv.find('span.'+$.aceOverWatch.classes.gridPaginationTP).html(settings.maxPages);

                if( settings.maxPages == 1 ){
                    paginationDiv.find('button').hide();
                }else{
                    paginationDiv.find('button').show();
                    if( settings.page == 1 ){
                        paginationDiv.find('button[jt="0"]').prop('disabled', true);
                        paginationDiv.find('button[jt="-1"]').prop('disabled', true);
                    }else{
                        paginationDiv.find('button[jt="0"]').prop('disabled', false);
                        paginationDiv.find('button[jt="-1"]').prop('disabled', false);
                    }

                    if( settings.page == settings.maxPages ){
                        paginationDiv.find('button[jt="1"]').prop('disabled', true);
                        paginationDiv.find('button[jt="2"]').prop('disabled', true);
                    }else{
                        paginationDiv.find('button[jt="1"]').prop('disabled', false);
                        paginationDiv.find('button[jt="2"]').prop('disabled', false);
                    }
                }
            },

            //value can be a normal value, in which it will be the current page
            //or it can be an object that may have one of these values: page and maxPages
            val : function(target,value){
                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

                var page = settings.page;
                var maxPages = settings.maxPages;

                if( typeof value == 'object' ){
                    if( value.page ){
                        page = parseInt(value.page);
                    }
                    if( value.maxPages ){
                        maxPages = parseInt(value.maxPages);
                    }
                }

                if( !isNaN(page) && !isNaN(maxPages) && (page > 0) && (maxPages >= 0) && (page != settings.page || maxPages != settings.maxPages) ){

                    settings.maxPages = maxPages;
                    if( page > maxPages ){
                        page = 1;
                    }

                    $.aceOverWatch.field.pagination.onPageChange(target, settings, page);
                }
            }

        },//end pagination


        /**
         * begin cardview object
         */
        cardview : {
            create : function(target, settings){
                var containerField = $(target);

                if( !settings ){
                    //build the options from the properties of the field
                    settings = {};

                    $.each(containerField.attributes, function() {
                        // this.attributes is not a plain object, but an array
                        // of attribute nodes, which contain both the name and value
                        if(this.specified) {

                            switch( this.name ){
                                case 'extraparams':
                                    settings[this.name] = $.aceOverWatch.utilities.getObjectFromText(this.value);
                                    break;
                                case 'displayexpanded':
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
                    contentselector : '.'+$.aceOverWatch.classes.cardViewItem,
                    restricttoparent : false,//true, if the selector should be applid only to the initial body of the card view
                    listeners:{},
                }, settings ));

                $.aceOverWatch.field.cardview.applySettings(target,settings);
                return ;
            },

            modify : function(target, options){
                var containerField = $(target);

                var settings = containerField.data($.aceOverWatch.settings.aceSettings);
                if( !settings ){
                    return;
                }

                //some fields may not be changed...
                //delete options.<property that i should not be able to modify>;

                $.extend(true, settings, options );
                $.aceOverWatch.field.cardview.applySettings(target,settings);
                return;
            },

            applySettings : function(target,settings){
                var fieldHTML = '', addEmptyCls = true;
                var containerField = $(target);
                var noCards = 0, cardItems = [];
                var contentSelector = settings.contentselector;

                if (!contentSelector) return false;

                //if any items - hide them and move them back to the body
                containerField.find($.aceOverWatch.classes.cardViewItem).addClass($.aceOverWatch.classes.hide).removeClass($.aceOverWatch.classes.cardViewItem).detach().appendTo($('body'));

                containerField.data($.aceOverWatch.settings.aceSettings,settings);
                containerField.data('contentSelector',contentSelector);
                containerField.data('cardsNo',noCards);
                containerField.data('cards',cardItems);
                containerField.data('activeCard',''); //noone selected

                /*
                 * finding the cards
                 */
                if (settings.restricttoparent) {
                    containerField.find(contentSelector).each(function (index, el) {
                        $.aceOverWatch.field.cardview.addCard(target, $(el), true);
                    });
                }
                else {
                    $(contentSelector).each(function (index, el) {
                        $.aceOverWatch.field.cardview.addCard(target, $(el).detach());
                    });
                }

                $.aceOverWatch.field.cardview.switchTo(target, 0);
                return target;
            },

            /**
             * adds a new card to the cardview
             * target - the cardview
             * cardEl - the element to be added
             * alraedyIn - true, if the element is already a descendend of the cardview
             */
            addCard : function(target, cardEl, alreadyIn = false ) {
                if (!cardEl) return false;
                var containerField = $(target);

                var myCard = $(cardEl).addClass($.aceOverWatch.classes.hide).addClass($.aceOverWatch.classes.cardViewItem);
                if( !alreadyIn ){
                	myCard.detach().appendTo(containerField);
                }
                containerField.data('cardsNo',containerField.data('cardsNo')+1);

                var cardItems = containerField.data('cards');
                cardItems.push(cardEl);
                return true;
            },

            /**
             * @param card - identifies the card inside the switch
             * 				can be numeric, in which case it is the index of the card; first index is 0
             * 				can be a string, in which case it is a selector inside the switch
             * @param callback - a function, or the name of a function in window; if it exists, it will be execute after the switch has been performed
             */
            switchTo : function(target, card, callback) {
                var containerField = $(target);
                if (!containerField) return false;

                containerField.children('.'+$.aceOverWatch.classes.cardViewItem).addClass($.aceOverWatch.classes.hide);
                containerField.data('activeCard','');
                switch ($.type(card)) {
                    
                	case 'number' : //switch to index
                        var myCards = containerField.data('cards');
                        if (!myCards || card >= myCards.length || $.aceOverWatch.utilities.isVoid(myCards[card]) ){
                        	return false;
                        }

                        myCards[card].removeClass($.aceOverWatch.classes.hide);
                        containerField.data('activeCard',card);
                        break;
                    
                    case 'string' : //switch by selector
                        containerField.children(card).removeClass($.aceOverWatch.classes.hide);
                        containerField.data('activeCard',card);
                        break;

                    default :
                        return false;
                        break;
                }
                
                $.aceOverWatch.utilities.runIt(callback,target);

                return true;
            }

        },//end cardview

        /**
         * begin searchform
         * TODO: add details?
         */
        searchform : {
            create : function(target, settings){
                var containerField = $(target);

                //we are using 2 extend because we do not want the default settings to overwrite the given settings if any
                $.extend(true,settings,$.extend(true,{
                    modulename 			: '', //a module id used to prefix the search fields
                    showaddbutton 		: true,
                    grid				: '', //grid ID to perform search / order operations to - witout the need of calling any callbacks
                    advcancedfilter		: false,  //set this to true to send the advanced search object as filter instead of extra_filter
                    advsearchfields 	: [], //this is an array of fields used for building the advanced search interface
                    orderbyfields 		: [], //this is an array of fields that will result in items for the burger menu of the search feature used for ordering the result query
                    onAddNew			: null, //callback for add new record operation - 1 param - first the target (the searchform)
                    //this one is called AFTER the add operation has been initiated!
                    oncustomaddnew		: false,//this method replaces the custom add new functionality of the associated grid entirely
                    //the function onAddNew, IF DEFINED, will still be called, AFTER the custom add new was called

                    onSearch			: null, //callback for search operation - 2 params - first the target (the searchform) and second the search object (if not object then is quick search otherwise is advanced search)
                    onChangeSortOrder	: null,//callback for sort
                }, settings ));


                //if no items exist and none were give, try to find some in the html data tags
                if( settings.advsearchfields instanceof Array || settings.advsearchfields.length == 0 ){
                    settings.advsearchfields = $.aceOverWatch.utilities.getAsociatedDataArr(target,'advsearchfields');
                }
                if( settings.orderbyfields instanceof Array || settings.orderbyfields.length == 0 ){
                    settings.orderbyfields = $.aceOverWatch.utilities.getAsociatedDataArr(target,'orderbyfields');
                }

                settings.onCustomAddNew = false;
                if( $.isFunction(settings.oncustomaddnew) ){
                    settings.onCustomAddNew = settings.oncustomaddnew;
                }else{
                    if( $.isFunction(window[settings.oncustomaddnew]) ){
                        settings.onCustomAddNew = window[settings.oncustomaddnew];
                    }
                }


                $.aceOverWatch.field.searchform.customBuild(target,settings);

                return '';
            },

            afterInit : function(target, what){

                var containerField = $(target);
                var settings = containerField.data($.aceOverWatch.settings.aceSettings);

            },

            customBuild : function(target,settings){
                var fieldHTML = '', addEmptyCls = true;
                var containerField = $(target);


                //$.aceOverWatch.utilities.log('ADV Search Fields');
                //$.aceOverWatch.utilities.log(settings.advsearchfields);

                containerField.addClass($.aceOverWatch.classes.dataSearch);
                containerField.data($.aceOverWatch.settings.aceSettings,settings);


                /* BEGIN QuickSEARCH*/
                var quickSearchTarget = $('<div></div>').addClass($.aceOverWatch.classes.dataSearchPanel);
                var quickSearchTriggerBtnContainer = $('<div></div>').addClass($.aceOverWatch.classes.triggerBtnContainer).appendTo(quickSearchTarget);

                var quickSearch = $('<div></div>').ace('create',{

                    fieldname: settings.modulename+'_quick_search',
                    placeholder: _aceL.search,

                    onchange:function(t,value){
                        $.aceOverWatch.field.searchform.search(target, value);
                    }

                }).addClass($.aceOverWatch.classes.fieldcell).addClass($.aceOverWatch.classes.quickSearchField).appendTo(quickSearchTriggerBtnContainer);

                var quickSearchBtn = $('<div class="ace-search-panel-submit"></div>').ace('create',{
                    type: 'iconbutton',
                    iconcls: 'fa fa-search',
                    action: function() {
                        $.aceOverWatch.field.searchform.search(target, $(target).find('input[name="'+settings.modulename+'_quick_search'+'"]').val());
                    }
                }).addClass($.aceOverWatch.classes.fieldcell).appendTo(quickSearchTriggerBtnContainer);


                var quickSearchMenuItems = [];
                if (settings.orderbyfields.length>0) {
                    quickSearchMenuItems.push({
                        label: _aceL.sortby,
                        type: 'grouplabel',
                    });
                    $.each(settings.orderbyfields, function(index, value) {
                        var searchFld = $('<div></div>').ace('create', value).addClass($.aceOverWatch.classes.col12).addClass($.aceOverWatch.classes.fieldcell).appendTo(advSearchPanel);
                        quickSearchMenuItems.push(value);
                    });
                }
                quickSearchMenuItems.push({
                    label:_aceL.advsearch,
                    action : function() {
                        containerField.find('.'+$.aceOverWatch.classes.dataSearchPanel).addClass($.aceOverWatch.classes.hide);
                        containerField.find('.'+$.aceOverWatch.classes.dataAdvSearchPanel).removeClass($.aceOverWatch.classes.hide);
                    }
                });

                var quickSearchMenu = $('<div class="ace-search-panel-menu-button"></div>').ace('create',{
                    type: 'menubutton',
                    items: quickSearchMenuItems,
                }).addClass($.aceOverWatch.classes.fieldcell).appendTo(quickSearchTriggerBtnContainer);
                /* END QuickSEARCH*/

                if (settings.showaddbutton) {
                    var quickAddBtn = $('<div class=" ace-search-panel-add-button"></div>').ace('create',{
                        type: 'iconbutton',
                        iconcls: 'fa fa-plus',
                        action: function() {
                            $.aceOverWatch.field.searchform.addrec(target);
                        }
                    }).addClass($.aceOverWatch.classes.fieldcell).appendTo(quickSearchTriggerBtnContainer);
                }

                /* BEGIN AdvancedSEARCH*/
                var advSearchPanel = $('<div></div>').addClass($.aceOverWatch.classes.dataAdvSearchPanel).addClass($.aceOverWatch.classes.hide).addClass($.aceOverWatch.classes.triggerBtnContainer);
                var advSearchCloseBtn =  $('<div></div>').ace('create',{
                    type: 'iconbutton',
                    iconcls: 'fa fa-angle-left ace-advanced-expand',
                    action : function() {
                        containerField.find('.'+$.aceOverWatch.classes.dataAdvSearchPanel).addClass($.aceOverWatch.classes.hide);
                        containerField.find('.'+$.aceOverWatch.classes.dataSearchPanel).removeClass($.aceOverWatch.classes.hide);
                    }
                }).addClass($.aceOverWatch.classes.fieldcell).addClass($.aceOverWatch.classes.col12).appendTo(advSearchPanel);


                if (settings.advcancedfilter===false) {
                    $.each(settings.advsearchfields, function(index, value) {
                        var searchFld = $('<div></div>').ace('create', value).addClass($.aceOverWatch.classes.col12).addClass($.aceOverWatch.classes.fieldcell).addClass($.aceOverWatch.classes.advSearchField).appendTo(advSearchPanel);
                    });

                    var advSearchAllCond= $('<div></div>').ace('create', {
                        type:'checkbox',
                        fieldname: settings.modulename+'_advs_all_conditions',
                        label: _aceL.allconditions,
                        checked: true,
                    }).addClass($.aceOverWatch.classes.col12).appendTo(advSearchPanel);

                    var advSearchAllCond= $('<div></div>').ace('create', {
                        type:'checkbox',
                        fieldname: settings.modulename+'_advs_exact_macth',
                        label: _aceL.exactmatch,
                        checked: false,
                    }).addClass($.aceOverWatch.classes.col12).appendTo(advSearchPanel);


                    var advSearchBtn = $('<div></div>').ace('create',{
                        type: 'button',
                        iconcls: 'fa fa-search',
                        value: _aceL.search,
                        action: function() {
                            if (settings.advcancedfilter===false) {
                                var searchFields = {};
                                //traversing all adv search fields to find
                                $.each($(target).find('.'+$.aceOverWatch.classes.advSearchField), function (index, advSearchFld) {
                                    var fldSettings = $(advSearchFld).data($.aceOverWatch.settings.aceSettings);
                                    if ($.aceOverWatch.field.value(advSearchFld)!=="")
                                        searchFields[fldSettings.name] = $.aceOverWatch.field.value(advSearchFld);
                                });

                                var filter = {
                                    allconditions: $(target).find('input[name="'+settings.modulename+'_advs_all_conditions'+'"]').is(':checked'),
                                    exactmatch: $(target).find('input[name="'+settings.modulename+'_advs_exact_macth'+'"]').is(':checked'),
                                    fields:searchFields
                                };
                            }
                            else {
                                var searchFields = [];
                                //traversing all adv search fields to find
                                $.each($(target).find('.'+$.aceOverWatch.classes.advSearchField), function (index, advSearchFld) {
                                    var fldSettings = $(advSearchFld).data($.aceOverWatch.settings.aceSettings);
                                    if (settings.advcancedfilter)
                                        searchFields.push({
                                            field: fldSettings.name,
                                            tblalias:fldSettings.tblalias,
                                            data: {
                                                type: ($.aceOverWatch.utilities.isVoid(fldSettings.searchtype)?'textsearch': fldSettings.searchtype),
                                                comparision: ($.aceOverWatch.utilities.isVoid(fldSettings.seachcomparision)?'': fldSettings.seachcomparision),
                                                value: $.aceOverWatch.field.value(advSearchFld),
                                            }
                                        });
                                });

                                var filter = {
                                    allconditions: $(target).find('input[name="'+settings.modulename+'_advs_all_conditions'+'"]').is(':checked'),
                                    exactmatch: $(target).find('input[name="'+settings.modulename+'_advs_exact_macth'+'"]').is(':checked'),
                                    fields:searchFields
                                };
                            }


                            $.aceOverWatch.field.searchform.search(target, filter);

                        }
                    }).addClass($.aceOverWatch.classes.col12).addClass($.aceOverWatch.classes.fieldcell).addClass($.aceOverWatch.classes.right).appendTo(advSearchPanel);
                }
                else {
                    //TODO build the advanced filter form - with a list like items and the selection will be based on our internal filter procesing (not null, null, gt, gte, etc.)
                }

                /* END AdvancedSEARCH*/


                containerField.append(quickSearchTarget);
                containerField.append(advSearchPanel);

                return target;
            },

            search : function(target, queryObj){
                var settings =  $(target).data($.aceOverWatch.settings.aceSettings);
                if ($.aceOverWatch.utilities.isVoid(settings)) return;
                if (!$.aceOverWatch.utilities.isVoid(settings.grid) && ( $('#'+settings.grid).length > 0)) {
                    $.aceOverWatch.field.grid.search($('#'+settings.grid), queryObj, (settings.advcancedfilter===true));
                }
                if ($.isFunction(settings.onSearch)) {
                    settings.onSearch.call(target, queryObj);
                }
            },

            addrec : function(target){
                var settings =  $(target).data($.aceOverWatch.settings.aceSettings);
                if ($.aceOverWatch.utilities.isVoid(settings)) return;

                if( settings.onCustomAddNew ){
                    settings.onCustomAddNew(target);
                }else{
                    if (!$.aceOverWatch.utilities.isVoid(settings.grid) && ( $('#'+settings.grid).length > 0)) {
                        $.aceOverWatch.field.grid.addNewRecord($('#'+settings.grid));
                    }
                }

                if ($.isFunction(settings.onAddNew)) {
                    settings.onAddNew.call(target);
                }
            }

        }//end searchform object
    };

    /**
     * plugin starts here
     */

    $.fn.ace = function( action, options, extra, suplementary ) {

        //in most cases, this function can be used to chain stuff up
        //in others, that's not going to work; for example: value

        if( !action ){
            action = 'value';
        }

        //these are action which don't return objects, but values directly, or something else
        switch(action){
            case 'value':
                return $.aceOverWatch.field.value(this, options, extra, suplementary);
            
            case 'settings':
            	return $.aceOverWatch.field.settings(this, options);
            	
            case 'netparams':
            	return $.aceOverWatch.field.netparams(this, options,extra);
                
            case 'validate':
                var isValid = true;

                this.each(function() {
                    var debugValidation = {};
                    var tmpVal = $.aceOverWatch.field.validate(this, options, debugValidation);
                    if (!tmpVal) {
                        $.aceOverWatch.utilities.log({
                            msg : ' Validation :> INVALID FIELD FOUND ',
                            debugValidation : debugValidation,
                        },'debug');
                    }
                    isValid =  tmpVal && isValid;
                });
                return isValid;
            case 'find':
                return  $.aceOverWatch.field.find(this, options);
                break;
        }

        //-- these commands return the initial calling element(s)
        return this.each(function() {

            switch( action ){
                case 'create'://to create a new field
                    if ($(this).attr('id') == 'documents-add-button') console.log('creating add button on DOCS');
                    return  $.aceOverWatch.field.create(this, options);
                case 'modify'://to modify an existing field; this operation will redraw the item
                    return  $.aceOverWatch.field.modify(this, options);
                case 'show':
                    return $.aceOverWatch.field.show(this, options);
                case 'save':
                    return $.aceOverWatch.field.save(this, options, extra);
                case 'cancel':
                    return $.aceOverWatch.field.cancel(this, options, extra);
                case 'hide':
                    return $.aceOverWatch.field.hide(this, options);
                case 'load':
                    return  $.aceOverWatch.net.load(this, options, extra);
                case 'loadrecord':
                    return  $.aceOverWatch.field.record(this, options);
                case 'loadtpl':
                    return  $.aceOverWatch.template.loadTemplate(this, options);
                default:
                    return this;
            }

        });

    };

}( jQuery ));
