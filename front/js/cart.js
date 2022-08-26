//Appel le panier
let basket = localStorage.getItem('basket')
//si le panier n'est pas vide...
if(basket) {
    basket = JSON.parse(basket)
    console.table(basket);
    let quantityTotal =0;
    basket.forEach(element => {
        quantityTotal += element.quantity;
    });
    let productsInBasket = document.querySelectorAll("nav a li")
    //Affiche la quantité d'article dans le panier
    productsInBasket[1].innerHTML = `Panier (${quantityTotal})`;
}
