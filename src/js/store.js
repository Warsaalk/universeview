
	c.Store = (function() {
		const CONSTANTS = {
			ESPIONAGERAID_EXTRA_SMALLCARGO: 5,
			ESPIONAGERAID_EXTRA_LARGECARGO: 1,
			ESPIONAGERAID_EXTRA_REAPER: 2,
			ESPIONAGERAID_EXTRA_PATHFINDER: 2
		};

		let data = {
			planetOption	: null,
			serverUrl		: null,
			serverCode		: null,
			stats			: null,
			updatePlanets	: null, //Update Planet database
			updatePlayers	: null, //Update Player database
			updateOgame		: null, //Update Ogame serverData
			version			: null,
			spreadingCurrent: null,
			spreading		: null,
			features		: null,
			techNames	  	: null, //Different ogame technology names
			techNamesReversed: {},
			missionNames	: null, //Different ogame mission names
			quickSearch		: null,
			hello			: null,
			favourites		: null,
			ogameSettings 	: null,
			playerResearch	: null,
			eventNotification: null,
			espionageRaid	: null,
			idleTimer		: null,
			gaClientID		: null,
		};
		
		let init = function()
		{
			//On a version change we want to update some stuff 
			if (c.Store.data.version != c.config.version) {
				del('updateOgame');
			}
			
			data.planetOption		= get('planetOption');
			data.serverUrl			= get('serverUrl');
			data.serverCode			= get('serverCode');
			data.stats				= get('stats');
			data.updatePlanets		= get('updatePlanets');
			data.updatePlayers		= get('updatePlayers');
			data.updateOgame		= get('updateOgame');
			data.version			= get('version');
			data.spreadingCurrent	= get('spreadingCurrent');
			data.quickSearch		= get('quickSearch');
			data.hello				= get('hello');
			data.gaClientID			= get('gaClientID');
			
			data.ogameSettings		= JSON.parse(get('ogameSettings'));
			data.playerResearch		= JSON.parse(get('playerResearch'));
			data.techNames			= JSON.parse(get('techNames')) || {};
            data.missionNames		= JSON.parse(get('missionNames')) || {};
			data.spreading			= JSON.parse(get('spreading'));
			data.features			= JSON.parse(get('features'));
			data.favourites			= JSON.parse(get('favourites'));
			data.eventNotification 	= JSON.parse(get('eventNotification'));
			data.espionageRaid 		= JSON.parse(get('espionageRaid'));
			data.idleTimer 			= JSON.parse(get('idleTimer'));

			data.techNamesReversed	= c.Utils.reverseKeyValue(data.techNames);

			handleDefaults();
		};
		
		let handleDefaults = function()
		{
			let favsDefault	= {favs: []};
			
			if (!data.spreadingCurrent || data.spreadingCurrent == "" || data.spreadingCurrent.length < 2) {
				set('spreadingCurrent', 'Default');
			}
			
			if (!data.ogameSettings) {
				data.ogameSettings = {
					number: null,
					language: null,
					timezone: null,
					domain: null,
					version: null,
					speed: 1,
					speedFleet: 1,
					galaxies: 9,
					systems: 499,
					acs: 1,
					rapidFire: 1,
					defToTF: 0,
					debrisFactor: 0.3,
					repairFactor: 0.7,
					newbieProtectionLimit: 50000,
					newbieProtectionHigh: 10000,
					bonusFields: 0,
					donutGalaxy: 1,
					donutSystem: 1
				};
				
				set('ogameSettings', data.ogameSettings, true);
			}
			
			if (!data.playerResearch) {
				data.playerResearch = {
					106: 0,
					108: 0,
					109: 0,
					110: 0,
					111: 0,
					113: 0,
					114: 0,
					115: 0,
					117: 0,
					118: 0,
					120: 0,
					121: 0,
					122: 0,
					123: 0,
					124: 0,
					199: 0
				};
				
				set('playerResearch', data.playerResearch, true);
			}
			
			if (!data.spreading) {
				data.spreading = {'Default': {}};

				set('spreadingCurrent', 'Default');
				set('spreading', data.spreading, true);
			}
			
			if (!data.favourites || !data.favourites.favs) {
				data.favourites = favsDefault;

				set('favourites', data.favourites, true);
			}
				
			if (!data.quickSearch || (data.quickSearch != "A" && data.quickSearch != "P")) { 
				set("quickSearch","P");		
			}
			
			if (!data.planetOption) { set("planetOption","idb"); }

			// "1": Attack, "2": "ACS Attack","3":"Transport","4":"Deployment","5":"ACS Defend","6":"Espionage","7":"Colonisation","8":"Recycle debris field","9":"Moon Destruction","15":"Expedition"
			if (!data.eventNotification) {
				data.eventNotification = {
					returningEnabled: true,
                	ownArriving: 		{"1": true, "2": true, "3": true, "4": true, "5": true, "6": false, "7": true, "8": true, "9": true, "15": true},
                    ownReturning: 		{"1": true, "2": true, "3": true, "4": true, "5": true, "6": false, "7": true, "8": true, "9": true, "15": true},
                    otherArriving: 		{"1": true, "2": true, "3": true, "4": null, "5": true, "6": false, "7": null, "8": null, "9": true, "15": null},
					notificationOffset:	{"1": 60, "2": 60, "3": 60, "4": 60, "5": 60, "6": 60, "7": 60, "8": 60, "9": 60, "15": 60},
					useComputerTime: false
				};

                set('eventNotification', data.eventNotification, true);
			}

			if (!data.idleTimer) {
				data.idleTimer = {
					showSeconds: true,
					expirationTime: 90 // Minutes
				};

				set('idleTimer', data.idleTimer, true);
			}

			if (!data.espionageRaid) {
				data.espionageRaid = {
					"202": CONSTANTS.ESPIONAGERAID_EXTRA_SMALLCARGO,
					"203": CONSTANTS.ESPIONAGERAID_EXTRA_LARGECARGO,
					"218": CONSTANTS.ESPIONAGERAID_EXTRA_REAPER,
					"219": CONSTANTS.ESPIONAGERAID_EXTRA_PATHFINDER
				};

				set('espionageRaid', data.espionageRaid, true);
			}

			// Added in update 4.1.4
			if (data.espionageRaid["218"] === void 0) {
				data.espionageRaid["218"] = CONSTANTS.ESPIONAGERAID_EXTRA_REAPER;

				set('espionageRaid', data.espionageRaid, true);
			}
			
			if (!data.features) { data.features = {}; }
			
			//Test them seperate, if a new feature get's added we don't have to reset the whole object
			if (!data.features.updateSystems)		{ data.features.updateSystems		= "yes"; 	}
			if (!data.features.showPlanets)			{ data.features.showPlanets 		= "yes"; 	}
			if (!data.features.militairy)			{ data.features.militairy 			= "no";		}
			if (!data.features.research)			{ data.features.research 			= "yes";	}
			if (!data.features.quickSearch)			{ data.features.quickSearch 		= "yes"; 	}
			if (!data.features.spreading)			{ data.features.spreading 			= "yes"; 	}

			if (!data.features.galaxyRefresh)		{ data.features.galaxyRefresh 		= "yes"; 	}
            if (!data.features.galaxyRank)			{ data.features.galaxyRank 			= "yes"; 	}
            if (!data.features.galaxyDebris)		{ data.features.galaxyDebris		= "yes"; 	}

			if (!data.features.favourites)			{ data.features.favourites 			= "yes"; 	}
			if (!data.features.moonDestruction)		{ data.features.moonDestruction 	= "yes"; 	}
			if (!data.features.planetFields)		{ data.features.planetFields 		= "no"; 	}
			if (!data.features.highScore)			{ data.features.highScore 			= "yes"; 	}
			if (!data.features.fleetPage)			{ data.features.fleetPage 			= "yes"; 	}
            if (!data.features.eventNotification)	{ data.features.eventNotification 	= "yes"; 	}
			if (!data.features.idleTimer)			{ data.features.idleTimer			= "yes";	}

            if (!data.features.messagesRaid)		{ data.features.messagesRaid		= "yes";	}

			
			set("features", data.features, true);
		};
		
		let set = function (option, value, object)
		{
			data[option] = value;

			if (object)	localStorage.setItem('UV_' + option, JSON.stringify(value));
			else 		localStorage.setItem('UV_' + option, value);
		};

		const changeValue = function (object, keys, value)
        {
            const key = keys.shift();
            if (typeof object[key] === "object") {
                changeValue(object[key], keys, value);
            } else {
                object[key] = value;
            }
        };

		let setByPath = function (path, value)
        {
            const
                keys = path.split('.'),
                keyCount = keys.length,
                option = keys[0];

            changeValue(data, keys, value);

            if (keyCount > 1 || typeof value === "object") {
                localStorage.setItem('UV_' + option, JSON.stringify(data[option]));
            } else {
                localStorage.setItem('UV_' + option, data[option]);
            }
        };
		
		let get = function (option)
		{
			return localStorage.getItem('UV_' + option);
		};

		const getValue = function (acc, curr)
		{
			return (acc && typeof acc[curr] !== "undefined")
				? acc[curr]
				: null;
		};

		let getDataByPath = function (path)
        {
            return path.split('.').reduce(getValue, data);
        };
		
		let del = function (option)
		{
			if (Array.isArray(option)) {
				for (let i=0, ilen=option.length; i<ilen; i++) {
					delete localStorage['UV_' + option[i]];
				}
			} else {
				delete localStorage['UV_' + option];
			}
		};
		
		return {init: init, set: set, setByPath: setByPath, del: del, data: data, CONSTANTS, getDataByPath: getDataByPath};
	}());
	