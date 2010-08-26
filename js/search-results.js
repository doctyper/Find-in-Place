document.addEventListener("DOMContentLoaded", function() {
	var parent = document.querySelector(".fip-search-results"),
	    results = document.querySelectorAll(".fip-result");
	
	if (!parent) {
		parent = document.createElement("div");
		parent.setAttribute("class", "fip-search-results");
		document.body.appendChild(parent);
	}
	
	for (var i = 0, j = results.length; i < j; i++) {
		var result = results[i],
		    box = result.getBoundingClientRect(),
		    clone = result.cloneNode(true);
		
		clone.style.setProperty("left", box.left + "px");
		clone.style.setProperty("top", box.top + "px");
		parent.appendChild(clone);
	}
}, false);
