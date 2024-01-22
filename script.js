// ==UserScript==
// @name         IP2OnlineStreamPrev
// @namespace    http://tampermonkey.net/
// @version      2024-01-22
// @description  See previews of streams on IP2.online
// @author       You
// @match        https://ip2.online/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ip2.online
// @grant        none
// ==/UserScript==



var playerWindow;



function createPlayer(url, platform)
{

    console.log("Creating player...");

    var streamlist = document.getElementsByClassName("stream-container")[0]

    if (playerWindow)
    {
        playerWindow.remove()
    }


    playerWindow = document.createElement("div")


    playerWindow.style.width = "500px";
    playerWindow.style.height = "375px";
    playerWindow.style.background = "#151515";
    playerWindow.style.marginLeft = "35%";
    playerWindow.style.marginBottom = "15px";
    playerWindow.style.position = "fixed";
    playerWindow.style.boxShadow = "0px 0px 17px #000";
    playerWindow.style.zIndex = "1";

    var closePlayer = document.createElement("a");
    closePlayer.style.color = "white";
    closePlayer.textContent = "X";
    closePlayer.style.width = "25px";
    closePlayer.style.height = "25px";
    closePlayer.style.float = "right";
    closePlayer.style.marginRight = "15px";
    closePlayer.onclick = function(){
        playerWindow.remove();
    }

    
    playerWindow.appendChild(closePlayer);
    document.body.insertBefore(playerWindow, streamlist);

    var player = document.createElement("iframe");
    player.width = "500";
    player.height = "375";
    player.frameBorder = "0";
    player.scrolling = "no";
    player.allowfullscreen = "true";


    var streamerName = "";

    if (platform == "kick")
    {
        var getUsername = url.split("https://kick.com/");
        streamerName = getUsername[1];
        player.src = "https://player.kick.com/" + streamerName + "?autoplay=true";
    }
    else if (platform == "youtube")
    {
        var getStreamID = url.split("https://www.youtube.com/watch?v=");
        streamID = getStreamID[1];
        player.src = "https://www.youtube.com/embed/" + streamID + "?autoplay=1";
    }


    playerWindow.appendChild(player);

}



function checkUrl(url)
{

    if (url.startsWith("https://www.youtube.com/"))
    {
        createPlayer(url, "youtube");
    }
    else if (url.startsWith("https://kick.com/"))
    {
        createPlayer(url, "kick");
    }

}




let prog = 0
let MouseIn = false



setTimeout(function(){

    var streamContainer = document.getElementById("stream-container")
    var onlineStreamers = streamContainer.getElementsByClassName("online-streamers")[0]


    const streamItems = onlineStreamers.querySelectorAll('.online-row');

    streamItems.forEach(stream => {

        let wait;
        let prevText;
        var viewerCount = stream.getElementsByClassName("viewer-count")[0]

        stream.onmouseenter = function(){

            prevText = document.createElement("p");
            prevText.style.color = "white";
            prevText.style.display = "flex";
            prevText.style.height = "5px";
            prevText.textContent = "Preview in 2 secs...";
            stream.insertBefore(prevText, viewerCount);

            wait = setTimeout(() => {
                console.log("OK");
                checkUrl(stream.getAttribute("href"));
                clearTimeout(wait);
            }, 2000);
        }

        stream.onmouseleave = function(){
            if (prevText)
            {
                prevText.remove();
            }

            clearTimeout(wait);
        }


    });


}, 1000);


