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

// 2. Render Catatan ke Layar dengan Bar Ikon Modern
function renderNotes(notesList) {
    notesContainer.innerHTML = '';
    
    notesList.forEach((note) => {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');
        
        // Membungkus kartu dengan ikon-ikon aksi di bagian bawahnya
        noteCard.innerHTML = `
            <h3 contenteditable="true" class="edit-title">${note.title || ''}</h3>
            <p contenteditable="true" class="edit-content">${note.content}</p>
            <div class="note-actions">
                <button class="icon-btn archive-btn" title="Arsipkan"><i class="fas fa-archive"></i></button>
                <button class="icon-btn delete-btn" title="Buang ke sampah"><i class="fas fa-trash"></i></button>
                <button class="save-btn">Simpan</button>
            </div>
        `;
        
        // Fungsi tombol Simpan Inline
        const saveBtn = noteCard.querySelector('.save-btn');
        saveBtn.addEventListener('click', async () => {
            const newTitle = noteCard.querySelector('.edit-title').innerText.trim();
            const newContent = noteCard.querySelector('.edit-content').innerText.trim();
            try {
                await fetch(`/api/notes/${note.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: newTitle, content: newContent })
                });
                saveBtn.innerText = "Tersimpan!";
                setTimeout(() => { saveBtn.innerText = "Simpan"; }, 1500);
                fetchNotes();
            } catch (error) {
                console.error("Gagal mengupdate:", error);
            }
        });
        
        // Fungsi tombol Ubah Jadi Arsip (Sementara kita pakai DELETE atau update status nanti)
        const archiveBtn = noteCard.querySelector('.archive-btn');
        archiveBtn.addEventListener('click', () => {
            alert("Fitur arsip terpicu untuk ID: " + note.id);
            // Nanti dihubungkan ke backend statusis_archived
        });

        // Fungsi tombol Hapus (Buang ke Sampah)
        const deleteBtn = noteCard.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', async () => {
            try {
                await fetch(`/api/notes/${note.id}`, { method: 'DELETE' });
                fetchNotes();
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

// 5. Logika Navigasi Aktif Sidebar Kiri
const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        // Hapus kelas active dari semua menu
        menuItems.forEach(i => i.classList.remove('active'));
        // Tambahkan kelas active ke menu yang diklik
        item.classList.add('active');
        
        // Info log untuk memastikan klik berfungsi sebelum kita pasang filternya
        console.log("Pindah ke halaman: " + item.innerText);
    });
});

// Jalankan aplikasi pertama kali
addNoteBtn.addEventListener('click', addNote);
fetchNotes();