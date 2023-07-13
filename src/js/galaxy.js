
	c.Galaxy = (function()
	{
		let isHit = false;
			
		let hit = function (content)
		{
			if (!isHit) {
                if (c.Store.data.features.militairy === "yes") 			{ storeHighscore(); 				} //Load highscore xml in to application highscore data variable
				if (c.Store.data.features.spreading === "yes" )			{ c.ft.Spreading.initGalaxy();		}
				if (c.Store.data.features.galaxyRefresh === "yes" )		{ c.ft.RefreshClock.init();	 		}
				handle(content);
				//if (c.Store.data.features.research === "yes" )			{ c.DatabaseAPI.updatePlayers();	}
				if (c.Store.data.features.moonDestruction === "yes" )	{ c.ft.MoonDestruction.init(); 		}
				isHit = true;
			} else {
				handle(content);
			}
		};
		
		let storeHighscore = function ()
		{
			OgameAPI.fetch(OgameAPI.HIGHSCORE, function (highscore) {
				c.Application.data.highScore = highscore;
			});
		};
		
		let handle = function(content)
		{
			//Get each playerid from galaxy page
			let systemInfo = c.fn.systemGetInfo(content.system);
			
			if (c.Store.data.features.galaxyRefresh === "yes") 	{ c.ft.RefreshClock.refresh(); 					}
			if (c.Store.data.features.favourites === "yes") 	{ c.ft.Favourite.handleGalaxy(systemInfo.galaxy, systemInfo.system); 	}
			
			if (!c.Application.data.AGO) {
				c.Style.improveGalaxy();
                if (c.Store.data.features.galaxyDebris === "yes") 	{ c.ft.GalaxyDebris.init(); }
				if (c.Store.data.features.galaxyRank === "yes") 	{ c.ft.GalaxyRank.init(); }
			}
			
			if (systemInfo.planets.length > 0) {
                if (c.Store.data.features.moonDestruction === "yes"){ c.ft.MoonDestruction.handleGalaxy(); }
            }

			chrome.runtime.sendMessage({action: "API", call: "universe:findAndUpdatePlanetsBySystemInfo", parameters: [systemInfo]}, function(response) {
				handlePlayers(response.players, response.galaxy, response.system);
			});
		};
		
		let handlePlayers = function (players, galaxy, system)
		{
			for (let playerId in players) {
				let playerclass	= 'uv-player-' + playerId; /* Uv List */

				c.DOM.clear('.uv-t-player-' + playerId + ' > .ListLinks .uv-player-planets');
				c.DOM.clear('.uv-t-player-' + playerId + ' > .ListLinks .uv-player-research');
				c.DOM.clear('.uv-t-player-' + playerId + ' > .ListLinks .uv-player-highscore');

				var planets = players[playerId].planets.sort(c.Helper.CoordinateSorter.run);
				
				//TODO:: Take care off tooltip refresh when tooltip is shown before everything is loaded
				
				/* Uv Spreading */
				if (c.Store.data.features.spreading === "yes" )	{ c.ft.Spreading.handleGalaxy('uv-t-player-' + playerId, playerclass); }
				/* Uv ShowPlanets */
				if (c.Store.data.features.showPlanets === "yes"){ c.ft.PlayerPlanets.handle('.' + playerclass + ' .uv-player-planets', planets, galaxy, system); }
				/* Uv Research */
				if (c.Store.data.features.research === "yes")	{ c.ft.Research.handle('.' + playerclass + ' .uv-player-research', players[playerId].technologies, planets.length); }
				/* Uv Militairy */
				if (c.Store.data.features.militairy === "yes") 	{ c.ft.Militairy.handle('.' + playerclass + ' .uv-player-highscore', playerId); }
				
				//UvUtils.RefreshTooltip('class',pid);
			}
		};
		
		return {hit: hit};
	}());
	