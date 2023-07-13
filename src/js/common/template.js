
	/**
	 * Depends on DOM, Utils
	 */

	var Template = (function() {
		
		var cached 	= {};
		
		var init = function() {};
		
		var get = function(names, callback, objectToParse) {
		
			var templateNames	= names.split(';'),
				templates		= [];
			
			var handleTemplate = function (name, template) {
				
				templates[templateNames.indexOf(name)] = template;
				
				if (templates.length === templateNames.length) {
					callback.apply(null, templates);
				}
				
			};
			
			for (var i=0, il=templateNames.length; i<il; i++) {
				
				var name = templateNames[i], fragement = c.DOM.fromHTML("undefined" !== objectToParse ? parse(cached[name], objectToParse) : cached[name]);

                handleTemplate(name, fragement.firstElementChild);
				
			}
		};
		
		var cache = function (files) {
			cached = files;
		};
		
		var parse = function (html, data) {
            return html.call(c, data);
        };
		
		return {'init': init, 'get': get, 'cache': cache, 'parse': parse};
		
	}());
	
	c['Template'] = Template;
	