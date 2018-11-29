const electron = require("electron");
const { app, BrowserWindow } = electron;
require("electron-reload")(__dirname);


app.on("ready", () => {
  let win = new BrowserWindow({
    frame: false,
    autoHideMenuBar: true,
    width: 500,
    height: 513,
    transparent: true,
    icon: "/res/images/tradeassistant.ico"
  });

  win.setResizable(false);
  win.loadURL(`file://${__dirname}/res/login.html`);
});

exports.openWindow = filename => {
  let win = new BrowserWindow({
    autoHideMenuBar: true
  });
  win.loadURL(`file://${__dirname}/res/` + filename + `.html`);
  win.minimize();
  win.maximize();
  
};

exports.connectToDatabase = databasename => {
  // Including mysql
  var mysql = require("mysql");

  // Creating of connection variable
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "aone1234",
    database: databasename
  });

  connection.connect(err => {
    if (err) {
      return alert(err);
    }
  });

  return connection;
};



//////////////////////////////////////

