function search(YouChannel){
chrome.runtime.sendMessage({ action: 'getTabUrl' }, (response) => {
    if (response.error) {
        console.error(response.error);
        document.getElementById("ytlist").innerHTML = `<p>${response.error}</p>`;
    } else {
        let tabUrl = response.url;
        console.log("URL: ", tabUrl);
        if (tabUrl.includes("leetcode.com/problems/")) {
            document.getElementById("ytlist").innerHTML = "<h2>Searching Results</h2>";
    let url = tabUrl.split("leetcode.com/problems/");
    let query = "" ;
    if( YouChannel === "")
    query = url[1].split("/")[0] + " leetcode";
else
query = url[1].split("/")[0] + " " + YouChannel ;
console.log(query ) ;
    chrome.runtime.sendMessage({ action: 'getsearchres', data: query, results: 10 }, (response) => {
       console.log(response) ;
         if( response.results.length != 0 )
            document.getElementById("ytlist").innerHTML = "<p>Sorry!! API key limit exceeded.MEET YOU TOMORROW</p>";
         else {
            let resvid = "";
            document.getElementById("ytlist").innerHTML = "";
            for (let i = 0; i < response.data.length; i++) {
                let videoId = response.data[i].id.videoId;
                let vid = `<div class="yt" data-id="${i}">` +
                    `<img class="ytimg" src="${response.data[i].snippet.thumbnails.default.url}" alt="">` +
                    '<div>' +
                    `<p class="des">${response.data[i].snippet.title}</p>` +
                    `<p class="des">${response.data[i].snippet.channelTitle}</p>` +
                    '</div>' +
                    '</div>';

                resvid += vid;
            }
            document.getElementById("ytlist").innerHTML = resvid;

            document.querySelectorAll(".yt").forEach(element => {
                element.addEventListener("click", function() {
                    let ind = Number(this.getAttribute('data-id'));
                    let url = response.data[ind].id.videoId;
                    console.log(url);
                    chrome.runtime.sendMessage({ action: 'opentab', url: `https://www.youtube.com/watch?v=${url}` });
                });
            });
        }
    });
           
        } else {
            document.getElementById("ytlist").innerHTML = "<p>This extension works only for LeetCode problems.</p>";
        }
    }
});
}
search("") ;
document.getElementById("search").addEventListener("click" , ()=>{
    var ch = document.getElementById("search").value ;
    console.log(ch) ;
    search(ch) ;
})
