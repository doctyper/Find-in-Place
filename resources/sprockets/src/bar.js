//= require "namespace"

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
			
			var left = Math.round(window.scrollX + (window.innerWidth / 2) - (searchForm.offsetWidth / 2)),
			    top = Math.round(window.scrollY + (window.innerHeight / 2) - (searchForm.offsetHeight * 1.5));
			searchForm.style.setProperty("-webkit-transform", matrix.translate(Math.max(left, 10), Math.max(top, 10), 0));
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
	
	window.addEventListener("orientationchange", updatePosition, false);
	
	searchForm.addEventListener("submit", function(e) {
		e.preventDefault();
		FIP.utils.destroyResults();
		
		var input = this.querySelector("input"),
		    term = input.value,
		    search = new FIP.Search(term);
		
		input.blur();
		
		searchBar.style.removeProperty("width");
		searchBar.style.removeProperty("height");
		
		this.style.removeProperty("width");
		this.style.removeProperty("-webkit-transform");
	}, false);
	
	var inputEvents = {
		focus : function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			if (FIP.vars._searchTimeout) {
				window.clearTimeout(FIP.vars._searchTimeout);
				delete FIP.vars._searchTimeout;
			} else {
				updatePosition();
			}
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
		var matches = document.querySelectorAll("*[class^='" + FIP.vars.namespace + "']");
		
		for (var i = 0, j = matches.length; i < j; i++) {
			var match = matches[i];
			match.parentNode.removeChild(match);
		}
	});
	
	// Initialize
	window.setTimeout(function() {
		updatePosition();
	}, 50);
};
