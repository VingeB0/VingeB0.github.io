$(document).ready(function() {
	$('.subscribe__arrow-down').click(function(){
		$('.subscribe__form').toggleClass('show-form');
		$('.subscribe .container').toggleClass('show-container');
	});

	$('.subscribe__form-close').click(function(){
		$('.subscribe__form').toggleClass('show-form');
		$('.subscribe .container').toggleClass('show-container');
	});

	$("#nav").on("click","a", function (event) {
		event.preventDefault();
		let id  = $(this).attr('href'),
		top = $(id).offset().top;
		$('body,html').animate({scrollTop: top}, 1500);
	});
});

