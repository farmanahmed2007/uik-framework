// Characterization tests for src/lib/js/utils/tables.js
(function ($) {
    'use strict';

    function setSidebar(value) {
        try {
            if (value === null) {
                window.localStorage.removeItem('toggleState');
            } else {
                window.localStorage.setItem('toggleState', value);
            }
        } catch (e) { /* storage unavailable; the module falls back to closed */ }
    }

    QUnit.module('tables.js — sticky header offset', {
        afterEach: function () { setSidebar(null); }
    });

    QUnit.test('offset tracks the sidebar width when the sidebar is closed', function (assert) {
        // The original expression was
        //   ((scrollLeft * -1) + (open == 'opened') ? 245 : 65) + 'px'
        // The ternary bound to the whole addition, not the comparison, so the
        // result collapsed to a constant "245px" whatever the inputs were.
        setSidebar('closed');
        var $scroller = $('<div></div>');

        assert.strictEqual(window.UIKTables.fixedHeaderOffset($scroller), '65px',
            'closed sidebar yields its own width, not a constant');
    });

    QUnit.test('offset tracks the sidebar width when the sidebar is open', function (assert) {
        setSidebar('opened');
        var $scroller = $('<div></div>');

        assert.strictEqual(window.UIKTables.fixedHeaderOffset($scroller), '245px',
            'open sidebar yields the wider offset');
    });

    QUnit.test('offset responds to horizontal scrolling', function (assert) {
        setSidebar('closed');
        UIKTest.set(
            '<div class="table-responsive" style="width:100px;overflow:auto">' +
            '  <table style="width:900px"><tr><td>wide</td></tr></table>' +
            '</div>'
        );
        var $scroller = UIKTest.find('.table-responsive');
        $scroller.scrollLeft(300);

        assert.strictEqual(window.UIKTables.fixedHeaderOffset($scroller), '-235px',
            'scrolled offset is (scrollLeft - sidebar) * -1, not a constant');
    });

    QUnit.test('missing sidebar state is treated as closed', function (assert) {
        setSidebar(null);
        assert.strictEqual(window.UIKTables.fixedHeaderOffset($('<div></div>')), '65px',
            'absent storage key does not throw and defaults to closed');
    });

    QUnit.module('tables.js — sticky header wiring');

    QUnit.test('init() on a page without a table is a no-op', function (assert) {
        var threw = false;
        try {
            window.UIKTables.init();
        } catch (e) {
            threw = true;
        }
        assert.notOk(threw, 'init() is safe when #table-1 and #header-fixed are absent');
    });

    QUnit.test('the cloned header is populated from #headHtml', function (assert) {
        UIKTest.set(
            '<div id="headHtml"><tr><th>Name</th></tr></div>' +
            '<div id="header-fixed"></div>' +
            '<div class="table-responsive" style="height:50px;overflow:auto">' +
            '  <table id="table-1"><tr><td>row</td></tr></table>' +
            '</div>'
        );

        window.UIKTables.init();

        assert.ok($('#header-fixed').text().indexOf('Name') !== -1,
            'sticky header mirrors the source header markup');
    });

    QUnit.test('init() can be re-run without stacking scroll handlers', function (assert) {
        UIKTest.set(
            '<div id="headHtml"><tr><th>Name</th></tr></div>' +
            '<div id="header-fixed"></div>' +
            '<div class="table-responsive" style="height:50px;overflow:auto">' +
            '  <table id="table-1"><tr><td>row</td></tr></table>' +
            '</div>'
        );

        window.UIKTables.init();
        var after1 = ($._data(UIKTest.find('.table-responsive')[0], 'events') || {}).scroll.length;

        window.UIKTables.init();
        var after2 = ($._data(UIKTest.find('.table-responsive')[0], 'events') || {}).scroll.length;

        assert.strictEqual(after2, after1, 'handler count is stable across init() calls');
    });

    QUnit.module('tables.js — arrow scrolling');

    QUnit.test('the right arrow scrolls its own table group only', function (assert) {
        UIKTest.set(
            '<div class="scroll-desktop" id="group-a">' +
            '  <div class="scrollArrows"><a class="left">&lt;</a><a class="right">&gt;</a></div>' +
            '  <div class="table-responsive" style="width:100px;overflow:auto">' +
            '    <table style="width:900px"><tr><td>a</td></tr></table></div>' +
            '</div>' +
            '<div class="scroll-desktop" id="group-b">' +
            '  <div class="table-responsive" style="width:100px;overflow:auto">' +
            '    <table style="width:900px"><tr><td>b</td></tr></table></div>' +
            '</div>'
        );
        window.UIKTables.init();

        UIKTest.find('#group-a .scrollArrows .right').trigger('click');

        assert.strictEqual(UIKTest.find('#group-a .table-responsive').scrollLeft(), 200,
            'own group scrolled');
        assert.strictEqual(UIKTest.find('#group-b .table-responsive').scrollLeft(), 0,
            'an unrelated table group is untouched');
    });

    QUnit.test('the left arrow scrolls back', function (assert) {
        UIKTest.set(
            '<div class="scroll-desktop">' +
            '  <div class="scrollArrows"><a class="left">&lt;</a><a class="right">&gt;</a></div>' +
            '  <div class="table-responsive" style="width:100px;overflow:auto">' +
            '    <table style="width:900px"><tr><td>a</td></tr></table></div>' +
            '</div>'
        );
        window.UIKTables.init();
        UIKTest.find('.table-responsive').scrollLeft(400);

        UIKTest.find('.scrollArrows .left').trigger('click');

        assert.strictEqual(UIKTest.find('.table-responsive').scrollLeft(), 200, 'scrolled back a step');
    });

    QUnit.module('tables.js — module surface');

    QUnit.test('tables exposes a single namespaced entry point', function (assert) {
        assert.strictEqual(typeof window.UIKTables, 'object', 'UIKTables exists');
        assert.strictEqual(typeof window.UIKTables.init, 'function', 'init() is callable');
        assert.notOk(Object.prototype.hasOwnProperty.call(window, 'sideBarOpened'),
            'no loose sideBarOpened global');
    });
}(jQuery));
