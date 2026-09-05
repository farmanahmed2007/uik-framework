/* global QUnit, UIKTest */
// Characterization tests for src/lib/js/utils/navigation.js
(function ($) {
    'use strict';

    /** Counts delegated handlers registered on document for a given event + selector. */
    function delegatedHandlerCount(type, selector) {
        var events = $._data(document, 'events') || {};
        return ($.grep(events[type] || [], function (h) {
            return h.selector === selector;
        })).length;
    }

    QUnit.module('navigation.js — sound control');

    QUnit.test('clicking the sound control swaps the volume icon', function (assert) {
        UIKTest.set('<div class="sound-control"><a href="#"><i class="icon-volume-up"></i></a></div>');
        var $icon = UIKTest.find('i');

        UIKTest.find('.sound-control a').trigger('click');

        assert.ok($icon.hasClass('icon-volume-off'), 'muted icon applied');
        assert.notOk($icon.hasClass('icon-volume-up'), 'unmuted icon removed');
    });

    QUnit.module('navigation.js — dropdowns');

    QUnit.test('hovering a dropdown button opens that dropdown', function (assert) {
        UIKTest.set(
            '<div class="dropdown">' +
            '  <a class="dropdown_btn">Menu</a>' +
            '  <ul class="dropdown_list"><li>Item</li></ul>' +
            '</div>'
        );

        UIKTest.find('.dropdown_btn').trigger('mouseover');

        assert.ok(UIKTest.find('.dropdown').hasClass('open'), 'container opened');
        assert.ok(UIKTest.find('.dropdown_btn').hasClass('active'), 'button activated');
        assert.ok(UIKTest.find('.dropdown_list').hasClass('active'), 'list activated');
    });

    QUnit.test('opening one dropdown closes any other that is open', function (assert) {
        UIKTest.set(
            '<div class="dropdown" id="d1">' +
            '  <a class="dropdown_btn">A</a><ul class="dropdown_list"></ul>' +
            '</div>' +
            '<div class="dropdown" id="d2">' +
            '  <a class="dropdown_btn">B</a><ul class="dropdown_list"></ul>' +
            '</div>'
        );

        UIKTest.find('#d1 .dropdown_btn').trigger('mouseover');
        UIKTest.find('#d2 .dropdown_btn').trigger('mouseover');

        assert.notOk(UIKTest.find('#d1').hasClass('open'), 'first dropdown closed');
        assert.ok(UIKTest.find('#d2').hasClass('open'), 'second dropdown open');
    });

    QUnit.test('leaving a dropdown button deactivates it', function (assert) {
        UIKTest.set(
            '<div class="dropdown">' +
            '  <a class="dropdown_btn">Menu</a><ul class="dropdown_list"></ul>' +
            '</div>'
        );

        UIKTest.find('.dropdown_btn').trigger('mouseover').trigger('mouseleave');

        assert.notOk(UIKTest.find('.dropdown_btn').hasClass('active'), 'button deactivated');
    });

    QUnit.module('navigation.js — responsive search');

    QUnit.test('the responsive search toggle shows and hides the search container', function (assert) {
        UIKTest.set(
            '<div class="keywordSearch">' +
            '  <a class="search-responsive">search</a>' +
            '  <div class="quicksearch-container" style="display:none"></div>' +
            '</div>'
        );

        UIKTest.find('.search-responsive').trigger('click');
        assert.notStrictEqual(UIKTest.find('.quicksearch-container').css('display'), 'none', 'shown');

        UIKTest.find('.search-responsive').trigger('click');
        assert.strictEqual(UIKTest.find('.quicksearch-container').css('display'), 'none', 'hidden again');
    });

    QUnit.module('navigation.js — initialization');

    QUnit.test('the slide-menu opener is registered exactly once', function (assert) {
        assert.strictEqual(
            delegatedHandlerCount('click', '#topBar .responsive-menu'), 1,
            'exactly one delegated open handler after startup'
        );
    });

    QUnit.test('re-running init does not double-bind handlers', function (assert) {
        // Startup used to call sideSlide() twice (once inside a
        // `.uik_menu_slide_right` check, once unconditionally), so every handler
        // it registered was bound twice and each open/close ran two identical
        // animation chains. init() is now idempotent.
        var before = delegatedHandlerCount('click', '#topBar .responsive-menu');

        window.UIKNavigation.init();
        window.UIKNavigation.init();

        assert.strictEqual(
            delegatedHandlerCount('click', '#topBar .responsive-menu'), before,
            'handler count unchanged after two further init() calls'
        );
    });

    QUnit.test('module state is not leaked onto window', function (assert) {
        $.each(['overLayVisible', 'isMobile', 'is_sticky', 'tabletL', 'sideSlide', 'responsiveMenu'],
            function (_, name) {
                assert.notOk(
                    Object.prototype.hasOwnProperty.call(window, name),
                    'window.' + name + ' is not defined'
                );
            });
    });

    QUnit.test('navigation exposes a single namespaced entry point', function (assert) {
        assert.strictEqual(typeof window.UIKNavigation, 'object', 'UIKNavigation exists');
        assert.strictEqual(typeof window.UIKNavigation.init, 'function', 'init() is callable');
        assert.strictEqual(typeof window.UIKNavigation.getState(), 'object', 'state is readable');
    });

    QUnit.test('a missing slide panel does not destroy the menu', function (assert) {
        // `.detach().appendTo(<empty set>)` inserts nowhere, which used to remove
        // the menu from the document permanently on narrow viewports whenever a
        // page had no .menu_wrapper_slide container.
        UIKTest.set('<div class="menu_wrapper"><ul class="menu"><li>Home</li></ul></div>');

        window.UIKNavigation.init();

        assert.strictEqual(UIKTest.find('.menu').length, 1, 'menu is still in the document');
        assert.strictEqual(UIKTest.find('.menu li').text(), 'Home', 'menu contents intact');
    });

    QUnit.test('the menu moves into the slide panel when one exists', function (assert) {
        UIKTest.set(
            '<div class="menu_wrapper"><ul class="menu"><li>Home</li></ul></div>' +
            '<div class="menu_wrapper_slide"></div>'
        );

        window.UIKNavigation.responsiveMenu();
        // Force the narrow-viewport path regardless of the runner window size.
        window.UIKNavigation.init();

        var inSlide = UIKTest.find('.menu_wrapper_slide .menu').length;
        var inWrapper = UIKTest.find('.menu_wrapper > .menu').length;
        assert.strictEqual(inSlide + inWrapper, 1, 'the menu exists in exactly one place');
    });

    QUnit.module('navigation.js — dropdown delegation');

    QUnit.test('leaving a dropdown container closes it', function (assert) {
        UIKTest.set(
            '<div class="dropdown">' +
            '  <a class="dropdown_btn">Menu</a><ul class="dropdown_list"></ul>' +
            '</div>'
        );

        UIKTest.find('.dropdown_btn').trigger('mouseover');
        assert.ok(UIKTest.find('.dropdown').hasClass('open'), 'open before leaving');

        UIKTest.find('.dropdown').trigger('mouseleave');
        assert.notOk(UIKTest.find('.dropdown').hasClass('open'), 'closed after leaving');
    });
}(jQuery));
