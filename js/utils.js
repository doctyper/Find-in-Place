(function() {
	var expando = {
		
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
		}
	};
	
	// Extend away!
	for (var key in expando) {
		HTMLElement.prototype[key] = expando[key];
	}
}());