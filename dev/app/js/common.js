$(function() {

$('.mobile-menu__toogle').on('click', function() {
	$('.main-nav').fadeToggle(600, function () {
			if($(this).css('display') === 'none' ) {
				$(this).removeAttr('style');
			}
		});
});

$('.mobile-menu__toogle').on('click', function() {
				$(this).toggleClass('show');
});

});