/* global QUnit, UIKTest */
// Characterization tests for the small delegated behaviour modules:
// buttons.js, tabs.js, tooltip.js, popup.js, card.js, accordian.js, back-top.js
(function ($) {
    'use strict';

    QUnit.module('buttons.js');

    QUnit.test('.btn-toggle toggles its active state', function (assert) {
        UIKTest.set('<button class="btn btn-toggle">Bold</button>');
        var $btn = UIKTest.find('.btn-toggle');

        $btn.trigger('click');
        assert.ok($btn.hasClass('active'), 'first click activates');

        $btn.trigger('click');
        assert.notOk($btn.hasClass('active'), 'second click deactivates');
    });

    QUnit.module('tabs.js');

    QUnit.test('clicking a tab moves .active to it and away from its siblings', function (assert) {
        UIKTest.set(
            '<div class="tabination">' +
            '  <ul class="nav-tabs">' +
            '    <li class="active"><a href="one">One</a></li>' +
            '    <li><a href="two">Two</a></li>' +
            '  </ul>' +
            '  <div class="tab-content">' +
            '    <div class="tab-pane active" id="one">1</div>' +
            '    <div class="tab-pane" id="two">2</div>' +
            '  </div>' +
            '</div>'
        );

        UIKTest.find('.nav-tabs li').eq(1).trigger('click');

        assert.notOk(UIKTest.find('.nav-tabs li').eq(0).hasClass('active'), 'first tab deactivated');
        assert.ok(UIKTest.find('.nav-tabs li').eq(1).hasClass('active'), 'clicked tab activated');
    });

    QUnit.test('tab click does not navigate', function (assert) {
        UIKTest.set(
            '<div class="tabination"><ul class="nav-tabs">' +
            '<li><a href="one">One</a></li></ul>' +
            '<div class="tab-content"><div class="tab-pane" id="one">1</div></div></div>'
        );

        var event = $.Event('click');
        UIKTest.find('.nav-tabs li').trigger(event);

        assert.strictEqual(event.result, false, 'handler returns false');
    });

    QUnit.module('tooltip.js');

    QUnit.test('hovering a tooltip activates its inner element', function (assert) {
        UIKTest.set('<span class="tooltip">?<span class="tooltip-inner">Help</span></span>');

        UIKTest.find('.tooltip').trigger('mouseover');
        assert.ok(UIKTest.find('.tooltip-inner').hasClass('active'), 'inner shown on hover');

        UIKTest.find('.tooltip').trigger('mouseleave');
        assert.notOk(UIKTest.find('.tooltip-inner').hasClass('active'), 'inner hidden on leave');
    });

    QUnit.module('card.js');

    QUnit.test('.cards.style11 toggle button flips the card', function (assert) {
        UIKTest.set('<div class="cards style11"><button class="toggle-btn">flip</button></div>');
        var $card = UIKTest.find('.cards');

        $card.find('.toggle-btn').trigger('click');
        assert.ok($card.hasClass('active'), 'card activated');

        $card.find('.toggle-btn').trigger('click');
        assert.notOk($card.hasClass('active'), 'card deactivated');
    });

    QUnit.module('popup.js');

    QUnit.test('.popup-btn opens the popup it belongs to', function (assert) {
        UIKTest.set(
            '<div class="popup">' +
            '  <button class="popup-btn">open</button>' +
            '  <div class="popup-inner" style="display:none">' +
            '    <div class="popup-header"><button class="close-btn">x</button></div>' +
            '  </div>' +
            '</div>'
        );

        UIKTest.find('.popup-btn').trigger('click');

        assert.notStrictEqual(UIKTest.find('.popup-inner').css('display'), 'none', 'popup is shown');
    });

    QUnit.test('the popup close button hides it again', function (assert) {
        UIKTest.set(
            '<div class="popup">' +
            '  <button class="popup-btn">open</button>' +
            '  <div class="popup-inner" style="display:none">' +
            '    <div class="popup-header"><button class="close-btn">x</button></div>' +
            '  </div>' +
            '</div>'
        );

        UIKTest.find('.popup-btn').trigger('click');
        UIKTest.find('.popup .popup-header .close-btn').trigger('click');

        assert.strictEqual(UIKTest.find('.popup-inner').css('display'), 'none', 'popup is hidden');
    });

    QUnit.module('accordian.js');

    QUnit.test('accordion triggers are bound at DOM-ready only', function (assert) {
        // accordian.js binds directly to the .acc-trigger elements present at
        // DOM-ready rather than delegating from document. Panels injected later
        // therefore get no handler. This documents that limitation so a future
        // refactor to delegation is a deliberate, visible change.
        UIKTest.set(
            '<div class="accordian">' +
            '  <h3 class="acc-trigger">Section</h3>' +
            '  <div class="acc-panel">Body</div>' +
            '</div>'
        );

        var handlers = $._data(UIKTest.find('.acc-trigger')[0], 'events');

        assert.strictEqual(handlers, undefined,
            'dynamically added .acc-trigger has no click handler (bound at ready only)');
    });

    QUnit.module('back-top.js');

    QUnit.test('a back-to-top control is injected into the page', function (assert) {
        var $btn = $('#back-top');

        assert.strictEqual($btn.length, 1, '#back-top exists');
        assert.ok($btn.hasClass('btn'), 'carries the .btn class contract');
        assert.strictEqual($btn.find('i.icon-up-open').length, 1, 'carries the icon contract');
    });
}(jQuery));
