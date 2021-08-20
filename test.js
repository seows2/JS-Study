const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, "one");
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(reject, 120, "two");
});

Promise.all([promise1, promise2]).then(
  (value) => {
    console.log(value);
    // Both resolve, but promise2 is faster
  },
  (e) => console.log("e", e)
);

// expected output: "two"
