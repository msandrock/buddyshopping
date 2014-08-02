$(document).ready(function(){
	
	$('.cart').click(function(e){
		e.preventDefault();
		
		$(this).html("Bitte Warten!");
		$(this).addClass('active');
		element = this;
		
		$.post("/ajax_add_item_to_cart", { id: itemId } ,function(data){
			
			if(data.success) {
				toastr.success('Das Produkt liegt nun in ihrem Warenkorb');
			} else {
				toastr.error('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut');
			}
			
			$(element ).removeClass('active');
			$(element ).html("Zum Warenkorb hinzufügen");
			
		}, 'json').error(function(){
			console.log("errror");
			toastr.error('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut');
		});
		
		
	})
	
	
});