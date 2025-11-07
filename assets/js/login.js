import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
    import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

    const firebaseConfig = {
      apiKey: "YOUR-API-KEY",
      authDomain: "YOU-FIREBASE-DOMAIN",
      projectId: "YOUR-PROJECT-ID",
      storageBucket: "YOUR-STORAGE-DOMAIN",
      messagingSenderId: "YOUR-KEY",
      appId: "YOUR-ID",
      measurementId: "YOUR-ID"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    document.getElementById("googleLogin").addEventListener("click", async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Giriş başarılı:", user.displayName);
        window.location.href = "index.html";
      } catch (error) {
        console.error("Giriş hatası:", error);
        alert("Giriş başarısız. Lütfen tekrar deneyin.");
      }
    });