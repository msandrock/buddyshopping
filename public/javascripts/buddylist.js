
//
// Initialize event handlers for buddy list
//
$(function() {
    $('#openBuddyList').click(function(e) {
        $('#buddyListClosed').hide();
        $('#buddyListOpen').show();
    });

    $('#closeBuddyList').click(function(e) {
        $('#buddyListOpen').hide();
        $('#buddyListClosed').show();
    });

    //addMessage();
    //buddyList.clearContent();
    buddyList.loadContent();
});

// Nur zum testen
//var x = 0;
//function addMessage() {
//    var bl = new BuddyList();
//    window.setTimeout(function() { bl.addContent(++x + ' My message'); }, 2000);
//}

function BuddyList() {

    //
    // Loads the current list content from local storage and displays it in the buddy list
    //
    this.loadContent = function() {

        if (typeof(localStorage) == 'undefined') {
            alert('Your browser does not support HTML5 localStorage. Try upgrading.');
        } else {

            var listContent = localStorage.getItem('listContent');

            if(listContent != null) {
                // Add data to the list
                $('#buddyMessages').html(listContent);
            }
        }
    };

    //
    // Adds content to the buddy list and persists it in local storage
    //
    this.addContent = function(content) {

        // Create a new placeholder in the inner pane
        var contentNode = document.createTextNode(content);
        var listElement = document.createElement('li');
        // Add content to the list element
        listElement.appendChild(contentNode);

        // Look up the first message element
        var messages = $('#buddyMessages li');

        if(messages.length > 0) {
            // Prepend
            $('#buddyMessages')[0].insertBefore(listElement, messages[0]);
        } else {
            // Append
            $('#buddyMessages')[0].appendChild(listElement);
        }

        var listContent = $('#buddyMessages').html();

        // Store the list content in local storage
        try {
            localStorage.setItem('listContent', listContent);
        } catch (e) {
            if (e == QUOTA_EXCEEDED_ERR) {
                alert('Quota exceeded!'); //data wasn’t successfully saved due to quota exceed so throw an error
            }
        }
    };

    //
    // Clear the message list
    //
    this.clearContent = function() {
        $('#buddyMessages').empty();

        localStorage.removeItem('listContent');
    };
}

var buddyList = new BuddyList();
