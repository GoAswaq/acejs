/**
 * IF the new hash is DIFFERENT than current hash, than we simply set the hash to the new value
 * otherwise, we force  process it
 * @param hash
 */
function forceHashNavigation(hash){
	if( hash[0] != '#' ){
		hash = '#'+hash;
	}
	if( window.location.hash == hash ){
		onHashChangeInternal(hash)
	}else{
		window.location.hash = hash;
	}
}

/**
 *	called when the window's hash has changed
 */
function onHashChange(){
	onHashChangeInternal(window.location.hash);
}


function onHashChangeInternal(hash){
	hash = hash.substr(1).split('/');
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

	if( !$.aceOverWatch.settings.usingNewCSSVersion ) {
		window.location.hash = '';
	}
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

function create_app_with_default_settings(){

	$('body').ace_app({
		topbar						: window['hideACETopBar']    === true	? '' : '#my-app-top-bar',
		sidemenu					: window['hideACESideMenu']  === true  ? '' : '#main-menu',
		hidesidemenuinitially		: window['hideACESideMenuInitially']  === true  ? true : false,
		bottombar					: window['hideACEBottomBar'] === true  ? '' : '#my-app-bottom-bar',

		groupsidebarwithcontent		: window['groupSidebarWithContent'] === true,

		contentselector				: '.ace-app-edit-windwow',
	});

	if( $.isFunction($(window).hashchange)){
		$(window).hashchange( onHashChange );
		/*
		 * giving a time to let the page load entirely.. then check to see if it has an initial hash
		 */
		if( $.aceOverWatch.settings.usingNewCSSVersion ) {
			myApp.initialHash = window.location.hash;
		}else {
			/*
			 * this part is used to compatibility to an older system; to be removed, soon
			 */
			setTimeout(function () {
				if (String(window.location.hash).length > 0) {
					onHashChange();
				}
			}, 1000);
		}
	}
}

function logout() {
	$.post( app_path, { fid: "11"}).done(function( data ) {
		location.reload();
	});
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
