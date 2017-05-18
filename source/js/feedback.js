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
  var muni = $.trim($(".single-muni.selected").text());
  var solution = $(this).closest(".single-sol").clone();
  solution.find("small").remove();
  var gaSolution = $.trim($(solution).text());
  var opinion = $(this).attr("opinion");
  console.log(muni + ", " + question + ", " + gaSolution + ", " + opinion)
  ga('send', 'event', muni, question, gaSolution, opinion);
})