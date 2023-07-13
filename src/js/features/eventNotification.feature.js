
    c.ft.EventNotification = (function ()
    {
        const hitFromEventList = eventList =>
        {
            let data = {
                events: {},
                server: {
                    id: c.Application.ogame.community + c.Application.ogame.universeNumber,
                    community: c.Application.ogame.community,
                    universe: c.Application.ogame.universeNumber,
                    timezone: c.Store.data.ogameSettings.timezone,
                    locale: c.Locale.active,
                    useComputerTime: c.Store.data.eventNotification.useComputerTime === true,
                    dict: {
                        title: c.Locale.dict.dnotification_title,
                        arriving: [ // 0 = own, 1 = neutral, 2 = hostile
                            c.Locale.dict.dnotification_arriving_friendly,
                            c.Locale.dict.dnotification_arriving_neutral,
                            c.Locale.dict.dnotification_arriving_hostile
                        ],
                        returning: c.Locale.dict.dnotification_returning,
                        missions: c.Store.data.missionNames,
                        open: c.Locale.dict.dnotification_open
                    }
                }
            };

            let eventElements = eventList.querySelectorAll('.eventFleet:not(.partnerInfo),.allianceAttack'), eventCount = 0;

            for (let i=0, il=eventElements.length; i<il; i++) {
                let
                    eventElement = eventElements[i],
                    eventType = parseInt(eventElement.getAttribute('data-mission-type')),
                    uniqueID = data.server.id + '-' + eventElement.id,
                    countdown = c.Application.data.OGAMELEGACY ? eventElement.querySelector('.countDown') : eventElement.querySelector('.countDown span'),
                    relation = 1,
                    returning = eventElement.getAttribute('data-return-flight') === "true";

                // OGame v7 emptied the ID on the eventElement so we'll create our own one
                /*if (!c.Application.data.OGAMELEGACY) {
                    let
                        clock = eventElement.querySelector('.arrivalTime').textContent.trim(),
                        origin = eventElement.querySelector('.coordsOrigin').textContent.trim(),
                        destination = eventElement.querySelector('.destCoords').textContent.trim();

                    const
                        clockRegex = /\d+:\d+:\d+/.exec(clock),
                        originRegex = /\d+:\d+:\d+/.exec(origin),
                        destinationRegex = /\d+:\d+:\d+/.exec(destination);

                    if (clockRegex && clockRegex.length > 0) clock = clockRegex[0];
                    if (originRegex && originRegex.length > 0) origin = originRegex[0];
                    if (destinationRegex && destinationRegex.length > 0) destination = destinationRegex[0];

                    uniqueID = `${data.server.id}-${clock}-${origin}-${destination}`;
                }*/

                if (countdown) {
                    // 0 = own, 1 = neutral, 2 = hostile
                    if (countdown.classList.contains('friendly')) relation = 0;
                    else if (countdown.classList.contains('hostile')) relation = 2;
                }

                if (hasEventNotificationPermission(eventType, relation, returning)) {
                    const arrivalTimestamp = parseInt(eventElement.getAttribute('data-arrival-time'));

                    data.events[uniqueID] = {
                        id: uniqueID,
                        type: eventType,
                        arrival: arrivalTimestamp * 1000 - c.Application.getTimeStampDiff(), // Convert PHP timestamp the Javascript timestamp
                        arrivalOriginal: arrivalTimestamp * 1000,
                        returning: returning,
                        elementID: eventElement.id,
                        relation: relation,
                        flightData: {
                            originFleet: eventElement.querySelector('.originFleet').textContent.trim(),
                            originCoords: eventElement.querySelector('.coordsOrigin').textContent.trim(),
                            destFleet: eventElement.querySelector('.destFleet').textContent.trim(),
                            destCoords: eventElement.querySelector('.destCoords').textContent.trim()
                        },
                        offset: getEventNotificationOffset(eventType)
                    };
                }

                eventCount++; // Also increase if the event is not permitted
            }

            if (eventCount > 0) {
                sendEventsToNotificationService(data);
            }
        };

        const getEventNotificationOffset = type =>
        {
            if (undefined !== c.Store.data.eventNotification.notificationOffset[type]) {
                return c.Store.data.eventNotification.notificationOffset[type];
            }
            return c.config.notifications.defaultOffset;
        };

        const hasEventNotificationPermission = (type, relation, returning) =>
        {
            if (relation === 2) {
                return false; // These event are not permitted as they could be exploited to create automated attack warnings
            }

            const storeKey = getRelationStoreKey(relation, returning);

            if (undefined !== c.Store.data.eventNotification[storeKey] && undefined !== c.Store.data.eventNotification[storeKey][type]) {
                return c.Store.data.eventNotification[storeKey][type];
            }

            return false;
        };

        const getRelationStoreKey = (relation, returning) =>
        {
            if (relation === 0) {
                if (returning)  return "ownReturning";
                else            return "ownArriving";
            } else {
                return "otherArriving";
            }
        };

        const sendEventsToNotificationService = data =>
        {
            chrome.runtime.sendMessage({action: "events", data: data});
        };

        return {hitFromEventList: hitFromEventList};
    }());