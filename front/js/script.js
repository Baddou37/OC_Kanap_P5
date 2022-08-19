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
        // afficher les produits sous forme tableau dans la console.
        console.table(objetProduits);
        // appel de la fonction d'affichage des produits
        lesKanaps(objetProduits);
    })

    // dans le cas d'une erreur remplace le contenu de titre par un h1 au contenu de erreur 404 et renvoit en console l'erreur.
    .catch((err) => {
        document.querySelector(".titles").innerHTML = "<h1>erreur 404</h1>";
        console.log("erreur 404, sur ressource api:" + err);
    });

// fonction d'affichage des produits de l'api sur la page index

function lesKanaps(index) {
    // déclaration de la variable pour l'affichage des articles
    let displayProducts = document.querySelector("#items");
    // boucle pour parcourir le tableau et créer un nouvelle article à chaque nouvelle ligne du tableau
    for (let product of index) {
        // utilisation de insertAdjacentHTML pour créer du nouveau contenu HTML par produit dans l'API
        displayProducts.insertAdjacentHTML("afterbegin", `<a href="./product.html?id=${product._id}">
        <article>
          <img src="${product.imageUrl}" alt="${product.altTxt}">
          <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}</p>
        </article>
        </a>`) ;
    }
}
