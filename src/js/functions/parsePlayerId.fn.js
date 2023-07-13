
	c.fn.extend('parsePlayerId', function( string ) {
		
		var result = string.match( /(player\d+)/ );
		
		return result == null ? "" : result[1];
	
	});