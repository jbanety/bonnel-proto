(function(sk, $) {

    var Loader = window.Loader = {
        util: new sk.utils.Loader()
    };
    Loader.$element = $('#page-loader');
    Loader.$text = Loader.$element.find('.status');
    Loader.$progress = Loader.$element.find('.circle');
    Loader.$logo = Loader.$element.find('.logo-status').get(0);
    Loader.Countdown = new sk.widgets.CountdownCircle($('<span />').appendTo(Loader.$progress), {time: 0}).init();
    Loader.tween = null;
    Loader.imgLoad = null;
    Loader.isFirstLoad = Loader.$element.hasClass('loader-main');
    Loader.restart = function() {
        this.$element.appendTo($('main[role="main"]'));
        this.$text.text(0);
        this.Countdown.barReset();
        this.loadObj = {
            prc: 0
        };
    }
    Loader.change = function(prc) {
        this.tween = TweenMax.to(this.loadObj, (Loader.isFirstLoad ? 1 : 0.4), {
            prc: prc, //ease:Expo.easeOut,
            overwrite: true,
            onComplete: prc >= 100 ? this.complete : null,
            onCompleteScope: this,
            onUpdate: this.update,
            onUpdateScope: this,
            ease: Linear.easeNone
        })
    }
    Loader.update = function() {
        if (!this.isFirstLoad) {
            this.$text.text(Math.round(this.loadObj.prc));
            this.Countdown.barTick(this.loadObj.prc);
        } else {
            Loader.$logo.style.width = this.loadObj.prc + '%';
        }
    }
    Loader.complete = function() {
        this.$loadElement.trigger('afterload');
        this.tween = null;
        this.imgLoad = null;
    }

    Loader.loadingImages = function(prcMax) {
        var _this = this;
        this.tween && this.tween.kill();
        var currentPrc = Math.round(this.loadObj.prc);
        var prcMax = 100 - currentPrc;

        // responsive images, neresponsivovat nenaÄtenÃ© obrÃ¡zky z galerie
        Images.replace(this.$loadElement, '.responsive:not(.no-load)');

        // load
        this.imgLoad = this.util.load(this.util.getImages(this.$loadElement, {
            'selector': '*:not(iframe, object, embed, script, style, .no-load)'
        }));

        var fn = function(obj) {
            var tested = obj.tested || 1;
            var length = obj.length || 1;
            var prc = Math.round(prcMax / length * tested);
            _this.change(currentPrc + prc);
        };

        this.imgLoad.dfr.progress(fn).done(fn);
    };

    Loader.show = function() {
        TweenMax.to(this.$element, 1, {
            autoAlpha: 1,
            overwrite: true
        })
    }

    Loader.hide = function() {
        TweenMax.to(this.$element, 1.15, {
            autoAlpha: 0,
            overwrite: true,
            ease: Cubic.easeIn,
            onComplete: function() {
                if (this.isFirstLoad) {
                    this.isFirstLoad = false;
                    this.$element.removeClass('loader-main');

                    // second load no ajax browser
                    if (!Modernizr.history) {
                        var date = new Date();
                        var minutes = 10;
                        date.setTime(date.getTime() + (minutes * 60 * 1000));
                        $.cookie("secondLoad", "true", {expires: date});
                    }
                }
            },
            onCompleteScope: this,
        })
    }

    Loader.stop = function() {
        this.tween && this.tween.kill();
        this.imgLoad && this.imgLoad.abort();
    }

})(sk, jQuery);