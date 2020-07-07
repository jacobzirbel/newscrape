let answers = {};
let totalHeadlines = $("button").length - 1;
$(".pick").click(function () {
  let oldValue = $(this).text() === "NOT";
  let newValue = oldValue;
  $(this).text(newValue ? "ONION" : "NOT");
  answers[$(this).attr("id")] = newValue;
  checkIfFinished();
});
function checkIfFinished() {
  if (Object.keys(answers).length === totalHeadlines) {
    document.getElementById("submit").disabled = false;
  }
}
$("#submit").click(function () {
  $.post("/api/submit", { data: answers }).then((returned) => {
    this.style.display = "none";
    Object.keys(returned).forEach((key) => {
      if (!returned[key].correct) {
        $(`tr#${key} td:first`).css("background-color", "red");
      }

      $(`tr#${key} td:first`)
        .append(`<br />`)
        // TODO un-hardcode this
        .append(`guessed correctly by ${returned[key].correctPct * 100}%`);
      $(`tr#${key} td:last`)
        .append(`<br />`)
        .append(`<a href='${returned[key].link}'>${returned[key].link}</a>`);
    });
  });
});
