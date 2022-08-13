const mongoose = require("mongoose");
let { Schema } = mongoose;

let userSchema = new Schema({
  nome: {
    type: String,
    required: true,
    unique: [true , 'Usuário já foi inserido no Banco de Dados']
  },
  email: {
    type: String,
    required: true
  },
  idade: {
    type: Number,
    min: [18 , "Os usuários devem ser maiores de 18 anos!"],
    required: true
  },
});

let User = mongoose.model("User", userSchema);

module.exports = User;
