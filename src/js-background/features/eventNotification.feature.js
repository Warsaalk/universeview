
    var EventNotification = function (id, type, arrival, arrivalOriginal, returning, relation, flightData, offset, serverID, tabID, windowID) {
        this.id = id;
        this.type = type;
        this.arrival = arrival;
        this.arrivalOriginal = arrivalOriginal;
        this.returning = returning;
        this.relation = relation;
        this.flightData = flightData;
        this.offset = offset;
        this.serverID = serverID;
        this.tabID = tabID;
        this.windowID = windowID;
    };

    EventNotification.prototype.getNotificationTitle = function (servers) {
        return servers[this.serverID].dict.title
            .replace('{community}', servers[this.serverID].community.toUpperCase())
            .replace('{universe}', servers[this.serverID].universe);
    };

    EventNotification.prototype.getNotificationContent = function (servers) {
        const time = servers[this.serverID].useComputerTime === true
            ? (new Date(this.arrival)).toLocaleTimeString() + ' ' + (new Date(this.arrival)).toLocaleDateString()
            : (new Date(this.arrivalOriginal)).toLocaleTimeString(undefined, {timeZone: servers[this.serverID].timezone}) + ' ' + (new Date(this.arrivalOriginal)).toLocaleDateString(undefined, {timeZone: servers[this.serverID].timezone});

        let message = this.returning ? servers[this.serverID].dict.returning : servers[this.serverID].dict.arriving[this.relation];
        return message
            .replace('{mission}', servers[this.serverID].dict.missions[this.type])
            .replace('{coords}', this.returning ? this.flightData.originCoords + ' ' + this.flightData.originFleet : this.flightData.destCoords + ' ' + this.flightData.destFleet   )
            .replace('{time}', time);
    };

    EventNotification.prototype.getNotificationIcon = function () {
        var icon = 'chrome/content/img/';
        switch (this.type) {
            case 1: icon += 'dn-type-1'; break;
            case 2: icon += 'dn-type-2'; break;
            case 3: icon += 'dn-type-3'; break;
            case 4: icon += 'dn-type-4'; break;
            case 5: icon += 'dn-type-5'; break;
            case 6: icon += 'dn-type-6'; break;
            case 7: icon += 'dn-type-7'; break;
            case 8: icon += 'dn-type-8'; break;
            case 9: icon += 'dn-type-9'; break;
            case 15: icon += 'dn-type-15'; break;
            default: icon += 'logo-48';
        }
        if (this.relation == 2 && (this.type == 1 || this.type == 2 || this.type == 6 || this.type == 9)) {
            icon += '-h';
        }
        return icon + '.png';
    };

    EventNotification.prototype.getNotificationOpen = function (servers) {
        return servers[this.serverID].dict.open
            .replace('{community}', servers[this.serverID].community.toUpperCase())
            .replace('{universe}', servers[this.serverID].universe);
    };

    EventNotification.prototype.getNotificationUniverseURL = function (servers) {
        return `https://${this.getUniverseDomain(servers)}/game/index.php?page=overview`;
    };

    EventNotification.prototype.getUniverseDomain = function (servers) {
        return `s${servers[this.serverID].universe}-${servers[this.serverID].community}.ogame.gameforge.com`;
    };

    context.ft.EventNotification = (function () {

        var events = {}, servers = {};

        var notificationClickEvent = function (notificationId) {
            if (undefined !== typeof events[notificationId]) {
                var event = events[notificationId];
                chrome.tabs.get(event.tabID, function (tab) {
                    if (tab === undefined) {
                        chrome.tabs.create({url: event.getNotificationUniverseURL(servers)});
                    } else {
                        chrome.tabs.update(event.tabID, {active: true, highlighted: true}, function (tab) {
                            if (tab === undefined) {
                                chrome.tabs.create({windowId: event.windowID, url: event.getNotificationUniverseURL(servers)});
                            } else {
                                chrome.windows.update(event.windowID, {focused: true});
                            }
                        });
                    }
                });
                chrome.notifications.clear(notificationId);
            }
        };

        chrome.alarms.clearAll();
        chrome.alarms.onAlarm.addListener(function (alarm) {
            var event = events[alarm.name], notificationOptions = {
                type: "basic",
                title: event.getNotificationTitle(servers),
                message: event.getNotificationContent(servers),
                iconUrl: event.getNotificationIcon(),
                priority: 2
            };

            if (config.type === "CRX") {
                notificationOptions.buttons = [{'title': event.getNotificationOpen(servers)}];
            }

            chrome.tabs.get(event.tabID, function (tab) {
                if (tab === undefined) {
                    var pattern = 'https://' + event.getUniverseDomain(servers) + '/game/*';
                    chrome.tabs.query({url: pattern}, function (result) {
                        if (result !== undefined && result.length > 0) {
                            chrome.notifications.create(alarm.name, notificationOptions);
                        }
                    });
                } else {
                    chrome.notifications.create(alarm.name, notificationOptions);
                }
            });
        });

        chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex) {
            if (buttonIndex === 0) {
                notificationClickEvent.call(this, notificationId);
            }
        });

        chrome.notifications.onClicked.addListener(notificationClickEvent);

        var addEvent = function (eventArg, serverID, tabID, windowID) {
            var event = events[eventArg.id] = new EventNotification(
                eventArg.id,
                eventArg.type,
                eventArg.arrival,
                eventArg.arrivalOriginal,
                eventArg.returning,
                eventArg.relation,
                eventArg.flightData,
                eventArg.offset,
                serverID,
                tabID,
                windowID
            );

            //console.log((new Date(event.arrival)).toLocaleTimeString(undefined, {timeZone: servers[event.serverID].timezone}) + ' ' + (new Date(event.arrival)).toLocaleDateString(undefined, {timeZone: servers[event.serverID].timezone}));
            //console.log((new Date(event.arrivalOriginal)).toLocaleTimeString(undefined, {timeZone: servers[event.serverID].timezone}) + ' ' + (new Date(event.arrivalOriginal)).toLocaleDateString(undefined, {timeZone: servers[event.serverID].timezone}));

            chrome.alarms.create(event.id, {
                when: event.arrival - (eventArg.offset * 1000) // 60000 // Arrival time minus 60 seconds
            });
        };

        var updateEvents = function (data, tabID, windowID) {
            // Set server data if it doesn't exist yet
            if (servers[data.server.id] === undefined) {
                servers[data.server.id] = data.server;
            }

            // This is a dynamic value, change when not equal
            if (servers[data.server.id].useComputerTime !== data.server.useComputerTime) {
                servers[data.server.id].useComputerTime = data.server.useComputerTime;
            }

            // Remove or update the existing notifications
            for (var id in events) {
                if (undefined === data.events[id]) {
                    chrome.alarms.clear(id);
                    delete events[id];
                } else {
                    if (events[id].arrival != data.events[id].arrival) {
                        addEvent(data.events[id], data.server.id, tabID, windowID); // Override alarm with new arrival time
                    }
                    delete data.events[id];
                }
            }

            // Add the new (remaining) notifications
            for (var id in data.events) {
                addEvent(data.events[id], data.server.id, tabID, windowID);
            }
        };

        return {
            updateEvents: updateEvents
        };

    }());