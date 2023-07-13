	
	c.ft.Simulate = (function ()
	{
		let buttonCounter = 0, srRegex = /(sr\-[a-z]{2}\-\d{1,3}\-[0-9a-z]{40})/;

        let hitFromMessages = function (apiButton)
		{
            let btn = $$.createElement('a');

			btn.href = getTrashSimSimulateUrlForKey(apiButton);
			btn.target = '_blank';
			btn.classList.add('uv-simulate-trashsim', 'uv-element');
			btn.addEventListener('click', function (e) {
				c.PageCom.GoogleAnalytics.sendEvent('simulate', 'click', 'trashsim');
			});

            apiButton.parentNode.parentNode.appendChild(btn);
		};

        let getUTMTags = function (content)
		{
            return 'utm_source=ogame&utm_medium=universeview&utm_content=' + encodeURIComponent(content) + '&utm_campaign=simulate';
		};

        let getTrashSimSimulateUrlForKey = function (apiBtn)
		{
            let apiKey = srRegex.exec(apiBtn.title)[1],
				apiCom = apiKey.split('-')[1], //Community
				urlbase = c.config.apps.trashsim.url;
		
			if ("undefined" !== typeof c.config.apps.trashsim.communities[apiCom]) {
				urlbase += c.config.apps.trashsim.communities[apiCom];
			}

			return urlbase + '?SR_KEY=' + apiKey + '&' + getUTMTags("espionage message") + '#prefill=' + window.btoa(JSON.stringify(getSimulationBase(0)));
		};

        let hitFromEventList = function (mutation)
		{
			hitForEventFleets(mutation, '.icon_movement');
		};

        let hitFromPhalanx = function (mutation)
		{
			hitForEventFleets(mutation, '.detailsFleet');
		};

        let hitForEventFleets = function (mutation, classNameSelector)
		{
            let mapping = {}, ships = [], names = c.Store.data.techNames, coordsRegex = /\d:\d{1,3}:\d{1,2}/;

            let appendSimulationData = function (mission, fleetDetails, acsAttackData) {

                let origin = false, destination = false, acs = 0, id = 'uv-simulate-trashsim' + (++buttonCounter), data = {};
				
				if (acsAttackData === false) {
                    let regex = new RegExp('('+ ships.join('|') +'):<\/td>\\s+<td class="value">(\\d+(?:(?:\\.\\d{3})+)?)', 'gm'), matches;

					while ((matches = regex.exec(fleetDetails.title))) {
						data[mapping[matches[1]]] = {'count': matches[2].replace(/\./g, '')};
					}
				} else {
					data = acsAttackData;
					acs = 1;
				}

                let originContent = coordsRegex.exec(mission.querySelector('.coordsOrigin').textContent), destinationContent = coordsRegex.exec(mission.querySelector('.destCoords').textContent);
				
				if (originContent) 		origin = originContent[0];
				if (destinationContent) destination = destinationContent[0];
				
				fleetDetails.title = fleetDetails.title.replace(/<\/div>\s*$/, '<div class="splitLine"></div><a href="#" id="'+id+'" class="uv-simulate-trashsim uv-element" data-acs="'+acs+'" data-origin="'+origin+'" data-destination="'+destination+'" data-fleet=\''+ JSON.stringify(data) +'\' onclick="'+ cName +'.actions.Simulate.triggerEventFleetSimulation(this, event);"><div class="uv-simulate-party" data-party="0"></div><div class="uv-simulate-party" data-party="1"></div></a></div>');
				
				return {origin: origin, destination: destination, fleet: data};
			};
			
			if (names) {
				for (let type in names) {
					if (type > 200 && type < 300) {
						mapping[names[type]] = type;
						ships.push(names[type]);
					}
				}
				
				if (ships.length > 0) {
                    let missions = mutation.querySelectorAll('#eventContent tr.eventFleet, #eventContent tr.allianceAttack, #phalanxEventContent div.eventFleet, #phalanxEventContent div.partnerInfo'), acsAttacks = {}, acsFleetData = {};

					for (let i=0,il=missions.length; i<il; i++) {
                        let fleetDetails = missions[i].querySelector(classNameSelector + ' span'), isAcsFleet = missions[i].classList.contains('partnerInfo');
						if (fleetDetails && fleetDetails.title) {
                            let acsLink = missions[i].querySelector('a[rel*="union"]');
							if (acsLink) {
								acsAttacks[acsLink.rel] = {fleetDetails: fleetDetails, mission: missions[i]};
							} else {
                                let fleetData = appendSimulationData(missions[i], fleetDetails, false);
								if (isAcsFleet) {
                                    let unionId = /(phalanx-)?union\d+/.exec(missions[i].className)[0];
									
									if (!acsFleetData[unionId]) acsFleetData[unionId] = [];
									acsFleetData[unionId].push(fleetData);
								}
							}
						}
					}
					
					for (let union in acsFleetData) {
						if (acsAttacks[union]) {
							appendSimulationData(acsAttacks[union].mission, acsAttacks[union].fleetDetails, acsFleetData[union]);
						}
					}
				}
			}
		};

        let triggerSimulationButton = function (id, party)
		{
			eventFleetSimulation($$.getElementById(id), party);
		};

        let eventFleetSimulation = function (link, party)
		{
            let com = c.Application.ogame.community, urlbase = c.config.apps.trashsim.url, opposite = party == 1 ? 0 : 1;

            let getPlayerData = function (fleet, origin, destination) {
                let playerData = {"ships": fleet};

                origin = origin.split(':');
                destination = destination.split(':');
	
				if (party == 0 && origin.length === 3 || party == 1 && destination.length === 3) {
					playerData["planet"] = {"galaxy": origin[0], "system": origin[1], "position": origin[2]};
				}
				
				return playerData;
			};
			
			if ("undefined" !== typeof c.config.apps.trashsim.communities[com]) {
				urlbase += c.config.apps.trashsim.communities[com];
			}

            let simulationData = getSimulationBase(opposite);
			simulationData[party] = [];
			
			if (link.getAttribute('data-acs') == 1) {
                let playersData = JSON.parse(link.getAttribute('data-fleet'));
				for (let i=0,il=playersData.length; i<il; i++) {
					simulationData[party].push(getPlayerData(playersData[i].fleet, playersData[i].origin, playersData[i].destination));
				}
			} else {
				simulationData[party].push(getPlayerData(JSON.parse(link.getAttribute('data-fleet')), link.getAttribute('data-origin'), link.getAttribute('data-destination')));
			}

            let event = new MouseEvent('click', {'view': window, 'bubbles': true, 'cancelable': false});
			
			link.href = urlbase + '?' + getUTMTags("event fleet") + '#prefill=' + window.btoa(JSON.stringify(simulationData));
			link.target = '_blank';
            link.dispatchEvent(event);
			
			c.PageCom.GoogleAnalytics.sendEvent('simulate', 'click', 'trashsim eventlist ' + party);
		};

        let getSimulationBase = function (activePlayerParty)
		{
            let settings = c.Store.data.ogameSettings, research = c.Store.data.playerResearch, data = {};
			
			if (c.Application.ogame.planetCoords) {
                let oppositePlanet = c.Application.ogame.planetCoords.split(':');
				data["planet"] = {"galaxy": oppositePlanet[0], "system": oppositePlanet[1], "position": oppositePlanet[2]};
			}
			
			if (research) {
                let levels = {};
				for (let type in research) {
					levels[type] = {'level': research[type]};
				}
				
				data["research"] = levels;
			}

            let simulationData = {};
			simulationData[activePlayerParty] = [data];
			
			if (settings) {
				simulationData['settings'] = {
					speed_fleet: settings.speedFleet,
					galaxies: settings.galaxies,
					systems: settings.systems,
					rapid_fire: settings.rapidFire,
					def_to_tF: settings.defToTF,
					debris_factor: settings.debrisFactor,
					repair_factor: settings.repairFactor,
					donut_galaxy: settings.donutGalaxy,
					donut_system: settings.donutSystem,
				};
			}
			
			return simulationData;
		};
		
		return {srRegex: srRegex, hitFromMessages: hitFromMessages, hitFromPhalanx: hitFromPhalanx, hitFromEventList: hitFromEventList, eventFleetSimulation: eventFleetSimulation, triggerSimulationButton: triggerSimulationButton};
	}());