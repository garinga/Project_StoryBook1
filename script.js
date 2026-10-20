document.addEventListener("DOMContentLoaded",()=>{
  const body=document.body;
  const coverPhotos={1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:10,11:11,12:12,13:13,14:14,15:15,16:16,17:17,18:18,19:19,20:20,21:21,22:2,23:23,24:15,25:14,26:29,27:30,28:31,29:32,30:33};
  function usePhotoWhenAvailable(image, photoNumber, prefix=""){
    if(!photoNumber)return;
    const fallback=image.getAttribute("src");
    image.addEventListener("error",()=>{image.src=fallback;},{once:true});
    image.src=`${prefix}images/covers/kk${photoNumber}.jpg`;
  }
  const savedTheme=localStorage.getItem("dramaverse-theme");
  if(savedTheme==="dark") body.classList.add("dark");
  document.querySelectorAll(".theme-toggle").forEach(btn=>btn.addEventListener("click",()=>{
    body.classList.toggle("dark");
    localStorage.setItem("dramaverse-theme",body.classList.contains("dark")?"dark":"light");
  }));
  document.querySelectorAll(".like-button").forEach(btn=>btn.addEventListener("click",()=>{
    btn.classList.toggle("liked");
    if(btn.classList.contains("small-like")) btn.textContent=btn.classList.contains("liked")?"♥":"♡";
    else btn.textContent=btn.classList.contains("liked")?"♥ Liked":"♡ Like this story";
  }));
  const search=document.getElementById("search-input"), filter=document.getElementById("genre-filter");
  const cards=[...document.querySelectorAll(".book-card")], count=document.getElementById("result-count"), noResults=document.getElementById("no-results");
  cards.forEach(card=>{
    const index=card.querySelector(".details-trigger")?.dataset.index;
    const image=card.querySelector(".cover-button img");
    if(index&&image){
      usePhotoWhenAvailable(image,coverPhotos[index]);
      image.alt=`${card.querySelector("h3")?.textContent||"Story"} cover`;
    }
  });
  if(filter){
    const genres=[...new Set(cards.flatMap(card=>(card.querySelector(".book-genre")?.textContent||"").split("•").map(genre=>genre.trim()).filter(Boolean)))].sort((a,b)=>a.localeCompare(b));
    filter.replaceChildren(new Option("All genres","all"),...genres.map(genre=>new Option(genre,genre)));
  }
  function applyFilters(){
    if(!cards.length)return;
    const q=(search?.value||"").trim().toLowerCase(), genre=filter?.value||"all"; let shown=0;
    cards.forEach(card=>{
      const title=card.dataset.title||"", cardGenres=(card.querySelector(".book-genre")?.textContent||"").split("•").map(item=>item.trim().toLowerCase());
      const genreMatch=genre==="all"||cardGenres.includes(genre.toLowerCase());
      const textMatch=title.includes(q)||card.textContent.toLowerCase().includes(q);
      const visible=genreMatch&&textMatch;card.hidden=!visible;if(visible)shown++;
    });
    if(count)count.textContent=`${shown} book${shown===1?"":"s"}`;
    if(noResults)noResults.hidden=shown!==0;
  }
  search?.addEventListener("input",applyFilters);filter?.addEventListener("change",applyFilters);
  const dialog=document.getElementById("book-dialog");
  const storyCover=document.querySelector(".story-cover");
  const storyCoverIndex=storyCover?.getAttribute("src")?.match(/cover-(\d+)\.svg$/)?.[1];
  if(storyCover&&storyCoverIndex){
    usePhotoWhenAvailable(storyCover,coverPhotos[storyCoverIndex],"../");
    storyCover.alt=`Cover image for ${document.querySelector(".story-heading h1")?.textContent||"this story"}`;
  }
  const heroImage=document.querySelector(".hero-art>img");
  if(heroImage)usePhotoWhenAvailable(heroImage,coverPhotos[14]);
  if(dialog){
    document.querySelectorAll(".details-trigger").forEach(btn=>btn.addEventListener("click",()=>{
      const card=btn.closest(".book-card"), index=btn.dataset.index;
      const dialogCover=document.getElementById("dialog-cover");
      dialogCover.src=`images/covers/cover-${index}.svg`;
      usePhotoWhenAvailable(dialogCover,coverPhotos[index]);
      dialogCover.alt=`${card.querySelector("h3")?.textContent||"Story"} cover`;
      document.getElementById("dialog-title").textContent=card.querySelector("h3").textContent;
      document.getElementById("dialog-genre").textContent=card.querySelector(".book-genre").textContent;
      document.getElementById("dialog-synopsis").textContent=card.querySelector(".book-info>p:not(.book-genre)").textContent;
      document.getElementById("dialog-read").href=`stories/story-${index}.html`;
      dialog.showModal();
    }));
    dialog.querySelector(".dialog-close")?.addEventListener("click",()=>dialog.close());
    dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
  }
  const storyContent=document.querySelector(".story-content"), bar=document.querySelector(".reading-progress span"), label=document.querySelector(".progress-label");
  if(storyContent&&bar){
    const update=()=>{const rect=storyContent.getBoundingClientRect(), total=storyContent.offsetHeight-window.innerHeight;let progress=total<=0?100:Math.min(100,Math.max(0,(-rect.top)/(total)*100));bar.style.width=progress+"%";if(label)label.textContent=`Reading progress: ${Math.round(progress)}%`;};
    window.addEventListener("scroll",update,{passive:true});update();
  }
  document.querySelector(".progress-button")?.addEventListener("click",e=>{e.currentTarget.textContent="✓ Marked as read";e.currentTarget.classList.add("liked");});
});