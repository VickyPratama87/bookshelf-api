const { addBookHandler, getAllBooksHandler, getBookByIdHandler, updatedBookByIdHandler, deletedBookByIdHandler } = require("./handler");

const routes = [
  {
    // Menyimpan Buku
    method: "POST",
    path: "/books",
    handler: addBookHandler,
  },
  {
    // Menampilkan Buku
    method: "GET",
    path: "/books",
    handler: getAllBooksHandler,
  },
  {
    // Menampilkan Detail Buku
    method: "GET",
    path: "/books/{bookId}",
    handler: getBookByIdHandler,
  },
  {
    // Mengubah Data Buku
    method: "PUT",
    path: "/books/{bookId}",
    handler: updatedBookByIdHandler,
  },
  {
    // Menghapus Buku
    method: "DELETE",
    path: "/books/{bookId}",
    handler: deletedBookByIdHandler,
  },
];

module.exports = routes;
