javascript:(
  function(){ 
    (async function(){
      async function GraphQL(query, data){
        let body = {
          "query": query,
          "variables": data
        };
        var f = await fetch('http://localhost:4000', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        var x = await f.json();
        return x;
       }
      async function EnsureUser(){
        const channelInfo = `
        {
          TikTokID
          Handle
          Videos {
            TikTokID
            State
          }
        }
        `;
        async function CreateUser(userID, userHandle){
          var res = await GraphQL(
            `mutation($input: [TikTokChannelCreateInput!]!) {
              createTikTokChannels(input: $input) {
                tikTokChannels ${channelInfo}
              }
            }
            `, 
            {
              "input": [
                {
                  "TikTokID": userID,
                  "Handle": userHandle,
                }
              ]
            }
            );
            let channels = await res.data.createTikTokChannels.tikTokChannels;
            return channels[0];
        }
        async function UpdateUser(userID, userHandle){
          throw("Not implemented, should be called if handle changes, possible if other data changes");
        }
        let userID = Array.from(document.querySelectorAll("meta")).filter(item => item.content.match(/snssdk/)).map(item => item.content.match(/profile\/(\d*)/)[1])[0];
        let userHandle = document.location.href.match(/@([^?\/]*)/)[1];
        let res = await GraphQL(`query {
          tikTokChannels(where: {TikTokID:"${userID}"}) ${channelInfo}
        }`,null);
        switch (res.data.tikTokChannels.length) {
          case 0:
            return await CreateUser(userID, userHandle);
          case 1:
            let user = res.data.tikTokChannels[0];
            if(user.Handle != userHandle){
              user = await UpdateUser();
            }
            return user;
          default:
            throw(`More than one TikTokChannel with same TikTokID ${userID}`);
        }
      }
      async function PostVideos(user){
        function textToNumber(text){
          if (!text)
            return null;
          var unit;
          text = text.toLowerCase();
          if(text.match("k")){
            unit = 1000;
          } else if (text.match("m")){
            unit = 1000*1000;
          } else if (text.match("b")){
            unit = 1000*1000*1000;
          } else if (text.match("t")){
            unit = 1000*1000*1000*1000;
          } else {
            unit = 1;
          }
          let base = parseFloat(text.match(/\d*(\.\d*)?/)[0]);
          return {value: Math.floor(base*unit), specificity: unit};
        }
        if (!user){
          throw("User is required for PostVideos method.");
        }
        console.log("Posting videos");
        let videos = Array.from(document.querySelectorAll(".video-feed-item-wrapper"))
          .map(item => { return {
            "TikTokID": item.href.match(/video\/(\d*)/)[1],
            "Description":null,
            "State": "Public",
            "Views": textToNumber(item.querySelector(".video-count")?.innerText)?.value
          }});
        let count = videos.length;
        let existingVideoIDs = user.Videos.map(item => item.TikTokID);
        let i = 0;
        videos.forEach((item, index) => {
          if(existingVideoIDs.includes(item.TikTokID)){
            console.log("Video already exist.");
          } else {
            setTimeout(function () {
              console.log(`(${index+1}/${count}) Creating Video {TikTokID:"${item.TikTokID}"}`);
              GraphQL(
                `mutation($input: [TikTokVideoCreateInput!]!){
                  createTikTokVideos(input: $input) {
                    tikTokVideos {
                      TikTokID
                    }
                  }
                }`,
                {
                  "input": [{
                    "TikTokID": item.TikTokID, 
                    "State": item.State, 
                    "Description": item.Description, 
                    "Views": item.Views,
                    "Uploader":{ 
                      "connect":{
                        "where":{
                          "node": {
                            "TikTokID":user.TikTokID
                          }
                        }
                      }
                    }
                  }]
                }
                );
              }, i++ * 100);
            };
            });
          }
      let user = await EnsureUser();
      console.log(user);
      let videos = await PostVideos(user);
    })()
  }()
)
