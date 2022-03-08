/*
    client-zip by Touffy (https://github.com/Touffy)
    Source: https://github.com/Touffy/client-zip
    Adapted by sudomelon, March 2022
*/
/*
Copyright 2020 David Junger

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 DEALINGS IN THE SOFTWARE.
*/

import { downloadZip } from "./client_zip.js";

const mainSaveFileUrl = "https://raw.githubusercontent.com/Touffy/client-zip/master/src/index.ts";
const saveGameInfoUrl = "https://raw.githubusercontent.com/Touffy/client-zip/master/src/index.ts";
const zipFileName = "Maxan_199008108.zip";

function triggerDownload() {
    const isResponseOk = res => {
        if (res.ok) {
            return res;
        } else {
            console.error(res.url + " " + res.status + " " + res.statusText);
            throw res;
        }
    };

    // define what we want in the ZIP
    const mainSaveFile = fetch(mainSaveFileUrl).then(isResponseOk);
    const saveGameInfo = fetch(saveGameInfoUrl).then(isResponseOk);

    // get the ZIP stream in a Blob
    const files = Promise.all([mainSaveFile, saveGameInfo]);
    const generateDownload = files
        .then(files_done => downloadZip(files_done))
        .then(zip => zip.blob())
        .then(
            blob => {
                // make and click a temporary link to download the Blob
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = zipFileName;
                link.click();
                link.remove();

                // in real life, don't forget to revoke your Blob URLs if you use them
                URL.revokeObjectURL(blob);
            }
        )
        .catch(
            error => {
                alert("Download failed :(");
                console.error(error);
            }
        );
    return generateDownload;
}

// expose download function to window scope
window.tryAgain = triggerDownload;

// execute the download
triggerDownload();
