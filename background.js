chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getTabUrl') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (chrome.runtime.lastError) {
                console.error("Error querying tabs: ", chrome.runtime.lastError);
                sendResponse({ error: "Error querying tabs." });
                return;
            }

            if (tabs.length > 0) {
                let tab = tabs[0];
                let tabUrl = tab.url || "URL not available";
                sendResponse({ url: tabUrl });
            } else {
                sendResponse({ error: "No active tab found." });
            }
        });
        return true;
    }
    if(message.action == 'getsearchres'){
        console.log(message.data) ;
        let data = encodeURIComponent(message.data ) ;
        let results = message.results;
        let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${data}&maxResults=${results}&type=video&key=AIzaSyC6JePNoKRH-51S8F94kr-fK_ci49qdZtA`;
        fetch(url).then(responce =>responce.json()).then(data=>{
          //  console.log(data.items) ;
            sendResponse({data:data.items}) ;
        }) ;
        return true ;
    }
    if( message.action == 'opentab'){
        console.log("URL " + message.url) ;
        chrome.tabs.create({url:message.url}) ;
    }
});
