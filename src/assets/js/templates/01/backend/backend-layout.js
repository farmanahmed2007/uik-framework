/* Layout() */

$(function() {
    'use strict'

    var DataKey = 'lte.layout'

    var Default = {
        slimscroll: true,
        resetHeight: true
    }

    var Selector = {
        wrapper: '.wrapper',
        contentWrapper: '.content-wrapper',
        mainFooter: '.main-footer',
        mainHeader: '.main-header',
        sidebar: '.sidebar',
        controlSidebar: '.control-sidebar',
        fixed: '.fixed',
        sidebarMenu: '.sidebar-menu',
        logo: '.main-header .logo'
    }

    var ClassName = {
        fixed: 'fixed',
        holdTransition: 'hold-transition'
    }

    var Layout = function(options) {
        this.options = options
        this.bindedResize = false
        this.activate()
    }

    Layout.prototype.activate = function() {
        this.fix()

        $('body').removeClass(ClassName.holdTransition)

        if (!this.bindedResize) {
            $(window).resize(function() {
                this.fix()

                $(Selector.logo + ', ' + Selector.sidebar).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
                    this.fix()
                }.bind(this))
            }.bind(this))

            this.bindedResize = true
        }

        $(Selector.sidebarMenu).on('expanded.tree', function() {
            this.fix()
        }.bind(this))

        $(Selector.sidebarMenu).on('collapsed.tree', function() {
            this.fix()
        }.bind(this))
    }

    Layout.prototype.fix = function() {
        // Remove overflow from .wrapper if layout-boxed exists
        $(Selector.layoutBoxed + ' > ' + Selector.wrapper).css('overflow', 'hidden')

        // Get window height and the wrapper height
        var footerHeight = $(Selector.mainFooter).outerHeight() || 0
        var neg = $(Selector.mainHeader).outerHeight() + footerHeight
        var windowHeight = $(window).height()
        var sidebarHeight = $(Selector.sidebar).height() || 0

        // Set the min-height of the content and sidebar based on
        // the height of the document.
        if ($('body').hasClass(ClassName.fixed)) {
            $(Selector.contentWrapper).css('min-height', windowHeight - footerHeight)
        } else {
            var postSetHeight

            if (windowHeight >= sidebarHeight) {
                $(Selector.contentWrapper).css('min-height', windowHeight - neg)
                postSetHeight = windowHeight - neg
            } else {
                $(Selector.contentWrapper).css('min-height', sidebarHeight)
                postSetHeight = sidebarHeight
            }

            // Fix for the control sidebar height
            var $controlSidebar = $(Selector.controlSidebar)
            if (typeof $controlSidebar !== 'undefined') {
                if ($controlSidebar.height() > postSetHeight)
                    $(Selector.contentWrapper).css('min-height', $controlSidebar.height())
            }
        }
    }

    // Plugin Definition
    // =================
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data(DataKey)

            if (!data) {
                var options = $.extend({}, Default, $this.data(), typeof option === 'object' && option)
                $this.data(DataKey, (data = new Layout(options)))
            }

            if (typeof option === 'string') {
                if (typeof data[option] === 'undefined') {
                    throw new Error('No method named ' + option)
                }
                data[option]()
            }
        })
    }

    var old = $.fn.layout

    $.fn.layout = Plugin
    $.fn.layout.Constuctor = Layout

    // No conflict mode
    // ================
    $.fn.layout.noConflict = function() {
        $.fn.layout = old
        return this
    }

    // Layout DATA-API
    // ===============
    $(window).on('load', function() {
        Plugin.call($('body'))
    })
});


$.AdminLTESidebarTweak = {};

$.AdminLTESidebarTweak.options = {
    EnableRemember: true,
    NoTransitionAfterReload: true
        //Removes the transition after page reload.
};

$(function() {
    "use strict";

    $("body").on("collapsed.pushMenu", function() {
        if ($.AdminLTESidebarTweak.options.EnableRemember) {
            localStorage.setItem("toggleState", "closed");
        }
    });

    $("body").on("expanded.pushMenu", function() {
        if ($.AdminLTESidebarTweak.options.EnableRemember) {
            localStorage.setItem("toggleState", "opened");
        }
    });

    if ($.AdminLTESidebarTweak.options.EnableRemember) {
        var toggleState = localStorage.getItem("toggleState");
        if (toggleState == 'closed') {
            if ($.AdminLTESidebarTweak.options.NoTransitionAfterReload) {
                $("body").addClass('sidebar-collapse hold-transition').delay(100).queue(function() {
                    $(this).removeClass('hold-transition');
                });
            } else {
                $("body").addClass('sidebar-collapse');
            }
        }
    }
});