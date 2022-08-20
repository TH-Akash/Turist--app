import District from "../models/Disticts.js";




export const getDistricts = async (req, res, next) => {
  try {
    const d = await District.find();
    res.status(200).json(d);
  } catch (err) {
    next(err);
  }



}
