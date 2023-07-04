javascript:(
    function() {
        let timer = setInterval(() => clickNext(), 100);
        function clickNext(){
            let el = document.querySelectorAll("#side-nav-following-see-all")[0];
            if(el){
              if(el.innerHTML === "See more"){
                el.scrollIntoView();
                el.click();
              } else if(el.innerHTML === "See less"){
                clearInterval(timer);
                alert("no more");
              } else {
                console.log(123);
              }
            }
        }
    }
)();
