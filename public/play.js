let answers = {};
let totalHeadlines = $("button").length - 1;
$(".pick").click(function () {
  let oldValue = $(this).text() === "/r/nottheonion";
  let newValue = oldValue;
  $(this).text(newValue ? "The Onion" : "/r/nottheonion");
  answers[$(this).attr("id")] = newValue;
  checkIfFinished();
});
function checkIfFinished() {
  if (Object.keys(answers).length === totalHeadlines) {
    document.getElementById("submit").disabled = false;
  }
}
$("#submit").click(function () {
  $.post("/api/submit", { data: answers }).then((a) => {
    Object.keys(a).forEach((key) => {
      if (!a[key].correct) $(`#${key}`).css("color", "red");
    });
  });
});
