var mobileMenuToggle = document.querySelector('.mobile-menu__toogle');
var mainNav = document.querySelector('.main-nav');
var show = document.querySelector('.show');
var show = document.querySelector('.active');

mobileMenuToggle.addEventListener('click', function(){
	this.classList.toggle('show');
	mainNav.classList.toggle('active');
})