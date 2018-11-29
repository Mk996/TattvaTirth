const $ = require("jquery");
const remote = require("electron").remote;
const index = remote.require("./index.js");

$(() => {
    var connection = index.connectToDatabase("tatva_tirth");

    $querystringinner = "SELECT *, DATE_FORMAT(date, '%d/%c/%Y') as dates FROM sale_up ORDER BY idsale DESC LIMIT 1";


    connection.query($querystringinner, (err, rows, fields) => {
        $.each(rows, (i, row) => {
            //alert("hi")
            $('#billNo').append('BillNo. : ' + row.idsale + '<br> Name : ' + row.buyername + '<br> Date : ' + row.dates)
            $querystring = "SELECT * FROM sale_down WHERE idsale = " + row.idsale +";";
            connection.query($querystring, (err, rows, fields) => {
                $.each(rows, (i,row) => {
                    $('#saleTable tbody').append('<tr><td>'+ row.title +'</td><td>'+ (row.price/row.qty) +'</td><td>'+ row.qty +'</td><td>'+ row.price +'</td></tr>')
                })
            })
            $('#saleTable tfoot').append('<tr><th>Total : </th><th></th><th>'+ row.totalqty +'</th><th>'+ row.totalprice +'</th><tr>')
        });
    });

    window.print()
    
})