import mongoose from "mongoose"
import bcrypt from "bcryptjs";

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
    },
    assessmentResults: [{
        _id: false,
        assessmentId: {
            type: String,
            required: true,
        },
        assessmentTitle: {
            type: String,
            required: true,
        },
        score: {
            type: Number,
            required: true,
            min: 0,
        },
        totalMarks: {
            type: Number,
            required: true,
            min: 0,
        },
        attempted: {
            type: Number,
            required: true,
            min: 0,
        },
        questionCount: {
            type: Number,
            required: true,
            min: 0,
        },
        completedAt: {
            type: Date,
            required: true,
        },
    }],
}, { timestamps: true});

juniorCandiateSchema.pre("save", async function() {
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
})

juniorCandiateSchema.methods.comparePassword = function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
}

export default mongoose.model("juniorCandidateModel", juniorCandiateSchema);