
	c.handlers['Tipped'] = (function () {
		
		var create = function (args) {
			
			Tipped.create(args.selector, args.text, args.options);
			
		};
		
		var refresh = function (args)
		{
			console.log("refresh");
			if (args.selector !== void 0) {
				Tipped.refresh(args.selector);
			} else {
				Tipped.refresh();
			}
		};
		
		var handle = function (action, content) {
			
			switch (action) {
			case 'create': create(content); break;
			case 'refresh': refresh(content); break;
			}
			
		};
		
		return {'handle': handle};
		
	}());