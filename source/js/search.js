ByLawSearch = function() {
  var self = this;

  var $form = $('form#search');
  var $results = $('#search-results');
  var $waiting = $('#search-waiting');
  var template = $('#search-result-tmpl').html();
  var ladda = Ladda.create($('button[type=submit]', $form)[0]);
  Mustache.parse(template);

  self.search = function() {
    var q = $form.find('input[name=q]').val();
    var region = $form.find('input[name=region_name]').val();

    ladda.start();

    $results.hide();
    $waiting.show();

    $.getJSON('https://indigo.openbylaws.org.za/api/search', {q: q, region_name: region}, function(response, textStatus, jqXHR) {
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

      // mark an active region
      response.aggregations.region_names.not_active = true;
      $.each(response.aggregations.region_names.buckets, function(i, bucket) {
        if (bucket.key == region) {
          response.aggregations.region_names.not_active = false;
          bucket.active = true;
        }
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
      e.preventDefault();

      // don't reload the whole window
      window.history.pushState(null, null, '?' + $form.serialize());
      self.search();
    }
  };

  self.getParamValue = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  };

  // search term from uri
  self.searchFromUri = function() {
    var q = self.getParamValue('q');
    if (q) {
      $form.find('input[name=q]').val(q);
      $form.find('input[name=region_name]').val(self.getParamValue('region_name'));
      $form.submit();
    }
  };

  // handle clicks on a city
  $results.on('click', '.list-group-item', function(e) {
    e.preventDefault();
    $form.find('[name=region_name]').val($(this).find('.city').text());
    $form.submit();
  });

  $form.on('submit', self.submitSearch);
  window.onpopstate = self.searchFromUri;

  return self;
};

$(function() {
  var search = new ByLawSearch();
  // kick off a search
  search.searchFromUri();
}); 

