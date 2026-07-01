require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Note = require("./models/Note");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
})
.catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
});

/* GET ALL NOTES */
app.get("/api/notes", async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ADD NOTE */
app.post("/api/notes", async (req, res) => {
    try {
        const { title, date, note } = req.body;

        const newNote = await Note.create({
            title,
            date,
            note
        });

        res.status(201).json(newNote);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* DELETE NOTE */
app.delete("/api/notes/:id", async (req, res) => {
    try {
       const deletedNote = await Note.findByIdAndDelete(req.params.id);

if (!deletedNote) {
    return res.status(404).json({
        message: "Note not found"
    });
}

res.json({
    message: "Note deleted successfully"
});

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
