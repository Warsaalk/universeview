
	c.ft.MoonDestruction = (function ()
	{
		const init = () =>
		{
			const templateLocale = {
				'coords': c.Locale.dict.coords,
				'moonsize': c.Locale.dict.moonsize,
				'rips': c.Locale.dict.rips,
				'popchance': c.Locale.dict.moonpop,
				'ripchance': c.Locale.dict.riploss, 
				'destroy': c.Locale.dict.popmoon
			};
						
			c.Template.get('moonDestruction', block =>
			{
				document.body.appendChild(block);
				
				c.DOM.get('#uv_md_input').addEventListener('keyup', process);
				c.DOM.get('#uv_md_start').addEventListener('click', () =>
				{
					let co = c.DOM.get('#uv_md_co').textContent,
						rips = c.DOM.get('#uv_md_input').value;
						
					co = co.substring(1, co.length-1);
					co = co.split(':');
					
					c.PageCom.GoogleAnalytics.sendEvent('moondestruction', 'click', 'fleetpage');

					c.fn.loadFleetDispatch({galaxy: co[0], system: co[1], position: co[2], type: 3, mission: 9, am214: rips});
				});
				
			}, templateLocale);
		
		};

		const handleGalaxy = () =>
		{
			const moons = c.DOM.getAll(".galaxyRow .cellMoon .galaxyTooltip");
			for (let i=0, il=moons.length; i<il; i++) {
				const
					moon = moons[i],
					link = c.DOM.create('li'),
					amd = c.DOM.create('a'),
					split = c.DOM.create('div'),
					list = c.DOM.getOne('.ListLinks', moon);
				
				amd.dataset.moonsize = c.DOM.getOne('#moonsize', moon).textContent;
				amd.dataset.moonname = c.DOM.getOne('h1', moon).textContent;
				amd.dataset.coords	 = c.DOM.getOne('#pos-moon', moon).textContent;
				amd.style.cursor = 'pointer';
				amd.appendChild(c.DOM.text(c.Locale.dict.calcmd));
				amd.onclick = function() {
					const
						moonSize = this.dataset.moonsize,
						coords = this.dataset.coords;

					c.DOM.get('#uv_md_size').dataset.moonsize = moonSize;
					c.DOM.get('#uv_md_size').textContent = moonSize;
					c.DOM.get('#uv_md_co').textContent = coords;

					process();

					c.PageCom.JQuery.dialog('#uv_md', {'zIndex': 4000, 'draggable': true, 'title':c.Locale.dict.md + ' : ' + this.dataset.moonname});

					c.PageCom.GoogleAnalytics.sendEvent('moondestruction', 'click', 'open');
				};
				
				link.appendChild(amd);
				
				split.className = 'splitLine';
				
				list.appendChild(split);
				list.appendChild(link);
			}
		};
		
		const process = () =>
		{
			var size = c.DOM.get('#uv_md_size').dataset.moonsize,
				rips = c.DOM.get('#uv_md_input').value,
				info = calculate(parseInt(size), rips);

			c.DOM.get('#uv_md_moon').textContent = info.moon + ' %';
			c.DOM.get('#uv_md_rips').textContent = info.rips + ' %';

			c.PageCom.GoogleAnalytics.sendEvent('moondestruction', 'click', 'calculate');
		};

		const calculate = (size, ripCount) =>
		{
			const
				moon = (100 - Math.sqrt(size)) * Math.sqrt(ripCount),
				rips = Math.sqrt(size) / 2;

			return {moon: moon.toFixed(2), rips: rips.toFixed(2)};
		};
		
		return {init, handleGalaxy};
	}());