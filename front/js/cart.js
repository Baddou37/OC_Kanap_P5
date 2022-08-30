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

//Set the item basket into the localStorage
function saveBasket(basket){
  localStorage.setItem("basket", JSON.stringify(basket))
}

//appel de l'api avec méthode fetch
fetch("http://localhost:3000/api/products")
    // transformer la réponse en json.
    .then((res) => {
        if (res.ok) {
            return res.json();
        }
    })
    // ce qui a été traité en json sera appelé objetProduits
    .then((objetProduits) => {
        //console.table(objetProduits)
        displayProductsCart(objetProduits);
    })

    // dans le cas d'une erreur remplace le contenu de titre par un h1 
    // au contenu de erreur 404 et renvoit en console l'erreur.
    .catch((err) => {
        document.querySelector(".titles").innerHTML = "<h1>erreur 404</h1>";
        console.log("erreur 404, sur ressource api:" + err);
    }); 

//Afficher les produits depuis le localStorage
function displayProductsCart(kanaps) {
  let basket = JSON.parse(localStorage.getItem('basket'))
  let displayProducts = document.getElementById("cart__items");
  if (basket && basket.length != 0) {
    for(let product of basket) {
      for (let g = 0, h = kanaps.length; g < h; g++) {
        if (product._id === kanaps[g]._id) {
          // création et ajout de valeurs à panier qui vont servir pour les valeurs dataset
          product.name = kanaps[g].name;
          product.prix = kanaps[g].price;
          product.image = kanaps[g].imageUrl;
          product.alt = kanaps[g].altTxt;
        }
      }
      displayProducts.insertAdjacentHTML("afterbegin",`<article class="cart__item" data-id="${product._id}" data-color="${product.color}" data-quantité="${product.quantity}" data-prix="${product.prix}">
      <div class="cart__item__img">
        <img src="${product.image}" alt="${product.alt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <a href="./product.html?id=${product._id}" class="link-product"><h2>${product.name}</h2></a>
          <p>${product.color}</p>
          <p>${lisibilite_nombre(product.prix)} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
      </article>`)
      document.querySelector('.link-product').style.textDecoration="none";
      document.querySelector('.link-product').style.color="white";
    }
  } else {
    // si il n'y a pas de panier on créait un H1 informatif et quantité appropriées
    document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
    document.querySelector("h1").innerHTML =
      "Vous n'avez pas d'article dans votre panier";
  }
  totalProduit();
  updateProduct();
  
}

function totalProduit() {
  // déclaration variable en tant que nombre
  let totalArticle = 0;
  let totalPrix = 0;
  // on pointe l'élément
  const cart = document.querySelectorAll(".cart__item");
  // pour chaque élément cart
  cart.forEach((cart) => {
    //je récupère les quantités des produits grâce au dataset
    totalArticle += parseInt(cart.querySelector(".itemQuantity").value);
    //console.log(totalArticle);
    // je créais un opérateur pour le total produit grâce au dataset
    let productPrice = parseInt(cart.querySelector(".cart__item__content__description").lastElementChild.textContent.slice(0, -1).split(" ").join(""))
    totalPrix += parseInt(cart.querySelector(".itemQuantity").value) * productPrice;
  });
  // je pointe l'endroit d'affichage nombre d'article
  document.getElementById("totalQuantity").textContent = totalArticle;
  // je pointe l'endroit d'affichage du prix total
  document.getElementById("totalPrice").textContent = lisibilite_nombre(totalPrix);
}

function updateProduct() {
  let basket = JSON.parse(localStorage.getItem('basket'))
  const quantity = document.querySelectorAll('.itemQuantity')
    for(let updateQuantity of quantity) {
      updateQuantity.addEventListener('change', (eq) => {
      //récupéré id et couleur via dataset
      let article = updateQuantity.closest('article')
      for(product of basket) {
        if(product._id === article.dataset.id && article.dataset.color === product.color) {
          product.quantity = parseInt(eq.target.value);
          localStorage.basket = JSON.stringify(basket);
          article.dataset.quantity = parseInt(eq.target.value)
          totalProduit();
        }
      }
    })
  }
}

function validityQuantity(quantity) {
  if(quantity < 0) {
    return false
    alert('Vous ne pouvez pas selectionné une quantité négative')
  } else {
    return true
  }
}

function lisibilite_nombre(nbr)
{
		var nombre = ''+nbr;
		var retour = '';
		var count=0;
		for(var i=nombre.length-1 ; i>=0 ; i--)
		{
			if(count!=0 && count % 3 == 0)
				retour = nombre[i]+' '+retour ;
			else
				retour = nombre[i]+retour ;
			count++;
		}
		return retour;
}