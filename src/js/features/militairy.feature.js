
	c.ft['Militairy'] = (function () {

		var handle = function (selector, pid, timed) {
						
			if(c.Application.data.highScore != "") {
				
				var player = null;
				
				try {
				
					player = c.DOM.get('#' + pid, c.Application.data.highScore);// Firefox doesn't implement getElementById on xml doc -_-
					if (!player) throw "Damn you FireFox";
						
				} catch (e) {
				
					var playerTag = c.DOM.get('player', c.Application.data.highScore);
					for (var x=0,xl=playerTag.length; x<xl; x++) {
					
						if (playerTag[x].getAttribute('id') == pid) {
						
							player = playerTag[x];
							break;
								
						}
							
					}
						
				}
				
				if (player) {

					var templateData = {
						'score': c.Utils.formatNumber(player.getAttribute('score')),
						'shipcount': c.Utils.formatNumber(player.getAttribute('ships')||"0"), //When a player doesn't have the ships attribute, it means he has 0 ships
						'militairy': c.Locale.dict.militairy,
						'ships': c.Locale.dict.ships
					};
					
					c.Template.get('militairy', function (base) {
						
						var lists = c.DOM.getAll(selector);
						
						for (var i=0,il=lists.length; i<il; i++) {
							
							lists[i].appendChild(base.cloneNode(true));
							
						}
						
						c.PageCom.Tipped.refresh(".uv-t-player"+pid); //Normaly this isn't needed because highscore gets appended in less than 1 sec in chrome en less than 15 secs in FireFox
						
					}, templateData);
						
				}
				
			} else if ("undefined" === typeof timed || timed < 5) { //Max 5 tries
				//This is not a failsave 
				setTimeout(function () {
					handle(selector, pid, ++timed || 0); //++timed will evalute to NaN which the || will catch and send 0 instead
				}, 50);
				
			}
							
		};
		
		return {'handle': handle};

	}());	