/*global jQuery, window, Modernizr, lang_home */

(function ($, window, document) {
	"use strict";


    $.fn.life = function (types, data, fn) {
        $(this.context).on(types, this.selector, data, fn);
        return this;
    };
	
	$(function () {

		if ($('.breadcrumbs').length) {
			$('.breadcrumbs .menu').prepend('<a href="/">' + lang_home + '</a>');
			var last_breadcrumb_link = $('.breadcrumbs').find('a').last();
			$(last_breadcrumb_link).replaceWith($(last_breadcrumb_link).text());
		}

		$('.main').prepend('<div id="info_popup-wrapper"><ul id="info_popup-wrapper-page"><li><div class="info_popup"></div></li></ul></div>');

		$(".js_option_checkbox").life('click', function () {
			if ($(this).is(":checked")) {
				$(this).val(1);
			} else {
				$(this).val(0);
			}
		});

		/* Facebook comments*/
		if ($('.fb-comments').length) {

			(function (d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) {
					return;
				}
				js = d.createElement(s);
				js.id = id;
				js.src = "//connect.facebook.net/en_EN/all.js#xfbml=1";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));

		}
        
        /* Log in handler */
        var log_in_checked = false;
        $(".form-account #loginform").life('submit', function (e) {
            if(log_in_checked === true){
                return;
            }
            var login = $(".form-account #user_login").val(),
                pass = $(".form-account #user_pass").val(),
                self = $(this);
                
            if(login !== '' && pass !== ''){
                e.preventDefault();
                var data = {
                    'action': "app_cardealer_login_check",
                    'login': login,
                    'pass': pass
                };
                $.post(ajaxurl, data, function (response) {
                    if (response === '1') {
                        log_in_checked = true;
                        self.trigger('submit');
                    }else if(response === '-1'){
                        $(".form-account #user_login").trigger('focus');
                        show_info_popup(lang_failed_login_l);
                    }else if(response === '-2'){
                        $(".form-account #user_pass").trigger('focus');
                        show_info_popup(lang_failed_login_p);
                    }
                });
            }
            log_in_checked = false;
            return false;
		});

		/* ---------------------------------------------------- */
		/*	Main Navigation										*/
		/* ---------------------------------------------------- */

		(function () {

			var arrowimages = {
					down: 'downarrowclass',
					right: 'rightarrowclass'
				}, $mainNav = $('#navigation').find('ul').eq(0),
				optionsList = '<option>Navigation</option>',
				$submenu = $mainNav.find("ul").parent();
			$submenu.each(function (i) {
				var $curobj = $(this);
				this.istopheader = $curobj.parents("ul").length === 1 ? true : false;
				$curobj.children("a").append('<span class="' + (this.istopheader ? arrowimages.down : arrowimages.right) + '"></span>');
			});

			$mainNav.on('mouseenter', 'li',function () {
				var $this = $(this), $subMenu = $this.children('ul');
				if ($subMenu.length) {
					$this.addClass('hover');
				}
				$subMenu.hide().stop(true, true).fadeIn(200);
			}).on('mouseleave', 'li', function () {
				$(this).removeClass('hover').children('ul').stop(true, true).fadeOut(50);
			});

			// Navigation Responsive

			$('.nav-responsive').on('click', function(e) {
				e.preventDefault();
				if ($(this).hasClass('active')) {
					$(this).removeClass('active');
				} else {
					$(this).addClass('active');
				}
			});

			$('.nav-responsive').on('change', function () {
				window.location = $(this).val();
			});

		}());

		/* end Main Navigation */

		/* ---------------------------------------------------- */
		/*	Listing Tabs										*/
		/* ---------------------------------------------------- */

		(function () {

			if ($('.layout-switcher').length) {

				var switcherLinks = $('.layout-switcher a');

				switcherLinks.on('click', function () {

					var $this = $(this),
						css_class = $this.data('css-class'),
						items = $('#change-items');
					$this.siblings('a').removeClass('active').end().addClass('active');
					items.removeClass('item-grid item-list').addClass(css_class);

					$.cookie("cars_listing_layout_class", css_class, {
						expires: 365,
						path: "/"
					});

					return false;
				});

			}

			/* end Listing Tabs */

		}());

		/* ---------------------------------------------------- */
		/*	Titles												*/
		/* ---------------------------------------------------- */

		(function () {

			if ($('#page_cms .section-title h2').length) {

				var titles = $('#page_cms .section-title h2');

				titles.each(function (idx, val) {
					var titleItem = "", text, first, $this = $(val);

					if ($this.hasClass('comment-reply-title')) {

						titleItem = $this.contents().filter(function () {
							return this.nodeType == Node.TEXT_NODE;
						}).text();

						text = titleItem.split(" ");
						first = text.shift();
						$this.html(function (index, value) {
							return "<span>" + first + " " + "</span>" + value.split(" ").slice(1).join(" ");
						});

					} else {
						titleItem = $this.text();
                        titleItem = $.trim(titleItem);
						text = titleItem.split(" ");
						first = text.shift();
						$this.html("<span>" + first + " " + "</span>" + text.join(" "));
					}

				});

			}

		}());

		/* end Titles */



		/* ---------------------------------------------------------------------- */
		/*	Placeholder															  */
		/* ---------------------------------------------------------------------- */

		(function () {

			$.fn.placeholder();

		}());

		/* end Placeholder */

		(function () {

			/* ---------------------------------------------------- */
			/*	Image Post Slider									*/
			/* ---------------------------------------------------- */

			if ($('.image-post-slider > ul').length) {

				var $postslider = $('.image-post-slider > ul');

				$(window).load(function () {

					$postslider.each(function (i) {

						var $this = $(this);

						if ($this.children('li').length < 2) {
							return;
						}

                        $this.css('height', $this.children('li:first').height())
                            .after('<div class="post-slider-nav"><a class="prevBtn post-nav-prev-' + i + '">Prev</a><a class="nextBtn post-nav-next-' + i + '">Next</a> </div>')
                            .cycle({
                                containerResize: true,
                                easing: 'easeInOutExpo',
                                fx: 'fixedScrollHorz',
                                fit: true,
                                next: '.post-nav-next-' + i,
                                pause: true,
                                prev: '.post-nav-prev-' + i,
                                slideResize: true,
                                speed: 600,
                                timeout: 5000
                            }).data('slideCount', $this.children('li').length);

					});

					// Pause on Nav Hover
					$('.post-slider-nav a').on('mouseenter',function () {
						$(this).parent().prev().cycle('pause');
					}).on('mouseleave', function () {
						$(this).parent().prev().cycle('resume');
					});

					// Hide navigation if only a single slide
					if ($postslider.data('slideCount') <= 1) {
						$postslider.next('.post-slider-nav').hide();
					}

					// Resize
					$(window).on('resize', function () {
						$postslider.css('height', $postslider.find('li:visible img').height());
					});

					// Include Swipe
					if (Modernizr.touch) {
						$postslider.swipe({
							swipeLeft: swipeFunc,
							swipeRight: swipeFunc,
							allowPageScroll: 'auto'
						});
					}

				});
			}

		}());

        /* ---------------------------------------------------- */
        /*	Video fit width                    */
        /* ---------------------------------------------------- */

        $.fn.extend({
            fitVids: function(options) {
                var settings = {
                    customSelector: null
                };

                if (!document.getElementById('fit-vids-style')) {

                    var div = document.createElement('div'),
                        ref = document.getElementsByTagName('base')[0] || document.getElementsByTagName('script')[0],
                        cssStyles = '&shy;<style>.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}</style>';

                    div.className = 'fit-vids-style';
                    div.id = 'fit-vids-style';
                    div.style.display = 'none';
                    div.innerHTML = cssStyles;

                    ref.parentNode.insertBefore(div, ref);

                }

                if (options) {
                    $.extend(settings, options);
                }

                return this.each(function() {
                    var selectors = [
                        "iframe[src*='player.vimeo.com']",
                        "iframe[src*='youtube.com']",
                        "iframe[src*='youtube-nocookie.com']",
                        "iframe[src*='kickstarter.com'][src*='video.html']",
                        "object",
                        "embed"
                    ];

                    if (settings.customSelector) {
                        selectors.push(settings.customSelector);
                    }

                    var $allVideos = $(this).find(selectors.join(','));
                    $allVideos = $allVideos.not("object object"); // SwfObj conflict patch

                    $allVideos.each(function() {
                        var $this = $(this);
                        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) {
                            return;
                        }
                        if($this.attr('width').indexOf('%') !== -1 || $this.attr('height').indexOf('%') !== -1){
                            return;
                        }
                        var height = (this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10)))) ? parseInt($this.attr('height'), 10) : $this.height(),
                            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
                            aspectRatio = height / width;
                        if (!$this.attr('id')) {
                            var videoID = 'fitvid' + Math.floor(Math.random() * 999999);
                            $this.attr('id', videoID);
                        }
                        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100) + "%");
                        $this.removeAttr('height').removeAttr('width').show();
                    });
                });
            }
        });

        $('.container').fitVids();


		/* ---------------------------------------------------------------------- */
		/*	Fancybox															  */
		/* ---------------------------------------------------------------------- */

		(function () {

			if ($('.single-image.fancybox').length) {

				$('.single-image.fancybox').fancybox({
					'titleShow': true,
					'padding': '10',
					'transitionIn': 'fade',
					'transitionOut': 'fade',
					'easingIn': 'easeOutBack',
					'easingOut': 'easeInBack',
					helpers: {
						title: {
							type: 'over'
						}
					}
				});

			}

			if ($('a.video-image-youtube').length) {
				$('a.video-image-youtube').on('click', function () {
					var href = '';

					if (this.href.indexOf('watch?v=') !== -1) {
						href = this.href.replace(new RegExp("watch\\?v=", "i"), 'v/') + '&autoplay=1';
					} else {
						href = this.href.replace(new RegExp("youtu.be/", "i"), 'www.youtube.com/v/') + '&autoplay=1';
					}

					$.fancybox({
						'titleShow': false,
						'transitionIn': 'elastic',
						'transitionOut': 'elastic',
						'href': href,
						'type': 'swf',
						'swf': {'wmode': 'transparent', 'allowfullscreen': 'true'},
						'centerOnScroll': true,
						'speedIn': 100,
						'speedOut': 50,
						'width': 640,
						'height': 480
					});
					return false;
				});
			}

			if ($('a.video-image-vimeo').length) {
				$('a.video-image-vimeo').on('click', function () {
					$.fancybox({
						'type': 'iframe',
						'href': this.href.replace(new RegExp("vimeo.com", "i"), 'player.vimeo.com/video') + '?title=0&amp;byline=0&amp;portrait=0&amp;color=f6e200',
						'overlayShow': true,
						'centerOnScroll': true,
						'speedIn': 100,
						'speedOut': 50,
						'width': 640,
						'height': 480
					});

					return false;
				});
			}

		}());

		/* end fancybox --> End */

		/* ---------------------------------------------------- */
		/*	jCarousel											*/
		/* ---------------------------------------------------- */

		(function () {

			if ($('.col-scroll').length) {

				if ($(window).width() > 767) {

                    var maxHeight = 0;
                    $('.data-feature').each(function(e, i) {
                        $(i).find('li').each(function(e, i){
                            var height = $(i).height();
                            if(height > maxHeight) maxHeight = height;
                        });
                    });
                    $('.data-feature').find('li').height(maxHeight );

					$('.col-scroll').carouFredSel({
						responsive: true,
						auto: false,
						prev: "#carou_prev",
						next: "#carou_next",
						width: '100%',
						scroll: 2,
						items: {
							width: 190,
							visible: {
								min: 3,
								max: 4
							}
						}
					}).on('click', '.js_remove_car_from_compare_list', function () {
						$(this).parents('.col').animate({
							opacity: 0
						}, 500).animate({
							width: 0,
							margin: 0,
							borderWidth: 0
						}, 500, function () {
							$(".col-scroll").trigger("removeItem", $(this));
						});
						return false;
					});

				}

			}
                        
		}());

		/* end jCarousel */

	});

	/* ---------------------------------------------------------------------- */
	/*	Plugins																  */
	/* ---------------------------------------------------------------------- */

	/* ---------------------------------------------------- */
	/*	Placeholder											*/
	/* ---------------------------------------------------- */

	$.fn.placeholder = function () {

		if (typeof document.createElement("input").placeholder === 'undefined') {
			$('[placeholder]').focus(function () {
				var input = $(this);
				if (input.val() === input.attr('placeholder')) {
					input.val('');
					input.removeClass('placeholder');
				}
			}).blur(function () {
				var input = $(this);
				if (input.val() === '' || input.val() === input.attr('placeholder')) {
					input.addClass('placeholder');
					input.val(input.attr('placeholder'));
				}
			}).blur().parents('form').submit(function () {
				$(this).find('[placeholder]').each(function () {
					var input = $(this);
					if (input.val() === input.attr('placeholder')) {
						input.val('');
					}
				})
			});
		}
	};


	/* ---------------------------------------------------- */
	/*	Tabs												*/
	/* ---------------------------------------------------- */

	$.fn.tabs = function () {

		var $this = $(this);

		$this.each(function (idx, val) {
			var $tabsNav = $('.tabs-nav', $(val)),
				$tabsNavLis = $tabsNav.children('li'),
				$tabsContent = $('.tab-content', $(val));

			$tabsNavLis.first().addClass('active').show();
			$tabsContent.first().show();

			$tabsNav.on('click', 'li', function (e) {
				var $this = $(this), $index = $this.index();
				$this.siblings('li').removeClass('active').end().addClass('active');
				$tabsContent.hide().eq($index).fadeIn(300);
				e.preventDefault();
			});

		});
	};

	/* ---------------------------------------------------------------------- */
	/*	Actual Plugin														  */
	/* ---------------------------------------------------------------------- */

	// jQuery Actual Plugin (http://dreamerslab.com/)
	;
	(function (a) {
		a.fn.extend({
			actual: function (b, k) {
				var c, d, h, g, f, j, e, i;
				if (!this[b]) {
					throw'$.actual => The jQuery method "' + b + '" you called does not exist';
				}
				h = a.extend({
					absolute: false,
					clone: false,
					includeMargin: undefined
				}, k);
				d = this;
				if (h.clone === true) {
					e = function () {
						d = d.filter(":first").clone().css({
							position: "absolute",
							top: -1000
						}).appendTo("body");
					};
					i = function () {
						d.remove();
					};
				} else {
					e = function () {
						c = d.parents().andSelf().filter(":hidden");
						g = h.absolute === true ? {
							position: "absolute",
							visibility: "hidden",
							display: "block"
						} : {
							visibility: "hidden",
							display: "block"
						};
						f = [];
						c.each(function () {
							var m = {}, l;
							for (l in g) {
								m[l] = this.style[l];
								this.style[l] = g[l];
							}
							f.push(m);
						});
					};
					i = function () {
						c.each(function (m) {
							var n = f[m], l;
							for (l in g) {
								this.style[l] = n[l];
							}
						});
					};
				}
				e();
				j = /(outer)/g.test(b) ? d[b](h.includeMargin) : d[b]();
				i();
				return j;
			}
		});
	})(jQuery);

	/* end Actual Plugin */

})(jQuery, window, document);