## Setup

npm init -y
npm install express

## Read and write data.json

JSON.parse(fs.readFileSync("data.json", "utf8"))
fs.writeFileSync("data.json", JSON.stringify(products, null, 2))


## Status codes
200 OK, 201 Created, 400 Bad Request, 404 Not Found

## Array tools
find (one match), findIndex (position), push (add), splice(index, 1) (remove)


## Push to a new GitHub repo

git init
git add .
git commit -m "CRUD reference"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/crud-reference.git
git push -u origin main



UPDATE 

PUT replaces the whole record and needs all fields. PATCH changes only the fields sent.
Both use /api/products/:id and return 200, 400 (bad input), or 404 (not found).
Test in Chrome, because prompt() is blocked in the VS Code browser.

server.js: PUT
// UPDATE a product (PUT)
app.put("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const { product_name, category, price } = req.body;
    const stock = Number(req.body.stock);

    if (!product_name || !category || !price || req.body.stock === undefined || req.body.stock === "") {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (stock < 0) {
        return res.status(400).json({ message: "Stock cannot be negative" });
    }

    const products = JSON.parse(fs.readFileSync("data.json", "utf8"));
    const product = products.find(product => product.id === id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    product.product_name = product_name;
    product.category = category;
    product.price = Number(price);
    product.stock = stock;

    fs.writeFileSync("data.json", JSON.stringify(products, null, 2));

    if (product.stock === 0) product.status = "OUT OF STOCK";
    else if (product.stock <= 5) product.status = "LOW STOCK";
    else product.status = "AVAILABLE";

    res.json(product);
});


server.js: PATCH
// UPDATE part of a product (PATCH)
app.patch("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const products = JSON.parse(fs.readFileSync("data.json", "utf8"));
    const product = products.find(product => product.id === id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    if (req.body.stock !== undefined) {
        if (Number(req.body.stock) < 0) {
            return res.status(400).json({ message: "Stock cannot be negative" });
        }
        product.stock = Number(req.body.stock);
    }
    if (req.body.product_name !== undefined) product.product_name = req.body.product_name;
    if (req.body.category !== undefined) product.category = req.body.category;
    if (req.body.price !== undefined) product.price = Number(req.body.price);

    fs.writeFileSync("data.json", JSON.stringify(products, null, 2));

    if (product.stock === 0) product.status = "OUT OF STOCK";
    else if (product.stock <= 5) product.status = "LOW STOCK";
    else product.status = "AVAILABLE";

    res.json(product);
});


index.html: buttons (last cell in loadProducts)
<td>
    <button onclick="updateProduct(${product.id})">Edit</button>
    <button onclick="restockProduct(${product.id})">Restock</button>
    <button onclick="deleteProduct(${product.id})">Delete</button>
</td>


index.html: functions (inside script)
// UPDATE the whole record (PUT)
function updateProduct(id) {
    const updatedProduct = {
        product_name: prompt("New product name:"),
        category: prompt("New category:"),
        price: prompt("New price:"),
        stock: prompt("New stock:")
    };

    fetch("/api/products/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct)
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
            } else {
                alert("Product updated");
                loadProducts();
            }
        });
}

// UPDATE only the stock (PATCH)
function restockProduct(id) {
    const newStock = prompt("New stock:");

    fetch("/api/products/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
            } else {
                alert("Stock updated");
                loadProducts();
            }
        });
}

