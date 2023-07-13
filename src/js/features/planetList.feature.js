	
	c.ft['PlanetList'] = (function ()
	{
		let planets = [], inited = false;

        let hit = function (planetList)
		{
			if (inited === false) {
				inited = true;

                handle(planetList);
            }
		};

        let handle = function (planetList)
		{
			for (let i = 0, il = planetList.children.length; i < il; i++) {
				let planet = planetList.children[i], id = planet.id.split("-")[1];
				planets.push({
					id: id,
					name: planet.querySelector('.planet-name').textContent,
					coords: /\d{1,2}:\d{1,3}:\d{1,2}/.exec(planet.querySelector('.planet-koords').textContent)[0],
					moon: planet.querySelector('.moonlink') !== null
				});

				if (c.Store.data.features.planetFields === "yes") {
					appendPlanetFields(planet);
				}

				/* TODO add new feature
				if (c.Store.data.features.currentConstruction == "yes") {
					showConstruction(planet);
				}
				*/
			}
		};
		
		let appendPlanetFields = function (planet)
		{
			let link = planet.children[0], fields = /\((.*)?\d{1,3}(.*)?\/\d{2,3}\)/.exec(link.title);
			
			if (fields) {
				let span = c.DOM.create('span');
				span.classList.add('uv-planetlist-fields', 'uv-element');
				span.appendChild(c.DOM.fromHTML(fields[0]));
				
				link.appendChild(span);
			}
		};
		
		let showConstruction = function (planet)
		{
			let constructions = c.DOM.getAll('.constructionIcon', planet);
			
			for (let i=0,il=constructions.length; i<il; i++) {
				constructions[i].classList.add('uv-planetlist-construction');
				constructions[i].appendChild(c.DOM.text(constructions[i].title));
			}
		};
		
		let getPlanets = function ()
		{
			return planets;
		};
		
		return {hit: hit, getPlanets: getPlanets};
	}());