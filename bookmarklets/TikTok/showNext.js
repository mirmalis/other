javascript:(
  function(){ 
    function showNext(){
      function getNextElement() {
        if (window.nextElement === undefined || window.nextElement === null){
            window.nextElement = document.querySelector(".lazyload-wrapper");
        } else {
            window.nextElement = window.nextElement.nextElementSibling;
        }
        return window.nextElement !== undefined && window.nextElement !== null;
      }
      if(getNextElement()){
        var y = window.nextElement.getBoundingClientRect().top + window.pageYOffset + -60;
        window.scrollTo({top: y, behavior: 'smooth'});
      } else {
        console.log('Error: could not find next element.')
      }
    }
    showNext();
  }()
)
