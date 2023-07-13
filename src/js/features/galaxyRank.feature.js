	
	c.ft.GalaxyRank = (function ()
	{
        const init = () =>
		{
            const rows = $$.querySelectorAll('.cellAlliance, .cellPlayerName');
			
			for (let i=0,il=rows.length; i<il; i++) {
                const
					row = rows[i],
					playerRel = row.querySelector('[rel^="player"]');

				let rank = row.querySelector('.rank a');
				if (rank === null && playerRel !== null) {
					rank = $$.querySelector(`.tpd-tooltip #${playerRel.getAttribute("rel")} .rank a`);
				}

				if (rank) {
                    const node = rank.cloneNode(true);
					node.classList.add('uv-galaxy-rank', 'uv-element');

					row.appendChild(node);
				}
			}
		};
		
		return {init};
	}());