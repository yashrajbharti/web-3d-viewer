var array = ["One.","Two.","Three.", "Four.", "Five."];
var dropzone = new Dropzone('#demo-upload', {
  previewTemplate: document.querySelector('#preview-template').innerHTML,
  parallelUploads: 1,
  thumbnailHeight: 120,
  thumbnailWidth: 120,
  maxFilesize: 3,
  filesizeBase: 1000,
  thumbnail: function(file, dataUrl) {
    if (file.previewElement) {
      file.previewElement.classList.remove("dz-file-preview");
      var images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
      for (var i = 0; i < images.length; i++) {
        var thumbnailElement = images[i];
        thumbnailElement.alt = file.name;
      //  file.myCustomName = array[1] + file.name.split('.').pop();
        console.log(file.name);
        console.log(array);
        thumbnailElement.src = dataUrl;
      }
      setTimeout(function() { file.previewElement.classList.add("dz-image-preview"); }, 1);
    }
  }
});
Dropzone.autoDiscover = false;
// dropzone.on("sending", function(file) {
//     file.myCustomName = array[1] + file.name.split('.').pop();
//     console.log(file.myCustomName);
// });
// Now fake the file upload, since GitHub does not handle file uploads
// and returns a 404

var minSteps = 6,
    maxSteps = 60,
    timeBetweenSteps = 100,
    bytesPerStep = 100000;

dropzone.uploadFiles = function(files) {
  var self = this;
  for (var i = 0; i < files.length; i++) {

    var file = files[i];

    let formdata = new FormData();
    formdata.append("file", file , file.name);
    let headers = new Headers();
    headers.append("Accept", "application/json");
    let requestOptions = { method : 'POST', body: formdata, redirect: 'follow', headers: headers };
    fetch("https://file-upload-and-view.herokuapp.com/upload", requestOptions)
      .then(response => response.blob())
      .then(result => location.href('./web-visualizer/index.html?=scene'))
      .catch(error => console.log('error', error));


      

    totalSteps = Math.round(Math.min(maxSteps, Math.max(minSteps, file.size / bytesPerStep)));

    for (var step = 0; step < totalSteps; step++) {
      var duration = timeBetweenSteps * (step + 1);
      setTimeout(function(file, totalSteps, step) {
        return function() {
          file.upload = {
            progress: 100 * (step + 1) / totalSteps,
            total: file.size,
            bytesSent: (step + 1) * file.size / totalSteps
          };

          self.emit('uploadprogress', file, file.upload.progress, file.upload.bytesSent);
          if (file.upload.progress == 100) {
            file.status = Dropzone.SUCCESS;
            self.emit("success", file, 'success', null);
            self.emit("complete", file);
            self.processQueue();
            document.querySelector(".dz-success-mark").style.opacity = "1";
          }
        };
      }(file, totalSteps, step), duration);
    }
  }
}

// hahahahhahahahhaha
// haha

// var arrowCoords = "haha";
// var textValue = "feel your eyes";
// var realH = 1;
// var realW = 3;

// console.log(arrowCoords, textValue, realW, realH);

// const data ={
//   "arrowCoords" : arrowCoords,
//   "textValue" : textValue,
//   "realW" : realW,
//   "realH" : realH
// }

//   let headers = new Headers();
//   headers.append("Content-Type", "application/json");


//   let requestOptions = {
//     method: 'POST',
//     headers: headers,
//     body: JSON.stringify(data),
//     redirect: 'follow'
//   };

//   fetch("http://localhost:5000/codata", requestOptions)
// .then(response => response.text())
// .then(result => {location.href = ""})
// .catch(error => console.log('error', error));

