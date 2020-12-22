javascript:(
  function(){ 
    var player  = document.querySelector("video");
    if (player != null){
      var newVolume = prompt("Set volume [0 - 1000]", player.volume*1000); 
      if (newVolume != null && newVolume >= 0 && newVolume <= 1000){ 
        player.muted = false;
        player.volume = newVolume/1000; 
      } 
    } else {
      console.log("Did not find video player.");
    }
  }()
)
