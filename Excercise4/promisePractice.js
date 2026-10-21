const cart = ["car", "bus", "truck"];

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

const promise = createOrder(cart);

function orderItem() {
  promise.then((data) => console.log(data)).catch((err) => console.log(err));
}

orderItem();

const mypromise = new Promise((resolve, reject) => {
  const sucess = true;
  setTimeout(() => {
    if (sucess) {
      resolve("resolve sucessfully");
    } else {
      reject("failed");
    }
  }, 2000);
});

myPromise.then((massage) =>
  console.log(massage, "sucess").catch((err) => console.log("error", err)),
);

//chainig promise

const getdata = new Promise((resolve) => {
  setTimeout(() => resolve(`${data} is unprocess`), 1000);
});

const processData = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`${data} and processed`), 1000);
  });
};

getdata
  .then((date) => {
    return processData(data);
  })
  .then((processedData) => {
    console.log(processedData);
  })
  .catch((error) => {
    console.error(error);
  });
