const $ = require('jquery')
const remote = require('electron').remote
const index = remote.require('./index.js')


$('#exit_btn').click(() => {
    var win = remote.getCurrentWindow() 
    win.close()
})

$('#login_btn').click(() => {



    var connection = index.connectToDatabase('tatva_tirth')

    $querystring = 'SELECT username , password FROM logindata;'
    
    connection.query($querystring, (err, rows, fields) => {
        if (err) {
            return alert(err)
        }

        if ($('#username').val() == rows[0].username && $('#password').val() == rows[0].password) {
            //alert("Password matched!!!")
            var win = remote.getCurrentWindow()
            index.openWindow('main_page')
            win.close()
        } else {
            alert("Username or Password or both Incorrect!!!")
        }

    })

    connection.end(() => {

    })


})


