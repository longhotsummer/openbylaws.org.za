ByLawSearch = function(args) {
  var self = this;

  var $form = $(args.form);
  var $container = $(args.container);

  self.search = function(q) {
    $.getJSON('http://localhost:9393/search', {q: q}, function(data, textStatus, jqXHR) {
      console.log(data);

      if (data.hits.total === 0) {
        $container.html(Mustache.render("We couldn't find anything relating to <em>{{q}}</em>.", {q: q}));
        return;
      }

      data.seconds = data.took / 1000.0;

      var template = '<li>' +
                       '<a href="{{ fields.frbr_uri }}">{{{ title }}}</a> {{ #repealed }} <span class="label label-warning">repealed</span> {{ /repealed }}' +
                       '<div class="info">{{ fields.region_name }}</div>' +
                       '{{ #snippet }}<p class="snippet">{{{ snippet }}} ...</p>{{ /snippet }}' +
                     '</li>';

      var items = $.map(data.hits.hits, function(bylaw) {
        if (bylaw.highlight.content) {
          bylaw.snippet = bylaw.highlight.content
            .slice(0, 2)
            .join(' ... ')
            .replace(/^\s*[;:",.-]/, '')  // trim leading punctuation
            .trim();
        }

        // highlighted (or regular) title
        bylaw.title = bylaw.highlight.title ? bylaw.highlight.title[0] : bylaw.fields.title;
        bylaw.repealed = bylaw.fields.repealed[0];

        return Mustache.render(template, bylaw);
      });

      var list = $('<ul class="search-results"/>').append(items);
      $container
        .empty()
        .append(Mustache.render('<p class="search-results-summary">About {{ hits.total }} results ({{ seconds }} seconds)</p>', data))
        .append(list);
    });
  };

  // search term from uri
  var q = decodeURIComponent(
    (new RegExp('[?|&]q=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20')
  )||null;

  if (q) {
    $('input[name=q]', $form).val(q);
    self.search(q);
  }

  return self;
};

$(function() {
  var search = new ByLawSearch({
    form: 'form#search',
    container: '#search-results',
  });
});
