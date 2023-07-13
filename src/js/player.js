
	c.Player = (function ()
	{
		const saveResearch = function ()
		{
			let levels = {};

			if (c.Application.data.OGAMELEGACY) {
				let technologies = c.DOM.getAll('#buttonz .detail_button');

				for (let i = 0, il = technologies.length; i < il; i++) {
					const tech = technologies[i], level = /\d+/.exec(c.DOM.getOne('.level', tech).textContent);

					if (level && level.length > 0) {
						levels[tech.getAttribute('ref')] = level[0];
					}
				}
			} else {
				let technologies = c.DOM.getAll('#technologies .technology');

				for (let i = 0, il = technologies.length; i < il; i++) {
					const
						levelElement = technologies[i].querySelector('.level'),
						bonus = /\d+/.exec(levelElement.getAttribute("data-bonus"));

					let level = +levelElement.getAttribute("data-value");
					if (level >= 0) {
						if (bonus.length > 0) {
							level += +bonus[0];
						}
						levels[technologies[i].getAttribute("data-technology")] = level;
					}
				}
			}
			
			c.Store.set('playerResearch', c.Utils.merge(c.Store.data.playerResearch, levels), true);
			
		};
		
		return {saveResearch: saveResearch};
	}());