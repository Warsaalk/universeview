
	var Locale = (function() {

		var dict = {},
			active = 'EN',
			languages = {},
			mapping = {
				'CZ' : 'CS',
				'DE' : 'DE',
				'DK' : 'DA',
				'EN' : 'EN',
				'ES' : 'ES',
				'FR' : 'FR',
				'HR' : 'HR',
				'HU' : 'HU',
				'IT' : 'IT',
				'NL' : 'NL',
				'PL' : 'PL',
				'PT' : 'PT',
				'RO' : 'RO',
				'RU' : 'RU',
				'SE' : 'SV',
				'TR' : 'TR'
		};
		
		var init = function() {

			var community = c.Application.ogame.community.toUpperCase(), lang = mapping[community], dictionary = {};

			if (lang) {
				if (languages[lang]) {
                    dictionary = languages[lang];
					this.active = lang;
				}
			} else {
                dictionary = languages.EN; //Default UniverseView language
			}

            dictionary.fallback = languages.EN;
			
			this.dict = new Proxy(dictionary, {
				get: function (dictionary, label) {
					return dictionary[label] || dictionary.fallback[label] || "[" + label + "]";
				}
			})
		};
		
		var add = function(code, labels) {
			
			languages[code] = labels;
			
		};
		
		return {'init': init, 'add': add, 'dict': dict, 'active': active};
		
	}());

	c['Locale'] = Locale;
	