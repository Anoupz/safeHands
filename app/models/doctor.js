// grab the packages that we need for the user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// user schema
var DoctorSchema = new Schema({
    firstName: String,
    name: String,
    speciality: String,
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true, select: false}
});

// hash the password before the user is saved
DoctorSchema.pre('save', function (next) {
    var user = this;

    //Hash the password only if the password has been changed or user is new
    if (!user.isModified('password')) return next();

    // generate the hash
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) return next(err);

        // change the password to the hashed version
        user.password = hash;
        next();
    });
});

// method to compare a given password with the database hash
DoctorSchema.methods.comparePassword = function (password) {
    var user = this;

    return bcrypt.compareSync(password, user.password);
};
// return the model
module.exports = mongoose.model('Doctor', DoctorSchema);