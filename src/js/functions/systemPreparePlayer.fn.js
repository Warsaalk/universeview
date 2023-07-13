
    function tooltipBaseStopPropagation (e) { e.stopPropagation() }

	c.fn.systemPreparePlayer = function (playerId, playerName, planetRowIndex)
    {
        const planetRow = $$.getElementById(`galaxyRow${planetRowIndex}`);

        let listLinks = planetRow.querySelector(`#player${playerId} > .ListLinks`),
            isTooltip = false;

        if (listLinks === null) {
            listLinks = $$.querySelector(`.tpd-tooltip #player${playerId} > .ListLinks`);
            isTooltip = true;
        }

        c.Template.get('playerTooltipBase', function (base) {
            if (listLinks) {
                base.addEventListener('click', tooltipBaseStopPropagation, false);
                listLinks.parentNode.classList.add('uv-t-player-' + playerId);
                listLinks.appendChild(base);

                if (isTooltip) {
                    c.PageCom.Tipped.refresh();
                }
            }
        }, {
            loading:  c.Locale.dict.loadplanets,
            loader: c.Application.getPath('img/loader.gif'),
            'class': 'uv-player-' + playerId,
            pclass: 'uv-player-planets',
            rclass: 'uv-player-research',
            hclass: 'uv-player-highscore',
            name: playerName,
            pid: playerId
        });
    };