
	var Check = (function() {
		
		var statistics = function() {
			
			/* UniverseView stats */
			
			var stats = new Date().toDateString();
			
			if( c.Store.data.stats != stats ){
				
				c.PageCom.GoogleAnalytics.sendPageView({
					'dp' : '/universeview_daily',
					'cd1' : c.config.type,
					'cd2' : c.Application.ogame.universe,
					'cd3' : c.Store.data.planetOption,
					'cd4' : c.Application.ogame.playerId,
					'cd5' : c.Application.ogame.playerName,
					'cd6' : new Date().toString(),
					'cd7' : c.Application.data.AGO
				});
				
				c.Store.set( 'stats', stats );
				
			}
			
		};
		
		var ogameSettings = function() {
			
			var now = new Date(),
				storedDate 	= new Date( c.Store.data.updateOgame ).getTime(),
				difference	= ( now.getTime() - storedDate ) / ( 1000 * 60 * 60 * 24 * 7 ); //7 days
				
			if( storedDate == 0 || difference > 7 ){
			
				OgameAPI.fetch(OgameAPI.SERVER, function (xml) {
					
					c.Store.data.ogameSettings.number 		= c.DOM.getOne( 'number' , xml).textContent;
					c.Store.data.ogameSettings.language 	= c.DOM.getOne( 'language' , xml).textContent;
					c.Store.data.ogameSettings.timezone 	= c.DOM.getOne( 'timezone' , xml).textContent;
					c.Store.data.ogameSettings.domain 		= c.DOM.getOne( 'domain' , xml).textContent;
					c.Store.data.ogameSettings.version 		= c.DOM.getOne( 'version' , xml).textContent;
					c.Store.data.ogameSettings.speed 		= parseInt( c.DOM.getOne( 'speed' , xml).textContent );
					//c.Store.data.ogameSettings.speedFleet 	= parseInt( c.DOM.getOne( 'speedFleet' , xml).textContent );
					c.Store.data.ogameSettings.speedFleetPeaceful 	= parseInt( c.DOM.getOne( 'speedFleetPeaceful' , xml).textContent );
					c.Store.data.ogameSettings.speedFleetWar 		= parseInt( c.DOM.getOne( 'speedFleetWar' , xml).textContent );
					c.Store.data.ogameSettings.speedFleetHolding 	= parseInt( c.DOM.getOne( 'speedFleetHolding' , xml).textContent );
					c.Store.data.ogameSettings.speedFleet 	= c.Store.data.ogameSettings.speedFleetWar;
					c.Store.data.ogameSettings.galaxies 	= parseInt( c.DOM.getOne( 'galaxies' , xml).textContent );
					c.Store.data.ogameSettings.systems 		= parseInt( c.DOM.getOne( 'systems' , xml).textContent );
					c.Store.data.ogameSettings.acs 			= parseInt( c.DOM.getOne( 'acs' , xml).textContent );
					c.Store.data.ogameSettings.rapidFire 	= parseInt( c.DOM.getOne( 'rapidFire' , xml).textContent );
					c.Store.data.ogameSettings.defToTF 		= parseInt( c.DOM.getOne( 'defToTF' , xml).textContent );
					c.Store.data.ogameSettings.debrisFactor = parseFloat( c.DOM.getOne( 'debrisFactor' , xml).textContent );
					c.Store.data.ogameSettings.repairFactor = parseFloat( c.DOM.getOne( 'repairFactor' , xml).textContent );
					c.Store.data.ogameSettings.newbieProtectionLimit= parseInt( c.DOM.getOne( 'newbieProtectionLimit' , xml).textContent );
					c.Store.data.ogameSettings.newbieProtectionHigh = parseInt( c.DOM.getOne( 'newbieProtectionHigh' , xml).textContent );
					c.Store.data.ogameSettings.bonusFields 	= parseInt( c.DOM.getOne( 'bonusFields' , xml).textContent );
					c.Store.data.ogameSettings.donutGalaxy 	= parseInt( c.DOM.getOne( 'donutGalaxy' , xml).textContent );
					c.Store.data.ogameSettings.donutSystem 	= parseInt( c.DOM.getOne( 'donutSystem' , xml).textContent );
					
					
					c.Store.set( 'ogameSettings', c.Store.data.ogameSettings, true );
					c.Store.set( 'updateOgame', now.toUTCString() );
					
				});
				
			}
			
		};
		
		var ogameLocalization = function() {
			
			var now = new Date(),
				storedDate 	= new Date(c.Store.data.updateOgame).getTime(),
				difference	= (now.getTime() - storedDate) / (1000 * 60 * 60 * 24 * 7); //7 days
				
			if (storedDate == 0 || difference > 7) {
			
				OgameAPI.fetch(OgameAPI.LOCALE, function (xml) {
													
					var techObject = {},
					techsChild= c.DOM.get('techs', xml),
					techNames = techsChild.length > 0 ? c.DOM.get('name', techsChild[0]) : false;
				
					if (techNames !== false) {
						
						for (var i=0,ilen=techNames.length; i<ilen; i++) {
						
							var techId 	= techNames[i].getAttribute('id'),
								techName= techNames[i].textContent;
							
							techObject[techId] = techName;
								
						};
						
						c.Store.set("techNames", techObject, true);
						c.Store.set("updateOgame", now.toUTCString());
					}

                    var missionObject = {},
                        missionsChild= c.DOM.get('missions', xml),
                        missionNames = missionsChild.length > 0 ? c.DOM.get('name', missionsChild[0]) : false;

                    if (missionNames !== false) {

                        for (var i=0,ilen=missionNames.length; i<ilen; i++) {

                            var missionId 	= missionNames[i].getAttribute('id'),
                                missionName= missionNames[i].textContent;

                            missionObject[missionId] = missionName;

                        };

                        c.Store.set("missionNames", missionObject, true);
                        c.Store.set("updateOgame", now.toUTCString());
                    }
					
				});
				
			}
			
		};
		
		var planetDatabase = function() {
			
			if (c.Store.data.planetOption == 'uvs' || c.Store.data.planetOption == 'idb') {
				
				var ajaxUvsReceived = function( html ) {
													
					if ( html == "true" ) {
						//UvNotification.Show( UvNotification.Update() ); //TODO:: Implement Notification system
						debugger;
					}
					
				};
				
				var ajaxUvsError = function() { 
					
					console.warn("Fail dbTimeCheck");
					
				};
				
				OgameAPI.check(OgameAPI.PLAYERS, function (xhr) {
						
					if (xhr.status === 200) {
							
						var lastModified = xhr.getResponseHeader('Last-Modified'),
							storedDate = c.Store.data.updatePlanets;
							
						if ( storedDate != lastModified || storedDate == "" ) {
						
							if ( c.Store.data.planetOption == 'uvs' ) {
							
								new XHR({
									
									url: c.Store.data.serverUrl+"universeview.php",
									method: "post",
									data: { 
										"dbTimeCheck" 	: true, 
										"uni" 			: c.Application.ogame.universe,
										"secret"		: c.Store.data.serverCode,
										"id"			: c.Application.ogame.playerId,
										"dbDateCheck" 	: lastModified 
									},
									response: "text",
									onReceived: ajaxUvsReceived,
									onError: ajaxUvsError
									
								});
								
							} else {
							
								c.Template.get('notificationDBPlanetUpdate', function (notification) {
																		
									var notificationId = c.Notifications.add(notification.outerHTML, function () {
										c.Store.set("updatePlanets", lastModified);
									});
									c.DOM.get('#uv_update_notification').addEventListener('click', function (e) {
										// TODO:: Automatically update the XML in background script
										//c.Application.updatePlanetDatabase();
										c.Notifications.remove(notificationId);
										c.PageCom.GoogleAnalytics.sendEvent('notifications', 'click', 'db_planet_update');
									});
									
								}, {
									'text': c.Locale.dict.updateidb,
									'update': c.Locale.dict.menu_updategal
								});
								
							}
										
						}
									
					}
						
				});
					
			}
		
		};

		var version = function() {
				
			//Check version change
			if ( c.Store.data.version != c.config.version ) {
								
				c.Template.get('notificationUniverseViewVersion', function (notification) {
					
					var notificationId = c.Notifications.add(notification.outerHTML, function () {
						c.Store.set('version', c.config.version);
					});
					c.DOM.get('#uv_version_notification').addEventListener('click', function (e) {
						c.Notifications.remove(notificationId);
					});
					
				}, {
					'updated': c.Locale.dict.uvupdated,
					'versiontext': c.Locale.dict.version,
					'version': c.config.version,
					'updateinfo': c.Locale.dict.updateinfo,
					'url': c.config.board
				});
				
			}
			
		};	
	
		var hello = function() {
	
			//Check hello version change (information/wiki popup)
			if ( c.Store.data.hello != c.config.helloVersion ) {
			
				c.Store.set('hello', c.config.helloVersion );
				debugger;
				//$('#universeViewLoad').trigger( 'click' );
					
			}
	
		};
		
		return { 'statistics': statistics, 'ogameSettings': ogameSettings, 'ogameLocalization': ogameLocalization, 'planetDatabase': planetDatabase, 'version': version, 'hello': hello };
		
	}());
	
	c['Check'] = Check;