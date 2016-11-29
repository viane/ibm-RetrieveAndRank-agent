/*global $*/
var myvar;

var chatWindow=$('.chat-thread');
$('#querySubmitBtn').click(function() {
    var self=$(this);
    setTimeout(function() {
        self.addClass('loading');
    }
    , 125);
    var inputQuery=$('#userQueryInput').val();
    chatWindow.append("<li class='user'><p>"+ inputQuery+ "</p></li>");
    $('#userQueryInput').val("");
    scrollChatWindowToBottom();
    $.ajax( {
        url: '/query', type: 'get', data: {
            "input": inputQuery
        }
        , success: function(data) {
            setTimeout(function() {
                self.removeClass('loading');
            }
            , 125);
            var respond="<li class='agent'>";

            //extracting answer body and form DOM element
            respond+="<p>"+ data.result.response.docs[0].body + "</p>";

            respond+="</li>";
            chatWindow.append(respond);
            scrollChatWindowToBottom();
            $('#userQueryInput').focus();
        }
    }
    );
});

//submit question when user press enter during typing
$('#userQueryInput').keypress(function(e){
     if (e.keyCode == 13) {
         e.preventDefault();
         if($(this).val().length>=2){
        $('#querySubmitBtn').click();
         }
        return false;
    }
})

var scrollChatWindowToBottom=function() {
    var $target = $('.chat-thread');
$target.animate({scrollTop: 3*$target.height()+1000}, 1000);
}
