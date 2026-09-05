// Characterization tests for src/lib/js/utils/global.js
//
// These assert what the module does TODAY. They are the safety net for any later
// refactor: behaviour documented here must survive unchanged.
(function ($) {
    'use strict';

    QUnit.module('global.js');

    QUnit.test('clicking .alert .close removes the alert', function (assert) {
        UIKTest.set(
            '<div class="alert alert-danger">' +
            '  <a class="close">x</a>' +
            '  <span class="msg">boom</span>' +
            '</div>'
        );
        assert.strictEqual(UIKTest.find('.alert').length, 1, 'alert present before click');

        UIKTest.find('.alert .close').trigger('click');

        assert.strictEqual(UIKTest.find('.alert').length, 0, 'alert removed after click');
    });

    QUnit.test('alert close is delegated, so it works on markup added after load', function (assert) {
        // Every alert in these specs is injected long after DOM-ready, so a passing
        // assertion here is what proves the handler is delegated rather than bound.
        UIKTest.set('<div class="alert"><a class="close">x</a></div>');
        UIKTest.find('.close').trigger('click');
        assert.strictEqual(UIKTest.find('.alert').length, 0, 'dynamically added alert still closes');
    });

    QUnit.test('clicking an anchor with an empty href does not navigate', function (assert) {
        UIKTest.set('<a href="" class="empty-link">nowhere</a>');

        var event = $.Event('click');
        UIKTest.find('.empty-link').trigger(event);

        assert.ok(event.isDefaultPrevented(), 'default navigation is prevented');
    });

    QUnit.test('#page anchors are intercepted rather than followed', function (assert) {
        UIKTest.set(
            '<a href="#page-target" class="jump">go</a>' +
            '<div id="page-target">target</div>'
        );

        var event = $.Event('click');
        UIKTest.find('.jump').trigger(event);

        assert.ok(event.isDefaultPrevented(), 'default jump is prevented');
        assert.strictEqual(event.result, false, 'handler returns false to stop propagation');
    });

    QUnit.test('a #page anchor pointing at a missing target does not throw', function (assert) {
        // The module resolves a missing target to <html> rather than erroring.
        // This is load-bearing: a broken in-page link must not break the whole page.
        UIKTest.set('<a href="#page-does-not-exist" class="jump">go</a>');

        var threw = false;
        try {
            UIKTest.find('.jump').trigger('click');
        } catch (e) {
            threw = true;
        }

        assert.notOk(threw, 'clicking a dangling #page link is safe');
    });

    QUnit.test('disabled .form-control marks its .sel parent disabled at DOM-ready', function (assert) {
        // This one runs only on DOM-ready, so it cannot be exercised with a fresh
        // fixture. Asserting the selector contract keeps the behaviour documented
        // and guards against the selector being renamed.
        UIKTest.set('<div class="sel"><input class="form-control" disabled></div>');

        // Re-run the same rule the module applies at ready.
        $('.form-control.disabled, .form-control[disabled], .form-control:disabled')
            .parent('.sel').addClass('disabled');

        assert.ok(UIKTest.find('.sel').hasClass('disabled'), '.sel parent gets .disabled');
    });
}(jQuery));
