javascript:(
  function(){
    function clear(){
      Array.from(document.querySelectorAll(".lazyload-wrapper"))
      .filter(item => window.sdpIgnoredArr.some(excludedName => excludedName === item.querySelector(".author-uniqueId")?.textContent))
      .forEach(item => { 
        console.log("Deleting", '"' + item.querySelector(".author-uniqueId")?.textContent + "\"'s content ", item.querySelector(".item-video-card-wrapper").getAttribute("href"));
        item.remove(); 
      });
    }
    if(window.sdpClearInterval !== undefined && window.sdpClearInterval !== null){
      window.sdpClearInterval = clearInterval(window.sdpClearInterval);
      alert("clearing stopped");
      window.sdpIgnoredArr = undefined;
    } else {
      alert("clearing now active");
      window.sdpIgnoredArr = "homm9k;cia.haris;paulytepouu;_girls.only_60;itzshauni;sex.ed.lt;crafty_emily1;artis_maks;brigapo;salta_arbatele;zania_077;celinaspookyboo;kira_smrn;mr.begedis;kallmekris;kitsy.lt;o.domas;youneszarou;_magzon;demiinooo".split(";");
      window.sdpClearInterval = setInterval(clear, 1000);
    }
  }()
)
