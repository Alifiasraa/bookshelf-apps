const bookShelfs = [];
const RENDER_EVENT = 'render-bookshelf';
document.addEventListener('DOMContentLoaded', function () {
    const inputBook = document.getElementById('inputBook');
    inputBook.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
      }
  });

function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();
    const bookshelfObject = generateBookshelfObject(generatedID, bookTitle, bookAuthor, bookYear, isComplete);
    bookShelfs.push(bookshelfObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBookshelfObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
    uncompletedBOOKList.innerText = '';

    const completedBOOKlist = document.getElementById('completeBookshelfList');
    completedBOOKlist.innerText = '';

    for (const bookshelfItem of bookShelfs) {
        const bookshelfElement = makeBookshelf(bookshelfItem);
        if (!bookshelfItem.isCompleted) 
            uncompletedBOOKList.append(bookshelfElement);
        else
            completedBOOKlist.append(bookshelfElement);
    }
  });

function makeBookshelf(bookshelfObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookshelfObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookshelfObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = bookshelfObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('action');
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('div');
    container.classList.add('book_item')
    container.append(textContainer);
    container.setAttribute('id', `bookshelf-${bookshelfObject.id}`);

    if (bookshelfObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.innerText = "Belum selesai dibaca";
        undoButton.addEventListener('click', function() {
            undoTaskFromCompleted(bookshelfObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = "Hapus buku";
        trashButton.addEventListener('click', function() {
            removeTaskFromCompleted(bookshelfObject.id);
        });

        textContainer.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('green');
        checkButton.innerText = 'Selesai dibaca';
        checkButton.addEventListener('click', function() {
            addBookToCompleted(bookshelfObject.id);
        });

        const removeButton = document.createElement('button');
        removeButton.classList.add('red');
        removeButton.innerText = 'Hapus buku';
        removeButton.addEventListener('click', function() {
            removeTaskFromCompleted(bookshelfObject.id);
        });

        textContainer.append(checkButton, removeButton);
    }

    return container;
}

function addBookToCompleted(bookshelfId) {
    const bookshelfTarget = findBookshelf(bookshelfId);

    if (bookshelfTarget == null) return;
    bookshelfTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeTaskFromCompleted(bookshelfId) {
    const bookshelfTarget = findBookshelfIndex(bookshelfId);

    if (bookshelfTarget === -1) return;

    bookShelfs.splice(bookshelfTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoTaskFromCompleted(bookshelfId) {
    const bookshelfTarget = findBookshelf(bookshelfId);

    if (bookshelfTarget === null) return;

    bookshelfTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookshelf(bookshelfId) {
    for (const bookshelfItem of bookShelfs) {
        if (bookshelfItem.id === bookshelfId) {
            return bookshelfItem;
        }
    }
    return null;
}

function findBookshelfIndex(bookshelfId) {
    for (const index in bookShelfs) {
        if (bookShelfs[index].id === bookshelfId); {
            return index;
        }
    }
    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(bookShelfs);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-bookshelf';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
      }
      return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const bookshelf of data) {
        bookShelfs.push(bookshelf);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
}