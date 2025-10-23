const { sendSuccess, sendError } = require("../utils/response");
const {categoryModel,productModel,productCategoryModel,userModel}=require("../models/index")

async function createCategory(req, res) {
  try {
    const { name } = req.body;

    const existing = await categoryModel.findOne({ where: { name, } });
    if (existing) {
      return sendError(res, 400, "Category name already exists" );
    }

    const category = await categoryModel.create({ name,createdBy: req.user.id });
    return sendSuccess(res, category, 201);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Internal server error" );
  }
}

async function getAllCategories(req, res) {
  try {
    const categories = await categoryModel.findAll({
      include:[{
        model:userModel,
        as:"createdByUser",
        attributes:["id","name","email"]
      }]
    });
    return sendSuccess(res, categories);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Internal server error" );
  }
}

async function findAllProductsByCategoryId(req, res) {
  try {
    const { id } = req.params;
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || page <= 0) page = 1;
    if (isNaN(limit) || limit <= 0) limit = 10;

    const offset = (page - 1) * limit;

    const category = await categoryModel.findOne({
      where: { id },
      include: [
        {
          model: userModel,
          as: "createdByUser",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!category) {
      return sendError(res, 404, "Category not found");
    }

    const products = await category.getProducts({
      attributes: ["id", "name", "description", "price"],
      limit,
      offset,
    });

    const totalProducts = await category.countProducts();

    const totalPages = Math.ceil(totalProducts / limit);
    const currentPage = page;

    return sendSuccess(res, {
      category,
      products,
      pagination: {
        totalItems: totalProducts,
        totalPages,
        currentPage,
        pageSize: limit,
      },
    });
  } catch (error) {
    return sendError(res, 500, error.message || "Internal server error");
  }
}


async function getCategoryById(req, res) {
  try {
    const { id } = req.params;
    const category = await categoryModel.findByPk(id,{
      include:[{
        model:userModel,
        as:"createdByUser",
        attributes:["id","name","email"]
      }]
    });
    if (!category) return sendError(res, 404, "Category not found");
    return sendSuccess(res, category);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Internal server error");
  }
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  findAllProductsByCategoryId
};
