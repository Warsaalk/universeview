
	c.ft['PlayerPlanets'] = (function ()
	{
		let loadSystem = function (e) {
            c.Ogame.canLoadSystem(this.getAttribute('data-galaxy'), this.getAttribute('data-system'), e);
            e.preventDefault();
            return false;
        };

		let handle = function (selector, planets, galaxy, system)
		{
			let splitline 	= $$.createElement('div'),
				playerHP 	= c.fn.getHomePlanet(planets), //Returns false if not found
				list		= []; //c.DOM.create('ul');
						
			splitline.classList.add('splitLine');
			//list.appendChild(splitline);
						
			for (let i=0, il=planets.length; i < il; i++) {
				let planetline = planets[i].coords;
				if (planets[i].moon) {
					planetline += ' (m)';
				}

				if (playerHP && planets[i].id === playerHP) {
					planetline += ' ' + c.Locale.dict.hp;
				}

				//canLoadSystem(galaxy,system) is a function defined by ogame
				//Checks if the users is able to load a system, if so it'll load it 							
				let planetelement = $$.createElement('li'), planetlink = $$.createElement('a');
					
				planetlink.id = planets[i].galaxy + 'g' + planets[i].system + 's' + planets[i].position + 'p';
				planetlink.classList.add('uv_g_planet');
				planetlink.setAttribute('data-galaxy', planets[i].galaxy);
				planetlink.setAttribute('data-system', planets[i].system);
				//We need to add this via the inline attribute
				//when we copy the list later on events added with .onclick/.addEventListener will be removed
				//planetlink.setAttribute(attributeEvent, cName + '.Ogame.canLoadSystem(' + planets[i].gal + ',' + planets[i].sys + ',event); return false;');

				if (planets[i].galaxy === galaxy && planets[i].system === system) {
					planetlink.classList.add('uv_g_planet_active');
				}

				let planetcontent 	= ((i + 1) + ': ' + planetline),
					planettext 		= $$.createTextNode(planetcontent);
				
				planetlink.appendChild(planettext);
				planetelement.appendChild(planetlink);
				
				list.push(planetelement);
				
				//list.appendChild( planetelement );
			}
			
			let lists = $$.querySelectorAll(selector);
			
			for (let i=0,il=lists.length; i<il; i++) {
				let ul = $$.createElement('ul');
				ul.appendChild(splitline.cloneNode());
				for (let y=0,yl=list.length; y<yl; y++) {
					let element = list[y].cloneNode(true);
					element.querySelector('a').addEventListener('click', loadSystem);
					ul.appendChild(element);
				}
				
				lists[i].appendChild(ul);
			}
		};
		
		return {handle: handle};
	}());	