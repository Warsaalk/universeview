
	var fn = (function() {
		
		var extend = function(label, funct) {
			
			this[ label ] = funct;
			
		};
		
		return { 'extend': extend }
		
	}());
	
	c['fn'] = fn;