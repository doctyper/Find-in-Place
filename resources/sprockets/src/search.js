//= require "namespace"
//= require "results"
//= require "scale"
//= require "bar"

FIP.Search = function (needle) {
	if (!needle) {
		throw("Error: Nice try. No searching for empty strings. Go stare into the void on your own dime.");
	} else if (typeof needle !== "string") {
		throw("TypeError: We can only find Strings. Not " + typeof needle + "s, not your lost cat, not anything else.");
	}

	var d = document,
		needleLength = needle.length,
		caseInsensitiveNeedle = new RegExp(needle, "i"),

		// XPath is write-only, like Regexes and Perl.
		// This expression selects all text nodes that satisfy the condition that:
		//		The node's text content contains the needle, lower-cased.
		//		(XPath 2 has a lower-case() function, but iOS 4's Mobile Safari doesn't include it.)
		exp = "//text()[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '" + needle.toLowerCase() + "')]",

		// Evaluate the XPath expression and get an ordered snapshot of the result nodes
		snapshot = d.evaluate(
			exp,
			d.body,
			null,
			XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
			null),
		l = snapshot.snapshotLength,
		textNode, text, match, i, k, span, beginOffset, endOffset, parent;

	var needleArr = needle.split(""),
	    construct = "", iterSnapshot,
	    positiveMatches = [],
	    possibleFalseNegativeMatches = [],
	    falseNegativeMatches = [];

	for (i = 0; i < l; i++) {
		positiveMatches.push(snapshot.snapshotItem(i));
	}
	
	if (needleLength > 1) {
		for (i = 0, j = needleArr.length; i < j; i++) {
			construct += needleArr[i];

			iterSnapshot = d.evaluate(
				"//text()[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '" + construct.toLowerCase() + "')]",
				d.body,
				null,
				XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
				null);

			if (iterSnapshot.snapshotLength) {
				for (k = 0, l = iterSnapshot.snapshotLength; k < l; k++) {
					var node = iterSnapshot.snapshotItem(k),
					    boundaryMatch = new RegExp(construct + "$", "i").exec(node.data),
					    nextSibling = node.nextSibling;

					if (boundaryMatch && nextSibling) {
						possibleFalseNegativeMatches.push({
							node : node,
							data : node.data,
							parentNode : node.parentNode,
							charAt : construct.length,
							construct : construct,
							term : needle,
							sibling : nextSibling
						});
					}
				}
			}

		}

		possibleFalseNegativeMatches.forEach(function(item, i) {
			var sibText = item.sibling.firstChild.nodeValue;
			var remainderMatch = new RegExp("^" + item.term.slice(item.charAt), "i").exec(sibText);

			if (remainderMatch) {
				item.remainder = remainderMatch[0];
				falseNegativeMatches.push(item);

				for (var key in item) {
					item.node[key] = item[key];
				}
			}
		});

		positiveMatches = positiveMatches.concat(falseNegativeMatches);
	}

	if (positiveMatches < 1) {
		throw("Warning: Couldn't find the search term anywhere. Tried really hard.");
	}

	// check inside the resulting text nodes for as many matches as possible,
	// wrapping each result in span.fip-result.fip-inline-result
	var total = 0, obj;
	
	for (i = 0; i < positiveMatches.length; i++) {
		textNode = positiveMatches[i];
		
		parent = textNode.parentNode;

		if (FIP.utils.isHidden(parent)) {
			continue;
		}
		
		while (textNode && (match = caseInsensitiveNeedle.exec(textNode.data + (textNode.remainder || ""))) !== null) {
			obj = null;
			
			text = textNode.data;
			beginOffset = match.index;
			endOffset = beginOffset + needleLength;

			if (text.length > endOffset) {
				if (textNode.splitText) {
					textNode.splitText(endOffset);
				} else {
					textNode.node.splitText(endOffset);
				}
			}

			if (beginOffset !== 0) {
				if (textNode.splitText) {
					textNode.splitText(beginOffset);
					textNode = textNode.nextSibling;
				} else {
					textNode.node.splitText(beginOffset);
					
					obj = textNode;
					textNode = textNode.node.nextSibling;
				}
			}

			span = d.createElement("span");
			
			parent.replaceChild(span, textNode);
			span.appendChild(textNode);
			
			if (obj) {
				var sib = obj.sibling.cloneNode(true),
				    sibMatch = sib.firstChild.splitText(obj.remainder.length);
				
				sib.replaceChild(sib.firstChild, sibMatch);
				span.appendChild(sib);
			}
			
			FIP.utils.addClass(span, FIP.utils.createClassName("result"));
			FIP.utils.addClass(span, FIP.utils.createClassName("inline-result"));

			textNode = span.nextSibling;
			
			FIP.utils.buildResult(span);
			total++;
		}
	}
	
	FIP.utils.storeTotalResults(total);
};