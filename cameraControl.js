var gum = mode => 
  navigator.mediaDevices.getUserMedia({video: {facingMode: {exact: mode}}})
  .then(stream => (video.srcObject = stream))
  .catch(e => log(e));

var stop = () => video.srcObject && video.srcObject.getTracks().forEach(t => t.stop());

var log = msg => div.innerHTML += msg + "<br>";

function cls() {
	  var resultionSection = document.getElementById("resultsPage");
	  var mainContent = document.getElementById('mainScreen');
      mainContent.style.display = "block";
      resultionSection.style.display = "none";
}
