const noteTitle = document.getElementById('note-title');
const noteContent = document.getElementById('note-content');
const addNoteBtn = document.getElementById('add-note-btn');
const notesContainer = document.getElementById('notes-container');
const searchBar = document.getElementById('search-bar');
const inputContainer = document.querySelector('.input-container');

let allNotes = [];
let currentView = 'Catatan'; 
let isInputPinned = 0; // 0 = tidak disematkan, 1 = disematkan
let currentInputColor = '#202124'; // Menyimpan state warna form input atas

// Pilihan warna otentik Google Keep Dark Mode
const colorPalette = [
    { name: 'Default', value: '#202124' },
    { name: 'Merah Tua', value: '#5c2b29' },
    { name: 'Jingga', value: '#614a19' },
    { name: 'Kuning', value: '#635d19' },
    { name: 'Hijau Tua', value: '#345920' },
    { name: 'Teal', value: '#16504b' },
    { name: 'Biru', value: '#2d555e' },
    { name: 'Biru Tua', value: '#1e3a5f' },
    { name: 'Ungu', value: '#42275a' },
    { name: 'Merah Muda', value: '#5b2245' }
];

async function fetchNotes() {
    let url = '/api/notes';
    if (currentView === 'Arsipkan') {
        url = '/api/notes/archived';
        if(inputContainer) inputContainer.style.display = 'none';
    } else if (currentView === 'Sampah') {
        url = '/api/notes/trashed';
        if(inputContainer) inputContainer.style.display = 'none';
    } else {
        if(inputContainer) inputContainer.style.display = 'block';
    }

    try {
        const response = await fetch(url);
        allNotes = await response.json();
        renderNotes(allNotes);
    } catch (error) {
        console.error("Gagal mengambil data catatan:", error);
    }
}

function renderNotes(notesList) {
    const notesContainer = document.getElementById('notes-container');
    const pinnedContainer = document.getElementById('pinned-notes-container');
    const pinnedSection = document.getElementById('pinned-section');
    const othersTitle = document.getElementById('others-title');
    
    notesContainer.innerHTML = '';
    if (pinnedContainer) pinnedContainer.innerHTML = '';
    
    if (notesList.length === 0) {
        if (pinnedSection) pinnedSection.style.display = 'none';
        if (othersTitle) othersTitle.style.display = 'none';
        notesContainer.innerHTML = `<p style="color: var(--text-secondary); text-align: center; width: 100%; margin-top: 20px;">Tidak ada catatan di sini.</p>`;
        return;
    }
    
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
        
        const currentCardColor = note.color || '#202124';
        noteCard.style.backgroundColor = currentCardColor;
        
        if (note.is_pinned === 1 && currentView === 'Catatan') {
            noteCard.classList.add('pinned');
        }
        
        let trashInfo = '';
        let dropdownItems = '';

        let colorSelectionHTML = '';
        if (currentView !== 'Sampah') {
            colorSelectionHTML = `<div class="dropdown-color-section">`;
            colorPalette.forEach(c => {
                const activeBorder = currentCardColor.toLowerCase() === c.value.toLowerCase() ? 'border: 2px solid #fff;' : '';
                colorSelectionHTML += `<div class="color-circle" data-color="${c.value}" title="${c.name}" style="background-color: ${c.value}; ${activeBorder}"></div>`;
            });
            colorSelectionHTML += `</div><hr style="border-color: rgba(255,255,255,0.1); margin: 5px 0;">`;
        }

        if (currentView === 'Sampah') {
            trashInfo = `<div class="trash-time-info"><i class="far fa-clock"></i> 7 hari lagi</div>`;
            dropdownItems = `
                <div class="dropdown-item restore-btn"><i class="fas fa-undo"></i> Pulihkan</div>
                <div class="dropdown-item delete-perm-btn delete-danger"><i class="fas fa-trash-alt"></i> Hapus Selamanya</div>
            `;
        } else if (currentView === 'Arsipkan') {
            dropdownItems = `
                ${colorSelectionHTML}
                <div class="dropdown-item unarchive-btn"><i class="fas fa-upload"></i> Pindahkan ke Catatan</div>
                <div class="dropdown-item duplicate-btn"><i class="fas fa-copy"></i> Buat salinan</div>
                <div class="dropdown-item trash-btn"><i class="fas fa-trash"></i> Hapus (Ke Sampah)</div>
            `;
        } else {
    dropdownItems = `
        ${colorSelectionHTML}

        <div class="dropdown-item edit-btn">
            <i class="fas fa-edit"></i> Edit
        </div>

        <div class="dropdown-item archive-btn">
            <i class="fas fa-archive"></i> Arsipkan
        </div>

        <div class="dropdown-item duplicate-btn">
            <i class="fas fa-copy"></i> Buat salinan
        </div>

        <div class="dropdown-item trash-btn">
            <i class="fas fa-trash"></i> Hapus (Ke Sampah)
        </div>
    `;
}

        const pinIconColor = note.is_pinned === 1 ? 'color: var(--accent-color);' : 'color: var(--text-secondary);';

        noteCard.innerHTML = `
    ${trashInfo}
    <button class="card-pin-btn" title="${note.is_pinned === 1 ? 'Lepas Sematan' : 'Sematkan Catatan'}" style="opacity: ${note.is_pinned === 1 ? '1' : ''};">
        <i class="fas fa-thumbtack" style="${pinIconColor}"></i>
    </button>
    <h3 contenteditable="true" class="edit-title">${note.title || ''}</h3>
    <p contenteditable="true" class="edit-content">${note.content}</p>
    
    <div class="note-card-footer" style="justify-content: flex-end;">
        <button class="more-options-btn" title="Lainnya"><i class="fas fa-ellipsis-v"></i></button>
        <div class="custom-dropdown-menu">
            ${dropdownItems}
        </div>
    </div>
`;
// Logika untuk menangkap perubahan teks
const titleField = noteCard.querySelector('.edit-title');
const contentField = noteCard.querySelector('.edit-content');

const autoSave = async () => {
    // Hanya menyimpan jika ada perubahan (opsional)
    await fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            title: titleField.innerText, 
            content: contentField.innerText 
        })
    });
};

// Event listener "blur" aktif saat pengguna selesai mengetik dan klik di luar area tersebut
titleField.addEventListener('blur', autoSave);
contentField.addEventListener('blur', autoSave);
        
        const pinBtn = noteCard.querySelector('.card-pin-btn');
        if (currentView !== 'Catatan') {
            if (pinBtn) pinBtn.style.display = 'none';
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
                        fetchNotes();
                    } catch (err) {
                        console.error(err);
                    }
                });
            }

            const colorCircles = noteCard.querySelectorAll('.color-circle');
            colorCircles.forEach(circle => {
                circle.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const chosenColor = circle.getAttribute('data-color');
                    try {
                        await fetch(`/api/notes/${note.id}/color`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ color: chosenColor })
                        });
                        fetchNotes();
                    } catch (err) {
                        console.error("Gagal mengganti warna:", err);
                    }
                });
            });
        }
        
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
        
        const moreBtn = noteCard.querySelector('.more-options-btn');
        const dropdown = noteCard.querySelector('.custom-dropdown-menu');
        
        moreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.custom-dropdown-menu').forEach(d => {
                if(d !== dropdown) d.classList.remove('show');
            });
            dropdown.classList.toggle('show');
        });

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

        const duplicateBtn = noteCard.querySelector('.duplicate-btn');
        if (duplicateBtn) {
            duplicateBtn.addEventListener('click', async () => {
                try {
                    await fetch(`/api/notes/${note.id}/duplicate`, { method: 'POST' });
                    fetchNotes();
                } catch (error) {
                    console.error(error);
                }
            });
        }
        
        if (note.is_pinned === 1 && currentView === 'Catatan') {
            if (pinnedContainer) pinnedContainer.appendChild(noteCard);
        } else {
            notesContainer.appendChild(noteCard);
        }
    });
}

// SIMPAN CATATAN BESERTA WARNA DARI INPUT FORM ATAS
async function addNote() {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    if (title === "" && content === "") {
        resetInputForm();
        return;
    }

    try {
        await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title: title, 
                content: content,
                is_pinned: isInputPinned,
                color: currentInputColor // Kirim warna yang sedang aktif di form atas
            })
        });
        resetInputForm();
        fetchNotes(); 
    } catch (error) {
        console.error("Gagal menambah catatan:", error);
    }
}

function resetInputForm() {
    noteTitle.value = '';
    noteContent.value = '';
    isInputPinned = 0;
    currentInputColor = '#202124'; // Reset warna state ke default
    if (inputContainer) inputContainer.style.backgroundColor = '#202124'; // Reset warna visual form
    if (inputPinBtn) {
        const pinIcon = inputPinBtn.querySelector('i');
        if (pinIcon) pinIcon.style.color = 'var(--text-secondary)';
    }
}

searchBar.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const filteredNotes = allNotes.filter(note => {
        const titleMatch = (note.title || '').toLowerCase().includes(keyword);
        const contentMatch = (note.content || '').toLowerCase().includes(keyword);
        return titleMatch || contentMatch;
    });
    renderNotes(filteredNotes);
});

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

addNoteBtn.addEventListener('click', addNote);

document.addEventListener('click', (e) => {
    if (inputContainer && !inputContainer.contains(e.target) && e.target !== addNoteBtn) {
        addNote();
    }
});

const inputPinBtn = document.querySelector('.pin-btn-input');
if (inputPinBtn) {
    inputPinBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isInputPinned = isInputPinned === 0 ? 1 : 0;
        const pinIcon = inputPinBtn.querySelector('i');
        if (isInputPinned === 1) {
            pinIcon.style.color = 'var(--accent-color)';
            inputPinBtn.setAttribute('title', 'Lepas Sematan');
        } else {
            pinIcon.style.color = 'var(--text-secondary)';
            inputPinBtn.setAttribute('title', 'Sematkan Catatan');
        }
    });
}

// --- BARU: LOGIKA MENANGANI KLIK PALET WARNA FORM INPUT ATAS ---
const inputPaletteBtn = document.querySelector('.input-container .fa-palette')?.parentElement;
if (inputPaletteBtn) {
    // Buat element popover lingkaran warna untuk form atas secara dinamis
    const inputColorMenu = document.createElement('div');
    inputColorMenu.className = 'color-popover-menu dropdown-color-section';
    inputColorMenu.style.position = 'absolute';
    inputColorMenu.style.display = 'none';
    inputColorMenu.style.zIndex = '100';
    
    colorPalette.forEach(c => {
        const circle = document.createElement('div');
        circle.className = 'color-circle';
        circle.style.backgroundColor = c.value;
        circle.style.width = '20px';
        circle.style.height = '20px';
        circle.style.borderRadius = '50%';
        circle.style.cursor = 'pointer';
        circle.style.border = '1px solid rgba(255,255,255,0.2)';
        circle.setAttribute('title', c.name);
        
        circle.addEventListener('click', (e) => {
            e.stopPropagation();
            currentInputColor = c.value; // Set warna terpilih
            inputContainer.style.backgroundColor = c.value; // Ubah background form atas langsung
            inputColorMenu.style.display = 'none'; // Sembunyikan popover warna kembali
        });
        inputColorMenu.appendChild(circle);
    });

    inputPaletteBtn.style.position = 'relative';
    inputPaletteBtn.appendChild(inputColorMenu);

    inputPaletteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isShown = inputColorMenu.style.display === 'grid';
        inputColorMenu.style.display = isShown ? 'none' : 'grid';
        inputColorMenu.style.top = '35px';
        inputColorMenu.style.left = '0';
    });

    document.addEventListener('click', () => {
        inputColorMenu.style.display = 'none';
    });
}

fetchNotes();