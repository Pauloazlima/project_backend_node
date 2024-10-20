const fs = require('fs');

class ProductManager {
    constructor(path){
			this.path = path;
    }

		async getProducts(){
			try{
				const data = await fs.promises.readFile(this.path, 'utf-8')
				return JSON.parse(data)
			} catch (error){
				return[];
			}
		}

    async addProduct(product) {
		const requiredFields = ["title", "description", "price", "thumbnail", "code", "stock", "category"];
		const missingFields = requiredFields.filter(field => !product[field]);

		if (missingFields.length > 0) {
			throw new Error(`Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
		}
		product.status = product.status !== undefined ? product.status : true;
			
        const products = await this.getProducts();
				const productExists = products.some((p) => p.code === product.code)
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

	module.exports = ProductManager
