javascript:(
  function(){ 
    function showNext(){
      if (window.nextElement === undefined || window.nextElement === null){
        window.nextElement = document.querySelector(".lazyload-wrapper");
      } else {
        window.nextElement = window.nextElement.nextElementSibling;
      }
      if(window.nextElement !== undefined && window.nextElement !== null){
        var doSkip = false;
        if (window.ignoredTikTokChannelsCSV !== undefined && window.ignoredTikTokChannelsCSV !== null){
          doSkip = window.ignoredTikTokChannelsCSV.split(";").some(item => item === window.nextElement.querySelector(".author-uniqueId").textContent);
        }
        if(!doSkip){
          var y = window.nextElement.getBoundingClientRect().top + window.pageYOffset + -60;
          window.scrollTo({top: y, behavior: 'smooth'});
        } else {
          return showNext();
        }
      }
    }
    showNext();
  }()
)
