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
	popoverHTML : '<div class="fip-popover"><div class="fip-device-scale"><ul><li>Prev</li><li>Next</li></ul><ul><li>Match <span></span> of <span></span></li><li></li></ul></div></div>',
	searchBarHTML : '<div class="fip-search"><form action="#"><fieldset><input type="search" value="" placeholder="Search Page" /><span></span></fieldset><fieldset><input type="reset" value="Close" /></fieldset></form></div>'
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

		// Make sure we're using the right name for getting the float value
		if ( rfloat.test( name ) ) {
			name = styleFloat;
		}

		if ( !force && style && style[ name ] ) {
			ret = style[ name ];
		} else {
			// Only "float" is needed here
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

			// We should always get a number back from opacity
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
					// Do stuff
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
