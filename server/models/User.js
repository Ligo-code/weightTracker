import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,    
    required: [true, 'Please add a name'], 
    trim: true,
    minLength: [3, 'Name must be at least 3 characters'],
    maxLength: [100, 'Name cannot be more than 100 characters'],
},
email: {
    type: String,
    required: [true, 'Please add an email'],
    trim: true,
    minLength: [3, 'Email must be at least 3 characters'],
    maxLength: [100, 'Email cannot be more than 100 characters'],
    unique: true,
    match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please add a valid email',
    ]    
},
password: {
    type: String,
    required: [true, 'Please add a password'],
    minLength: [6, 'Password must be at least 6 characters'],        
}, 
goal: {
  type: String,
  enum: ['lose', 'gain'],
  required: [true, 'Please select a goal'],
},
initialWeight: {
  type: Number,
  required: [true, 'Please add an initial weight'],
  min: [1, 'Initial weight must be greater than 0'],
},
targetWeight: {
  type: Number,
  required: [true, 'Please add a target weight'],
  min: [1, 'Target weight must be greater than 0'],
},  
currentWeight: {
  type: Number,
  default: 0,
},  
createdAt: {
  type: Date,
  default: Date.now,
},
});

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
