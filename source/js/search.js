ByLawSearch = function() {
  var self = this;

  var $form = $('form#search');
  var $results = $('#search-results');
  var $waiting = $('#search-waiting');
  var template = $('#search-result-tmpl').html();
  var ladda = Ladda.create($('button[type=submit]', $form)[0]);
  Mustache.parse(template);

  self.search = function(q) {
    ladda.start();

    $results.hide();
    $waiting.show();

    $.getJSON('http://localhost:9393/search', {q: q}, function(response, textStatus, jqXHR) {
      ladda.stop();
      console.log(response);

      response.q = q;
      response.seconds = response.took / 1000.0;
      response.hits.hits = $.map(response.hits.hits, function(result) {
        if (result.highlight.content) {
          result.snippet = result.highlight.content
            .slice(0, 2)
            .join(' ... ')
            .replace(/^\s*[;:",.()-]+/, '')  // trim leading punctuation
            .trim();
        }

        // highlighted (or regular) title
        result.title = result.highlight.title ? result.highlight.title[0] : result.fields.title;
        result.repealed = result.fields.repealed[0];

        return result;
      });

      $results
        .empty()
        .append(Mustache.render(template, response))
        .show();

      $waiting.hide();
    });
  };

  self.submitSearch = function(e) {
    if (window.history.pushState) {
      // don't reload the whole window
      var q = $('input[name=q]', $form).val();
      window.history.pushState(null, null, '?q=' + q);
      self.search(q);
      e.preventDefault();
    }
  };

  // search term from uri
  self.searchFromUri = function() {
    var q = decodeURIComponent(
      (new RegExp('[?|&]q=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20')
    )||null;

    if (q) {
      $('input[name=q]', $form).val(q);
      self.search(q);
    }
  };

  $form.submit(self.submitSearch);
  window.onpopstate = self.searchFromUri;

  // kick off a search
  self.searchFromUri();

  return self;
};

$(function() {
  var search = new ByLawSearch();
});
