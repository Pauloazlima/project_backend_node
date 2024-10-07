const fs = require('fs');

const path = 'src\files\products.txt'

async getProducts () {
      const data = await fs.promises.readFile(path, 'utf-8');
}

console.log(getProducts);
