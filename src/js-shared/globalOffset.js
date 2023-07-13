
    let getGlobalOffset = function (el)
    {
        let x = 0, y = 0, xs = 0, ys = 0;

        while (el && el.nodeName !== "BODY") {
            x += el.offsetLeft;
            y += el.offsetTop;
            xs += el.scrollLeft;
            ys += el.scrollTop;
            //el = el.offsetParent;
            el = el.parentNode;
        }

        return {left: x, top: y, scrollLeft: xs, scrollTop: ys}
    };