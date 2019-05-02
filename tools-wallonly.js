// ==UserScript==
// @name         Krunker.io Tools (Walls only) 
// @description  Krunker.io Tools - ESP - v1.2.3
// @version      1.0
// @author       t4professor
// @match        *://krunker.io/*
// @exclude      *://krunker.io/social*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

/* eslint-env es6 */
window.stop();
document.innerHTML = "";

GM_xmlhttpRequest({
    method: "GET",
    url: document.location.origin,
    onload: res => {
        let htmlBody = res.responseText;
        const gameVersion = /game\.([^\.]+)\.js/.exec(htmlBody)[1];
        GM_xmlhttpRequest({
            method: "GET",
            url: `${document.location.origin}/js/game.${gameVersion}.js`,
            onload: res => {
                let gameCode = res.responseText;
                gameCode = hooker(gameCode, 'ESP default', /(if\(\w+\.inView)\){/, "$1||true){");
                htmlBody = htmlBody.replace(/<script src="js\/game\.\w+?(?=\.)\.js\?build=.+"><\/script>/g, ``);
                htmlBody += `<script type="text/javascript">${gameCode.toString()}\n</script>`;
                document.open();
                document.write(htmlBody);
                document.close();
            }
        })
    }
})

function hooker(gameCode, injectName, regex, replacer) {
    const newGameCode = gameCode.replace(regex, replacer);
    if (gameCode === newGameCode) {
        document.open();
        document.write(
            `<html lang="en">
            <head>
                <title>KrunkTools Error</title>
                <style>
                    body {
                        background: black;
                        color: white;
                    }
                    pre code {
                        font: 20pt/1.5 Monaco, monospace;
                    }
                    .debug {
                        color: Snow;
                    }
                    .info {
                        color: LawnGreen;
                    }
                    .warn {
                        color: GoldenRod;
                    }
                    .error {
                        color: LightCoral;
                    }
                </style>
            </head>
            <body>
                <pre><code><span class="debug">Krunker Tools</span>
<span class="error">Error: Hook "${injectName}" failed!</span></code></pre>
            </body>
            </html>`
        );
        document.close();
        throw new Error(`[KrunkerTools]-"${injectName}" failed!`);
    }
    return newGameCode;
}