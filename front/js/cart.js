function diplayBasketTop() {
  let basket = localStorage.getItem('basket')
  //si le panier n'est pas vide...
  if(basket) {
          basket = JSON.parse(basket)
          let quantityTotal =0;
          basket.forEach(element => {
              quantityTotal += element.quantity;
          });
          let productsInBasket = document.querySelectorAll("nav a li")
          //Affiche la quantité d'article dans le panier
          productsInBasket[1].innerHTML = `Panier (${quantityTotal})`;
      }
  }
  diplayBasketTop()

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
  updateQuantity();
  deleteProduct();  
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


function updateQuantity() {
  let basket = JSON.parse(localStorage.getItem('basket'))
  const quantity = document.querySelectorAll('.itemQuantity')
  for(let updateQuantity of quantity) {
    updateQuantity.addEventListener('change', (eq) => {
      for(product of basket) {
        let article = updateQuantity.closest('article')
        if (product._id === article.dataset.id && article.dataset.color === product.color && eq.target.value >= 1 && eq.target.value <= 100) {
          product.quantity = parseInt(eq.target.value);
          localStorage.basket = JSON.stringify(basket);
          article.dataset.quantité = parseInt(eq.target.value)
          totalProduit();
          diplayBasketTop()
        } else if (eq.target.value < 1 || eq.target.value > 100) {
          alert('Indiquez des quantités Valide SVP [comprises entre 1 et 100]');
          updateQuantity.value = article.dataset.quantité
        }
      }
    })
  }
}

function deleteProduct() {
  let basket = JSON.parse(localStorage.getItem('basket'))
  const deleteButton = document.querySelectorAll('.deleteItem')
  for(let click of deleteButton) {
    click.addEventListener('click', (ec) => {
      if (window.confirm('Voulez vous supprimer cet article?')) {
        let article = click.closest('article')
        console.log("1", basket.length);
        article.remove();
        for (let i = 0, b = basket.length; i < b; i++) {
          console.log("2", basket.length);
          let foundProduct = basket.find(p => p._id == article.dataset.id && p.color == article.dataset.color)
          basket = basket.filter(p => p != foundProduct);
          console.log("3", basket.length);
          localStorage.basket = JSON.stringify(basket);
          totalProduit();
          diplayBasketTop()
        }
      }
    })
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


/**************
FORM
***************/

// initialisation de l'objet contact
let contact = {
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  email: ''
}

console.log(contact);

// Stock si les inputs sont valides ou non
let isValidInputs = {
  firstName: false,
  lastName: false,
  address: false,
  city: false,
  email: false
}
// définitions des différentes RegExp dans une constante
const regExpList = {
  firstName: new RegExp('(^[a-zA-Zéè -]{2,20}$)'),
  lastName: new RegExp('(^[a-zA-Z -]{2,30}$)'),
  address: new RegExp('(^[a-zA-Zéè 0-9,-]{4,50}$)'),
  city: new RegExp('(^[a-zA-Zàéè -]{4,30}$)'),
  email: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
}

// Vérifier les inputs et les stocker
function checkUserInformations(input, regex, id) {

  if (regex.test(input.value)) {
      input.style.border = '2px solid Green';
      document.getElementById(`${id}ErrorMsg`).innerText = '';
      contact[id] = input.value;
      isValidInputs[id] = true;
  } else {
      input.style.border = '2px solid Red';
      isValidInputs[id] = false;
      if (id == "firstName" || id == "lastName") {
          document.getElementById(`${id}ErrorMsg`).innerText = 'Le format renseignée n\'est pas valide (ex : "Julien")';
      } else if (id == 'email') {
          document.getElementById(`${id}ErrorMsg`).innerText = 'Le format renseignée n\'est pas valide (ex: " johndoe@aol.com ") ';
      } else {
          document.getElementById(`${id}ErrorMsg`).innerText = 'L\'information renseignée n\'est pas valide';
      }
  }
}

// Appel la fonction de validité et de stockage des inputs à l'aide d'une boucle
for (let input of document.querySelector('.cart__order__form')) {
  if (input.type == "text" || input.type == "email") {
      input.addEventListener('change', (e) => {
          checkUserInformations(e.target, regExpList[e.target.id], e.target.id);
          console.log(contact);
          console.log(isValidInputs);
      })
  }
}