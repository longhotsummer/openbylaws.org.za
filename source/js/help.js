$(".muni a").click(function() {
  $(".muni a .single-muni").removeClass("selected")
  $(".single-muni", this).addClass("selected")
  $(".issue").removeClass("hidden");
  $(".solutions .sol-muni").addClass("hidden");
  $("." + $(this).attr('muni')).removeClass("hidden");
  $(".questions").removeClass('hidden');
  var gaMuni = $.trim($(".single-muni.selected").text());
  var gaIssue =  $.trim($(".single-issue.selected").text());
  var gaQuestion = $.trim($(".single-question.selected").text());
  console.log(gaMuni + ", " + gaIssue + ", " + gaQuestion);
  ga('send', 'event', gaMuni, gaIssue, gaQuestion);
});

$(".issue a").click(function() {
  $(".single-issue").removeClass("selected")
  $(".single-issue", this).addClass("selected")
  $(".question").addClass("hidden");
  $(".question." + $(this).attr('issue')).removeClass("hidden");
  $(".solution").addClass("hidden");
  $(".question a").removeClass("selected");
  $(".single-question").removeClass("selected");
  $(".questions").removeClass('double-hidden');
  $(".sol-title").text(" ");
  $(".solutions").addClass("hidden");
  var gaMuni = $.trim($(".single-muni.selected").text());
  var gaIssue =  $.trim($(".single-issue.selected").text());
  var gaQuestion = $.trim($(".single-question.selected").text());
  console.log(gaMuni + ", " + gaIssue + ", " + gaQuestion);
  ga('send', 'event', gaMuni, gaIssue, gaQuestion);
});

$(".question a").click(function() {
  $(".single-question").removeClass("selected");
  $(".single-question", this).addClass("selected");
  $(".solution").addClass("hidden");
  $(".solution." + $(this).attr('question')).removeClass("hidden");
  $(".sol-title").text($.trim($(this).text()));
  $(".solutions").removeClass("hidden");
  var gaMuni = $.trim($(".single-muni.selected").text());
  var gaIssue =  $.trim($(".single-issue.selected").text());
  var gaQuestion = $.trim($(".single-question.selected").text());
  console.log(gaMuni + ", " + gaIssue + ", " + gaQuestion);
  ga('send', 'event', gaMuni, gaIssue, gaQuestion);
});

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