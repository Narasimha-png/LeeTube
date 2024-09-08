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

    if (message.action === 'getsearchres') {
        searchvideo(message, sendResponse);
        return true; 
    }

    if (message.action === 'opentab') {
        console.log("URL " + message.url);
        chrome.tabs.create({ url: message.url });
    }
});

async function searchvideo(message, sendResponse) {
    console.log(message.data);
    let data = encodeURIComponent(message.data);
    let results = message.results;

    var res = null;
    var apikeys = [
        '',
        '',
        '',
        ''
    ];
    var ind = 0;

    while (ind < apikeys.length && res === null) {
        var key = apikeys[ind];
        let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${data}&maxResults=${results}&type=video&key=${key}`;
        console.log(url);

        try {
            let response = await fetch(url);
            let jsonData = await response.json();
            if (jsonData.items) {
                res = jsonData.items;
                let results = "" ;
                sendResponse({ data: res, results:results });
                return; 
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }

        ind++;
    }
    if (res === null) {
        sendResponse({ error: "No results found or API key limit exceeded." });
    }
}
