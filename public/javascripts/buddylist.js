
//
// Initialize event handlers for buddy list
//
$(function() {
    // Expand the buddylist panel
    $('#openBuddyList').click(function(e) {
        buddyList.openList();
    });

    // Collapse the buddylist panel
    $('#closeBuddyList').click(function(e) {
        buddyList.closeList();
    });

    // Clear the buddylist message panel
    $('#clearBuddyList').click(function(e) {
        buddyList.clearContent();
    });

    // Open the bootbox to update the username
    $('#userName').click(function(e){
        bootbox.prompt("Geben Sie Ihren Benutzernamen ein", function(userName) {
            if(userName != null && userName != '') {
                // Set the username caption
                $('#userName').text(userName);
                // Store it in LS
                if (typeof(localStorage) != 'undefined') {
                    localStorage.setItem('userName', userName);
                }

                // If in buddygroup, send it to the server, to update the session
                $.post("/ajax_set_username", { userName: userName }, function(data){

                    // Just do nothing

                }, 'json').error(function(){
                    console.log("errror");
                    toastr.error('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut');
                });
            }
        });
    });

    // Add a new chat message to the message panel
    $('#postMessage').on('submit', function(e) {
		if($('#messageText').val() != "") {
			var message = $('#messageText').val();
			socket.emit("chatMessage",{text: message});
			buddyList.myChatMessage(message);
			$('#messageText').val('');
		}

        return false;
    });

    // Initialize the message panel from localstorage
    buddyList.loadContent();

    // Try to grab the username from local storage; update the caption in the menu bar
    if (typeof(localStorage) != 'undefined') {
        var userName = localStorage.getItem('userName');

        if(userName != null) {
            $('#userName').text(userName);
        }
    }
});

//
// Simple class to manage the buddy list contents
//
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


	this.handeChatMessage = function(msg) {
		buddyList.addContent(this._chatMessage(msg));
	}

	this.placeNewOrder = function(msg) {
		buddyList.addContent(this._placeNewOrderMessage(msg));
	}

	this.rename = function(msg) {
		buddyList.addContent(this._renameMessage(msg));
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
		console.log(msg);

        var wrapper = document.createElement('span');
        var image = document.createElement('img');
        image.className = 'buddy-list-image';
        image.src = msg.item.imageUrl;

        var link = document.createElement('a');
        link.href = '/details/'+msg.item._id;
        link.appendChild(document.createTextNode(msg.username + " sieht sich das Produkt '" + msg.item.name + "' an"));

        var breaker = document.createElement('div');
        breaker.className = 'clear-left';
        breaker.appendChild(document.createTextNode(' '));

        wrapper.appendChild(image);
        wrapper.appendChild(link);
        wrapper.appendChild(breaker);

        return wrapper;
    }

    this._addToCartMessage = function(msg) {

        var wrapper = document.createElement('span');
        var image = document.createElement('img');
        image.className = 'buddy-list-image';
        image.src = msg.imageUrl;

        var link = document.createElement('a');
        link.href = '/details/'+msg._id;
        link.appendChild(document.createTextNode(msg.name + ' im Cart'));

        var breaker = document.createElement('div');
        breaker.className = 'clear-left';
        breaker.appendChild(document.createTextNode(' '));

        wrapper.appendChild(image);
        wrapper.appendChild(link);
        wrapper.appendChild(breaker);

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

	this._placeNewOrderMessage = function(msg){

		var wrapper = document.createElement('span');
        var title = document.createTextNode("Ein Benutzer hat für " + msg.total + "€ eingekauft");

        wrapper.appendChild(title);
        return wrapper;

	}

	this._renameMessage = function(msg){

		var wrapper = document.createElement('span');
        var title = document.createTextNode(msg.text);

        wrapper.appendChild(title);
        return wrapper;

	}

}

var buddyList = new BuddyList();
