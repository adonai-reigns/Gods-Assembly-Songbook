/**
 * @name Download Any File from Blob 
 * @description For downloading contents generated programmatically with JavaScript
*/
export function downloadBlob(blob: Blob | MediaSource, filename: string = 'downloadedFile.txt') {
    let downloadButton = document.createElement('a');
    downloadButton.href = URL.createObjectURL(blob);
    downloadButton.download = filename;
    document.body.appendChild(downloadButton);
    downloadButton.dispatchEvent(
        new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        })
    );
    document.body.removeChild(downloadButton);
}

