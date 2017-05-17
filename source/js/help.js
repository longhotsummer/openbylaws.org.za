$(".muni a").click(function() {
  $(".muni a").removeClass("ga");
  $(this).addClass("ga");
  $(".muni a .single-muni").removeClass("selected")
  $(".single-muni", this).addClass("selected")
  $(".issue").removeClass("hidden");
  $(".solutions .sol-muni").addClass("hidden");
  $("." + $(this).attr('muni')).removeClass("hidden");
  $(".feedback a").removeClass('active');
  $(".questions").removeClass('hidden');
})

$(".issue a").click(function() {
  $(".single-issue").removeClass("selected")
  $(".single-issue", this).addClass("selected")
  $(".question").addClass("hidden");
  $(".question." + $(this).attr('issue')).removeClass("hidden");
  $(".solution").addClass("hidden");
  $(".question a").removeClass("selected");
  $(".feedback a").removeClass('active');
  $(".feedback").addClass('hidden');
  $(".questions").removeClass('double-hidden');
})

$(".question a").click(function() {
  $(".question a").removeClass("ga");
  $(this).addClass("ga");
  $(".questions .single-question").removeClass("selected")
  $(".single-question", this).addClass("selected")
  $(".solution").addClass("hidden");
  $(".solution." + $(this).attr('question')).removeClass("hidden");
  $(".feedback a").removeClass('active');
  $(".feedback").removeClass('hidden');
  $(".sol-title").text($.trim($(this).text()));
})

$(".feedback a").click(function() {
  $(".feedback a").removeClass('active');
  $(this).addClass('active');
  var question = $.trim($(".question .ga").text());
  var muni = $.trim($(".sol-muni .ga").text());
  var opinion = $(this).attr("opinion");
  ga('send', 'event', muni, question, opinion);
})


function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var selectedMuni = getParameterByName('muni');
var selectedIssue = getParameterByName('issue');

$(window).load(function(){
  $('[muni='+selectedMuni+']').click();
  $('[issue='+selectedIssue+']').click();
});