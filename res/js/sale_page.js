const $ = require("jquery");
const remote = require("electron").remote;
const index = remote.require("./index.js");

$("#exit_btn").click(() => {
  var win = remote.getCurrentWindow();
  win.close();
});

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
      bookName.push(row.title);
      price.push(row.price);
    });
  });
});

$("#bname").on("input", e => {
  var bname = $('#bname').val().trim();

  for (var i = 0; i < bookName.length; i++) {
    var bname1 = String(bookName[i]).trim();
    //alert(bname1 + bname1.length)
    //alert(bname + bname.length)


    if (bname === bname1) {


      $("#bprice").val(price[i])
      $("#bqty").val(1);
      break;
    }
  }

});

$('#bname').keypress(function (event) {

  var keycode = (event.keyCode ? event.keyCode : event.which);
  if (keycode == '13') {
    $('#addbook').focus()
  }

});

$('#bqty').keypress(function (event) {

  var keycode = (event.keyCode ? event.keyCode : event.which);
  if (keycode == '13') {
    $('#addbook').click()
  }

});

$("#addbook").click(() => {
  var bname = $("#bname").val();
  var bprice = $("#bprice").val();
  var bqty = $("#bqty").val();

  if (bprice != parseInt(bprice) || bname === "") {
    alert("Enter Correct or all values");
  } else {
    $("#addedBooks tbody").append(
      "<tr> <td class='titles'> " +
      bname +
      "</td> <td class='qtys'> " +
      bqty +
      "</td> <td class='prices'>" +
      bprice * bqty +
      '</td> <td><input type="button" class="btn btn-danger" onclick=removeRow(this) value="Remove"></td> </tr>'
    );
    $("#bname").val("");
    $("#bprice").val("");
    $("#bqty").val("");

    var btprice = parseInt($("#btprice").val());
    var btqty = $("#btqty").val();

    btprice = parseInt(btprice) + parseInt(bprice * bqty);
    btqty = parseInt(btqty) + parseInt(bqty);

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

$("#saveSale").click(() => {
  var connection = index.connectToDatabase("tatva_tirth");

  var vname = $("#vname").val();
  var date = $("#date").val();
  var btprice = parseInt($("#btprice").val());
  var btqty = parseInt($("#btqty").val());

  var titles, prices, i;

  titles = document.getElementsByClassName("titles");
  prices = document.getElementsByClassName("prices");
  qtys = document.getElementsByClassName("qtys");

  if (titles.length == 0) {
    alert("Insert Atleast one book");
  } else {
    $querystring =
      "INSERT INTO sale_up(buyername, date, totalprice, totalqty) VALUES(" +
      "'" +
      vname +
      "' , '" +
      date +
      "' , " +
      btprice +
      "," +
      btqty +
      ");";

    connection.query($querystring, (err, result) => {
      if (err) {
        alert(err);
      }
    });

    $querystringinner =
      "SELECT idsale FROM sale_up ORDER BY idsale DESC LIMIT 1";

    for (i = 0; i < titles.length; i++) {
      $querystring =
        "INSERT INTO sale_down VALUES(" +
        "(" +
        $querystringinner +
        ") , '" +
        titles[i].innerHTML +
        "' , " +
        prices[i].innerHTML +
        " , " +
        qtys[i].innerHTML +
        ");";

      connection.query($querystring, (err, result) => {
        if (err) {
          alert(err);
        }
      });

      $querystring =
        "UPDATE stock SET stock = stock - " +
        qtys[i].innerHTML +
        " WHERE title = '" +
        titles[i].innerHTML +
        "';";
      connection.query($querystring, (err, result) => {
        if (err) {
          alert(err);
        }
      });
    }




    var r = confirm("do you want to print?");
    if (r == true) {
      
      var wind = index.openWindow('bill')
      
      
      
      

      /*var inside = 0;
      connection.query($querystringinner, (err, rows, fields) => {

        $.each(rows, (i, row) => {
          inside = row.idsale;
          var doc = new jsPDF();
          var titles = document.getElementsByClassName("titles");
          var qtys = document.getElementsByClassName("qtys");
          var prices = document.getElementsByClassName("prices");

          var elementHandler = {
            '#ignorePDF': function (element, renderer) {
              return true;
            }
          };

          doc.text(60, 10, "\"Adhyatma Vidya Mandir\"")
          doc.text(55, 17, "Thaltej, Ahmedabad-380059")
          doc.text(50, 24, "Email : contact@tattvatirtha.org")
          doc.text(40, 31, "Phone : 079-26858333 Fax : 079-26856395")

          $querystringinner = "SELECT idsale, date FROM sale_up ORDER BY idsale DESC LIMIT 1";

          doc.text(29, 43, "BillNo. : " + inside)
          doc.text(75, 43, "Name : " + $('#vname').val())

          doc.text(28, 52, "Book Name")
          doc.text(102, 52, "Qty")
          doc.text(130, 52, "Total Price")

          var j = 54

          for (var i = 0; i < titles.length; i++) {
            doc.fromHTML(
              titles[i],
              30,
              j,
              {
                'width': 180, 'elementHandlers': elementHandler
              });
            doc.fromHTML(
              qtys[i],
              105,
              j,
              {
                'width': 180, 'elementHandlers': elementHandler
              });
            doc.fromHTML(
              prices[i],
              135,
              j,
              {
                'width': 180, 'elementHandlers': elementHandler
              });

            j = j + 5


          }
          //alert(j)
          j = j + 15
          var btprice = parseInt($("#btprice").val());
          var btqty = parseInt($("#btqty").val());
          doc.text(30, j, "Total : ")
          doc.text(105, j, String(btqty))
          doc.text(135, j, String(btprice))

          j = j + 25
          doc.text(135, j, "Authorised Signature")



          window.open(doc.output('bloburl'))

        });
      });

*/
    }
    location.reload()
  }
});
