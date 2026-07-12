const noteTitle = document.getElementById('note-title');
const noteContent = document.getElementById('note-content');
const addNoteBtn = document.getElementById('add-note-btn');
const notesContainer = document.getElementById('notes-container');
const searchBar = document.getElementById('search-bar');
let allNotes = []; 

// 1. Fungsi mengambil data dari MySQL via Backend
async function fetchNotes() {
    try {
        const response = await fetch('/api/notes');
        allNotes = await response.json(); 
        renderNotes(allNotes); 
    } catch (error) {
        console.error("Gagal mengambil data catatan:", error);
    }
}

// 2. Fungsi merender data catatan ke HTML (Sudah ditambahkan tombol Edit)
function renderNotes(notesList) {
    notesContainer.innerHTML = '';
    
    notesList.forEach((note) => {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');
        
        noteCard.innerHTML = `
            <h3>${note.title || 'Tanpa Judul'}</h3>
            <p>${note.content}</p>
            <div class="note-actions">
                <button class="edit-btn" onclick="editNote(${note.id}, '${note.title || ''}', '${note.content.replace(/'/g, "\\'")}')">Edit</button>
                <button class="delete-btn" onclick="deleteNote(${note.id})">Hapus</button>
            </div>
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

        noteTitle.value = '';
        noteContent.value = '';
        fetchNotes(); 
    } catch (error) {
        console.error("Gagal menambah catatan:", error);
    }
}

// 4. Fungsi mengedit/update catatan via Backend (TAMBAHAN BARU)
window.editNote = async function(id, currentTitle, currentContent) {
    const newTitle = prompt("Masukkan judul baru:", currentTitle);
    if (newTitle === null) return; // Batalkan jika user klik Cancel

    const newContent = prompt("Masukkan isi catatan baru:", currentContent);
    if (newContent === null) return; // Batalkan jika user klik Cancel

    if (newContent.trim() === "") {
        alert("Isi catatan tidak boleh kosong!");
        return;
    }

    try {
        await fetch(`/api/notes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle.trim(), content: newContent.trim() })
        });
        fetchNotes(); // Refresh tampilan setelah sukses update
    } catch (error) {
        console.error("Gagal mengupdate catatan:", error);
    }
};

// 5. Fungsi menghapus catatan dari MySQL via Backend berdasarkan ID
window.deleteNote = async function(id) {
    if (confirm("Apakah Anda yakin ingin menghapus catatan ini?")) {
        try {
            await fetch(`/api/notes/${id}`, { method: 'DELETE' });
            fetchNotes(); 
        } catch (error) {
            console.error("Gagal menghapus catatan:", error);
        }
    }
};

// Fungsi untuk memfilter catatan secara real-time saat user mengetik
searchBar.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    
    // Filter data dari variabel allNotes yang sudah kita simpan tadi
    const filteredNotes = allNotes.filter(note => {
        const titleMatch = (note.title || '').toLowerCase().includes(keyword);
        const contentMatch = (note.content || '').toLowerCase().includes(keyword);
        return titleMatch || contentMatch;
    });
    
    // Tampilkan hanya catatan yang cocok dengan kata kunci pencarian
    renderNotes(filteredNotes);
});

addNoteBtn.addEventListener('click', addNote);

// Jalankan fetch saat pertama kali web dibuka
fetchNotes();