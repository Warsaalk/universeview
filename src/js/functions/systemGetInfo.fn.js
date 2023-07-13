
	c.fn.systemGetInfo = system =>
	{
		const players = {}, planets = [];

		for (let i=0, il=system.galaxyContent.length; i<il; i++) {
			let planetRow = system.galaxyContent[i];
			if (planetRow.position < 16) {
				let	planetInfo		= planetRow.planets.find(planet => planet.planetType === 1),
					moonInfo		= planetRow.planets.find(planet => planet.planetType === 3),
					playerId		= planetRow.player.playerId,
					playerName		= planetRow.player.playerName;

				planets.push({
					id: 		planetInfo ? planetInfo.planetId : null,
					name:		planetInfo ? planetInfo.planetName : null,
					coords: 	[planetRow.galaxy, planetRow.system, planetRow.position].join(':'),
					galaxy: 	planetRow.galaxy,
					system: 	planetRow.system,
					position: 	planetRow.position,
					moon: 	    moonInfo ? {id: moonInfo.planetId, name: moonInfo.planetName, size: moonInfo.size} : false,
					pid: playerId
				});

				if (playerId !== null && playerId !== 99999) {
					if (players[playerId] === void 0) {
						players[playerId] = {
							id: playerId,
							name: playerName,
							alliance: planetRow.player.allianceName !== void 0 && planetRow.player.allianceName.length > 0 ? planetRow.player.allianceName : null
						};
					}

					c.fn.systemPreparePlayer(playerId, playerName, i + 1);
				}
			}
		}

		return {planets: planets, players: players, galaxy: system.galaxy, system: system.system};
	};