(function(sk, $) {

    window.Images = {

        replace: function($element, selector) {
            $element.find(selector).each(function() {
                    var $this = $(this);

                    var data = $this.data();
                    var url = data['image' + MQ.params.width];

                    if (url) {
                        $this.removeClass(function (index, css) {
                            return (css.match (/(^|\s)img-\S+/g) || []).join(' ');
                        });
                        $this.addClass('img-' + MQ.params.width);
                        if ($this[0].tagName.toLowerCase() === 'img') {
                            $this.attr('src', url);
                        } else {
                            $this.css('background-image', 'url(' + url + ')');
                        }
                    }
                });
        },
        resize: function(selector) {
            $(selector).each(function(index, el) {
                    var $this = $(this);
                    var data = $this.data();
                    var url = data['image' + MQ.params.width];

                    if (url) {
                        $('<img />').on('load', function(event) {
                            $this.removeClass(function (index, css) {
                                return (css.match (/(^|\s)img-\S+/g) || []).join(' ');
                            });
                            $this.addClass('img-' + MQ.params.width);
                            if ($this[0].tagName.toLowerCase() === 'img') {
                                $this.attr('src', url);
                            } else {
                                $this.css('background-image', 'url(' + url + ')');
                            }
                        }).attr('src', url)
                    }
                });
        }
    };

})(sk, jQuery);