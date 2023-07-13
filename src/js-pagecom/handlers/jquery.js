
	c.handlers['JQuery'] = (function () {
					
		var displayDialog = function (content) {
			
			$(content.selector).dialog(content.options);
			
		};
		
		var colorPicker = function (content) {
			
			$(content.selector)
			.css('background-color', content.defaultColor)
			.colorpicker({
				color: content.defaultColor, colorFormat: "#HEX", hsv: false, showCancelButton: false,
			})
			.colorpicker("option", "close", function (event, color) {
				event.target.style.backgroundColor = color.formatted;
				event.target.value = color.formatted;
				event.target.dispatchEvent(new Event('colorchange'));
			});
			
		};
		
		var handle = function (action, content) {
			
			switch (action) {
			case 'dialog': displayDialog(content); break;
			case 'colorpicker': colorPicker(content); break;
			}
			
		};
		
		return {'handle': handle};
		
	}());