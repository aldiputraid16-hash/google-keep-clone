const noteTitle = document.getElementById('note-title');
const noteContent = document.getElementById('note-content');
const addNoteBtn = document.getElementById('add-note-btn');
const notesContainer = document.getElementById('notes-container');
const searchBar = document.getElementById('search-bar');
let allNotes = [];

// 1. Ambil data catatan dari Backend
async function fetchNotes() {
    try {
        const response = await fetch('/api/notes');
        allNotes = await response.json();
        renderNotes(allNotes);
    } catch (error) {
        console.error("Gagal mengambil data catatan:", error);
    }
}

// 2. Render Catatan ke Layar (Menggunakan addEventListener agar tombol 100% berfungsi)
function renderNotes(notesList) {
    notesContainer.innerHTML = '';
    
    notesList.forEach((note) => {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');
        
        // Kerangka kartu dengan contenteditable agar bisa diklik & diedit langsung
        noteCard.innerHTML = `
            <h3 contenteditable="true" class="edit-title">${note.title || ''}</h3>
            <p contenteditable="true" class="edit-content">${note.content}</p>
            <div class="note-actions">
                <button class="save-btn">Simpan</button>
                <button class="delete-btn">Hapus</button>
            </div>
        `;
        
        // Pasang fungsi tombol Simpan secara aman
        const saveBtn = noteCard.querySelector('.save-btn');
        saveBtn.addEventListener('click', async () => {
            const newTitle = noteCard.querySelector('.edit-title').innerText.trim();
            const newContent = noteCard.querySelector('.edit-content').innerText.trim();
            
            if (newContent === "") {
                alert("Isi catatan tidak boleh kosong!");
                return;
            }
            
            try {
                await fetch(`/api/notes/${note.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: newTitle, content: newContent })
                });
                saveBtn.innerText = "Tersimpan!";
                setTimeout(() => { saveBtn.innerText = "Simpan"; }, 1500);
                fetchNotes(); // Refresh data
            } catch (error) {
                console.error("Gagal mengupdate:", error);
            }
        });
        
        // Pasang fungsi tombol Hapus secara aman
        const deleteBtn = noteCard.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', async () => {
            try {
                await fetch(`/api/notes/${note.id}`, { method: 'DELETE' });
                fetchNotes(); // Refresh data
            } catch (error) {
                console.error("Gagal menghapus:", error);
            }
        });
        
        notesContainer.appendChild(noteCard);
    });
}

// 3. Tambah Catatan Baru
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

// 4. Fitur Pencarian Real-Time
searchBar.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const filteredNotes = allNotes.filter(note => {
        const titleMatch = (note.title || '').toLowerCase().includes(keyword);
        const contentMatch = (note.content || '').toLowerCase().includes(keyword);
        return titleMatch || contentMatch;
    });
    renderNotes(filteredNotes);
});

// Jalankan aplikasi pertama kali
addNoteBtn.addEventListener('click', addNote);
fetchNotes();