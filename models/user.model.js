const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  bio: {
    type: String,
  },
  followers:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }],
  following:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
    }
  ]
},{timestamps:true});


userSchema.pre('save', async function(next){
  if(this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12)
  } 
    next()
})

userSchema.methods.comparePassword =  async function (password) {
  return bcrypt.compare(password, this.password)
}



const User = mongoose.model('User', userSchema);



module.exports = User;