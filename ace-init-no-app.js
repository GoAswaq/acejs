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
	 }
	 
	 internalNavigation(hash);
	 
	 window.location.hash = '';
 }
 $.aceAppOverWatch = {

     //these are global settings used throughout the application
     settings : {
         totalmargin : 220,
         totalmargin_sec : 56,
         no_margin : 0,
     },
 };

$(document).ready(function(){
	
	$('.ace-close').click(function(){
		$(this).parents('.ace-info-side').fadeOut( 200, function(){});
		$('.ace-entry-item').removeClass('ace-entry-item-current');
	
	});

	$('body').click(function() {
		$(".ace-dropdown-list").fadeOut( 100, function(){});
		$(".ace-dropdown-trigger-click").removeClass('ace-button-active');
		$(".ace-search").removeClass('ace-show');
	});

    $('.ace-collapsible .ace-collapsible-trigger').click(function(e){
            e.preventDefault();
            $(this).parents('.ace-collapsible').toggleClass('ace-show');
    });

	$(".ace-dropdown-trigger-click").click(function(event){
		event.stopPropagation();
	});

		
	function resizeInput() {
		if (($(this).val().length) > 0){
		$(this).attr('size', $(this).val().length);
		}
		else{
		$(this).attr('size', 7);

		}	
	}
	function resizeInputAmount() {
		if (($(this).val().length) > 0){
		$(this).attr('size', $(this).val().length );
		}
		else{
		$(this).attr('size', 7);

		}
	}	

	var amount = 3;
	$('#first_name').attr('size', $('#first_name').length + amount);
	$('#last_name').attr('size', $('#last_name').length + amount);
	$('#first_name').keypress (resizeInputAmount);
	$('#last_name').keypress (resizeInputAmount);
	
	 $('#first_name').focusout(resizeInput);
	 $('#last_name').focusout(resizeInput);
    // resize on page load

	$(".ace-dropdown").click(function(event){
		event.stopPropagation();
	});
	$('#window-1C').fadeIn( 200, function(){});
	$('.ace-side-menu .ace-menu-links li a').click(function(){
		$('.ace-side-menu .ace-menu-links li a').removeClass("ace-side-menu-current");
		$(this).addClass('ace-side-menu-current');
	
		var t = $(this).attr('id');
		
		$('#'+ t + 'C').fadeIn( 200, function(){});
		$('#'+ t + 'C').siblings().hide();
	});
	$('.ace-accordion').click( function() {
			$(this).nextAll('.ace-accordion-list').first().toggleClass( "ace-show" );
			$(this).children('.ace-arrow-icon').toggleClass('fa-angle-down fa-angle-up');
	});

	
	$('.ace-entry-item').click(function(){
	$('.ace-entry-item').removeClass("ace-entry-item-current");
	$(this).addClass('ace-entry-item-current');
	
	var t = $(this).attr('id');
	
    $('#'+ t + 'C' ).fadeIn( 200, function(){});
	});
	
	$('.ace-dropdown-trigger-click').click(function(){
		$(this).toggleClass('ace-button-active');
		$(this).parents(".ace-dropdown").children(".ace-dropdown-list").fadeToggle( 100, function(){});
		$(this).parents(".ace-dropdown").toggleClass('ace-show');
		$(this).parents(".ace-search").toggleClass('ace-show');
	});
	
		$("a[data-theme]").click(function() {
			$("head link#theme").attr("href", $(this).data("theme"));
		});

	
	/*$('.floating-button').click(function(){
		$('.ace-popup').addClass('ace-show');
		$('.ace-general-wrapper').addClass('ace-show');
		$('.ace-overlay').addClass('ace-show');
	});
	*/
	
	$('.ace-quick-access-bar a').click(function(e){
		e.preventDefault();
		var infoside = '#' + $(this).attr('href');
		$('.ace-quick-access-bar a').removeClass('active');
		$(this).addClass('active');
		$(infoside).addClass('ace-show');
		$(infoside).siblings().removeClass('ace-show');
		$('.ace-independent-form').removeClass('ace-show');
	});
	$('.ace-open-button').click(function(e){
		e.preventDefault();
		var to_open = '#' + $(this).attr('href');
		$(to_open).addClass('ace-show');
		$(this).parents('.ace-wizzard-step').next().addClass('ace-show');
	});
	$('.ace-advanced-panel-trigger').click(function(e){
		e.preventDefault();
		var to_open = $(this).parents('.ace-info-side-details').find('.ace-advanced-panel');
		$(to_open).addClass('ace-show');
	});
	$('.ace-advanced-panel-close').click(function(e){
		e.preventDefault();
		var to_close = $(this).parents('.ace-advanced-panel');
		$(to_close).removeClass('ace-show');
	});
	$('#auction_details .ace-open-button').click(function(e){
		e.preventDefault();
		var to_open = '#' + $(this).attr('href');
		$(to_open).addClass('ace-show');
		$(to_open).siblings().removeClass('ace-show');
		$(this).addClass('active');
		$(this).siblings().removeClass('active');
		var active_tab = $(this).attr('href');
		$(".ace-open-button[href='" + active_tab + "']").addClass('active');
		$(".ace-open-button[href='" + active_tab + "']").siblings().removeClass('active');
	});
	$('input').change(function(){
		if($(this).val().trim() == '' ){
			$(this).addClass('ace-empty');
		}
		else{
			$(this).removeClass('ace-empty');
		}
	});
	$('.ace-confirm').click(function(){
		$('.ace-confirm-popup').addClass('ace-show');
		$('.ace-general-wrapper').addClass('ace-show');
		$('.ace-overlay').addClass('ace-show');
	});
	$('.ace-info-side .ace-info-side-details:first-child').addClass('ace-show');

	$('#popup').click(function(){
		$('.ace-popup').addClass('ace-show');
		$('.ace-general-wrapper').addClass('ace-show');
		$('.ace-overlay').addClass('ace-show');
	});
	$('.ace-wizzard .choose ul li a').click(function(e){
		e.preventDefault();
		$(this).parents('.ace-wizzard-step').addClass('ace-show');

	});
	$('.ace-wizzard .ace-wizzard-back').click(function(e){
		$(this).parents('.ace-wizzard-step').removeClass('ace-show');
		var step = $(this).parents('.ace-wizzard-step').prev();
		$(step).addClass('ace-show');
	});
	$('.ace-wizzard .step-2 .ace-buy-button').click(function(e){
		e.preventDefault();
		var step = '.' + $(this).attr('href');
		$(step).addClass('ace-show');
	});
	$('.ace-buy-button').click(function(e){
		e.preventDefault();
		var step = '.' + $(this).attr('href');
		$(step).addClass('ace-show');
	});
	$('.floating-button').click(function(){
		$('.ace-independent-form').addClass('ace-show');
	});
	$('.ace-popup-close').click(function(){
		$(this).parents('.ace-popup').removeClass('ace-show');
		$(this).parents('.ace-independent-form').removeClass('ace-show');
		$('.ace-general-wrapper').removeClass('ace-show');
		$('.ace-overlay').removeClass('ace-show');
	});
	$('.ace-form-close').click(function(){
		$('.ace-member-add').toggleClass("ace-hide");
		$('.ace-search-form.members').toggleClass("ace-hide");
		
	});
	


	 $('.ace-menu-trigger').click(function(){

        $('.ace-side-menu-dropdown-list').removeClass('ace-show');
    });
	
	$('.ace-content').click(function(){
		var width = $(window).width(), height = $(window).height();
		if (width <= 950) {
		$('.ace-menu-trigger').removeClass("ace-font-color");
		$('.ace-side-menu').removeClass("ace-expand");
		$('.ace-side-menu-dropdown-list').removeClass('ace-show');;

		} else {
		return;
		}
		
	});
	
	
	$('.ace-advanced-search-trigger').click(function(){
		$('.ace-adv-search-panel').fadeToggle(200, function(){});
		$('.ace-search-panel').toggle();
	});
	
	$('.ace-dropdown-list li a').click(function(){
		if ($(this).hasClass('ace-custom-add')){
			$('.ace-custom-add-input').toggleClass('ace-hide');
		}
		else {
		var str = $(this).text() + '<i class="fa fa-angle-down"></i>';
		$(this).parents(".ace-dropdown").children(".ace-selected").html(str);
		$(this).parents(".ace-dropdown").children(".ace-selected").css('color','#27C3BB');
		$(this).parents(".ace-dropdown-list").fadeToggle(200, function(){});
		$(this).parents(".ace-dropdown").children(".ace-selected").toggleClass('ace-button-active');
		$(this).parents(".ace-dropdown").toggleClass('ace-show');		
		}
	});
	$('.ace-custom-add-input .ace-button').click(function(){
		$('.ace-custom-add-input').toggleClass('ace-hide');
		$('.ace-custom-add-input .ace-text').css('border','1px solid #27C3BB');
	});
	//$( ".ace-info-side-details" ).tabs({
	//	load: function( event, ui ) {}
	//});
	$('.ace-custom-add').on('click', function(e) {
		e.stopPropagation();
	});
    $('.err-trigger').click(function(){
        $('.ace-message-error').toggleClass('ace-hide');
    });
    $('.warn-trigger').click(function(){
        $('.ace-message-warning').toggleClass('ace-hide');
    });
    $('.succ-trigger').click(function(){
        $('.ace-message-succes').toggleClass('ace-hide');
    });
     $('.diag-trigger').click(function(){
        $('.ace-dialog-overlay').toggleClass('ace-hide');
    });
     $('.ace-dialog-close').click(function(){
        $('.ace-dialog-overlay').addClass('ace-hide');
    });
     $('.ace-datepicker').focus(function (){
         $('.ui-datepicker').css('padding', '25px');
     });

    // run test on resize of the window
//	$('.ace-content').checkSize();
//    $(window).resize($('.ace-content').checkSize());
     $.aceAppOverWatch.checkSize($('.ace-content'));
	
      $(function(){
        $('.ace-datepicker').datepicker({
            inline: true,
            showOn: "both",
            buttonText: "<i class='fa fa-calendar'></i>",
            showOtherMonths: true,
            nextText: '<i class="fa fa-angle-right"></i>', 
            prevText: '<i class="fa fa-angle-left"></i>',
            dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        });
      });
    $("table").on("change", ":checkbox", function() {
    	$(this).parents("tr:first").toggleClass("ace-checked"); 
    });
    
    translate();	//translating existing elements
	
	//this generates automatically all ace elements in the page which match the selector
	$('.ace-auto-loadtpl').ace('loadtpl');

	$('.ace-auto-gen').ace('create');
	
	var groupSBContent = false;
	if (!$.aceOverWatch.utilities.isVoid(window['groupSidebarWithContent'])) groupSBContent = window['groupSidebarWithContent'];
	if( $.isFunction($(window).hashchange)){
		$(window).hashchange( onHashChange );
		//giving a time to let the page load entirely.. then check to see if it has an intial hash
		setTimeout(function(){
			if(String(window.location.hash).length > 0 ){
				onHashChange();
			}
		},2000);
	}
		
});//end on document ready
