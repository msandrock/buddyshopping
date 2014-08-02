
//
// Initialize event handlers for buddy list
//
$(function() {
    $('#openBuddyList').click(function(e) {
        buddyList.openList();
    });

    $('#closeBuddyList').click(function(e) {
        buddyList.closeList();
    });

    $('#clearBuddyList').click(function(e) {
        buddyList.clearContent();
    });

    $('#postMessage').on('submit', function(e) {

        var message = $('#messageText').val();

        alert('TODO: Send message to websocket');

        $('#messageText').val('');
        return false;
    });

    buddyList.loadContent();
});

function BuddyList() {

    this.openList = function() {
        $('#buddyListClosed').hide();
        $('#buddyListOpen').show();
    };

    this.closeList = function() {
        $('#buddyListOpen').hide();
        $('#buddyListClosed').show();
    };

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
    this.addContent = function(contentNode) {

        // Create a new placeholder in the inner pane
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

        // Open the list, in case it is currently hidden
        this.openList();

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

    this.joined = function(msg) {
        buddyList.addContent(this._joinedMessage(msg));
    }

    this.visitItem = function(msg) {
        buddyList.addContent(this._visitItemMessage(msg));
    }

    this.addToCart = function(msg) {
        buddyList.addContent(this._addToCartMessage(msg));
    }

    this.goToCheckout = function(msg) {
        buddyList.addContent(this._goToCheckoutMessage(msg));
    }

    //
    // Clear the message list
    //
    this.clearContent = function() {
        $('#buddyMessages').empty();

        localStorage.removeItem('listContent');
    };

    //
    // Helper functions
    //

    this._joinedMessage = function(msg) {

        var wrapper = document.createElement('span');
        var title = document.createTextNode(msg.text);

        wrapper.appendChild(title);

        return wrapper;
    }

    this._visitItemMessage = function(msg) {

        var wrapper = document.createElement('span');
        var image = document.createElement('img');
        image.width = 40;
        image.height = 40;
        image.src = msg.imageUrl;

        var link = document.createElement('a');
        link.href = '/details/'+msg._id;
        link.appendChild(document.createTextNode(msg.name));

        wrapper.appendChild(image);
        wrapper.appendChild(link);

        return wrapper;
    }

    this._addToCartMessage = function(msg) {

        var wrapper = document.createElement('span');
        var image = document.createElement('img');
        image.width = 40;
        image.height = 40;
        image.src = msg.imageUrl;

        var link = document.createElement('a');
        link.href = '/details/'+msg._id;
        link.appendChild(document.createTextNode(msg.name + ' im Cart'));

        wrapper.appendChild(image);
        wrapper.appendChild(link);

        return wrapper;
    }

    this._goToCheckoutMessage = function(msg) {

        var wrapper = document.createElement('span');
        var title = document.createTextNode(msg.text);

        wrapper.appendChild(title);

        return wrapper;
    }
}

var buddyList = new BuddyList();
