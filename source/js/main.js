//= require "bootstrap"

$(function() {
  // show definition popups
  $('.akn-term').popover({
    placement: 'top',
    trigger: 'hover',
    html: true,
    template: '<div class="popover term-definition"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
    delay: { show: 500 },
    title: function() {
      var term_id = $(this).data('refersto').replace('#', '');
      return $('#defn-' + term_id).data('term');
    },
    content: function() {
      var term_id = $(this).data('refersto').replace('#', '');
      return $('#defn-' + term_id).html();
    }
  });

  // load recent blog posts
  (function() {
    var container = $('#recent-blog-posts');

    if (container.length && tumblr_api_read) {
      var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      $.each(tumblr_api_read.posts, function(i, post) {
        var li = $('#recent-blog-posts li.template').clone();
        var date = new Date(post['unix-timestamp']*1000);

        $('.day', li).text(date.getDate());
        $('.month', li).text(months[date.getMonth()]);

        $('h4', li).text(post['regular-title']);
        $('p', li).text(post['regular-body'].slice(0, 200) + "...");
        $('a', li).attr('href', post['url-with-slug']);

        li.removeClass('hidden');
        li.removeClass('template');
        container.append(li);
      });
    }
  })();
});

$(function() {
  // social buttons
  $('.fb-share').on('click', function(e) {
    e.preventDefault();
    var url = $(this).data('href');

    window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url),
                "share", "width=600, height=400, scrollbars=no");
    ga('send', 'social', 'facebook', 'share', url);
  });
});
