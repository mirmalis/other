javascript: (
  function () {
    function httpGetAsync(theUrl, callback) {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          callback(xmlHttp.responseText);
        }
      };
      xmlHttp.open("GET", theUrl, true);
      xmlHttp.send(null);
    };
    function clear() {
      function isValid(post) {
        function linkTexts(post) {
          return Array.from((post.querySelector(".tt-video-meta-caption")?.querySelectorAll("a") ?? []))?.map(item => item?.textContent?.trim());
        }
        if (post == null)
          return true;
        return !(
          linkTexts(post)
            .some(item => window.sdpIgnoredArrDescLinks
              .some(x => x === item)
            ) ||
            window.sdpIgnoredArr.some(excludedName => excludedName === post.querySelector(".author-uniqueId")?.textContent)
        )
      };
      Array.from(document.querySelectorAll(".lazyload-wrapper"))
        .filter(post => !isValid(post))
        .forEach(item => {
          console.log("Deleting", '"' + item.querySelector(".author-uniqueId")?.textContent + "\"'s content ", item?.querySelector(".item-video-card-wrapper")?.getAttribute("href"));
          item.remove();
        })
      ;
    };
    if (window.sdpClearInterval == null) {
      clearInterval(window.sdpClearInterval);
      alert("clearing stopped");
      delete window.sdpClearInterval;
      delete window.sdpIgnoredArr;
      delete window.sdpIgnoredArrDescLinks;
    } else {
      httpGetAsync("https://gist.githubusercontent.com/mirmalis/2f7705b23d2e3a7fb62d8e9f55bae910/raw/", (data) => window.sdpIgnoredArr = data.split(";"));
      httpGetAsync("https://gist.githubusercontent.com/mirmalis/990e8bdd7a1a9e3064967b762a183c2c/raw/", (data) => window.sdpIgnoredArrDescLinks = data.split(";"));
      alert("clearing now active");
      window.sdpClearInterval = setInterval(clear, 1000);
    }
  }()
)
