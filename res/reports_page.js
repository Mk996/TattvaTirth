const $ = require('jquery')
const remote = require('electron').remote
const index = remote.require('./index.js')

$(() => {
    var now = new Date();

    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);

    var today = now.getFullYear() + "-" + month + "-" + day;

    $("#frmdate").val(today);
    $("#todate").val(today);
})


$(document).keydown(function (event) {

    if ((event.ctrlKey || event.metaKey) && event.which == 80) {
        window.print();

    }
}
);



function createExcel() {
    var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
        tab_text = tab_text + '<head><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';
        tab_text = tab_text + '<x:Name>Reports</x:Name>';
        tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
        tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
        tab_text = tab_text + "<table border='1px'>";
        
       //get table HTML code
        tab_text = tab_text + document.getElementById('resultTable').innerHTML;

        tab_text = tab_text + '</table></body></html>';
        //alert("hi")
        var data_type = 'data:application/vnd.ms-excel';
        
        $('#excel').attr('href', data_type + ', ' + encodeURIComponent(tab_text));
        $('#excel').attr('download', 'Reports.xls');
}




$('#search').click(() => {

    $('#resultTable tbody tr').remove();
    $('#resultTable tfoot tr').remove();

    var type = $('#type').val().trim();
    var subtype = $('#subtype').val().trim();
    var frmdate = $('#frmdate').val().trim();
    var todate = $('#todate').val().trim();


    var connection = index.connectToDatabase("tatva_tirth");



    if (subtype == 'bookwise') {
        var tqty = 0;
        var tprice = 0;

        $querystring = "SELECT title, sum(price) as price, sum(qty) as qty FROM " + type + "_down WHERE id" + type + " in (SELECT id" + type + " FROM " + type + "_up WHERE date BETWEEN '" + frmdate + "' AND '" + todate + "') GROUP BY title;";
        connection.query($querystring, (err, rows, fields) => {
            $.each(rows, (i, row) => {
                $('#resultTable tbody').append('<tr><td></td><td></td><td>' + row.title + '</td><td></td><td>' + row.qty + '</td><td>' + row.price + '</td></tr>');
                tqty += parseInt(row.qty);
                tprice += parseInt(row.price);
            })
            $('#resultTable tfoot').append('<tr><td></td><td></td><td></td><td>Total:</td><td>' + tqty + '</td><td>' + tprice + '</td></tr>')
        });



    } else {
        var bookName = $('#bname').val().trim();
        var billno = ''
        var name = ''
        var query = ''



        if (type == 'sale') {
            if (bookName != '') {
                query = " AND idsale in (SELECT idsale FROM sale_down WHERE title = '" + bookName + "')"
            }
            billno = 'idsale'
            name = 'buyername'

            $querystring = "SELECT " + billno + ", " + name + ", DATE_FORMAT(date, '%d-%m-%Y') as dates FROM " + type + "_up WHERE date BETWEEN '" + frmdate + "' AND '" + todate + "';"
            connection.query($querystring, (err, rows, fields) => {

                $.each(rows, (i, row) => {
                    var id = row.idsale
                    var buyername = row.buyername
                    var date = row.dates

                    //var connection1 = index.connectToDatabase("tatva_tirth");
                    $querystring1 = "SELECT * FROM sale_down WHERE idsale = " + id + ";"


                    connection.query($querystring1, (err, rows, fields) => {
                        var p = 0;
                        $.each(rows, (i, row) => {

                            if (p == 0) {
                                $('#resultTable tbody').append('<tr id="' + id + '"><td>' + id + '</td><td>' + buyername + '</td><td>' + date + '</td><td>' + row.title + '</td><td>' + row.qty + '</td><td>' + row.price + '</td></tr>');
                            } else {
                                $('#resultTable tbody').append('<tr><td></td><td></td><td></td><td>' + row.title + '</td><td>' + row.qty + '</td><td>' + row.price + '</td></tr>');
                            }



                            p++;

                        })

                    });


                })

            });

            $querystring = "SELECT sum(totalqty) as qty, sum(totalprice) as price FROM sale_up WHERE date BETWEEN '" + frmdate + "' AND '" + todate + "';";
            connection.query($querystring, (err, rows, fields) => {
                $.each(rows, (i, row) => {
                    $('#resultTable tfoot').append('<tr><td></td><td></td><td></td><td>Total:</td><td>' + row.qty + '</td><td>' + row.price + '</td></tr>')

                })

            });


        } else {
            if (bookName != '') {
                query = " AND idpurchase in (SELECT ididpurchase FROM idpurchase_down WHERE title = '" + bookName + "')"
            }
            billno = 'idpurchase'
            name = 'vendorname'


            $querystring = "SELECT idpurchase, vendorname, DATE_FORMAT(date, '%d-%m-%Y') as dates  FROM purchase_up WHERE date BETWEEN '" + frmdate + "' AND '" + todate + "';"
            connection.query($querystring, (err, rows, fields) => {
                $.each(rows, (i, row) => {
                    var id = row.idpurchase
                    var buyername = row.vendorname
                    var date = row.dates
                    //alert("hii")

                    //var connection1 = index.connectToDatabase("tatva_tirth");
                    $querystring1 = "SELECT * FROM purchase_down WHERE idpurchase = " + id + ";"


                    connection.query($querystring1, (err, rows, fields) => {
                        var p = 0;
                        $.each(rows, (i, row) => {

                            if (p == 0) {
                                $('#resultTable tbody').append('<tr id="' + id + '"><td>' + id + '</td><td>' + buyername + '</td><td>' + date + '</td><td>' + row.title + '</td><td>' + row.qty + '</td><td>' + row.price + '</td></tr>');
                            } else {
                                $('#resultTable tbody').append('<tr><td></td><td></td><td></td><td>' + row.title + '</td><td>' + row.qty + '</td><td>' + row.price + '</td></tr>');
                            }



                            p++;

                        })

                    });
                })

            });

            $querystring = "SELECT sum(totalqty) as qty, sum(totalprice) as price FROM purchase_up WHERE date BETWEEN '" + frmdate + "' AND '" + todate + "';";
            connection.query($querystring, (err, rows, fields) => {
                $.each(rows, (i, row) => {
                    $('#resultTable tfoot').append('<tr><td></td><td></td><td></td><td>Total:</td><td>' + row.qty + '</td><td>' + row.price + '</td></tr>')

                })

            });


        }




    }
})