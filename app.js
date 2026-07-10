// 1. Inisialisasi Mock DB
let notes = JSON.parse(localStorage.getItem('google_keep_notes')) || [];
let editId = null; // Menyimpan ID catatan yang sedang diedit (jika ada)

function saveToMockDB() {
    localStorage.setItem('google_keep_notes', JSON.stringify(notes));
}

// 2. Ambil Elemen HTML
const noteTitleInput = document.getElementById('note-title');
const noteContentInput = document.getElementById('note-content');
const addNoteBtn = document.getElementById('add-note-btn');
const notesContainer = document.getElementById('notes-container');

// 3. Fungsi Menampilkan Catatan (READ) berbentuk Grid Card
function renderNotes() {
    notesContainer.innerHTML = '';
    
    notes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');
        noteCard.innerHTML = `
            <div>
                <h3>${note.title || '(Tanpa Judul)'}</h3>
                <p>${note.content}</p>
            </div>
            <div class="card-actions">
                <button onclick="startEdit(${note.id})">Edit</button>
                <button class="delete-btn" onclick="deleteNote(${note.id})">Hapus</button>
            </div>
        `;
        notesContainer.appendChild(noteCard);
    });
}

// 4. Fungsi Tambah (CREATE) & Edit (UPDATE)
addNoteBtn.addEventListener('click', () => {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();

    if (content === '') {
        alert('Isi catatan tidak boleh kosong!');
        return;
    }

    if (editId !== null) {
        // Mode UPDATE: cari catatan lama berdasarkan editId lalu ubah isinya
        notes = notes.map(note => {
            if (note.id === editId) {
                return { ...note, title: title, content: content };
            }
            return note;
        });
        editId = null; // Reset kembali mode edit
        addNoteBtn.innerText = 'Simpan';
    } else {
        // Mode CREATE: buat catatan baru
        const newNote = {
            id: Date.now(),
            title: title,
            content: content
        };
        notes.push(newNote);
    }

    saveToMockDB();
    renderNotes();

    // Reset Form Input
    noteTitleInput.value = '';
    noteContentInput.value = '';
});

// 5. Fungsi Mengaktifkan Mode Edit (Mengisi form atas dengan data lama)
window.startEdit = function(id) {
    const targetNote = notes.find(note => note.id === id);
    if (targetNote) {
        noteTitleInput.value = targetNote.title;
        noteContentInput.value = targetNote.content;
        editId = id; // Kunci ID yang mau diedit
        addNoteBtn.innerText = 'Perbarui'; // Ubah teks tombol
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll otomatis ke atas form
    }
}

// 6. Fungsi Hapus (DELETE)
window.deleteNote = function(id) {
    notes = notes.filter(note => note.id !== id);
    saveToMockDB();
    renderNotes();
}

// Render pertama kali saat aplikasi dibuka
renderNotes();