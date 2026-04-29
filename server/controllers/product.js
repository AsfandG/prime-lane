import Product from "../model/product.js";

export const createProduct = async (req, res)=> {
    try {
        
    } catch (error) {
        
    }
}

export const getProducts = async (req, res) => {
  try {
    const [products, count] = await Promise.all([
      Product.find().select("-password"),
      Product.countDocuments(),
    ]);
    res.json({ totalProducts: count, products });
  } catch (error) {
    res.status(200).json({ message: "server error", error: error.message });
  }
};

export const getProduct = async (req, res)=> {
    try {
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({message: "Product not found!"})
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(200).json({ message: "server error", error: error.message });
    }
}

export const updateProduct = async (req, res)=> {
    try {
        
    } catch (error) {
        
    }
}

export const deleteProduct = async (req, res)=> {
    try {
        
    } catch (error) {
        
    }
}