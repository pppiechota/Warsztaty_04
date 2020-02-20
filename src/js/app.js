const URL = "http://localhost:8282";

$(() => {

    let table = $('.table tbody');
    getBooks(table);

    let form = $('#add-book');
    form.on('submit', (e) => {
        e.preventDefault()
        addBook(
            $('#title').val(),
            $('#author').val(),
            $('#isbn').val(),
            $('#publisher').val(),
            $('#type').val(),
            table
        )
        $('#title').val('')
        $('#author').val('')
        $('#isbn').val('')
        $('#publisher').val('')
        $('#type').val('')
    })

    table.on('click', 'tr button.btn-danger', (e) => {
        deleteBook(e.target.dataset.id, table)
    })

});

function addBook(title, author, isbn, publisher, type, table) {
    $.ajax({
        url: URL + "/books",
        contentType: "application/json",
        data: JSON.stringify(
            {
                'title': title,
                'author': author,
                'isbn': isbn,
                'publisher': publisher,
                'type': type
            }),
        type: "POST"
    }).done((response) => {
        getBooks(table)
    }).fail((xhr, code, err) => {
        console.log(err)
    })
}

function deleteBook(id, table) {
    $.ajax({
        url: URL + "/books/" + id,
        type: "DELETE"
    }).done((response) => {
        getBooks(table)
    })
}

function getBooks(table) {
    $.ajax({
        url: URL + "/books"
    }).done((response) => {
        table.html('');
        for (let book of response) {
            table.append(`
                <tr data-toggle="collapse" data-target="#book-details${book.id}">
                    <th scope="row">${book.id}</th>
                    <td class="book-title">${book.title}</td>
                    <td>${book.isbn}</td>
                    <td><button class="btn btn-danger" data-id='${book.id}'>Usuń</button></td>
                </tr>
                <tr>
                    <td colspan="4">
                        <div class="collapse" id="book-details${book.id}">
                            <div class="card card-body" style="background: #fefefe">
                                ID: ${book.id}<hr>
                                Tytuł: ${book.title}<hr>
                                ISBN: ${book.isbn}<hr>
                                Autor: ${book.author}<hr>
                                Wydawca: ${book.publisher}
                            </div>
                        </div>
                    </td>
                </tr>
            `)
        }
    })
}