const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: String,
    contact: String,
    date: Date,
    guests: Number,
    endTime: Date, 
});

module.exports = mongoose.model('Booking', bookingSchema);
