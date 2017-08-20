$(function() {
  // tag term definition containers
  $('.akoma-ntoso .akn-def[data-refersto]').each(function(i, def) {
    var term = def.getAttribute("data-refersto").replace('#', '');

    $(def)
      .closest('.akn-p, .akn-subsection, .akn-section, .akn-blockList')
      .attr('data-defines', def.getAttribute('data-refersto'))
      .attr('id', 'defn-' + term);
  });

  // link term definitions
  $(".akoma-ntoso .akn-term[data-refersto]").each(function(i, term) {
    $(term)
      .addClass('term-link')
      .on('click', function(e) {
        // jump to term definition
        e.preventDefault();
        window.location.hash = '#defn-' + term.getAttribute("data-refersto").replace('#', '');
      });
  });

  // show definition popups
  $('.akn-term').popover({
    placement: 'top',
    trigger: 'hover',
    html: true,
    template: '<div class="popover term-definition"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content akoma-ntoso"></div></div>',
    delay: { show: 500 },
    title: function() {
      var term_id = $(this).data('refersto');
      var term = $('.akn-def[data-refersto="' + term_id + '"]').text();
      if (window.ga) ga('send', 'event', 'term-popup', term_id.replace('#', ''));
      return term;
    },
    content: function() {
      var term_id = $(this).data('refersto');
      return $('.akoma-ntoso [data-defines="' + term_id + '"]')[0].outerHTML;
    }
  });
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

$(function() {
  if(window.location.href.indexOf("/za-cpt/act/by-law/2001/outdoor-advertising-signage") > -1) {
    $(".single-muni.selected").text("Cape Town");
    $(".help").removeClass("hidden");
    $(".single-question[question='put-ad-ct']").removeClass("hidden");
    $(".single-question[question='remove-ad-ct']").removeClass("hidden");
  }
  if(window.location.href.indexOf("/za-cpt/act/by-law/2011/animal") > -1) {
    $(".single-muni.selected").text("Cape Town");
    $(".help").removeClass("hidden");
    $(".single-question[question='animal-noise-ct']").removeClass("hidden");
    $(".single-question[question='animal-aggressive-ct']").removeClass("hidden");
  }
  if(window.location.href.indexOf("/za-cpt/act/by-law/2007/streets-public-places-noise-nuisances") > -1) {
    $(".single-muni.selected").text("Cape Town");
    $(".help").removeClass("hidden");
    $(".single-question[question='animal-noise-ct']").removeClass("hidden");
    $(".single-question[question='nbr-construction-ct']").removeClass("hidden");
    $(".single-question[question='me-construction-ct']").removeClass("hidden");
    $(".single-question[question='throw-party-ct']").removeClass("hidden");
    $(".single-question[question='noise-nbr-ct']").removeClass("hidden");
  }
  if(window.location.href.indexOf("/za-eth/act/by-law/2015/nuisances-behaviour-public-places") > -1) {
    $(".single-muni.selected").text("Ethekwini");
    $(".help").removeClass("hidden");
    $(".single-question[question='nbr-construction-db']").removeClass("hidden");
    $(".single-question[question='me-construction-db']").removeClass("hidden");
    $(".single-question[question='throw-party-db']").removeClass("hidden");
    $(".single-question[question='animal-noise-db']").removeClass("hidden");
    $(".single-question[question='noise-nbr-db']").removeClass("hidden");
  }
  if(window.location.href.indexOf("/za-jhb/act/by-law/2009/outdoor-advertising") > -1) {
    $(".single-muni.selected").text("Johannesburg");
    $(".help").removeClass("hidden");
    $(".single-question[question='put-ad-jb']").removeClass("hidden");
    $(".single-question[question='remove-ad-jb']").removeClass("hidden");
  }
  if(window.location.href.indexOf("/za-jhb/act/by-law/2006/dogs-and-cats") > -1) {
    $(".single-muni.selected").text("Johannesburg");
    $(".help").removeClass("hidden");
    $(".single-question[question='animal-noise-jb']").removeClass("hidden");
    $(".single-question[question='animal-aggressive-jb']").removeClass("hidden");
  }
});
