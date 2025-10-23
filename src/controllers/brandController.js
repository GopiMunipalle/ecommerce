const { sendSuccess, sendError } = require("../utils/response");
const {brandModel,userModel}=require("../models/index")

async function createBrand(req, res) {
  try {
    const { name } = req.body;

    const createdBy = req.user.id;
    const existing = await brandModel.findOne({ where: { name } });
    if (existing) {
      return sendError(res, 409,  "Brand name already exists for you" );
    }

    const brand = await brandModel.create({ name, createdBy });
    return sendSuccess(res, brand, 201);
  } catch (error) {
    return sendError(res, 500, "Internal server error" );
  }
}

async function getAllBrands(req, res) {
  try {
    
    const brands = await brandModel.findAll({
      include: [
        {
          model: userModel,
          as: "createdByUser",
          attributes: ["id", "name", "email"],
        },
      ],
    });
    return sendSuccess(res, brands);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Internal server error");
  }
}

async function getBrandById(req, res) {
  try {
    const { id } = req.params;
    const brand = await brandModel.findByPk(id,{
      include:[{
        model:userModel,
        as:"createdByUser",
        attributes:["id","name","email"]
      }]
    });
    if (!brand) return sendError(res, 404, "Brand not found");
    return sendSuccess(res, brand);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Internal server error");
  }
}

module.exports = {
  createBrand,
  getAllBrands,
  getBrandById,
};
