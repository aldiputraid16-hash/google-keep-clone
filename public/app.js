const noteTitle = document.getElementById('note-title');
const noteContent = document.getElementById('note-content');
const addNoteBtn = document.getElementById('add-note-btn');
const notesContainer = document.getElementById('notes-container');
const searchBar = document.getElementById('search-bar');
const inputContainer = document.querySelector('.input-container');

let allNotes = [];
let currentView = 'Catatan'; 

// 1. Mengambil data catatan
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

// 2. Render Catatan ke Layar 
function renderNotes(notesList) {
    const notesContainer = document.getElementById('notes-container');
    const pinnedContainer = document.getElementById('pinned-notes-container');
    const pinnedSection = document.getElementById('pinned-section');
    const othersTitle = document.getElementById('others-title');
    
    // Reset isi container
    notesContainer.innerHTML = '';
    if (pinnedContainer) pinnedContainer.innerHTML = '';
    
    if (notesList.length === 0) {
        if (pinnedSection) pinnedSection.style.display = 'none';
        if (othersTitle) othersTitle.style.display = 'none';
        notesContainer.innerHTML = `<p style="color: var(--text-secondary); text-align: center; width: 100%; margin-top: 20px;">Tidak ada catatan di sini.</p>`;
        return;
    }
    
    // Cek apakah ada catatan yang disematkan (is_pinned === 1)
    const hasPinned = notesList.some(note => note.is_pinned === 1 && currentView === 'Catatan');
    
    if (hasPinned) {
        if (pinnedSection) pinnedSection.style.display = 'block';
        if (othersTitle) othersTitle.style.display = 'block';
    } else {
        if (pinnedSection) pinnedSection.style.display = 'none';
        if (othersTitle) othersTitle.style.display = 'none';
    }
    
    notesList.forEach((note) => {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');
        
        // Tandai class jika kartu ini disematkan
        if (note.is_pinned === 1 && currentView === 'Catatan') {
            noteCard.classList.add('pinned');
        }
        
        let trashInfo = '';
        let dropdownItems = '';

        // SINKRONISASI DROPDOWN DENGAN MENU "BUAT SALINAN"
        if (currentView === 'Sampah') {
            trashInfo = `<div class="trash-time-info"><i class="far fa-clock"></i> 7 hari lagi</div>`;
            dropdownItems = `
                <div class="dropdown-item restore-btn"><i class="fas fa-undo"></i> Pulihkan</div>
                <div class="dropdown-item delete-perm-btn delete-danger"><i class="fas fa-trash-alt"></i> Hapus Selamanya</div>
            `;
        } else if (currentView === 'Arsipkan') {
            dropdownItems = `
                <div class="dropdown-item unarchive-btn"><i class="fas fa-upload"></i> Pindahkan ke Catatan</div>
                <div class="dropdown-item duplicate-btn"><i class="fas fa-copy"></i> Buat salinan</div>
                <div class="dropdown-item trash-btn"><i class="fas fa-trash"></i> Hapus (Ke Sampah)</div>
            `;
        } else {
            dropdownItems = `
                <div class="dropdown-item archive-btn"><i class="fas fa-archive"></i> Arsipkan</div>
                <div class="dropdown-item duplicate-btn"><i class="fas fa-copy"></i> Buat salinan</div>
                <div class="dropdown-item trash-btn"><i class="fas fa-trash"></i> Hapus (Ke Sampah)</div>
            `;
        }

        // Ikon pin berubah warna aktif jika is_pinned bernilai 1
        const pinIconColor = note.is_pinned === 1 ? 'color: var(--accent-color);' : 'color: var(--text-secondary);';

        noteCard.innerHTML = `
            ${trashInfo}
            <button class="card-pin-btn" title="${note.is_pinned === 1 ? 'Lepas Sematan' : 'Sematkan Catatan'}" style="opacity: ${note.is_pinned === 1 ? '1' : ''};">
                <i class="fas fa-thumbtack" style="${pinIconColor}"></i>
            </button>
            <h3 contenteditable="${currentView === 'Catatan'}" class="edit-title">${note.title || ''}</h3>
            <p contenteditable="${currentView === 'Catatan'}" class="edit-content">${note.content}</p>
            
            <div class="note-card-footer">
                <button class="more-options-btn" title="Lainnya"><i class="fas fa-ellipsis-v"></i></button>
                <div class="custom-dropdown-menu">
                    ${dropdownItems}
                </div>
            </div>
        `;
        
        // --- LOGIKA TOMBOL PIN (SEMATKAN) ---
        const pinBtn = noteCard.querySelector('.card-pin-btn');
        if (currentView !== 'Catatan') {
            if (pinBtn) pinBtn.style.display = 'none'; // Sembunyikan tombol pin jika di menu Sampah/Arsip
        } else {
            if (pinBtn) {
                pinBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const nextPinnedStatus = note.is_pinned === 1 ? 0 : 1;
                    
                    try {
                        await fetch(`/api/notes/${note.id}/pin`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ is_pinned: nextPinnedStatus })
                        });
                        fetchNotes(); // Reload layout catatan
                    } catch (err) {
                        console.error("Gagal mengubah status pin:", err);
                    }
                });
            }
        }
        
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
        
        // --- LOGIKA DROPDOWN MENU ---
        const moreBtn = noteCard.querySelector('.more-options-btn');
        const dropdown = noteCard.querySelector('.custom-dropdown-menu');
        
        moreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.custom-dropdown-menu').forEach(d => {
                if(d !== dropdown) d.classList.remove('show');
            });
            dropdown.classList.toggle('show');
        });

        // --- HANDLER TOMBOL DROPDOWN ---
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

        const trashBtn = noteCard.querySelector('.trash-btn');
        if (trashBtn) {
            trashBtn.addEventListener('click', async () => {
                await fetch(`/api/notes/${note.id}`, { method: 'DELETE' });
                fetchNotes();
            });
        }

        const restoreBtn = noteCard.querySelector('.restore-btn');
        if (restoreBtn) {
            restoreBtn.addEventListener('click', async () => {
                await fetch(`/api/notes/${note.id}/restore`, { method: 'PUT' });
                fetchNotes();
            });
        }

        const deletePermBtn = noteCard.querySelector('.delete-perm-btn');
        if (deletePermBtn) {
            deletePermBtn.addEventListener('click', async () => {
                await fetch(`/api/notes/${note.id}/permanent`, { method: 'DELETE' });
                fetchNotes();
            });
        }

        // Logika Klik untuk menduplikasi Catatan (Buat salinan)
        const duplicateBtn = noteCard.querySelector('.duplicate-btn');
        if (duplicateBtn) {
            duplicateBtn.addEventListener('click', async () => {
                try {
                    await fetch(`/api/notes/${note.id}/duplicate`, {
                        method: 'POST'
                    });
                    fetchNotes(); // Reload layar agar salinan langsung muncul
                } catch (error) {
                    console.error("Gagal menduplikasi catatan:", error);
                }
            });
        }
        
        // Masukkan kartu ke section yang tepat (Pinned vs Others)
        if (note.is_pinned === 1 && currentView === 'Catatan') {
            if (pinnedContainer) pinnedContainer.appendChild(noteCard);
        } else {
            notesContainer.appendChild(noteCard);
        }
    });
}

// 3. Tambah Catatan Baru
async function addNote() {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    // Jika kosong dua-duanya, abaikan proses simpan
    if (title === "" && content === "") {
        resetInputForm(); // Bersihkan form
        return;
    }

    try {
        await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title: title, 
                content: content,
                is_pinned: isInputPinned // Kirim status pin aktif dari form atas ke backend
            })
        });
        
        resetInputForm(); // Reset form dan warna pin setelah sukses menyimpan
        fetchNotes(); 
    } catch (error) {
        console.error("Gagal menambah catatan:", error);
    }
}

// Fungsi membantu untuk mereset tampilan form input atas ke semula
function resetInputForm() {
    noteTitle.value = '';
    noteContent.value = '';
    isInputPinned = 0;
    if (inputPinBtn) {
        const pinIcon = inputPinBtn.querySelector('i');
        if (pinIcon) pinIcon.style.color = 'var(--text-secondary)';
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

// --- LOGIKA TOMBOL PIN PADA FORM INPUT UTAMA (ATAS) ---
let isInputPinned = 0; // 0 = tidak disematkan, 1 = disematkan
const inputPinBtn = document.querySelector('.pin-btn-input');

if (inputPinBtn) {
    inputPinBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Mencegah form tertutup otomatis
        
        // Toggle status pin (0 jadi 1, 1 jadi 0)
        isInputPinned = isInputPinned === 0 ? 1 : 0;
        
        // Ubah warna ikon paku payung sesuai status aktif
        const pinIcon = inputPinBtn.querySelector('i');
        if (isInputPinned === 1) {
            pinIcon.style.color = 'var(--accent-color)'; // Berubah jadi Kuning Google Keep
            inputPinBtn.setAttribute('title', 'Lepas Sematan');
        } else {
            pinIcon.style.color = 'var(--text-secondary)'; // Kembali ke warna semula
            inputPinBtn.setAttribute('title', 'Sematkan Catatan');
        }
    });
}

// Jalankan aplikasi pertama kali
fetchNotes();