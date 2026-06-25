const noteForm = document.getElementById("noteForm");
const notesContainer = document.getElementById("notesContainer");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const dateFilter = document.getElementById("dateFilter");
const noteInput = document.getElementById("note");
const charCount = document.getElementById("charCount");
let allNotes = [];
/* CHARACTER COUNTER*/
noteInput.addEventListener("input", () => {
    charCount.textContent = noteInput.value.length;
});

/* LOAD NOTES */

async function loadNotes() {
    try {
        const response = await fetch("/api/notes");
        const notes = await response.json();
        allNotes = notes;
        displayNotes(notes);
    } catch (error) {
        console.error("Error loading notes:", error);
    }
}

/* DISPLAY NOTES */

function displayNotes(notes) {
    notesContainer.innerHTML = "";
    if (notes.length === 0) {
        emptyState.style.display = "block";
        return;
    }
    emptyState.style.display = "none";
    notes
        .sort((a, b) => b.id - a.id)
        .forEach(note => {
            const card = document.createElement("div");
            card.classList.add("note-card");
            card.innerHTML = `
                <h3 class="note-title">
                    ${note.title}
                </h3>
                <div class="note-date">
                    📅 ${formatDate(note.date)}
                </div>
                <div class="note-text">
                    ${note.note}
                </div>
                <button
                    class="delete-btn"
                    onclick="deleteNote(${note.id})"
                >
                    🗑 Delete
                </button>
            `;
            notesContainer.appendChild(card);
        });
}

// FILTER NOTES

function applyFilters() {

    const searchValue =
        searchInput.value.toLowerCase();

    const selectedDate =
        dateFilter.value;

    const filteredNotes = allNotes.filter(note => {

        const matchesSearch =

            note.title.toLowerCase().includes(searchValue) ||

            note.note.toLowerCase().includes(searchValue) ||

            note.date.toLowerCase().includes(searchValue);

        const matchesDate =

            selectedDate === "" ||

            note.date === selectedDate;

        return matchesSearch && matchesDate;

    });

    displayNotes(filteredNotes);
}


/* FORMAT DATE */

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

/* ADD NOTE */

noteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title =
        document.getElementById("title").value.trim();
    const date =
        document.getElementById("date").value;
    const note =
        document.getElementById("note").value.trim();
    if (!title || !date || !note) {
        alert("Please fill all fields.");
        return;
    }
    try {
        const response = await fetch("/api/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                date,
                note
            })
        });
        if (response.ok) {
            noteForm.reset();
            charCount.textContent = "0";
            loadNotes();
        }
    } catch (error) {
        console.error("Error adding note:", error);
    }
});

/* DELETE NOTE */

async function deleteNote(id) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this note?"
    );
    if (!confirmDelete) return;
    try {
        await fetch(`/api/notes/${id}`, {
            method: "DELETE"
        });
        loadNotes();
    } catch (error) {
        console.error("Error deleting note:", error);
    }
}

/* SEARCH NOTES*/

searchInput.addEventListener("input", applyFilters);
dateFilter.addEventListener("change", applyFilters);

// CLEAR NOTES

const clearFilter =
document.getElementById("clearFilter");

clearFilter.addEventListener("click", () => {

    searchInput.value = "";

    dateFilter.value = "";

    displayNotes(allNotes);

});


loadNotes();
