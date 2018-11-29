const $ = require('jquery')
const remote = require('electron').remote
const index = remote.require('./index.js')


$("#exit_btn").click(() => {
    var win = remote.getCurrentWindow();
    win.close();
  });


//To open contacts section
$('#reports_btn').click(() => { 
    /*var connection = index.connectToDatabase('tatva_tirth');
    doc.text(60, 10, "Sales:")
    
    $querystring = "SELECT * FROM sale_up;"
    var qty = 0
    var total = 0*/
    var win = remote.getCurrentWindow()
    index.openWindow('reports_page')
})

$('#products_btn').click(() => {
    var win = remote.getCurrentWindow()
    index.openWindow('products_selection')
})

$('#sale_btn').click(() => { 
    var win = remote.getCurrentWindow()
    index.openWindow('sale_page')
})

$('#purchase_btn').click(() => { 
    var win = remote.getCurrentWindow()
    index.openWindow('purchase_page')
})