const Product = require("../models/product");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).send({ data: products });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    let { id } = req.params;
    const product = await Product.findById(id);
    console.log("req", req.params);
    console.log("Id", id);

    if (!product) {
      return res.status(400).send({ message: "product not foundddd..." });
    }
    await Product.findByIdAndDelete(id);
    return res.status(204).send({ message: "Product Deleted successfully..." });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  const { name, price, description } = req.body;
  console.log(req.body);
  if (!name || !description || !price) {
    return res.status(400).send({ message: "Fill empty fields" });
  }
  try {
    const createProduct = await Product.create({ name, price, description });
    return res.status(201).send({ data: createProduct });
  } catch (error) {}
};

exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
};

exports.updateProduct = async (req, res) => {
  const { name, price, description } = req.body;
  console.log("req", req.body);

  try {
    const editProduct = await Product.findByIdAndUpdate(
        {_id: req.params.id,},
        { $set: { name, price, description } },
        { new: true }
      );
    return res.status(201).send({ data: editProduct });
  } catch (error) {
    return res.status(500).send({ message: error.message });
};
}
