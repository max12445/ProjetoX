import { Router } from "express";

const router = Router();

console.log("Arquivo productRoutes carregado");


    

const products = [
    {
        id: 1,
        name: "Notebook Gamer",
        price: 5000
    },
    {
        id: 2,
        name: "Penis Gamer",
        price: 200
    },
    {
        id: 3,
        name: "Xota Gamer",
        price: 325
    },
    {
        id: 4,
        name: "Bigode Gamer",
        price: 250
    },
    {
        id: 5,
        name: "Judeu Gamer",
        price: 20000
    },
    {
        id: 6,
        name: "Japones Gamer",
        price: 1500
    }
];

router.get("/", (req, res) => {
    console.log("Entrou na rota GET /products");

    res.json(products);
});

router.post('/', (req, res) => {

    console.log('Entrou na rota POST /newProducts');

    const newProduct = {
      id: products.length + 1,
      name: req.body.name,
      price: req.body.price
    };
    products.push(newProduct);
    res.status(201).json({
        message: "produto adicionado com sucesso",
        product: newProduct
      });
      
  });

export default router;