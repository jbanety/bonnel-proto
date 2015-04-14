(function($) {

    // Default ease
    TweenLite.defaultEase = Expo.easeInOut;

    // Page load
    var pageAnim = new TimelineMax({
        delay: .25
    })

    Loader.restart();

    // IPad height fix iOS7
    if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i) && window.innerHeight != document.documentElement.clientHeight) {
        var fixViewportHeight = function() {
            document.documentElement.style.height = window.innerHeight + "px";
            if (document.body.scrollTop !== 0) {
                window.scrollTo(0, 0);
            }
        }.bind(this);

        window.addEventListener("scroll", fixViewportHeight, false);
        window.addEventListener("orientationchange", fixViewportHeight, false);
        fixViewportHeight();

        document.body.style.webkitTransform = "translate3d(0,0,0)";
    }

    pageAnim
        .addCallback(function() {
            setTimeout(function() {
                Loader.$loadElement = $('main[role="main"]');
                Loader.loadingImages();
            }, 200)
        })
        .to( Loader.$element, 1, { autoAlpha: 1, delay: -.2 });

    // disable image saving (context menu on right click)
    $(document).on('contextmenu', 'img', function() {
        return false;
    });

    // Plugins call
    $(document).one('afterload', function(event) {

        $(document).trigger('contentload');

        Loader.hide();

        setTimeout(function() {
            $(document).trigger('contentplay', true);
        }, 400);
    }).on('contentload', function(event) {

        Images.replace(Loader.$loadElement, '.responsive.no-load');

        // load
        Loader.imgLoad = Loader.util.load(Loader.util.getImages(Loader.$loadElement, {
            'selector': '*.no-load'
        }));

        var $box = $('#slider');

        var Slideshow = new window.Slideshow.create($box, {
            timeout: 0,
            Pager: {
                pagerPages: $box.find('.pages')
            }
        }).init();

        $(Slideshow).on('initplay', function(event, firstPlay) {
            $(Slideshow).trigger('beforechange');

            TweenMax.to($box.find('.pager'), .5, {
                right: 20,
                ease: Quad.easeOut,
                overwrite: true,
                delay: firstPlay ? .3 : .1,
                onComplete: function() {
                    $(Slideshow).trigger('afterchange')
                }
            });

        }).on('initstop', function(event) {
            // kill all zoom
            var tween = this.$currentSlide.data('tween');
            tween && tween.kill && tween.kill();

            if (this.$beforeSlide) {
                var tween = this.$beforeSlide.data('tween');
                tween && tween.kill && tween.kill();
            }

        }).on('beforechange', function(event) {

            this.$currentSlide.find('.content > *').css({
                'left': '',
                'opacity': ''
            });

            TweenMax.set(this.$currentSlide.find('> .bg'), {
                x: 0,
                y: 0,
                z: 0,
                scale: 1,
                opacity: 1
            });

            var $bg = this.$currentSlide.find('> .bg')

            this.$currentSlide.data('tween', TweenMax.to($bg, 10, {
                css: {
                    scale: 1.1,
                    x: -( $bg.width() * 0.05 ),
                    y: -( $bg.height() * 0.05 ),
                    z: 0.1,
                    rotationZ: "0.01deg",
                    transformOrigin: "0 0",
                    force3D: true
                },
                ease: Linear.easeNone,
                force3D: true,
                overwrite: true
            }));



        }).on('afterchange', function(event, state) {

            var self = this;

            // kill old zoom
            if (this.$beforeSlide) {
                var tween = this.$beforeSlide.data('tween');
                tween && tween.kill && tween.kill();

                var tween = this.$beforeSlide.data('timeline');
                tween && tween.kill && tween.kill();
            }

            var tl = new TimelineMax();

            this.$currentSlide.data('timeline', tl);

            tl.to(this.$currentSlide.find('> .bg'), .8, {
                opacity: .7,
                ease: Quad.easeInOut
            }, '0.15').staggerTo(this.$currentSlide.find('.content > *'), 1, {
                opacity: 1,
                left: 0,
                ease: Quad.easeOut
            }, 0.2, '-=0.3', function() {
                setTimeout(function() {
                    tl.staggerTo(self.$currentSlide.find('.content > *'), 1, {
                        opacity: 0,
                        left: -50,
                        ease: Quad.easeOut
                    }, 0.2, '-=0.3');
                }, 1500);
            });

        });

        $box.data('app-slideshow', Slideshow)

    }).on('contentplay', function(event, firstPlay) {

        var $box = $('#slider');
        var Slideshow = $box.data('app-slideshow');

        if (Slideshow) {
            Slideshow.options.timeout = 5000;
            Slideshow.resetInterval();

            $(Slideshow).trigger('initplay', firstPlay)
        }

    }).on('contentunload', function(event) {

        var $box = $('#slider');
        var Slideshow = $box.data('app-slideshow');

        if (Slideshow) {
            Slideshow.destroy();
            $(Slideshow).trigger('initstop').off('beforechange afterchange');
        }
    });

    $(MQ).on('changeMedia', function() {
        Images.resize('.responsive');
    });

})(jQuery);