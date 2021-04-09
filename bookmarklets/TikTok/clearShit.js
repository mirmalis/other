javascript:(
  function(){
    function isValid(post){
      function linkTexts(post){
        return Array.from((post.querySelector(".tt-video-meta-caption")?.querySelectorAll("a") ?? []))
          ?.map(item => item?.textContent?.trim());
      }
      if (post == null)
        return true;
      return !(linkTexts(post).some(item => window.sdpIgnoredArrDescLinks.some(x => x === item)) || 
      window.sdpIgnoredArr.some(excludedName => excludedName === post.querySelector(".author-uniqueId")?.textContent))
    }
    function clear(){
      Array.from(document.querySelectorAll(".lazyload-wrapper"))
      .filter(post => !isValid(post))
      .forEach(item => { 
        console.log("Deleting", '"' + item.querySelector(".author-uniqueId")?.textContent + "\"'s content ", item?.querySelector(".item-video-card-wrapper")?.getAttribute("href"));
        item.remove();
      });
    }
    if(window.sdpClearInterval !== undefined && window.sdpClearInterval !== null){
      clearInterval(window.sdpClearInterval);
      alert("clearing stopped");
      delete window.sdpClearInterval;
      delete window.sdpIgnoredArr;
      delete window.sdpIgnoredArrDescLinks;
    } else {
      alert("clearing now active");
      window.sdpIgnoredArr = "homm9k;cia.haris;paulytepouu;_girls.only_60;itzshauni;sex.ed.lt;crafty_emily1;artis_maks;brigapo;salta_arbatele;zania_077;celinaspookyboo;kira_smrn;mr.begedis;kallmekris;kitsy.lt;o.domas;youneszarou;_magzon;demiinooo".split(";");
      window.sdpIgnoredArrDescLinks = "".split(";");
      window.sdpClearInterval = setInterval(clear, 1000);
    }
  }()
)
