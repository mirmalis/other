javascript:(function() {
  let el = document.querySelectorAll("#side-nav-following-see-all")[0];
  if(el){
    if(el.innerHTML === "See more"){
      el.scrollIntoView();
      el.click();
    } else {
      alert("no more");
    }
  }
})();
