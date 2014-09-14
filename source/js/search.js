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

      var template = '<li>' +
                       '<a href="{{ fields.frbr_uri }}">{{ fields.title }}</a>' +
                       '{{ #snippet }}<p>... {{{ snippet }}} ...</p>{{ /snippet }}' +
                     '</li>';

      var items = $.map(data.hits.hits, function(bylaw) {
        if (bylaw.highlight.content) {
          bylaw.snippet = bylaw.highlight.content.slice(0, 2).join(' ... ');
        }

        return Mustache.render(template, bylaw);
      });

      $container.empty();
      $container.append('<ul id="results"/>').append(items);
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
    container: '#results',
  });
});
