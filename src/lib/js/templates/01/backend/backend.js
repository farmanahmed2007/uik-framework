// Make sure jQuery has been loaded
if (typeof jQuery === 'undefined') {
    throw new Error('requires jQuery')
}

/* BoxRefresh()
 * =========
 * Adds AJAX content control to a box.
 *
 * @Usage: $('#my-box').boxRefresh(options)
 *         or add [data-widget="box-refresh"] to the box element
 *         Pass any option as data-option="value"
 */
+

function($) {
    'use strict'

    var DataKey = 'lte.boxrefresh'

    var Default = {
        source: '',
        params: {},
        trigger: '.refresh-btn',
        content: '.box-body',
        loadInContent: true,
        responseType: '',
        overlayTemplate: '<div class="overlay"><div class="icon-refresh fa-spin"></div></div>',
        onLoadStart: function() {},
        onLoadDone: function(response) {
            return response
        }
    }

    var Selector = {
        data: '[data-widget="box-refresh"]'
    }

    // BoxRefresh Class Definition
    // =========================
    var BoxRefresh = function(element, options) {
        this.element = element
        this.options = options
        this.$overlay = $(options.overlay)

        if (options.source === '') {
            throw new Error('Source url was not defined. Please specify a url in your BoxRefresh source option.')
        }

        this._setUpListeners()
        this.load()
    }

    BoxRefresh.prototype.load = function() {
        this._addOverlay()
        this.options.onLoadStart.call($(this))

        $.get(this.options.source, this.options.params, function(response) {
            if (this.options.loadInContent) {
                $(this.options.content).html(response)
            }
            this.options.onLoadDone.call($(this), response)
            this._removeOverlay()
        }.bind(this), this.options.responseType !== '' && this.options.responseType)
    }

    // Private

    BoxRefresh.prototype._setUpListeners = function() {
        $(this.element).on('click', Selector.trigger, function(event) {
            if (event) event.preventDefault()
            this.load()
        }.bind(this))
    }

    BoxRefresh.prototype._addOverlay = function() {
        $(this.element).append(this.$overlay)
    }

    BoxRefresh.prototype._removeOverlay = function() {
        $(this.element).remove(this.$overlay)
    }

    // Plugin Definition
    // =================
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data(DataKey)

            if (!data) {
                var options = $.extend({}, Default, $this.data(), typeof option == 'object' && option)
                $this.data(DataKey, (data = new BoxRefresh($this, options)))
            }

            if (typeof data == 'string') {
                if (typeof data[option] == 'undefined') {
                    throw new Error('No method named ' + option)
                }
                data[option]()
            }
        })
    }

    var old = $.fn.boxRefresh

    $.fn.boxRefresh = Plugin
    $.fn.boxRefresh.Constructor = BoxRefresh

    // No Conflict Mode
    // ================
    $.fn.boxRefresh.noConflict = function() {
        $.fn.boxRefresh = old
        return this
    }

    // BoxRefresh Data API
    // =================
    $(window).on('load', function() {
        $(Selector.data).each(function() {
            Plugin.call($(this))
        })
    })

}(jQuery)


/* BoxWidget()
 * ======
 * Adds box widget functions to boxes.
 *
 * @Usage: $('.my-box').boxWidget(options)
 *         This plugin auto activates on any element using the `.box` class
 *         Pass any option as data-option="value"
 */
+

function($) {
    'use strict'

    var DataKey = 'lte.boxwidget'

    var Default = {
        animationSpeed: 500,
        collapseTrigger: '[data-widget="collapse"]',
        removeTrigger: '[data-widget="remove"]',
        collapseIcon: 'fa-minus',
        expandIcon: 'fa-plus',
        removeIcon: 'fa-times'
    }

    var Selector = {
        data: '.box',
        collapsed: '.collapsed-box',
        body: '.box-body',
        footer: '.box-footer',
        tools: '.box-tools'
    }

    var ClassName = {
        collapsed: 'collapsed-box'
    }

    var Event = {
        collapsed: 'collapsed.boxwidget',
        expanded: 'expanded.boxwidget',
        removed: 'removed.boxwidget'
    }

    // BoxWidget Class Definition
    // =====================
    var BoxWidget = function(element, options) {
        this.element = element
        this.options = options

        this._setUpListeners()
    }

    BoxWidget.prototype.toggle = function() {
        var isOpen = !$(this.element).is(Selector.collapsed)

        if (isOpen) {
            this.collapse()
        } else {
            this.expand()
        }
    }

    BoxWidget.prototype.expand = function() {
        var expandedEvent = $.Event(Event.expanded)
        var collapseIcon = this.options.collapseIcon
        var expandIcon = this.options.expandIcon

        $(this.element).removeClass(ClassName.collapsed)

        $(this.element)
            .find(Selector.tools)
            .find('.' + expandIcon)
            .removeClass(expandIcon)
            .addClass(collapseIcon)

        $(this.element).find(Selector.body + ', ' + Selector.footer)
            .slideDown(this.options.animationSpeed, function() {
                $(this.element).trigger(expandedEvent)
            }.bind(this))
    }

    BoxWidget.prototype.collapse = function() {
        var collapsedEvent = $.Event(Event.collapsed)
        var collapseIcon = this.options.collapseIcon
        var expandIcon = this.options.expandIcon

        $(this.element)
            .find(Selector.tools)
            .find('.' + collapseIcon)
            .removeClass(collapseIcon)
            .addClass(expandIcon)

        $(this.element).find(Selector.body + ', ' + Selector.footer)
            .slideUp(this.options.animationSpeed, function() {
                $(this.element).addClass(ClassName.collapsed)
                $(this.element).trigger(collapsedEvent)
            }.bind(this))
    }

    BoxWidget.prototype.remove = function() {
        var removedEvent = $.Event(Event.removed)

        $(this.element).slideUp(this.options.animationSpeed, function() {
            $(this.element).trigger(removedEvent)
            $(this.element).remove()
        }.bind(this))
    }

    // Private

    BoxWidget.prototype._setUpListeners = function() {
        var that = this

        $(this.element).on('click', this.options.collapseTrigger, function(event) {
            if (event) event.preventDefault()
            that.toggle()
        })

        $(this.element).on('click', this.options.removeTrigger, function(event) {
            if (event) event.preventDefault()
            that.remove()
        })
    }

    // Plugin Definition
    // =================
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data(DataKey)

            if (!data) {
                var options = $.extend({}, Default, $this.data(), typeof option == 'object' && option)
                $this.data(DataKey, (data = new BoxWidget($this, options)))
            }

            if (typeof option == 'string') {
                if (typeof data[option] == 'undefined') {
                    throw new Error('No method named ' + option)
                }
                data[option]()
            }
        })
    }

    var old = $.fn.boxWidget

    $.fn.boxWidget = Plugin
    $.fn.boxWidget.Constructor = BoxWidget

    // No Conflict Mode
    // ================
    $.fn.boxWidget.noConflict = function() {
        $.fn.boxWidget = old
        return this
    }

    // BoxWidget Data API
    // ==================
    $(window).on('load', function() {
        $(Selector.data).each(function() {
            Plugin.call($(this))
        })
    })

}(jQuery)


/* PushMenu()
 * ==========
 * Adds the push menu functionality to the sidebar.
 *
 * @usage: $('.btn').pushMenu(options)
 *          or add [data-toggle="push-menu"] to any button
 *          Pass any option as data-option="value"
 */
+

function($) {
    'use strict'

    var DataKey = 'lte.pushmenu'

    var Default = {
        collapseScreenSize: 767,
        expandOnHover: false,
        expandTransitionDelay: 200
    }

    var Selector = {
        collapsed: '.sidebar-collapse',
        open: '.sidebar-open',
        mainSidebar: '.main-sidebar',
        contentWrapper: '.content-wrapper',
        searchInput: '.sidebar-form .form-control',
        button: '[data-toggle="push-menu"]',
        mini: '.sidebar-mini',
        expanded: '.sidebar-expanded-on-hover',
        layoutFixed: '.fixed'
    }

    var ClassName = {
        collapsed: 'sidebar-collapse',
        open: 'sidebar-open',
        mini: 'sidebar-mini',
        expanded: 'sidebar-expanded-on-hover',
        expandFeature: 'sidebar-mini-expand-feature',
        layoutFixed: 'fixed'
    }

    var Event = {
        expanded: 'expanded.pushMenu',
        collapsed: 'collapsed.pushMenu'
    }

    // PushMenu Class Definition
    // =========================
    var PushMenu = function(options) {
        this.options = options
        this.init()
    }

    PushMenu.prototype.init = function() {
        if (this.options.expandOnHover ||
            ($('body').is(Selector.mini + Selector.layoutFixed))) {
            this.expandOnHover()
            $('body').addClass(ClassName.expandFeature)
        }

        $(Selector.contentWrapper).click(function() {
            // Enable hide menu when clicking on the content-wrapper on small screens
            if ($(window).width() <= this.options.collapseScreenSize && $('body').hasClass(ClassName.open)) {
                this.close()
            }
        }.bind(this))

        // __Fix for android devices
        $(Selector.searchInput).click(function(e) {
            e.stopPropagation()
        })
    }

    PushMenu.prototype.toggle = function() {
        var windowWidth = $(window).width()
        var isOpen = !$('body').hasClass(ClassName.collapsed)

        if (windowWidth <= this.options.collapseScreenSize) {
            isOpen = $('body').hasClass(ClassName.open)
        }

        if (!isOpen) {
            this.open()
        } else {
            this.close()
        }
    }

    PushMenu.prototype.open = function() {
        var windowWidth = $(window).width()

        if (windowWidth > this.options.collapseScreenSize) {
            $('body').removeClass(ClassName.collapsed)
                .trigger($.Event(Event.expanded))
        } else {
            $('body').addClass(ClassName.open)
                .trigger($.Event(Event.expanded))
        }
    }

    PushMenu.prototype.close = function() {
        var windowWidth = $(window).width()
        if (windowWidth > this.options.collapseScreenSize) {
            $('body').addClass(ClassName.collapsed)
                .trigger($.Event(Event.collapsed))
        } else {
            $('body').removeClass(ClassName.open + ' ' + ClassName.collapsed)
                .trigger($.Event(Event.collapsed))
        }
    }

    PushMenu.prototype.expandOnHover = function() {
        $(Selector.mainSidebar).hover(function() {
            if ($('body').is(Selector.mini + Selector.collapsed) &&
                $(window).width() > this.options.collapseScreenSize) {
                this.expand()
            }
        }.bind(this), function() {
            if ($('body').is(Selector.expanded)) {
                this.collapse()
            }
        }.bind(this))
    }

    PushMenu.prototype.expand = function() {
        setTimeout(function() {
            $('body').removeClass(ClassName.collapsed)
                .addClass(ClassName.expanded)
        }, this.options.expandTransitionDelay)
    }

    PushMenu.prototype.collapse = function() {
        setTimeout(function() {
            $('body').removeClass(ClassName.expanded)
                .addClass(ClassName.collapsed)
        }, this.options.expandTransitionDelay)
    }

    // PushMenu Plugin Definition
    // ==========================
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data(DataKey)

            if (!data) {
                var options = $.extend({}, Default, $this.data(), typeof option == 'object' && option)
                $this.data(DataKey, (data = new PushMenu(options)))
            }

            if (option === 'toggle') data.toggle()
        })
    }

    var old = $.fn.pushMenu

    $.fn.pushMenu = Plugin
    $.fn.pushMenu.Constructor = PushMenu

    // No Conflict Mode
    // ================
    $.fn.pushMenu.noConflict = function() {
        $.fn.pushMenu = old
        return this
    }

    // Data API
    // ========
    $(document).on('click', Selector.button, function(e) {
        e.preventDefault()
        Plugin.call($(this), 'toggle')
    })
    $(window).on('load', function() {
        Plugin.call($(Selector.button))
    })
}(jQuery)


/* Tree()
 * ======
 * Converts a nested list into a multilevel
 * tree view menu.
 *
 * @Usage: $('.my-menu').tree(options)
 *         or add [data-widget="tree"] to the ul element
 *         Pass any option as data-option="value"
 */
+

function($) {
    'use strict'

    var DataKey = 'lte.tree'

    var Default = {
        animationSpeed: 500,
        accordion: true,
        followLink: false,
        trigger: '.treeview a'
    }

    var Selector = {
        tree: '.tree',
        treeview: '.treeview',
        treeviewMenu: '.treeview-menu',
        open: '.menu-open, .active',
        li: 'li',
        data: '[data-widget="tree"]',
        active: '.active'
    }

    var ClassName = {
        open: 'menu-open',
        tree: 'tree'
    }

    var Event = {
        collapsed: 'collapsed.tree',
        expanded: 'expanded.tree'
    }

    // Tree Class Definition
    // =====================
    var Tree = function(element, options) {
        this.element = element
        this.options = options

        $(this.element).addClass(ClassName.tree)

        $(Selector.treeview + Selector.active, this.element).addClass(ClassName.open)

        this._setUpListeners()

    }

    Tree.prototype.toggle = function(link, event) {
        var treeviewMenu = link.next(Selector.treeviewMenu)
        var parentLi = link.parent()
        var isOpen = parentLi.hasClass(ClassName.open)

        if (!parentLi.is(Selector.treeview)) {
            return
        }

        if (!this.options.followLink || link.attr('href') === '#') {
            event.preventDefault()
        }

        if (isOpen) {
            this.collapse(treeviewMenu, parentLi)

        } else {
            this.expand(treeviewMenu, parentLi)
        }
    }

    Tree.prototype.expand = function(tree, parent) {
        var expandedEvent = $.Event(Event.expanded)

        if (this.options.accordion) {
            var openMenuLi = parent.siblings(Selector.open)
            var openTree = openMenuLi.children(Selector.treeviewMenu)
            this.collapse(openTree, openMenuLi)
        }

        parent.addClass(ClassName.open)
        tree.slideDown(this.options.animationSpeed, function() {
            $(this.element).trigger(expandedEvent)
        }.bind(this))
    }

    Tree.prototype.collapse = function(tree, parentLi) {
        var collapsedEvent = $.Event(Event.collapsed)

        tree.find(Selector.open).removeClass(ClassName.open)
        parentLi.removeClass(ClassName.open)
        tree.slideUp(this.options.animationSpeed, function() {
            tree.find(Selector.open + ' > ' + Selector.treeview).slideUp()
            $(this.element).trigger(collapsedEvent)
        }.bind(this))
    }

    // Private

    Tree.prototype._setUpListeners = function() {
        var that = this

        $(this.element).on('click', this.options.trigger, function(event) {
            that.toggle($(this), event)

        })
    }

    // Plugin Definition
    // =================
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data(DataKey)

            if (!data) {
                var options = $.extend({}, Default, $this.data(), typeof option == 'object' && option)
                $this.data(DataKey, new Tree($this, options))
            }
        })
    }

    var old = $.fn.tree

    $.fn.tree = Plugin
    $.fn.tree.Constructor = Tree

    // No Conflict Mode
    // ================
    $.fn.tree.noConflict = function() {
        $.fn.tree = old
        return this
    }

    // Tree Data API
    // =============
    $(window).on('load', function() {
        $(Selector.data).each(function() {
            Plugin.call($(this))
            $.fn.scrollView = function() {
                return this.each(function() {
                    var theOffset
                    $('.sidebar').animate({
                        scrollTop: $(this).offset().top - 50
                    }, 1000);
                    theOffset = parseInt($('.sidebar').offset().top)
                    $('.slimScrollBar').css('top', theOffset + 100)

                });

                $('.sidebar-menu li').click(function(event) {
                    event.preventDefault();
                    $('.sidebar-menu li.active').scrollView();
                });
            }
            $('.sidebar-menu li.active').scrollView();

        })
    })


}(jQuery)