const { sendSuccess, sendError } = require("../utils/response");
const { generateStoreCode } = require("../utils/uniquecodeUtil");
const {storeModel,addressModel}=require("../models/index")

async function generateUniqueStoreCode() {
  let code = "";
  let exists = true;

  while (exists) {
    code = generateStoreCode();
    exists = !!(await storeModel.findOne({ where: { code } }));
  }

  return code;
}

async function createStore(req, res) {
  const { name, contact, address } = req.body;

  try {
    const code = await generateUniqueStoreCode();

    const store = await storeModel.create({
      name,
      code,
      contact,
    });
    if (address) {
      const {
        line1,
        city,
        state,
        country,
        postalCode,
        latitude: addressLatitude,
        longitude: addressLongitude,
      } = address;

      await store.createAddress({
        line1,
        city,
        state,
        country,
        postalCode,
        latitude: addressLatitude,
        longitude: addressLongitude,
      });
    }
    return sendSuccess(res, store, 201);
  } catch (error) {
    return sendError(res, 500, error.message||"Internal server error");
  }
}


async function getAllstores(req,res) {
    try {
        const stores = await storeModel.findAll({
          include: [{ model: addressModel, as: "address" }]
        });
        return sendSuccess(res, stores);
    } catch (error) {
        return sendError(res, 500, "Internal server error");
    }
}

async function getStoreById(req,res) {
    try {
        const { id } = req.params;
        const store = await storeModel.findByPk(id,{
          include: [{ model: addressModel, as: "address" }]
        });
        if (!store) return sendError(res, 404, "Store not found");
        return sendSuccess(res, store);
    } catch (error) {
        return sendError(res, 500, "Internal server error");
    }
}

module.exports = {
  createStore,
  getAllstores,
  getStoreById
};
