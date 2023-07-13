
    context.ft.IdleTimer = (function ()
    {
        const ogameTabsURL = "https://" + config.ogameURL.replace("s{UID}", "*") + "/*";

        let objects = {}, events = {};

        const init = function ()
        {
            updateTimers();
        };

        const updateTimers = function ()
        {
            chrome.tabs.query({url: ogameTabsURL}, function (tabs) {
                for (let tab of tabs) {
                    chrome.tabs.sendMessage(tab.id, {
                        action: "idleTimer:UpdateTimers",
                        data: getData()
                    });
                }
            });

            setTimeout(updateTimers, 500);
        };

        const updateObject = function (objectData)
        {
            objects[objectData.ID] = {
                type: objectData.type,
                coords: objectData.coords,
                timeStamp: objectData.timeStamp
            };
        };

        const registerObjects = objectsData =>
        {
            for (let i=0, il=objectsData.length; i<il; i++) {
                if (objects[objectsData[i].ID] === void 0) {
                    updateObject(objectsData[i]);
                }
            }
        };

        const updateEvents = eventsData =>
        {
            events = eventsData;
        };

        const getData = () =>
        {
            return {
                objects: objects,
                events: events
            };
        };

        return {
            init: init,
            updateObject: updateObject,
            registerObjects: registerObjects,
            updateEvents: updateEvents,
            getData: getData
        };
    }());