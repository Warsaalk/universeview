
	c.ft['FleetPageTarget'] = (function ()
	{
		const buttonClick = function (e)
		{
			setFleetTarget(this.parentNode.getAttribute('data-coords'), this.getAttribute('data-type'));
		};

		const init = () =>
		{
			let briefing = $$.querySelector("#fleet1");

			c.Template.get('fleetPagePlanets', function (html) {
				const planets = c.ft.PlanetList.getPlanets();
				for (let i=0, il=planets.length; i<il; i++) {
					const planet = planets[i];
					
					c.Template.get('fleetPagePlanet', function (li) {
						li.dataset.coords = planet.coords;
						li.dataset.name = planet.name;

						li.querySelector('.uv-fleetpage-link-planet').addEventListener('click', buttonClick);
						li.querySelector('.uv-fleetpage-link-debris').addEventListener('click', buttonClick);

						if (planet.moon === true) {
							let moonBtn = li.querySelector('.uv-fleetpage-link-moon');
							moonBtn.classList.add('exists');
							moonBtn.addEventListener('click', buttonClick)
						}
						
						html.lastChild.querySelector("#uv-fleetpage-list").appendChild(li);
					}, { 
						'name': planet.name,
						'coords': planet.coords
					});				
				}

				briefing.appendChild(html);
			}, {'planets': $$.getElementById('countColonies').textContent});

			setTimeout(activateFleetPage1Submit, 100);
		};
		
		const setFleetTarget = (coords, typeArg, missionArg) =>
		{
			const
				co = coords.split(':'),
				type = "undefined" === typeof typeArg ? 1 : +typeArg,
				mission = "undefined" === typeof missionArg ? 1 : +missionArg;
						
			if (c.Utils.checkPage('fleet2')) { // Legacy fleet page
				let galaxy = $$.getElementById('galaxy');

				galaxy.value = co[0];
				$$.getElementById('system').value = co[1];
				$$.getElementById('position').value = co[2];

				if (type === 3) {
					$$.getElementById('mbutton').click();
				} else if (type === 2) {
					$$.getElementById('dbutton').click();
				} else {
					$$.getElementById('pbutton').click();
				}

				galaxy.dispatchEvent(new Event('change'));
			} else if (c.Utils.checkPage('fleetdispatch')) { // OGame > 7 fleet page
				$$.getElementById('galaxy').value = co[0];
				$$.getElementById('system').value = co[1];
				$$.getElementById('position').value = co[2];

				c.PageCom.FleetDispatch.updateTarget(type);
			} else {
				c.fn.loadFleetDispatch({
					galaxy: co[0],
					system: co[1],
					position: co[2],
					type: type,
					mission: mission
				});
			}
		};

		const getSetTargetButton = (coords, eventlabel) =>
		{
			let selectTarget = $$.createElement('div');
			
			if (c.Store.data.features.fleetPage === "yes") {
				selectTarget.dataset.coords = coords;
				selectTarget.dataset.label = eventlabel;
				selectTarget.classList.add('uv-btn-fleet');
				selectTarget.addEventListener('click', function (e) {
					setFleetTarget(this.dataset.coords);
					e.stopPropagation();
					
					c.PageCom.GoogleAnalytics.sendEvent('fleetpagetarget', 'click', 'select_target_' + this.dataset.label);
				});
			}
			
			return selectTarget;
		};

		const activateFleetPage1Submit = () =>
		{
			const fleetPageAutosubmit = $$.getElementById('continueToFleet2');
			if (fleetPageAutosubmit) fleetPageAutosubmit.focus();
		};
		
		return {init: init, setFleetTarget: setFleetTarget, getSetTargetButton: getSetTargetButton};
		
	}());