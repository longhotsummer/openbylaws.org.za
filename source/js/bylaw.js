$(document).ready(function () {
  if(window.location.href.indexOf("/za-cpt/act/by-law/2001/outdoor-advertising-signage") > -1) {
     $(".help").removeClass("hidden");
     $(".single-question[question='put-ad-ct']").removeClass("hidden");
     $(".single-question[question='remove-ad-ct']").removeClass("hidden");
  }
  if(window.location.href.indexOf("/za-cpt/act/by-law/2011/animal") > -1) {
     $(".help").removeClass("hidden");
     $(".single-question[question='animal-noise-ct']").removeClass("hidden");
     $(".single-question[question='animal-aggressive-ct']").removeClass("hidden");
  }
  if(window.location.href.indexOf("/za-cpt/act/by-law/2007/streets-public-places-noise-nuisances") > -1) {
     $(".help").removeClass("hidden");
     $(".single-question[question='animal-noise-ct']").removeClass("hidden");
     $(".single-question[question='nbr-construction-ct']").removeClass("hidden");
     $(".single-question[question='me-construction-ct']").removeClass("hidden");
     $(".single-question[question='throw-party-ct']").removeClass("hidden");
     $(".single-question[question='noise-nbr-ct']").removeClass("hidden");
  }
  if(window.location.href.indexOf("/za-eth/act/by-law/2015/nuisances-behaviour-public-places") > -1) {
     $(".help").removeClass("hidden");
     $(".single-question[question='nbr-construction-db']").removeClass("hidden");
     $(".single-question[question='me-construction-db']").removeClass("hidden");
     $(".single-question[question='throw-party-db']").removeClass("hidden");
     $(".single-question[question='animal-noise-db']").removeClass("hidden");
     $(".single-question[question='noise-nbr-db']").removeClass("hidden");
  }
  if(window.location.href.indexOf("/za-jhb/act/by-law/2009/outdoor-advertising") > -1) {
     $(".help").removeClass("hidden");
     $(".single-question[question='put-ad-jb']").removeClass("hidden");
     $(".single-question[question='remove-ad-jb']").removeClass("hidden");
  }
  if(window.location.href.indexOf("/za-jhb/act/by-law/2006/dogs-and-cats") > -1) {
     $(".help").removeClass("hidden");
     $(".single-question[question='animal-noise-jb']").removeClass("hidden");
     $(".single-question[question='animal-aggressive-jb']").removeClass("hidden");
  }
});

$(".help a").click(function() {
  $(".help a").removeClass("selected active");
  $(this).addClass("selected active");
  $(".single-muni").removeClass("selected");
  $(".single-muni", this).addClass("selected");
  $(".row.answer").addClass("hidden");
  $(".row." + $(this).attr('question')).removeClass("hidden");
});
