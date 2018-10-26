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
    var region_code = $form.find('input[name=region]').val();
    var params = {};

    ladda.start();

    $results.hide();
    $waiting.show();

    params = {
      q: q,
      country: 'za',
    };
    
    if (region_code) {
      params.frbr_uri__startswith = '/za-' + region_code + '/';
      if ($('body').hasClass('microsite')) {
        params.o = REGIONS[region_code].bucket;
      }
    }

    $.getJSON('https://srbeugae08.execute-api.eu-west-1.amazonaws.com/default/searchOpenBylaws', params, function(response, textStatus, jqXHR) {
      ladda.stop();
      console.log(response);

      response.q = q;
      var hits = $.map(response.results, function(result) {
        result.snippet = result._snippet
          .replace(/^\s*[;:",.()-]+/, '')  // trim leading punctuation
          .replace(/<b>/g, "<mark>")
          .replace(/<\/b>/g, "</mark>")
          .trim();

        result.region = REGIONS[result.locality];

        return result;
      });
      response.hits = {hits: hits};
      response.no_region = region_code === "";
      response.regions = [];
      for (var code in REGIONS) {
        var region = REGIONS[code];
        region.active = code == region_code;
        response.regions.push(region);
      }

      $results
        .empty()
        .append(Mustache.render(template, response))
        .show();

      $waiting.hide();

      if(getParameterByName('q').match(/(ads|advert|billboard)/)) {
        $("#help").removeClass("hidden");
        $(".ads").removeClass("hidden");
      }
      if(getParameterByName('q').match(/(animal|dog|cat|pet)/)) {
        $("#help").removeClass("hidden");
        $(".animals").removeClass("hidden");
      }
      if(getParameterByName('q').match(/(neighbo|contruct|build)/)) {
        $("#help").removeClass("hidden");
        $(".neighbours").removeClass("hidden");
      }
      if(getParameterByName('q').match(/(nois|music|sound|loud)/)) {
        $("#help").removeClass("hidden");
        $(".noise").removeClass("hidden");
      }
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
      $form.find('input[name=region]').val(self.getParamValue('region'));
      $form.submit();
    }
  };

  // handle clicks on a city
  $results.on('click', '.list-group-item', function(e) {
    e.preventDefault();
    $form.find('[name=region]').val($(this).data('code'));
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
