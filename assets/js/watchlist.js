import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
  import { getFirestore, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

  // 🔥 Firebase Config
  const firebaseConfig = {
    apiKey: "YOUR-FIREBASE-API-KEY",
    authDomain: "YOUR-DOMAIN",
    projectId: "YOUR-PROJECT-ID",
    storageBucket: "YOUR-STORAGE-DOMAIN",
    messagingSenderId: "YOUR-KEY",
    appId: "YOUR-APP-ID",
    measurementId: "YOUR-ID"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const container = document.getElementById('watchlist');
  const watchlistRef = collection(db, "watchlist");

  // 🔽 Firestore'dan verileri çek
  async function loadWatchlist() {
    container.innerHTML = "🎬 Liste yükleniyor...";
    try {
      const snapshot = await getDocs(watchlistRef);
      if (snapshot.empty) {
        container.innerHTML = "<p>Henüz hiç ekleme yapmadın 🎞️</p>";
        return;
      }

      container.innerHTML = "";
      snapshot.forEach(docu => {
        const p = docu.data();
        container.innerHTML += `
          <div class="card">
            <button class="remove" data-id="${docu.id}">✖</button>
            <img src="${p.url || p.poster_path || 'https://via.placeholder.com/300x450?text=No+Poster'}" alt="${p.title}">
            <div class="meta">${p.title || "Bilinmeyen Başlık"} (${p.year || "?"})</div>
          </div>
        `;
      });

      // ❌ Kaldırma butonu
      document.querySelectorAll('.remove').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id;
          await deleteDoc(doc(db, "watchlist", id));
          loadWatchlist(); // sayfayı yenilemeden güncelle
        });
      });

    } catch (err) {
      container.innerHTML = "<p>🚫 Hata oluştu: " + err.message + "</p>";
      console.error(err);
    }
  }

  loadWatchlist();