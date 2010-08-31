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
window.FIP = window.FIP || {};

/*
Namespace: FIP.vars
	Shared global variables
*/
FIP.vars = {
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
