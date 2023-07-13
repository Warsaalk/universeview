
	var MenuButton = (function() {
		var build = function (leftMenu) {
			var menu = leftMenu, websiteLocale = "";

            if ("undefined" !== typeof c.config.apps.website.communities[c.Application.ogame.community]) {
                websiteLocale = c.config.apps.website.communities[c.Application.ogame.community];
            }

			c.Template.get('menuButton', function (button) {
				if (button !== false) {
					menu.appendChild(button);
					
					c.Utils.log( 'UniverseView Debug: HTML Added - Menu button' );
					c.DOM.get('#universeView').onclick = function() {
						c.Menu.build(); //Build universeview menu
						c.PageCom.GoogleAnalytics.sendEvent('menu', 'click', 'open');
					};
				}
			}, {icon: c.Application.getPath('img/uv_icon.png'), uvw_locale: websiteLocale});
		};
			
		return {build: build};
	}());
	
	c['MenuButton'] = MenuButton;
	