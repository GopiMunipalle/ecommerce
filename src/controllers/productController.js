const uploadFiles = require("../handlers/uploadhandler");
const { sendError, sendSuccess } = require("../utils/response");
const { sequelize } = require("../config/dbConfig");
const { generateSKU } = require("../utils/uniquecodeUtil");
const {productModel,brandModel,categoryModel}=require("../models/index")

async function generateUniqueSkuCode(name) {
  let code = "";
  let exists = true;

  while (exists) {
    code = generateSKU(name);
    exists = !!(await productModel.findOne({ where: { sku: code } }));
  }

  return code;
}

async function createProduct(req, res) {
  const { name, description, price, brandId, categoryIds, status } =
    req.body;

  const t = await sequelize.transaction();

  try {
    const [brandDoc, categories] = await Promise.all([
      brandModel.findOne({ where: { id: brandId } }),
      categoryModel.findAll({ where: { id: categoryIds } }),
    ]);

    if (!brandDoc) {
      return sendError(res, 400, "Brand not found.");
    }

    if (categories.length !== categoryIds.length) {
      return sendError(res, 400, "One or more categories not found.");
    }

    let imageUrls = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      imageUrls = await uploadFiles(req.files);

      if (imageUrls.length === 0) {
        return sendError(res, 400, "Failed to upload images.");
      }
    }

    const images = imageUrls.map((url) => ({ url }));
    const sku = await generateUniqueSkuCode(name);

    const product = await productModel.create(
      {
        name,
        description,
        sku,
        price,
        brandId,
        status,
        images,
      },
      { transaction: t } 
    );

    await product.addCategories(categoryIds, { transaction: t });

    await t.commit();

    return sendSuccess(res, product);
  } catch (error) {
    await t.rollback();
    console.error("Error creating product:", error);
    return sendError(res, 500, "Internal server error.");
  }
}

async function getAllProducts(req,res) {
  try {
    const products = await productModel.findAll({
      include: [
        {
          model: categoryModel,
          as: "categories",
          attributes: ["id", "name"],
        },
        {
          model: brandModel,
          as: "brand",
          attributes: ["id", "name"],
        },
      ],
    });
    return sendSuccess(res,products)
  } catch (error) {
    return sendError(res, 500, error.message||"Internal server error");
  }
}

async function getProductById(req,res) {
  try {
    const {id} = req.params;
    const product = await productModel.findByPk(id,{
      include: [
        {
          model: categoryModel,
          as: "categories",
          attributes: ["id", "name"],
        },
        {
          model: brandModel,
          as: "brand",
          attributes: ["id", "name"],
        },
      ]
    });
    return sendSuccess(res,product)
  } catch (error) {
    return sendError(res, 500, error.message||"Internal server error");
  }
}

module.exports = {createProduct,getAllProducts,getProductById};
