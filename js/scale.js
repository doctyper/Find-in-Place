// Provides a device_scale class on iOS devices for scaling user
// interface elements relative to the current zoom factor.
//
// http://37signals.com/svn/posts/2407-device-scale-user-interface-elements-in-ios-mobile-safari
// Copyright (c) 2010 37signals.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

(function() {
	var hasTouchSupport = "createTouch" in document;
	if (!hasTouchSupport) return;

	var headElement	 = document.getElementsByTagName("head")[0];
	var styleElement = document.createElement("style");

	styleElement.setAttribute("type", "text/css");
	headElement.appendChild(styleElement);

	var stylesheet = styleElement.sheet;

	window.addEventListener("scroll", updateDeviceScaleStyle, false);
	window.addEventListener("resize", updateDeviceScaleStyle, false);
	window.addEventListener("load", updateDeviceScaleStyle, false);
	updateDeviceScaleStyle();

	function updateDeviceScaleStyle() {
		if (stylesheet.rules.length) {
			stylesheet.deleteRule(0);
		}

		stylesheet.insertRule(
			".fip-device-scale {-webkit-transform:scale(" + getDeviceScale() + ")}", 0
		);
	}

	// Adapted from code by Mislav Marohnić: http://gist.github.com/355625
	function getDeviceScale() {
		var deviceWidth, landscape = Math.abs(window.orientation) == 90;

		if (landscape) {
			// iPhone OS < 3.2 reports a screen height of 396px
			deviceWidth = Math.max(480, screen.height);
		} else {
			deviceWidth = screen.width;
		}

		return window.innerWidth / deviceWidth;
	}
})();
