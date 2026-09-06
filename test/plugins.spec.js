// The vendored jQuery plugins predate jQuery 4 by roughly a decade, and the
// project now supports both jQuery 3 and 4. These assertions pin the fact that
// each plugin still attaches itself to whichever jQuery is loaded — a silent
// failure to register is the way a jQuery-major regression would show up first.
(function ($) {
    'use strict';

    QUnit.module('vendored plugins');

    QUnit.test('the loaded jQuery is one this project supports', function (assert) {
        var major = parseInt($.fn.jquery.split('.')[0], 10);
        assert.ok(major === 3 || major === 4,
            'jQuery ' + $.fn.jquery + ' is within the supported ^3 || ^4 range');
    });

    QUnit.test('lightSlider registers', function (assert) {
        assert.strictEqual(typeof $.fn.lightSlider, 'function', '$.fn.lightSlider is callable');
    });

    QUnit.test('fancyBox registers with its helpers', function (assert) {
        assert.strictEqual(typeof $.fancybox, 'function', '$.fancybox is callable');
        assert.strictEqual(typeof $.fn.fancybox, 'function', '$.fn.fancybox is callable');
        assert.ok($.fancybox.helpers, 'helpers namespace exists');
        assert.ok($.fancybox.helpers.buttons, 'buttons helper registered');
        assert.ok($.fancybox.helpers.thumbs, 'thumbs helper registered');
    });

}(jQuery));
