const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const URL = process.env.MONGODB_URI;

mongoose
  .connect(URL)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: (num) => {
        return !isNaN(num.replace(/-/g, ""));
      },
      message: "Phone number invalid",
    },
  },
});

personSchema.plugin(uniqueValidator);

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
