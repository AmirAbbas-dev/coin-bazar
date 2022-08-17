let userBalance = JSON.parse(localStorage.getItem("userBalance"));
const coinNames = ["BTC", "ETH", "BNB", "ADA", "BCH"] 
let ctx = 'doughnutChart';
var coins = [];

if (userBalance) {

  for (const [key, value] of Object.entries(userBalance)) {
    console.log(value);
}
}
else
{
  userBalance = {
    BTC: 0,
    BNB: 0,
    ETH: 0,
    ADA: 0,
    BCH: 0
  }
  localStorage.setItem("userBalance",JSON.stringify(userBalance));
}

 
var socketMapMarket = new WebSocket("wss://ws.gate.io/v3/");
socketMapMarket.onopen = function () {
    socketMapMarket.send(`{"id":4,"method":"ticker.query","params":["ADA_USDT" ,86400]}`)
    socketMapMarket.send(`{"id":1,"method":"ticker.query","params":["BTC_USDT" ,86400]}`)
    socketMapMarket.send(`{"id":2 ,"method":"ticker.query","params":["ETH_USDT" ,86400]}`)
    socketMapMarket.send(`{"id":3,"method":"ticker.query","params":["BNB_USDT" ,86400]}`)
    socketMapMarket.send(`{"id":5,"method":"ticker.query","params":["BCH_USDT" ,86400]}`)
}
socketMapMarket.onmessage = function (res) {
    coins.push( [coinNames[JSON.parse(res.data).id-1],JSON.parse(res.data).result.last,JSON.parse(res.data).result.change]);
    if (coins.length == 5) {
        updateDataBalance()
        createChart(coins);
    }
}
function updateDataBalance() {
    let balanceAllToken = 0;
    let balanceAllPrice = 0;
  coins.map((coin,index) => { 
     
    balanceAllToken += userBalance[coin[0]];
    balanceAllPrice += userBalance[coin[0]] * coin[1] ;
    $(`[data-coin-name="${coin[0]}"] .coin-balance`).text(groupDigital(userBalance[coin[0]]))
    $(`[data-coin-name="${coin[0]}"] .coin-change`).text(coin[2]).attr("class", coin[2] > 0 ? "green-txt" : "red-txt")
    
  })
  $("#balanceAllToman").text(groupDigital((balanceAllPrice * 30000).toFixed()));
  $("#balanceAllDollar").text(groupDigital(balanceAllPrice.toFixed())+"$");
  $("#balanceAllToken").text(balanceAllToken);
  $(".doughnut-chart").css("display", balanceAllToken ? "block" : "none");
}

function createChart() {

  const doughnutText = {
    id: "doughnutText",
    afterDraw(chart,args, pluginOptions) {
      const {ctx , data, options, _active, chartArea: {top, bottom, left, right , width , height}} = chart;
      ctx.save();
      let x;
      let y;

      if (_active.length) {
        if (_active[0].datasetIndex === 0) {
          x = width / 2;
          y = options.layout.padding.top / 2;
        } ;

        const datasetIndexValue = _active[0].datasetIndex;
        const dataIndexValue = _active[0].index;

        const coinName =  coins[_active[0].index][0];
        const coinPrice = data.datasets[datasetIndexValue].data[dataIndexValue]; 
        const coinValue = coinPrice /  coins[_active[0].index][1];

        ctx.font = "bold 20px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = '#e1ae00';
        ctx.fillText( `  ${coinName} : ${coinValue} `, width / 2, x);
        ctx.fillText( `${coinPrice.toFixed()}$ `, width / 2, x+25);
      }
    }
    }
  
    const config = {
        type: 'doughnut',
        data: { 
          datasets: [{
            labels: {
              display: true,
              formatter:(ctx) => ` sdfsdf`
          },
            data: coins.map((coin)=>   userBalance[coin[0]] * coin[1]),
            backgroundColor: [
              'rgb(247, 147, 26, 0.5)',
              'rgb(243, 186, 47, 0.5)',
              'rgb(72, 78, 122, 0.5)',
              'rgb(2, 194, 143, 0.5)',
              'rgb(32, 109, 211, 0.5)'
            ],
            borderColor: [
                'rgb(247, 147, 26, 1)',
                'rgb(247, 147, 26, 1)',
                'rgb(247, 147, 26, 1)'
            ],
            hoverOffset: 3,
            borderWidth: 2,
            borderRadius: 10,
            cutout: "80%"
          }]},
          options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        },
        plugins: [doughnutText]
      };
      const myChart = new Chart(ctx,config);
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
