
	c.Style = (function()
	{
		const styles = ['uv-skin-events','uv-skin-galaxy','uv-skin-messages'];

		const init = function()
		{
			for (let i=0,il=styles.length; i<il; i++) {
				$$.body.classList.add(styles[i]);
			}
		};

		const improveGalaxy = function()
		{
			const rows = $$.querySelectorAll('.row');

			for (let i=0, il=rows.length; i<il; i++) {
				const row = rows[i];
				if (row.querySelector('.microplanet.planetEmpty'))
					row.classList.add('uv-skin-g-empty');
				if (row.querySelector('.vacation'))
					row.classList.add('uv-skin-g-vmode');
			}
		};

		return {init: init, improveGalaxy: improveGalaxy};
	}());
	