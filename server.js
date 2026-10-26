const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Retrieve all records
app.get("/api/products", (req, res) => {
    const products = JSON.parse(fs.readFileSync("data.json", "utf8"));

    products.forEach(product => {
        if (product.stock === 0) product.status = "OUT OF STOCK";
        else if (product.stock <= 5) product.status = "LOW STOCK";
        else product.status = "AVAILABLE";
    });

    res.json(products);
});

// Retrieve one product through id
app.get("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const products = JSON.parse(fs.readFileSync("data.json", "utf8"));
    const product = products.find(product => product.id === id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock === 0) product.status = "OUT OF STOCK";
    else if (product.stock <= 5) product.status = "LOW STOCK";
    else product.status = "AVAILABLE";

    res.json(product);
});

// Insert a new product
app.post("/api/products", (req, res) => {
    const { product_name, category, price, stock } = req.body;

    if (!product_name || !category || !price || stock === "" || stock === undefined) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (stock < 0) {
        return res.status(400).json({ message: "Stock cannot be negative" });
    }

    const products = JSON.parse(fs.readFileSync("data.json", "utf8"));

    const newProduct = {
        id: products.length ? products[products.length - 1].id + 1 : 1,
        product_name,
        category,
        price: Number(price),
        stock: Number(stock)
    };

    products.push(newProduct);
    fs.writeFileSync("data.json", JSON.stringify(products, null, 2));

    // status is added after saving, so it is not written to data.json
    if (newProduct.stock === 0) newProduct.status = "OUT OF STOCK";
    else if (newProduct.stock <= 5) newProduct.status = "LOW STOCK";
    else newProduct.status = "AVAILABLE";

    res.status(201).json(newProduct);
});

// Delete a product through id
app.delete("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const products = JSON.parse(fs.readFileSync("data.json", "utf8"));
    const index = products.findIndex(product => product.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    products.splice(index, 1);
    fs.writeFileSync("data.json", JSON.stringify(products, null, 2));

    res.json({ message: "Product deleted" });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});