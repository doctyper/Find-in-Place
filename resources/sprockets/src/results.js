//= require "namespace"

FIP.utils.injectPopover = function(result) {
	var names = {
		search : FIP.utils.createClassName("search"),
		popover : FIP.utils.createClassName("popover"),
		result : FIP.utils.createClassName("result"),
		results : FIP.utils.createClassName("search-results"),
		drawer : FIP.utils.createClassName("drawer"),
		active : FIP.utils.createClassName("search-active"),
		hover : FIP.utils.createClassName("hover")
	};
	
	result.innerHTML += FIP.vars.popoverHTML;
	
	var popover = result.querySelector("." + names.popover),
	    prev = popover.querySelector("ul:first-child li:first-child"),
	    next = popover.querySelector("ul:first-child li:last-child"),
	    search = popover.querySelector("ul:last-child");
	
	search.querySelector("li:last-child").appendChild(document.querySelector("." + names.search));
	
	FIP.utils.addTapListener(prev, function(e) {
		e.preventDefault();
		
		var element = popover.parentNode.previousSibling;
		
		while (element && element.nodeType !== 1) {
			element = element.previousSibling;
		}
		
		if (!element) {
			element = document.querySelector("." + names.results + " ." + names.result + ":last-child");
		}
		
		FIP.utils.makeResultActive(element);
	});
	
	var hoverIn = function(e) {
		e.preventDefault();
		FIP.utils.addClass(this, names.hover);
	};
	
	var hoverOut = function(e) {
		e.preventDefault();
		FIP.utils.removeClass(this, names.hover);
	};
	
	prev.addEventListener(FIP.vars.touchstart, hoverIn, false);
	prev.addEventListener(FIP.vars.touchend, hoverOut, false);
	
	next.addEventListener(FIP.vars.touchstart, hoverIn, false);
	next.addEventListener(FIP.vars.touchend, hoverOut, false);
	
	FIP.utils.addTapListener(next, function(e) {
		e.preventDefault();
		
		var element = popover.parentNode.nextSibling;
		
		while (element && element.nodeType !== 1) {
			element = element.nextSibling;
		}
		
		if (!element) {
			element = document.querySelector("." + names.results + " ." + names.result + ":first-child");
		}
		
		FIP.utils.makeResultActive(element);
	});
	
	FIP.utils.addTapListener(search, function(e) {
		e.preventDefault();
		
		FIP.utils.addClass(search, names.active);
		FIP.utils.removeClass(search, names.drawer);
		
		FIP.vars._searchTimeout = window.setTimeout(function() {
			if (!document.querySelector("input:focus")) {
				FIP.utils.removeClass(search, names.active);
				FIP.utils.addClass(search, names.drawer);
			}
		}, 4000);
	});
	
	window.setTimeout(function() {
		FIP.utils.addClass(search, names.drawer);
	}, 500);
	
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

FIP.utils.storeTotalResults = function(total) {
	var names = {
		popover : FIP.utils.createClassName("popover")
	};
	
	var target = document.querySelector("." + names.popover + " ul:last-child li span:nth-child(2)");
	target.setAttribute("data-total-results", total);
};
