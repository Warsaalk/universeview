	
	chrome.runtime.sendMessage({action: "launch"}, function(response) {
		c.config = response.config;

		$$.documentElement.dataset.universeview = c.config.version;

		c.Application.launch();
	});
	
	// Set scripts which are needed to use the page window
	var ogameWindowScript = c.DOM.create('script');
	ogameWindowScript.textContent = '%pagecom%';
	(document.head||document.documentElement).appendChild(ogameWindowScript);
	
	c.Application.preload(['quicksearch.gif','spreading_but_small.gif','uv_icon.png']);