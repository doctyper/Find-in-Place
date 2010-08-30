document.addEventListener("DOMContentLoaded", function() {
	
	var popover;
	
	function makeActive(node) {
		
		var oldNode = document.querySelector(".fip-active-result");
		
		if (oldNode) {
			oldNode.removeClass("fip-active-result");
		}
		
		node.addClass("fip-active-result");
		
		if (!popover) {
			node.innerHTML += '<div class="fip-popover fip-device-scale"><ul><li>Prev</li><li>Next</li></ul></div>';
			popover = node.querySelector(".fip-popover");
			
			popover.querySelector("li:first-child").addEventListener("touchend", function() {
				var element = popover.parentNode.previousSibling;
				
				while (element && element.nodeType !== 1) {
					element = element.previousSibling;
				}
				
				if (!element) {
					element = document.querySelector(".fip-search-results .fip-result:last-child");
				}
				
				makeActive(element);
			}, false);
			
			popover.querySelector("li:last-child").addEventListener("touchend", function() {
				var element = popover.parentNode.nextSibling;
				
				while (element && element.nodeType !== 1) {
					element = element.nextSibling;
				}
				
				if (!element) {
					element = document.querySelector(".fip-search-results .fip-result:first-child");
				}
				
				makeActive(element);
			}, false);
		} else {
			node.appendChild(popover);
		}
		
		var left = (node.offsetLeft + (node.offsetWidth / 2)) - (window.innerWidth / 2),
		    top = (node.offsetTop + (node.offsetHeight / 2)) - (window.innerHeight / 2);
		
		window.scrollTo(left, top);
	}
	
	var parent = document.querySelector(".fip-search-results"),
	    results = document.querySelectorAll(".fip-result"),
	    typography = ["font-size", "font-weight", "font-style", "line-height", "text-transform"];
	
	if (!parent) {
		parent = document.createElement("div");
		parent.setAttribute("class", "fip-search-results");
		parent.style.setProperty("width", Math.max(window.innerWidth, document.body.clientWidth) + "px");
		parent.style.setProperty("height", Math.max(window.innerHeight, document.body.clientHeight) + "px");
		
		document.body.appendChild(parent);
	}
	
	for (var i = 0, j = results.length; i < j; i++) {
		var result = results[i],
		    box = result.getBoundingClientRect(),
		    style = window.getComputedStyle(result, null),
		    clone = result.cloneNode(true);

		clone.style.setProperty("left", box.left + "px");
		clone.style.setProperty("top", box.top + "px");

		for (var k = 0, l = typography.length; k < l; k++) {
			var typo = typography[k];
			clone.style.setProperty(typo, style.getPropertyValue(typo));
		}
		
		if (i === 0) {
			makeActive(clone);
		}
		
		parent.appendChild(clone);
	}
}, false);
