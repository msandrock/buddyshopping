
(function() {

    $(function() {
        $('#openBuddyList').click(function(e) {
            $('#buddyListClosed').hide();
            $('#buddyListOpen').show();
        });

        $('#closeBuddyList').click(function(e) {
            $('#buddyListOpen').hide();
            $('#buddyListClosed').show();
        });
    });

})();
