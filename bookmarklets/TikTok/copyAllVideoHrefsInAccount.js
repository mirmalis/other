javascript:(
  function(){
    function copyToClipboard(str){
      console.log(str);
      const el = document.createElement('textarea');
      el.value = str;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    };
    copyToClipboard(
      Array.from(
        document.querySelectorAll("[data-e2e=user-post-item] a")
      ).map(item => item.getAttribute("href"))
      .join("\n")
    );
  }()
)
