/*
File: global.js

About: Version
	1.0

Project: The Weather Channel - iPad Ad

Description:
	A common file that includes all globally shared functionality for FIP

Requires:
	- LABjs <http://labjs.com/>
	- jQuery

Requires:
	- <bootstrap.js>

*/

/*
Class: FIP
	Scoped to the FIP Global Namespace
*/
var FIP = window.FIP || {};

/*
Namespace: FIP.vars
	Shared global variables
*/
FIP.vars = {
	namespace : "fip",
	typography : ["font-size", "font-weight", "font-style", "line-height", "text-transform"],
	popoverHTML : '<div class="fip-device-scale"><div class="fip-popover"><ul><li>Prev</li><li>Next</li></ul></div></div>',
	searchBarHTML : '<div class="fip-search"><div class="fip-device-scale"><form action="#"><fieldset><input type="search" value="" placeholder="Search Page" /><input type="reset" value="Cancel" /></fieldset></form></div></div>'
};

/*
Namespace: FIP.utils
	Shared global utilities
*/
FIP.utils = {

	/*
	sub: queue
	 	A global initializer. Takes a function argument and queues it until <init> is fired

	Parameters:
		object - The function to initialize when the DOM is ready
	*/
	queue : function (object) {
		object();
	},

	createClassName : function() {
		return [FIP.vars.namespace, Array.prototype.slice.call(arguments).join("-")].join("-");
	},

	/*
	Property: addClass
		Adds class name to element

	Parameters:
		elClass - the class to add.
	*/
	addClass : function(el, elClass) {
		var curr = el.className;
		if (!new RegExp(("(^|\\s)" + elClass + "(\\s|$)"), "i").test(curr)) {
			el.className = curr + ((curr.length > 0) ? " " : "") + elClass;
		}
		return el;
	},

	/*
	Property: removeClass
	 	Removes class name to element

	Parameters:
		elClass - _(optional)_ the class to remove.
	*/
	removeClass : function(el, elClass) {
		if (elClass) {
			var classReg = new RegExp(("(^|\\s)" + elClass + "(\\s|$)"), "i");
			el.className = el.className.replace(classReg, function(e) {
				var value = "";
				if (new RegExp("^\\s+.*\\s+$").test(e)) {
					value = e.replace(/(\s+).+/, "$1");
				}
				return value;
			}).replace(/^\s+|\s+$/g, "");

			if (el.getAttribute("class") === "") {
				el.removeAttribute("class");
			}
		} else {
			el.className = "";
			el.removeAttribute("class");
		}
		return el;
	},

	/*
	Property: hasClass
	 	Tests if element has class

	Parameters:
		elClass - the class to test.
	*/
	hasClass : function(el, elClass) {
		return new RegExp(("(^|\\s)" + elClass + "(\\s|$)"), "i").test(el.className);
	},

	/*
	Property: toggleClass
	 	Toggles a class on/off

	Parameters:
		elClass - the class to toggle.
	*/
	toggleClass : function(el, elClass) {
		this.hasClass(el, elClass) ? this.removeClass(el, elClass) : this.addClass(el, elClass);
		return el;
	},

	/*
	Property: curCSS
		Returns the current value of a CSS property. Lifted from jQuery.

	Parameters:
		name - the property to query
		force - ignore elem.style and look directly at computed style
	*/
	curCSS : function (el, name, force) {
		var rfloat = /float/i,
			rupper = /([A-Z])/g,
			ret, style = el.style;

		if ( rfloat.test( name ) ) {
			name = styleFloat;
		}

		if ( !force && style && style[ name ] ) {
			ret = style[ name ];
		} else {
			if ( rfloat.test( name ) ) {
				name = "float";
			}

			name = name.replace( rupper, "-$1" ).toLowerCase();

			var defaultView = el.ownerDocument.defaultView;

			if ( !defaultView ) {
				return null;
			}

			var computedStyle = defaultView.getComputedStyle( el, null );

			if ( computedStyle ) {
				ret = computedStyle.getPropertyValue( name );
			}

			if ( name === "opacity" && ret === "" ) {
				ret = "1";
			}
		}

		return ret;
	},

	/*
	Property: isHidden
		Detects whether element is hidden from the user. Borrows liberally from jQuery's :hidden selector,
		but adds visibility check. I'd like to check opacity as well, but it's not inherited and I don't
		want to add a walk all the way back up the DOM for every element to check.
	*/
	isHidden : function (el) {
		var width = el.offsetWidth, height = el.offsetHeight,
			skip = el.nodeName.toLowerCase() === "tr";

		if (((width === 0 && height === 0) ||
			FIP.utils.curCSS(el, "visibility") === "hidden")
		 	&& !skip) {
			return true;
		}
	}
};


FIP.utils.watchScale = function() {
	var hasTouchSupport = "createTouch" in document;


	var headElement	 = document.getElementsByTagName("head")[0];
	var styleElement = document.createElement("style");

	styleElement.setAttribute("type", "text/css");
	headElement.appendChild(styleElement);

	var stylesheet = styleElement.sheet;

	window.addEventListener("scroll", updateDeviceScaleStyle, false);
	window.addEventListener("resize", updateDeviceScaleStyle, false);
	updateDeviceScaleStyle();

	function updateDeviceScaleStyle() {
		if (stylesheet.rules.length) {
			stylesheet.deleteRule(0);
		}

		stylesheet.insertRule(
			".fip-device-scale {-webkit-transform:translate3d(0, 0, 0) scale(" + getDeviceScale() + ")}", 0
		);
	}

	stylesheet.insertRule(
		".fip-device-scale {-webkit-backface-visibility: hidden; -webkit-transform-origin: 0 0;}", 1
	);

	function getDeviceScale() {
		var deviceWidth, landscape = Math.abs(window.orientation) == 90;

		if (landscape) {
			deviceWidth = Math.max(480, screen.height);
		} else {
			deviceWidth = screen.width;
		}

		return window.innerWidth / deviceWidth;
	}
};

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

FIP.utils.injectSearch = function() {
	document.body.innerHTML += FIP.vars.searchBarHTML;
	return document.querySelector("." + FIP.utils.createClassName("search"));
};

FIP.utils.initSearchBar = function() {
	if (!FIP.vars.searchBar) {
		FIP.vars.searchBar = FIP.utils.injectSearch();
	}

	var searchBar = FIP.vars.searchBar,
	    searchForm = searchBar.querySelector("form"),
	    transform = window.getComputedStyle(searchBar, null).webkitTransform,
	    matrix = new WebKitCSSMatrix(transform);

	function updatePosition() {
		searchBar.style.webkitTransform = matrix.translate(window.scrollX, window.scrollY, 0);
	}

	window.addEventListener("scroll", updatePosition, false);

	searchForm.addEventListener("submit", function(e) {
		e.preventDefault();

		var term = this.querySelector("input").value;
		var search = new FIP.Search(term);
	}, false);

	updatePosition();
};

FIP.Search = function (needle) {
	if (!needle) {
		throw("Error: Nice try. No searching for empty strings. Go stare into the void on your own dime.");
	} else if (typeof needle !== "string") {
		throw("TypeError: We can only find Strings. Not " + typeof needle + "s, not your lost cat, not anything else.");
	}

	var d = document,
		needleLength = needle.length,
		caseInsensitiveNeedle = new RegExp(needle, "i"),

		exp = "//text()[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '" + needle.toLowerCase() + "')]",

		snapshot = d.evaluate(
			exp,
			d.body,
			null,
			XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
			null),
		l = snapshot.snapshotLength,
		textNode, text, match, i, span, beginOffset, endOffset, parent;

	if (l < 1) {
		throw("Warning: Couldn't find the search term anywhere. Tried really hard.")
	}


	for (i = 0; i < l; i++) {
		textNode = snapshot.snapshotItem(i);
		parent = textNode.parentNode;

		if (FIP.utils.isHidden(parent)) {
			continue;
		}

		while (textNode && (match = caseInsensitiveNeedle.exec(textNode.data)) !== null) {

			text = textNode.data;
			beginOffset = match.index;
			endOffset = beginOffset + needleLength;

			if (text.length > endOffset) {
				textNode.splitText(endOffset);
			}

			if (beginOffset !== 0) {
				textNode.splitText(beginOffset);
				textNode = textNode.nextSibling;
			}

			span = d.createElement("span");
			parent.replaceChild(span, textNode);
			span.appendChild(textNode);
			span.className = "fip-result fip-inline-result";


			textNode = span.nextSibling;

			FIP.utils.cloneResult(span);
		}
	}
};

FIP.utils.watchScale();
FIP.utils.initSearchBar();
