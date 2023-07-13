
	/*
	 * stt - SimpleTooltip
	 *
	 */

	let Tooltip = (function()
	{
		let cloud = document.getElementById("stt_Cloud") || document.createElement('div'), tooltipCount = 0;

		let defaultOptions = {
			position 	: "bottom",
			open		: "hover",
			close		: "outside",
			showTooltip	: function() {
				show(this);
			}
		};
		
		let init = function()
		{
			document.addEventListener("click", function (e) {
				for (let element = e.target; element; element = element.parentNode) {
					if ((element.className && element.classList.contains('stt_Tooltip')) || (element.hasAttribute && element.hasAttribute('stt-id')))
						return;
			  }
			  
			  close();
			});

			if (cloud.id !== "stt_Cloud") {
                cloud.id = 'stt_Cloud';
                document.body.appendChild(cloud);
            }
		};

		let create = function (parentId, contentId, options)
		{
			let parent	= document.getElementById(parentId),
				content	= document.getElementById(contentId),
				tooltip	= document.createElement('div'),
				arrow	= document.createElement('div'),
				stt_id	= "stt-" + tooltipCount;
			
			if (!content.parentNode.classList.contains('stt_Tooltip')) { // Don't create the tooltip again if it already exists
			
				tooltip.appendChild(arrow);
				tooltip.appendChild(content);
				
				tooltip.style.position 		= "absolute";
				tooltip.style.visibility	= "hidden"; //Hide element
				tooltip.style.zIndex 		= "99999"; //Hide element
				tooltip.className			= "stt_Tooltip"; //Hide element
				tooltip.id					= stt_id;
				content.style.display 		= "block"; //Makes it able to get it's dimensions
				arrow.className				= "arrow";
				
				tooltipCount++;
				
				cloud.appendChild(tooltip);
			} else {
				stt_id = content.parentNode.id; // Because it already exists we needs it's id
			}
			
			options = typeof options === 'undefined' ? {} : options;
			
			tooltip.setAttribute('stt-opt', JSON.stringify(options));
			parent.setAttribute('stt-id', stt_id);
			
			options = getOptions(options);
			
			if (options.open === 'click') {
				parent.addEventListener('click', options.showTooltip);
			} else {
				parent.addEventListener('mouseover', options.showTooltip);
			}
		};
		
		let getOptions = function (options)
		{
            let temp = {};
            for (let prop in defaultOptions) {
                temp[prop] = defaultOptions[prop];
            }
	
			if (typeof options === "object") {
				for (let prop in options) {
					temp[prop] = options[prop];
				}
			}
			
			return temp;
		};
		
		let show = function (parent)
		{
			let tooltip = document.getElementById(parent.getAttribute('stt-id'));
			
			if (tooltip.style.visibility !== 'visible' || tooltip.getAttribute('caller') !== parent.id) {
				let	options	= getOptions(JSON.parse(tooltip.getAttribute('stt-opt'))),
					arrow	= tooltip.children[0];
				
				setPosition(parent, tooltip, arrow, options);
				
				if (options.close === 'outside' && !tooltip.classList.contains('stt-close')) {
					tooltip.classList.add("stt-close");
				}
				
				tooltip.setAttribute('caller', parent.id); //Element who called the action
				tooltip.style.visibility = "visible"; //Show element
				
				//c.PageCom.GoogleAnalytics.sendEvent('tooltip', 'show', parent.id);
			}
		};
		
		let setPosition = function (parent, tooltip, arrow, options)
		{
			let contentWidth	= tooltip.offsetWidth,
				contentHeight	= tooltip.offsetHeight,
				parentWidth		= parent.offsetWidth, //Includes border width
				parentHeight	= parent.offsetHeight,
				parentOffset	= getGlobalOffset(parent),
				pos				= options.position;
			
			if (pos === "right" || pos === "left") {
				tooltip.style.left = (pos === "right" ? (parentOffset.left + parentWidth + 10) : (parentOffset.left - contentWidth - 10)) + "px";
				arrow.classList.add("arrow-stt-" + pos);
				
				let marginY = parentOffset.top - ((contentHeight / 2) - (parentHeight / 2)); //Normal
				
				if (marginY < 0) {
					arrow.style.marginTop = - ((arrow.offsetHeight / 2) - marginY) + "px"; //Adjust arrow
					marginY = 0; //If negatif margin is lager than global offset substract their difference
				}

				marginY -= parentOffset.scrollTop;
				marginY += "px";
				tooltip.style.top = marginY;
			} else {
				tooltip.style.top = (pos === "bottom" ? (parentOffset.top + parentHeight + 10) : (parentOffset.top - contentHeight - 10)) + "px";
				arrow.classList.add("arrow-stt-" + pos);
				
				tooltip.style.left = parentOffset.left - ((contentWidth / 2) - (parentWidth / 2)) + "px";
			}
		};
		
		let close = function (id)
		{
			if (id !== void 0) {
				document.getElementById(id).style.visibility = "hidden";
			} else {
				let outside = document.getElementsByClassName('stt-close');
				for (let i=0, il=outside.length; i<il; i++) {
					outside[i].style.visibility = "hidden";
				}
			}
		};
		
		return {init: init, create: create, show: show};
	}());
	