// 1. Inisialisasi Mock DB
let notes = JSON.parse(localStorage.getItem('google_keep_notes')) || [];

function saveToMockDB() {
    localStorage.setItem('google_keep_notes', JSON.stringify(notes));
}

// 2. Ambil elemen-elemen dari HTML
const noteTitleInput = document.getElementById('note-title');
const noteContentInput = document.getElementById('note-content');
const addNoteBtn = document.getElementById('add-note-btn');
const notesContainer = document.getElementById('notes-container');

// 3. Fungsi untuk Menampilkan Catatan (READ) + Tombol Hapus
function renderNotes() {
    notesContainer.innerHTML = ''; // Kosongkan container sebelum render ulang
    
    notes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');
        noteCard.innerHTML = `
            <h3>${note.title || '(Tanpa Judul)'}</h3>
            <p>${note.content}</p>
            <button class="delete-btn" onclick="deleteNote(${note.id})">Hapus</button>
        `;
        notesContainer.appendChild(noteCard);
    });
}

// 4. Fungsi untuk Menambahkan Catatan Baru (CREATE)
addNoteBtn.addEventListener('click', () => {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();

    if (content === '') {
        alert('Isi catatan tidak boleh kosong!');
        return;
    }

    const newNote = {
        id: Date.now(), // ID unik berupa timestamp
        title: title,
        content: content
    };

    notes.push(newNote);
    saveToMockDB();
    renderNotes();

    noteTitleInput.value = '';
    noteContentInput.value = '';
});

// 5. Fungsi untuk Menghapus Catatan (DELETE)
window.deleteNote = function(id) {
    // Memfilter array: ambil semua catatan KECUALI yang ID-nya cocok dengan yang dihapus
    notes = notes.filter(note => note.id !== id);
    
    saveToMockDB(); // Simpan perubahan ke Mock DB
    renderNotes();  // Render ulang tampilan agar catatan hilang dari layar
}

// Jalankan fungsi render saat pertama kali web dibuka
renderNotes();