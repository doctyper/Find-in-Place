//= require "namespace"

FIP.utils.injectPopover = function(result) {
	var names = {
		popover : FIP.utils.createClassName("popover")
	};
	
	result.innerHTML += FIP.vars.popoverHTML;
	var popover = result.querySelector("." + names.popover);
	
	popover.querySelector("li:first-child").addEventListener("touchend", function() {
		var element = popover.parentNode.previousSibling;
		
		while (element && element.resultType !== 1) {
			element = element.previousSibling;
		}
		
		if (!element) {
			element = document.querySelector("." + names.results + " ." + names.result + ":last-child");
		}
		
		FIP.utils.makeResultActive(element);
	}, false);
	
	popover.querySelector("li:last-child").addEventListener("touchend", function() {
		var element = popover.parentNode.nextSibling;
		
		while (element && element.resultType !== 1) {
			element = element.nextSibling;
		}
		
		if (!element) {
			element = document.querySelector("." + names.results + " ." + names.result + ":first-child");
		}
		
		FIP.utils.makeResultActive(element);
	}, false);
	
	return popover;
};

FIP.utils.makeResultActive = function(result) {
	if (!FIP.vars.popover) {
		FIP.vars.popover = FIP.utils.injectPopover(result);
	}
	
	var names = {
		active : FIP.utils.createClassName("active-result"),
		result : FIP.utils.createClassName("result"),
		results : FIP.utils.createClassName("search-results")
	};
	
	var oldNode = document.querySelector("." + names.active);
	
	if (oldNode) {
		FIP.utils.removeClass(oldNode, names.active);
	}
	
	FIP.utils.addClass(result, names.active);
	
	result.appendChild(FIP.vars.popover);
	
	var left = (result.offsetLeft + (result.offsetWidth / 2)) - (window.innerWidth / 2),
	    top = (result.offsetTop + (result.offsetHeight / 2)) - (window.innerHeight / 2);
	
	window.scrollTo(left, top);
};

FIP.utils.cloneResult = function(result) {
	var names = {
		results : FIP.utils.createClassName("search-results")
	};
	
	var parent = document.querySelector("." + names.results),
	    typography = FIP.vars.typography;
	
	var box = result.getBoundingClientRect(),
	    style = window.getComputedStyle(result, null),
	    clone = result.cloneNode(true);
	
	if (!parent) {
		parent = document.createElement("div");
		parent.setAttribute("class", names.results);
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