	
	c.ft.Raid = (function ()
	{
		let hitEspionagePreview = function (mutation)
		{
        	let plunder = mutation.querySelectorAll(c.Application.data.OGAMELEGACY ? '.msg_content .compacting .fright[title*="page=fleet1"]' : '.msg_content .compacting .fright[title*="component=fleetdispatch"]');
			for (let i=0, il=plunder.length; i<il; i++) {
				if (plunder[i].title) {
                    let compacting = $$.createElement('div'), span = $$.createElement('span');
					
					span.classList.add('ctn','ctn4');
                    span.appendChild(c.DOM.fromHTML(plunder[i].title.replace(/<br\/?>/g, ' | ')));

                    const cargoLinks = span.querySelectorAll("a");

                    for (let i=0, il=cargoLinks.length; i<il; i++) {
                    	const
							match = /&am(\d+)=(\d+)/.exec(cargoLinks[i].href); // match[1] => ship ID, match[2] => ship count
						if (match && match.length >= 3) {
							if (match[1] === "202") {
								const pathFinderCount = Math.ceil(parseInt(match[2]) / 2), extraPathFinder = $$.createElement('a'), extraPathFinderCount = c.Store.data.espionageRaid[219];

								extraPathFinder.href = cargoLinks[i].href.replace(/am202=\d+/, 'am219=' + (pathFinderCount + extraPathFinderCount));
								extraPathFinder.appendChild($$.createTextNode(`${c.Store.data.techNames[219]}: ${c.Utils.formatNumber(pathFinderCount)}`));
								extraPathFinder.setAttribute('data-extra-count', "+" + extraPathFinderCount);

								span.appendChild(extraPathFinder);

								span.appendChild($$.createTextNode(" | "));

								const reaperCount = Math.ceil(parseInt(match[2]) / 2), extraReaper = $$.createElement('a'), extraReaperCount = c.Store.data.espionageRaid[218] ;

								extraReaper.href = cargoLinks[i].href.replace(/am202=\d+/, 'am218=' + (reaperCount + extraReaperCount));
								extraReaper.appendChild($$.createTextNode(`${c.Store.data.techNames[218]}: ${c.Utils.formatNumber(reaperCount)}`));
								extraReaper.setAttribute('data-extra-count', "+" + extraReaperCount);

								span.appendChild(extraReaper);
							}

							cargoLinks[i].href = cargoLinks[i].href.replace(/am\d+=\d+/, `am${match[1]}=${(parseInt(match[2]) + c.Store.data.espionageRaid[match[1]])}`);
							cargoLinks[i].setAttribute('data-extra-count', "+" + c.Store.data.espionageRaid[match[1]]);
						}
					}

					compacting.appendChild(span);
					compacting.classList.add('compacting', 'uv-element', 'uv-raid-wrapper', 'clearfix');

					if (c.Application.data.AGO) {
						plunder[i].parentNode.parentNode.appendChild(compacting);
					} else {
						plunder[i].parentNode.parentNode.insertBefore(compacting, plunder[i].parentNode.nextElementSibling);
					}
				}
			}
		};
		
		return {'hitEspionagePreview': hitEspionagePreview};
	}());