
	var DOM = (function(){
		
		var get = function( query, context ) {
			
			var obj	= context || document,
				type= /^./.exec(query);
			
			if (type) {
				
				switch ( type[0] ) {
				case '.':
					return obj['getElementsByClassName'](query.substr(1));
				case '#':
					return obj['getElementById'](query.substr(1));
				default:
					return obj['getElementsByTagName'](query);
				}
				
			}
			
		};
		
		var getOne = function( selector, context ) {
			return (context || document).querySelector( selector );
		};
		
		var getAll = function( selector, context ) {	
			return (context || document).querySelectorAll( selector );			
		};
		
		//Functions
		var create = function( element ) {
			return document.createElement( element );
		};
		
		var text = function( text ) { 
			return document.createTextNode( text ); 
		};
		
		var clear = function( query ) {
		
			var list = c.DOM.getAll( query );
			if ( list ) {
				for ( var i=0, il=list.length; i<il; i++ ) {
					while ( list[i].firstChild ) {
						list[i].removeChild( list[i].firstChild );
					}
				}
			}
		
		};
		
		const remove = query =>
		{
			let list = [].slice.call($$.querySelectorAll(query)); //Convert non-live nodeList to Array
			if (list) {
				while (list.length > 0) {
					let child = list[0], parent = child.parentNode;

					parent.removeChild(child);

					if (child===list[0]) list.shift();
				}
			}
		};

		/**
		 * Parse HTML to DOM
		 * @param html
		 * @returns {DocumentFragment}
		 */
		var fromHTML = function (html) {
			var regexTags = /(<[a-zA-Z1-9]+(?:\s+[a-zA-Z-]+(?:=(?:".*?"|'.*?'))?)*\s*\/?>|<\/[a-zA-Z1-9]+>)/gm, // Match tags (opening incl. attributes & closing)
				regexAttr = /(?:\s+([a-zA-Z-]+)(?:=(?:"(.*?)"|'(.*?)'))?)/gm; // Match attributes

			var singletons = ['area','base','br','col','command','embed','hr','img','input','keygen','link','meta','param','source','track','wbr']; // HTML 5 - 6/9/2016

			html = html.replace(/&nbsp;/g, '\u00A0'); // TODO: add more encoding fixes

			var parts = html.split(regexTags), fragment = document.createDocumentFragment(), lastElement = fragment;
			for (var i=0, il=parts.length; i<il; i++) {
				if (parts[i].length > 0) {
					var tag = parts[i].match(/^<(\/)?([a-zA-Z1-9]+)/);
					if (tag && tag.length > 0) { // Process tag
						if (tag[1] === undefined) { // Opening tag
							var element = document.createElement(tag[2]); // Create tag

							var attributes = [];
							while ((attributes = regexAttr.exec(parts[i])) !== null) { // Loop attributes
								var attribute = document.createAttribute(attributes[1]);
								if (attributes[2] !== undefined || attributes[3] !== undefined) {
									attribute.value = attributes[2] || attributes[3]; // Set attribute value
								}
								element.setAttributeNode(attribute); // Add attribute
							}
							lastElement.appendChild(element); // Append our element

							if (singletons.indexOf(tag[2]) === -1) { //Singletons can't have child elements
								lastElement = element; // Set last element as current element
							}
						} else { // Closing tag
							lastElement = lastElement.parentNode; // Closing tag means we need to go 1 level up again
						}
					} else {
						lastElement.appendChild(document.createTextNode(parts[i])); // Append content to the last element
					}
				}
			}

			return fragment;
		};
		
		//Wait for an element to exist in the document
		var wait = function (optionsArg) {
		
			var options = optionsArg || {},
				fail	= typeof options.fail === "function" ? true : false,
				jq		= options.jquery === null ? false : options.jquery,
				delay	= 0; //Used to increase the delay with every call, useful for slow low-end devices
			
			if (typeof options.done !== "function" || options.forId === null) {
				
				if (fail)	options.fail("Make sure you define the done callback and forId!");
				else 		return;
				
			}
							
			function check() {

				var ready = false;
				if ( ( jq && window.jQuery ) || ( !jq && document.readyState === 'complete' ) ) { 			
					ready = true;
				}
				
				var el = c.DOM.get( '#' + options.forId );
				
				if ( el === null ) {
						
					if( ready ) {
						
						if ( fail ) options.fail( "The id doesn't exist in this document!" );
						else 		return;
						
					} else setTimeout(function () {check.call();}, ++delay );
			
				} else {
						
					options.done( el );
				
				}
			}
			
			check();
		
		};
		
		var getGlobalOffset = function( el ) {
		
			var x = 0, 
				y = 0, 
				xs = 0, 
				ys = 0;
			
			while (el && el.nodeName != "BODY") {
		
				x += el.offsetLeft;
				y += el.offsetTop;
				xs += el.scrollLeft;
				ys += el.scrollTop;
				//el = el.offsetParent;
				el = el.parentNode;
					
			}
			
			return { left: x, top: y, scrollLeft: xs, scrollTop: ys };
				
		};
		
		return {'get': get, 'getOne': getOne, 'getAll': getAll, 'create': create, 'text': text, 'clear': clear, 'remove': remove, fromHTML: fromHTML, 'wait': wait, 'getGlobalOffset': getGlobalOffset};
		
	}());
	
	c['DOM'] = DOM;
	