$(function() {
  // link term definitions
   document.querySelectorAll(".akoma-ntoso .akn-term[data-refersto]").forEach(function(term) {
    // make them look nice
    term.classList.add("term-link");

    // jump to term definition
    term.addEventListener("click", function(e) {
      e.preventDefault();
      document.querySelector('.akoma-ntoso .akn-def[data-refersto="' + term.getAttribute("data-refersto") + '"]').scrollIntoView();
    });
   });

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
