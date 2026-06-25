const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;
const NOTES_FILE = "notes.json";

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Create notes.json if it doesn't exist
if (!fs.existsSync(NOTES_FILE)) {
    fs.writeFileSync(NOTES_FILE, "[]");
}

/* GET ALL NOTES */

app.get("/api/notes", (req, res) => {
    const notes = JSON.parse(
        fs.readFileSync(NOTES_FILE, "utf8")
    );
    res.json(notes);
});

/* ADD NOTE */

app.post("/api/notes", (req, res) => {
    const { title, date, note } = req.body;
    const notes = JSON.parse(
        fs.readFileSync(NOTES_FILE, "utf8")
    );
    const newNote = {
        id: Date.now(),
        title,
        date,
        note
    };
    notes.push(newNote);
    fs.writeFileSync(
        NOTES_FILE,
        JSON.stringify(notes, null, 2)
    );
    res.status(201).json(newNote);
});

/* DELETE NOTE */

app.delete("/api/notes/:id", (req, res) => {
    const id = Number(req.params.id);
    let notes = JSON.parse(
        fs.readFileSync(NOTES_FILE, "utf8")
    );
    notes = notes.filter(
        note => note.id !== id
    );
    fs.writeFileSync(
        NOTES_FILE,
        JSON.stringify(notes, null, 2)
    );
    res.json({
        message: "Note deleted successfully"
    });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});