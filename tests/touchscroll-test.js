/* global buster, touchscroll, sinon, expect, console */
(function () {
    "use strict";

    // Access closure
    var peek = touchscroll._peek,

        // Test/inspection subjects
        isSelector = peek("isSelector");


    buster.testCase('touchscroll', {
//        setUp: function () {
//
//        },
        'is a function': function () {
            expect(touchscroll).to.be.a('function');
        },
        'takes three arguments': function () {
            expect(touchscroll).to.have.length(3);
        },
        'PRIVATES': {
            'isSelector()': {
                'setUp': function () {
                    this.el = document.createElement('div');
                    this.el.className = "myClass";
                    this.el.id = "myId";
                },
                'is a function': function () {
                    expect(isSelector).to.be.a('function');
                },
                'takes two arguments (dom element, selector string)': function () {
                    expect(isSelector).to.have.length(2);
                },
                'returns a boolean': function () {
                    expect(isSelector(this.el, '.foo')).to.be.a('boolean');
                },
                'returns true when el has given class': function () {
                    expect(isSelector(this.el, '.myClass')).to.be(true);
                },
                "returns false when el has doesn't have given class": function () {
                    expect(isSelector(this.el, '.hasNoClass')).to.be(false);
                },
                'returns true when el has given id': function () {
                    expect(isSelector(this.el, '#myId')).to.be(true);
                },
                "returns false when el doesn't have given id": function () {
                    expect(isSelector(this.el, '#hasNoId')).to.be(false);
                },
                'returns false if el is falsy': function () {
                    expect(isSelector(null, '.foo')).to.be(false);
                },
                'returns false if selector is not a string': function () {
                    expect(isSelector(this.el, null)).to.be(false);
                },
                'ignores whitespace in selector string': function () {
                    expect(isSelector(this.el, '  .myClass  ')).to.be(true);
                    expect(isSelector(this.el, '  #myId  ')).to.be(true);
                }
            }
        }
    });
}());