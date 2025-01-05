const express = require("express");
require('dotenv').config();
const cors = require("cors");
const bodyParser = require("body-parser");
const bookingModel = require("./database/bookModel");
const connectDb = require("./database/connection");


const app = express();
const port = 3000;

app.use(cors("*"));
app.use(bodyParser.json());

// Route to create a new booking
app.post("/api/book/create", async (req, res) => {
  const { name, number, email, guest, time, date } = req.body;

  if (!name || !number || !email || !guest || !time || !date) {
    return res.status(400).json({ message: "All fields are required." });
  }

  console.log("date and time ", date + time);
  

  const combineDateAndTime = (date, time) => {
    const dateTime = `${date}, ${time}`
    const dateObj = new Date(dateTime);
    return dateObj;
  };

  const bookingDateTime = combineDateAndTime(date, time);

  await connectDb();

  try {
    const existingBooking = await bookingModel.findOne({ bookingTime: bookingDateTime });

    if (existingBooking) {
      return res.status(409).json({ message: "Time slot already booked." });
    }

    const booking = new bookingModel({
      customerName: name,
      contactNumber: number,
      emailAddress: email,
      guestCount: guest,
      bookingTime: bookingDateTime,
    });

    await booking.save();
    res.status(201).json({ message: "Booking created successfully.", booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Route to get all bookings
app.get("/api/book", async (req, res) => {
  await connectDb();

  try {
    const bookings = await bookingModel.find().sort({ bookingTime: 1 }); // Sort by booking time
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Route to delete a booking by ID
app.delete("/api/book/:id", async (req, res) => {
  const { id } = req.params;

  await connectDb();

  try {
    const booking = await bookingModel.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.status(200).json({ message: "Booking deleted successfully.", booking });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
