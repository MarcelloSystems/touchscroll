/* global console */
/*! touchscroll v0.0.1 2014-03-21 12:38 */


if (typeof DEBUG === 'undefined') DEBUG = true;// Flag used for conditional compilation with uglifyJS

(function () {
    "use strict";

    var jQuery = window.jQuery || null,

    // A few tricks for better minification
        preventDefault = 'preventDefault',
        addEventListener = 'addEventListener';


    // Avoid rubber band effect in body
    document[addEventListener]('DOMContentLoaded', function () {
        console.log("DOMContentLoaded");
        window[addEventListener]('touchmove', function (event) {
            console.log("preventDefault of touchmove on body");
            event[preventDefault]();
        });
    });


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
        selector = selector.replace(/\s*/g, ''); // Remove whitespace before matching
        return selector === '.' + el.className || selector === '#' + el.id;
    }

    function isEventTarget(el, events) {
        for (var prop in events) {
            if (events.hasOwnProperty(prop) && isSelector(el, prop)) {
                return prop;
            }
        }
        return false;
    }

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

    function createEventsClosure(events, cb) {
        return function (event) {
            var target = event.target,
                selector;
            while (target.parentNode) {
                selector = isEventTarget(target, events);
                if (selector) {
                    return cb(event, selector, target); // TODO: Fix better identifier
                } else {
                    target = target.parentNode;
                }
            }
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

        el[addEventListener]('touchstart', startCallback);

        // TOUCHMOVE

        touchmove = function (event) {

            isScrolling = true;

            // Prevent horizontal scroll
            if (Math.abs(touchstart.x - event.touches[0].pageX) > 10) {
                event[preventDefault]();
            }

            if (scrollTop === 0 && event.touches[0].pageY > touchstart.y) {
                event[preventDefault]();
            } else if (scrollTop === (scrollContainer.scrollHeight - scrollContainer.offsetHeight) &&
                event.touches[0].pageY < touchstart.y) {

                event[preventDefault]();
            }

            event.stopPropagation();
        };

        if (parentSelector) {
            moveCallback = createDelegatedClosure(parentSelector, touchmove);
        } else {
            moveCallback = touchmove;
        }

        el[addEventListener]('touchmove', moveCallback);

        if (!events) {
            return;
        }

        touchend = function (event, touchendTarget, target) {


            if (isScrolling && !reset) {
                // To allow multiple touchend events to trigger
                return reset = setTimeout(function () {  //TODO: JSHint is not happy about this one. Split?
                    isScrolling = false;
                    reset = null;
                }, 0);
            }

            if (!isScrolling && !disabled && touchendTarget) {
                events[touchendTarget](event, target);
            }
        };

        if (parentSelector) {
            endCallback = createDelegatedClosure(parentSelector, createEventsClosure(events, touchend));
        } else {
            endCallback = createEventsClosure(events, touchend);
        }

        el[addEventListener]('touchend', endCallback);

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
            } else {
                return touchscroll;
            }
        });
    } else {

        window.touchscroll = touchscroll;
    }

}());