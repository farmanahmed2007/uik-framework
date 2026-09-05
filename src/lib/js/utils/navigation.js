/* ---------------------------------------------------------------------------
 * UIK Navigation
 *
 * Header, drop-down and slide-out menu behaviour.
 *
 * State lives on a single private `state` object rather than as loose module
 * variables, and initialization is exposed as `window.UIKNavigation.init()` so
 * it can be re-run against markup that arrives after DOM-ready (and so it can
 * be tested). Every selector and CSS class below is part of the public markup
 * contract and is unchanged.
 * --------------------------------------------------------------------------- */
(function (window, $) {
    'use strict';

    // Matches $tablet-landscape-width in src/lib/sass/partials/_variables.scss.
    var TABLET_LANDSCAPE = 1024;

    var state = {
        overlayVisible: false,
        mobile: false,
        // Sticky and floating headers are independent features. They previously
        // shared one flag, so a page using both had each reset the other's state.
        stickyHeader: false,
        floatingHeader: false,
        initialized: false
    };

    /* -----------------------------------------------------------------------
     * Slide-out menu
     * --------------------------------------------------------------------- */

    function openSlideMenu(e) {
        e.preventDefault();
        $('.menu_wrapper_slide').animate({ 'right': 0 }, 300).addClass('open');
        $('body').animate({ 'left': -250 }, 300);
        $('#topBar').animate({ 'left': 250 }, 300);
        $('#overlay').fadeIn(300);
        state.overlayVisible = true;
    }

    function closeSlideMenu(e) {
        e.preventDefault();
        $('.menu_wrapper_slide').animate({ 'right': -250 }, 300).removeClass('open');
        $('body').animate({ 'left': 0 }, 300);
        $('#topBar').animate({ 'left': 0 }, 300);
        $('#overlay').fadeOut(300);
        state.overlayVisible = false;
    }

    /* -----------------------------------------------------------------------
     * Responsive menu relocation
     * --------------------------------------------------------------------- */

    /**
     * Moves the menu between its inline wrapper and the slide-out panel.
     * Guarded: `.detach().appendTo(<empty set>)` inserts nowhere and would drop
     * the menu out of the document permanently, so a missing destination is a
     * no-op instead.
     */
    function moveMenu(fromSelector, toSelector) {
        var $menu = $(fromSelector);
        var $destination = $(toSelector);

        if (!$menu.length || !$destination.length) {
            return false;
        }
        $menu.detach().appendTo($destination);
        return true;
    }

    function responsiveMenu() {
        if (window.innerWidth > TABLET_LANDSCAPE && state.overlayVisible) {
            $('#overlay').trigger('click');
        }

        if (window.innerWidth < TABLET_LANDSCAPE && !state.mobile) {
            state.mobile = true;
            moveMenu('.menu_wrapper .menu', '.menu_wrapper_slide');
        } else if (window.innerWidth >= TABLET_LANDSCAPE && state.mobile) {
            state.mobile = false;
            moveMenu('.menu_wrapper_slide .menu', '.menu_wrapper');
        }
    }

    /* -----------------------------------------------------------------------
     * Header effects on scroll
     * --------------------------------------------------------------------- */

    function stickHeader($header, isStuck) {
        if (!$header.length) {
            return isStuck;
        }
        if (!isStuck) {
            $header.addClass('is_sticky').animate({ 'top': '0px' }, 500);
        }
        return true;
    }

    function unstickHeader($header) {
        if ($header.length) {
            $header.removeClass('is_sticky').removeAttr('style');
        }
        return false;
    }

    function onScroll() {
        var scroll = $(document).scrollTop();

        // Sticky header — when <body> carries "uik_sticky_header".
        var $sticky = $('.uik_sticky_header #header');
        if ($sticky.length) {
            if (scroll >= $sticky.height()) {
                state.stickyHeader = stickHeader($sticky, state.stickyHeader);
            } else {
                state.stickyHeader = unstickHeader($sticky);
            }
        }

        // Shrinking logo — when <body> carries "uik_floating_header".
        var $floating = $('.uik_floating_header #header');
        if ($floating.length) {
            if (scroll >= $floating.height()) {
                state.floatingHeader = stickHeader($floating, state.floatingHeader);
                $floating.find('.logo').addClass('logo-mini');
            } else {
                state.floatingHeader = unstickHeader($floating);
                $floating.find('.logo').removeClass('logo-mini');
            }
        }
    }

    /* -----------------------------------------------------------------------
     * Initialization
     * --------------------------------------------------------------------- */

    function bindHandlers() {
        // Slide-out menu. Delegated, so it also works for markup added later.
        $(document)
            .on('click', '#topBar .responsive-menu', openSlideMenu)
            .on('click', '#close_menu, #overlay', closeSlideMenu);

        // Sound on / off.
        $(document).on('click', '.sound-control a', function () {
            $('.sound-control a i').toggleClass('icon-volume-up icon-volume-off');
        });

        // Drop-downs.
        $(document).on('mouseover', '.dropdown_btn', function () {
            $('.dropdown').removeClass('open');
            $('.dropdown_list').removeClass('active');
            $(this).parent().addClass('open');
            $(this).addClass('active');
            $(this).parent().find('.dropdown_list').addClass('active');
        });

        $(document).on('mouseleave', '.dropdown_btn, .dropdown_list', function () {
            $(this).removeClass('active');
        });

        $(document).on('mouseleave', '.dropdown', function (e) {
            $(this).removeClass('open');
            var $list = $(this).find('.dropdown_list');
            if (!$list.is(e.target) && $list.has(e.target).length === 0) {
                $list.removeClass('active');
            }
        });

        // Responsive quick-search.
        $(document).on('click', '.keywordSearch .search-responsive', function () {
            $('.keywordSearch .quicksearch-container').toggle();
        });

        $(document).on('scroll', onScroll);
        $(window).on('resize', responsiveMenu);
    }

    /**
     * Wires up navigation. Safe to call more than once: handlers are registered
     * on the first call only, so repeated calls cannot double-bind (which
     * previously caused every open/close to run two animation chains).
     */
    function init() {
        if (!state.initialized) {
            bindHandlers();
            state.initialized = true;
        }

        if (window.innerWidth < TABLET_LANDSCAPE) {
            state.mobile = true;
            moveMenu('.menu_wrapper .menu', '.menu_wrapper_slide');
        }
    }

    $(init);

    window.UIKNavigation = {
        init: init,
        responsiveMenu: responsiveMenu,
        /** Exposed for tests and for callers that need to inspect menu state. */
        getState: function () {
            return $.extend({}, state);
        }
    };
}(window, jQuery));
