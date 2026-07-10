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

// 3. Fungsi untuk Menampilkan Catatan (READ)
function renderNotes() {
    notesContainer.innerHTML = ''; // Kosongkan container sebelum render ulang
    
    notes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');
        noteCard.innerHTML = `
            <h3>${note.title || '(Tanpa Judul)'}</h3>
            <p>${note.content}</p>
        `;
        notesContainer.appendChild(noteCard);
    });
}

// 4. Fungsi untuk Menambahkan Catatan Baru (CREATE)
addNoteBtn.addEventListener('click', () => {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();

    // Validasi agar tidak bisa input catatan kosong
    if (content === '') {
        alert('Isi catatan tidak boleh kosong!');
        return;
    }

    // Format objek catatan baru
    const newNote = {
        id: Date.now(), // ID unik menggunakan timestamp waktu saat ini
        title: title,
        content: content
    };

    notes.push(newNote); // Masukkan ke array lokal
    saveToMockDB();      // Simpan perubahan ke Mock DB (localStorage)
    renderNotes();       // Tampilkan ulang ke layar

    // Kosongkan kembali form input setelah ditambahkan
    noteTitleInput.value = '';
    noteContentInput.value = '';
});

// Panggil fungsi render saat pertama kali web dibuka agar catatan lama muncul
renderNotes();