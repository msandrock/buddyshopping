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

    //console.log(session.cart);
}

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

exports.getItemCount = function (session){
	
	var cart = session.cart;

    if(cart) {
		return cart[0].quantity;
	} else {
		return 0;
	}

}
