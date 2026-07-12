const noteTitle = document.getElementById('note-title');
const noteContent = document.getElementById('note-content');
const addNoteBtn = document.getElementById('add-note-btn');
const notesContainer = document.getElementById('notes-container');
const searchBar = document.getElementById('search-bar');
const inputContainer = document.querySelector('.input-container');

let allNotes = [];
let currentView = 'Catatan'; 

// 1. Ambil data catatan dari Backend sesuai halaman yang aktif
async function fetchNotes() {
    let url = '/api/notes';
    
    // Tentukan endpoint API berdasarkan halaman yang sedang dibuka di sidebar
    if (currentView === 'Arsipkan') {
        url = '/api/notes/archived';
        if(inputContainer) inputContainer.style.display = 'none'; // Sembunyikan form input di arsip
    } else if (currentView === 'Sampah') {
        url = '/api/notes/trashed';
        if(inputContainer) inputContainer.style.display = 'none'; // Sembunyikan form input di sampah
    } else {
        if(inputContainer) inputContainer.style.display = 'block'; // Munculkan form input di halaman utama
    }

    try {
        const response = await fetch(url);
        allNotes = await response.json();
        renderNotes(allNotes);
    } catch (error) {
        console.error("Gagal mengambil data catatan:", error);
    }
}

// 2. Render Catatan ke Layar dengan Dropdown Menu Titik Tiga
function renderNotes(notesList) {
    notesContainer.innerHTML = '';
    
    if (notesList.length === 0) {
        notesContainer.innerHTML = `<p style="color: var(--text-secondary); text-align: center; width: 100%; margin-top: 20px;">Tidak ada catatan di sini.</p>`;
        return;
    }
    
    notesList.forEach((note) => {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');
        
        let trashInfo = '';
        let dropdownItems = '';

        // Tentukan isi menu dropdown berdasarkan halaman aktif
        if (currentView === 'Sampah') {
            trashInfo = `<div class="trash-time-info"><i class="far fa-clock"></i> 7 hari lagi</div>`;
            dropdownItems = `
                <div class="dropdown-item restore-btn"><i class="fas fa-undo"></i> Pulihkan</div>
                <div class="dropdown-item delete-perm-btn delete-danger"><i class="fas fa-trash-alt"></i> Hapus Selamanya</div>
            `;
        } else if (currentView === 'Arsipkan') {
            dropdownItems = `
                <div class="dropdown-item unarchive-btn"><i class="fas fa-upload"></i> Pindahkan ke Catatan</div>
                <div class="dropdown-item trash-btn"><i class="fas fa-trash"></i> Hapus (Ke Sampah)</div>
            `;
        } else {
            dropdownItems = `
                <div class="dropdown-item archive-btn"><i class="fas fa-archive"></i> Arsipkan</div>
                <div class="dropdown-item trash-btn"><i class="fas fa-trash"></i> Hapus (Ke Sampah)</div>
            `;
        }

        noteCard.innerHTML = `
            ${trashInfo}
            <button class="card-pin-btn" title="Sematkan"><i class="fas fa-thumbtack"></i></button>
            <h3 contenteditable="${currentView === 'Catatan'}" class="edit-title">${note.title || ''}</h3>
            <p contenteditable="${currentView === 'Catatan'}" class="edit-content">${note.content}</p>
            
            <div class="note-card-footer">
                <button class="more-options-btn" title="Lainnya"><i class="fas fa-ellipsis-v"></i></button>
                <div class="custom-dropdown-menu">
                    ${dropdownItems}
                </div>
            </div>
        `;
        
        // --- LOGIKA AUTO SAVE ON BLUR ---
        if (currentView === 'Catatan') {
            const titleField = noteCard.querySelector('.edit-title');
            const contentField = noteCard.querySelector('.edit-content');

            const autoSave = async () => {
                const newTitle = titleField.innerText.trim();
                const newContent = contentField.innerText.trim();
                await fetch(`/api/notes/${note.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: newTitle, content: newContent })
                });
            };
            titleField.addEventListener('blur', autoSave);
            contentField.addEventListener('blur', autoSave);
        }
        
        // --- LOGIKA MUNCULKAN / SEMBUNYIKAN DROPDOWN ---
        const moreBtn = noteCard.querySelector('.more-options-btn');
        const dropdown = noteCard.querySelector('.custom-dropdown-menu');
        
        moreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.custom-dropdown-menu').forEach(d => {
                if(d !== dropdown) d.classList.remove('show');
            });
            dropdown.classList.toggle('show');
        });

        // --- EVENT HANDLER UNTUK TOMBOL DI DALAM DROPDOWN ---
        
        // Tombol Arsipkan
        const archiveBtn = noteCard.querySelector('.archive-btn');
        if (archiveBtn) {
            archiveBtn.addEventListener('click', async () => {
                await fetch(`/api/notes/${note.id}/archive`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ is_archived: 1 })
                });
                fetchNotes();
            });
        }

        // Tombol Kembalikan dari Arsip
        const unarchiveBtn = noteCard.querySelector('.unarchive-btn');
        if (unarchiveBtn) {
            unarchiveBtn.addEventListener('click', async () => {
                await fetch(`/api/notes/${note.id}/archive`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ is_archived: 0 })
                });
                fetchNotes();
            });
        }

        // Tombol Buang ke Sampah (Soft Delete)
        const trashBtn = noteCard.querySelector('.trash-btn');
        if (trashBtn) {
            trashBtn.addEventListener('click', async () => {
                await fetch(`/api/notes/${note.id}`, { method: 'DELETE' });
                fetchNotes();
            });
        }

        // Tombol Pulihkan dari Sampah
        const restoreBtn = noteCard.querySelector('.restore-btn');
        if (restoreBtn) {
            restoreBtn.addEventListener('click', async () => {
                await fetch(`/api/notes/${note.id}/restore`, { method: 'PUT' });
                fetchNotes();
            });
        }

        // Tombol Hapus Permanen (Tanpa Pop-Up)
        const deletePermBtn = noteCard.querySelector('.delete-perm-btn');
        if (deletePermBtn) {
            deletePermBtn.addEventListener('click', async () => {
                await fetch(`/api/notes/${note.id}/permanent`, { method: 'DELETE' });
                fetchNotes();
            });
        }
        
        notesContainer.appendChild(noteCard);
    });
}

// Tutup dropdown jika klik di luar kartu
document.addEventListener('click', () => {
    document.querySelectorAll('.custom-dropdown-menu').forEach(d => d.classList.remove('show'));
});

// 3. Tambah Catatan Baru
async function addNote() {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    // Jika kosong dua-duanya, abaikan proses simpan
    if (title === "" && content === "") {
        noteTitle.value = '';
        noteContent.value = '';
        return;
    }

    try {
        await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        });
        
        // Reset form input setelah berhasil disimpan
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
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        const rawText = item.innerText.trim();
        
        if (rawText.includes('Catatan')) {
            currentView = 'Catatan';
        } else if (rawText.includes('Arsipkan') || rawText.includes('Arsip')) {
            currentView = 'Arsipkan';
        } else if (rawText.includes('Sampah')) {
            currentView = 'Sampah';
        }
        
        fetchNotes(); 
    });
});

// Jalankan fungsi simpan saat tombol "Tutup" diklik
addNoteBtn.addEventListener('click', addNote);

// Otomatis simpan saat pengguna mengeklik area di luar box input (Fitur Otentik Google Keep)
document.addEventListener('click', (e) => {
    if (inputContainer && !inputContainer.contains(e.target) && e.target !== addNoteBtn) {
        addNote();
    }
});

// Jalankan aplikasi pertama kali
fetchNotes();