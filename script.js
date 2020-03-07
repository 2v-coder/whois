$( document ).ready(function() {
   var loadingTitle = document.getElementById('loadingScreen');
   var mainContent = document.getElementById('mainScreen');

//  loadingTitle.css({
//     "position":"absolute",
//     "bottom": $(document).width() * 25 / 100
// });

const imageUpload = document.getElementById('imageUpload')
Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('https://raw.githubusercontent.com/2v-coder/whois/master/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('https://raw.githubusercontent.com/2v-coder/whois/master/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('https://raw.githubusercontent.com/2v-coder/whois/master/models')
]).then(start)

async function start() {

  const container = document.createElement('div')
  container.style.position = 'relative'
  document.body.append(container)
  const labeledFaceDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
  let image
  let canvas
  var screen10Percent = $(document).width() * 25 / 100; 
  loadingTitle.style.display = "none";
  mainContent.style.display = "block";
  console.log('Loaded')

  document.getElementById("snap").addEventListener("click", async () => {
        const displaySize = { width: video.width, height: video.height }
                   // if (image) image.remove()
    // if (canvas) canvas.remove()
    
    // image = await faceapi.detectAllFaces(video)
    // image.style.width = screen10Percent + "px";
    // image.style.height = screen10Percent + "px";
    //container.append(image)
    //canvas = faceapi.createCanvasFromMedia(image)
    //container.append(canvas)

    // faceapi.matchDimensions(canvas, displaySize)
    const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    

    // After finding do:
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box
      const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
      var msg = "Person is Not Found in server";
      var main = document.createElement("div");
      var res = result.toString().substring(0, 7);
      var resultion = result.toString().slice(0, -6)
      if(res == "unknown") {
         var para = document.getElementById("personName").textContent = msg;
      }
      else {
        // var img = document.createElement('img').setAttribute("src", "https://github.com/2v-coder/whois/labels/" + resultion + "/1.jpg");
        var para = document.getElementById("personName").textContent = resultion;
        // para.href='http://google.com/search?q=' + resultion + " wikipedia";
        // para.appendChild(node);
        // main.appendChild(para);

      }
      var element = document.getElementById("resultsSection");
      element.appendChild(main);
      console.log(resultion)
      var resultionSection = document.getElementById("resultsPage");
      mainContent.style.display = "none";
      resultionSection.style.display = "block";
      //window.open('http://google.com/search?q=' + result.toString() + " wikipedia");
      // drawBox.draw(canvas)

    })
      
    // end
  })
    // context.drawImage(video, 0, 0, 640, 480);
}

//   imageUpload.addEventListener('change', async () => {
//     if (image) image.remove()
//     if (canvas) canvas.remove()
//     image = await faceapi.bufferToImage(imageUpload.files[0])
//     image.style.width = screen10Percent + "px";
//     image.style.height = screen10Percent + "px";
//     container.append(image)
//     canvas = faceapi.createCanvasFromMedia(image)
//     container.append(canvas)
//     const displaySize = { width: image.width, height: image.height }
//     faceapi.matchDimensions(canvas, displaySize)
//     const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
//     const resizedDetections = faceapi.resizeResults(detections, displaySize)
//     const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    
//     // After finding do:
//     results.forEach((result, i) => {
//       const box = resizedDetections[i].detection.box
//       const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
//       var para = document.createElement("p");
//       var node = document.createTextNode("Found " + detections.length + " faces")
//       para.appendChild(node);
//       var element = document.getElementById("resultsSection");
//       element.appendChild(para)
//       //window.open('http://google.com/search?q=' + result.toString() + " wikipedia");
//       // drawBox.draw(canvas)

//     })
//     // end
//   })
// }

function loadLabeledImages() {
  const labels = ['Brad Pitt', 'Chris Evans', 'Chris Hamsworth', 'Don Cheadle', 'Jeremy Renner', 'Johnny Depp', 'Leonardo DiCaprio', 'Mark Ruffalo', 'Robert Downey Jr', 'Scarlett Johansson', 'Will Smith', 'Tom Holland', 'Dwayne Johnson', 'Jackie Chan', 'Adam Sandler']
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/2v-coder/whois/master/labels/${label}/${i}.jpg`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}
});
