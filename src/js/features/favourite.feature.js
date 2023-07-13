	
	c.ft.Favourite = (function()
	{
		const init = box =>
		{
			$$.body.classList.add("uv-feature-favourite");

            const favList = c.Store.data.favourites.favs.sort(c.Helper.CoordinateSorter.run);
			
			c.Template.get('favouriteButton;favouriteTooltip', (button, tooltip) =>
			{
				box.appendChild(button);
				box.appendChild(tooltip);
				
				c.Utils.log('UniverseView Debug: HTML Added - Favourite');
				
				for (let i=0, ilen=favList.length; i<ilen; i++) {
					addPlanet('#UvFavs', favList[i].coords);
				}
				
				Tooltip.create('UvFav', 'UvFavList', {position: "right", open: "click"});
			}, {});
		};

		const addPlanet = (selector, coords) =>
		{
			const element = c.DOM.get(selector);
			
			const
				favouriteItem = c.DOM.create('li'),
				deleteFavourite = c.DOM.create('span');
			
			deleteFavourite.classList.add( 'btn-del' );
			deleteFavourite.addEventListener('click', function (event) {
				delFavourite(this.parentNode.dataset.coords);
				
				event.stopPropagation(); 
				
				c.PageCom.GoogleAnalytics.sendEvent('favourite', 'click', 'delete');
			});
			
			//favouriteItem.id = coords;
			favouriteItem.dataset.coords = coords;
			favouriteItem.addEventListener('click', function() { c.fn.loadGalaxy(this); });
			favouriteItem.appendChild(c.DOM.text(coords));
			favouriteItem.appendChild(deleteFavourite);
			favouriteItem.appendChild(c.ft.FleetPageTarget.getSetTargetButton(coords, 'favourite'));
			
			element.appendChild(favouriteItem);
		};

		const addFavourite = coords =>
		{
			const favs = c.Store.data.favourites.favs;
				
			if (c.Utils.objectValue(favs, 'coords', coords) === -1) {
				favs.push({"coords": coords});
				c.Store.set('favourites', c.Store.data.favourites, true);
				addPlanet('#UvFavs', coords);
			}
		};

		const delFavourite = coords =>
		{
			const coordsIndex = c.Utils.objectValue(c.Store.data.favourites.favs, 'coords', coords);
			if (coordsIndex >= 0) c.Store.data.favourites.favs.splice(coordsIndex, 1);
			
			c.DOM.remove('#UvFavs li[data-coords="' + coords + '"]');
			c.Store.set('favourites', c.Store.data.favourites, true);
		};

		const handleGalaxy = (galaxy, system) =>
		{
            const positions = c.DOM.get('.cellPosition'), activePosition = /system=(\d{1,3})&position=(\d{1,2})/.exec(window.location.href);
			
			for (let i=0, ilen=positions.length; i<ilen; i++) {
                const position = positions[i];
				
				position.style.cursor = "pointer";
				position.dataset.coords = [galaxy, system, position.textContent.trim()].join(':');
				position.appendChild(getAddFavouriteButton());
				
				if (activePosition && position.textContent.trim() === activePosition[2] && system === activePosition[1]) {
					if (!position.classList.contains('UvFavSelected')) position.classList.add('UvFavSelected');
				}
			}
		};

		const addFavouriteStopPropagation = function (e)
		{
            addFavourite(this.parentNode.dataset.coords);
            e.stopPropagation();

            c.PageCom.GoogleAnalytics.sendEvent('favourite', 'click', 'add_favourite');
        };

		const getAddFavouriteButton = () =>
		{
            const favouriteAdd = $$.createElement('div');
			
			if (c.Store.data.features.favourites === "yes") {
				favouriteAdd.classList.add('uv-btn-add');
				favouriteAdd.title = c.Locale.dict.addtofavs;
				favouriteAdd.addEventListener('click', addFavouriteStopPropagation);
			}
			
			return favouriteAdd;
		};
		
		return {init, handleGalaxy, getAddFavouriteButton};

	}());	