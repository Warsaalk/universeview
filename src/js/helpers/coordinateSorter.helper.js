	
	c.Helper.extend('CoordinateSorter', (function () {
		
		var sort = function (first, second) {
			
			if (first[0] > second[0]) return 1;
			else if (first[0] < second[0]) return -1;
			else {
				if (first[1] > second[1]) return 1;
				else if (first[1] < second[1]) return -1;
				else {
					if (first[2] > second[2]) return 1;
					else if (first[2] < second[2]) return -1;
					else return 0;
				}
			}
		
		};
	
		var run = function (first, second) {
		
			//Parse each value to a integer value for later sorting
			first 	= first.coords.split(':').map(function (value) { return parseInt(value); });
			second 	= second.coords.split(':').map(function (value) { return parseInt(value); });
					
			return sort(first, second);
			
		};
		
		return {'run': run};
		
	}()));