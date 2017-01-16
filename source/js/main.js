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
      var term = $('#defn-' + term_id).data('term');
      if (window.ga) ga('send', 'event', 'term-popup', term_id);
      return term;
    },
    content: function() {
      var term_id = $(this).data('refersto').replace('#', '');
      return $('#defn-' + term_id).html();
    }
  });
});

$(function() {
  // track outbound links
  $('a[href^=http]').on('click', function(e) {
    ga('send', 'event', 'outbound-click', e.target.href);
  });
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

  $('.twitter-share').on('click', function(e) {
    e.preventDefault();
    var url = $(this).data('href');

    window.open("https://twitter.com/intent/tweet?" +
                "text=" + encodeURIComponent($(this).data('text')) +
                "&url=" + encodeURIComponent(url) +
                "&via=OpenByLawsZA",
                "share", "width=364, height=250, scrollbars=no");
    ga('send', 'social', 'twitter', 'share', url);
  });
});

$(function() {
  var $nav = $('.about-nav');

  if ($nav.length) {
    $nav.affix({
      offset: $nav.offset().top - 20,
    });
  }
});

$(function() {
  var $toc = $('aside.toc');

  if ($toc.length && $toc.height() < $('article.akoma-ntoso').height()) {
    $toc.affix({
      offset: {
        top: $toc.offset().top - 10,
        bottom: $('#footer').outerHeight(true) + 10,
      }
    });
  }
});
