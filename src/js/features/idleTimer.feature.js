
    c.ft.IdleTimer = (function ()
    {
        const
            TYPE_PLANET = "planet",
            TYPE_MOON = "moon";

        const init = (objectID, objectType, objectCoords, objectTimeStamp) =>
        {
            updateObject(objectID, objectType, objectCoords, objectTimeStamp);

            // Get an initial update of the timers
            chrome.runtime.sendMessage({action: "idleTimer:getData"}, response => {
                updateTimers(response);
            });
        };

        const updateTimers = data =>
        {
            if (c.Application.ogame.timeStamp !== null) {
                const currentTimeStamp = (Date.now() + c.Application.getTimeStampDiff()) / 1000;

                let objects = data.objects, events = data.events;

                for (const objectID in objects) {
                    const object = objects[objectID];

                    // If there's an event fleet that has arrived on the coordinates of this object
                    // Set the object time to the event arrival time
                    if (events[object.coords] !== void 0) {
                        let i = events[object.coords].length;
                        while (i--) {
                            const eventObject = events[object.coords][i];

                            if (object.type === eventObject.type && currentTimeStamp >= eventObject.timeStamp) {
                                object.timeStamp = eventObject.timeStamp;

                                updateObject(objectID, object.type, object.coords, eventObject.timeStamp);

                                events[object.coords].splice(i, 1);
                            }
                        }
                    }

                    if (object.timeStamp !== null) {
                        const element = object.type === TYPE_MOON
                            ? $$.querySelector("a.moonlink[href*=\"" + objectID + "\"] .uv-idletimer-timer")
                            : $$.querySelector("#planet-" + objectID + " .planetlink .uv-idletimer-timer");

                        if (element) {
                            let tempTime = currentTimeStamp - object.timeStamp;

                            const
                                elapsedTime = tempTime < 0 ? 0 : tempTime,
                                minutes = Math.floor(elapsedTime / 60),
                                seconds = Math.floor(elapsedTime - minutes * 60),
                                expiredClass = element.classList.contains("expired");

                            if (minutes >= c.Store.data.idleTimer.expirationTime && c.Store.data.idleTimer.expirationTime > 0) {
                                if (!expiredClass) element.classList.add("expired");

                                element.dataset.idletimerTime = "";
                            } else {
                                if (expiredClass) element.classList.remove("expired");

                                let time = "" + minutes;

                                if (c.Store.data.idleTimer.showSeconds) {
                                    time += ":" + (seconds < 10 ? "0" : "") + seconds;
                                }

                                element.dataset.idletimerTime = time;
                            }
                        }
                    }
                }
            }
        };

        const updateObject = (objectID, objectType, objectCoords, objectTimeStamp) =>
        {
            chrome.runtime.sendMessage({action: "idleTimer:updateObject", data: {ID: objectID, type: objectType, coords: objectCoords, timeStamp: objectTimeStamp}});
        };

        const toggleFeature = () =>
        {
            const togglIndicator = $$.querySelector(".feature-option-state-btn");

            if (c.Store.data.features.idleTimer === "yes") {
                c.Store.data.features.idleTimer = "no";
                togglIndicator.classList.remove("active");

                c.DOM.remove(".uv-idletimer-timer");
            } else {
                c.Store.data.features.idleTimer = "yes";
                togglIndicator.classList.add("active");
            }

            c.Store.set("features", c.Store.data.features, true);
        };

        const addPlanetListTimers = planetList =>
        {
            let elements = planetList.querySelectorAll(".moonlink, .planetlink");

            for (let i=0, il=elements.length; i<il; i++) {
                let elementTimer = $$.createElement("span");

                elementTimer.classList.add("uv-idletimer-timer", "uv-element", "expired");
                elementTimer.dataset.idletimerTime = "";

                elements[i].appendChild(elementTimer);
            }
        };

        const addPlanetListFeatureToggle = planetList =>
        {
            let toggle = $$.createElement('div'),
                toggleLabel = $$.createElement('span'),
                toggleIndicator = $$.createElement('div');

            toggle.classList.add("uv-idletimer-toggle", "uv-element");
            toggleIndicator.classList.add("feature-option-state-btn");

            if (c.Store.data.features.idleTimer === "yes") {
                toggleIndicator.classList.add("active");
            }

            toggleLabel.appendChild($$.createTextNode(c.Locale.dict.idletimer_toggle_label));

            toggle.appendChild(toggleIndicator);
            toggle.appendChild(toggleLabel);
            toggle.addEventListener("click", toggleFeature);

            planetList.parentNode.appendChild(toggle);
        };

        const registerObjectIDCoordinates = planetList =>
        {
            let objects = [];

            const planets = planetList.querySelectorAll("div[id^=\"planet-\"]");
            for (let i=0, il=planets.length; i<il; i++) {
                const
                    coords = planets[i].querySelector('.planetlink .planet-koords').textContent.trim().slice(1, -1),
                    planetID = /planet-(\d+)/.exec(planets[i].id)[1];

                if (planetID) {
                    objects.push({
                        ID: planetID,
                        type: TYPE_PLANET,
                        coords: coords,
                        timeStamp: null
                    });

                    const
                        moon = planets[i].querySelector(".moonlink");
                    if (moon) {
                        objects.push({
                            ID: /&cp=(\d+)/.exec(moon.href)[1],
                            type: TYPE_MOON,
                            coords: coords,
                            timeStamp: null
                        });
                    }
                }
            }

            chrome.runtime.sendMessage({action: "idleTimer:registerObjects", data: objects});
        };

        const hitFromPlanetList = planetList =>
        {
            registerObjectIDCoordinates(planetList);
            addPlanetListTimers(planetList);
            addPlanetListFeatureToggle(planetList);
        };

        const hitFromEventList = eventList =>
        {
            const eventElements = eventList.querySelectorAll(".eventFleet");

            let events = {};

            for (let i=0, il=eventElements.length; i<il; i++) {
                const
                    eventElement = eventElements[i],
                    returning = eventElement.getAttribute("data-return-flight") === "true",
                    coords = eventElement.querySelector(returning ? '.coordsOrigin' : '.destCoords').textContent.trim().slice(1, -1);

                if (events[coords] === void 0) events[coords] = [];

                events[coords].push({
                    type: eventElement.querySelector((returning ? '.originFleet' : '.destFleet') + ' .moon') !== null ? TYPE_MOON : TYPE_PLANET,
                    timeStamp: parseInt(eventElement.getAttribute('data-arrival-time'))
                });
            }

            chrome.runtime.sendMessage({action: "idleTimer:updateEvents", data: events});
        };

        return {
            init: init,
            updateTimers: updateTimers,
            hitFromPlanetList: hitFromPlanetList,
            hitFromEventList: hitFromEventList
        };
    }());