
	c['Utils'] = (function()
	{
		var log = function(message) {
			
			if (c.config.debug === true) {
				console.log(message);
			}
			
		};
		
		var timelineHit = function(label) {
			
			if (c.config.debug === true) {
				console.timeStamp(label);
			}
			
		};
		
		var timeStart = function(label) {
			
			if (c.config.debug === true) {
				console.time(label);
			}
			
		};
		
		var timeEnd = function(label) {
			
			if (c.config.debug === true) {
				console.timeEnd(label);
			}
			
		};
		
		var clone = function(object) {
			
			var newObj = {};
	
			for (var prop in object) {
					
				newObj[prop] = object[prop];
	
			}
			
			return newObj;
	
		};
		
		var merge = function(obj1, obj2) {
						
			for (var prop in obj2) {
					
				obj1[prop] = obj2[prop];
	
			}
			
			return obj1;
			
		};
		
		var nodeListToArray = function (nodeList) {
			
			var array = [];
			
			for (var i=nodeList.length; i--; array.unshift(nodeList[i]));
			
			return array;
			
		};
		
		var formatNumber = function(string) {
			
			return string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
			
		};
		
		var shortenNumber = function (number) {
			
			var abri = ['',' K', ' M', ' G', ' T', ' P', ' E', ' Z', ' Y'];
			
			if (number > 999) {
			
				var index = Math.ceil((Math.floor(number / 1000)).toString().length / 3);
				
				if (abri[index]) return Math.floor(number / Math.pow(1000, index)) + abri[index];
			
			}
			
			return number;
			
		};
		
		let countProperties = function(object)
		{
            let count = 0;
			
			for (i in object) {
				count++;
			}
		
			return count;
		};

		let reverseKeyValue = function (object)
		{
			var reversed = {};
			for (let key in object) {
				reversed[object[key]] = key;
			}
			return reversed;
		};
	
		let objectValue = function(array, prop, needle)
		{
			for (let i=0, il=array.length; i<il; i++) {
				if (array[i][prop] === needle) return i;
			}
			
			return -1;
		};
		
		var isInt = function(i) {
			
			var x = parseInt(i);
			return !isNaN(x);
		
		};
		
		var invertColor = function(color) {
			
			var rgba 	= /rgba\((\d{1,3}),\s(\d{1,3}),\s(\d{1,3}),\s\d{1,3}\)/.exec(color),
				rgb 	= /rgb\((\d{1,3}),\s(\d{1,3}),\s(\d{1,3})\)/.exec(color),
				result	= rgba ? rgba : rgb;
				r		= 0,
				g		= 0,
				b		= 0;
								
			if (result != null) {
			
				r = (255-result[1]);
				g = (255-result[2]);
				b = (255-result[3]);
				
			}
			
			return '#'+ rgbToHex(r) + rgbToHex(g) + rgbToHex(b);
	
		};
	
		var rgbToHex = function(color) {
	
			var hex = color.toString(16);
			return hex.length == 1 ? "0" + hex : hex;
	
		};
		
		var checkPage = function(page) {
							
			return window.location.href.match(new RegExp('page=' + page)) || (window.location.href.indexOf("page=ingame") >= 0 && window.location.href.indexOf("component=" + page) >= 0); // Old || Version 7
					
		};
		
		return { 
			log: log,
			timelineHit: timelineHit,
			timeStart: timeStart,
			timeEnd: timeEnd,
			clone: clone,
			merge: merge,
			nodeListToArray: nodeListToArray,
			formatNumber: formatNumber,
			shortenNumber: shortenNumber,
			countProperties: countProperties,
            reverseKeyValue: reverseKeyValue,
			objectValue: objectValue,
			isInt: isInt,
			invertColor: invertColor,
			rgbToHex: rgbToHex,
			checkPage: checkPage
		};
	}());
