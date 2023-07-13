		
	c.ft.QuickSearch = (function()
	{
        let ResultBox = function(box)
		{
            let selector = "uv-q-box-" + box, loader;
			
			c.Template.get('loadingSmall', function (loaderTemplate) {
				loader = loaderTemplate;
			}, {'loader': c.Application.getPath("img/loader.gif")});		

			this.element = $$.getElementById(selector);

			this.clear = function () {
				c.DOM.clear("#" + selector);
			};
			
			this.fill = function (elements) {
				this.clear();
				for (let i=0, il=elements.length; i<il; i++) {
					this.element.appendChild(elements[i]);
				}
			};
			
			this.setLoader = function () {
				this.fill([loader]);
			};
		};

        let boxes = {};

        let clearBoxes = function ()
		{
			for (let box in boxes) {
				boxes[box].clear();
			}
		};

        let init = function (info)
		{
			$$.body.classList.add("uv-feature-quicksearch");

            let templateData = {
				'search' : c.Locale.dict.qsinfo,
				'condition' : c.Locale.dict.qscondition
			};
			
			c.Template.get('quickSearch', function (quickSeachHTML)
			{
				info.appendChild(quickSeachHTML);
				
				c.Utils.log('UniverseView Debug: HTML Added - QuickSeach');

                let playerSearch 	= $$.getElementById('UvQsP'),
					allianceSearch	= $$.getElementById('UvQsA');
				
				playerSearch.addEventListener('click', function () {
					this.parentNode.classList.add('uv-q-search-player');
					this.parentNode.classList.remove('uv-q-search-alliance');
					c.Store.set('quickSearch','P');
					clearBoxes();
					c.PageCom.GoogleAnalytics.sendEvent('quicksearch', 'click', 'search_player');
				});
				
				allianceSearch.addEventListener('click', function () {
					this.parentNode.classList.add('uv-q-search-alliance');
					this.parentNode.classList.remove('uv-q-search-player');
					c.Store.set('quickSearch','A');
					clearBoxes();
					c.PageCom.GoogleAnalytics.sendEvent('quicksearch', 'click', 'search_alliance');
				});
				
				if (c.Store.data.quickSearch === 'A') {
					allianceSearch.parentNode.classList.add('uv-q-search-alliance');
				} else {
					playerSearch.parentNode.classList.add('uv-q-search-player');
				}

				$$.getElementById('uv_q_input').addEventListener('keyup', function () {
					handleInput(this, c.Store.data.quickSearch);
				});
				
				$$.getElementById('uv_q_input').addEventListener('click', function (e) {
					$$.getElementById('uv_q_result').classList.remove('uv-hide');
					c.PageCom.GoogleAnalytics.sendEvent('quicksearch', 'click', 'open');
				});
				
				$$.querySelector('#uv-q-connect .btn-del').addEventListener('click', function() {
					$$.getElementById('uv_q_result').classList.add('uv-hide');
				});
				
				boxes['first'] = new ResultBox('first');
				boxes['second'] = new ResultBox('second');
				boxes['third'] = new ResultBox('third');
								
			}, templateData);
		};

        let handleInput = function (input, searchType)
		{
			boxes['second'].clear();
			boxes['third'].clear();

            let query = input.value;
			if (query.length > 1) {
				boxes['first'].setLoader();
				
				if (searchType === 'P') {
					lookupPlayersByName(query);
				} else {
                    let allianceFilters = [{'tag': 'name', 'value': query, 'exact': false},
					                       {'tag': 'tag', 'value': query, 'exact': false}];
					
					lookupAlliances(query, allianceFilters, 'first');
				}
			} else {
                let condition = $$.createElement('li');
									
				condition.appendChild($$.createTextNode(c.Locale.dict.qscondition));
				
				boxes['first'].fill([condition]);
			}
		};

        let initOfficers = function (el)
		{
            let img = el.getElementsByTagName('img');
			for (let i=0, il=img.length; i<il; i++) {
				img[i].height		= 'inherit'; 
				img[i].style.height	= 'inherit';
			}
            let a = el.getElementsByTagName('a');
			for (let i=0, il=a.length; i<il; i++) {
				a[i].style.height	= '21px';
				a[i].addEventListener('mouseover', 	function () { this.style.height = "32px"; this.parentNode.style.height = "32px"; this.parentNode.style.top = "26px" });
				a[i].addEventListener('mouseout',	function () { this.style.height = "21px"; this.parentNode.style.height = "23px"; this.parentNode.style.top = "37px" });
			}
			el.style.height 	= '23px';
			el.style.padding 	= '0 3px';
			el.style.left 		= '811px';
		};

        let filterElementsByAttributes = function (elements, filters)
		{
            let newArray = [];
			
			for (let i=0, il=elements.length; i<il; i++) {
                let pass 	= false,
					element = elements[i];
				
				for (let y=0, yl=filters.length; y<yl; y++) {
                    let filter 	= filters[y],
						regex	= new RegExp(filter.exact ? "^" + filter.value + "$" : filter.value, "i");
					
					if (regex.test(element.getAttribute(filter.tag))) {
						pass = true;
						break;
					}
				}
				
				if (pass) newArray.push(element);
			}
			
			return newArray;
		};

        let sortElementsByAttribute = function (elements, tagName)
		{
            let attributeSorter = function (x,y)
			{
				x = x.getAttribute(tagName).toLowerCase();
				y = y.getAttribute(tagName).toLowerCase();
				
				if (x > y) return 1;
				if (x < y) return -1;
				return 0;
			};
			
			return elements.sort(attributeSorter);
		};

        let selectBoxElement = function (element)
		{
            let others = element.parentNode.children;
			
			for (let i=0, il=others.length; i<il; i++){
				others[i].classList.remove('selected');
			}
			
			element.classList.add('selected');
		};

        let lookupPlayersByAlliance = function (allianceId)
		{
            let filter = {'tag': 'alliance', 'value': allianceId, 'exact': true};
			
			lookupPlayers('player', [filter], "second");
		};

        let lookupPlayersByName = function (query)
		{
            let filter = {'tag': 'name', 'value': query, 'exact': false};
			
			lookupPlayers('player', [filter], "first");
		};

        let lookupPlayers = function (selector, filters, boxName)
		{
			boxes[boxName].setLoader();
			
			OgameAPI.fetch(OgameAPI.PLAYERS, function (xml)
			{
                let players 	= filterElementsByAttributes(xml.getElementsByTagName(selector), filters),
					playersList = [];
				
				players = sortElementsByAttribute(players, "name");
								
				for (let i=0, il=players.length; i<il; i++) {
                    let playerelement 	= $$.createElement('li'),
						playerstatus	= players[i].hasAttribute('status') ? " (" + players[i].getAttribute('status') + ")" : "",
						playername		= $$.createTextNode(players[i].getAttribute('name') + playerstatus);

                    let highscore = $$.createElement('a');
					highscore.classList.add('uv-link-highscore');
					highscore.href = "index.php?page=highscore&searchRelId=" + players[i].getAttribute('id');
					highscore.addEventListener('click', function (e) {
						e.stopPropagation();
						c.PageCom.GoogleAnalytics.sendEvent('quicksearch', 'click', 'highscore_player');
					});
						
					playerelement.dataset.pid = players[i].getAttribute('id');
					playerelement.dataset.name = players[i].getAttribute('name');
					playerelement.addEventListener('click', function (e) { 
						loadPlanets.call(this,e); 
						selectBoxElement(this); 
						c.PageCom.GoogleAnalytics.sendEvent('quicksearch', 'click', 'player_planet');
					});
					playerelement.appendChild(playername);
					playerelement.appendChild(c.ft.Spreading.getAddPlayerButton());
					playerelement.appendChild(highscore);
					playerelement.classList.add('uv-q-player-item');
					
					playersList.push(playerelement);
				}
				
				boxes[boxName].fill(playersList);
				
				c.PageCom.Tipped.create('.uv-q-player-item .uv-btn-add', c.Locale.dict.playertospreading, { hook: 'topmiddle', radius: {size:3}, skin: 'cloud'});
				c.PageCom.Tipped.create('.uv-q-player-item .uv-link-highscore', c.Locale.dict.viewhighscore, { hook: 'topmiddle', radius: {size:3}, skin: 'cloud'});
			}, true);
		};

        let lookupAlliances = function (query, filters, boxName)
		{
			boxes[boxName].setLoader();
			
			OgameAPI.fetch(OgameAPI.ALLIANCES, function (xml)
			{
                let alliances 		= filterElementsByAttributes(xml.getElementsByTagName('alliance'), filters),
					alliancesList	= [];
				
				alliances = sortElementsByAttribute(c.Utils.nodeListToArray(alliances), "tag");

				for (let i=0, il=alliances.length; i<il; i++) {
                    let allianceelement 	= $$.createElement('li'),
						alliancename		= $$.createTextNode(alliances[i].getAttribute('tag') + " : " + alliances[i].getAttribute('name'));

                    let highscore = $$.createElement('a');
					highscore.classList.add('uv-link-highscore','alliance');
					highscore.href = "index.php?page=highscore&category=2&searchRelId=" + alliances[i].getAttribute('id');
					highscore.addEventListener('click', function (e) {
						e.stopPropagation();
						c.PageCom.GoogleAnalytics.sendEvent('quicksearch', 'click', 'highscore_alliance');
					});
					
					allianceelement.dataset.allianceid = alliances[i].getAttribute('id');
					allianceelement.addEventListener('click', function (e){ 
						lookupPlayersByAlliance(this.dataset.allianceid); 
						selectBoxElement(this); 
						boxes['third'].clear(); 
						c.PageCom.GoogleAnalytics.sendEvent('quicksearch', 'click', 'alliance_player');
					});
					allianceelement.appendChild(alliancename);
					allianceelement.appendChild(highscore);
					allianceelement.classList.add('uv-q-alliance-item');
					
					alliancesList.push(allianceelement);
				}
				
				boxes[boxName].fill(alliancesList);
				
				c.PageCom.Tipped.create('.uv-q-alliance-item .uv-link-highscore', c.Locale.dict.viewhighscore, { hook: 'rightmiddle', radius: {size:3}, skin: 'cloud'});
			}, true);
		};
		
		let loadPlanets = function (e)
		{
            let boxName = this.parentNode.id === 'uv-q-box-first' ? 'second' : 'third',
				playerId= this.dataset.pid;
			
			boxes[boxName].setLoader();

			let players = {};
			players[playerId] = {};

            chrome.runtime.sendMessage({action: "API", call: "universe:findPlanetsByPlayers", parameters: [players, null, null]}, function(response)
			{
                let planets 	= response.players[playerId].planets,
                    homePlanet	= c.fn.getHomePlanet(planets),
                    planetList	= [];

                planets.sort(c.Helper.CoordinateSorter.run);

                for (let i=0, il=planets.length; i<il; i++) {
                    let planetElement 	= $$.createElement('li'),
                        planet			= planets[i],
                        planetLine 		= i+1 + ": " + planet.coords;

                    if (planet.moon) planetLine += ' (m)';
                    if (homePlanet && planet.id === homePlanet)	planetLine += ' ' + c.Locale.dict.hp;

                    planetElement.dataset.coords = planet.coords;
                    planetElement.addEventListener('click', function() {
                        c.fn.loadGalaxy(this);
                        c.PageCom.GoogleAnalytics.sendEvent('quicksearch', 'click', 'planet');
                    });
                    planetElement.appendChild($$.createTextNode(planetLine));
                    planetElement.appendChild(c.ft.FleetPageTarget.getSetTargetButton(planet.coords, 'quicksearch'));
                    if (c.Store.data.features.favourites === "yes") planetElement.appendChild(c.ft.Favourite.getAddFavouriteButton());
                    planetElement.classList.add('uv-q-planet-item');

                    planetList.push(planetElement);
                }

                boxes[boxName].fill(planetList);

                c.PageCom.Tipped.create('.uv-q-planet-item .uv-btn-add', c.Locale.dict.addtofavs, { hook: 'rightmiddle', radius: {size:3}, skin: 'cloud'});
            });
		};
		
		return {init: init, initOfficers: initOfficers};
	}());	