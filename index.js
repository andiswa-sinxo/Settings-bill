const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const SettingsBill = require('./settings-bill');

var moment = require('moment')
moment().format()

const app = express();
const settingsBill = SettingsBill()

const handlebarSetup = exphbs({
  partialsDir: "./views/partials",
  viewPath: './views',
  layoutsDir: './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static('public'));



app.get('/', function (req, res) {

  var callCost = req.body.callCost
  var smsCost = req.body.smsCost
  var warningLevel = req.body.warningLevel
  var criticalLevel = req.body.criticalLevel

  var settings = {
    callCost,
    smsCost,
    warningLevel,
    criticalLevel,
    colour: settingsBill.colourChange()
  }
  settingsBill.setCallCost(callCost)
  settingsBill.setSmsCost(smsCost)
  settingsBill.setWarningLevel(warningLevel)
  settingsBill.setCriticalLevel(criticalLevel)
  var totals = settingsBill.totals()
  res.render('index',
    { settings, totals })
});

app.post('/settings', function (req, res) {

  var callCost = req.body.callCost
  var smsCost = req.body.smsCost
  var warningLevel = req.body.warningLevel
  var criticalLevel = req.body.criticalLevel
  var settings = {
    callCost,
    smsCost,
    warningLevel,
    criticalLevel,
    colour: settingsBill.colourChange()
  }
  settingsBill.setCallCost(callCost)
  settingsBill.setSmsCost(smsCost)
  settingsBill.setWarningLevel(warningLevel)
  settingsBill.setCriticalLevel(criticalLevel)
  var totals = settingsBill.totals()
  res.render('index', { settings, totals })
});

app.post('/action', function (req, res) {
  console.log(req.body.actionType)
  settingsBill.recordAction(req.body.actionType)

  var settings = {
    callCost: settingsBill.getCallCost(),
    smsCost: settingsBill.getSmsCost(),
    warningLevel: settingsBill.getWarningLevel(),
    criticalLevel: settingsBill.getCriticalLevel(),
    colour: settingsBill.colourChange(),
    // className: settingsBill.totalClassName()

  }
  var totals = settingsBill.totals()
  res.render('index', { settings, totals })
});

app.get('/actions', function (req, res) {
  console.log(settingsBill.actions())
  var actionsList = settingsBill.actions()
  actionsList.forEach(element => {
    element.currentTime = moment(element.timestamp).fromNow()
  });
  res.render('actions', { actions: actionsList })
});

app.get('/actions/:type', function (req, res) {
  var type = req.params.type

  var actionsList = settingsBill.actionsFor(type)
  actionsList.forEach(element => {
    element.currentTime = moment(element.timestamp).fromNow()
  })

  res.render('actions', { actions: actionsList })

});

let PORT = process.env.PORT || 3008;

app.listen(PORT, function () {
  console.log('App starting on port', PORT);
})