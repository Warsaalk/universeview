
	c.fn.extend('getHomePlanet', function(planets) {
			
		var hp = 0;
		for (var i=0, ilen=planets.length; i<ilen; i++) {
			var id = planets[i].id;
			if ((hp==0 || id<hp) && id!="") {
				hp = id;
			}
		}
		if (hp == 0 || hp == "") hp = false; //Do undefined check at the end
		return hp;
	
	});