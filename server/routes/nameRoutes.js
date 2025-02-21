const express = require('express');
const router = express.Router();

const Name = require('../models/Name'); 

router.get('/', async (req, res) => {
  try {
    const names = await Name.find();
    res.json(names);
  } catch (err) {
    console.error("Error fetching names:", err);
    res.status(500).json({ error: 'Error fetching names' });
  }
});

router.post('/', async (req, res) => {
  try {
    console.log("Received Data:", req.body); 

    let { name, color, number, food } = req.body;

    if (!name || name.trim() === "") {
      console.log("Error: Name is missing");
      return res.status(400).json({ error: "Name is required." });
    }

    number = parseInt(number, 10) || 0;

    const newEntry = new Name({ name, color, number, food });

    console.log("Saving to MongoDB:", newEntry); 

    await newEntry.save();
    res.status(201).json({ message: "Entry added", newEntry });

  } catch (err) {
    console.error("Error adding entry:", err);
    res.status(500).json({ error: "Error adding entry" });
  }
});

router.delete('/', async (req, res) => {
  try {
    console.log("Delete Request Received:", req.body); 

    const { action } = req.body;

    if (action === "deleteLast") {
      const lastEntry = await Name.findOne().sort({ _id: -1 });
      if (lastEntry) {
        await Name.findByIdAndDelete(lastEntry._id);
        console.log("Deleted last entry:", lastEntry);
      }
    } else if (action === "clearAll") {
      await Name.deleteMany({});
      console.log("All entries deleted");
    } else {
      return res.status(400).json({ error: "Invalid delete request" });
    }

    res.json({ message: "Deletion successful" });

  } catch (err) {
    console.error("Error deleting data:", err);
    res.status(500).json({ error: "Error deleting data" });
  }
});

module.exports = router;