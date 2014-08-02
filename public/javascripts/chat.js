chat = {};
$(document).ready(function(){
	
	$('#chat-top').click(function(){
		
		$('#chat-content').slideToggle();
		

		
	});
	
	$('#chat-input').keydown(function(e){

		var code = e.which;
		
		if(code==13 && $(this).val() != "") {
			socket.emit("chatMessage",{text:$(this).val()});
			$('#chat-message').append("<div class='chat-entry chat-self-entry'>"+$(this).val()+"</div>");
			$(this).val("");
		}

	});
	
	
});

chat.handeChatMessage = function(msg) {
	$('#chat-message').append("<div class='chat-entry'>"+msg.text+"</div>");
}