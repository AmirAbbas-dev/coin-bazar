let socketRequestId = {
    btcPrice: 1,
    ethPrice: 2,
    bnbPrice: 3,
    bchPrice: 4,
    adaPrice: 1,
    updatePrices: 6
  }
  var socketMainPage = new WebSocket("wss://ws.gate.io/v3/");
  socketMainPage.onopen = function () {
    socketMainPage.send(`{"id":${socketRequestId.adaPricea},"method":"ticker.query","params":["ADA_USDT" ,86400]}`)
    socketMainPage.send(`{"id":${socketRequestId.btcPrice},"method":"ticker.query","params":["BTC_USDT" ,86400]}`)
    socketMainPage.send(`{"id":${socketRequestId.ethPrice} ,"method":"ticker.query","params":["ETH_USDT" ,86400]}`)
    socketMainPage.send(`{"id":${socketRequestId.bnbPrice},"method":"ticker.query","params":["BNB_USDT" ,86400]}`)
    socketMainPage.send(`{"id":${socketRequestId.bchPrice},"method":"ticker.query","params":["BCH_USDT" ,86400]}`)
    socketMainPage.send(`{"id":${socketRequestId.updatePrices},"method":"ticker.subscribe","params":["BTC_USDT","ETH_USDT","BCH_USDT","BNB_USDT","ADA_USDT" ,86400]}`)
  }
  socketMainPage.onmessage = function (res) {
   
    if (JSON.parse(res.data).result) 
    {
      let coinData = JSON.parse(res.data).result;
      $(`[data-request-id="${JSON.parse(res.data).id}"] .coin-price-toman`).text(groupDigital((coinData.last * parseFloat(32300)).toFixed(0)))
      $(`[data-request-id="${JSON.parse(res.data).id}"] .coin-price-dollar`).text(Number(coinData.last).toFixed(3))
      $(`[data-request-id="${JSON.parse(res.data).id}"] .coin-present`).text(coinData.change).attr("class", coinData.change > 0 ? "green-txt" : "red-txt")
    }
    if (JSON.parse(res.data).params) 
    {
      let coinName = JSON.parse(res.data).params[0];
      let coinData = JSON.parse(res.data).params[1];
 
      $(`[data-coin-name="${coinName}"] .coin-price-toman`).text(groupDigital((coinData.last * parseFloat(32300)).toFixed(0)))
      $(`[data-coin-name="${coinName}"] .coin-price-dollar`).text(Number(coinData.last).toFixed(3))
      $(`[data-coin-name="${coinName}"] .coin-present`).text(coinData.change).attr("class", coinData.change > 0 ? "green-txt" : "red-txt")
    }
  }
 
 