//= require "bootstrap"

$(function() {
  // track outbound links
  $('a[href^=http]').on('click', function(e) {
    ga('send', 'event', 'outbound-click', this.href);
  });
});

$(function() {
  // social buttons
  $('.fb-share').on('click', function(e) {
    e.preventDefault();
    var url = $(this).data('href') || location.toString();

    window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url),
                "share", "width=600, height=400, scrollbars=no");
    ga('send', 'social', 'facebook', 'share', url);
  });

  $('.twitter-share').on('click', function(e) {
    e.preventDefault();
    var url = $(this).data('href') || location.toString();

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
