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
	popoverHTML : '<div class="fip-popover"><div class="fip-device-scale"><ul><li>Prev</li><li>Next</li></ul></div></div>',
	searchBarHTML : '<div class="fip-search"><form action="#"><fieldset><input type="search" value="" placeholder="Search Page" /><span></span></fieldset><fieldset><input type="reset" value="Cancel" /></fieldset></form></div>'
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
	},

	addTapListener : function(node, handler) {

		var firedAttribute = "data-touchmove-fired";

		var events = {
			touchstart : function(e) {
				this.removeAttribute(firedAttribute);
			},
			touchmove : function(e) {
				this.setAttribute(firedAttribute, window.parseInt(this.getAttribute(firedAttribute) || "0") + 1);
			},
			touchend : function(e) {
				if (!this.getAttribute(firedAttribute) || this.getAttribute(firedAttribute) < 5) {
					handler.call(this, e);
				}

				this.removeAttribute(firedAttribute);
			}
		};

		for (var key in events) {
			node.addEventListener(FIP.vars[key], events[key], false);
		}

	},

	touchEvents : function() {
		var hasTouchSupport = "createTouch" in document;

		FIP.vars.touchstart = hasTouchSupport ? "touchstart" : "mousedown";
		FIP.vars.touchmove = hasTouchSupport ? "touchmove" : "mousemove";
		FIP.vars.touchend = hasTouchSupport ? "touchend" : "mouseup";
	}()
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
		popover : FIP.utils.createClassName("popover"),
		result : FIP.utils.createClassName("result"),
		results : FIP.utils.createClassName("search-results")
	};

	result.innerHTML += FIP.vars.popoverHTML;

	var popover = result.querySelector("." + names.popover),
	    prev = popover.querySelector("li:first-child"),
	    next = popover.querySelector("li:last-child");

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
	    searchInput = searchForm.querySelector("input:first-child"),
	    searchCancel = searchForm.querySelector("input:last-child"),
	    searchCover = searchForm.querySelector("span"),
	    transform = window.getComputedStyle(searchBar, null).webkitTransform,
	    matrix = new WebKitCSSMatrix(transform);

	FIP.utils.removeClass(searchBar, FIP.utils.createClassName("hidden"));

	function updatePosition(focus) {
		searchBar.style.setProperty("width", Math.max(window.innerWidth, document.body.clientWidth) + "px");
		searchBar.style.setProperty("height", Math.max(window.innerHeight, document.body.clientHeight) + "px");

		if (!focus) {
			searchForm.style.setProperty("width", (window.innerWidth * 0.8) + "px");
			searchForm.style.setProperty("-webkit-transform", matrix.translate(Math.round(window.scrollX + (window.innerWidth / 2) - (searchForm.offsetWidth / 2)), Math.round(window.scrollY + (window.innerHeight / 2) - (searchForm.offsetHeight * 1.5)), 0));
		}
	}

	function preventDefault(e) {
		var target = e.target,
		    parent;

		while (target && target.parentNode) {
			if (target === searchBar) {
				parent = target;
			}
			target = target.parentNode;
		}

		if (parent) {
			e.preventDefault();
		}
	}

	document.addEventListener(FIP.vars.touchmove, preventDefault, false);
	document.addEventListener(FIP.vars.touchend, preventDefault, false);

	searchForm.addEventListener("submit", function(e) {
		e.preventDefault();

		var input = this.querySelector("input"),
		    term = input.value,
		    search = new FIP.Search(term);

		input.blur();
		FIP.utils.addClass(searchBar, FIP.utils.createClassName("hidden"));
	}, false);

	var inputEvents = {
		focus : function(e) {
			e.preventDefault();
			updatePosition();
		},

		blur : function() {
			searchCover = document.createElement("span");
			this.parentNode.appendChild(searchCover);
		}
	};

	for (var key in inputEvents) {
		searchInput.addEventListener(key, inputEvents[key], false);
	}

	FIP.utils.addTapListener(searchCover.parentNode, function(e) {
		if (e.target === searchCover) {
			searchInput.focus();
			this.removeChild(searchCover);
		}
	});

	FIP.utils.addTapListener(searchCancel, function() {
		FIP.utils.addClass(searchBar, FIP.utils.createClassName("hidden"));
	});

	window.setTimeout(function() {
		updatePosition();
	}, 50);
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
		textNode, text, match, i, k, span, beginOffset, endOffset, parent;

	var needleArr = needle.split(""),
	    construct = "", iterSnapshot,
	    positiveMatches = [],
	    possibleFalseNegativeMatches = [],
	    falseNegativeMatches = [];

	for (i = 0; i < l; i++) {
		positiveMatches.push(snapshot.snapshotItem(i));
	}

	if (needleLength > 1) {
		for (i = 0, j = needleArr.length; i < j; i++) {
			construct += needleArr[i];

			iterSnapshot = d.evaluate(
				"//text()[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '" + construct.toLowerCase() + "')]",
				d.body,
				null,
				XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
				null);

			if (iterSnapshot.snapshotLength) {
				for (k = 0, l = iterSnapshot.snapshotLength; k < l; k++) {
					var node = iterSnapshot.snapshotItem(k),
					    boundaryMatch = new RegExp(construct + "$", "i").exec(node.data),
					    nextSibling = node.nextSibling;

					if (boundaryMatch && nextSibling) {
						possibleFalseNegativeMatches.push({
							node : node,
							data : node.data,
							parentNode : node.parentNode,
							charAt : construct.length,
							construct : construct,
							term : needle,
							sibling : nextSibling
						});
					}
				}
			}

		}

		possibleFalseNegativeMatches.forEach(function(item, i) {
			var sibText = item.sibling.firstChild.nodeValue;
			var remainderMatch = new RegExp("^" + item.term.slice(item.charAt), "i").exec(sibText);

			if (remainderMatch) {
				item.remainder = remainderMatch[0];
				falseNegativeMatches.push(item);

				for (var key in item) {
					item.node[key] = item[key];
				}
			}
		});

		positiveMatches = positiveMatches.concat(falseNegativeMatches);
	}

	if (positiveMatches < 1) {
		throw("Warning: Couldn't find the search term anywhere. Tried really hard.");
	}

	var total = 0, obj;

	for (i = 0; i < positiveMatches.length; i++) {
		textNode = positiveMatches[i];

		parent = textNode.parentNode;

		if (FIP.utils.isHidden(parent)) {
			continue;
		}

		while (textNode && (match = caseInsensitiveNeedle.exec(textNode.data + (textNode.remainder || ""))) !== null) {
			obj = null;

			text = textNode.data;
			beginOffset = match.index;
			endOffset = beginOffset + needleLength;

			if (text.length > endOffset) {
				if (textNode.splitText) {
					textNode.splitText(endOffset);
				} else {
					textNode.node.splitText(endOffset);
				}
			}

			if (beginOffset !== 0) {
				if (textNode.splitText) {
					textNode.splitText(beginOffset);
					textNode = textNode.nextSibling;
				} else {
					textNode.node.splitText(beginOffset);

					obj = textNode;
					textNode = textNode.node.nextSibling;
				}
			}

			span = d.createElement("span");

			parent.replaceChild(span, textNode);
			span.appendChild(textNode);

			if (obj) {
				var sib = obj.sibling.cloneNode(true),
				    sibMatch = sib.firstChild.splitText(obj.remainder.length);

				sib.replaceChild(sib.firstChild, sibMatch);
				span.appendChild(sib);
			}

			FIP.utils.addClass(span, FIP.utils.createClassName("result"));
			FIP.utils.addClass(span, FIP.utils.createClassName("inline-result"));

			textNode = span.nextSibling;

			FIP.utils.buildResult(span);
			total++;
		}
	}

	FIP.utils.storeTotalResults(total);
};

FIP.utils.watchScale();
FIP.utils.initSearchBar();
