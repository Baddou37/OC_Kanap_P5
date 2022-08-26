// Récupération de l'id du produit via l' URL
const id = (new URL(window.location).searchParams.get("id"));


function diplayBasketTop() {
let basket = localStorage.getItem('basket')
//si le panier n'est pas vide...
if(basket) {
        basket = JSON.parse(basket)
        console.table(basket);
        let quantityTotal =0;
        basket.forEach(element => {
            quantityTotal += element.quantity;
        });
        //modifie le bouton ajouter en modifier
        document.getElementById('addToCart').innerText= `Modifier le panier`;
        let productsInBasket = document.querySelectorAll("nav a li")
        //Affiche la quantité d'article dans le panier
        productsInBasket[1].innerHTML = `Panier (${quantityTotal})`;
    }
}
diplayBasketTop()

// Récupération du produits dans l'api et traitement des données (voir script.js)
fetch(`http://localhost:3000/api/products/${id}`)
    .then((res) => {if (res.ok) {return res.json()}})

    .then((data) => {product(data)})    
    .catch((err) => {
        document.querySelector(".item").innerHTML = "<h1>erreur 404</h1>";
        console.log("erreur 404, sur ressource api: " + err);
    });
    
    function product(data) {
        document.querySelector(".item__img").insertAdjacentHTML("afterbegin", `<img src="${data.imageUrl}" alt="${data.altTxt}">`);
        document.querySelector("#title").insertAdjacentHTML("afterbegin", data.name);
        document.querySelector("#price").insertAdjacentHTML("afterbegin", data.price);
        document.querySelector("#description").insertAdjacentHTML("afterbegin", data.description);
        document.querySelector("#colors").insertAdjacentHTML("beforeend", data.colors.map(color => `<option value="${color}">${color}</option>`));
        document.querySelector("title").innerText = `${data.name}`;
    }


// Return an array of the localStorage
function getBasket(){
    let basket = localStorage.getItem('basket')
    if (basket == null){
        return [];
    }else{
        console.log(basket)
        return JSON.parse(basket)
    }
}


// Save the current item in the local Storage
function validityChoices(color, quantity) {
    if ( color == '' && quantity == 0 ){
        alert('Vous n\'avez pas sélectionné une couleur ni une quantité');
        return false
    }else if(color !== '' && quantity == 0 || quantity < 0){
        alert('Vous n\'avez pas sélectionné une quantité');
        return false
    }else if (color == '' && quantity !== 0){
        alert('Vous n\'avez pas sélectionné une couleur');
        return false
    }else if ( color !== '' && quantity !== 0){
        return true
    }
    console.log(validityChoices);
}

//Set the item basket into the localStorage
function saveBasket(basket){
    localStorage.setItem("basket", JSON.stringify(basket))
}

// add the product to the local Storage
function addBasket(product){
    let checkUserChoices = validityChoices(product.color, product.quantity);
    if ( checkUserChoices == true ){
        let basket = getBasket();
        let foundProduct = basket.find(p => p.id == product.id && p.color == product.color)
        if (foundProduct == undefined){
            basket.push(product);
            saveBasket(basket);
            alert('Votre article a été ajouté au panier')
            return
        } else {
            if(foundProduct.quantity == product.quantity ){
                alert('Veuillez changer la quantité ou la couleur pour modifier votre panier')
                return
            }else if (foundProduct.quantity !== product.quantity){
                foundProduct.quantity += product.quantity;
                saveBasket(basket);
            }
        }
    }else{
        return
    }
}

//Listen add to cart Button and store into localStorage the new item if the inputs has been chosen;
document.getElementById('addToCart').addEventListener('click', (event) => {
    event.preventDefault();
    let product = {
        _id : id,
        color : document.getElementById('colors').value,
        quantity : parseInt(document.getElementById('quantity').value)
    };
    addBasket(product)
    diplayBasketTop()
});