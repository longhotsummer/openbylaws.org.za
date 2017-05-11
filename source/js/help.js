$(".muni a").click(function() {
  $(".muni a").removeClass("btn-primary")
  $(this).addClass("btn-primary");
  $(".issue").removeClass("hidden");
  $(".solutions .muni").addClass("hidden");
  $("." + $(this).attr('muni')).removeClass("hidden");
})

$(".issue a").click(function() {
  $(".issue a").removeClass("btn-primary")
  $(this).addClass("btn-primary");
  $(".question").addClass("hidden");
  $(".question." + $(this).attr('issue')).removeClass("hidden");
  $(".solution").addClass("hidden");
  $(".question a").removeClass("btn-primary")
})

$(".question a").click(function() {
  $(".question a").removeClass("btn-primary")
  $(this).addClass("btn-primary");
  $(".solution").addClass("hidden");
  $(".solution." + $(this).attr('question')).removeClass("hidden");
})
