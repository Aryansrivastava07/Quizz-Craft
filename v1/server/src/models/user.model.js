import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    profilePicture: { type: String, default: "" },
    mobileNo: { type: String, unique: true, sparse: true },
    address: { type: String, default: "" },
    dateOfBirth :{type: Date, default: null},
    averageScore: { type: Number, default: 0 },
    verificationId : {type: Number},
    verificationIdExpiry : {type: Date},
    refreshToken : {type: String}
},
{
    timestamps: true
})

mongoose.plugin(mongooseAggregatePaginate);

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        next();
    }
});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}
userSchema.methods.generateAcessToken = function(){
    const accessToken = jwt.sign(
        {
            _id:this._id,
            username: this.username,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
    return accessToken;
};

userSchema.methods.generateRefreshToken = function(){
    const refreshToken = jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
    return refreshToken;
};

const User = mongoose.model("User", userSchema);

export default User;