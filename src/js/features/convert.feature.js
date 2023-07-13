	
	c.ft.Convert = (function ()
	{
		let crRegex = /(cr\-[a-z]{2}\-\d{1,3}\-[0-9a-z]{40})/;
		
		let hitFromMessages = function (apiButton)
		{
			let btn = $$.createElement('a');

			btn.href = getOGotchaConvertUrl(apiButton);
			btn.target = '_blank';
			btn.classList.add('uv-convert-ogotcha', 'uv-element');
			btn.addEventListener('click', function (e) {
				c.PageCom.GoogleAnalytics.sendEvent('convert', 'click', 'ogotcha');
			});

            apiButton.parentNode.parentNode.appendChild(btn);
		};

        let getOGotchaConvertUrl = function (apiBtn)
		{
            let apiKey = crRegex.exec(apiBtn.title)[1],
				apiCom = apiKey.split('-')[1], //Community
				urlbase = c.config.apps.ogotcha.url;
		
			if ("undefined" !== typeof c.config.apps.ogotcha.communities[apiCom]) {
				urlbase += c.config.apps.ogotcha.communities[apiCom];
			}

			return urlbase + '?CR_KEY=' + apiKey;
		};
		
		return {crRegex: crRegex, hitFromMessages: hitFromMessages};
	}());