document.addEventListener('DOMContentLoaded', function(){

    const allButtons = document.querySelectorAll('.searchBtn');
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');

    for(var i=0;i < allButtons.length; i++){
        allButtons[i].addEventListener('click',function(){
            searchBar.style.visibility = 'visible';
            searchBar.classList.add('open');
            this.setAttribute('aria-expanded','true');
            searchInput.focus();
        })
    }
    
    searchClose.addEventListener('click',function(){
            searchBar.style.visibility = 'hidden';
            searchBar.classList.remove('open');
            this.setAttribute('aria-expanded','false');
            searchInput.focus();
        })
});

let foxy = document.querySelector('.jumpscare');
foxy.addEventListener('ended',()=>{
    foxy.style.visibility='hidden';
    window.location.replace("/admin");
    }
);



async function fetchAsync (url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}