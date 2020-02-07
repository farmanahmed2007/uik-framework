/* ---------------------------------------------------------------------------
 * Initialized
 * --------------------------------------------------------------------------- */
var overLayVisible = false;
var isMobile = false;
var is_sticky = false;
var tabletL = 1024;

$(function () {
    'use strict';

    $(window).resize(responsiveMenu);

    if (window.innerWidth < tabletL) {
        isMobile = true;
        $('.menu_wrapper .menu').detach().appendTo('.menu_wrapper_slide');
    }

    if ($('.menu_wrapper').hasClass('uik_menu_slide_right')) {
        sideSlide();
    }
	sideSlide();

    /* Sound on or off */
    $(document).on('click', '.sound-control a', function () {
        $('.sound-control a i').toggleClass('icon-volume-up icon-volume-off');
    });

    // Drop-down Toggle
    $(document).on('mouseover', '.dropdown_btn', function () {
        $('.dropdown').removeClass('open');
        $('.dropdown_list').removeClass('active');
        $(this).parent().addClass('open');
        $(this).addClass('active');
        $(this).parent().find('.dropdown_list').addClass('active');
    });
    $(document).on('mouseleave', '.dropdown_btn, .dropdown_list', function () {
        $(this).removeClass('active');
    })
    $('.dropdown').mouseleave(function (e) {
        $(this).removeClass('open');
        var container = $('.dropdown_list');
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            $(container).removeClass('active');
        };
    });

    $(document).on('click', '.keywordSearch .search-responsive', function () {
        $('.keywordSearch .quicksearch-container').toggle();
    });

    /* EFFECTS ON HEADER ON SCROLL */
    $(document).on('scroll', function () {
        var scroll = $(document).scrollTop();

        // STICKY HEADER - WHEN BODY HAS "uik_sticky_header"
        var header = $('.uik_sticky_header #header');
        var headerHeight = $(header).height();
        if (scroll >= headerHeight) {
            if (!is_sticky) {
                header.addClass('is_sticky').animate({
                    'top': '0px'
                }, 500);
                is_sticky = true;
            }
        } else if (scroll <= headerHeight) {
            header.removeClass('is_sticky').removeAttr('style');
            is_sticky = false;

        }

        // RESIZE LOGO - WHEN BODY HAS "uik_floating_header"
        var floatingHeader = $('.uik_floating_header #header');
        var floatingHeaderHeight = $(floatingHeader).height();
        if (scroll >= floatingHeaderHeight) {
            if (!is_sticky) {
                floatingHeader.addClass('is_sticky').animate({
                    'top': '0px'
                }, 500);
                is_sticky = true;
            }
            floatingHeader.find('.logo').addClass('logo-mini');
        } else if (scroll <= floatingHeaderHeight) {
            floatingHeader.removeClass('is_sticky').removeAttr('style');
            is_sticky = false;
            floatingHeader.find('.logo').removeClass('logo-mini');
        }
    });

});

/* ---------------------------------------------------------------------------
 * Functions
 * --------------------------------------------------------------------------- */

/* Activate Menu in Side Slide Panel */
function sideSlide() {

    var slide = $('.menu_wrapper_slide');
    var overlay = $('#overlay');

    // click | Open
    $(document).on('click', "#topBar .responsive-menu", function(e) {
        e.preventDefault();
        slide.animate({
            'right': 0
        }, 300);
        slide.addClass('open');
        $('body').animate({
            'left': -250
        }, 300);
        $('#topBar').animate({
            'left': 250
        }, 300);
        overlay.fadeIn(300);
        overLayVisible = true;
    });

    // click | close
    $('#close_menu, #overlay').click(function (e) {
        e.preventDefault();
        slide.animate({
            'right': -250
        }, 300);
        slide.removeClass('open');
        $('body').animate({
            'left': 0
        }, 300);
        $('#topBar').animate({
            'left': 0
        }, 300);
        overlay.fadeOut(300);
        overLayVisible = false;
    });

}

/* Responsive Menu */
function responsiveMenu() {

    var slideMenu = $('.menu_wrapper .menu');
    var slideMenuResponsive = $('.menu_wrapper_slide .menu');

    if (window.innerWidth > tabletL && overLayVisible) {
        $('#overlay').trigger('click');
    }

    if (window.innerWidth < tabletL && !isMobile) {
        isMobile = true;
        slideMenu.detach().appendTo('.menu_wrapper_slide');
    } else if (window.innerWidth >= tabletL && isMobile) {
        isMobile = false;
        slideMenuResponsive.detach().appendTo('.menu_wrapper');
    }

}