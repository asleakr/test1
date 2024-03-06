;(function($, window, document, undefined) {
    var pluginName = "pwstabs"
      , defaults = {
        effect: 'scale',
        defaultTab: 1,
        containerWidth: '100%',
        tabsPosition: 'horizontal',
        horizontalPosition: 'top',
        verticalPosition: 'left',
        responsive: false,
        theme: '',
        rtl: false
    };
    function Plugin(element, options) {
        this.element = $(element);
        this.$elem = $(this.element);
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }
    Plugin.prototype = {
        init: function() {
            var arEffects = ['scale', 'slideleft', 'slideright', 'slidetop', 'slidedown', 'none'];
            var selector = this.$elem;
            var tabs = selector.find('[data-pws-tab]');
            selector.addClass('pws_tabs_list');
            selector.wrap('<div class="pws_tabs_container"></div>');
            var container = selector.closest('.pws_tabs_container');
            if (this.settings.containerWidth !== '100%')
                container.css('width', this.settings.containerWidth);
            if (this.settings.tabsPosition == 'vertical') {
                this.settings.verticalPosition == 'left' ? container.addClass('pws_tabs_vertical pws_tabs_vertical_left') : container.addClass('pws_tabs_vertical pws_tabs_vertical_right');
            } else {
                this.settings.horizontalPosition == 'top' ? container.addClass('pws_tabs_horizontal pws_tabs_horizontal_top') : container.addClass('pws_tabs_horizontal pws_tabs_horizontal_bottom');
            }
            if (this.settings.rtl)
                container.addClass('pws_tabs_rtl');
            if (this.settings.effect == 'none')
                container.addClass('pws_tabs_noeffect');
            if (this.settings.theme)
                container.addClass(this.settings.theme);
            if ($.inArray(this.settings.effect, arEffects) >= 0)
                container.addClass('pws_' + this.settings.effect);
            else
                container.addClass('pws_scale');
            tabs.addClass('pws_hide');
            if (this.settings.tabsPosition == 'vertical') {
                this.settings.verticalPosition == 'left' ? container.prepend('<ul class="pws_tabs_controll"></ul>') : container.append('<ul class="pws_tabs_controll"></ul>');
            } else {
                this.settings.horizontalPosition == 'top' ? container.prepend('<ul class="pws_tabs_controll"></ul>') : container.append('<ul class="pws_tabs_controll"></ul>');
            }
            var controlls = container.find('.pws_tabs_controll');
            var counter = 1;
            tabs.each(function() {
                $(this).attr('data-pws-tab-id', counter);
                var id = $(this).data('pws-tab');
                var title = $(this).data('pws-tab-name');
                controlls.append('<li><a data-tab-id="' + id + '">' + title + '</a></li>');
                $(this).addClass('pws_tab_single');
                counter++;
            });
            var controller = controlls.find('a');
            var controllerLi = controlls.find('li');
            var defaultTab = selector.find('[data-pws-tab-id="' + this.settings.defaultTab + '"]');
            selector.children('[data-pws-tab-icon]').each(function() {
                var tabId = $(this).attr('data-pws-tab');
                var tabName = $(this).attr('data-pws-tab-name');
                var iconData = $(this).attr('data-pws-tab-icon');
                if (tabName == '') {
                    controlls.find('[data-tab-id="' + tabId + '"]').addClass('pws_tab_noname');
                }
                controlls.find('[data-tab-id="' + tabId + '"]').prepend('<i class="fa ' + iconData + '"></i>');
            });
            if (this.settings.tabsPosition == 'horizontal')
                selector.height(defaultTab.height());
            if (this.settings.tabsPosition == 'vertical') {
                var verticalTabsWidth = controller.outerWidth() + 1;
                var verticalTabsHeight = controlls.outerHeight();
                var verticalContentWidth = container.outerWidth() - verticalTabsWidth;
                var verticalContentHeight = selector.outerHeight();
                controlls.width(verticalTabsWidth);
                selector.outerWidth(verticalContentWidth);
                if (verticalContentHeight < verticalTabsHeight)
                    selector.css('min-height', verticalTabsHeight);
            }
            defaultTab.addClass('pws_show');
            container.find('[data-tab-id="' + defaultTab.data('pws-tab') + '"]').addClass('pws_tab_active');
            controller.on('click', function(e) {
                e.preventDefault();
                controller.removeClass('pws_tab_active');
                $(this).addClass('pws_tab_active');
                var tabId = $(this).data('tab-id');
                var currentTab = container.find('[data-pws-tab="' + tabId + '"]');
                tabs.removeClass('pws_show').addClass('pws_hide');
                currentTab.addClass('pws_show');
                selector.height(currentTab.height());
            });
            if (this.settings.responsive) {
                container.addClass('pws_tabs_responsive');
                var pwsResponsiveControllLiCounter = parseInt(controlls.children('li').length);
                var pwsResponsiveControllLiPercentage = 100 / pwsResponsiveControllLiCounter;
                var pwsResponsiveControllLiMaxHeight = Math.max.apply(null, controllerLi.map(function() {
                    return $(this).height();
                }).get());
                $(window).on('resize load', {
                    pluginSettings: this.settings
                }, function(e) {
                    var $pluginSettings = e.data.pluginSettings;
                    var tabsPosition = $pluginSettings.tabsPosition;
                    var containerWidth = $pluginSettings.containerWidth;
                    if ($(window).width() <= 960) {
                        container.width('');
                        controllerLi.css('width', pwsResponsiveControllLiPercentage + '%');
                        controller.each(function() {
                            $(this).height(pwsResponsiveControllLiMaxHeight);
                        });
                        if (tabsPosition == 'vertical') {
                            controlls.width('');
                            selector.width('');
                            selector.css('min-height', '');
                            selector.height(defaultTab.height());
                        }
                    }
                    if ($(window).width() <= 600) {
                        if (container.find('.pws_responsive_small_menu').length < 1) {
                            $('<div class="pws_responsive_small_menu"><a data-visible="0"><i class="fa fa-bars"></i></a></div>').insertBefore(controlls);
                        }
                        controlls.addClass('pws_tabs_menu_popup');
                        controller.height('');
                        controllerLi.width('');
                        container.find('ul.pws_tabs_menu_popup').hide();
                        container.find('.pws_responsive_small_menu a').click(function(e) {
                            e.preventDefault();
                            if ($(this).attr('data-visible') == '0') {
                                container.find('ul.pws_tabs_menu_popup').show();
                                $(this).attr('data-visible', '1');
                            } else {
                                container.find('ul.pws_tabs_menu_popup').hide();
                                $(this).attr('data-visible', '0');
                            }
                        });
                        container.find('ul.pws_tabs_menu_popup li a').on('click', function(e) {
                            e.preventDefault();
                            $(this).closest('.pws_tabs_menu_popup').hide();
                            container.find('.pws_responsive_small_menu a').attr('data-visible', '0');
                        });
                    } else if ($(window).width() > 960) {
                        container.css('width', containerWidth);
                        controllerLi.width('');
                        controller.height('');
                        container.find('.pws_responsive_small_menu').remove();
                        controlls.removeClass('pws_tabs_menu_popup');
                        controlls.show();
                    } else if ($(window).width() > 600) {
                        container.find('.pws_responsive_small_menu').remove();
                        controlls.removeClass('pws_tabs_menu_popup');
                        controlls.show();
                        controller.on('click', function(e) {
                            e.preventDefault();
                            $(this).parent().parent().show();
                        });
                    }
                });
            }
        }
    };
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            new Plugin(this,options);
        });
    }
    ;
}
)(jQuery, window, document);
(function(a) {
    a.fn.extend({
        dkScroller: function(b) {
            var c = {
                height: "",
                autoplay: false,
                sortable: false,
                speed: "slow",
                displayButtons: true,
                buttonsHeight: 0,
                padding: [0, 0],
                itemsCount: 5,
                ajaxCall: false,
                startIndex: 16,
                serviceUrl: "",
                afterScrollerLoad: function() {}
            };
            var b = a.extend(c, b);
            return this.each(function() {
                var d, l = 0, t = 0, e = b, k = a(this), n = a(".scroller", k), r = a(".items", k), f = a(".productitem", k), m = a(".prev", k), j = a(".next", k), q = a(".more", k);
                g(false);
                d = k.width() - (m.outerWidth(true) + j.outerWidth(true));
                n.width(d).height(e.height);
                m.css("margin-top", (e.height / 2) - (e.buttonsHeight / 2));
                j.css("margin-top", (e.height / 2) - (e.buttonsHeight / 2));
                r.css("right", "0");
                h();
                s();
                if (!e.displayButtons) {
                    o();
                    k.mouseenter(function() {
                        m.css("visibility", "visible");
                        j.css("visibility", "visible")
                    }).mouseleave(function() {
                        o()
                    })
                }
                function o() {
                    m.css("visibility", "hidden");
                    j.css("visibility", "hidden")
                }
                function h() {
                    f.css({
                        width: (d / e.itemsCount) - (e.padding[0] + e.padding[1]),
                        "padding-left": e.padding[0],
                        "padding-right": e.padding[1]
                    });
                    for (var u = 0; u <= f.length; u++) {
                        f.eq(u).css("background", "");
                        if (u % e.itemsCount == 0) {
                            f.eq(u - 1).css("background", "none")
                        } else {
                            if (u == f.length) {
                                f.eq(u - 1).css("background", "none")
                            }
                        }
                    }
                    g(true)
                }
                m.click(function() {
                    if (!m.is(".disabled")) {
                        t += (d / e.itemsCount) * e.itemsCount;
                        r.stop(true, true).animate({
                            right: -t
                        }, e.speed);
                        s()
                    }
                });
                j.click(function() {
                    if (!j.is(".disabled")) {
                        t -= (d / e.itemsCount) * e.itemsCount;
                        r.stop(true, true).animate({
                            right: -t
                        }, e.speed);
                        s()
                    }
                });
                function s() {
                    if (t != 0) {
                        var i = t / f.outerWidth();
                        if (i < f.length && (f.length - i) > e.itemsCount) {
                            m.removeClass("disabled");
                            j.removeClass("disabled")
                        } else {
                            m.addClass("disabled");
                            j.removeClass("disabled");
                            if (e.ajaxCall) {
                                p()
                            }
                        }
                    } else {
                        if (f.length <= e.itemsCount) {
                            m.addClass("disabled");
                            j.addClass("disabled")
                        } else {
                            m.removeClass("disabled");
                            j.addClass("disabled")
                        }
                    }
                }
                function p() {
                    var u = e.startIndex + (e.itemsCount * l), i;
                    if (e.sortable) {
                        i = e.serviceUrl + "&sort=" + k.closest("article").attr("data-sort").toLowerCase() + "&startIndex=" + u
                    } else {
                        i = e.serviceUrl + "&startIndex=" + u
                    }
                    a.ajax({
                        type: "GET",
                        url: i,
                        processData: false,
                        contentType: "application/json; charset=utf-8",
                        dataType: "jsonp",
                        success: function(v) {
                            if (!v.m_Item2) {
                                l++;
                                r.append(v.m_Item1);
                                f = a(".productitem", k);
                                h();
                                e.afterScrollerLoad();
                                r.queue(function() {
                                    m.removeClass("disabled");
                                    a(this).dequeue()
                                })
                            } else {
                                m.addClass("disabled")
                            }
                        },
                        error: function(x, v, w) {
                            window.status = "Error [ " + w + " ]"
                        }
                    })
                }
                function g(i) {
                    if (i) {
                        k.children(".center").remove();
                        n.fadeIn();
                        m.show();
                        j.show();
                        q.show()
                    } else {
                        n.addClass("hidden");
                        m.hide();
                        j.hide();
                        q.hide();
                        k.append("<div class='center rtl' style='height:" + e.height + "px;position:relative'></div>")
                    }
                }
            })
        }
    })
}
)(jQuery);
(function(aG) {
    var bt = 0.75;
    var aL = 700;
    var a0 = 300;
    var bq = 4000;
    var aD = 250;
    var bg = 40;
    var aT = "update_text";
    var ax = "start_timer";
    var aF = "ie6_init";
    var bf = "ie6_cleanup";
    var aS = "lightbox_open";
    var aK = "lightbox_close";
    var aq = "<div id='wtlightbox'><div id='galleryoverlay'/><div id='lightbox'><div class='preloader'/><div class='carouselContainer hidden'><!--<a class='carouselBtn'>تصاویر</a>--><div class='carousel'><div class='carouselWrapper'><div class='carouselInner'></div></div></div><div class='timer'/></div><div class='inner-box'><div class='content'/><div class='desc'><div class='inner-text'/></div><div class='btn-panel'><div id='back-btn'/></div><div class='btn-panel'><div id='fwd-btn'/></div></div><div class='cpanel'><div id='play-btn'/><div id='info'/><div id='close-btn'/></div></div></div>";
    var aC = {
        rotate: true,
        delay: bq,
        easing: "",
        transition_speed: aL,
        display_dbuttons: true,
        display_number: true,
        display_timer: true,
        display_caption: true,
        caption_align: "bottom",
        cont_nav: true,
        auto_fit: true,
        display_thumbnail: true
    };
    var aw;
    var aN;
    var bp;
    var aV;
    var ba;
    var ar;
    var a1;
    var aJ;
    var ay;
    var bb;
    var ao;
    var a3;
    var a7;
    var bm;
    var au;
    var a2;
    var br;
    var aR;
    var a8;
    var bo;
    var aI;
    var aP;
    var bu;
    var av;
    aG(document).ready(function() {
        aQ()
    });
    aG.fn.wtLightBox = function(b) {
        var a = aG(this);
        var c = aG.extend(true, {}, aC, b);
        a.data({
            rotate: c.rotate,
            delay: bd(c.delay, bq),
            duration: bd(c.transition_speed, aL),
            "display-timer": c.display_timer,
            "display-dbuttons": c.display_dbuttons,
            "display-num": c.display_number,
            "cont-nav": c.cont_nav,
            "display-text": c.display_caption,
            "text-align": c.caption_align.toLowerCase(),
            "auto-fit": c.auto_fit,
            "display-thumbnail": c.display_thumbnail,
            easing: c.easing
        }).each(function(d) {
            var e;
            var f;
            var g = aG(this).attr("rel");
            if (g && g != "") {
                e = a.filter("[rel=" + g + "]");
                f = e.index(aG(this))
            } else {
                e = aG(this);
                f = 0
            }
            aG(this).bind("click", {
                index: f,
                group: e,
                obj: a
            }, bc)
        });
        return this
    }
    ;
    var aQ = function() {
        bu = null;
        aG("body").append(aq);
        aw = aG("#galleryoverlay").click(aB);
        aN = aG("#lightbox");
        aV = aN.find("div.preloader");
        aJ = aN.find("div.inner-box");
        bp = aJ.find("div.desc");
        bb = aJ.find("#back-btn");
        a7 = aJ.find("#fwd-btn");
        ay = aJ.find("div.btn-panel").has(bb);
        ao = aJ.find("div.btn-panel").has(a7);
        ba = aN.find("div.cpanel").bind("click", aY);
        ar = ba.find("#play-btn");
        a1 = ba.find("#info");
        CC = aG("div.carouselContainer");
        bm = CC.find("div.timer").data("pct", 1);
        CR = CC.find(".carousel");
        CI = CC.find(".carouselInner");
        si = aG("#scroller .productitem");
        aP = aN.outerWidth() - aN.width();
        bk()
    };
    var bc = function(b) {
        aI = false;
        a2 = aG(b.data.obj);
        br = aG(b.data.group);
        aR = b.data.index;
        a8 = br.size();
        bo = a2.data("cont-nav");
        var f = a2.data("text-align");
        var c = a2.data("display-text");
        var g;
        var d;
        var a;
        var e;
        if (a8 > 1) {
            g = a2.data("rotate");
            d = a2.data("display-timer");
            e = a2.data("display-dbuttons");
            a = a2.data("display-num");
            av = a2.data("display-thumbnail")
        } else {
            g = d = e = a = av = false
        }
        if (g) {
            aN.bind(ax, a5);
            ar.toggleClass("pause", aI).show()
        } else {
            aN.unbind(ax);
            ar.hide()
        }
        if (d) {
            bm.css(f == "top" ? "bottom" : "top", 72).css("visibility", "visible")
        } else {
            bm.css("visibility", "hidden")
        }
        if (e) {
            ay.css("visibility", "visible");
            ao.css("visibility", "visible")
        } else {
            ay.css("visibility", "hidden");
            ao.css("visibility", "hidden")
        }
        if (a) {
            a1.css("visibility", "visible")
        } else {
            a1.css("visibility", "hidden")
        }
        if (c) {
            aN.unbind(aT).bind(aT, az);
            bp.show()
        } else {
            aN.unbind(aT);
            bp.hide()
        }
        aN.data("visible", true).trigger(aF);
        aG(document).unbind("keyup", aE).bind("keyup", aE);
        aw.stop(true, true).css("opacity", bt).show();
        aN.css({
            width: aD,
            height: aD,
            "margin-left": -aD / 2,
            "margin-top": -aD / 2
        }).show();
        aO(aR);
        aG(document).trigger(aS);
        return false
    };
    var aB = function() {
        bl();
        aN.data("visible", false).trigger(bf);
        aG(document).unbind("keyup", aE).unbind("keyup", bv);
        bn();
        bp.stop(true).hide();
        aN.stop(true).hide();
        aw.stop(true).fadeOut("fast");
        aG(document).trigger(aK);
        be("oe");
        return false
    };
    var aO = function(a) {
        bi(a);
        au = aG(br.get(a));
        bn();
        bp.stop(true).hide();
        var b = aG("<img/>");
        aG("div.content", aJ).empty().append(b);
        b.css("opacity", 0).attr("src", au.attr("data-imgurl"));
        if (b[0].complete || b[0].readyState == "complete") {
            aV.hide();
            al(b)
        } else {
            aV.show();
            b.load(function() {
                aV.hide();
                al(b)
            })
        }
    };
    var bi = function(a) {
        CI.find(".thumbnail").each(function() {
            di = aG(this).attr("data-index");
            if (a != di) {
                aG(this).stop().animate({
                    opacity: 0.2
                }, a0)
            } else {
                aG(this).stop().animate({
                    opacity: 0.99
                }, a0)
            }
        })
    };
    var al = function(f) {
        if (aN.data("visible")) {
            if (a2.data("auto-fit")) {
                aM(f[0])
            }
            var e = f[0].width;
            var a = f[0].height;
            var b = a + ba.height();
            var g = a6(e, b);
            var c = -(e + aP) / 2;
            var d = -(b + (aP / 2)) / 2;
            aN.stop(true).animate({
                "margin-left": c,
                "margin-top": (av) ? d - (CR.height() / 2) : d,
                width: e,
                height: (av) ? b + CR.height() : b
            }, g, a2.data("easing"), function() {
                aJ.height(a);
                a1.html((aR + 1) + " از " + a8);
                aN.trigger(aT);
                aU();
                f.animate({
                    opacity: 1
                }, "normal", function() {
                    if (jQuery.browser.msie) {
                        this.style.removeAttribute("filter")
                    }
                    aN.trigger(ax)
                })
            })
        }
    };
    var az = function() {
        var a = au.attr("data-desc");
        if (!a || a == "") {
            a = au.data("text")
        }
        if (a && a != "") {
            bp.find("div.inner-text").html(a);
            var b = a2.data("text-align");
            bp.stop().css("top", b == "bottom" ? aJ.height() : -bp.height()).show().animate({
                top: b == "bottom" ? aJ.height() - bp.height() : 0
            }, "normal")
        }
        if (av) {
            aW()
        }
    };
    var aM = function(d) {
        var c;
        var a = aG(window).width() - aP - bg;
        var b = aG(window).height() - ((aP / 2) + ba.height() + ((av) ? CR.height() : 0) + bg);
        $.browser.chrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());
        if ($.browser.chrome) {
            d.width = d.naturalWidth;
            d.height = d.naturalHeight
        }
        if (d.naturalWidth > a) {
            c = d.naturalHeight / d.naturalWidth;
            d.width = a;
            d.height = c * a
        }
        if (d.naturalHeight > b) {
            c = d.naturalWidth / d.naturalHeight;
            d.width = c * b;
            d.height = b
        }
    };
    var aU = function() {
        aG(document).unbind("keyup", bv).bind("keyup", bv);
        ba.show();
        var a = Math.round(aJ.width() / 2);
        ay.css({
            width: a,
            height: "100%"
        }).unbind().hover(ap, aA);
        if (!bo && aR == 0) {
            ay.css("cursor", "default")
        } else {
            ay.bind("click", an).css("cursor", "pointer");
            bb.show()
        }
        var b = aJ.width() - ay.width();
        ao.css({
            width: b,
            height: "100%"
        }).unbind().hover(a9, bj);
        if (!bo && aR == a8 - 1) {
            ao.css("cursor", "default")
        } else {
            ao.bind("click", bs).css("cursor", "pointer");
            a7.show()
        }
    };
    var bn = function() {
        aG(document).unbind("keyup", bv);
        ba.hide();
        bb.hide();
        a7.hide()
    };
    var aY = function(a) {
        switch (aG(a.target).attr("id")) {
        case "play-btn":
            bh();
            break;
        case "close-btn":
            aB();
            break
        }
    };
    var bh = function() {
        aI = !aI;
        ar.toggleClass("pause", aI);
        aI ? aN.trigger(ax) : aX();
        return false
    };
    var an = function() {
        if (ao.css("visibility") == "visible") {
            bl();
            if (aR < a8 - 1) {
                aR++
            } else {
                if (bo) {
                    aR = 0
                } else {
                    return
                }
            }
            aO(aR)
        }
        return false
    };
    var bs = function() {
        if (ay.css("visibility") == "visible") {
            bl();
            if (aR > 0) {
                aR--
            } else {
                if (bo) {
                    aR = a8 - 1
                } else {
                    return
                }
            }
            aO(aR)
        }
        return false
    };
    var a4 = function() {
        bl();
        bs();
        aO(aR)
    };
    var ap = function() {
        bb.stop().animate({
            "margin-left": 0
        }, a0)
    };
    var aA = function() {
        bb.stop().animate({
            "margin-left": -bb.width()
        }, a0)
    };
    var a9 = function() {
        a7.stop().animate({
            "margin-left": -a7.width()
        }, a0)
    };
    var bj = function() {
        a7.stop().animate({
            "margin-left": 0
        }, a0)
    };
    var bv = function(a) {
        switch (a.keyCode) {
        case 37:
        case 80:
            an();
            break;
        case 39:
        case 78:
            bs();
            break;
        case 32:
            bh();
            break
        }
    };
    var aE = function(a) {
        switch (a.keyCode) {
        case 27:
        case 67:
        case 88:
            aB()
        }
    };
    var a6 = function(a, d) {
        var b = Math.abs(aN.width() - a);
        var c = Math.abs(aN.height() - d);
        return Math.max(a2.data("duration"), b, c)
    };
    var bk = function() {
        if (jQuery.browser.msie) {
            if (parseInt(jQuery.browser.version) <= 6) {
                var a, b;
                aw.css({
                    position: "absolute",
                    width: aG(document).width(),
                    height: aG(document).height()
                });
                aN.css("position", "absolute");
                aG(window).bind("resize", function() {
                    if (b != document.documentElement.clientHeight || a != document.documentElement.clientWidth) {
                        aw.css({
                            width: aG(document).width(),
                            height: aG(document).height()
                        })
                    }
                    a = document.documentElement.clientWidth;
                    b = document.documentElement.clientHeight
                });
                aN.bind(aF, function() {
                    aG("body").find("select").addClass("hide-selects")
                }).bind(bf, function() {
                    aG("body").find("select").removeClass("hide-selects")
                })
            }
        }
    };
    var bl = function() {
        clearTimeout(bu);
        bu = null;
        bm.stop(true).width(0).data("pct", 1)
    };
    var bd = function(b, a) {
        if (!isNaN(b) && b > 0) {
            return b
        }
        return a
    };
}
)(jQuery);
jQuery.fn.anchorAnimate = function(a) {
    a = jQuery.extend({
        speed: 1100
    }, a);
    return this.each(function() {
        var b = this;
        $(b).click(function(f) {
            f.preventDefault();
            var e = window.location.href, g = $(b).attr("href"), d = $("#contentnav").height(), c;
            if ($(".fixed").length) {
                c = $(g).offset().top - (d)
            } else {
                c = $(g).offset().top - ((d * 2) - 55)
            }
            $("html:not(:animated),body:not(:animated)").animate({
                scrollTop: c
            }, a.speed, function() {});
            return false
        })
    })
}
;
$(document).ready(function() {
    page = "Detail";
    if (iStartTime != "0") {
        initializeIncredibleOffer()
    }
    initializeScrollableObjects();
    $("a.anchorLink").anchorAnimate();
    $(".thumbnails .items a").click(function(g) {
        g.preventDefault()
    });
    $('a[rel="gallery"]').wtLightBox({
        rotate: true,
        delay: 4000,
        transition_speed: 600,
        display_number: true,
        display_dbuttons: true,
        display_timer: true,
        display_caption: true,
        caption_align: "bottom",
        cont_nav: true,
        auto_fit: true,
        easing: ""
    });
    $("#userreview .item a").click(function(h) {
        var g = $(this).attr("data-id");
        $("#" + g).slideToggle();
        h.preventDefault()
    })
});
function initializeScrollableObjects() {
    var a;
    if ($(window).width() >= 1240) {
        a = 6;
        $("#relatedproducts").width("1210")
    } else {
        a = 5;
        $("#relatedproducts").width("950")
    }
    $("#relatedproducts .prev").unbind("click");
    $("#relatedproducts .next").unbind("click");
    $("#relatedproducts").dkScroller({
        height: 40,
        boxHeght: 155,
        buttonsHeight: 27,
        padding: [10, 10],
        sortable: true,
        itemBorderWidth: 1,
        itemBorderColor: "transparent",
        itemBorderStyle: "solid",
        itemsCount: a
    });
    $(".thumbnails").dkScroller({
        height: 40,
        boxHeght: 52,
        buttonsHeight: 15,
        padding: [0, 0],
        sortable: true,
        itemsCount: 4
    })
}
jQuery(document).ready(function(e) {
    var linkm = jQuery("#box1-1-2").attr("data-href");
    jQuery("#box1-1-2").load(linkm);
});
jQuery(document).ready(function($) {
    $('.tabset1').pwstabs({
        effect: 'scale',
        defaultTab: 1,
        containerWidth: '989px',
        containerHeight: 'auto'
    });
    $('.pws_demo_colors a').click(function(e) {
        e.preventDefault();
        $('.pws_tabs_container').removeClass('pws_theme_cyan pws_theme_grey pws_theme_violet pws_theme_green pws_theme_yellow pws_theme_gold pws_theme_orange pws_theme_red pws_theme_purple pws_theme_dark_cyan pws_theme_dark_grey pws_theme_dark_violet pws_theme_dark_green pws_theme_dark_yellow pws_theme_dark_gold pws_theme_dark_orange pws_theme_dark_red pws_theme_dark_purple').addClass('pws_theme_' + $(this).attr('data-demo-color'));
    });
});
var ServiceUrl = '/';
var FileServerUrl = '/';
var TemplateServerUrl = '/';
var iStartTime = '0';
jQuery(document).ready(function(e) {
    var linkm = jQuery("#box1-1-2").attr("data-href");
    jQuery("#box1-1-2").load(linkm);
});
;window.Modernizr = function(a, b, c) {
    function z(a) {
        j.cssText = a
    }
    function A(a, b) {
        return z(m.join(a + ";") + (b || ""))
    }
    function B(a, b) {
        return typeof a === b
    }
    function C(a, b) {
        return !!~("" + a).indexOf(b)
    }
    function D(a, b) {
        for (var d in a) {
            var e = a[d];
            if (!C(e, "-") && j[e] !== c)
                return b == "pfx" ? e : !0
        }
        return !1
    }
    function E(a, b, d) {
        for (var e in a) {
            var f = b[a[e]];
            if (f !== c)
                return d === !1 ? a[e] : B(f, "function") ? f.bind(d || b) : f
        }
        return !1
    }
    function F(a, b, c) {
        var d = a.charAt(0).toUpperCase() + a.slice(1)
          , e = (a + " " + o.join(d + " ") + d).split(" ");
        return B(b, "string") || B(b, "undefined") ? D(e, b) : (e = (a + " " + p.join(d + " ") + d).split(" "),
        E(e, b, c))
    }
    var d = "2.6.2", e = {}, f = !0, g = b.documentElement, h = "modernizr", i = b.createElement(h), j = i.style, k, l = {}.toString, m = " -webkit- -moz- -o- -ms- ".split(" "), n = "Webkit Moz O ms", o = n.split(" "), p = n.toLowerCase().split(" "), q = {}, r = {}, s = {}, t = [], u = t.slice, v, w = function(a, c, d, e) {
        var f, i, j, k, l = b.createElement("div"), m = b.body, n = m || b.createElement("body");
        if (parseInt(d, 10))
            while (d--)
                j = b.createElement("div"),
                j.id = e ? e[d] : h + (d + 1),
                l.appendChild(j);
        return f = ["&#173;", '<style id="s', h, '">', a, "</style>"].join(""),
        l.id = h,
        (m ? l : n).innerHTML += f,
        n.appendChild(l),
        m || (n.style.background = "",
        n.style.overflow = "hidden",
        k = g.style.overflow,
        g.style.overflow = "hidden",
        g.appendChild(n)),
        i = c(l, a),
        m ? l.parentNode.removeChild(l) : (n.parentNode.removeChild(n),
        g.style.overflow = k),
        !!i
    }, x = {}.hasOwnProperty, y;
    !B(x, "undefined") && !B(x.call, "undefined") ? y = function(a, b) {
        return x.call(a, b)
    }
    : y = function(a, b) {
        return b in a && B(a.constructor.prototype[b], "undefined")
    }
    ,
    Function.prototype.bind || (Function.prototype.bind = function(b) {
        var c = this;
        if (typeof c != "function")
            throw new TypeError;
        var d = u.call(arguments, 1)
          , e = function() {
            if (this instanceof e) {
                var a = function() {};
                a.prototype = c.prototype;
                var f = new a
                  , g = c.apply(f, d.concat(u.call(arguments)));
                return Object(g) === g ? g : f
            }
            return c.apply(b, d.concat(u.call(arguments)))
        };
        return e
    }
    ),
    q.touch = function() {
        var c;
        return "ontouchstart"in a || a.DocumentTouch && b instanceof DocumentTouch ? c = !0 : w(["@media (", m.join("touch-enabled),("), h, ")", "{#modernizr{top:9px;position:absolute}}"].join(""), function(a) {
            c = a.offsetTop === 9
        }),
        c
    }
    ,
    q.cssanimations = function() {
        return F("animationName")
    }
    ,
    q.csstransitions = function() {
        return F("transition")
    }
    ;
    for (var G in q)
        y(q, G) && (v = G.toLowerCase(),
        e[v] = q[G](),
        t.push((e[v] ? "" : "no-") + v));
    return e.addTest = function(a, b) {
        if (typeof a == "object")
            for (var d in a)
                y(a, d) && e.addTest(d, a[d]);
        else {
            a = a.toLowerCase();
            if (e[a] !== c)
                return e;
            b = typeof b == "function" ? b() : b,
            typeof f != "undefined" && f && (g.className += " " + (b ? "" : "no-") + a),
            e[a] = b
        }
        return e
    }
    ,
    z(""),
    i = k = null,
    function(a, b) {
        function k(a, b) {
            var c = a.createElement("p")
              , d = a.getElementsByTagName("head")[0] || a.documentElement;
            return c.innerHTML = "x<style>" + b + "</style>",
            d.insertBefore(c.lastChild, d.firstChild)
        }
        function l() {
            var a = r.elements;
            return typeof a == "string" ? a.split(" ") : a
        }
        function m(a) {
            var b = i[a[g]];
            return b || (b = {},
            h++,
            a[g] = h,
            i[h] = b),
            b
        }
        function n(a, c, f) {
            c || (c = b);
            if (j)
                return c.createElement(a);
            f || (f = m(c));
            var g;
            return f.cache[a] ? g = f.cache[a].cloneNode() : e.test(a) ? g = (f.cache[a] = f.createElem(a)).cloneNode() : g = f.createElem(a),
            g.canHaveChildren && !d.test(a) ? f.frag.appendChild(g) : g
        }
        function o(a, c) {
            a || (a = b);
            if (j)
                return a.createDocumentFragment();
            c = c || m(a);
            var d = c.frag.cloneNode()
              , e = 0
              , f = l()
              , g = f.length;
            for (; e < g; e++)
                d.createElement(f[e]);
            return d
        }
        function p(a, b) {
            b.cache || (b.cache = {},
            b.createElem = a.createElement,
            b.createFrag = a.createDocumentFragment,
            b.frag = b.createFrag()),
            a.createElement = function(c) {
                return r.shivMethods ? n(c, a, b) : b.createElem(c)
            }
            ,
            a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + l().join().replace(/\w+/g, function(a) {
                return b.createElem(a),
                b.frag.createElement(a),
                'c("' + a + '")'
            }) + ");return n}")(r, b.frag)
        }
        function q(a) {
            a || (a = b);
            var c = m(a);
            return r.shivCSS && !f && !c.hasCSS && (c.hasCSS = !!k(a, "article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),
            j || p(a, c),
            a
        }
        var c = a.html5 || {}, d = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i, e = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i, f, g = "_html5shiv", h = 0, i = {}, j;
        (function() {
            try {
                var a = b.createElement("a");
                a.innerHTML = "<xyz></xyz>",
                f = "hidden"in a,
                j = a.childNodes.length == 1 || function() {
                    b.createElement("a");
                    var a = b.createDocumentFragment();
                    return typeof a.cloneNode == "undefined" || typeof a.createDocumentFragment == "undefined" || typeof a.createElement == "undefined"
                }()
            } catch (c) {
                f = !0,
                j = !0
            }
        }
        )();
        var r = {
            elements: c.elements || "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",
            shivCSS: c.shivCSS !== !1,
            supportsUnknownElements: j,
            shivMethods: c.shivMethods !== !1,
            type: "default",
            shivDocument: q,
            createElement: n,
            createDocumentFragment: o
        };
        a.html5 = r,
        q(b)
    }(this, b),
    e._version = d,
    e._prefixes = m,
    e._domPrefixes = p,
    e._cssomPrefixes = o,
    e.testProp = function(a) {
        return D([a])
    }
    ,
    e.testAllProps = F,
    e.testStyles = w,
    e.prefixed = function(a, b, c) {
        return b ? F(a, b, c) : F(a, "pfx")
    }
    ,
    g.className = g.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (f ? " js " + t.join(" ") : ""),
    e
}(this, this.document),
function(a, b, c) {
    function d(a) {
        return "[object Function]" == o.call(a)
    }
    function e(a) {
        return "string" == typeof a
    }
    function f() {}
    function g(a) {
        return !a || "loaded" == a || "complete" == a || "uninitialized" == a
    }
    function h() {
        var a = p.shift();
        q = 1,
        a ? a.t ? m(function() {
            ("c" == a.t ? B.injectCss : B.injectJs)(a.s, 0, a.a, a.x, a.e, 1)
        }, 0) : (a(),
        h()) : q = 0
    }
    function i(a, c, d, e, f, i, j) {
        function k(b) {
            if (!o && g(l.readyState) && (u.r = o = 1,
            !q && h(),
            l.onload = l.onreadystatechange = null,
            b)) {
                "img" != a && m(function() {
                    t.removeChild(l)
                }, 50);
                for (var d in y[c])
                    y[c].hasOwnProperty(d) && y[c][d].onload()
            }
        }
        var j = j || B.errorTimeout
          , l = b.createElement(a)
          , o = 0
          , r = 0
          , u = {
            t: d,
            s: c,
            e: f,
            a: i,
            x: j
        };
        1 === y[c] && (r = 1,
        y[c] = []),
        "object" == a ? l.data = c : (l.src = c,
        l.type = a),
        l.width = l.height = "0",
        l.onerror = l.onload = l.onreadystatechange = function() {
            k.call(this, r)
        }
        ,
        p.splice(e, 0, u),
        "img" != a && (r || 2 === y[c] ? (t.insertBefore(l, s ? null : n),
        m(k, j)) : y[c].push(l))
    }
    function j(a, b, c, d, f) {
        return q = 0,
        b = b || "j",
        e(a) ? i("c" == b ? v : u, a, b, this.i++, c, d, f) : (p.splice(this.i++, 0, a),
        1 == p.length && h()),
        this
    }
    function k() {
        var a = B;
        return a.loader = {
            load: j,
            i: 0
        },
        a
    }
    var l = b.documentElement, m = a.setTimeout, n = b.getElementsByTagName("script")[0], o = {}.toString, p = [], q = 0, r = "MozAppearance"in l.style, s = r && !!b.createRange().compareNode, t = s ? l : n.parentNode, l = a.opera && "[object Opera]" == o.call(a.opera), l = !!b.attachEvent && !l, u = r ? "object" : l ? "script" : "img", v = l ? "script" : u, w = Array.isArray || function(a) {
        return "[object Array]" == o.call(a)
    }
    , x = [], y = {}, z = {
        timeout: function(a, b) {
            return b.length && (a.timeout = b[0]),
            a
        }
    }, A, B;
    B = function(a) {
        function b(a) {
            var a = a.split("!"), b = x.length, c = a.pop(), d = a.length, c = {
                url: c,
                origUrl: c,
                prefixes: a
            }, e, f, g;
            for (f = 0; f < d; f++)
                g = a[f].split("="),
                (e = z[g.shift()]) && (c = e(c, g));
            for (f = 0; f < b; f++)
                c = x[f](c);
            return c
        }
        function g(a, e, f, g, h) {
            var i = b(a)
              , j = i.autoCallback;
            i.url.split(".").pop().split("?").shift(),
            i.bypass || (e && (e = d(e) ? e : e[a] || e[g] || e[a.split("/").pop().split("?")[0]]),
            i.instead ? i.instead(a, e, f, g, h) : (y[i.url] ? i.noexec = !0 : y[i.url] = 1,
            f.load(i.url, i.forceCSS || !i.forceJS && "css" == i.url.split(".").pop().split("?").shift() ? "c" : c, i.noexec, i.attrs, i.timeout),
            (d(e) || d(j)) && f.load(function() {
                k(),
                e && e(i.origUrl, h, g),
                j && j(i.origUrl, h, g),
                y[i.url] = 2
            })))
        }
        function h(a, b) {
            function c(a, c) {
                if (a) {
                    if (e(a))
                        c || (j = function() {
                            var a = [].slice.call(arguments);
                            k.apply(this, a),
                            l()
                        }
                        ),
                        g(a, j, b, 0, h);
                    else if (Object(a) === a)
                        for (n in m = function() {
                            var b = 0, c;
                            for (c in a)
                                a.hasOwnProperty(c) && b++;
                            return b
                        }(),
                        a)
                            a.hasOwnProperty(n) && (!c && !--m && (d(j) ? j = function() {
                                var a = [].slice.call(arguments);
                                k.apply(this, a),
                                l()
                            }
                            : j[n] = function(a) {
                                return function() {
                                    var b = [].slice.call(arguments);
                                    a && a.apply(this, b),
                                    l()
                                }
                            }(k[n])),
                            g(a[n], j, b, n, h))
                } else
                    !c && l()
            }
            var h = !!a.test, i = a.load || a.both, j = a.callback || f, k = j, l = a.complete || f, m, n;
            c(h ? a.yep : a.nope, !!i),
            i && c(i)
        }
        var i, j, l = this.yepnope.loader;
        if (e(a))
            g(a, 0, l, 0);
        else if (w(a))
            for (i = 0; i < a.length; i++)
                j = a[i],
                e(j) ? g(j, 0, l, 0) : w(j) ? B(j) : Object(j) === j && h(j, l);
        else
            Object(a) === a && h(a, l)
    }
    ,
    B.addPrefix = function(a, b) {
        z[a] = b
    }
    ,
    B.addFilter = function(a) {
        x.push(a)
    }
    ,
    B.errorTimeout = 1e4,
    null == b.readyState && b.addEventListener && (b.readyState = "loading",
    b.addEventListener("DOMContentLoaded", A = function() {
        b.removeEventListener("DOMContentLoaded", A, 0),
        b.readyState = "complete"
    }
    , 0)),
    a.yepnope = k(),
    a.yepnope.executeStack = h,
    a.yepnope.injectJs = function(a, c, d, e, i, j) {
        var k = b.createElement("script"), l, o, e = e || B.errorTimeout;
        k.src = a;
        for (o in d)
            k.setAttribute(o, d[o]);
        c = j ? h : c || f,
        k.onreadystatechange = k.onload = function() {
            !l && g(k.readyState) && (l = 1,
            c(),
            k.onload = k.onreadystatechange = null)
        }
        ,
        m(function() {
            l || (l = 1,
            c(1))
        }, e),
        i ? k.onload() : n.parentNode.insertBefore(k, n)
    }
    ,
    a.yepnope.injectCss = function(a, c, d, e, g, i) {
        var e = b.createElement("link"), j, c = i ? h : c || f;
        e.href = a,
        e.rel = "stylesheet",
        e.type = "text/css";
        for (j in d)
            e.setAttribute(j, d[j]);
        g || (n.parentNode.insertBefore(e, n),
        m(c, 0))
    }
}(this, document),
Modernizr.load = function() {
    yepnope.apply(window, [].slice.call(arguments, 0))
}
;
;(function($, window, undefined) {
    'use strict';
    var Modernizr = window.Modernizr
      , $body = $('body');
    $.DLMenu = function(options, element) {
        this.$el = $(element);
        this._init(options);
    }
    ;
    $.DLMenu.defaults = {
        animationClasses: {
            classin: 'dl-animate-in-1',
            classout: 'dl-animate-out-1'
        },
        onLevelClick: function(el, name) {
            return false;
        },
        onLinkClick: function(el, ev) {
            return false;
        }
    };
    $.DLMenu.prototype = {
        _init: function(options) {
            this.options = $.extend(true, {}, $.DLMenu.defaults, options);
            this._config();
            var animEndEventNames = {
                'WebkitAnimation': 'webkitAnimationEnd',
                'OAnimation': 'oAnimationEnd',
                'msAnimation': 'MSAnimationEnd',
                'animation': 'animationend'
            }
              , transEndEventNames = {
                'WebkitTransition': 'webkitTransitionEnd',
                'MozTransition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'msTransition': 'MSTransitionEnd',
                'transition': 'transitionend'
            };
            this.animEndEventName = animEndEventNames[Modernizr.prefixed('animation')] + '.dlmenu';
            this.transEndEventName = transEndEventNames[Modernizr.prefixed('transition')] + '.dlmenu',
            this.supportAnimations = Modernizr.cssanimations,
            this.supportTransitions = Modernizr.csstransitions;
            this._initEvents();
        },
        _config: function() {
            this.open = false;
            this.$trigger = this.$el.children('.dl-trigger');
            this.$menu = this.$el.children('ul.dl-menu');
            this.$menuitems = this.$menu.find('li:not(.dl-back)');
            this.$el.find('ul.dl-submenu').prepend('<li class="dl-back"><a href="#">Back to the menu</a></li>');
            this.$back = this.$menu.find('li.dl-back');
        },
        _initEvents: function() {
            var self = this;
            this.$trigger.on('click.dlmenu', function() {
                if (self.open) {
                    self._closeMenu();
                } else {
                    self._openMenu();
                }
                return false;
            });
            this.$menuitems.on('click.dlmenu', function(event) {
                event.stopPropagation();
                var $item = $(this)
                  , $submenu = $item.children('ul.dl-submenu');
                if ($submenu.length > 0) {
                    var $flyin = $submenu.clone().css('opacity', 0).insertAfter(self.$menu)
                      , onAnimationEndFn = function() {
                        self.$menu.off(self.animEndEventName).removeClass(self.options.animationClasses.classout).addClass('dl-subview');
                        $item.addClass('dl-subviewopen').parents('.dl-subviewopen:first').removeClass('dl-subviewopen').addClass('dl-subview');
                        $flyin.remove();
                    };
                    setTimeout(function() {
                        $flyin.addClass(self.options.animationClasses.classin);
                        self.$menu.addClass(self.options.animationClasses.classout);
                        if (self.supportAnimations) {
                            self.$menu.on(self.animEndEventName, onAnimationEndFn);
                        } else {
                            onAnimationEndFn.call();
                        }
                        self.options.onLevelClick($item, $item.children('a:first').text());
                    });
                    return false;
                } else {
                    self.options.onLinkClick($item, event);
                }
            });
            this.$back.on('click.dlmenu', function(event) {
                var $this = $(this)
                  , $submenu = $this.parents('ul.dl-submenu:first')
                  , $item = $submenu.parent()
                  , $flyin = $submenu.clone().insertAfter(self.$menu);
                var onAnimationEndFn = function() {
                    self.$menu.off(self.animEndEventName).removeClass(self.options.animationClasses.classin);
                    $flyin.remove();
                };
                setTimeout(function() {
                    $flyin.addClass(self.options.animationClasses.classout);
                    self.$menu.addClass(self.options.animationClasses.classin);
                    if (self.supportAnimations) {
                        self.$menu.on(self.animEndEventName, onAnimationEndFn);
                    } else {
                        onAnimationEndFn.call();
                    }
                    $item.removeClass('dl-subviewopen');
                    var $subview = $this.parents('.dl-subview:first');
                    if ($subview.is('li')) {
                        $subview.addClass('dl-subviewopen');
                    }
                    $subview.removeClass('dl-subview');
                });
                return false;
            });
        },
        closeMenu: function() {
            if (this.open) {
                this._closeMenu();
            }
        },
        _closeMenu: function() {
            var self = this
              , onTransitionEndFn = function() {
                self.$menu.off(self.transEndEventName);
                self._resetMenu();
            };
            this.$menu.removeClass('dl-menuopen');
            this.$menu.addClass('dl-menu-toggle');
            this.$trigger.removeClass('dl-active');
            if (this.supportTransitions) {
                this.$menu.on(this.transEndEventName, onTransitionEndFn);
            } else {
                onTransitionEndFn.call();
            }
            this.open = false;
        },
        openMenu: function() {
            if (!this.open) {
                this._openMenu();
            }
        },
        _openMenu: function() {
            var self = this;
            $body.off('click').on('click.dlmenu', function() {
                self._closeMenu();
            });
            this.$menu.addClass('dl-menuopen dl-menu-toggle').on(this.transEndEventName, function() {
                $(this).removeClass('dl-menu-toggle');
            });
            this.$trigger.addClass('dl-active');
            this.open = true;
        },
        _resetMenu: function() {
            this.$menu.removeClass('dl-subview');
            this.$menuitems.removeClass('dl-subview dl-subviewopen');
        }
    };
    var logError = function(message) {
        if (window.console) {
            window.console.error(message);
        }
    };
    $.fn.dlmenu = function(options) {
        if (typeof options === 'string') {
            var args = Array.prototype.slice.call(arguments, 1);
            this.each(function() {
                var instance = $.data(this, 'dlmenu');
                if (!instance) {
                    logError("cannot call methods on dlmenu prior to initialization; " + "attempted to call method '" + options + "'");
                    return;
                }
                if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
                    logError("no such method '" + options + "' for dlmenu instance");
                    return;
                }
                instance[options].apply(instance, args);
            });
        } else {
            this.each(function() {
                var instance = $.data(this, 'dlmenu');
                if (instance) {
                    instance._init();
                } else {
                    instance = $.data(this, 'dlmenu', new $.DLMenu(options,this));
                }
            });
        }
        return this;
    }
    ;
}
)(jQuery, window);
$(function() {
    $('#dl-menu').dlmenu();
});
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-36251023-1']);
_gaq.push(['_setDomainName', 'jqueryscript.net']);
_gaq.push(['_trackPageview']);
(function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
}
)();
$(function() {
    $("\x2e\x68\x65\x2d\x77\x72\x61\x70").live({
        mouseenter: function() {
            var b = $(this).find("\x2e\x68\x65\x2d\x76\x69\x65\x77").addClass("\x68\x65\x2d\x76\x69\x65\x77\x2d\x73\x68\x6f\x77");
            $("\x5b\x64\x61\x74\x61\x2d\x61\x6e\x69\x6d\x61\x74\x65\x5d", b).each(function() {
                var c = $(this).data("\x61\x6e\x69\x6d\x61\x74\x65");
                $(this).addClass(c)
            });
            $(this).find("\x2e\x68\x65\x2d\x7a\x6f\x6f\x6d").addClass("\x68\x65\x2d\x76\x69\x65\x77\x2d\x73\x68\x6f\x77")
        },
        mouseleave: function() {
            var b = $(this).find("\x2e\x68\x65\x2d\x76\x69\x65\x77").removeClass("\x68\x65\x2d\x76\x69\x65\x77\x2d\x73\x68\x6f\x77");
            $("\x5b\x64\x61\x74\x61\x2d\x61\x6e\x69\x6d\x61\x74\x65\x5d", b).each(function() {
                var c = $(this).data("\x61\x6e\x69\x6d\x61\x74\x65");
                $(this).removeClass(c)
            });
            $(this).find("\x2e\x68\x65\x2d\x7a\x6f\x6f\x6d").removeClass("\x68\x65\x2d\x76\x69\x65\x77\x2d\x73\x68\x6f\x77")
        },
        mousewheel: function(b, c, d, e) {
            if ($(this).find("\x2e\x68\x65\x2d\x73\x6c\x69\x64\x65\x72\x73").length == 0x1) {
                var f = $(this).find("\x2e\x68\x65\x2d\x73\x6c\x69\x64\x65\x72\x73");
                var g = e > 0x0 ? 0x1 : -0x1;
                a.fn.switchImg(f, g);
                b.preventDefault()
            } else if ($(this).find("\x2e\x68\x65\x2d\x7a\x6f\x6f\x6d").length == 0x1) {
                var f = $(this).find("\x2e\x68\x65\x2d\x7a\x6f\x6f\x6d");
                a.fn.changeZoom(f, b, c, d, e);
                b.preventDefault()
            }
        }
    })
});
function load() {
    $(".f2").load("/menu.inc");
}
