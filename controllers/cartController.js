const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getCart = async (req, res) => {
    const cart = await Cart.findOne().populate('products.productId');
    return res.status(201).send({ data:  cart });
};

// exports.addToCart = async (req, res) => {
//     const { productId } = req.body;
//     const cart = await Cart.findOne();
//     const newCart = await Cart.create({ products: [{ productId, quantity: 1 }] });

//     if (!cart) {
//         const newCart = await Cart.create({ products: [{ productId, quantity: 1 }] });
//         // return res.redirect('/cart');
//         return res.status(201).send({ data:  newCart });
//     }

//     const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
//     if (productIndex >= 0) {
//         cart.products[productIndex].quantity += 1;
//     } else {
//         cart.products.push({ productId, quantity: 1 });
//     }

//     await cart.save();
//     return res.status(201).send({ data: newCart });
//     // res.redirect('/cart');
// };

exports.addToCart = async (req, res) => {
    const { productId } = req.body;

    // Check if productId is defined
    if (!productId) {
        return res.status(400).send({ error: 'Product ID is required' });
    }

    let cart = await Cart.findOne();

    if (!cart) {
        cart = await Cart.create({ products: [{ productId, quantity: 1 }] });
        return res.status(201).send({ data: cart });
    }

    // Ensure cart.products is initialized
    if (!Array.isArray(cart.products)) {
        cart.products = [];
    }

    // Filter out any invalid products
    cart.products = cart.products.filter(p => p.productId);

    // Add logging to see the productId and cart.products
    console.log('Product ID:', productId);
    console.log('Cart Products:', cart.products);

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (productIndex >= 0) {
        // Product already in cart
        return res.status(400).send({ message: 'Product already in cart' });
    } else {
        cart.products.push({ productId, quantity: 1 });
    }

    await cart.save();
    return res.status(201).send({ data: cart });
};


exports.updateCartItem = async (req, res) => {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne();

    if (!cart) return res.redirect('/cart');

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
    if (productIndex >= 0) {
        cart.products[productIndex].quantity = quantity;
        await cart.save();
    }

    res.redirect('/cart');
};

// exports.removeFromCart = async (req, res) => {
//     const { productId } = req.body;
//     const cart = await Cart.findOne();

//     if (!cart) return res.redirect('/cart');

//     cart.products = cart.products.filter(p => p.productId.toString() !== productId);
//     await cart.save();

//     res.redirect('/cart');
// };

// exports.removeFromCart = async (req, res) => {
//     try {
//       let { id } = req.params;
//       const cart = await Cart.findById(id);
//       console.log("reqq", req.params);
//       console.log("Iddddd", id);
  
//       if (!cart) {
//         return res.status(400).send({ message: "product not foundddd..." });
//       }
//       await Cart.findByIdAndDelete(id);
//       return res.status(204).send({ message: "Product Deleted successfully..." });
//     } catch (error) {
//       return res.status(500).send({ message: error.message });
//     }
//   };
  exports.removeFromCart = async (req, res) => {
    const { productId } = req.body;

    // Check if productId is defined
    if (!productId) {
        return res.status(400).send({ error: 'Product ID is required' });
    }

    try {
        const cart = await Cart.findOne();

        if (!cart) {
            return res.status(404).send({ error: 'Cart not found' });
        }

        const initialProductCount = cart.products.length;

        cart.products = cart.products.filter(p => p.productId.toString() !== productId);

        // Check if a product was actually removed
        if (initialProductCount === cart.products.length) {
            return res.status(404).send({ error: 'Product not found in cart' });
        }

        await cart.save();
        res.status(200).send({ message: 'Product removed from cart', cart });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
};
