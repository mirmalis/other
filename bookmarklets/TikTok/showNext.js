javascript:(
  function(){ 
    document.onkeydown = (ev) => {
      function showNext(shift){
        function getElementToShow(shift) {
          if (window.sdpNextElement == null){
            window.sdpNextElement = document.querySelector(".lazyload-wrapper");
          } else {
            if(shift > 0){
              window.sdpNextElement = window.sdpNextElement.nextElementSibling;
    
            } else if(shift < 0){
              window.sdpNextElement = window.sdpNextElement.previousElementSibling;
            }
            if (window.sdpNextElement === undefined || window.sdpNextElement === null){
              window.sdpNextElement = document.querySelector(".lazyload-wrapper");
            }
          }
          return window.sdpNextElement !== undefined && window.sdpNextElement !== null;
        }
        if(getElementToShow(shift)){
          var y = window.sdpNextElement.getBoundingClientRect().top + window.pageYOffset + -60;
          setTimeout(() => window.scrollTo({top: y, behavior: 'smooth'}), 5);
        } else {
          console.log('Error: could not find next element.')
        }
      }
      switch (ev.key) {
        case "ArrowRight":
          if (document.querySelector(".arrow-right") != null){
            document.querySelector(".arrow-right").click();
          } else {
            showNext(1);
          }
          break;
        case "ArrowLeft":
          if (document.querySelector(".arrow-right") != null){
            document.querySelector(".arrow-right").click();
          } else {
            showNext(-1);
          }
          break;
        case "Home":
          window.sdpNextElement = document.querySelector(".lazyload-wrapper");
          break;
        default:
          break;
      }
    };
  }()
)
