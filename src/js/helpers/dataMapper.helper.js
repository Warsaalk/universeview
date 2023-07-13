	
	c.Helper.extend('DataMapper', (function () {
	
		var uvsToIdb = function (dataArg) {
		
			var data 		= dataArg.UvInfo,
				mappedData	= {};
			
			for (var pid in data) {
				
				mappedData[pid] = {'data':[]};
				
				for (var i=0,il=data[pid].planets.length; i<il; i++) {
				
					var dataPlanet 	= data[pid].planets[i],
						newPlanet	= {
							'id': dataPlanet.id,
							'coords': dataPlanet.coords,
							'moon': dataPlanet.moonP,
							'gal': dataPlanet.galaxyP,
							'sys': dataPlanet.systemP,
							'pos': dataPlanet.positionP,
							'pid': pid
					};
					
					mappedData[pid].data.push(newPlanet);
					
				}
				
			}
					
			return mappedData;
			
		};
		
		return {'uvsToIdb': uvsToIdb};
		
	}()));