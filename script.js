
/* =========================================
   1. KUMPULAN KALIMAT LATIHAN
========================================= */

const sentences = [
    "Belajar adalah perjalanan panjang untuk menemukan kemampuan terbaik dalam diri kita.",
    "Teknologi membantu manusia menyelesaikan pekerjaan dengan lebih mudah dan efisien.",
    "Jangan pernah berhenti mencoba karena setiap kesalahan adalah kesempatan untuk belajar.",
    "Disiplin dan konsistensi merupakan kunci penting untuk mencapai tujuan masa depan.",
    "Membaca buku dapat menambah pengetahuan serta membuka wawasan tentang dunia.",
    "Keberhasilan tidak datang secara instan tetapi membutuhkan usaha dan kesabaran.",
    "Pemrograman mengajarkan kita untuk berpikir logis dan memecahkan berbagai masalah.",
    "Gunakan waktumu dengan baik karena waktu yang berlalu tidak dapat kembali lagi.",
    "Kreativitas muncul ketika kita berani mencoba sesuatu yang baru dan berbeda.",
    "Masa depan dibangun melalui keputusan kecil yang kita ambil setiap hari."
];


/* =========================================
   2. MENGAMBIL ELEMEN HTML
========================================= */

const textDisplay = document.getElementById("textDisplay");
const typingInput = document.getElementById("typingInput");

const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const progressBar = document.getElementById("progressBar");

const statusDisplay = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const newTextBtn = document.getElementById("newTextBtn");

const bestScoreDisplay = document.getElementById("bestScore");
const result = document.getElementById("result");

const playAgainBtn = document.getElementById("playAgainBtn");
const modeButtons = document.querySelectorAll(".mode-btn");


/* =========================================
   3. VARIABEL PERMAINAN
========================================= */

let selectedTime = 30;
let timeLeft = selectedTime;
let currentText = "";

let timerInterval = null;
let startTime = null;

let isRunning = false;
let hasStarted = false;

// Mengambil rekor dari browser
let bestScore = Number(
    localStorage.getItem("typemasterBest")
) || 0;

bestScoreDisplay.textContent = bestScore + " WPM";


/* =========================================
   4. MEMILIH KALIMAT ACAK
========================================= */

function getRandomText() {
    const index = Math.floor(
        Math.random() * sentences.length
    );

    return sentences[index];
}


/* =========================================
   5. MENAMPILKAN WARNA HURUF
========================================= */

function renderText() {
    const typed = typingInput.value;

    textDisplay.innerHTML = "";

    for (let i = 0; i < currentText.length; i++) {
        const span = document.createElement("span");

        span.textContent = currentText[i];

        // Huruf yang sudah diketik
        if (i < typed.length) {
            if (typed[i] === currentText[i]) {
                span.classList.add("correct");
            } else {
                span.classList.add("incorrect");
            }
        }

        // Menandai posisi kursor
        else if (i === typed.length && isRunning) {
            span.classList.add("current");
        }

        textDisplay.appendChild(span);
    }
}


/* =========================================
   6. MENGHITUNG WPM DAN AKURASI
========================================= */

function updateStats() {
    const typed = typingInput.value;

    let correctChars = 0;

    for (let i = 0; i < typed.length; i++) {
        if (typed[i] === currentText[i]) {
            correctChars++;
        }
    }

    let elapsedSeconds = 0;

    if (startTime !== null) {
        elapsedSeconds =
            (Date.now() - startTime) / 1000;
    }

    // WPM = jumlah karakter benar / 5 / waktu dalam menit
    let wpm = 0;

    if (elapsedSeconds > 0) {
        wpm = Math.round(
            (correctChars / 5) / (elapsedSeconds / 60)
        );
    }

    // Akurasi = karakter benar / total karakter diketik
    const accuracy = typed.length > 0
        ? Math.round(
            (correctChars / typed.length) * 100
        )
        : 100;

    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = accuracy;

    return {
        wpm,
        accuracy,
        correctChars
    };
}


/* =========================================
   7. MEMULAI PERMAINAN
========================================= */

function startGame() {
    if (isRunning) return;

    // Jika waktu habis, mulai dari awal
    if (timeLeft <= 0) {
        resetGame(true);
    }

    isRunning = true;
    hasStarted = true;
    startTime = Date.now();

    typingInput.disabled = false;
    typingInput.focus();

    typingInput.placeholder =
        "Mulai mengetik di sini...";

    startBtn.disabled = true;

    statusDisplay.textContent =
        "Sedang mengetik... semangat!";

    renderText();

    timerInterval = setInterval(function () {
        const elapsed =
            (Date.now() - startTime) / 1000;

        timeLeft = Math.max(
            0,
            selectedTime - elapsed
        );

        timerDisplay.textContent =
            Math.ceil(timeLeft);

        progressBar.style.width =
            (timeLeft / selectedTime * 100) + "%";

        updateStats();

        if (timeLeft <= 0) {
            finishGame();
        }
    }, 100);
}


/* =========================================
   8. MENYELESAIKAN PERMAINAN
========================================= */

function finishGame() {
    clearInterval(timerInterval);
    timerInterval = null;

    isRunning = false;
    timeLeft = 0;

    timerDisplay.textContent = "0";
    progressBar.style.width = "0%";

    typingInput.disabled = true;

    startBtn.disabled = false;
    startBtn.textContent = "▶ Main lagi";

    const stats = updateStats();

    const isNewRecord = stats.wpm > bestScore;

    // Menyimpan rekor baru
    if (isNewRecord) {
        bestScore = stats.wpm;

        localStorage.setItem(
            "typemasterBest",
            bestScore
        );

        bestScoreDisplay.textContent =
            bestScore + " WPM";
    }

    // Menampilkan hasil akhir
    document.getElementById("finalWpm").textContent =
        stats.wpm;

    document.getElementById("finalAccuracy").textContent =
        stats.accuracy + "%";

    document.getElementById("finalChars").textContent =
        stats.correctChars;

    document.getElementById("resultTitle").textContent =
        stats.wpm >= 50
            ? "Luar biasa! 🚀"
            : "Latihan selesai! 🎉";

    document.getElementById("resultMessage").textContent =
        "Kamu menyelesaikan latihan " +
        selectedTime +
        " detik. Terus berlatih untuk meningkatkan kemampuanmu!";

    document.getElementById("recordMessage").textContent =
        isNewRecord
            ? "🏆 Rekor baru! Kamu mencapai " +
              stats.wpm + " WPM!"
            : "Rekor terbaikmu: " +
              bestScore + " WPM.";

    result.classList.add("show");

    statusDisplay.textContent = "Sesi selesai!";

    renderText();
}


/* =========================================
   9. MENGULANG PERMAINAN
========================================= */

function resetGame(newText = false) {
    clearInterval(timerInterval);
    timerInterval = null;

    isRunning = false;
    hasStarted = false;
    startTime = null;

    timeLeft = selectedTime;

    // Mengganti kalimat jika diminta
    if (newText || !currentText) {
        currentText = getRandomText();
    }

    typingInput.value = "";
    typingInput.disabled = true;

    typingInput.placeholder =
        "Tekan Mulai, lalu ketik teks di atas...";

    timerDisplay.textContent = selectedTime;
    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100";

    progressBar.style.width = "100%";

    startBtn.disabled = false;
    startBtn.textContent = "▶ Mulai";

    statusDisplay.textContent =
        "Siap untuk menguji kemampuanmu?";

    result.classList.remove("show");

    renderText();
}


/* =========================================
   10. MEMILIH DURASI
========================================= */

modeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        if (isRunning) return;

        // Menghapus mode aktif sebelumnya
        modeButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        // Mengaktifkan mode yang dipilih
        button.classList.add("active");

        selectedTime = Number(button.dataset.time);

        resetGame();
    });
});


/* =========================================
   11. MEMPROSES KETIKAN
========================================= */

typingInput.addEventListener("input", function () {
    if (!isRunning) return;

    renderText();
    updateStats();

    // Berhenti jika semua teks selesai diketik
    if (typingInput.value.length >= currentText.length) {
        finishGame();
    }
});


/* =========================================
   12. MENGHUBUNGKAN TOMBOL
========================================= */

// Tombol mulai
startBtn.addEventListener("click", function () {
    if (hasStarted && !isRunning) {
        resetGame(true);
    }

    startGame();
});

// Tombol ulangi
resetBtn.addEventListener("click", function () {
    resetGame();
});

// Tombol teks baru
newTextBtn.addEventListener("click", function () {
    resetGame(true);
});

// Tombol main lagi pada hasil akhir
playAgainBtn.addEventListener("click", function () {
    resetGame(true);
    startGame();
});


/* =========================================
   13. MENJALANKAN APLIKASI
========================================= */

resetGame(true);
