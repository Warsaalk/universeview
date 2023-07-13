
	var Menu = (function()
	{
		let menuInstance = null;

		var build = function() {
			
			var templateLocale = c.Locale.dict, websiteLocale = "";

            if ("undefined" !== typeof c.config.apps.website.communities[c.Application.ogame.community]) {
                websiteLocale = c.config.apps.website.communities[c.Application.ogame.community];
            }

			var templateData = {
					
				'version': c.config.version,
				'UvUpdateServer': c.Store.data.serverUrl || "",
				'UvAccessServer': c.Store.data.serverCode || "",
				'wikiServer': c.Application.ogame.universe,
				'wikiLang': c.Application.ogame.language,
				'uvw_locale': websiteLocale,
				'mission_1': c.Store.data.missionNames["1"],
                'mission_2': c.Store.data.missionNames["2"],
                'mission_3': c.Store.data.missionNames["3"],
                'mission_4': c.Store.data.missionNames["4"],
                'mission_5': c.Store.data.missionNames["5"],
				'mission_6': c.Store.data.missionNames["6"],
				'mission_7': c.Store.data.missionNames["7"],
				'mission_8': c.Store.data.missionNames["8"],
				'mission_9': c.Store.data.missionNames["9"],
                'mission_15':c.Store.data.missionNames["15"],
				'ship_202':c.Store.data.techNames["202"],
				'ship_203':c.Store.data.techNames["203"],
				'ship_218':c.Store.data.techNames["218"],
				'ship_219':c.Store.data.techNames["219"]
			};
			
			templateData = c.Utils.merge( templateLocale, templateData );	
			
			c.Template.get( 'menu', function( menu )
			{
				if ( menu !== false ) {
					menuInstance = menu

					$$.body.appendChild(menuInstance);

					for (const featureName in c.Store.data.features) {
					    if (c.Store.data.features[featureName] === "yes") {
					        const featureElement = c.DOM.getOne("#UvFeatureMenu [data-feature=\"" + featureName + "\"]");
					        if (featureElement) {
					            featureElement.classList.add('active');
                            }
                        }
                    }

					//Clear localStorage
					c.DOM.get('#UvClearLocalStorage').onclick = function()
					{
						c.Store.del(['features','hello','planetOption','quickSearch','serverUrl','serverCode','spreading','spreadingCurrent','stats','techNames','updatePlayers','updatePlanets','version','favourites','ogameSettings','eventNotification']);

                        chrome.runtime.sendMessage({action: "API", call: "universe:clearDatabase"});

						c.PageCom.GoogleAnalytics.sendEvent('menu', 'click', 'storage_clear');
					};
					
					var GOpt = c.DOM.getAll( 'input[name="UVGalaxyOption"]' );
				
					for ( var i=0,ilen=GOpt.length; i<ilen; i++ ) {
						
						GOpt[ i ].onchange = function(){
							
							var UVgopt = c.DOM.getOne( 'input[name="UVGalaxyOption"]:checked' ).value,
								UVgoptList = c.DOM.getAll( '#UvGeneralList > li' );
							
							for ( var y=0,ylen=UVgoptList.length; y<ylen; y++ ) {
								
								UVgoptList[ y ].classList.remove( 'selected' );
								
							}
							
							c.DOM.get( '#UvGeneral'+UVgopt ).classList.add( 'selected' );
							c.Store.set("planetOption", UVgopt);
							c.PageCom.GoogleAnalytics.sendEvent('menu', 'change', UVgopt);
								
						}
							
					}
					/*
					c.DOM.get('#UvSetUpdateServer').onclick = function() {
						
						c.Store.set("serverUrl", c.DOM.get( '#UvUpdateServer' ).value );
							
					};
					c.DOM.get('#UvSetAccessServer').onclick =  function() {
					
						c.Store.set("serverCode", c.DOM.get( '#UvAccessServer' ).value );
							
					};
					*/
					var UpGal = c.DOM.get( '.UvUpdateGalaxy' );
					
					for ( var i=0,ilen=UpGal.length; i<ilen; i++ ) {
						
						UpGal[ i ].onclick = function() {
                            // TODO:: Automatically update the XML in background script
                            //c.Application.updatePlanetDatabase();
							c.PageCom.GoogleAnalytics.sendEvent('menu', 'click', 'db_planet_update');
						}
							
					}
					
					var features = c.DOM.getAll('.UvFeatureButton');
					for (var i=0, ilen=features.length; i<ilen; i++) {
						features[i].addEventListener('click', changeOption);
					}

					/* State & Number change listeners */
					const stateButtons = c.DOM.getAll('.feature-option-state-btn[data-option]');
					for (let i=0, ilen=stateButtons.length; i<ilen; i++) {
						if (c.Store.getDataByPath(stateButtons[i].getAttribute('data-option')) === true) {
							stateButtons[i].classList.add('active');
						}
						stateButtons[i].addEventListener('click', changeState)
					}

					const numberInputs = c.DOM.getAll('.feature-option-number[data-option]');
					for (let i=0, ilen=numberInputs.length; i<ilen; i++) {
						numberInputs[i].value = parseInt(c.Store.getDataByPath(numberInputs[i].getAttribute('data-option')));
						numberInputs[i].addEventListener('keyup', changeValue);
						numberInputs[i].addEventListener('mouseup', changeValue);
					}

					// Close menu actions
					const closeElements = $$.querySelectorAll("#uv-menu-background, #uv-menu-close");
					for (let i=0, il=closeElements.length; i<il; i++) {
						closeElements[i].addEventListener('click', closeMenu);
					}

					// Donate button
					const donateBtn = $$.querySelector(".donate-cr-icon");
					donateBtn.addEventListener('click', function () {
						if (this.parentNode.classList.contains("active")) {
							this.parentNode.classList.remove("active");
						} else {
							this.parentNode.classList.add("active");
						}
					});

					/* Event notifications */
                    c.PageCom.Tipped.create('.en-icon-mission, .uv-tipped-info', null, { hook: 'topmiddle', radius: {size:3}, skin: 'cloud'});
				}
								
			}, templateData );
			
		};
		
		var changeOption = function()
		{
			var item = this.parentNode, option = item.dataset.feature;
			
			if (c.Store.data.features[option] === "yes") {
				c.Store.data.features[option] = "no";
                item.classList.remove('active');
			} else {
				c.Store.data.features[option] = "yes";
				item.classList.add('active');
			}
			c.Store.set("features", c.Store.data.features, true);
		};

		const changeState = function ()
		{
			const newState = !this.classList.contains('active');

			if (newState === true) 	this.classList.add('active');
			else					this.classList.remove('active');

			c.Store.setByPath(this.getAttribute('data-option'), newState);
		};

		const changeValue = function ()
		{
			let value = parseInt(this.value);

			if (isNaN(value)) 	value = this.getAttribute('data-default');
			if (value < 0) 		value = 0;

			c.Store.setByPath(this.getAttribute('data-option'), value);
		};

		const closeMenu = function ()
		{
			$$.body.removeChild(menuInstance);

			menuInstance = null;
		};
		
		return {build: build, changeOption: changeOption};
		
	}());
	
	c['Menu'] = Menu;
	