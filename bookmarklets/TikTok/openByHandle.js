javascript:(
  function(){ 
    var handle = prompt("Enter tiktok handle");
    if (handle !== "" && handle !== null){
      window.open("https://www.tiktok.com/@" + handle + "?lang=en"); 
    }
  }()
)
