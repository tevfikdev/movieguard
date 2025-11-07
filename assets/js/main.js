import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
  import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
  import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "YOUR-API-KEY",
    authDomain: "YOUR-FIREBASE-DOMAIJ",
    projectId: "YOUR-PEOJECT-ID",
    storageBucket: "YOU-STORAGE-DOMAIN",
    messagingSenderId: "14464023705",
    appId: "YOUR-APP-ID"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // 🔐 Kullanıcı kontrolü
  onAuthStateChanged(auth, user => {
    if (user) {
      document.getElementById("userName").textContent = user.displayName || "Kullanıcı";
    } else {
      window.location.href = "login.html";
    }
  });

  // Menü aç/kapat
  document.getElementById("userMenu").addEventListener("click",()=>{
    const d=document.getElementById("dropdownMenu");
    d.style.display=d.style.display==="flex"?"none":"flex";
  });
  document.addEventListener("click",e=>{
    if(!document.getElementById("userMenu").contains(e.target))
      document.getElementById("dropdownMenu").style.display="none";
  });

  // 🚪 Çıkış
  document.getElementById("logoutBtn").addEventListener("click",async()=>{
    await signOut(auth);
    window.location.href="login.html";
  });

  const API_KEY="YOUR-THEMOVIEDB-API-KEY";

  // 🎥 Rastgele içerik çek
  async function fetchMovies(){
    const type=document.getElementById("type").value||"movie";
    const genre=document.getElementById("genre").value;
    const country=document.getElementById("country").value;
    const year=document.getElementById("year").value;
    const count=document.getElementById("count").value||10;
    const page=Math.floor(Math.random()*30)+1; // daha geniş rastgelelik

    const url=`https://api.themoviedb.org/3/discover/${type}?api_key=${API_KEY}&language=tr-TR&sort_by=popularity.desc&page=${page}${genre?`&with_genres=${genre}`:""}${year?`&primary_release_year=${year}`:""}${country?`&with_origin_country=${country}`:""}`;

    try{
      const res=await fetch(url);
      const data=await res.json();
      if(!data.results) throw new Error("TMDB verisi alınamadı.");
      renderMovies(data.results.slice(0,count));
    }catch(err){
      document.getElementById("posters").innerHTML="❌ İçerik yüklenemedi.";
      console.error(err);
    }
  }

  // ⭐ Watchlist ekleme
  async function addToWatchlist(movie,icon){
    const user=auth.currentUser;
    if(!user) return alert("Giriş yapmalısın!");
    try{
      const fullMovie={
        id:movie.id,
        title:movie.title||movie.name,
        url:`https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        year:(movie.release_date||movie.first_air_date||"").split("-")[0],
        addedAt:new Date().toISOString()
      };
      await setDoc(doc(db,"watchlist",`${user.uid}_${movie.id}`),fullMovie);
      icon.classList.add("added");
    }catch(e){console.error(e);}
  }

  // 🎞️ Film kartlarını oluştur
  function renderMovies(movies){
    const posters=document.getElementById("posters");
    posters.innerHTML="";
    movies.forEach(movie=>{
      if(!movie.poster_path) return;
      posters.innerHTML+=`
        <div class="card">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="">
          <div class="rating">⭐ ${movie.vote_average?.toFixed(1)||"?"}</div>
          <i class="fa-solid fa-star watchlist-icon" data-id="${movie.id}" title="İzleme listeme ekle"></i>
          <div class="meta">${movie.title||movie.name}</div>
        </div>`;
    });

    document.querySelectorAll(".watchlist-icon").forEach(icon=>{
      icon.addEventListener("click",()=>{
        const movie=movies.find(m=>m.id==icon.dataset.id);
        addToWatchlist(movie,icon);
      });
    });
  }

  // 🔘 Butonlar
  document.getElementById("get").addEventListener("click",fetchMovies);
  document.getElementById("shuffle").addEventListener("click",fetchMovies);
  document.getElementById("searchBtn").addEventListener("click",async()=>{
    const q=document.getElementById("searchBox").value.trim();
    if(!q) return;
    const res=await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=tr-TR&query=${encodeURIComponent(q)}`);
    const data=await res.json();
    renderMovies(data.results||[]);
  });