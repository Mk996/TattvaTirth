const $ = require('jquery')
const remote = require('electron').remote
const index = remote.require('./index.js')

$('#addbook').click(() => {
    var bname = $('#bname').val()
    var bprice = $('#bprice').val()
    if(bname === ""){
        alert("Please Enter a Book name")
    }else{
        $('#addedBookTitles tbody').append('<tr> <td class="titles">' + bname + '</td> <td class="prices">' + bprice + '</td> <td><input type="button" class="btn btn-danger" onclick=removeRow(this) value="Remove"></td> </tr>')
        $('#bname').val("")
    }
    $('#bname').focus();
})

$('#bname').keypress(function(event){
	
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if(keycode == '13'){
		$('#bprice').focus()	
	}

});

$('#bprice').keypress(function(event){
	
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if(keycode == '13'){
		$('#addbook').focus()	
	}

});

function removeRow(b){
    $(b).parents('tr').first().remove()
}

$('#save').click(() => { 
    var connection = index.connectToDatabase('tatva_tirth');
    
    var  titles, prices, i;

    
    titles = document.getElementsByClassName("titles");
    prices = document.getElementsByClassName("prices");
    
    var flag = true;
    for(i = 0; i < titles.length; i++){
        
        

        $querystring = "INSERT INTO stock VALUES(' " + titles[i].innerHTML + "' ,  0 , " + prices[i].innerHTML + ");"

        connection.query($querystring, (err, result) => {
            if (err) {
                alert(err)
                
            } 

        })

    }

    location.reload()
          
})