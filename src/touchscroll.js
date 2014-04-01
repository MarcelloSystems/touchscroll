/* global console */
/*! {{ BANNER }} */


if (typeof DEBUG === 'undefined') DEBUG = true;// Flag used for conditional compilation with uglifyJS

(function () {
    "use strict";

    var jQuery = window.jQuery || null,

    // A few tricks for better minification
        preventDefault = 'preventDefault',
        addEventListener = 'addEventListener',
        isWindowsPhone = navigator.msPointerEnabled;

    // Handling touch events for cross devices. WP has their own touch events.

    var touchstartEvent = 'touchstart',
        touchendEvent = 'touchend',
        touchmoveEvent = 'touchmove';

    if (isWindowsPhone) {
        touchstartEvent = 'MSPointerDown';
        touchendEvent = 'MSPointerUp';
        touchmoveEvent = 'MSPointerMove';
    }


    ///////////////////////////////////////////////////////
    // PRIVATES

    var scrollTop = 0,
        touchstart = {
            x: 0,
            y: 0
        },
        scrollContainer = {
            scrollHeight: 0,
            offsetHeight: 0
        },
        isScrolling = false,
        reset = null,
        disabled = false; //TODO: Improve name of this flag?


    // Avoid rubber band effect in body
    document[addEventListener]('DOMContentLoaded', function () {
        window[addEventListener](touchmoveEvent, function (event) {
            event[preventDefault]();
        });
        window[addEventListener](touchendEvent, function () {
            isScrolling = false;
        });
    });

    function disableTouch() {
        disabled = true;
    }

    function enableTouch() {
        disabled = false;
    }

    // Returns true/false based on whether el has the given class/id
    // Selector is eg: ".myClass" or "#myId"
    function isSelector(el, selector) {
        if (!el || typeof selector !== 'string') {
            return false;
        }
        selector = selector.replace(/[\s,\.]*/g, ''); // Remove whitespace and class dots before matching
        return el.className.split(' ').indexOf(selector) >= 0 || selector === '#' + el.id;
    }

    function isEventTarget(el, events) {
        for (var prop in events) {
            if (events.hasOwnProperty(prop) && isSelector(el, prop)) {
                return prop;
            }
        }
        return false;
    }

    // Returns the target by selector,
    // or undefined if no match
    function getTarget(el, selector) {
        var target = el;
        while (target.parentNode) {
            if (isSelector(target, selector)) {
                return target;
            } else {
                target = target.parentNode;
            }
        }
    }

    // When scrolltouch('.list', {}); we have to identify
    // if .list has been hit. This is done by checking
    // the target and its parentNodes for a hit
    function createDelegatedClosure(selector, cb) {
        return function (event) {
            var target = getTarget(event.target, selector);
            if (target) {
                return cb(event, target);
            }
        };
    }

    // Figures out if an inner delegated child
    // is touched. Passed on the object to touchscroll
    function createEventsClosure(events, cb) {
        return function (event, listTarget) {
            var target = event.target,
                selector;
            while (target.parentNode) {
                selector = isEventTarget(target, events);
                if (selector) {
                    return cb(event, selector, target, listTarget);
                } else {
                    target = target.parentNode;
                }
            }

            cb(event, selector, target, listTarget);
        };
    }


    ///////////////////////////////////////////////////////
    // PUBLIC

    var touchscroll = function (arg0, arg1, arg2) { // TODO: Find good arg names.

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
            parentSelector = typeof arg0 === 'string' ? arg0 : null;
            events = parentSelector ? arg1 : arg0;
        } else {
            el = arg0;
            parentSelector = typeof arg1 === 'string' ? arg1 : null;
            events = parentSelector ? arg2 : arg1;
        }


        if (typeof arg0 === 'boolean') {
            return arg0 ? enableTouch() : disableTouch();
        }

        if (parentSelector) {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = parentSelector + ' { ' +
                'height: 100%;' +
                'overflow-y: scroll;' +
                '-webkit-overflow-scrolling: touch;' +
                '-ms-touch-action: pan-y;' +
                '}';
            document.getElementsByTagName('head')[0].appendChild(style);
        } else {
            el.style.height = '100%';
            el.style.overflowY = 'scroll';
            el.style.webkitOverflowScrolling = 'touch';
            el.style.msTouchAction = 'pan-y';
        }


        //TOUCHSTART

        touchstart = function (event, target) {

            target = target ? target : event.currentTarget;
            target.style.transition = '';
            target.style.webkitTransition = '';
            scrollTop = target.scrollTop;
            touchstart = {
                x: event.touches[0].pageX,
                y: event.touches[0].pageY
            };
            scrollContainer = {
                scrollHeight: target.scrollHeight,
                offsetHeight: target.offsetHeight
            };
            event.stopPropagation();
        };

        if (parentSelector) {
            startCallback = createDelegatedClosure(parentSelector, touchstart);
        } else {
            startCallback = touchstart;
        }

        el[addEventListener](touchstartEvent, startCallback);

        // TOUCHMOVE

        touchmove = function (event, target) {
//            console.log('moving');
            target = target || event.currentTarget;
            isScrolling = true;

            // Prevent horizontal scroll
            if (Math.abs(touchstart.x - event.touches[0].pageX) > 10) {
                event[preventDefault]();
            }

            if (scrollTop === 0 && event.touches[0].pageY > touchstart.y) {

                //Formula creating rubber band effect
                var dist = parseInt(Math.sqrt(Math.pow((event.touches[0].pageY - touchstart.y), 2)), 10);
                var y = (event.touches[0].pageY - touchstart.y) * (1 - (dist / 1000)) * 0.5;

                //Move container
                target.style.transform = "translate3d(0, " + y + "px, 0)";
                target.style.webkitTransform = "translate3d(0, " + y + "px, 0)";

                event[preventDefault]();
            } else if (scrollTop === (scrollContainer.scrollHeight - scrollContainer.offsetHeight) &&
                event.touches[0].pageY < touchstart.y) {
                //Formula creating rubber band effect
                var dist = parseInt(Math.sqrt(Math.pow((event.touches[0].pageY - touchstart.y), 2)), 10);
                var y = (event.touches[0].pageY - touchstart.y) * (1 - (dist / 1000)) * 0.5;

                //Move container
                target.style.transform = "translate3d(0, " + y + "px, 0)";
                target.style.webkitTransform = "translate3d(0, " + y + "px, 0)";

                event[preventDefault]();
            }

            event.stopPropagation();
        };

        if (parentSelector) {
            moveCallback = createDelegatedClosure(parentSelector, touchmove);
        } else {
            moveCallback = touchmove;
        }

        el[addEventListener](touchmoveEvent, moveCallback);


        touchend = function (event, touchendTarget, target, listTarget) {

            listTarget = listTarget || el;


            var transitionEnd = function () {
                listTarget.style.transition = '';
                listTarget.style.webkitTransition = '';
            };

            listTarget[addEventListener]('transitionend', transitionEnd);
            listTarget[addEventListener]('webkitTransitionend', transitionEnd);
            listTarget.style.transition = 'transform 0.35s ease-out';
            listTarget.style.webkitTransition = '-webkit-transform 0.35s ease-out';
            listTarget.style.transform = 'translate3d(0,0,0)';
            listTarget.style.webkitTransform = 'translate3d(0,0,0)';


            if (!isScrolling && !disabled && touchendTarget) {
                events[touchendTarget](event, target);
            }

        };

        if (parentSelector) {
            endCallback = createDelegatedClosure(parentSelector, createEventsClosure(events, touchend));
        } else {
            endCallback = createEventsClosure(events, touchend);
        }

        el[addEventListener](touchendEvent, endCallback);

        return touchscroll;

    };


    // Provide unit tests with access to this closure. Removed by build step
    if (DEBUG) {
        touchscroll._peek = function (string) {
            return eval(string);
        };
    }

    // Expose to environment
    if (jQuery) {
        jQuery.fn.touchscroll = touchscroll;
    } else if ('define' in window) {
        window.define('jQuery', function (jQuery) {
            jQuery = jQuery || window.jQuery;
            if (jQuery) {
                jQuery.fn.touchscroll = touchscroll;
                jQuery = $;
            } else {
                return touchscroll;
            }
        });
    } else {

        window.touchscroll = touchscroll;
    }

}());