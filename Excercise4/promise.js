const cart = ["book", "guns", "bikes"];

function createOrder(cart) {
  return new Promise((resolve, reject) => {
    if (cart) {
      setTimeout(() => {
        resolve(cart);
      }, 1000);
    } else {
      reject(new Error("cart is empty"));
    }
  });
 
}

let result = createOrder(cart);

function orderIt() {
  result
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

orderIt();

// second way
const myPromise = new Promise((resolve, reject) => {
  const success = true; // Simulating a successful async operation

  if (success) {
    resolve("Operation was successful!");
  } else {
    reject("Operation failed.");
  }
});

myPromise
  .then((message) => {
    console.log("Success:", message);
  })
  .catch((error) => {
    console.log("Error:", error);
  });



const fetchData = () => {
  return new Promise((resolve, reject) => {
    console.log("Fetching data...");

    setTimeout(() => {
      const success = true; // Simulate a successful or failed fetch
      if (success) {
        resolve({ id: 1, name: "John Doe", age: 30 });
      } else {
        reject("Failed to fetch data.");
      }
    }, 2000); // 2-second delay to simulate an asynchronous operation
  });
};

fetchData()
  .then((data) => {
    console.log("Data fetched:", data);
  })
  .catch((error) => {
    console.log("Error:", error);
  });

// chainning promise
const getData = new Promise((resolve) => {
  setTimeout(() => resolve("Data retrieved"), 1000);
});

const processData = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`${data} and processed`), 1000);
  });
};

getData
  .then((data) => {
    console.log(data);
    return processData(data);
  })
  .then((processedData) => {
    console.log(processedData);
  })
  .catch((error) => {
    console.error(error);
  });

// promise all

const promise1 = new Promise((resolve) =>
  setTimeout(resolve, 1000, "First promise")
);
const promise2 = new Promise((resolve) =>
  setTimeout(resolve, 2000, "Second promise")
);
const promise3 = new Promise((resolve) =>
  setTimeout(resolve, 3000, "Third promise")
);

Promise.all([promise1, promise2, promise3])
  .then((values) => {
    console.log("All promises resolved:", values);
  })
  .catch((error) => {
    console.error("One or more promises failed:", error);
  });
