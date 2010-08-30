document.addEventListener("DOMContentLoaded", function () {
	var d = document,
		de = d.documentElement,
		needle = de.getAttribute("data-search-term"),
		needleLength = needle.length,
		r = new RegExp(needle, "i"),
		s = d.evaluate(
			"//text()[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '" + needle.toLowerCase() + "')]",
			d.body,
			null,
			XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
			null
		),
		l = s.snapshotLength,
		textNode, text, match, i, span, beginOffset, endOffset, parent;
	
	for (i = 0; i < l; i++) {
		textNode = s.snapshotItem(i);
		parent = textNode.parentNode;

		while ((match = r.exec(textNode.data)) !== null) {
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
			span.className = "fip-result";
			
			// console.log(span.nextSibling.data);
			// console.log("================")

			textNode = span.nextSibling;
		}		
	}
}, false);