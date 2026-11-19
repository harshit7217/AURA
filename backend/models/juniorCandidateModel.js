import mongoose from "mongoose"
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const questionResultSchema = new Schema({
    questionId: {
        type: Number,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    selectedAnswer: {
        type: String,
        default: null,
    },
    marksAwarded: {
        type: Number,
        required: true,
    },
    maxMarks: {
        type: Number,
        required: true,
    },
}, { _id: false });

const assessmentAttemptSchema = new Schema({
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
    },
    totalMarks: {
        type: Number,
        required: true,
    },
    attempted: {
        type: Number,
        required: true,
    },
    questionResults: {
        type: [questionResultSchema],
        required: true,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

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
    approvalStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "approved",
    },
    approvalTokenHash: {
        type: String,
        select: false,
    },
    approvalTokenExpiresAt: {
        type: Date,
        select: false,
    },
    assessmentAttempts: {
        type: [assessmentAttemptSchema],
        default: [],
    },
}, { timestamps: true});

juniorCandiateSchema.pre("save", async function() {
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
})

juniorCandiateSchema.methods.comparePassword = function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
}

export default mongoose.model("juniorCandidateModel", juniorCandiateSchema);