<<<<<<< HEAD
setTimeout(
  (name) => {
    let coffeeList = name;
    console.log(coffeeList);

    setTimeout(
      (name) => {
        coffeeList += ", " + name;
        console.log(coffeeList);

        setTimeout(
          (name) => {
            coffeeList += ", " + name;
            console.log(coffeeList);

            setTimeout(
              (name) => {
                coffeeList += ", " + name;
                console.log(coffeeList);
              },
              500,
              "Latte"
            );
          },
          500,
          "Mocha"
        );
      },
      500,
      "Americano"
    );
  },
  500,
  "Espresso"
);
=======
const arr2 = Array.from({ length: 3 });
console.log(arr2);
>>>>>>> 90c5d25456f9addd09883fa11f98d8aebda3c58a
