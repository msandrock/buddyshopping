
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

    $('#clearBuddyList').click(function(e) {
        buddyList.clearContent();
    });

    $('#postMessage').on('submit', function(e) {

		if($('#messageText').val() != "") {
			var message = $('#messageText').val();
			socket.emit( "chatMessage",{text: message});
			buddyList.myChatMessage(message);
			$('#messageText').val('');
		}
        
        return false;
    });

    buddyList.loadContent();
});

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
	
		
	this.handeChatMessage = function(msg) {
		buddyList.addContent(this._chatMessage(msg));
	}

    //
    // Clear the message list
    //
    this.clearContent = function() {
        $('#buddyMessages').empty();

        localStorage.removeItem('listContent');
    };
	
	
	this.myChatMessage = function(msgtext) {

        var wrapper = document.createElement('div');
		wrapper.className = "chat-entry chat-self-entry";
        var title = document.createTextNode(msgtext);

        wrapper.appendChild(title);

		this.addContent(wrapper);
    }

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

    this._chatMessage = function(msg) {

        var wrapper = document.createElement('div');
		wrapper.className = "chat-entry";
        var title = document.createTextNode(msg.text);

        wrapper.appendChild(title);

        return wrapper;
    }


}

var buddyList = new BuddyList();
