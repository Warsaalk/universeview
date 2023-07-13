
	c.ft.Spreading = (function()
	{
        let options = {
			width 	: 2,
			height	: 2
		};

        let data = {
			loader: 0,
			currentProfile: null,
			spreadingData: null,
			planets: {}
		};

        let init = function (info)
		{
			$$.body.classList.add("uv-feature-spreading");

            let spreadingBtn = $$.createElement('div');
			
			spreadingBtn.id = "uv-spreading-btn";
			spreadingBtn.addEventListener('click', show);
			spreadingBtn.classList.add("uv-element");
			
			info.appendChild(spreadingBtn);
			
			data.currentProfile = c.Store.data.spreadingCurrent;
			data.spreadingData 	= c.Store.data.spreading;
		};

        let show = function ()
		{
            let spreadingwrapper = $$.getElementById('uv-s-wrapper');
			if (spreadingwrapper) {
				spreadingwrapper.classList.add("uv-s-active");
			} else {
                let templateData = c.Utils.merge(c.Locale.dict, {'color': '#161C22'});
				
				c.Template.get("spreading", function (html)
				{
					/** Add eventlisteners **/
					html.querySelector('#uv-s-header span.btn-del').addEventListener('click', function (e) {
						html.classList.remove("uv-s-active");
					});

                    html.querySelector('#uv-s-header #uv-s-add-wrapper').addEventListener('click', function (e) {
						addPlayer(c.Application.ogame.playerId, c.Application.ogame.playerName);
						c.PageCom.GoogleAnalytics.sendEvent('spreading', 'click', 'self');
					});

                    html.querySelector('#uv-spreading #uv-s-universe').addEventListener('click', function (e) {
						data.currentProfile = 'universe';
						c.Store.set('spreadingCurrent', 'universe');
						initData();
						c.PageCom.GoogleAnalytics.sendEvent('spreading', 'click', 'universe');
					});

                    html.querySelector('#uv-spreading #uv-s-btn-newprofile').addEventListener('click', function (e) {
						addProfile();
						c.PageCom.GoogleAnalytics.sendEvent('spreading', 'click', 'profile_new');
					});

                    html.querySelector('#uv-spreading #uv-s-btn-delprofile').addEventListener('click', function (e) {
						deleteProfile();
						c.PageCom.GoogleAnalytics.sendEvent('spreading', 'click', 'profile_delete');
					});

                    html.querySelector('#uv-spreading #uv-s-profile').addEventListener('change', function (e) {
						changeProfile.call(this, e);
						c.PageCom.GoogleAnalytics.sendEvent('spreading', 'change', 'profile');
					});

                    html.querySelector('#uv-spreading #uv-s-invert').addEventListener('click', function (e) {
                        let input 		= c.DOM.get('#uv-s-row-color'),
							inverted 	= c.Utils.invertColor(input.style.backgroundColor);

						setGalaxyRowColor(inverted);

						input.value = inverted;
						input.style.backgroundColor = inverted;

						c.PageCom.GoogleAnalytics.sendEvent('spreading', 'click', 'invert');
					});

                    html.querySelector('#uv-spreading #uv-s-row-color').addEventListener('colorchange', function (e) {
						setGalaxyRowColor(this.value);
						c.PageCom.GoogleAnalytics.sendEvent('spreading', 'click', 'color');
					});
					
					/** Add rows **/
                    let rows = html.querySelector('#uv-s-rows');
					
					for (let i=1, il=c.Store.data.ogameSettings.galaxies; i<=il; i++) {
                        let row = $$.createElement('li');

						row.id = "uv_s_g" + i;
						row.style.width = options.width * 499 + "px";
						row.style.height = options.height * 15 + "px";
						row.dataset.galaxy = i;
						row.classList.add('uv-s-galaxy');
						
						row.addEventListener('mousemove', function (e) {
							let coords = "?:?:?";
							if (e.target.classList.contains('uv-s-planet')) {
								coords = e.target.dataset.galaxy + ":" + e.target.dataset.system + ":" + e.target.dataset.position;
							} else {
								coords = this.dataset.galaxy + ":" + (1+Math.floor(e.layerX/2)) + ":" + (1+Math.floor(e.layerY/2));
							}
							$$.getElementById('uv-s-position-coordinates').textContent = coords;
						});
						
						rows.appendChild(row);
					}
					
					document.body.appendChild(html);
					
					html.classList.add("uv-s-active");
					
					initData();
					
					c.PageCom.JQuery.colorpicker('#uv-s-row-color', '#161C22');
				}, templateData);
			}
			
			c.PageCom.GoogleAnalytics.sendEvent('spreading', 'click', 'open');
		};

        let addProfile = function ()
		{
            let newprofile = $$.getElementById('uv-s-newprofile').value;
			if (newprofile.length > 0) {
				$$.getElementById('uv-s-newprofile').value = "";
				
				data.spreadingData[newprofile] = {};
				data.currentProfile = newprofile;
				
				c.Store.set('spreadingCurrent', data.currentProfile);
				c.Store.set('spreading', data.spreadingData, true);
				
				initData();
			}
		};

        let deleteProfile = function ()
		{
            let dropdown 		= $$.getElementById('uv-s-profile'),
				selectedprofile = dropdown[dropdown.selectedIndex].value;
			
			if (data.spreadingData[selectedprofile]) {
				delete data.spreadingData[selectedprofile];
				if (selectedprofile === "Default") { //Default can't be deleted so reset it
					data.spreadingData["Default"] = {};
				}
				
				data.currentProfile = "Default";
	
				c.Store.set('spreadingCurrent', data.currentProfile);
				c.Store.set('spreading', data.spreadingData, true);
				
				initData();
			}
		};

        let changeProfile = function (e)
		{
            let selectedprofile = this[this.selectedIndex].value;
			
			data.currentProfile = selectedprofile;
			c.Store.set('spreadingCurrent', data.currentProfile);
			
			if (this.id === "uv-s-profile") {
				$$.getElementById('uv-s-noplayer').style.display = "block";
			
				initData();
			}
		};

        let removeLegacyPlayerIDs = function ()
		{
			let fixed = false;

            for (let profile in data.spreadingData) {
            	for (let playerID in data.spreadingData[profile]) {
					if (/player\d+/.test(playerID)) {
                        data.spreadingData[profile][playerID.replace("player","")] = data.spreadingData[profile][playerID];
                        delete data.spreadingData[profile][playerID];
                        fixed = true;
					}
				}
			}

			if (fixed) {
                c.Store.set('spreading', data.spreadingData, true);
			}
		};

        let initData = function ()
		{
			data.loader = c.Loader.create('#uv-spreading');
			data.planets = {}; //Reset current planets

            removeLegacyPlayerIDs();

			loadProfiles();

            let players 	= [],
				universe	= data.currentProfile === "universe";
						
			if (universe) {
				OgameAPI.fetch(OgameAPI.HIGHSCORE, function (xml) {
                    let elements = xml.getElementsByTagName('player');
					
					for (let i=0,il=elements.length; i<il; i++) {
						players.push(elements[i].id);
					}
					
					loadData(players, data.spreadingData[data.currentProfile], universe);
				}, false);
			} else {
				for (let playerId in data.spreadingData[data.currentProfile]) {
					players.push(playerId);
				}
				
				loadData(players, data.spreadingData[data.currentProfile], universe);
			}
			
			loadPlayers();
		};

        let loadProfiles = function ()
		{
			c.DOM.clear('#uv-spreading #uv-s-profile'); //Clear dropdown

            let dropdown = $$.getElementById('uv-s-profile'),
				disabled = $$.createElement('option');

			disabled.value = " - ";
			disabled.setAttribute('disabled','disabled');
			
			if (data.currentProfile === "universe")
				disabled.setAttribute('selected', 'selected');
			
			dropdown.appendChild(disabled);
			
			for (let profile in data.spreadingData) {
                let option = $$.createElement('option');
				
				option.textContent = profile;
				option.value = profile;
				
				if (data.currentProfile === profile)
					option.setAttribute('selected', 'selected');
				
				dropdown.appendChild(option);
			}
		};

        let loadData = function (players, profilePlayers, universe)
		{
			c.DOM.clear('#uv-spreading .uv-s-galaxy'); //Clear planets

			let playersData = {};
			for (let i=0, il=players.length; i<il; i++) {
				playersData[players[i]] = {};
			}

			// Load the planets
            chrome.runtime.sendMessage({action: "API", call: "universe:findPlanetsByPlayers", parameters: [playersData, null, null]}, function(response)
            {
                if (players.indexOf(c.Application.ogame.playerId) !== -1) {
                    response.players[c.Application.ogame.playerId] = {
                        planets: playerPlanets() //Fallback incase the data is not present via de DatabaseAPI
                    };
                }

                for (let playerId in response.players) {
                    let planets	= response.players[playerId].planets;

                    for (let i=0, ilen=planets.length; i<ilen; i++) {
                        let planet 			= planets[i],
                            planetElement 	= $$.createElement('div');

                        planetElement.id = 'uv-s-planet-' + planet.id;
                        planetElement.classList.add('uv-s-planet');
                        planetElement.classList.add('uv-s-planet-' + playerId);
                        planetElement.dataset.galaxy = planet.galaxy;
                        planetElement.dataset.system = planet.system;
                        planetElement.dataset.position = planet.position;
                        planetElement.style.backgroundColor = universe ? "#ff0" : profilePlayers[playerId].color;
                        planetElement.style.width 	= options.width + "px";
                        planetElement.style.height 	= options.height + "px";
                        planetElement.style.top 	= ((options.height * planet.position) - options.height) + "px";
                        planetElement.style.left 	= ((options.width * planet.system) - options.width) + "px";

                        $$.getElementById('uv_s_g' + planet.galaxy).appendChild(planetElement);
                    }

                    if (!universe) {
                        data.planets[playerId] = planets; //Store planets
                    }
                }

                c.Loader.remove(data.loader); //Loading planets takes the longest, so remove the loader here
            });
		};

        let loadPlayers = function ()
		{
			c.DOM.clear('#uv-spreading #uv-s-playerlist'); //Clear playerlist
			c.DOM.clear('#uv-s-planetlist'); //Clear playerplanets

            let playerlist	= $$.getElementById('uv-s-playerlist'),
				idx			= 0,
				players		= data.spreadingData[data.currentProfile];
			
			for (let pid in players) {
                let playerObject = players[pid],
					playerItem = {
						'idx' : ++idx,
						'pid' : pid,
						'name' : playerObject.name,
						'color' : playerObject.color
				}; 
				
				c.Template.get('spreadingPlayer', function (item)
				{
					item.querySelector('.del').addEventListener('click', function (e) {
						removePlayer(this.parentNode.dataset.pid);
						c.PageCom.GoogleAnalytics.sendEvent('spreading', 'click', 'player_remove');
						e.stopPropagation();
					});

					item.querySelector('.uv-s-playercolor').addEventListener('colorchange', function (e) {
                        let pid	= this.parentNode.dataset.pid, color = this.value;
						
						data.spreadingData[data.currentProfile][pid].color = color;
						
						c.Store.set('spreading', data.spreadingData, true);

                        let planets = $$.getElementsByClassName('uv-s-planet-' + pid);
						
						for (let i=0, il=planets.length; i<il; i++) {
							planets[i].style.backgroundColor = color;
						}
					});
					
					item.id = 'uv-s-' + pid;
					item.dataset.pid = pid;
					item.addEventListener('click', selectPlayer);
					playerlist.appendChild(item);
					
					c.PageCom.JQuery.colorpicker('#uv-s-' + pid + ' .uv-s-playercolor', playerObject.color);
				}, playerItem);
			}
		};

        let selectPlayer = function (e)
		{
			$$.getElementById('uv-s-noplayer').style.display = "none";

			c.DOM.clear('#uv-s-planetlist');

            let selected = $$.querySelector('#uv-s-playerlist li.selected');
			if (selected) selected.classList.remove('selected');
			
			this.classList.add('selected');

            let planetlist	= $$.getElementById('uv-s-planetlist'),
				pid			= this.dataset.pid,
				planets		= data.planets[pid];
			
			for (let i=0,il=planets.length; i<il; i++) {
                let item = $$.createElement('li');
				
				item.textContent = (i+1) + ": " + planets[i].coords;
				item.dataset.coords = planets[i].coords;
				item.dataset.id = planets[i].id;
				item.addEventListener('click', function() { c.fn.loadGalaxy(this); });
				item.addEventListener('mouseenter', function (e) {
                    let planet = $$.getElementById('uv-s-planet-' + this.dataset.id);
					planet.classList.add('uv-s-detail');
					planet.style.top = parseInt(planet.style.top) - 3 + "px";
					planet.style.left = parseInt(planet.style.left) - 3 + "px";
				});
				item.addEventListener('mouseleave', function (e) {
                    let planet = $$.getElementById('uv-s-planet-' + this.dataset.id);
					planet.classList.remove('uv-s-detail');
					planet.style.top = parseInt(planet.style.top) + 3 + "px";
					planet.style.left = parseInt(planet.style.left) + 3 + "px";
				});

				planetlist.appendChild(item);
			}
		};

		let addPlayer = function (pid, name)
		{
			if ("string" === typeof pid) {
				if (data.currentProfile !== ""){
					data.spreadingData[data.currentProfile][pid] = {"color": "#ffff00", "name": name};
				} else {
					//If there's no current profile and default doesn't exists
					if (!data.spreadingData.Default) {
						data.spreadingData.Default = {};
					}
					data.spreadingData.Default[pid] = {"color": "#ffff00", "name": name};
					c.Store.set('spreadingCurrent', 'Default');
				}
				
				c.Store.set('spreading', data.spreadingData, true);
			}
			
			//If Spreading is already inited, reload the data
			if ($$.getElementById('uv-s-wrapper')) {
				initData();
			}
		};

        let removePlayer = function (pid)
		{
			$$.getElementById('uv-s-noplayer').style.display = "block";

			c.DOM.clear('#uv-s-planetlist');
			
			delete data.spreadingData[data.currentProfile][pid];
			
			c.Store.set('spreading', data.spreadingData, true);
			
			initData();
		};
		
		let playerPlanets = function ()
		{
            let plist 		= [],
				planetList 	= $$.getElementById('planetList'),
				planets 	= planetList.children;
				
			for (let i=0, ilen=planets.length; i<ilen; i++) {
                let planet		= planets[i],
					coords		= planet.querySelector('.planet-koords').firstChild.nodeValue,
					planetData 	= {
						'coords': coords.substring(1, coords.length - 1),
						'moon': planet.querySelector('.moonlink') !== null,
						'pid': c.Application.ogame.playerId,
						'id': /planet-(\d+)/.exec(planet.id)[1]
				};

                let split = planetData.coords.split(':');
				
				planetData.galaxy = split[0];
				planetData.system = split[1];
				planetData.position = split[2];
				
				plist.push(planetData);
			}
			
			return plist;
		};
		
		let initGalaxy = function ()
		{
            let galaxyFooter = c.DOM.getOne("#inhalt");
			if (galaxyFooter) {

                let currentProfile 	= c.Store.data.spreadingCurrent, //Get from Store because this function could run before the init
					spreadingData 	= c.Store.data.spreading;

                let div = c.DOM.create('div');
				div.id = "uv_s_g_profile";
				div.appendChild(c.DOM.text(c.Locale.dict.currentprofilegal));

                let drop = profileDropdown("uv_s_profile", spreadingData, currentProfile);
				div.appendChild(drop);

                let wrapper = c.DOM.create('div');
				wrapper.classList.add('ct_foot_row');
				wrapper.classList.add('uv_s_profile_wrapper');
				wrapper.appendChild(div);
				
				galaxyFooter.appendChild(wrapper);
			}
		};

        let profileDropdown = function (id, spreadingData, currentProfile) {

            let drop = c.DOM.create("select");
			drop.id = id;
			drop.classList.add('dropdown','currentlySelected','w100');
			drop.addEventListener('change', changeProfile);

            let empty 		= c.DOM.create("option");
				empty.value = "";
				drop.appendChild( empty );

			for (let prop in spreadingData) {

                let opt 	= c.DOM.create("option");
				opt.value 	= prop;
				opt.appendChild(c.DOM.text(prop)); 
				if (prop === currentProfile)
					opt.selected = "selected";
					
				drop.appendChild(opt);	

			}
			
			if (currentProfile === "")
				empty.selected = "selected";
			
			return drop;
			
		};

        let handleGalaxy = function (tooltipClass, playerInfoClass)
		{
            let tooltips = $$.getElementsByClassName(tooltipClass);
			
			for (let i=0,il=tooltips.length; i<il; i++) {
                let tooltip = tooltips[i];
					
				$$.querySelector("." + playerInfoClass, tooltip).appendChild(getAddPlayerButton());
			}
		};

		let addPlayerStopPropagation = function (e)
		{
            addPlayer(this.parentNode.dataset.pid, this.parentNode.dataset.name);
            c.PageCom.GoogleAnalytics.sendEvent('spreading', 'click', 'add_player');
            e.stopPropagation();
        };

        let getAddPlayerButton = function ()
		{
            let playerAdd = $$.createElement('div');
			
			if (c.Store.data.features.spreading === "yes") {
				playerAdd.classList.add('uv-btn-add');
				playerAdd.title = c.Locale.dict.playertospreading;
				playerAdd.addEventListener('click', addPlayerStopPropagation);
			}
			
			return playerAdd;
		};

        let setGalaxyRowColor = function (color)
		{
            let rows = $$.getElementsByClassName('uv-s-galaxy');

			for (let i=0, il=rows.length; i<il; i++) {
				rows[i].style.backgroundColor = color;
			}
		};
		
		return {init: init, initGalaxy: initGalaxy, handleGalaxy: handleGalaxy, getAddPlayerButton: getAddPlayerButton};
	}());