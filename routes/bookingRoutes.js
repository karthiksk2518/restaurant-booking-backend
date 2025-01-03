const express = require('express');
const Booking = require('../models/Booking');
const router = express.Router();

const MAX_SEATS = 50;

// Create a booking
router.post('/', async (req, res) => {
    const { name, contact, date, guests } = req.body;
    const startTime = new Date(date);
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

    try {
        // Check current availability
        const overlappingBookings = await Booking.find({
            date: { $lte: endTime },
            endTime: { $gte: startTime },
        });

        const bookedSeats = overlappingBookings.reduce((total, booking) => total + booking.guests, 0);
        const availableSeats = MAX_SEATS - bookedSeats;

        if (guests > availableSeats) {
            return res.status(400).json({
                message: `Not enough seats available. Only ${availableSeats} seats left.`,
            });
        }

        // Create the booking
        const newBooking = new Booking({ name, contact, date: startTime, guests, endTime });
        await newBooking.save();

        res.status(201).json(newBooking);
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error });
    }
});

router.get('/availability', async (req, res) => {
    const { date, time } = req.query;
    if (!date || !time) return res.status(400).json({ message: 'Date and time are required' });

    const startTime = new Date(`${date}T${time}:00`); // Create a Date object with both date and time
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

    try {
        const overlappingBookings = await Booking.find({
            date: { $lte: endTime },
            endTime: { $gte: startTime },
        });

        const bookedSeats = overlappingBookings.reduce((total, booking) => total + (booking.guests || 0), 0);
        const availableSeats = MAX_SEATS - bookedSeats;

        res.status(200).json({
            bookedSeats,
            availableSeats,
            futureAvailability: availableSeats > 0 ? "Available" : "Full",
        });
    } catch (error) {
        res.status(500).json({ message: 'Error checking availability', error });
    }
});



// Delete booking
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBooking = await Booking.findByIdAndDelete(id);
        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting booking', error });
    }
});

module.exports = router;
