document.addEventListener("DOMContentLoaded", function () {
	(function search(needle) {
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
			textNode, text, match, i, span, beginOffset, endOffset, parent;

		if (l < 1) {
			throw("Warning: Couldn't find the search term anywhere. Tried really hard.")
		}
		
		// console.log(l + (l > 1 ? " textNodes contain matches" : " textNode contains a match"));

		// check inside the resulting text nodes for as many matches as possible,
		// wrapping each result in span.fip-result.fip-inline-result
		for (i = 0; i < l; i++) {
			textNode = snapshot.snapshotItem(i);
			parent = textNode.parentNode;
			
			if (parent.isHidden()) {
				continue;
			}

			while (textNode && (match = caseInsensitiveNeedle.exec(textNode.data)) !== null) {
				// console.log("Found " + match[0] + " at " + match.index + " in \"" + textNode.data + "\".");

				text = textNode.data;
				beginOffset = match.index;
				endOffset = beginOffset + needleLength;

				if (text.length > endOffset) {
					textNode.splitText(endOffset);
				}

				if (beginOffset !== 0) {
					textNode.splitText(beginOffset);
					textNode = textNode.nextSibling;
				}

				span = d.createElement("span");
				parent.replaceChild(span, textNode);
				span.appendChild(textNode);
				span.className = "fip-result fip-inline-result";

				// console.log(span.nextSibling.data);
				// console.log("================")

				textNode = span.nextSibling;
			}		
		}
	}(document.documentElement.getAttribute("data-search-term")));
}, false);