const errorMessage = new URLSearchParams(window.location.search).get('error');

if (errorMessage == 1) {
  document.getElementById("authTip").style.display = "block";
  document.getElementById("authTip").innerHTML = "Invalid Login Credentials";
}

document.getElementsByClassName("loginForm")[0].addEventListener("submit", (e) => {
  if (document.getElementById("userID").value.trim() != '' || document.getElementById("password").value.trim()!='') {
    return true;
  }
  e.preventDefault();
  document.getElementById("authTip").style.display = "block";
  document.getElementById("authTip").innerHTML = "Fields cannot be blank/whitespace";
  document.getElementById("userID").value = "";
  document.getElementById("password").value = "";
  return false
});