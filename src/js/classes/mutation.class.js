
	c.Class.add('Mutation', function( options ) {
	
		options = options || {};
		
		var startDefined= typeof options.onStart === "function" ? true : false,
			failDefined	= typeof options.onFail === "function" ? true : false,
			withStyles 	= function( node ) {
			
				if ( options.trueStyles == null )
					return true;
				
				for ( attr in options.trueStyles ) {
				
					var val = options.trueStyles[attr];
					if( node.style[attr] != val )
						return false;
								
				}		
				return true;
				
			},
			withoutStyles= function( node ) {
			
				if ( options.falseStyles == null )
					return true;
				
				for ( attr in options.falseStyles ) {
				
					var val = options.falseStyles[attr];
					if( node.style[attr] == val )
						return false;
								
				}
				return true;
				
			};
		
		this.options = options;
		this.observe = function() {
			
			//First check if the page variable is set
			// this is a part of the url that you want to attach your observer to.
			if ("undefined" === typeof options.page || options.page == null) {
			
				if(failDefined) options.onFail("Please define the page you want to observe!");
				return ;
					
			}
			//Check required occurence caalback
			if (typeof options.onHit !== "function") {
			
				if(failDefined) options.onFail("You must defined the onHit callback function!");
				return ;
					
			}
			//Check required variables
			if ("undefined" === typeof options.target || "undefined" === typeof options.node) {
				if (failDefined) options.onFail("Please define all required variables (target, node)!");
				return;	
			}

			if ("undefined" !== typeof options.test && typeof options.test !== "function" ) {
				if (failDefined) options.onFail("The test property should be a callable function, which return true or false!");
				return;
			}
			
			if (("undefined" === typeof options.attribute || "undefined" === typeof options.value) && "undefined" === typeof options.test) {
				if (failDefined) options.onFail("Please define your attribute & value (or use the test function instead)!");
				return;
			}
		
			if ( c.Utils.checkPage( options.page ) ) { 
			
				if ( startDefined ) options.onStart(); //First callback
				
				//If target is element we use the element else the target should be an element id
				var optTarget = options.target,
					target = optTarget.nodeType ? optTarget : c.DOM.get( optTarget );
				
				//DOM api: http://www.w3.org/TR/dom/
				var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
				if ( MutationObserver ) { 

					var config 	= { childList : true },
						observer= new MutationObserver(function(mutations, instance){
					
						var observerOptions = instance.options; //Override garbage
						mutations.forEach(function(mutation){ 
						
							var nodes = mutation.addedNodes;
							for ( var ni=0, lenni=nodes.length; ni<lenni; ni++ ) {
								var currentNode = nodes[ni];
								if ( currentNode.nodeName == observerOptions.node.toUpperCase() ) {
									var match = false;
									if ("function" === typeof observerOptions.test)
										match = observerOptions.test.call(null, currentNode);
									else {
										var attribute = currentNode.getAttribute(observerOptions.attribute);
										match = observerOptions.value instanceof RegExp ? observerOptions.value.test(attribute) : attribute == observerOptions.value
									}
									if (match &&
										withStyles( currentNode ) &&
										withoutStyles( currentNode ) ) { 
										observerOptions.onHit( currentNode );
									}	
								}	
							}
								
						});	
						
					});
					
					try {
						
						observer.options = this.options;
						observer.observe( target, config );
							
					} catch(e) {
					
						if( e.code == 8 )	c.Utils.log( "The target you're trying to observe doesn't exist !" );
						else				c.Utils.log( e );
							
					}
						
				}
				
			}
			
		};
		
	});
	