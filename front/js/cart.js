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

// Retourne le tableau du localStorage
function getBasket(){
    let basket = localStorage.getItem('basket')
    if (basket == null){
        return [];
    }else{
        console.log(basket)
        return JSON.parse(basket)
    }
}

// éléments à afficher
/* <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
<div class="cart__item__img">
  <img src="../images/product01.jpg" alt="Photographie d'un canapé">
</div>
<div class="cart__item__content">
  <div class="cart__item__content__description">
    <h2>Nom du produit</h2>
    <p>Vert</p>
    <p>42,00 €</p>
  </div>
  <div class="cart__item__content__settings">
    <div class="cart__item__content__settings__quantity">
      <p>Qté : </p>
      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
    </div>
    <div class="cart__item__content__settings__delete">
      <p class="deleteItem">Supprimer</p>
    </div>
  </div>
</div>
</article> */