(function() {
	document.addEventListener("touchstart", function() {
		document.body.addClass("fip-gesture");
	}, false);
	
	document.addEventListener("touchend", function() {
		document.body.removeClass("fip-gesture");
	}, false);
})();