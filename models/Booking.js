const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: String,
    contact: String,
    date: Date,
    guests: Number,
    endTime: Date, // New field to track booking end time
});

module.exports = mongoose.model('Booking', bookingSchema);
