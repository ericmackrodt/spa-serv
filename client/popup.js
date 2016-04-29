var $ = require('jquery');

module.exports = (function () {
    
    function build(name, message) {
        var body = "";
        body += '<div id="' + name + '"';
        body += '           style="position:absolute;'; 
        body += '           right:0;'; 
        body += '           top: 0;'; 
        body += '           background-color: #383838;'; 
        body += '           display: none; '; 
        body += '           color: #F0F0F0;'; 
        body += '           font-family: Arial;'; 
        body += '           margin: 20px;'; 
        body += '           font-size: 20px;';  
        body += '           padding:10px;'; 
        body += '           text-align:center;';  
        body += '           border-radius: 2px;'; 
        body += '           -webkit-box-shadow: 0px 0px 24px -1px rgba(56, 56, 56, 1);';  
        body += '           -moz-box-shadow: 0px 0px 24px -1px rgba(56, 56, 56, 1); '; 
        body += '           box-shadow: 0px 0px 24px -1px rgba(56, 56, 56, 1); '; 
        body += '           z-index:9999999">'; 
        body += message; 
        body += '</div>';
        return body;
    }
    
    function show(message) {
        var name = "spa-serv-popup" + new Date().getTime();
        var popup = $(build(name, message));
        $('body').append(popup);
        $('#' + name)
            .fadeIn(400)
            .delay(5000)
            .fadeOut(400, function() {
                popup.remove();
            });
    }
    
    return {
        show: show  
    };
}) ();