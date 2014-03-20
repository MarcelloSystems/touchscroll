/* global buster, touchscroll, sinon, expect, console */
(function () {
    "use strict";


//    var p = touchscroll._privates;
    var p = touchscroll._peek("p");

    buster.testCase('touchscroll', {
//        setUp: function () {
//
//        },
        'is a function': function () {
            expect(touchscroll).to.be.a('function');
        },
        'takes no formal parameters (but three in reality)': function () {
            expect(touchscroll).to.have.length(0);
        },
        'PRIVATES': {
            'p.isSelector': {
                'setUp': function () {
                    this.el = document.createElement('div');
                    this.el.className = "myClass";
                    this.el.id = "myId";
                },
                'is a function': function () {
                    expect(p.isSelector).to.be.a('function');
                },
                'takes two arguments (dom element, selector string)': function() {
                    expect(p.isSelector).to.have.length(2);
                },
                'returns a boolean': function () {
                    expect(p.isSelector(this.el, '.foo')).to.be.a('boolean');
                },
                'returns true when el has given class': function () {
                    expect(p.isSelector(this.el, '.myClass')).to.be(true);
                },
                "returns false when el has doesn't have given class": function () {
                    expect(p.isSelector(this.el, '.hasNoClass')).to.be(false);
                },
                'returns true when el has given id': function () {
                    expect(p.isSelector(this.el, '#myId')).to.be(true);
                },
                "returns false when el doesn't have given id": function () {
                    expect(p.isSelector(this.el, '#hasNoId')).to.be(false);
                },
                'returns false if el is falsy': function() {
                    expect(p.isSelector(null, '.foo')).to.be(false);
                },
                'returns false if selector is not a string': function() {
                    expect(p.isSelector(this.el, null)).to.be(false);
                },
                'ignores whitespace in selector string': function () {
                    expect(p.isSelector(this.el, '  .myClass  ')).to.be(true);
                    expect(p.isSelector(this.el, '  #myId  ')).to.be(true);
                }
            }
        }
    });
}());