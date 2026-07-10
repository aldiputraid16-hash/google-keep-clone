console.log("Aplikasi Google Keep siap dijalankan!");
let notes = JSON.parse(localStorage.getItem('google_keep_notes')) || [];
function saveToMockDB() {
    localStorage.setItem('google_keep_notes', JSON.stringify(notes));
console.log("Data catatan saat ini di Mock DB:", notes);
}