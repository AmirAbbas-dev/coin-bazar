const listCoin = [
  {
    coinId: 1,
    coinNameFa: "بیتکوین",
    coinNameEn: "BTC",
    coinImage: `Img/bitcoin.png`,
    coinPrice: 0,
    coinOldPrice: 0,
    userBalance: 0,
  },
  {
    coinId: 2,
    coinNameFa: "بایننس",
    coinNameEn: "BNB",
    coinImage: `Img/binancecoin.png`,
    coinPrice: 0,
    coinOldPrice: 0,
    userBalance: 0,
  },
  {
    coinId: 3,
    coinNameFa: "اتریوم",
    coinNameEn: "ETH",
    coinImage: `Img/ethereum.png`,
    coinPrice: 0,
    coinOldPrice: 0,
    userBalance: 0,
  },
  {
    coinId: 4,
    coinNameFa: "بیتکوین کش",
    coinNameEn: "BCH",
    coinImage: `Img/bitcoin-cash.png`,
    coinPrice: 0,
    coinOldPrice: 0,
    userBalance: 0,
  },
  {
    coinId: 5,
    coinNameFa: "تتر",
    coinNameEn: "USDT",
    coinImage: `Img/16404164548279705.png`,
    coinPrice: 0,
    coinOldPrice: 0,
    userBalance: 0,
  },
];

// Default values

let marketState = "buy";
let tdCoinCount = 1;
let updatePriceSwap = true;
updateListcoin();
updateUserOrderList();
createCoinlistMain();
setInterval(checkWithInterval, 1000);

function updateListcoin() {
  let listCoinStorage = JSON.parse(localStorage.getItem("listCoin"));
  for (let index = 0; index < listCoin.length; index++) {
    if (listCoinStorage.length > 0) {
      listCoin[index].userBalance = listCoinStorage[index].userBalance;
    }
  }
}
// check update pricelistCoin with Interval
function checkWithInterval() {
  let timeCheck = new Date().getSeconds().toString().substring(1, 2);
  if (timeCheck == "1" || timeCheck == "6") {
    createCoinlistModal();
    updatePriceFromStorage();
    updateOrderList();
    checkOrderList();
    checkBalanceUser();
  }
}
//AddlistCoin row item to table
function createCoinlistMain() {
  try {
    for (const coinObject of listCoin) {
      let trElement = `<tr class="coin-item">
      <td>${tdCoinCount++}</td>
      <td><img src="${coinObject.coinImage}" alt=""></td>
      <td>${coinObject.coinNameFa}</td>
      <td id="coin-price" class="coin-price"></td>
      <td id="coin-present" class="coin-present"></td>
      <td><a class="btn btn-color" href="#marketBox">خرید و فروش</a></td>
      </tr>`;
      document.querySelector(".coin-list tbody").innerHTML += trElement;
    }
  } catch (error) {
    console.log(error.message);
  }
}
//AddlistCoin row item to modal table
function createCoinlistModal() {
  let liElement = "";
  for (let coinObject of listCoin) {
    if (coinObject.coinNameEn != "USDT") {
      liElement += `
      <a href="javascript:selectCoin(${coinObject.coinId});">
      <li class="coin-modal-item" >
      <div class="">
        <img src="${coinObject.coinImage}" alt="">
        <div class="coin-info">
          <span>${coinObject.coinNameFa}</span>
          <span>${coinObject.coinNameEn}</span>
        </div>
      </div>
      <span class="coin-price-modal">${coinObject.coinPrice} تومان </span>
    </li>
      </a>`;
    }
  }
  updatePriceFromStorage();
  document.querySelector(".modal-list").innerHTML = liElement;
}
// Update Price alllistCoin from local storage
function updatePriceFromStorage() {
  let iconElement = document.querySelector("#coinIconSwap");
  let priceElement = document.querySelector("#coinPriceSwap");
  let spanElements = document.getElementsByClassName("coin-price-modal");
  let tdPeresents = document.getElementsByClassName("coin-present");
  let tdPrices = document.querySelectorAll(".coin-price");

  for (let i = 0; i < 5; i++) {
    let peresent = 0;
    let newPrice = listCoin[i].coinPrice;
    let oldPrice;
    if (newPrice == 0) {
      updatePrice();
      break;
    }
    if (listCoin[i].coinOldPrice != 0) {
      oldPrice = listCoin[i].coinOldPrice;
      peresent = newPrice / oldPrice - 1;
    }
    if ((newPrice / oldPrice).toFixed(1) == 0) {
      peresent = 0;
    }

    if (oldPrice > newPrice && tdPeresents[i] != null) {
      tdPeresents[i].classList.remove("green-text");
      tdPeresents[i].classList.add("red-text");
      peresent = `%${peresent.toString().substring(1, 5)}`;
    } else if (tdPeresents[i] != null) {
      tdPeresents[i].classList.remove("red-text");
      tdPeresents[i].classList.add("green-text");
      peresent = `%${peresent.toString().substring(0, 5)}`;
    }
    if (spanElements[i] != null) {
      spanElements[i].innerHTML = `${newPrice} $`;
    }
    if (tdPrices[i] != null) {
      tdPrices[i].innerHTML = `${newPrice}$`;
      tdPeresents[i].innerHTML = peresent;
    }
    if (
      iconElement.getAttribute("src").toString() == listCoin[i].coinImage &&
      updatePriceSwap == true
    ) {
      priceElement.innerText = `${newPrice}$`;
    }
  }
}
// update order list
function updateOrderList() {
  let coin = JSON.parse(localStorage.getItem("listCoin"));
  let priceNow = 0;
  let listOrder = [];
  for (let objectCoin of listCoin) {
    if (
      objectCoin.coinNameEn == document.getElementById("coinName").innerText
    ) {
      priceNow = objectCoin.coinPrice;
      break;
    }
  }

  if (document.querySelector(".order-list").childElementCount > 0) {
    document.querySelector(".order-list").innerHTML = "";
  }

  let liHeaderElement = document.createElement("li");
  liHeaderElement.setAttribute("class", "header-order");

  let spanVElement = document.createElement("span");
  spanVElement.innerText = "مقدار";
  let spanPElement = document.createElement("span");
  spanPElement.innerText = "قیمت";

  liHeaderElement.appendChild(spanVElement);
  liHeaderElement.appendChild(spanPElement);
  document.querySelector(".order-list").appendChild(liHeaderElement);
  //<li class="header-order"><span>مقدار</span><span>قیمت</span></li>

  for (let i = priceNow - 5; i < priceNow + 5; i++) {
    if (i == priceNow) {
      let liCenterElement = document.createElement("li");
      liCenterElement.setAttribute("class", "order-center");
      let spanElement = document.createElement("span");
      spanElement.innerText = i;

      liCenterElement.appendChild(spanElement);
      document.querySelector(".order-list").appendChild(liCenterElement);
    }

    let maxValueorder = Number((60000 / priceNow).toFixed());
    let valueOrder = Number((Math.random() * maxValueorder).toFixed(3));
    let valuePresentOfAll = (valueOrder / maxValueorder) * 100;

    let liOrderElement = document.createElement("li");
    liOrderElement.setAttribute(
      "onclick",
      `setOrderToSwap(${valueOrder},${i})`
    );
    liOrderElement.setAttribute("class", "order-item");

    let spanValueElement = document.createElement("span");
    spanValueElement.innerText = valueOrder;

    let spanPriceElement = document.createElement("span");
    spanPriceElement.innerText = i.toString();
    if (i >= priceNow) {
      spanPriceElement.setAttribute("class", "price-order green-text");
      spanValueElement.style.background = `linear-gradient(to left, #2d7c2399 ${valuePresentOfAll}%, transparent 0%`;
    } else {
      spanPriceElement.setAttribute("class", "price-order red-text");
      spanValueElement.style.background = `linear-gradient(to left, #912e2ead ${valuePresentOfAll}%, transparent 0%`;
    }
    liOrderElement.appendChild(spanValueElement);
    liOrderElement.appendChild(spanPriceElement);
    document.querySelector(".order-list").appendChild(liOrderElement);
  }
}
function openModal() {
  createCoinlistModal();
  document.getElementsByClassName("modal-coinlist")[0].style.cssText =
    "display: flex;opacity: 1;visibility: visible;width: 60%;left: 20%;";
}
function closeModal() {
  document.querySelector(".modal-coinlist").style.display = "none";
}
function selectCoin(coinSelected) {
  let iconElement = document.getElementById("coinIconSwap");
  let nameElement = document.querySelector(".insert-coin span");
  let priceElement = document.querySelector("#coinPriceSwap");
  listCoin.forEach((coinItem) => {
    if (coinItem.coinId == coinSelected) {
      priceElement.innerText = coinItem.coinPrice.toString();
      iconElement.src = coinItem.coinImage;
      nameElement.innerText = coinItem.coinNameEn;
      closeModal();
      updateOrderList();
      // enableUpdatePrice(coinItem.coinId);
      updatePriceSwap = true;
      document.getElementById("priceRialiOrder").value = "";
    }
  });
}
function changeMarket() {
  let coinInput = document.querySelector(".coin-input");
  let railInput = document.querySelector(".rial-input");
  let swapIcon = document.querySelector(".swap-icon");
  let sellTab = document.querySelector("#buy-tab");
  let buyTab = document.querySelector("#sell-tab");
  if (marketState == "sell") {
    coinInput.classList.remove("change-market");
    railInput.classList.remove("change-market");
    swapIcon.classList.remove("change-market");
    sellTab.classList.remove("change-market");
    buyTab.classList.remove("change-market");
    marketState = "buy";
  } else if (marketState == "buy") {
    coinInput.classList.add("change-market");
    railInput.classList.add("change-market");
    swapIcon.classList.add("change-market");
    sellTab.classList.add("change-market");
    buyTab.classList.add("change-market");
    marketState = "sell";
  }
  updateUserOrderList();
}
function setOrderToSwap(value, price) {
  document.getElementById("valueOrder").value = parseFloat(value).toFixed(4);
  document.getElementById("coinPriceSwap").innerText = price;
  updateRialPrice(value);
  updatePriceSwap = false;
}
function updateRialPrice(value) {
  let priceFinally =
    parseFloat(value) *
    parseInt(document.getElementById("coinPriceSwap").innerText) *
    30000;
  priceFinally = groupDigital(priceFinally.toFixed());
  if (priceFinally == "NaN") {
    return (document.getElementById("priceRialiOrder").value = "");
  }
  document.getElementById("priceRialiOrder").value = priceFinally;
}
function reverseString(str) {
  return str.split("").reverse().join("");
}
function groupDigital(num) {
  const emptyStr = "";
  const group_regex = /\d{3}/g;

  // delete extra comma by regex replace.
  const trimComma = (str) => str.replace(/^[,]+|[,]+$/g, emptyStr);

  const str = num + emptyStr;
  const [integer, decimal] = str.split(".");

  const conversed = reverseString(integer);

  const grouped = trimComma(
    reverseString(conversed.replace(/\d{3}/g, (match) => `${match},`))
  );

  return !decimal ? grouped : `${grouped}.${decimal}`;
}
function gatPersianDate(date) {
  const option = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  return date.toLocaleDateString("fa-IR", option);
}
function addOrder() {
  let coinIcon = document.getElementById("coinIconSwap").src;
  let coinName = document.getElementById("coinName").innerText;
  let value = parseFloat(document.getElementById("valueOrder").value);
  let price = parseFloat(document.getElementById("coinPriceSwap").innerText);

  if (isNaN(value) || isNaN(price) || value == 0) {
    Swal.fire({
      text: `مقدار و قیمت سفارش را وارد کنید `,

      padding: `1em`,
      background: `#393a3f`,
      color: `#e7ffff`,
      confirmButtonText: `تلاش مجدد`,
    });
    return;
  } else if (marketState == "sell") {
    let state = false;
    listCoin.forEach((valueCoin, index) => {
      if (valueCoin.coinNameEn == coinName && valueCoin.userBalance < value) {
        Swal.fire({
          text: `مقدار سفارش از موجودی شما بیشتر است `,

          padding: `1em`,
          background: `#393a3f`,
          color: `#e7ffff`,
          confirmButtonText: `تلاش مجدد`,
        });
        state = true;
      }
    });
    if (state == true) {
      return;
    }
  }
  
  const order = {
    orderId: 1,
    coinName: coinName,
    coinIcon: coinIcon,
    coinValue: value,
    coinPrice: price,
    amountDone: 0,
    orderType: marketState,
  };
  let listOrder = JSON.parse(localStorage.getItem("listOrder"));
  if (listOrder == null) {
    listOrder = [order];
  } else {
    let state = false;
    let sumOrderValue = 0;
    let coinBalance = 0;
   
    if (marketState == "sell" ) {
      listOrder.forEach((item) => {
        if (marketState == item.orderType) {
          sumOrderValue += item.coinValue;
        }
       
      })
      listCoin.forEach((valueCoin, index) => {
       
        if (valueCoin.coinNameEn ==  coinName ) {
          coinBalance = valueCoin.userBalance;
           
        }
      });
      if (sumOrderValue > coinBalance) {
        Swal.fire({
          text: `مقدار سفارش از موجودی شما بیشتر است `,

          padding: `1em`,
          background: `#393a3f`,
          color: `#e7ffff`,
          confirmButtonText: `تلاش مجدد`,
        });
        return;
      }
   
    }
    for (let orderItem of listOrder) {
     
      if (coinName == orderItem.coinName && price == orderItem.coinPrice) {
     
        orderItem.coinValue += value;
        localStorage.setItem("listOrder", JSON.stringify(listOrder));
        updateUserOrderList();
        state = true;
      }
    }
    if (state == true) {
      return;
    }
    order.orderId = listOrder.length + 1;
    listOrder.push(order);
  }
  localStorage.setItem("listOrder", JSON.stringify(listOrder));
  updateUserOrderList();
}
function updateUserOrderList() {
  let orderList = JSON.parse(localStorage.getItem("listOrder"));
  if (orderList != null && orderList.length > 0) {
    let OrderElement = "";

    for (const order of orderList) {
      if (order.orderType == marketState) {
        OrderElement += ` <tr class="user-order">
        <td></td>
        <td> <img src="${order.coinIcon}" alt="" class="coin-icon"></td>
        <td class="coin-name">${order.coinName}</td>
        <td class="coin-amountorder">${order.coinValue}</td>
        <td class="coin-amountdone">${order.amountDone}</td>
        <td class="coin-price">${order.coinPrice}</td>
        <td class="coin-date">${gatPersianDate(new Date())}</td>
        <td><a class="btn cancel-order" onclick="cancelOrder(${
          order.orderId
        })">لغو سفارش</a></td>
      </tr >`;
      }
    }
    if (OrderElement != "") {
      document.querySelector(".user-orderlist").style.display = "block";
      document.querySelector(".user-orderlist tbody").innerHTML = OrderElement;
    } else {
      document.querySelector(".user-orderlist").style.display = "none";
    }
  } else {
    document.querySelector(".user-orderlist").style.display = "none";
  }
}
function cancelOrder(orderId) {
  let orderList = JSON.parse(localStorage.getItem("listOrder"));
  for (let i = 0; i < orderList.length; i++) {
    if (orderId == orderList[i].orderId) {
      addValueToBalance(orderList[i].amountDone, orderList[i].coinName);
      orderList.splice(i, 1);
    }
  }
  localStorage.setItem("listOrder", JSON.stringify(orderList));
  updateUserOrderList();
}
function checkOrderList() {
  const orderList = JSON.parse(localStorage.getItem("listOrder"));
  if (orderList != null) {
    for (const objectCoin of listCoin) {
      orderList.forEach((value, index, array) => {
        if (
          objectCoin.coinNameEn == value.coinName &&
          objectCoin.coinPrice == value.coinPrice
        ) {
          const valueOrderList = parseFloat(
            document.querySelectorAll(".order-item")[5].firstChild.innerText
          );
          value.amountDone += valueOrderList;
          if (value.amountDone >= value.coinValue) {
            orderList.splice(index, 1);

            if (value.orderType == "sell") {
              objectCoin.userBalance -= value.coinValue;
              Swal.fire({
                icon: "success",
                title: `سفارش فروش ${value.coinValue} ${objectCoin.coinNameFa} انجام شد`,
                showConfirmButton: false,
                padding: `1em`,
                background: `#393a3f`,
                color: `#e7ffff`,
              });
            } else if (value.orderType == "buy") {
              objectCoin.userBalance += value.coinValue;
              Swal.fire({
                icon: "success",
                title: `سفارش خرید ${value.coinValue} ${objectCoin.coinNameFa} انجام شد`,
                showConfirmButton: false,
                padding: `1em`,
                background: `#393a3f`,
                color: `#e7ffff`,
              });
            }
          }
        }
      });
    }
  }

  localStorage.setItem("listCoin", JSON.stringify(listCoin));
  localStorage.setItem("listOrder", JSON.stringify(orderList));
  updateUserOrderList();
}
function checkBalanceUser() {
  const coinList = JSON.parse(localStorage.getItem("listCoin"));
  let amountElements = "";
  let circleElement = document.getElementById("circleAmount");
  let amountCoin = [];
  let amountAllCoin = 0;
  for (const objectCoin of listCoin) {
    if (objectCoin.coinNameEn != "USDT") {
      amountCoin.push(objectCoin.userBalance * objectCoin.coinPrice);

      amountElements += `
    <a  onclick="addBalanceToSwap(${objectCoin.userBalance},${
        objectCoin.coinId
      })">
    <div class="coin-amount">
    <div>
      <img src="${objectCoin.coinImage}" alt="" />
      <span>${objectCoin.coinNameFa}</span>
    </div>
    <span>${objectCoin.userBalance.toFixed(4)}</span>
  </div>
  </a>
    `;
    }
  }

  amountCoin.forEach((value) => {
    amountAllCoin += value;
  });
  amountCoin.forEach((value, index) => {
    amountCoin[index] = (value / amountAllCoin) * 360;
  });
  if (amountAllCoin > 0) {
    document.querySelector(".amount-present").style.display = "flex";
    let bg = `conic-gradient(red 0deg ${amountCoin[0].toFixed()}deg, orange ${amountCoin[0].toFixed()}deg ${(
      amountCoin[1] + amountCoin[0]
    ).toFixed()}deg, yellow ${(amountCoin[1] + amountCoin[0]).toFixed()}deg ${(
      amountCoin[2] +
      amountCoin[1] +
      amountCoin[0]
    ).toFixed()}deg, green ${(
      amountCoin[2] +
      amountCoin[1] +
      amountCoin[0]
    ).toFixed()}deg 360deg)`;
    circleElement.setAttribute("style", `display:block;background:${bg};`);
    document.querySelector(".amount-label").innerHTML = amountElements;
  }
}
function addBalanceToSwap(value, coinID) {
  document.getElementById("valueOrder").value = parseFloat(value).toFixed(4);
  selectCoin(coinID);

  updateRialPrice(value);
  updatePriceSwap = false;
}
function addValueToBalance(value, coinName) {
  for (let objectCoin of listCoin) {
    if (objectCoin.coinNameEn == coinName) {
      if (marketState == "sell") {
        objectCoin.userBalance -= value;
      } else if (marketState == "buy") {
        objectCoin.userBalance += value;
      }
      localStorage.setItem("listCoin", JSON.stringify(listCoin));
    }
  }
}
