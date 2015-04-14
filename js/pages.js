(function($) {

    Loader.restart();

    Images.replace($('main[role="main"]'), '.responsive.no-load');

    $(MQ).on('changeMedia', function() {
        Images.resize('.responsive');
    });

})(jQuery);