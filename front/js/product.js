// Récupération de l'id du produit via l' URL

// params récupère l'url de la page
const params = new URLSearchParams(document.location.search);
console.log(document.location);

//id va récupérer la valeur du paramètre _id de l'url
const id = params.get("id");
console.log(`id = ${id}`);

// Récupération du produits dans l'api et traitement des données (voir script.js)

fetch(`http://localhost:3000/api/products/${id}`)
    .then((res) => {
        if (res.ok) {
            return res.json();
        }
    })
    .then((objetProduit) => {
        console.table(objetProduit);
        // execution de la fontion produit
        produit(objetProduit);
    })
    .catch((err) => {
        document.querySelector(".item").innerHTML = "<h1>erreur 404</h1>";
        console.log("erreur 404, sur ressource api: " + err);
    });

    function produit(product) {

        let image = document.querySelector(".item_img")
        
    }
