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
            console.log(data);
            if(data.status=="conversation"){//from conversation
                for (var i=0;i < data.result.length;i++) {
                    respond+="<p>"+ data.result[i]+ "</p>";
                }
            }else{
                
            }
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
    $(".chat-thread").animate( {
        scrollTop: $(".chat-thread").height()
    }
    , 800);
}