const { Schema, model, models } = require("mongoose");

const bookingSchema = new Schema({
  customerName: { type: String, required: true },
  contactNumber: { type: Number, required: true },
  emailAddress: { type: String, required: true },
  guestCount: { type: Number, required: true },
  bookingTime: { type: Date, required: true, unique: true },
});

const bookingModel = models.Booking || model("Booking", bookingSchema);

module.exports = bookingModel;
