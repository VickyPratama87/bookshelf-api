const { nanoid } = require("nanoid");
const books = require("./books");

// Menyimpan Buku
const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };

  if (name === undefined) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (!isSuccess) {
    const response = h.response({
      status: "error",
      message: "Buku gagal ditambahkan",
    });
    response.code(500);
    return response;
  }

  const response = h.response({
    status: "success",
    message: "Buku berhasil ditambahkan",
    data: {
      bookId: id,
    },
  });
  response.code(201);
  return response;
};

// Menampilkan Buku
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  // name
  if (name) {
    const filteredBooks = books.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );

    const response = h.response({
      status: "success",
      data: {
        books: filteredBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  // reading
  if (reading) {
    const filteredBooks = books.filter((book) => book.reading === Boolean(parseInt(reading, 10)));

    if (filteredBooks === undefined) {
      const response = h.response({
        status: "fail",
        message: "Buku tidak ditemukan",
        data: {
          books: [],
        },
      });
      response.code(404);
      return response;
    }

    const response = h.response({
      status: "success",
      data: {
        books: filteredBooks.map((book) => ({
          id: book,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  // finished
  if (finished) {
    const filteredBooks = books.filter((book) => book.finished === Boolean(parseInt(finished, 10)));

    const response = h.response({
      status: "success",
      data: {
        books: filteredBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "success",
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// Menampilkan Detail Buku
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);
  console.log(bookId, index);
  if (index === -1) {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
      data: {
        books: [],
      },
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: "success",
    data: { book: books[index] },
  });
  response.code(200);
  return response;
};

// Mengubah Data Buku
const updatedBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const updatedAt = new Date().toISOString();
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (name === undefined) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  if (bookIndex === -1) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  books[bookIndex] = {
    ...books[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  const response = h.response({
    status: "success",
    message: "Buku berhasil diperbarui",
  });
  response.code(200);
  return response;
};

// Menghapus Buku
const deletedBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  books.splice(bookIndex, 1);

  const response = h.response({
    status: "success",
    message: "Buku berhasil dihapus",
  });
  response.code(200);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updatedBookByIdHandler,
  deletedBookByIdHandler,
};
