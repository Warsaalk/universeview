
	c.ft['Research'] = (function ()
	{
        let init = function () {};

        let hit = function (mutation)
		{
			// Try with the images in messages setting enabled
            let images = $$.querySelectorAll('.detail_list_el .research_image > img');
			if (images.length > 0) {
				readTechsFromImages(images);
			} else { // Try with the images in messages setting disabled
				let rows = $$.querySelectorAll('.detail_list[data-type="research"] li.detail_list_el');
				if (rows.length > 0) {
                    readTechsFromText(rows);
                }
			}
		};

        let readTechsFromImages = function (images)
		{
            let techs = {};
			
			for (let i=0, il=images.length; i<il; i++) {
                let image = images[i], techId= image.className.match(/research(\d{3})/)[1];
				
				techs[techId] = image.parentNode.parentNode.querySelector('.fright').textContent;
			}

            updatePlayerTechs(techs);
		};

        let readTechsFromText = function (rows)
		{
            let techs = {};

            for (let i=0, il=rows.length; i<il; i++) {
                let row = rows[i], techName = row.querySelector('.detail_list_txt').textContent;

                if (c.Store.data.techNamesReversed !== null && c.Store.data.techNamesReversed[techName] !== void 0) {
                    techs[c.Store.data.techNamesReversed[techName]] = row.querySelector('.fright').textContent;
                }
            }

            updatePlayerTechs(techs);
        };

        let updatePlayerTechs = function (technologies)
		{
            if (Object.keys(technologies).length > 0) {
                let playerName = $$.querySelector('.detail_txt span[class^=status_abbr_]').textContent.trim();

                chrome.runtime.sendMessage({action: "API", call: "universe:updatePlayerResearch", parameters: [playerName, technologies]});
            }
		};

        let handle = function (selector, technologies, planetCount)
		{
			c.Template.get('research', function (base)
			{
				let lists = $$.querySelectorAll(selector);

				for (let i=0, il=lists.length; i<il; i++) {
					lists[i].appendChild(base.cloneNode(true));
				}
			}, {
                count: planetCount,
                astro: c.fn.calculatePlanets(technologies[124]) || "?",
                spio: technologies[106] || "?",
                w: technologies[109] || "?",
                s: technologies[110] || "?",
                a: technologies[111] || "?",
                c: technologies[115] || "?",
                i: technologies[117] || "?",
                h: technologies[118] || "?",
                planets: c.Locale.dict.planets,
                combat: c.Locale.dict.combat,
                drives: c.Locale.dict.drives,
                espio: c.Locale.dict.espionage
            });

			//UvUtils.RefreshTooltip('class', "player"+PlPid);
		};
		
		return {init: init, hit: hit, handle: handle};
	}());	