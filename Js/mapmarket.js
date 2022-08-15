var coinsPresent = [];
const coinNames = ["BTC", "ETH", "BNB", "ADA", "BCH"] 
var socketMapMarket = new WebSocket("wss://ws.gate.io/v3/");
socketMapMarket.onopen = function () {
    socketMapMarket.send(`{"id":4,"method":"ticker.query","params":["ADA_USDT" ,86400]}`)
    socketMapMarket.send(`{"id":1,"method":"ticker.query","params":["BTC_USDT" ,86400]}`)
    socketMapMarket.send(`{"id":2 ,"method":"ticker.query","params":["ETH_USDT" ,86400]}`)
    socketMapMarket.send(`{"id":3,"method":"ticker.query","params":["BNB_USDT" ,86400]}`)
    socketMapMarket.send(`{"id":5,"method":"ticker.query","params":["BCH_USDT" ,86400]}`)
}
socketMapMarket.onmessage = function (res) {
    coinsPresent.push( [JSON.parse(res.data).id,coinNames[JSON.parse(res.data).id-1],JSON.parse(res.data).result.change]);
    if (coinsPresent.length == 5) {
        coinsPresent.sort((a, b) => a[0] - b[0])
        createChart();
    }
}
function createChart() {
    let ctx = 'myChart'
    const config = {
        type: 'treemap',
        data: {
            datasets: [{            
                data: [30, 17, 15, 10, 10],
                borderColor: '#000',
                borderWidth: 1,
                spacing: 0,
                backgroundColor: (ctx) => {
                    let coinPositivePresent = coinsPresent[ctx.dataIndex][2] * 20 < 50 ? 50 : coinsPresent[ctx.dataIndex][2] * 20 ;
                    let coinNegativePresent = coinsPresent[ctx.dataIndex][2] * -20 > -50 ? 50 : coinsPresent[ctx.dataIndex][2] * -20 ;
                    return coinsPresent[ctx.dataIndex][2] > 0 ? `rgb(20, 90, 10,${coinPositivePresent}%` : `rgb(112, 0, 0,${coinNegativePresent}%`
                },
                 labels: {
                    display: true,
                    font: {
                        size: (ctx) => ctx.raw._data < 15 ? 15 : ctx.raw._data
                    },
                    color: (ctx) =>  "#ffff",
                    formatter:(ctx) => `${coinsPresent[ctx.dataIndex][1]}\n ${coinsPresent[ctx.dataIndex][2]}%`
                }
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    };

    var myChart = new Chart(ctx, config);
}
