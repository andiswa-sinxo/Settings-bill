const assert = require('assert');

const SettingsBill = require('../settings-bill');

describe('settings-bill', function(){
    
    it('should be able to record calls', function(){
        let settingsBill = SettingsBill();

        settingsBill.recordAction('call');
        assert.equal(1, settingsBill.actionsFor('call').length);
    });

        it('should be able to record sms ', function(){
            let settingsBill = SettingsBill();
    
            settingsBill.recordAction('sms');
            assert.equal(1, settingsBill.actionsFor('sms').length);
        });

    it('should be able to set the call cost', function(){
        let  settingsBill = SettingsBill()
        settingsBill.setCallCost(3.35);
        assert.equal(3.35, settingsBill.getCallCost())
    });

    it('should be able to set the sms cost', function(){
        let settingsBill = SettingsBill()
        settingsBill.setSmsCost(2.35);
        assert.equal(2.35, settingsBill.getSmsCost())
    });

    it('should be able to set the warning level', function(){
        let settingsBill= SettingsBill()
        settingsBill.setWarningLevel(30);
        assert.equal(30, settingsBill.getWarningLevel())
    });

    it('should be able to set the criticalLevel', function(){
        let settingsBill = SettingsBill()
        settingsBill.setCriticalLevel(40);
        assert.equal(40,settingsBill.getCriticalLevel())
    });
    
    it('should calculate the right totals', function(){

        let settingsBill = SettingsBill();

        settingsBill.setCallCost(3.35);
        settingsBill.setSmsCost(2.35);
        settingsBill.setWarningLevel(30)
        settingsBill.setCriticalLevel(40)
           
        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(2.35, settingsBill.totals().smsTotal);
        assert.equal(3.35, settingsBill.totals().callTotal);
        assert.equal(5.70, settingsBill.totals().grandTotal);
    });
    
    it('should calculate the right totals for multiple actions', function(){
        let settingsBill = SettingsBill();

        settingsBill.setSmsCost(2.35)
        settingsBill.setCallCost(3.35)
        settingsBill.setWarningLevel(30)
        settingsBill.setCriticalLevel(40)
        
        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');
        settingsBill.recordAction('sms');

        assert.equal(4.70, settingsBill.totals().smsTotal);
        assert.equal(6.70, settingsBill.totals().callTotal);
        assert.equal(11.40, settingsBill.totals().grandTotal);

    });

    it('should know when warning level reached', function(){
        const settingsBill = SettingsBill();
        settingsBill.setSmsCost(2.50)
        settingsBill.setCallCost(3.35)
        settingsBill.setWarningLevel(5)
        settingsBill.setCriticalLevel(10)
    
        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(true, settingsBill.hasReachedWarningLevel());
    });

    it('should know when critical level reached', function(){
        const settingsBill = SettingsBill();
        settingsBill.setSmsCost(2.50)
        settingsBill.setCallCost(3.35)
        settingsBill.setWarningLevel(5)
        settingsBill.setCriticalLevel(10)

        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');
        settingsBill.recordAction('sms');

        assert.equal(true, settingsBill.hasReachedCriticalLevel());

    });
});
