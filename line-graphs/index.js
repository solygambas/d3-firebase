const buttons = document.querySelectorAll("button");
const form = document.querySelector("form");
const formActivity = document.querySelector("form span");
const input = document.querySelector("input");
const error = document.querySelector(".error");
let activity = "cycling";

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    // get activity
    activity = e.target.dataset.activity;

    // remove and add active class
    buttons.forEach((button) => button.classList.remove("active"));
    e.target.classList.add("active");

    // set ID of input field
    input.setAttribute("id", activity);

    // set text of form span
    formActivity.textContent = activity;

    // call the update function
    update(data);
  });
});

// form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const distance = parseInt(input.value);
  if (distance) {
    error.textContent = "";
    const res = await db.collection("activities").add({
      distance,
      activity,
      date: new Date().toString(),
    });
    if (res) {
      input.value = "";
    }
  } else {
    error.textContent = "Please enter a valid distance";
  }
});
