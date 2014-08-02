var _ = require('underscore');

//
// Adds a new item to the cart; Increments the quantity, if the item exists
//
exports.addItemToCart = function(session, itemId) {

    var cart = session.cart;

    if(cart) {

        // Add the item to the cart - check if an cart item with the same Id exists
        var found = _.find(cart, function(item){ return item.itemId == itemId });

        if(found) {
            // Update the items quantity
            found.quantity++;
        } else {
            // Add as new item to cart
            cart.push(createCartItem(itemId));
        }

    } else {
        // Add new cart element to session
        session.cart = [createCartItem(itemId)];
    }
}

//
// Returns the list of cart items for the current sessions
//
exports.getCartItems = function(session) {
    var cart = session.cart;

    return cart ? cart : [];
}

//
// Helper to create a new cart item element
//
function createCartItem(itemId) {
    return {
        itemId: itemId,
        quantity: 1
    };
}

//
// Returns the current number of items in the cart
//
exports.getItemCount = function (session){

	var cart = session.cart;

    if(cart) {
    	var result = 0;
    	for (var i in cart) {
    		result += cart[i].quantity;
    	}
		return result;
	} else {
		return 0;
	}
}
