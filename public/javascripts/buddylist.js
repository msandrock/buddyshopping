
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
});

// Nur zum testen
// var x = 0;
//function addMessage() {
//    var bl = new BuddyList();
//    window.setTimeout(function() { bl.addContent(++x + ' My message'); addMessage(); }, 2000);
//}

function BuddyList() {

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
    }
}
