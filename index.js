const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const SettingsBill = require('./settings-bill');

const app = express();
const settingsBill = SettingsBill()
app.locals.layout = false 
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'));

app.get('/', function(req, res){
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
    {settings, totals})
  });

app.post('/settings', function(req, res){

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
  res.render('index', {settings, totals})
});

app.post('/action', function(req, res){
  console.log(req.body.actionType)
  settingsBill.recordAction(req.body.actionType)
  
  var settings = {
    callCost: settingsBill.getCallCost(),
    smsCost: settingsBill.getSmsCost(),
    warningLevel: settingsBill.getWarningLevel(),
    criticalLevel:settingsBill.getCriticalLevel(),
    colour: settingsBill.colourChange()

  }
  var totals = settingsBill.totals() 
  res.render('index', {settings, totals})
});

app.get('/actions', function(req, res){

});

app.get('/actions/:type ', function(req, res){

});  

let PORT = process.env.PORT || 3008;

app.listen(PORT, function(){
  console.log('App starting on port', PORT);
})