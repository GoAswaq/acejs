 /**
  *	called when the window's hash has changed 
  */
 function onHashChange(){
	 var hash = window.location.hash.substr(1).split('/');
	 if( hash.count == 0 ){
		 return;
	 }else{
		 
		 if( hash[0].length == 0 ){
			 return;
		 }
		 
		 for(let idx in hash){
			 hash[idx] = decodeURI(hash[idx]);
		 }
	 }
	 
	 internalNavigation(hash);
	 
	 window.location.hash = '';
}
 
 /**
  * this is an utility function
  * it does various thing for various reasons
  * it should be run for every new template loaded
  */
 function initMotion(target){
 	let t = $(target);

     t.find('.ace-close').unbind('click').click(function(){
 		$(this).parents('.ace-info-side').fadeOut( 200, function(){});
 	});
     t.find('.ace-advanced-panel-close').unbind('click').click(function(e){
 		e.preventDefault();
 		$(this).parents('.ace-advanced-panel').removeClass('ace-show');
 	});
     
     t.find('.ace-collapsible-trigger').unbind('click').click(function(e){
         e.preventDefault();
         let el = $(this).parents('.ace-collapsible').first(); 
         el.toggleClass('ace-show');
         el.find('.ace-collapsible-content').first().toggleClass('ace-show');
     });
 }

 /**
  * general method, to log out the current user, change as needed
  */
function logout() {
 	$.post( app_path, { fid: "11"}).done(function( data ) {
 		location.reload();
 	});
}

function create_app_with_default_settings(){

	$('body').ace_app({
		topbar						: window['hideACETopBar']    === true	? '' : '#my-app-top-bar',
        sidemenu					: window['hideACESideMenu']  === true  ? '' : '#main-menu',
        bottombar					: window['hideACEBottomBar'] === true  ? '' : '#my-app-bottom-bar',
		
		groupsidebarwithcontent		: window['groupSidebarWithContent'] === true,
		
		contentselector				: '.ace-app-edit-windwow',
	});
	
	if( $.isFunction($(window).hashchange)){
		$(window).hashchange( onHashChange );
		/*
		 * giving a time to let the page load entirely.. then check to see if it has an intial hash
		 */
		setTimeout(function(){
			if(String(window.location.hash).length > 0 ){
				onHashChange();
			}
		},2000);
	}
}

$(function(){
	initMotion($('body'));

    /*
     * translating existing elements
     */
	$.aceOverWatch.utilities.runIt('translate');
    
    /*
	 * auto generate all necesasry fields
	 */
	$('.ace-auto-gen').ace('create');
	
	/*
	 * auto load all detected templates 
	 */
	$('.ace-auto-loadtpl').ace('loadtpl');
	

	/*
	 * creating the application
	 */
	create_app_with_default_settings();
});
