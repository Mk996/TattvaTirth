const $ = require("jquery");
const remote = require("electron").remote;
const index = remote.require("./index.js");

$('#exit_btn').click(() => {
    var win = remote.getCurrentWindow() 
    win.close()
})

var bookName = new Array();
var price = new Array();


$(() => {
  var now = new Date();

  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);

  var today = now.getFullYear() + "-" + month + "-" + day;

  $("#date").val(today);
  var connection = index.connectToDatabase("tatva_tirth");

  $querystring = "SELECT title,price FROM stock;";

  connection.query($querystring, (err, rows, fields) => {
    $.each(rows, (i, row) => {
        bookName.push(row.title)
        price.push(row.price)
    })
  });
});

$("#bname").on("input", (e) => {
    var bname = $('#bname').val().trim();
    
    for(var i = 0; i < bookName.length; i++){
        var bname1 = String(bookName[i]).trim();
        //alert(bname1)
        if(bname == bname1){
            $('#bprice').val(parseInt(price[i]));
            $('#bqty').val(1)
            break;   
        }
    }
});

$('#bqty').keypress(function(event){
	
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if(keycode == '13'){
		$('#addbook').click()	
	}

});

$('#bname').keypress(function(event){
	
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if(keycode == '13'){
		$('#addbook').focus()	
	}

});

$("#addbook").click(() => {
  var bname = $("#bname").val();
  var bprice = $("#bprice").val();
  var bqty = $('#bqty').val();


  if (bprice != parseInt(bprice) || bname === "") {
    alert("Enter Correct or all values");
  } else {

    

    $("#addedBooks tbody").append(
        "<tr> <td class='titles'> " +
            bname +
            "</td> <td class='qtys'> " +
            bqty +
            "</td> <td class='prices'>" +
            bprice*bqty +
            '</td> <td><input type="button" class="btn btn-danger" onclick=removeRow(this) value="Remove"></td> </tr>');

          

    
   
    $("#bname").val("");
    $("#bprice").val("");
    $('#bqty').val("");

    var btprice = parseInt($("#btprice").val());
    var btqty = $("#btqty").val();

    btprice = parseInt(btprice) + parseInt(bprice*bqty);
    btqty = parseInt(btqty) +  parseInt(bqty);

    $("#btprice").val(btprice);
    $("#btqty").val(btqty);
    $('#bname').focus();
  }
});

function removeRow(b) {
  var tr = b.parentNode.parentNode;

  var bprice = tr.getElementsByTagName("td")[2].innerHTML;
  var bqty = tr.getElementsByTagName("td")[1].innerHTML;
  var btprice = parseInt($("#btprice").val());
  var btqty = $("#btqty").val();

  btprice = parseInt(btprice) - parseInt(bprice);
  btqty -= bqty;

  $("#btprice").val(btprice);
  $("#btqty").val(btqty);

  tr.remove();
}

$('#savePurchase').click(() => { 
    var connection = index.connectToDatabase('tatva_tirth');

    var vname = $('#vname').val()
    var date = $('#date').val()
    var btprice = parseInt($("#btprice").val())
    var btqty = parseInt($("#btqty").val())

    var  titles, prices, i;

    titles = document.getElementsByClassName("titles");
    prices = document.getElementsByClassName("prices");
    qtys = document.getElementsByClassName("qtys");

    if(titles.length == 0){

        alert("Insert Atleast one book")

    }else{

        $querystring = "INSERT INTO purchase_up(vendorname, date, totalprice, totalqty) VALUES(" +
                    "'"+ vname +"' , '"+ date +"' , " + btprice + "," + btqty + ");"

        connection.query($querystring, (err, result) => {
            if (err) {
                alert(err)
            } 
        })

        $querystringinner = "SELECT idpurchase FROM purchase_up ORDER BY idpurchase DESC LIMIT 1";

        

        for(i = 0; i < titles.length; i++){
            $querystring = "INSERT INTO purchase_down VALUES(" +
                    "("+ $querystringinner +") , '"+ titles[i].innerHTML +"' , " + prices[i].innerHTML +" , "+ qtys[i].innerHTML +");"
            
            connection.query($querystring, (err, result) => {
                if (err) {
                    alert(err)
                } 
            })

            $querystring = "UPDATE stock SET stock = stock + " + qtys[i].innerHTML + " WHERE title = '" + titles[i].innerHTML + "';" 
            connection.query($querystring, (err, result) => {
                if (err) {
                    alert(err)
                } 
            })
        }

        
    }

    location.reload()
          
})
