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
git commit -m "Inventory CRUD reference"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/crud-reference.git
git push -u origin main
