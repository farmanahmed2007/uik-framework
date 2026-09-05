/* global QUnit */
// Shared fixture helpers for the UIK behaviour suite.
//
// Every UIK module binds delegated handlers to `document` at DOM-ready, so specs
// work by injecting markup into a fixture container and dispatching real events.
// The container is torn down after each test to keep specs independent.
(function (window, $) {
    'use strict';

    var FIXTURE_ID = 'uik-fixture';

    var UIKTest = {
        /** Replaces the fixture container's markup and returns it as a jQuery object. */
        set: function (html) {
            return this.container().html(html);
        },

        /** The fixture container, created on first use. */
        container: function () {
            var $el = $('#' + FIXTURE_ID);
            if (!$el.length) {
                $el = $('<div id="' + FIXTURE_ID + '"></div>').appendTo('body');
            }
            return $el;
        },

        /** Finds elements inside the fixture only. */
        find: function (selector) {
            return this.container().find(selector);
        },

        /** Empties the fixture. Registered as a global afterEach below. */
        reset: function () {
            this.container().empty();
        }
    };

    window.UIKTest = UIKTest;

    // jQuery's animations make assertions time-dependent. Disabling them makes
    // .animate()/.fadeOut() apply their final state synchronously, so specs can
    // assert on the settled DOM rather than racing a timer.
    $.fx.off = true;

    QUnit.testDone(function () {
        UIKTest.reset();
    });
}(window, jQuery));
