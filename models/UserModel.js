import mongoose from 'mongoose';
import {genSalt, hash} from 'bcrypt';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true,"Email is Required."],
    unique: true,
  },
  password: {
    type: String,
    required: [true,"Password is Required"],
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false
  },
  color: {
    type: String,
    required : false
  },
  profileSetup: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre("save", async function(next){
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next()
})

const User = mongoose.model('User', userSchema);

export default User;