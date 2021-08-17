const today = new Date();
const dateString = today.toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
const dayName = today.toLocaleDateString("en-US", { weekday: "long" });

console.log(dateString, dayName);
