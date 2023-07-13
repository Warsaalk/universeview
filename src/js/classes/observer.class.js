
	c.Class.Observer = function (targetArgument)
	{
		let target = "string" === typeof targetArgument ? $$.querySelector(targetArgument) : targetArgument;

        let idList = [], idCallback = [];
        let classList = [], classCallback = [];
        let nodeList = [], nodeParent = [], nodeCallback = [];

        let queue = (callback, mutation) =>
		{
			callback.call(null, mutation);
		};

        let mutationCallback = mutations =>
		{
			let idQueue = {}, classQueue = {}, nodeQueue = {};

			for (let i=mutations.length; i--;) {
				for (let n=mutations[i].addedNodes.length; n--;) {
					if (mutations[i].addedNodes[n].nodeType === 1){ //Only observe elements
						for (let x=idList.length; x--;) {
							if (mutations[i].addedNodes[n].id === idList[x]) {
								idQueue[x] = mutations[i].addedNodes[n];
							}
						}
						for (let x=classList.length; x--;) {
							if (mutations[i].addedNodes[n].classList.contains(classList[x])) {
								classQueue[x] = mutations[i].addedNodes[n];
							}
						}
						for (let x=nodeList.length; x--;) {
							if (mutations[i].addedNodes[n].nodeName.toUpperCase() === nodeList[x].toUpperCase()) {
								if (mutations[i].target.classList.contains(nodeParent[x]) || mutations[i].target.id === nodeParent[x]) {
									nodeQueue[x] = mutations[i].addedNodes[n];
								}
							}
						}
					}
				}
			}
			//Queue found ID elements
			for (let index in idQueue) {
				queue(idCallback[index], idQueue[index]);
			}
			//Queue found Class elements
			for (let index in classQueue) {
				queue(classCallback[index], classQueue[index]);
			}
			//Queue found nodes
			for (let index in nodeQueue) {
				queue(nodeCallback[index], nodeQueue[index]);
			}
		};
		
		// Init MutationObserver
        let mutationObserver = new MutationObserver(mutationCallback);
		mutationObserver.observe(target, {childList: true, subtree: true});
		
		// Public methods 
		this.listenToId = (id, callback) =>
		{
            let check = $$.getElementById(id);
			if (check) {
				queue(callback, check);
			}

			idList.push(id);
			idCallback.push(callback);
		};
		
		this.listenToClass = (className, callback) =>
		{
            let check = $$.getElementsByClassName(className);
			if (check.length > 0) {
				for (let i=check.length; i--;) {
					queue(callback, check[i]);
				}
			}
			
			classList.push(className);
			classCallback.push(callback);
		};
		
		this.listenToElement = (nodeName, parent, callback) =>
		{
            let checkClass = $$.getElementsByClassName(parent);
			if (checkClass.length > 0) {
				for (let i=checkClass.length; i--;) {
					if (checkClass[i].nodeName.toUpperCase() === nodeName.toUpperCase()) {
						queue(callback, checkClass[i]);
					}
				}
			}
			let checkId = $$.getElementById(parent);
			if (checkId && checkId.nodeName.toUpperCase() === nodeName.toUpperCase()) {
				queue(callback, checkId);
			}
			
			nodeList.push(nodeName);
			nodeParent.push(parent);
			nodeCallback.push(callback);			
		};
	};