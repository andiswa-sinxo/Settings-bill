module.exports = function SettingsBill(){
    let smsCost;
    let callCost;
    let warningLevel;
    let criticalLevel;

    let actionList = [];
     
    function setCallCost(call){
        callCost = Number(call);
    }

    function setSmsCost(sms){
        smsCost = Number(sms)
    }

    function setWarningLevel(warning){
        warningLevel = Number(warning)
    }

    function setCriticalLevel(critical){
        criticalLevel = Number(critical)
    }

    function getCallCost(){
        return callCost
    }

    function getSmsCost(){
        return smsCost
    }

    function getWarningLevel(){
        return warningLevel
    }

    function getCriticalLevel(){
        return criticalLevel
    }
    

    function recordAction(action){
        
        let cost = 0;
        if (action === 'sms'){
            cost += smsCost;
        }
        else if (action === 'call'){
            cost += callCost;
        }

        actionList.push({
            type: action,
            cost,
            timestamp: new Date()
        }); 
    }

    function actions(){
        return actionList;
    }

    function actionsFor(type){
        const filteredActions = [];
        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index]; 
            if (action.type === type) {
                filteredActions.push(action);
            }
        }

        return filteredActions;
    }
    
    function getTotal(type){
        let total = 0; 
        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index];
            if (action.type === type) {
                total += action.cost;
            }
        }
        return total;
    }

    function grandTotal(){
        return getTotal('sms')+ getTotal('call')
    }

    function totals(){
        let smsTotal = getTotal('sms').toFixed(2)
        let callTotal = getTotal('call').toFixed(2)
        return {
            smsTotal,
            callTotal,
            grandTotal : grandTotal().toFixed(2)
        }
    }

    function colourChange(){
        if(grandTotal() >= getWarningLevel() && grandTotal() < getCriticalLevel()) {
            return 'warning'
        }if (grandTotal() >= getCriticalLevel()){
            return 'danger'
        }
    }
      
    function hasReachedWarningLevel(){
        const total = grandTotal();
        const reachedWarningLevel = total >= warningLevel 
            && total < criticalLevel;

        return reachedWarningLevel;
    }

    function hasReachedCriticalLevel(){
        const total = grandTotal();
        return total >= criticalLevel;
    }
        
    return {
        recordAction,
        actions,
        actionsFor,
        totals,
        grandTotal,
        colourChange,
        hasReachedCriticalLevel,
        hasReachedWarningLevel,
        setCallCost,
        setSmsCost,
        setWarningLevel,
        setCriticalLevel,
        getCallCost,
        getSmsCost,
        getWarningLevel,
        getCriticalLevel

    }
}