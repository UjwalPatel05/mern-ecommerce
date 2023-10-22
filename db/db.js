const { default: mongoose } = require("mongoose");

const connectToDatabase = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to database");
    } catch (err) {
        console.log(err);
    }
};

module.exports = connectToDatabase;