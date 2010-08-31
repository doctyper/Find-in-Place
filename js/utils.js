(function() {
	var rfloat = /float/i,
		rupper = /([A-Z])/g,
		expando = {
		
		/*
		Property: addClass
			Adds class name to element

		Parameters:
			elClass - the class to add.
		*/
		addClass : function(elClass) {
			var curr = this.className;
			if (!new RegExp(("(^|\\s)" + elClass + "(\\s|$)"), "i").test(curr)) {
				this.className = curr + ((curr.length > 0) ? " " : "") + elClass;
			}
			return this;
		},

		/*
		Property: removeClass
		 	Removes class name to element

		Parameters:
			elClass - _(optional)_ the class to remove.
		*/
		removeClass : function(elClass) {
			if (elClass) {
				var classReg = new RegExp(("(^|\\s)" + elClass + "(\\s|$)"), "i");
				this.className = this.className.replace(classReg, function(e) {
					var value = "";
					if (new RegExp("^\\s+.*\\s+$").test(e)) {
						value = e.replace(/(\s+).+/, "$1");
					}
					return value;
				}).replace(/^\s+|\s+$/g, "");

				if (this.getAttribute("class") === "") {
					this.removeAttribute("class");
				}
			} else {
				this.className = "";
				this.removeAttribute("class");
			}
			return this;
		},

		/*
		Property: hasClass
		 	Tests if element has class

		Parameters:
			elClass - the class to test.
		*/
		hasClass : function(elClass) {
			return new RegExp(("(^|\\s)" + elClass + "(\\s|$)"), "i").test(this.className);
		},

		/*
		Property: toggleClass
		 	Toggles a class on/off

		Parameters:
			elClass - the class to toggle.
		*/
		toggleClass : function(elClass) {
			this.hasClass(elClass) ? this.removeClass(elClass) : this.addClass(elClass);
			return this;
		},
		
		/*
		Property: curCSS
			Returns the current value of a CSS property.
		
		Parameters:
			name - the property to query
			force - ignore elem.style and look directly at computed style
		*/
		curCSS : function (name, force) {
			var ret, style = this.style;

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

				var defaultView = this.ownerDocument.defaultView;

				if ( !defaultView ) {
					return null;
				}

				var computedStyle = defaultView.getComputedStyle( this, null );

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
		isHidden : function () {
			var width = this.offsetWidth, height = this.offsetHeight,
				skip = this.nodeName.toLowerCase() === "tr";

			if (((width === 0 && height === 0) ||
				this.curCSS("visibility") === "hidden")
			 	&& !skip) {
				return true;
			}
					

			// return width === 0 && height === 0 && !skip ?
			// 	true :
			// 	(this.curCSS("visiblity") === "hidden" ||
			// 	this.curCSS("opacity") === 0) ?
			// 		true :
			// 		width > 0 && height > 0 && !skip ?
			// 			false :
			// 			this.curCSS("display") === "none";			
		},
	};
	
	// Extend away!
	for (var key in expando) {
		HTMLElement.prototype[key] = expando[key];
	}
}());