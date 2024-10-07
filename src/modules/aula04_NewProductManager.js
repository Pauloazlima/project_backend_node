const fs = require('fs');

class ProductManager {
    constructor(path){
			this.path = '../files/products.txt';
    }

		async getProducts(){
			try{
				const data = await fs.promises.readFile(this.path, 'utf-8')
				// console.log(data);
				return JSON.parse(data)
			} catch (error){
				return[];
			}
		}

    async addProduct(product) {
        const products = await this.getProducts();
				const productExists = products.some((p) => p.code ===product.code)
				if (productExists){
					throw new Error('Código já existente')
				}

				const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

				const newProduct = { id: newId, ...product };
				console.log(newProduct);
				
				products.push(newProduct);
		
				await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
				return newProduct;
    }
  
    async getProductById(id) {
			const products = await this.getProducts();
      const product = products.find((p) => p.id === id);

    if (!product) {
      throw new Error('Produto não encontrado!');
    }
		console.log(product);
    return product;
  }

		async updateProduct(id, updatedProduct){
			const products = await this.getProducts();
			const productIndex = products.findIndex((p) => p.id === id);			

			if (productIndex === -1){
				throw new Error('Produto não encontrado');
			}

			products[productIndex] = { ...products[productIndex], ...updatedProduct, id };

			await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
			console.log('Atualização realizada com sucesso');
			
			return products[productIndex];
		}

		async deleteProduct(id) {
			const products = await this.getProducts();
			const updatedProducts = products.filter((p) => p.id !== id);
	
			if (products.length === updatedProducts.length) {
				throw new Error('Produto não encontrado!');
			}
	
			await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts, null, 2));
			console.log('Exclusão realizada com sucesso');
			
		}

  }
  
  const manager = new ProductManager();
  
	

	
	// console.log('----getproductById----1');
	// manager.getProductById(2);
	
	
	// manager.deleteProduct(2);

	// manager.updateProduct(2, {
	// 	id: 2,
	// 	title: 'Produto 2 teste',
	// 	description: 'Descrição do Produto 2',
	// 	price: 200,
	// 	thumbnail: 'caminho/para/imagem2.jpg',
	// 	code: '222-teste',
	// 	stock: 5
	// });
	
  // manager.addProduct({
  //   title: "Produto 1",
  //   description: "Descrição do Produto 1",
  //   price: 100,
  //   thumbnail: "caminho/para/imagem1.jpg",
  //   code: "111",
  //   stock: 10
  // });
  
  // manager.addProduct({
  //   title: "Produto 2",
  //   description: "Descrição do Produto 2",
  //   price: 200,
  //   thumbnail: "caminho/para/imagem2.jpg",
  //   code: "222",
  //   stock: 5
  // });
  
  // console.log('----getproducts----1');
	// manager.getproducts();
  // console.log('----getproducts----2');