// Characterization tests for src/lib/js/utils/form-elements.js
(function ($) {
    'use strict';

    var FLOATING =
        '<div class="interactive-forms">' +
        '  <div class="floating-inputs">' +
        '    <input type="text" class="form-control" id="fi">' +
        '    <label for="fi">Name</label>' +
        '    <span class="bar"></span>' +
        '  </div>' +
        '</div>';

    QUnit.module('form-elements.js — floating inputs');

    QUnit.test('focus marks the wrapper as focused', function (assert) {
        UIKTest.set(FLOATING);
        var $input = UIKTest.find('.form-control');

        $input.trigger('focus');

        assert.ok($input.parent().hasClass('focused'), 'wrapper gains .focused on focus');
    });

    QUnit.test('blur clears the focused wrapper', function (assert) {
        UIKTest.set(FLOATING);
        var $input = UIKTest.find('.form-control');

        $input.trigger('focus');
        $input.trigger('blur');

        assert.notOk($input.parent().hasClass('focused'), 'wrapper loses .focused on blur');
    });

    QUnit.test('typing floats the label and activates the bar', function (assert) {
        UIKTest.set(FLOATING);
        var $input = UIKTest.find('.form-control');

        $input.val('Ada').trigger('input');

        assert.ok($input.parent().hasClass('focused'), 'wrapper is focused');
        assert.ok(UIKTest.find('label').hasClass('float'), 'label floats while there is text');
        assert.ok(UIKTest.find('span').hasClass('active'), 'bar is active while there is text');
    });

    QUnit.test('clearing the field un-floats the label', function (assert) {
        UIKTest.set(FLOATING);
        var $input = UIKTest.find('.form-control');

        $input.val('Ada').trigger('input');
        $input.val('').trigger('input');

        assert.notOk(UIKTest.find('label').hasClass('float'), 'label returns to rest');
        assert.notOk(UIKTest.find('span').hasClass('active'), 'bar returns to rest');
    });

    QUnit.module('form-elements.js — show password');

    QUnit.test('checking .show_password reveals the password in the same form', function (assert) {
        UIKTest.set(
            '<div class="interactive-forms">' +
            '  <input type="password" class="pw-a" value="s3cret">' +
            '  <input type="checkbox" class="show_password">' +
            '</div>'
        );

        // .trigger('click') toggles a checkbox natively, so start unchecked.
        UIKTest.find('.show_password').trigger('click');

        assert.strictEqual(UIKTest.find('.pw-a').attr('type'), 'text', 'password becomes visible');
        assert.ok(UIKTest.find('.pw-a').hasClass('password-visible'), 'marked .password-visible');
    });

    QUnit.test('unchecking .show_password hides the password again', function (assert) {
        UIKTest.set(
            '<div class="interactive-forms">' +
            '  <input type="password" class="pw-a" value="s3cret">' +
            '  <input type="checkbox" class="show_password">' +
            '</div>'
        );

        UIKTest.find('.show_password').trigger('click');   // -> checked
        UIKTest.find('.show_password').trigger('click');   // -> unchecked

        assert.strictEqual(UIKTest.find('.pw-a').attr('type'), 'password', 'password is hidden again');
        assert.notOk(UIKTest.find('.pw-a').hasClass('password-visible'), '.password-visible cleared');
    });

    QUnit.test('show_password only affects its own .interactive-forms container', function (assert) {
        // Regression guard for a scoping defect: the handler used to select every
        // input[type=password] in the document, so one toggle revealed unrelated
        // password fields elsewhere on the page.
        UIKTest.set(
            '<div class="interactive-forms" id="form-a">' +
            '  <input type="password" class="pw-a" value="a">' +
            '  <input type="checkbox" class="show_password">' +
            '</div>' +
            '<form id="form-b">' +
            '  <input type="password" class="pw-b" value="b">' +
            '</form>'
        );

        UIKTest.find('#form-a .show_password').trigger('click');

        assert.strictEqual(UIKTest.find('.pw-a').attr('type'), 'text', 'own field revealed');
        assert.strictEqual(UIKTest.find('.pw-b').attr('type'), 'password',
            'an unrelated password field elsewhere on the page stays masked');
    });

    QUnit.module('form-elements.js — max length badge');

    QUnit.test('typing under the limit shows a green counter badge', function (assert) {
        UIKTest.set('<div class="max-validation"><input maxlength="10" value="abc"></div>');

        UIKTest.find('input').trigger('keyup');

        var $badge = UIKTest.find('span.badge');
        assert.strictEqual($badge.length, 1, 'one badge is rendered');
        assert.ok($badge.hasClass('bg-green'), 'badge is green below the limit');
        assert.strictEqual($badge.text(), '3/10', 'badge shows used/total');
    });

    QUnit.test('reaching the limit switches the badge to red', function (assert) {
        UIKTest.set('<div class="max-validation"><input maxlength="3" value="abc"></div>');

        UIKTest.find('input').trigger('keyup');

        var $badge = UIKTest.find('span.badge');
        assert.ok($badge.hasClass('bg-red'), 'badge is red at the limit');
        assert.strictEqual($badge.text(), '3/3', 'badge shows the limit');
    });

    QUnit.test('over-long input is truncated back to maxlength', function (assert) {
        UIKTest.set('<div class="max-validation"><input maxlength="3"></div>');
        var $input = UIKTest.find('input');

        // maxlength does not constrain a programmatic .val(), which is exactly the
        // case this handler exists to clean up.
        $input.val('abcdef').trigger('keyup');

        assert.strictEqual($input.val(), 'abc', 'value is trimmed to the limit');
        assert.strictEqual(UIKTest.find('span.badge').text(), '3/3', 'badge reflects the trim');
    });

    QUnit.test('blur removes the counter badge', function (assert) {
        UIKTest.set('<div class="max-validation"><input maxlength="5" value="ab"></div>');

        UIKTest.find('input').trigger('keyup');
        assert.strictEqual(UIKTest.find('span.badge').length, 1, 'badge present while typing');

        UIKTest.find('input').trigger('blur');
        assert.strictEqual(UIKTest.find('span.badge').length, 0, 'badge removed on blur');
    });

    QUnit.test('only one badge exists no matter how many keystrokes arrive', function (assert) {
        UIKTest.set('<div class="max-validation"><input maxlength="8" value="hi"></div>');
        var $input = UIKTest.find('input');

        $input.trigger('keyup').trigger('keyup').trigger('keyup');

        assert.strictEqual(UIKTest.find('span.badge').length, 1, 'badges do not accumulate');
    });
}(jQuery));
