setInterval(updatePrice,5000);

function updatePrice() {


    for(let i=0; i<5; i++){
        let newPrice =  getRandomPrice(i+1);
        listCoin[i].coinOldPrice = listCoin[i].coinPrice;
        listCoin[i].coinPrice = newPrice;
        localStorage.setItem("listCoin",JSON.stringify(listCoin));
    }
}
function getRandomPrice(idCoin) {
    switch (idCoin) {
      case 1:
        return Math.floor(Math.random() * (30005 - 30000 + 1)) + 30000;
      case 2:
        return Math.floor(Math.random() * (305 - 300 + 0.1)) + 300;
      case 3:
        return Math.floor(Math.random() * (2005 - 2000 + 1)) + 2000;
      case 4:
        return Math.floor(Math.random() * (205 - 200 + 1)) + 200;
      case 5:
        return 1;
    }
  }
   
  