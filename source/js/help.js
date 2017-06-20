function getActiveHelpItem() {
  return {
    'muni': $.trim($(".single-muni.selected").text()),
    'issue': $.trim($(".single-issue.selected").text()),
    'question': $.trim($(".single-question.selected").text()),
  };
}

function trackHelpMenu(action, label) {
  // send a GA event for help menu selection
  var item = getActiveHelpItem(),
      cat = [item.muni || '(none)'];

  if (item.question) {
    cat.push(item.issue);
    cat.push(item.question);
  } else if (item.issue) {
    cat.push(item.issue);
  }
  cat = cat.join(" / ");

  console.log("event: " + action + ", " + cat + ", " + label);
  if ('ga' in window) ga('send', 'event', action, cat, label);
}

$(".muni a").click(function() {
  $(".muni a .single-muni").removeClass("selected");
  $(".single-muni", this).addClass("selected");
  $(".issue").removeClass("hidden");
  $(".solutions .sol-muni").addClass("hidden");
  $("." + $(this).attr('muni')).removeClass("hidden");
  $(".questions").removeClass('hidden');
  $(".muni-explainer").addClass('hidden');
  trackHelpMenu("help menu");
});

$(".issue a").click(function() {
  $(".single-issue").removeClass("selected");
  $(".single-issue", this).addClass("selected");
  $(".question").addClass("hidden");
  $(".question." + $(this).attr('issue')).removeClass("hidden");
  $(".solution").addClass("hidden");
  $(".question a").removeClass("selected");
  $(".single-question").removeClass("selected");
  $(".questions").removeClass('double-hidden');
  $(".solutions").addClass("hidden");
  trackHelpMenu("help menu");
});

$(".question a").click(function() {
  $(".single-question").removeClass("selected");
  $(".single-question", this).addClass("selected");
  $(".solution").addClass("hidden");
  $(".solution." + $(this).attr('question')).removeClass("hidden");
  $(".solutions").removeClass("hidden");
  trackHelpMenu("help menu");
});

// clicking on the singe-question links on a particular by-law's page
$(".single-question").click(function() {
  var $this = $(this);

  $('.single-issue.selected').text($this.attr('issue'));

  $(".help a").removeClass("selected active");
  $this.addClass("selected active");
  $(".row.answer").addClass("hidden");
  $(".row." + $this.attr('question')).removeClass("hidden");
  $(".in-touch").removeClass("hidden");

  trackHelpMenu("help menu");
});

$(".single-sol > a").click(function() {
  var item = getActiveHelpItem(),
      $a = $(this),
      label = $a.text() + ' @ ' + $a.attr('href');

  trackHelpMenu('help solution', label);
});

$(".feedback").hover(
  function() {
    $("small", this).removeClass("hidden");
  }, function() {
    $("small", this).addClass("hidden");
  }
);

$(".feedback a").click(function() {
  var muni,
      question,
      solution;

  $(this).siblings().removeClass('active');
  $(this).addClass('active');

  question = $.trim($(".single-question.selected").text());
  if (window.location.href.indexOf("act/by-law") > -1) {
    muni = $(this).closest(".answer").attr("muni");
  } else {
    muni = $.trim($(".single-muni.selected").text());
  }

  solution = $(this).closest(".single-sol").clone();
  solution.find("small").remove();
  solution = $.trim($(solution).text());
  opinion = $(this).attr("opinion");

  trackHelpMenu('help feedback / ' + opinion, solution);
});

if(window.location.href.indexOf("?issue=") > -1) {
   $(".muni-explainer").removeClass("hidden");
}

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
