// doc ready function
$(function(){
  console.log('document loaded');

  getBooks();

  // listen for a submit event on the form
  $('#book-form').on('submit', addBook);
  $('#book-list').on('click', '.save', updateBook);
  $('#book-list').on('click', '.remove', removeBook);

});

function getBooks() {
  $.ajax({
    url: '/books',
    type: 'GET',
    success: displayBooks
  });
}

function displayBooks(books) {
  console.log('Got books from the server', books);

  $('#book-list').empty();

  books.forEach(function(book){
    var $li = $('<li></li>');
    var $form = $('<form></form>');
    $form.append('<input type="text" name="title" value="'+book.title+'"/>');
    $form.append('<input type="text" name="author" value="'+book.author+'"/>');

    var date = new Date(book.publication_date).toISOString().slice(0,10);
    $form.append('<input type="date" name="published" value="' + date +'"/>');
    $form.append('<input type="text" name="edition" value="'+book.edition+'"/>');
    $form.append('<input type="text" name="publisher" value="'+book.publisher+'"/>');
    var $button = $('<button class="save">Save!</button>');
    $button.data('id', book.id);
    $form.append($button);
    var $remove = $('<button class="remove">Remove!</button>');
    $remove.data('id', book.id);
    $form.append($remove);
    $li.append($form);
    $('#book-list').append($li);
  });
}

function addBook(event) {
  // prevent browser from refreshing
  event.preventDefault();

  // get the info out of the form
  var formData = $(this).serialize();

  // send data to server
  $.ajax({
    url: '/books',
    type: 'POST',
    data: formData,
    success: getBooks
  });

}

function updateBook(event){
  event.preventDefault();
  var $button = $(this);
  var $form = $button.closest('form');

  var formData = $form.serialize();

  $.ajax({
    url: '/books/'+ $button.data('id'),
    type: 'PUT',
    data: formData,
    success: getBooks
  });
}
function removeBook(event){
  event.preventDefault();

  $.ajax({
    url: '/books/'+ $(this).data('id'),
    type: 'DELETE',
    success: getBooks
  });
}
