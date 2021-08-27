const form = document.querySelector("form");
const name = document.querySelector("#name");
const cost = document.querySelector("#cost");
const error = document.querySelector("#error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (name.value && cost.value) {
    error.textContent = "";
    const item = {
      name: name.value,
      cost: parseInt(cost.value),
    };
    const res = await db.collection("expenses").add(item);
    if (res) {
      name.value = "";
      cost.value = "";
    }
  } else {
    error.textContent = "Please enter values before submitting";
  }
});
