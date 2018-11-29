const $ = require('jquery')
const remote = require('electron').remote
const index = remote.require('./index.js')




$(() => {
    var connection = index.connectToDatabase('tatva_tirth');
    $querystring = "SELECT * FROM stock;"
    var qty = 0
    connection.query($querystring, (err, rows, fields) => {
        $.each(rows, (i, row) => {
            $('#addedBookStocks tbody').append('<tr> <td class="titles">' + row.title + '</td> <td class="qtys">' + row.stock + '</td> <td class="prices">'+ row.price +'</td> </tr>')
            qty += parseInt(String(row.stock))
        })
        
        $('#totalqty').text(qty)
      });
})



$('#getpdf').click(() =>{
var doc = new jsPDF();          
var elementHandler = {
  '#ignorePDF': function (element, renderer) {
    return true;
  }
};

var title = document.getElementById("label");


doc.fromHTML(
    title,
    30,
    5,
    {
      'width': 180,'elementHandlers': elementHandler
    });

var titles = document.getElementsByClassName("titles");
var qtys = document.getElementsByClassName("qtys");
var prices = document.getElementsByClassName("prices");
var j = 15
var tqty = 0

for(var i = 0; i < titles.length; i++){
    doc.fromHTML(
        titles[i],
        30,
        j,
        {
          'width': 180,'elementHandlers': elementHandler
        });
    doc.fromHTML(
        qtys[i],
        105,
        j,
        {
            'width': 180,'elementHandlers': elementHandler
        });
    doc.fromHTML(
        prices[i],
        135,
        j,
        {
            'width': 180,'elementHandlers': elementHandler
        });

        j = j + 5
        if(i > 0){
            tqty = tqty + parseInt(String(qtys[i].innerHTML))
        }
        
        
}
j = j + 20

doc.text(30, j, "Total Qty : ")
doc.text(105, j, String(tqty))



doc.save("Stock")

})