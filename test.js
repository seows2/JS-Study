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
