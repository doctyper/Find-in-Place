javascript:(function() {
	var doc = document,
	    root = "http://example.com/",
	    style = doc.createElement("link"),
	    script = doc.createElement("script");
	
	style.rel = "stylesheet";
	style.type = "text/css";
	style.href = root + "css/fip.css";
	
	doc.querySelector("head").appendChild(style);
	
	script.type = "text/javascript";
	script.src = root + "js/fip.js";
	
	doc.querySelector("body").appendChild(script);
})();
