import mongoose from "mongoose"

const { Schema } = mongoose;

const juniorCandiateSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    }
}, { timestamps: true})

export default mongoose.model("juniorCandidateModel", juniorCandiateSchema);