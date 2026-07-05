// Run with: node seed.js
// Seeds an admin user and a few sample events.
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const Event = require("./models/Event");

dotenv.config();

const run = async () => {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || "admin@bookmyevent.com";
  const adminExists = await User.findOne({ email: adminEmail });

  if (!adminExists) {
    await User.create({
      name: "Admin",
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || "Admin@123",
      role: "admin",
    });
    console.log("Admin user created:", adminEmail);
  } else {
    console.log("Admin user already exists");
  }

  const eventCount = await Event.countDocuments();
  if (eventCount === 0) {
    await Event.insertMany([
      {
        title: "Coldplay Live in Concert",
        description: "An unforgettable night of music with Coldplay performing their greatest hits live.",
        location: "Mumbai, India",
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        time: "7:00 PM",
        price: 2999,
        totalSeats: 100,
        availableSeats: 100,
        category: "Music",
      },
      {
        title: "Stand-Up Comedy Night",
        description: "A hilarious evening with top comedians from around the country.",
        location: "Bengaluru, India",
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        time: "8:00 PM",
        price: 599,
        totalSeats: 60,
        availableSeats: 60,
        category: "Comedy",
      },
      {
        title: "Tech Conference 2026",
        description: "Explore the future of technology with industry leaders and innovators.",
        location: "Pune, India",
        date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        time: "10:00 AM",
        price: 1499,
        totalSeats: 200,
        availableSeats: 200,
        category: "Conference",
      },
    ]);
    console.log("Sample events created");
  } else {
    console.log("Events already exist, skipping seed");
  }

  process.exit();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
