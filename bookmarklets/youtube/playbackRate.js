javascript:(
  function(){
    var player = document.querySelector("video");

    if (player != null){
      var newSpeed = Number(prompt("Set video speed (0 - 16]", player.playbackRate)); 
      if (newSpeed != null && newSpeed > 0){
          player.playbackRate = newSpeed; 
      }
    } else {
      console.log("Did not find video player.");
    }
  }()
)