(function(sk, $){

    window.MQ = new sk.utils.MediaQueries({
        selector : $('<div id="mq" />').appendTo('body'),
        queries: {
            '0px': {
                state: 'desktop-1024',
                params: {
                    width: 1024
                }
            },
            '10px': {
                state: 'desktop-1600',
                params: {
                    width: 1600
                }
            },
            '20px': {
                state: 'desktop-1900',
                params: {
                    width: 1920
                }
            }
        }
    });
    window.MQ.init();

})(sk, jQuery);