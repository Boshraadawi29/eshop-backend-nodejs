const { Category } = require('../models/category');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categoryList = await Category.find();
    if (!categoryList) {
      return res.status(500).json({ success: false });
    }
    res.status(200).json({ success: true, data: categoryList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.body;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(500).json({ success: false });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  const new_category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });

  try {
    const createdCategory = await new_category.save();
    res.status(200).json({ createdCategory });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.body;
    await Category.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.body;
    const category = await Category.findByIdAndUpdate(id, {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    });

    if (!category) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
