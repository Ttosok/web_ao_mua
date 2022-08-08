var nav_bar = document.querySelector(".site_left");
var main_body = document.querySelector(".site_right");
var effect_bar = document.querySelector(".slector_bar");
effect_bar.onclick = () => {
    nav_bar.classList.toggle('active');
    main_body.classList.toggle('active');
};
var top_sleep = document.querySelector(".right_foot > p");
window.addEventListener('scroll', function(){
    if(window.pageYOffset > 650){
        top_sleep.classList.add('down');
    }else if(top_sleep.classList.contains('down')){
        top_sleep.classList.remove('down');
    }
});
// dieu chinh so luong san pham truoc khi mua
if(document.getElementById("lower_number") && document.getElementById("show_number")){
	const number_down = document.getElementById("lower_number");
	let number = document.getElementById("show_number");
	const number_up =  document.getElementById("incress_number");
	number_down.addEventListener("click", function() {
		if(parseInt(number.innerHTML) === 1) number.innerHTML = 1;
		else document.getElementById("show_number").innerHTML = parseInt(document.getElementById("show_number").innerHTML) - 1;
	});
	number_up.addEventListener("click", function() {
		if(parseInt(number.innerHTML) === 10) number.innerHTML = 10;
		else document.getElementById("show_number").innerHTML = parseInt(document.getElementById("show_number").innerHTML) + 1;
	});
}
