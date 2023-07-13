
	c.Class = (function()
	{
		let add = function(label, classObject)
		{
			this[label] = classObject;
		};
		
		return {add: add};
	}());