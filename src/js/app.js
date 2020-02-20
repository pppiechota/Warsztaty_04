const URL = "http://localhost:8282";

$(() => {

    let table = $('.table tbody');
    getBooks(table);

    table.on('click', 'tr td.book-title', (e) => {
        let description = $(e.target).parent().next()
        $(description).toggle(200)
    });

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
    }).done((resp) => {
        getBooks(table)
    })
}

function getBooks(table) {
    $.ajax({url: URL + "/books"}).done((response) => {
        table.html('');
        for (let book of response) {
            table.append(`
                <tr>
                    <th>${book.id}</th>
                    <td class="book-title">${book.title}</td>
                    <td>${book.isbn}</td>
                    <td><button class="btn btn-danger" data-id='${book.id}'>Usuń</button></td>
                </tr>
                <tr class="book-description" style="display: none">
                    <td colspan="4">
                        <div>${book.author}</div>
                        <div>${book.title}</div>
                        <div>${book.publisher}</div>
                        <div>${book.isbn}</div>
                        <div>${book.type}</div>
                    </td>
                </tr>
            `)
        }
    })
}