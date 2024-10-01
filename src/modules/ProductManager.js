class ProductManager {
    constructor() {
        this.products = [];
        this.currentId = 1;
    }
  
    addProduct({ title, description, price, thumbnail, code, stock }) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Todos os campos são obrigatórios.");
            return;
        }
  
        const codeExists = this.products.some(product => product.code === code);
        if (codeExists) {
            console.error(`Produto com o código ${code} já existe.`);
            return;
        }
  
        const newProduct = {
            id: this.currentId++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };
  
        this.products.push(newProduct);
    }
  
    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.error("Não encontrado");
        }
    }
  }
  
  const manager = new ProductManager();
  
  manager.addProduct({
    title: "Produto 1",
    description: "Descrição do Produto 1",
    price: 100,
    thumbnail: "caminho/para/imagem1.jpg",
    code: "ABC123",
    stock: 10
  });
  
  manager.addProduct({
    title: "Produto 2",
    description: "Descrição do Produto 2",
    price: 200,
    thumbnail: "caminho/para/imagem2.jpg",
    code: "DEF456",
    stock: 5
  });
  
  console.log(manager.getProductById(1)); // Exibe o produto com id 1
  console.log(manager.getProductById(3)); // Exibe "Não encontrado"