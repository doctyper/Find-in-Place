//= require "namespace"

FIP.utils.makeResultActive = function(result) {
	var oldNode = document.querySelector(".fip-active-result");
	
	if (oldNode) {
		FIP.utils.removeClass(oldNode, "fip-active-result");
	}
	
	FIP.utils.addClass(result, "fip-active-result");
	
	if (!FIP.vars.popover) {
		result.innerHTML += FIP.vars.popoverHTML;
		FIP.vars.popover = result.querySelector(".fip-popover");
		
		FIP.vars.popover.querySelector("li:first-child").addEventListener("touchend", function() {
			var element = FIP.vars.popover.parentNode.previousSibling;
			
			while (element && element.resultType !== 1) {
				element = element.previousSibling;
			}
			
			if (!element) {
				element = document.querySelector(".fip-search-results .fip-result:last-child");
			}
			
			FIP.utils.makeResultActive(element);
		}, false);
		
		FIP.vars.popover.querySelector("li:last-child").addEventListener("touchend", function() {
			var element = FIP.vars.popover.parentNode.nextSibling;
			
			while (element && element.resultType !== 1) {
				element = element.nextSibling;
			}
			
			if (!element) {
				element = document.querySelector(".fip-search-results .fip-result:first-child");
			}
			
			FIP.utils.makeResultActive(element);
		}, false);
	} else {
		result.appendChild(FIP.vars.popover);
	}
	
	var left = (result.offsetLeft + (result.offsetWidth / 2)) - (window.innerWidth / 2),
	    top = (result.offsetTop + (result.offsetHeight / 2)) - (window.innerHeight / 2);
	
	window.scrollTo(left, top);
};

FIP.utils.cloneResult = function(result) {
	var parent = document.querySelector(".fip-search-results"),
	    typography = FIP.vars.typography;
	
	var box = result.getBoundingClientRect(),
	    style = window.getComputedStyle(result, null),
	    clone = result.cloneNode(true);
	
	if (!parent) {
		parent = document.createElement("div");
		parent.setAttribute("class", "fip-search-results");
		parent.style.setProperty("width", Math.max(window.innerWidth, document.body.clientWidth) + "px");
		parent.style.setProperty("height", Math.max(window.innerHeight, document.body.clientHeight) + "px");
		
		document.body.appendChild(parent);
	}

	clone.style.setProperty("left", box.left + "px");
	clone.style.setProperty("top", box.top + "px");

	for (var k = 0, l = typography.length; k < l; k++) {
		var typo = typography[k];
		clone.style.setProperty(typo, style.getPropertyValue(typo));
	}
	
	if (!parent.childNodes.length) {
		FIP.utils.makeResultActive(clone);
	}
	
	parent.appendChild(clone);
};