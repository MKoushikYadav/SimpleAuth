const errorMessage = new URLSearchParams(window.location.search).get('error');

if (errorMessage == 1) {
  document.getElementById("authTip").style.display = "block";
}
