$(".feedback").hover(
  function() {
    $("small", this).removeClass("hidden");
  }, function() {
    $("small", this).addClass("hidden");
  }
);

$(".feedback a").click(function() {
  $(this).siblings().removeClass('active');
  $(this).addClass('active');
  var question = $.trim($(".single-question.selected").text());
  if(window.location.href.indexOf("act/by-law") > -1) {
    var muni = $(this).closest(".answer").attr("muni");
  } else {
    var muni = $.trim($(".single-muni.selected").text());
  };
  var solution = $(this).closest(".single-sol").clone();
  solution.find("small").remove();
  var gaSolution = $.trim($(solution).text());
  var opinion = $(this).attr("opinion");
  console.log("help / " + opinion, muni + " / " + question, gaSolution)
  ga('send', 'event', "help / " + opinion, muni + " / " + question, gaSolution);
})