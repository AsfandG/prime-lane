import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
   stock: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required:true,
  },
 rating:{
    type:Number,
    default:0,
 },
 numberOfReviews: {type:String, default:0}
}, {timestamps: true});

export default mongoose.model("product", productSchema);
