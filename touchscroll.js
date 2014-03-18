(function () {


    document.addEventListener('DOMContentLoaded', function () {
        console.log('Y=');
        document.body.addEventListener('touchmove', function (event) {
            event.preventDefault();
        });
    });

    var jQuery = window.jQuery || null;
    var p = {
        scrollTop: 0,
        touchstart: {
            x: 0,
            y: 0
        },
        scrollContainer: {
            scrollHeight: 0,
            offsetHeight: 0
        },
        isScrolling: false,
        reset: null,
        disabled: false,
        disableTouch: function () {
            p.disabled = true;
        },
        enableTouch: function () {
            p.disabled = false;
        },
        // TODO: Morten has to write an identifier
        isSelector: function (el, selector) {
            selector = selector.split('.');
            selector = selector[selector.length - 1];
            console.log(selector, el);
            return el.className === selector;
        },
        isEventTarget: function (el, events) {
            for (var prop in events) {
                if (events.hasOwnProperty(prop) && p.isSelector(el, prop)) {
                    return true;
                }
            }
            return false;
        },
        getTarget: function (el, selector) {
            var target = el;
            while (target.parentNode) {
                if (p.isSelector(target, selector)) {
                    return target;
                } else {
                    target = target.parentNode;
                }
            }
        },
        // When scrolltouch('.list', {}); we have to identify
        // if .list has been hit. This is done by checking
        // the target and its parentNodes for a hit
        createDelegatedClosure: function (selector, cb) {
            return function (event) {
                var target = p.getTarget(event.target, selector);

                if (target) {
                    return cb(event, target);
                }
            }
        },
        createEventsClosure: function (events, cb) {
            return function (event) {
                var target = event.target;
                while (target.parentNode) {
                    if (p.isEventTarget(target, events)) {
                        return cb(event, '.' + target.className); // TODO: Fix better identifier
                    } else {
                        target = target.parentNode;
                    }
                }
            }
        }
    };

    var touchscroll = function () {

        var el,
            events,
            parentSelector,
            touchstart,
            startCallback,
            touchmove,
            moveCallback,
            touchend,
            endCallback;

        if (jQuery) {
            el = this[0];
            parentSelector = typeof arguments[0] === 'string' ? arguments[0] : null;
            events = parentSelector ? arguments[1] : arguments[0];
        } else {
            el = arguments[0];
            parentSelector = typeof arguments[1] === 'string' ? arguments[1] : null;
            events = parentSelector ? arguments[2] : arguments[1];
        }


        if (typeof arguments[0] === 'boolean') {
            return arguments[0] ? p.enableTouch() : p.disableTouch();
        }

        if (parentSelector) {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = parentSelector + ' { ' +
                'overflow-y: scroll;' +
                '-webkit-overflow-scrolling: touch;' +
                '-ms-touch-action: pan-y;' +
                '}';
            document.getElementsByTagName('head')[0].appendChild(style);
        } else {
            el.style.overflowY = 'scroll';
            el.style.webkitOverflowScrolling = 'touch';
            el.style.msTouchAction = 'pan-y';
        }


        //TOUCHSTART

        touchstart = function (event, target) {

            target = target ? target : event.currentTarget;
            p.scrollTop = target.scrollTop;
            p.touchstart = {
                x: event.touches[0].pageX,
                y: event.touches[0].pageY

            };
            p.scrollContainer = {
                scrollHeight: target.scrollHeight,
                offsetHeight: target.offsetHeight
            }
            event.stopPropagation();
        };

        if (parentSelector) {
            startCallback = p.createDelegatedClosure(parentSelector, touchstart);
        } else {
            startCallback = touchstart;
        }

        el.addEventListener('touchstart', startCallback);

        // TOUCHMOVE

        touchmove = function (event) {

            p.isScrolling = true;

            // Prevent horizontal scroll
            if (Math.abs(p.touchstart.x - event.touches[0].pageX) > 10) {
                event.preventDefault();
            }

            if (p.scrollTop === 0 && event.touches[0].pageY > p.touchstart.y) {
                event.preventDefault();
            } else if (p.scrollTop === (p.scrollContainer.scrollHeight - p.scrollContainer.offsetHeight) &&
                event.touches[0].pageY < p.touchstart.y) {

                event.preventDefault();
            }

            event.stopPropagation();
        };

        if (parentSelector) {
            moveCallback = p.createDelegatedClosure(parentSelector, touchmove);
        } else {
            moveCallback = touchmove;
        }

        el.addEventListener('touchmove', moveCallback);

        if (!events) {
            return;
        }

        touchend = function (event, touchendTarget) {


            if (p.isScrolling && !p.reset) {
                // To allow multiple touchend events to trigger
                return p.reset = setTimeout(function () {
                    p.isScrolling = false;
                    p.reset = null;
                }, 0);
            }

            if (!p.isScrolling && !p.disabled && touchendTarget) {
                events[touchendTarget](event, touchendTarget);
            }
        };

        if (parentSelector) {
            endCallback = p.createDelegatedClosure(parentSelector, p.createEventsClosure(events, touchend));
        } else {
            endCallback = p.createEventsClosure(events, touchend);
        }

        el.addEventListener('touchend', endCallback);

    };

    if (jQuery) {
        jQuery.fn.touchscroll = touchscroll;
    } else {
        window.touchscroll = touchscroll;
    }

}());

