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
	    firedAttribute = "data-touchmove-fired",
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
	
	document.addEventListener("touchmove", preventDefault, false);
	document.addEventListener("touchend", preventDefault, false);
	
	searchForm.addEventListener("submit", function(e) {
		e.preventDefault();
		
		var input = this.querySelector("input"),
		    term = input.value,
		    search = new FIP.Search(term);
		
		input.blur();
		FIP.utils.addClass(searchBar, FIP.utils.createClassName("hidden"));
	}, false);
	
	searchInput.addEventListener("focus", function(e) {
		e.preventDefault();
		updatePosition();
	}, false);
	
	searchCover.addEventListener("touchstart", function(e) {
		this.removeAttribute(firedAttribute);
	}, false);
	
	searchCover.addEventListener("touchmove", function(e) {
		this.setAttribute(firedAttribute, window.parseInt(this.getAttribute(firedAttribute) || "0") + 1);
	}, false);
	
	searchCover.addEventListener("touchend", function(e) {
		if (!this.getAttribute(firedAttribute) || this.getAttribute(firedAttribute) < 5) {
			this.parentNode.removeChild(this);
		}
		
		this.removeAttribute(firedAttribute);
	}, false);
	
	searchCover.addEventListener("mouseup", function(e) {
		this.parentNode.removeChild(this);
	}, false);
	
	searchCancel.addEventListener("click", function() {
		FIP.utils.addClass(searchBar, FIP.utils.createClassName("hidden"));
	}, false);
	
	// Initialize
	window.setTimeout(function() {
		updatePosition();
	}, 50);
};