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
	popoverHTML : '<div class="fip-popover fip-device-scale"><ul><li>Prev</li><li>Next</li></ul></div>'
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
	}
};

FIP.utils.makeResultActive = function(result) {
	var names = {
		active : FIP.utils.createClassName("active-result"),
		popover : FIP.utils.createClassName("popover"),
		result : FIP.utils.createClassName("result"),
		results : FIP.utils.createClassName("search-results")
	};

	var oldNode = document.querySelector("." + names.active);

	if (oldNode) {
		FIP.utils.removeClass(oldNode, names.active);
	}

	FIP.utils.addClass(result, names.active);

	if (!FIP.vars.popover) {
		result.innerHTML += FIP.vars.popoverHTML;
		FIP.vars.popover = result.querySelector("." + names.popover);

		FIP.vars.popover.querySelector("li:first-child").addEventListener("touchend", function() {
			var element = FIP.vars.popover.parentNode.previousSibling;

			while (element && element.resultType !== 1) {
				element = element.previousSibling;
			}

			if (!element) {
				element = document.querySelector("." + names.results + " ." + names.result + ":last-child");
			}

			FIP.utils.makeResultActive(element);
		}, false);

		FIP.vars.popover.querySelector("li:last-child").addEventListener("touchend", function() {
			var element = FIP.vars.popover.parentNode.nextSibling;

			while (element && element.resultType !== 1) {
				element = element.nextSibling;
			}

			if (!element) {
				element = document.querySelector("." + names.results + " ." + names.result + ":first-child");
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


FIP.utils.watchScale = function() {
	var names = {
		scale : FIP.utils.createClassName("device-scale")
	};

	var hasTouchSupport = "createTouch" in document;
	if (!hasTouchSupport || FIP.vars.scaleBeingWatched) {
		return;
	}

	FIP.vars.scaleBeingWatched = true;

	var headElement	 = document.getElementsByTagName("head")[0];
	var styleElement = document.createElement("style");

	var stylesheet = styleElement.sheet;

	function updateDeviceScaleStyle() {
		if (stylesheet.rules.length) {
			stylesheet.deleteRule(0);
		}

		stylesheet.insertRule(
			"." + names.scale + " {-webkit-transform:scale(" + getDeviceScale() + ")}", 0
		);
	}

	function getDeviceScale() {
		var deviceWidth, landscape = Math.abs(window.orientation) == 90;

		if (landscape) {
			deviceWidth = Math.max(480, screen.height);
		} else {
			deviceWidth = screen.width;
		}

		return window.innerWidth / deviceWidth;
	}

	styleElement.setAttribute("type", "text/css");
	headElement.appendChild(styleElement);

	updateDeviceScaleStyle();

	window.addEventListener("scroll", updateDeviceScaleStyle, false);
	window.addEventListener("resize", updateDeviceScaleStyle, false);
	window.addEventListener("load", updateDeviceScaleStyle, false);
};

FIP.Search = function (needle) {

	FIP.utils.watchScale();

	var d = document,
		needleLength = needle.length;

	if (needleLength < 1) {
		throw("Error: Nice try. No searching for empty strings. Go stare into the void on your own dime.");
	}

	var caseInsensitiveNeedle = new RegExp(needle, "i"),

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

		while ((match = caseInsensitiveNeedle.exec(textNode.data)) !== null) {

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

var term = document.documentElement.getAttribute("data-search-term");
var search = new FIP.Search(term);
