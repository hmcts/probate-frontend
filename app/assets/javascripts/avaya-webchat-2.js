(function() {
    let popupWin;
    function windowOpener(url, name, args) {

        if(typeof(popupWin) != "object" || popupWin.closed)  {
            popupWin =  window.open(url, name, args);
        }
        else{
            popupWin.location.href = url;
        }

        popupWin.focus();
     }

    const avayaWebchat = document.querySelector('#avayaWebchatMetric');
    const avayaAgentBusy = document.querySelector('#webchat-agent-busy');
    const avayaWebchatOpen = document.querySelector('#avaya-webchat-open');
    const avayaWebchatClose = document.querySelector('#avaya-webchat-close');
    const avayaWebchatMaintenance = document.querySelector('#webchat-maintenance');

    if(avayaAgentBusy){
        avayaAgentBusy.hidden = true;
    }

    if(avayaWebchatOpen){
        avayaWebchatOpen.hidden = true;
    }

    if(avayaWebchatClose){
        avayaWebchatClose.hidden = true;
    }

    if(avayaWebchatMaintenance){
        avayaWebchatMaintenance.hidden = false;
    }

    if(avayaWebchat){
        avayaWebchat.hidden = true;
        avayaWebchat.addEventListener('metrics', function (metrics) {
            const metricsDetail = metrics.detail;
            const ewt = metricsDetail.ewt;
            const ccState = metricsDetail.contactCenterState;
            const availableAgents = metricsDetail.availableAgents;

            avayaWebchatOpen.hidden = true;
            avayaAgentBusy.hidden = true;
            avayaWebchatClose.hidden = true;
            avayaWebchatMaintenance.hidden = true;
            
            if(ccState === 'Open'){
                avayaWebchatOpen.hidden = false; 
            }else{
               avayaWebchatClose.hidden = false;
        });
    }

    const avayaWebChatLink = document.querySelector('#avaya-webchat-link');
    if(avayaWebChatLink){
        avayaWebChatLink.addEventListener('click', function () {
            windowOpener('/avaya-webchat', 'Web Chat', 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=350,height=580,left=100,top=100');
        });
    }
}).call(this);

