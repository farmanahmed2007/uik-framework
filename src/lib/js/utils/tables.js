/* ---------------------------------------------------------------------------
 * UIK Tables
 *
 * Sticky table header, paired horizontal scrollbars, and arrow scrolling.
 *
 * State is private and initialization is exposed as `window.UIKTables.init()`,
 * so tables rendered after DOM-ready can be wired up. Scroll events do not
 * bubble, so these handlers must be bound to the scrolling elements directly;
 * init() namespaces and re-binds them, which makes it safe to call repeatedly.
 *
 * Every selector and CSS class below is part of the public markup contract and
 * is unchanged.
 * --------------------------------------------------------------------------- */
(function (window, $) {
    'use strict';

    var NS = '.uikTables';
    var ARROW_STEP = 200;
    var SIDEBAR_WIDTH_OPEN = 245;
    var SIDEBAR_WIDTH_CLOSED = 65;

    var SCROLL_GROUP = '.scroll-desktop, .scroll-desktop-160, .no-scroll-desktop';

    /** Reads the persisted sidebar state. Storage can throw in sandboxed frames. */
    function sidebarIsOpen() {
        try {
            return window.localStorage.getItem('toggleState') === 'opened';
        } catch (e) {
            return false;
        }
    }

    function sidebarWidth() {
        return sidebarIsOpen() ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED;
    }

    /**
     * Horizontal offset for the cloned sticky header, so it tracks the table it
     * is standing in for.
     *
     * The original expression was
     *   ((scrollLeft * -1) + (open == 'opened') ? 245 : 65) + 'px'
     * where the ternary bound to the whole addition rather than to the
     * comparison, so it collapsed to a constant 245px in every realistic case.
     * This is the arithmetic the module's other two handlers already used.
     */
    function fixedHeaderOffset($scroller) {
        return ((($scroller.scrollLeft() || 0) - sidebarWidth()) * -1) + 'px';
    }

    function positionFixedHeader($scroller) {
        $('#header-fixed').css('left', fixedHeaderOffset($scroller));
    }

    /** Keeps the two paired scrollbars of a table group in sync. */
    function syncPairedScroll($source, partnerSelector) {
        var $group = $source.closest(SCROLL_GROUP);
        var $partner = $group.find(partnerSelector);
        if (!$partner.length) {
            return;
        }

        var width = $partner.find('table').width();
        if (width) {
            $source.find('table').css({
                'cssText': 'width: ' + width + 'px !important;max-width:' + width + 'px !important'
            });
        }
        $partner.scrollLeft($source.scrollLeft());
    }

    function bindStickyHeader() {
        var $fixedHeader = $('#header-fixed');
        var $table = $('#table-1');

        if (!$fixedHeader.length || !$table.length) {
            return;
        }

        // `.offset('top')` is a setter call: it returns the jQuery object, not a
        // number, and quietly sets position:relative on the element. Comparing a
        // scroll offset against that object was always false, so the sticky
        // header never appeared or hid.
        var tableTop = $table.offset().top;

        $fixedHeader.empty().append($('#headHtml').html());

        $('.table-responsive').on('scroll' + NS, function () {
            var offset = $(this).scrollTop();
            if (offset >= tableTop && $fixedHeader.is(':hidden')) {
                $fixedHeader.show();
            } else if (offset < tableTop) {
                $fixedHeader.hide();
            }
        });
    }

    function bindPairedScrolling() {
        $('.table-responsive').on('scroll' + NS, function () {
            var $this = $(this);
            syncPairedScroll($this, '.table-responsive2');
            positionFixedHeader($this);
        });

        $('.table-responsive2').on('scroll' + NS, function () {
            var $this = $(this);
            syncPairedScroll($this, '.table-responsive');
            positionFixedHeader($this);
        });
    }

    function bindDelegatedHandlers() {
        $(document).on('click' + NS, '.sidebar-toggle', function () {
            positionFixedHeader($('.table-responsive').first());
        });

        // Arrow scrolling is scoped to the table group the arrows belong to,
        // falling back to the whole document when the arrows sit outside one.
        $(document).on('click' + NS, '.scrollArrows .left, .scrollArrows .right', function () {
            var step = $(this).hasClass('left') ? -ARROW_STEP : ARROW_STEP;
            var $group = $(this).closest(SCROLL_GROUP);
            var $scroller = $group.length ? $group.find('.table-responsive') : $('.table-responsive');

            $scroller.each(function () {
                var $el = $(this);
                $el.animate({ scrollLeft: $el.scrollLeft() + step }, 200);
            });
        });
    }

    var delegatesBound = false;

    /**
     * Wires up table behaviour. Safe to call repeatedly: element-level handlers
     * are namespaced and re-bound, delegated handlers are registered once.
     */
    function init() {
        $('.table-responsive, .table-responsive2').off(NS);

        bindStickyHeader();
        bindPairedScrolling();

        if (!delegatesBound) {
            bindDelegatedHandlers();
            delegatesBound = true;
        }
    }

    $(init);

    window.UIKTables = {
        init: init,
        fixedHeaderOffset: fixedHeaderOffset
    };
}(window, jQuery));
