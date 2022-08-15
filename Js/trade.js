let socketRequestId = {
  addOrder: 1,
  updateOrder: 2,
};
let socketTrade = new WebSocket("wss://ws.gate.io/v3/");
let marketState = "buy";

updateUserOrderList();
Updateswap();
socketTrade.onopen = () => {
  let coinSelected =
    localStorage.getItem("selectedCoin") != ""
      ? localStorage.getItem("selectedCoin")
      : "BTC_USDT";
  socketTrade.send(
    `{"id":1, "method":"depth.query", "params":["${coinSelected}", 5, "0.0001"]}`
  );
  socketTrade.send(
    `{"id":2, "method":"depth.subscribe", "params":["${coinSelected}", 5, "0.1"]}`
  );
  socketTrade.send(
    `{"id":3,"method":"ticker.subscribe","params":["BTC_USDT","ETH_USDT","BCH_USDT","BNB_USDT","ADA_USDT" ,86400]}`
  );
};
socketTrade.onmessage = (res) => {
  jsonResponse = JSON.parse(res.data);

  if (jsonResponse.params != undefined) {
    if (jsonResponse.method == "depth.update") {
      updateOrders(jsonResponse.params[1]);
    }
    if (jsonResponse.method == "ticker.update") {
     
      if (jsonResponse.params[0] == coinSelected) {
        $(`.order-center`).text(jsonResponse.params[1].last);
        $("#coinPriceSwap").text(jsonResponse.params[1].last);
      }
      updateCoinList(jsonResponse.params)
      checkOrderList(jsonResponse.params);
    }
  }
  if (jsonResponse.id == 1) {
    let listOrders = jsonResponse.result;
    addOrderList(listOrders);
  }
};

function updateCoinList(coin) {
  if (coin) {
     
    $(`[data-coin-symbol="${coin[0]}"] .coin-price-modal`).text(groupDigital((coin[1].last * parseFloat(32300)).toFixed(0)))
  }
}
function checkOrderList(coin) {
    const orderList = JSON.parse(localStorage.getItem("listOrder"));
    let userBalance = JSON.parse(localStorage.getItem("userBalance"));
    let coinNameEn =coin[0].substring(0,3);
   
    if (userBalance == null || userBalance.length == 0) {
      userBalance = {
        BTC: 0,
        BNB: 0,
        ETH: 0,
        ADA: 0,
        BCH: 0
      }
    }
    if (orderList != null) {
      
        orderList.forEach((orderItem, index, array) => {
          if (
            coinNameEn == orderItem.coinName &&
            coin[1].last  == orderItem.price
          ) {
            
            orderItem.amountDone += Number.parseFloat(coin[1].quoteVolume);
            if (orderItem.amountDone >= orderItem.value) {
              orderList.splice(index, 1);
  
              if (orderItem.type == "sell") {
                userBalance[orderItem.coinName] -= orderItem.value;
                Swal.fire({
                  icon: "success",
                  title: `سفارش فروش ${orderItem.value} ${coinNameEn} انجام شد`,
                  showConfirmButton: false,
                  padding: `1rem`,
                  background: `#393a3f`,
                  color: `#e7ffff`,
                });
              } else if (orderItem.type == "buy") {
                userBalance[orderItem.coinName] += orderItem.value;
                Swal.fire({
                  icon: "success",
                  title: `سفارش خرید ${orderItem.value} ${coinNameEn} انجام شد`,
                  showConfirmButton: false,
                  padding: `1rem`,
                  background: `#393a3f`,
                  color: `#e7ffff`,
                });
              }
            }
          }
        });
      }

    localStorage.setItem("userBalance", JSON.stringify(userBalance));
    localStorage.setItem("listOrder", JSON.stringify(orderList));
    updateUserOrderList();
  }
function addOrderList(dataOrders) {
  let headerOrders = `<li class="header-order"><span>مقدار</span><span>قیمت</span></li>`;
  let buyOrdersElements = "";
  let sellOrdersElements = "";
  let maxBuyOrdervalue = dataOrders.asks.sort(function (a, b) {
    return b[1] - a[1];
  })[0][1];
  let maxSellOrdervalue = dataOrders.bids.sort(function (a, b) {
    return b[1] - a[1];
  })[0][1];
  dataOrders.asks.forEach((order) => {
    sellOrdersElements += `
    <li  data-order-price="${order[0]}" data-order-value="${
      order[1]
    }"  class="order-item" onclick="setOrderToSwap(${order[1]}, ${order[0]})">
              <span style="
                    background: linear-gradient(
                      to left,
                      rgba(145, 46, 46, 0.68)  ${
                        (order[1] / maxBuyOrdervalue) * 100
                      }%,
                      transparent 0%
                    );
                  ">${order[1]}</span><span class="price-order red-txt">${
      order[0]
    }</span>
            </li>
    `;
  });

  dataOrders.bids.forEach((order) => {
    buyOrdersElements += `
    <li  data-order-price="${order[0]}" data-order-value="${
      order[1]
    }" class="order-item" onclick="setOrderToSwap(${order[1]}, ${order[0]})">
              <span style="
                    background: linear-gradient(
                      to left,
                      rgba(10, 146, 46, 0.68)  ${
                        (order[1] / maxSellOrdervalue) * 100
                      }%,
                      transparent 0%
                    );
                  ">${order[1]}</span><span class="price-order green-txt">${
      order[0]
    }</span>
    </li>
    `;
  });
  $(`.order-list .sell-orders`).html(sellOrdersElements);
  $(`.order-list .buy-orders`).html(buyOrdersElements);
  $(`.order-list .loader`).css("display", "none");
}

function updateOrders(dataOrders) {
  let buyorderList = [];
  let sellorderList = [];
  $(".order-list .order-item").each(function (index, element) {
    if (index >= 5) {
      buyorderList.push([
        element.dataset.orderPrice,
        element.dataset.orderValue,
      ]);
    }
    if (index < 5) {
      sellorderList.push([
        element.dataset.orderPrice,
        element.dataset.orderValue,
      ]);
    }
  });
  if (dataOrders.asks) {
    dataOrders.asks.forEach(function (element, index) {
      sellorderList.push([element[0], element[1]]);
      sellorderList.sort();
      sellorderList = sellorderList.slice(0, 5);
    });
  }
  if (dataOrders.bids) {
    dataOrders.bids.forEach(function (element, index) {
      buyorderList.push([element[0], element[1]]);
      buyorderList.sort();
      buyorderList = buyorderList.slice(0, 5);
    });
  }
  addOrderList({
    asks: sellorderList,
    bids: buyorderList,
  });
}

function changeMarket() {
  if (marketState == "sell") {
    $(".coin-input").removeClass("selected-market");
    $(".rial-input").removeClass("selected-market");
    $(".swap-icon").removeClass("selected-market");
    $("#sell-tab").removeClass("selected-market");
    $("#buy-tab").addClass("selected-market");
    marketState = "buy";
  } else if (marketState == "buy") {
    $(".coin-input").addClass("selected-market");
    $(".rial-input").addClass("selected-market");
    $(".swap-icon").addClass("selected-market");
    $("#sell-tab").addClass("selected-market");
    $("#buy-tab").removeClass("selected-market");
    marketState = "sell";
  }
}

function openModal() {
  $(".modal-coinlist").css({
    display: "flex",
    opacity: "1",
    visibility: "visible",
    width: "60%",
    left: "20%",
  });
}

function closeModal() {
  $(".modal-coinlist").css("display", "none");
}

$(".coin-modal-item").click(function () {
  localStorage.setItem("selectedCoin", this.dataset.coinSymbol);
  window.location.reload();
});

function Updateswap() {
  let coinSelected =
    localStorage.getItem("selectedCoin") != ""
      ? localStorage.getItem("selectedCoin")
      : "BTC_USDT";
  let coinSelectedIcon = $(
    `.coin-modal-item[data-coin-symbol="${coinSelected}"] img`
  ).attr("src");
  let chartSymbol = `GATEIO:${coinSelected.replace("_", "")}`;
  $("#coinIconSwap").attr("src", coinSelectedIcon);
  $("#coinName").text(coinSelected.substring(0, 3));
}

function setOrderToSwap(value, price) {
  $("#valueOrder").val(parseFloat(value).toFixed(4));
  $("#coinPriceSwap").text(price);
  updateRialPrice(value);
}

function updateRialPrice(value) {
 
   
  let priceFinally =
    parseFloat(value) *
    parseFloat($("#coinPriceSwap").text()) *
    30000;
  priceFinally = groupDigital(priceFinally.toFixed());
  if (priceFinally == "NaN") {
    return ($("#priceRialiOrder").value = "");
  }
  $("#priceRialiOrder").val(priceFinally);
}

function addOrder() {
  let coinIcon = $("#coinIconSwap").attr("src");
  let coinNameEn = $("#coinName").text();
  let value = parseFloat($("#valueOrder").val());
  let price = parseFloat($("#coinPriceSwap").text());
  let userBalance = JSON.parse(localStorage.getItem("userBalance"));
  let listOrder = JSON.parse(localStorage.getItem("listOrder"));
  const order = {
    id: 1,
    coinName: coinNameEn,
    coinIcon: coinIcon,
    value: value,
    price: price,
    amountDone: 0,
    type: marketState,
  };

  if (isNaN(value) || isNaN(price) || value == 0) {
    Swal.fire({
      text: `مقدار و قیمت سفارش را وارد کنید `,

      padding: `1em`,
      background: `#393a3f`,
      color: `#e7ffff`,
      confirmButtonText: `تلاش مجدد`,
    });
    return;
  }
  debugger
  if (marketState == "sell") {
    
    if (userBalance[coinNameEn] < value) {
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

  if (listOrder == null || listOrder.length == 0) {
    listOrder = [order];
  } else {
    let isOrderExist = false;
    for (let orderItem of listOrder) {
      if (coinNameEn == orderItem.coinName && price == orderItem.price && orderItem.type == marketState) {
        orderItem.value += value;
        isOrderExist = true;
      }
    }
    if (!isOrderExist) {
      order.id = listOrder.length + 1;
      listOrder.push(order);
    }
  }
  localStorage.setItem("listOrder", JSON.stringify(listOrder));
  updateUserOrderList();
}

function cancelOrder(orderElement) {
  orderElement = orderElement.parentElement.parentElement;
  let orderList = JSON.parse(localStorage.getItem("listOrder"));
  orderList.forEach((orderItem, index) => {
    if (
      orderElement.children[2].innerText == orderItem.coinName &&
      orderElement.children[5].innerText == orderItem.price
    ) {
      orderList.splice(index, 1);
      $(orderElement).remove();
    }
  });
  //  addValueToBalance(orderList[i].amountDone, orderList[i].coinName);

  localStorage.setItem("listOrder", JSON.stringify(orderList));
  updateUserOrderList();
}

function updateUserOrderList() {
  let orderList = JSON.parse(localStorage.getItem("listOrder"));
  let orderElements = "";

  for (const order of orderList) {
    if (order.type == marketState) {
      orderElements += ` <tr class="user-order">
        <td></td>
        <td> <img src="${order.coinIcon}" alt="" class="coin-icon"></td>
        <td class="coin-name">${order.coinName}</td>
        <td class="coin-amountorder">${order.value}</td>
        <td class="coin-amountdone">${order.amountDone}</td>
        <td class="coin-price">${order.price}</td>
        <td class="coin-date">${gatPersianDate(new Date())}</td>
        <td><a class="btn cancel-order" onclick="cancelOrder(this)">لغو سفارش</a></td>
      </tr >`;
    }
  }
  $(".user-orderlist tbody").html(orderElements);
}



function gatPersianDate(date) {
  const option = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  return date.toLocaleDateString("fa-IR", option);
}

function name(params) {
  let state = false;
  let sumOrderValue = 0;
  let coinBalance = 0;

  if (marketState == "sell") {
    listOrder.forEach((item) => {
      if (marketState == item.type) {
        sumOrderValue += item.value;
      }
    });
    listCoin.forEach((valueCoin, index) => {
      if (valueCoin.coinNameEn == coinName) {
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
}
