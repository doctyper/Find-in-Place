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
	
	// Initialize
	updatePosition();
};