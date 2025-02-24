import { auth } from "./firebase.js";
import { signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

const signInBttn = document.getElementById('signIn');
if (!signInBttn) {
  console.error("Sign In button not found in the DOM.");
}

const sw = new URL('service-worker.js', import.meta.url);
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(sw.href, { scope: '/' })
    .then(() => console.log('Service Worker Registered for scope:', sw.href))
    .catch(err => console.error('Service Worker Error:', err));
}

function signIn() {
  console.log("Sign in initiated.");
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("Sign in successful:", result.user);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      localStorage.setItem("email", JSON.stringify(user.email));
      console.log("Redirecting to habits.html");
      window.location.href = "habits.html";
    })
    .catch((error) => {
      console.error("Error during sign in:", error);
    });
}

signInBttn.addEventListener("click", function(event) {
  console.log("Sign In button clicked.");
  signIn();
});
