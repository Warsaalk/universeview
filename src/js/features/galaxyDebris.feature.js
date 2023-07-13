	
	c.ft.GalaxyDebris = (function ()
	{
		const init = () =>
		{
            const rows = c.DOM.getAll('.cellDebris .tooltipRel');
			
			for (let i=0,il=rows.length; i<il; i++) {
                const
					row = rows[i].parentNode,
					link = rows[i],
					regex = /(\d+)/,
					debrisContent = row.getElementsByClassName('debris-content'),
					debris = {
						'metal': debrisContent[0] ? regex.exec(debrisContent[0].textContent.replace(/\./g,''))[0] : null,
						'crystal': debrisContent[1] ? regex.exec(debrisContent[1].textContent.replace(/\./g,''))[0] : null
					};
					
				for (const resource in debris) {
					if (debris[resource]) {
						const element = $$.createElement('div'), number = $$.createTextNode(c.Utils.shortenNumber(debris[resource]));
						element.appendChild(number);
						link.appendChild(element);
					}
				}
				
				link.classList.add('uv-galaxy-debris', 'uv-touched');
			}

			const expoDebrisBox = $$.querySelector(".expeditionDebrisSlotBox");
			if (expoDebrisBox) {
				let debrisDetails = expoDebrisBox.querySelector(".ListLinks");
				if (debrisDetails) {
					debrisDetails = debrisDetails.cloneNode(true);

					debrisDetails.classList.add("uv-element", "uv-galaxy-expo-debris");

					expoDebrisBox.insertBefore(debrisDetails, expoDebrisBox.querySelector("h3.title"));
				}
			}
		};
		
		return {init};
	}());