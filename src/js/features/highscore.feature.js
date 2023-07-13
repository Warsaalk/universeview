	
	c.ft['HighScore'] = (function () {

		var players;
		
		var hit = function (ranks) {

			if (!ranks.hasAttribute('data-uv-hit')) {
				if (players) {
					setPlayerStatus();
				} else {
					OgameAPI.fetch(OgameAPI.PLAYERS, function (xml) {
						players = xml;
						setPlayerStatus();
					}, true);
				}
				ranks.setAttribute('data-uv-hit', 1);
			}
			
		};
				
		var setPlayerStatus = function () {
			
			var rows = c.DOM.getAll('#stat_list_content #ranks tbody tr');
			
			for (var i=0,il=rows.length; i<il; i++) {
				var row = rows[i], playerMessage = c.DOM.getOne('.sendMail', row);
				row.classList.add('uv-highscore-player');
				if (playerMessage) {
					var player = players.getElementById(playerMessage.getAttribute('data-playerid')), status;
					if (player && (status = player.getAttribute('status')) !== null) {
						c.DOM.getOne('.name', row).appendChild(c.DOM.text("("+status+")"));
						if (/v/.test(status)) row.classList.add('uv-highscore-vmode');
						if (/i/.test(status)) row.classList.add('uv-highscore-inactive-short');
						if (/I/.test(status)) row.classList.add('uv-highscore-inactive-long');
					}
				}
			}
			
		};
		
		return {'hit': hit};
		
	}());