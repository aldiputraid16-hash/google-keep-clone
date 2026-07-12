const noteTitle = document.getElementById('note-title');
const noteContent = document.getElementById('note-content');
const addNoteBtn = document.getElementById('add-note-btn');
const notesContainer = document.getElementById('notes-container');

// 1. Fungsi mengambil data dari MySQL via Backend
async function fetchNotes() {
    try {
        const response = await fetch('/api/notes');
        const notes = await response.json();
        renderNotes(notes);
    } catch (error) {
        console.error("Gagal mengambil data catatan:", error);
    }
}

// 2. Fungsi merender data catatan ke HTML
function renderNotes(notesList) {
    notesContainer.innerHTML = '';
    
    notesList.forEach((note) => {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');
        
        noteCard.innerHTML = `
            <h3>${note.title || 'Tanpa Judul'}</h3>
            <p>${note.content}</p>
            <button class="delete-btn" onclick="deleteNote(${note.id})">Hapus</button>
        `;
        
        notesContainer.appendChild(noteCard);
    });
}

// 3. Fungsi menambah catatan baru ke MySQL via Backend
async function addNote() {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    if (content === "") {
        alert("Isi catatan tidak boleh kosong!");
        return;
    }

    try {
        await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        });

        // Reset input form setelah sukses disimpan
        noteTitle.value = '';
        noteContent.value = '';
        
        // Refresh tampilan agar data terbaru dari DB langsung muncul
        fetchNotes(); 
    } catch (error) {
        console.error("Gagal menambah catatan:", error);
    }
}

// 4. Fungsi menghapus catatan dari MySQL via Backend berdasarkan ID
window.deleteNote = async function(id) {
    if (confirm("Apakah Anda yakin ingin menghapus catatan ini?")) {
        try {
            await fetch(`/api/notes/${id}`, { method: 'DELETE' });
            fetchNotes(); // Refresh tampilan setelah dihapus
        } catch (error) {
            console.error("Gagal menghapus catatan:", error);
        }
    }
};

// Pasang event listener pada tombol "Simpan"
addNoteBtn.addEventListener('click', addNote);

// Jalankan fungsi fetch pertama kali saat web dibuka agar data dari Laragon langsung muncul
fetchNotes();