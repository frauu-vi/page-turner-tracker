// 1. Знаходимо елементи на сторінці
const bookForm = document.getElementById("book-form");
const booksContainer = document.getElementById("books-container");

// 2. Створюємо масив для зберігання книг (завантажуємо з пам'яті браузера або створюємо порожній)
let books = JSON.parse(localStorage.getItem("books")) || [];

// Функція для відображення всіх книг
function displayBooks() {
  booksContainer.innerHTML = "";

  books.forEach((book, index) => {
    const percentage =
      Math.round((book.currentPage / book.totalPages) * 100) || 0;

    // Визначаємо текст на кнопці таймера
    const timerButtonText = book.isReading ? "🛑 Зупинити" : "⏱️ Почати читати";
    const timerStatus = book.isReading
      ? '<span style="color: red;">(Читаю зараз...)</span>'
      : "";

    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book-item");

    bookDiv.innerHTML = `
            <h3>${book.title} ${timerStatus}</h3>
            <p><strong>Автор:</strong> ${book.author}</p>
            
            <div style="background: #eee; border-radius: 10px; height: 10px; width: 100%; margin: 10px 0;">
                <div style="background: #28a745; height: 100%; width: ${percentage}%; border-radius: 10px;"></div>
            </div>
            
            <p>Прогрес: ${book.currentPage}/${
      book.totalPages
    } стор. (${percentage}%)</p>
            <p>Всього часу: <strong>${formatTime(
              book.totalMinutes || 0
            )}</strong></p>

            <button onclick="toggleTimer(${index})" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #007bff; color: white; border: none; cursor: pointer;">
                ${timerButtonText}
            </button>
            
            <div style="display: flex; gap: 5px;">
                <input type="number" id="update-pg-${index}" placeholder="+стор." style="width: 50%; padding: 5px;">
                <button onclick="updateProgress(${index})" style="width: 50%; padding: 5px; background: #28a745; color: white; border: none;">Оновити</button>
            </div>

            <button onclick="deleteBook(${index})" style="background: none; color: #ff4d4d; border: none; margin-top: 15px; cursor: pointer; text-decoration: underline; font-size: 12px;">Видалити книгу</button>
        `;
    booksContainer.appendChild(bookDiv);
  });
}

// Допоміжна функція для гарного форматування часу
function formatTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return hours > 0 ? `${hours}г. ${mins}хв.` : `${mins}хв.`;
}

// 3. Обробник події натискання на кнопку "Додати"
bookForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Зупиняємо перезавантаження сторінки

  // Отримуємо значення з полів
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const pages = document.getElementById("pages").value;

  // Створюємо об'єкт нової книги
  const newBook = {
    title: title,
    author: author,
    totalPages: pages,
    currentPage: 0, // спочатку 0
    sessions: [], // тут будемо зберігати час читання пізніше
  };

  // Додаємо в масив
  books.push(newBook);

  // Зберігаємо в пам'ять браузера (localStorage)
  localStorage.setItem("books", JSON.stringify(books));

  // Очищуємо форму та оновлюємо список на екрані
  bookForm.reset();
  displayBooks();
});

// Функція для видалення книги
function deleteBook(index) {
  books.splice(index, 1);
  localStorage.setItem("books", JSON.stringify(books));
  displayBooks();
}

function updateProgress(index) {
  const input = document.getElementById(`update-pg-${index}`);
  const pagesRead = parseInt(input.value);

  if (isNaN(pagesRead) || pagesRead < 0) {
    alert("Будь ласка, введи коректну кількість сторінок");
    return;
  }

  // Оновлюємо кількість сторінок (не більше, ніж є всього в книзі)
  let newTotal = parseInt(books[index].currentPage) + pagesRead;

  if (newTotal > books[index].totalPages) {
    newTotal = books[index].totalPages;
    alert("Вітаю! Ти прочитав цю книгу!");
  }

  books[index].currentPage = newTotal;

  // Зберігаємо та оновлюємо екран
  localStorage.setItem("books", JSON.stringify(books));
  displayBooks();
}
function toggleTimer(index) {
  const now = new Date().getTime(); // Поточний час у мілісекундах
  let book = books[index];

  if (!book.isReading) {
    // Починаємо читати
    book.isReading = true;
    book.startTime = now;
  } else {
    // Зупиняємо читання
    book.isReading = false;
    const endTime = now;
    const diffMs = endTime - book.startTime; // Скільки мілісекунд пройшло
    const diffMins = Math.round(diffMs / 60000); // Переводимо в хвилини

    book.totalMinutes = (book.totalMinutes || 0) + diffMins;

    if (diffMins > 0) {
      alert(`Ти прочитав ${diffMins} хв. Записано в статистику!`);
    }
  }

  localStorage.setItem("books", JSON.stringify(books));
  displayBooks();
}
// Викликаємо відображення при завантаженні сторінки
displayBooks();
