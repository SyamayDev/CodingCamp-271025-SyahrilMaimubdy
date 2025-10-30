// Tunggu hingga seluruh konten HTML dimuat sebelum menjalankan script
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SELEKSI ELEMEN ---
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoDate = document.getElementById('todo-date');
    const todoList = document.getElementById('todo-list');
    const filterBtn = document.getElementById('filter-btn');
    const deleteAllBtn = document.getElementById('delete-all-btn');

    // --- 2. STATE APLIKASI ---
    // Coba ambil data dari Local Storage, atau gunakan array kosong jika tidak ada
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let isFilterActive = false; // Status filter (false = tampil semua, true = sembunyikan yg selesai)

    // --- 3. FUNGSI-FUNGSI ---

    /**
     * Menyimpan array 'todos' ke Local Storage
     */
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    /**
     * Merender (menampilkan) daftar tugas ke dalam HTML
     */
    function renderTodos() {
        // Kosongkan daftar tugas di HTML
        todoList.innerHTML = '';

        // Cek apakah ada tugas
        if (todos.length === 0) {
            todoList.innerHTML = '<li class="no-task">No task found</li>';
            return;
        }

        // Loop melalui setiap data 'todo' di array 'todos'
        todos.forEach((todo) => {
            // Buat elemen <li> baru
            const li = document.createElement('li');
            li.className = 'todo-item';
            li.dataset.id = todo.id; // Simpan ID unik di elemen

            // Tambahkan kelas 'completed' jika tugas sudah selesai
            if (todo.completed) {
                li.classList.add('completed');
            }
            
            // Sembunyikan jika filter aktif dan tugas sudah selesai
            if (isFilterActive && todo.completed) {
                li.classList.add('hidden');
            }

            // Format tanggal (opsional, tapi bagus)
            const formattedDate = todo.date ? new Date(todo.date).toLocaleDateString('id-ID') : 'No date';

            // Isi HTML untuk item tugas
            li.innerHTML = `
                <span class="col-task task-text">${todo.text}</span>
                <span class="col-date">${formattedDate}</span>
                <span class="col-status status ${todo.completed ? 'done' : 'pending'}">
                    ${todo.completed ? 'Done' : 'Pending'}
                </span>
                <span class="col-actions actions">
                    <button class="btn-complete">✓</button>
                    <button class="btn-delete">✗</button>
                </span>
            `;

            // Tambahkan <li> ke dalam <ul>
            todoList.appendChild(li);
        });
    }

    /**
     * Menambahkan tugas baru
     */
    function addTodo(e) {
        // Mencegah form mengirim data (refresh halaman)
        e.preventDefault();

        const taskText = todoInput.value.trim();
        const taskDate = todoDate.value;

        // Validasi Input (Requirement #2)
        if (taskText === '' || taskDate === '') {
            alert('Form To-Do dan Tanggal tidak boleh kosong!');
            return;
        }

        // Buat objek tugas baru
        const newTodo = {
            id: Date.now(), // ID unik berdasarkan timestamp
            text: taskText,
            date: taskDate,
            completed: false
        };

        // Tambahkan tugas baru ke awal array
        todos.unshift(newTodo);

        // Simpan ke Local Storage
        saveTodos();

        // Render ulang daftar tugas
        renderTodos();

        // Kosongkan form
        todoInput.value = '';
        todoDate.value = '';
    }

    /**
     * Menangani klik pada tombol Aksi (Selesai / Hapus)
     */
    function handleListClick(e) {
        const target = e.target;
        const parentLi = target.closest('li.todo-item');
        
        if (!parentLi) return; // Keluar jika klik bukan di dalam item

        const todoId = Number(parentLi.dataset.id);

        // Jika tombol 'Delete' diklik (Requirement #1: Delete)
        if (target.classList.contains('btn-delete')) {
            // Hapus tugas dari array berdasarkan ID
            todos = todos.filter(todo => todo.id !== todoId);
        }

        // Jika tombol 'Complete' diklik
        if (target.classList.contains('btn-complete')) {
            // Cari tugas dan ubah status 'completed'
            const todo = todos.find(todo => todo.id === todoId);
            todo.completed = !todo.completed;
        }

        // Simpan perubahan & render ulang
        saveTodos();
        renderTodos();
    }

    /**
     * Memfilter tugas (Requirement #1: Filter)
     */
    function filterTodos() {
        isFilterActive = !isFilterActive; // Toggle status filter

        if (isFilterActive) {
            filterBtn.textContent = 'Tampil Semua';
            filterBtn.style.backgroundColor = '#2ecc71';
        } else {
            filterBtn.textContent = 'Filter Selesai';
            filterBtn.style.backgroundColor = '#f39c12';
        }

        // Render ulang untuk menerapkan filter
        renderTodos();
    }

    /**
     * Menghapus semua tugas
     */
    function deleteAllTodos() {
        if (confirm('Apakah Anda yakin ingin menghapus SEMUA tugas?')) {
            todos = []; // Kosongkan array
            saveTodos(); // Simpan array kosong
            renderTodos(); // Render ulang (akan menampilkan "No task found")
        }
    }


    // --- 4. EVENT LISTENERS ---
    
    // Listener untuk form submit
    todoForm.addEventListener('submit', addTodo);

    // Listener untuk klik di dalam daftar <ul> (untuk tombol complete/delete)
    todoList.addEventListener('click', handleListClick);

    // Listener untuk tombol filter
    filterBtn.addEventListener('click', filterTodos);

    // Listener untuk tombol delete all
    deleteAllBtn.addEventListener('click', deleteAllTodos);

    // --- 5. INISIALISASI ---
    // Tampilkan tugas saat halaman pertama kali dimuat
    renderTodos();

});