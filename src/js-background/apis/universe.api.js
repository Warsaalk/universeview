
    class UniverseApi
    {
        constructor ()
        {
            this.data = {};
            this.buildCache = {};
            this.changeCache = {};
            this.updateCache = {};
            this.origin = {};
        }

        initialize (UID)
        {
            let self = this;

            this.buildCache[UID] = {players: null, planets: null};
            this.origin[UID] = "https://" + config.ogameURL.replace("{UID}", UID);

            if (this.data[UID] === void 0) {
                chrome.storage.local.get("UNIVERSE_XML_" + UID, function (items) {
                    if (items["UNIVERSE_XML_" + UID] === void 0) {
                        self.buildXML(UID);
                    } else {
                        let parser = new DOMParser(),
                            doc = parser.parseFromString(items["UNIVERSE_XML_" + UID], "application/xml");

                        if (doc.getElementsByTagName("parsererror").length > 0) {
                            self.buildXML(UID);
                        } else {
                            self.data[UID] = doc;
                            self.checkForUpdates(UID);
                        }
                    }
                });
                this.changeCache[UID] = false;
            } else {
                this.checkForUpdates(UID);
            }

            this.checkForChanges(UID);
        }

        createDocument (UID, playersTimestamp, planetsTimestamp)
        {
            let universeDoc = document.implementation.createDocument("", "universe", null);

            universeDoc.documentElement.id = UID;
            universeDoc.documentElement.setAttribute('playersTimestamp', playersTimestamp);
            universeDoc.documentElement.setAttribute('planetsTimestamp', planetsTimestamp);

            this.data[UID] = universeDoc;
            this.updateCache[UID] = (new Date()).getTime();
        }

        buildXML (UID)
        {
            let self = this;

            this.buildCache[UID] = {players: null, planets: null};

            let handleXML = function () {
                if (self.buildCache[UID].players !== null && self.buildCache[UID].planets !== null) {
                    console.time("buildXML");

                    self.createDocument(UID, self.buildCache[UID].players.documentElement.getAttribute("timestamp"), self.buildCache[UID].planets.documentElement.getAttribute("timestamp"));
                    self.updatePlayers(UID);
                    self.updatePlanets(UID);

                    console.timeEnd("buildXML");
                }
            };

            // Fetch the players XML
            OgameAPI.fetch(OgameAPI.PLAYERS, function (doc) {
                self.buildCache[UID].players = doc;
                handleXML();
            }, false, this.origin[UID]);

            // Fetch the planets XML
            OgameAPI.fetch(OgameAPI.PLANETS, function (doc) {
                self.buildCache[UID].planets = doc;
                handleXML();
            }, false, this.origin[UID]);
        }

        async updatePlayers (UID)
        {
            if (this.buildCache[UID].players !== null) {
                let players = this.buildCache[UID].players.getElementsByTagName("player"), updateTime = this.buildCache[UID].players.documentElement.getAttribute("timestamp");
                for (let i = 0, il = players.length; i < il; i++) {
                    let player = this.data[UID].getElementById(players[i].id);
                    if (player === null) {
                        player = this.data[UID].createElement("player");
                        player.id = players[i].id;

                        this.data[UID].documentElement.appendChild(player);
                    }

                    player.setAttribute("name", players[i].getAttribute("name"));
                    player.setAttribute("status", players[i].getAttribute("status") || "");
                    player.setAttribute("alliance", players[i].getAttribute("alliance") || "");
                    player.setAttribute("updated", updateTime);
                }

                this.buildCache[UID].players = null;

                let playersToDelete = this.data[UID].querySelectorAll('player:not([updated="' + updateTime + '"])');
                for (let i = 0, il = playersToDelete.length; i < il; i++) {
                    playersToDelete[i].parentNode.removeChild(playersToDelete[i]);
                }

                this.data[UID].documentElement.setAttribute('playersTimestamp', updateTime);

                this.saveChangesForUID(UID);
            }
        }

        updatePlayersXML (UID)
        {
            let self = this;

            // Fetch the players XML
            OgameAPI.fetch(OgameAPI.PLAYERS, function (doc) {
                const
                    newTime = doc.documentElement.getAttribute("timestamp"),
                    currentTime = self.data[UID].documentElement.getAttribute('playersTimestamp');

                // Double check the last document update
                if (newTime > currentTime) {
                    self.buildCache[UID].players = doc;
                    self.updatePlayers(UID);
                }
            }, false, this.origin[UID]);
        }

        async updatePlanets (UID)
        {
            if (this.buildCache[UID].planets !== null) {
                let planets = this.buildCache[UID].planets.getElementsByTagName('planet'), updateTime = this.buildCache[UID].planets.documentElement.getAttribute("timestamp");
                for (let y = 0, yl = planets.length; y < yl; y++) {
                    let planet = this.data[UID].getElementById("p" + planets[y].id);
                    if (planet === null) {
                        planet = this.data[UID].createElement("planet");
                        planet.id = "p" + planets[y].id;

                        let player = this.data[UID].getElementById(planets[y].getAttribute("player"));
                        if (player) {
                            player.appendChild(planet);
                        }
                    }

                    planet.setAttribute("name", planets[y].getAttribute("name"));
                    planet.setAttribute("coords", planets[y].getAttribute("coords"));
                    planet.setAttribute("updated", updateTime);

                    let moon = planet.firstElementChild;
                    if (planets[y].hasChildNodes()) {
                        if (moon === null) {
                            moon = this.data[UID].createElement("moon");

                            planet.appendChild(moon);
                        }

                        moon.id = "m" + planets[y].childNodes[0].id;
                        moon.setAttribute("name", planets[y].childNodes[0].getAttribute("name"));
                        moon.setAttribute("size", planets[y].childNodes[0].getAttribute("size"));
                    } else if (moon !== null) {
                        planet.removeChild(planet.firstElementChild);
                    }
                }

                this.buildCache[UID].planets = null;

                let planetsToDelete = this.data[UID].querySelectorAll('planet:not([updated="' + updateTime + '"])');
                for (let i = 0, il = planetsToDelete.length; i < il; i++) {
                    planetsToDelete[i].parentNode.removeChild(planetsToDelete[i]);
                }

                this.data[UID].documentElement.setAttribute('planetsTimestamp', updateTime);

                this.saveChangesForUID(UID);
            }
        }

        updatePlanetsXML (UID)
        {
            let self = this;

            // Fetch the players XML
            OgameAPI.fetch(OgameAPI.PLANETS, function (doc) {
                const
                    newTime = doc.documentElement.getAttribute("timestamp"),
                    currentTime = self.data[UID].documentElement.getAttribute('planetsTimestamp');

                // Double check the last document update
                if (newTime > currentTime) {
                    self.buildCache[UID].planets = doc;
                    self.updatePlanets(UID);
                }
            }, false, this.origin[UID]);
        }

        checkForUpdates (UID)
        {
            let now = (new Date()).getTime();
            // Check every 30 minutes for XML changes
            if (this.updateCache[UID] === void 0 || (this.updateCache[UID] + (1800 * 1000)) <= now) {
                let playersLastUpdate = new Date(this.data[UID].documentElement.getAttribute('playersTimestamp') * 1000),
                    planetsLastUpdate = new Date(this.data[UID].documentElement.getAttribute('planetsTimestamp') * 1000);

                let self = this;

                OgameAPI.check(OgameAPI.PLAYERS, function (xhr) {
                    if (xhr.status === 200) {
                        let lastModified = (new Date(xhr.getResponseHeader('Last-Modified'))).getTime();
                        if (lastModified > playersLastUpdate.getTime()) {
                            self.updatePlayersXML(UID);
                        }
                    }
                }, this.origin[UID]);

                OgameAPI.check(OgameAPI.PLANETS, function (xhr) {
                    if (xhr.status === 200) {
                        let lastModified = (new Date(xhr.getResponseHeader('Last-Modified'))).getTime();
                        if (lastModified > planetsLastUpdate.getTime()) {
                            self.updatePlanetsXML(UID);
                        }
                    }
                }, this.origin[UID]);

                this.updateCache[UID] = now;
            }
        }

        checkForChanges (UID)
        {
            if (this.changeCache[UID] !== false) {
                this.saveChangesForUID(UID);
            }
        }

        clearDatabase (UID)
        {
            chrome.storage.local.remove("UNIVERSE_XML_" + UID);
            delete this.data[UID];
            delete this.buildCache[UID];
        }

        updatePlayerResearch (UID, callback, playerName, technologies)
        {
            let player = this.data[UID].querySelector('player[name="' + playerName + '"]');
            if (player) {
                player.setAttribute("technologies", JSON.stringify(technologies));

                this.changeCache[UID] = (new Date()).getTime();
            }
        }

        updatePlanetsForSystem (UID, systemInfo)
        {
            let self = this;
            function handleMoon(planet, moonInfo)
            {
                if (!planet.hasChildNodes()) {
                    if (moonInfo !== false) {
                        let moon = self.data[UID].createElement("moon");
                        moon.id = "m" + moonInfo.id;
                        moon.setAttribute("name", moonInfo.name);
                        moon.setAttribute("size", moonInfo.size);

                        planet.appendChild(moon);
                    }
                } else {
                    if (moonInfo === false) {
                        planet.removeChild(planet.firstElementChild); // Remove the moon if it doesn't exist anymore
                    } else {
                        // Update mooninfo
                        planet.firstElementChild.setAttribute("name", moonInfo.name);
                        planet.firstElementChild.setAttribute("size", moonInfo.size);
                    }
                }
            }

            if (this.data[UID] === void 0) {
                this.createDocument(UID, 0, 0);
            }

            for (let i=0, il=systemInfo.planets.length; i<il; i++) {
                let planet = this.data[UID].querySelector('[coords="' + systemInfo.planets[i].coords + '"]'); // Select using the coords so we can remove deleted planets
                if (planet) {
                    // Remove the planet if it's destroyed, removed or the player ID doesn't match
                    if (
                        systemInfo.planets[i].pid === 99999 ||
                        (systemInfo.planets[i].pid === null && systemInfo.planets[i].id === null) ||
                        systemInfo.planets[i].pid !== parseInt(planet.parentNode.id)
                    ) {
                        planet.parentElement.removeChild(planet);
                        planet = null;
                    } else {
                        handleMoon(planet, systemInfo.planets[i].moon);

                        // Update planet info
                        planet.setAttribute("name", systemInfo.planets[i].name);
                        planet.setAttribute("coords", systemInfo.planets[i].coords);
                    }
                }

                if (planet === null && systemInfo.planets[i].id !== null && systemInfo.planets[i].pid !== null && systemInfo.planets[i].pid !== 99999) {
                    let planet = this.data[UID].createElement("planet");
                    planet.id = "p" + systemInfo.planets[i].id;
                    planet.setAttribute("name", systemInfo.planets[i].name);
                    planet.setAttribute("coords", systemInfo.planets[i].coords);

                    handleMoon(planet, systemInfo.planets[i].moon);

                    let playerId = systemInfo.planets[i].pid, player = this.data[UID].getElementById(playerId);
                    if (player === null) { // Create the player tag if it doesn't exist
                        player = this.data[UID].createElement("player");
                        player.id = playerId;
                        player.setAttribute("name", systemInfo.players[playerId].name);
                        player.setAttribute("status", systemInfo.players[playerId].status || "");
                        player.setAttribute("alliance", systemInfo.players[playerId].alliance || "");
                        this.data[UID].documentElement.appendChild(player);
                    }

                    player.appendChild(planet);
                }
            }

            this.changeCache[UID] = (new Date()).getTime();
        }

        findPlanetsByPlayers (UID, callback, players, galaxy, system)
        {
            function xmlToObject (element, playerID) {
                let coords = element.getAttribute("coords").split(':');
                return {
                    id: element.getAttribute("id").substr(1),
                    moon: element.hasChildNodes(),
                    coords: element.getAttribute("coords"),
                    galaxy: coords[0],
                    system: coords[1],
                    position: coords[2],
                    pid: playerID
                };
            }

            for (let playerId in players) {
                players[playerId].planets = [];

                if (this.data[UID] !== void 0) {
                    let player = this.data[UID].getElementById(playerId);
                    if (player) {
                        for (let y = 0, yl = player.childNodes.length; y < yl; y++) {
                            players[playerId].planets.push(xmlToObject(player.childNodes[y], playerId));
                        }

                        players[playerId].technologies = player.hasAttribute("technologies") ? JSON.parse(player.getAttribute("technologies")) : {};
                    }
                }
            }

            callback({
                players: players,
                galaxy: galaxy,
                system: system
            });
        }

        findAndUpdatePlanetsBySystemInfo (UID, callback, systemInfo)
        {
            this.updatePlanetsForSystem(UID, systemInfo);
            this.findPlanetsByPlayers(UID, callback, systemInfo.players, systemInfo.galaxy, systemInfo.system);
        }

        saveChanges ()
        {
            for (let UID in this.changeCache) {
                if (this.changeCache[UID] !== false) {
                    this.saveChangesForUID(UID);
                }
            }
        }

        saveChangesForUID (UID)
        {
            this.changeCache[UID] = false;
            chrome.storage.local.set({
                ["UNIVERSE_XML_" + UID]: (new XMLSerializer()).serializeToString(this.data[UID])
            });
        }
    }