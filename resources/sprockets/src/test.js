//= require "namespace"
//= require "scale"
//= require "search"
//= require "results"

var term = document.documentElement.getAttribute("data-search-term");
var search = new FIP.Search(term);