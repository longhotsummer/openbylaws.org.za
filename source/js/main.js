$(function() {
  // show definition popups
  $('.an-term').popover({
    placement: 'top',
    trigger: 'hover',
    html: true,
    template: '<div class="popover term-definition"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
    delay: { show: 500 },
    title: function() {
      var term_id = $(this).data('refers-to');
      return $(term_id).data('term');
    },
    content: function() {
      var term_id = $(this).data('refers-to');
      return $(term_id).html();
    }
  });

  // mailing list form
  $('form#mailinglist').on('submit', function(event, xhr, status) {
    $.post($(this).attr('action'), $(this).serializeArray());
    $(this).replaceWith("<p>Thanks, we'll keep you posted.</p>");
    return false;
  });

  // search page
  $('form#search').on('submit', function() {
    var query = $('#query').val();
    var element = google.search.cse.element.getElement('search-results');
    element.execute(query);

    // don't actually submit the form
    return false;
  });
});
