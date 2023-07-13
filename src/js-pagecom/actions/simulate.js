
	c.actions['Simulate'] = (function () {
		
		var triggerEventFleetSimulation = function (element, event) {
			
			// This will be the initial click event, which needs to be canceled as the sendMessage will set the needed information
			// The action triggered by the sendMessage event will trigger a CustomEvent which will also call this function
			if (event instanceof MouseEvent) {
				if (event.target.classList.contains('uv-simulate-party')) {
					c.sendMessage('simulate', 'eventfleet', {'id': element.id, 'party': event.target.getAttribute('data-party')});
				}
				
				event.preventDefault();
				return false;
			}
			
			return true;
			
		};
		
		return {'triggerEventFleetSimulation': triggerEventFleetSimulation}
		
	}());