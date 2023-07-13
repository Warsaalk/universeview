
	c.Application = (function ()
	{
		let currentState = 0;
		let states = {
			INITED: 1,
			LOADED: 2,
			COMPLETED: 3,
			JQUERY: 4
		};

		let observer;

		let ogame = {
			universe		: null, //Url server
			universeCode    : null, //Universe number : example uni104
			universeNumber	: null,
			language		: null, //Language interface
			languageCode	: null, //Server language
			version 		: null, //Version server
			speed   		: null, //Play speed server
			speedFleet		: null,
			speedFleetPeaceful	: null,
			speedFleetHolding	: null,
			speedFleetWar		: null,
			playerId 		: null, //Id current player
			playerName		: null, //Name current player
			versionCheck	: null,
			community		: null,
			allianceId		: null,
			allianceName	: null,
			allianceTag		: null,
			planetId		: null,
			planetName		: null,
			planetCoords	: null,
			planetType		: null,
			timeStamp		: null
		};

		let database = {
			planets		: null,  
			planetsName	: null, //Name IDB database for planets
			players		: null, 
			playersName	: null //Name IDB database for players
		};
		
		let data = {
			highScore: "",
			tooltips: 0,
			loaders: 0,
			AGO: false,
            OGAMELEGACY: false
		};

		let timeStampDiff = null;
		
		const launch = () =>
		{
			c.Utils.timelineHit('UniverseView: Launch');
			c.Utils.log('UniverseView Start');
			c.Utils.timeStart('UniverseView Debug: Application Init finished');
			c.Utils.timeStart('UniverseView Debug: Application Head finished');
			c.Utils.timeStart('UniverseView Debug: Application Body finished');
			c.Utils.log('UniverseView Debug: Application Launched');

			init();
		};
		
		const init = () =>
		{
			data.AGO = c.config.ago;
			
			c.PageCom.init();
			
			c.Utils.timelineHit('UniverseView: Init');
			c.Utils.log('UniverseView Debug: Application Init start');
			c.Utils.log('UniverseView Debug: AGO - ' + data.AGO);
			
			setCommunityAndUniverseNumber();
			
			c.Store.init();
			c.Template.init();
			c.Locale.init();
						
			setObservers();
			setListeners();
			
			currentState = states.INITED;
			c.Utils.timeEnd('UniverseView Debug: Application Init finished');
			head();
		};
		
		const head = () =>
		{
			c.Utils.timelineHit('UniverseView: Head');
			c.Utils.log('UniverseView Debug: Application Head start');
			
			const execute = () =>
			{
				$$.body.classList.add("universeview");

				setOgameConfig();

				timeStampDiff = c.Application.ogame.timeStamp * 1000 - c.initTimeStamp;

				setObserversAfterOGameConfig();

				if (c.Store.data.features.idleTimer === "yes") {
					c.ft.IdleTimer.init(ogame.planetId, ogame.planetType, ogame.planetCoords, ogame.timeStamp);
				}

				if (!data.AGO) {
					c.Style.init();
				}
				
				Tooltip.init();

				if (c.Store.data.features.research === "yes") { c.ft.Research.init(); }
				
				c.Notifications.init();
				c.Check.ogameSettings();
				c.Check.ogameLocalization();

				c.PageCom.Galaxy.init();

				currentState = states.LOADED;
			};
			
			if (document.body) {
				execute();
				c.Utils.timeEnd('UniverseView Debug: Application Head finished');
				body();
			} else {
				setTimeout(head, 1);
			}
		};
		
		const body = () =>
		{
			c.Utils.timelineHit('UniverseView: Body');
			c.Utils.log('UniverseView Debug: Application Body start');
			
			const execute = () =>
			{
				const gaCID = c.GoogleAnalytics.getClientID();
				if (c.config.type === "XPI") {
                    chrome.runtime.sendMessage({action: "googleAnalytics"}, response => {
                        if (response === true) {
                            c.PageCom.GoogleAnalytics.init(c.config.googleAnalyticsCode, gaCID, 'gameforge.com');
                            c.PageCom.GoogleAnalytics.sendHeartbeat();
						}
                    });
				} else {
                    c.PageCom.GoogleAnalytics.init(c.config.googleAnalyticsCode, gaCID, 'gameforge.com');
                    c.PageCom.GoogleAnalytics.sendHeartbeat();
                }
				
				if (c.Store.data.features.fleetPage === "yes" && !data.AGO) {
					if (c.Utils.checkPage('fleet2') || c.Utils.checkPage('fleetdispatch')) {
						c.ft.FleetPageTarget.init();
					}
				}
				
				//c.Check.planetDatabase();
				c.Check.hello();
				c.Check.version();
				c.Check.statistics();
				
				if (c.Utils.checkPage('research')) c.Player.saveResearch();

				window.addEventListener('blur', () => {
                    chrome.runtime.sendMessage({action: "API", call: "universe:saveChanges"});
				});

				currentState = states.COMPLETED;
			};
						
			if (document.readyState === 'interactive' || document.readyState === 'complete') {
				execute();
				c.Utils.timeEnd('UniverseView Debug: Application Body finished');
				c.Utils.log('UniverseView End');
			} else {
				setTimeout(body, 1);
			}
		};
		
		const setCommunityAndUniverseNumber = () =>
		{
			const result = /s(\d+)-(\w+)\.ogame\.gameforge\.com/.exec(window.location.host);

			ogame.universeNumber = result[1];
            ogame.community = result[2];
		};

		const validatePlanetList = (planetList, timeout) =>
		{
			const execute = (planetList) =>
			{
				try {
					c.ft.PlanetList.hit(planetList);
					c.ft.IdleTimer.hitFromPlanetList(planetList);
				} catch (e) {
					console.log("Planet list exception");
					console.log(e);
				}
			};

			let planetCount = /(\d+)\/\d+/.exec($$.querySelector("#countColonies span").textContent);

			planetCount = planetCount ? +planetCount[1] : planetList.children.length;

			let availablePlanets = planetList.getElementsByClassName("planet-koords").length;

			if (planetCount === availablePlanets) {
				console.log("PlanetList fully loaded");
				execute(planetList);
			} else {
				console.log("PlanetList not fully loaded: " + availablePlanets + "/" + planetCount);
				// Retry
				timeout = "undefined" === typeof timeout ? 1 : timeout * 2;

				setTimeout(validatePlanetList, timeout, planetList, timeout);
			}
		};

		const setGenericFeatures = mutation =>
        {
            if (c.Store.data.features.spreading === "yes") {
                c.ft.Spreading.init(mutation);
            }
            if (c.Store.data.features.quickSearch === "yes") {
                c.ft.QuickSearch.init(mutation);
            }
            if (c.Store.data.features.favourites === "yes") {
                c.ft.Favourite.init(mutation);
            }
        };
		
		const setObservers = () =>
		{
			observer = new c.Class.Observer(document);
			observer.listenToId('info', setGenericFeatures); // Old
            observer.listenToId('top', setGenericFeatures); // Version 7
			observer.listenToId('menuTableTools', c.MenuButton.build);

			// Support for multiple OGame versions
            observer.listenToId('planetList', validatePlanetList);
			
			// Fix officers if quickSearch is enabled
			if (c.Store.data.features.quickSearch === "yes" && data.OGAMELEGACY) {
				observer.listenToId('officers', c.ft.QuickSearch.initOfficers);
			}
			
			// Galaxy page
			if (c.Utils.checkPage('galaxy')) {
				// Version 6.3.4
				observer.listenToId('phalanxWrap', c.ft.Simulate.hitFromPhalanx);
				// Version 6.3.5
                observer.listenToId('content', mutation => {
                	let phalanxWrap = $$.getElementById('phalanxWrap');
                	if (phalanxWrap) {
                        c.ft.Simulate.hitFromPhalanx(phalanxWrap);
                    }
                });
			}
			
			// Highscore page
			if (c.Store.data.features.highScore === "yes" && c.Utils.checkPage('highscore')) {
				// First hit on initial page load
				observer.listenToId('ranks', c.ft.HighScore.hit);
				// All hits after that will be on the #content element
				// (this will also be hit the first time but it does not yet contain the ranks table because OGame has to init it first)
				observer.listenToId('content', mutation => {
					let ranks = mutation.querySelector('#ranks');
					if (ranks) c.ft.HighScore.hit(ranks);
				});
			}

            let checkForApiButton = mutation =>
			{
                let apiButtons = mutation.querySelectorAll("div.msg_actions .icon_apikey");
				for (let i=0, il=apiButtons.length; i<il; i++) {
                    if (c.ft.Simulate.srRegex.test(apiButtons[i].title)) c.ft.Simulate.hitFromMessages(apiButtons[i]);
                    if (c.ft.Convert.crRegex.test(apiButtons[i].title)) c.ft.Convert.hitFromMessages(apiButtons[i]);
				}

                c.PageCom.Tipped.create('.uv-simulate-trashsim', c.Locale.dict.trashsimsimulate, { hook: 'topmiddle', radius: {size:3}, skin: 'cloud'});
                c.PageCom.Tipped.create('.uv-convert-ogotcha', c.Locale.dict.ogotchaconvert, { hook: 'topmiddle', radius: {size:3}, skin: 'cloud'});
			};

			// Messages page
			if (c.Utils.checkPage('messages')) {
                let observerHit = mutation => {
                    checkForApiButton(mutation);
                    if (c.Store.data.features.messagesRaid === "yes") {
                    	c.ft.Raid.hitEspionagePreview(mutation);
                    }
                };
				// Version 6.3.4
				observer.listenToClass('tab_inner', observerHit);
				// Version 6.3.5
				observer.listenToId('fleetsgenericpage', observerHit);
                observer.listenToId('defaultmessagespage', observerHit);
				
				observer.listenToClass('detail_msg', mutation => {
					if (c.Store.data.features.research === "yes") {
						c.ft.Research.hit(mutation);
					}
					checkForApiButton(mutation);
				});
			}
		};

		const setListeners = () =>
		{
			chrome.runtime.onMessage.addListener((request, sender, callback) =>
			{
				if (request.action === "idleTimer:UpdateTimers" && c.Store.data.features.idleTimer === "yes") {
					c.ft.IdleTimer.updateTimers(request.data);
				}
			});
		};

		const setObserversAfterOGameConfig = () =>
		{
			observer.listenToId('eventListWrap', mutation => {
				c.ft.Simulate.hitFromEventList(mutation);

				if (!c.Utils.checkPage('movement') && c.Store.data.features.eventNotification === "yes") {
					c.ft.EventNotification.hitFromEventList(mutation);
				}

				c.ft.IdleTimer.hitFromEventList(mutation);
			});
		};
		
		const setOgameConfig = () =>
		{
			ogame.playerId 		= $$.querySelector('meta[name=ogame-player-id]').getAttribute('content');
			ogame.playerName	= $$.querySelector('meta[name=ogame-player-name]').getAttribute('content');
			ogame.universe		= $$.querySelector('meta[name=ogame-universe]').getAttribute('content');
			ogame.universeCode  = ogame.universe.split('.')[0];
			ogame.language		= $$.querySelector('meta[name=ogame-language]').getAttribute('content');
			ogame.languageCode	= $$.documentElement.lang || $$.querySelector('meta[http-equiv=Language]').getAttribute('content'); // Version 7 || legacy version
			ogame.version 		= $$.querySelector('meta[name=ogame-version]').getAttribute('content');
			ogame.speed   		= $$.querySelector('meta[name=ogame-universe-speed]').getAttribute('content');
			//ogame.speedFleet 	= $$.querySelector('meta[name=ogame-universe-speed-fleet]').getAttribute('content');
			ogame.speedFleetPeaceful= $$.querySelector('meta[name=ogame-universe-speed-fleet-peaceful]').getAttribute('content');
			ogame.speedFleetHolding = $$.querySelector('meta[name=ogame-universe-speed-fleet-holding]').getAttribute('content');
			ogame.speedFleetWar 	= $$.querySelector('meta[name=ogame-universe-speed-fleet-war]').getAttribute('content');
			ogame.speedFleet 	= ogame.speedFleetWar;
			ogame.versionCheck	= $$.querySelector('meta[name=ogame-version-check-url]') ? $$.querySelector('meta[name=ogame-version-check-url]').getAttribute('content') : false;
			ogame.timeStamp		= $$.querySelector('meta[name=ogame-timestamp]').getAttribute('content');

			ogame.allianceId	= $$.querySelector('meta[name=ogame-alliance-id]') ? $$.querySelector('meta[name=ogame-alliance-id]').getAttribute('content') : null;
			ogame.allianceName	= $$.querySelector('meta[name=ogame-alliance-name]') ? $$.querySelector('meta[name=ogame-alliance-name]').getAttribute('content') : null;
			ogame.allianceTag	= $$.querySelector('meta[name=ogame-alliance-tag]') ? $$.querySelector('meta[name=ogame-alliance-tag]').getAttribute('content') : null;
			ogame.planetId		= $$.querySelector('meta[name=ogame-planet-id]').getAttribute('content');
			ogame.planetName	= $$.querySelector('meta[name=ogame-planet-name]').getAttribute('content');
			ogame.planetCoords	= $$.querySelector('meta[name=ogame-planet-coordinates]').getAttribute('content');
			ogame.planetType	= $$.querySelector('meta[name=ogame-planet-type]').getAttribute('content');

			data.OGAMELEGACY = /^\d/.exec(ogame.version)[0] < 7;
		};
		
		const getOGameVersion = () =>
		{
			let version = c.Application.ogame.version[0];
			if (c.Utils.isInt(version)) {
				return parseInt(version);
			}
			
			return false;
		};

		const getPath = file =>
		{
			return chrome.extension.getURL('chrome/content/' + file);
		};

		const preload = images =>
		{
			let preloaded = new Array(images.length);
			for (let i=images.length; i--;) {
				preloaded[i] = new Image();
				preloaded[i].src = getPath('img/' + images[i]);
			}
		};

		const getTimeStampDiff = () =>
		{
			if (timeStampDiff === null) throw new Error("UniverseView Exception: Only use this function after the OGame config has been set.");

			return timeStampDiff;
		};
		
		return {
			launch: launch,
			preload: preload,
			data: data,
			ogame: ogame,
			database: database,
			getPath: getPath,
			getOGameVersion: getOGameVersion,
			getTimeStampDiff: getTimeStampDiff
		};
	}());
	