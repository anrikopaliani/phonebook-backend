const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as arguments");
  process.exit(1);
}
const password = process.argv[2];
const url = ``;
mongoose.set("strictQuery", false);
mongoose.connect(url);
const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Phone = mongoose.model("Phone", phoneSchema);

if (process.argv.length === 5) {
  const name = process.argv[3];
  const phoneNumber = process.argv[4];
  const phone = new Phone({
    name: name,
    number: phoneNumber,
  });
  phone.save().then((result) => {
    console.log(`added ${name} number ${phoneNumber} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Phone.find({}).then((result) => {
    console.log("Phonebook:");
    result.forEach((phone) => console.log(phone));
    mongoose.connection.close();
  });
}
