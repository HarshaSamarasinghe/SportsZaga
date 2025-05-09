import mongoose,{Schema} from "mongoose";

const repairSchema = new Schema({
    userId: { type: String, required: true }, 
    name:{type: String, required: true},
    equipment:{type: String, required: true},
    description:{type: String, required: true},
    progress:{type: Number, default:0},
    price:{type: Number, default:0},
    status:{type: String, default:"Pending"},
},
{
    timestamps:true
}
);

const repairModel = mongoose.model.repair || mongoose.model("repair",repairSchema)



export default repairModel