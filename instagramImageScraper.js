//imacros-js:showsteps no

/*
Created by Bot Solutions
http://www.bot.solutions
skype: bot.solutions
email: info@bot.solutions
*/

/* global iimGetExtract */

/*Instagram*/ {
    function Instagram() {
        this.url = 'https://www.instagram.com/';
    }

    function InstagramUser (Instagram) {
        this.Instagram = Instagram;

        this.id;
    }

    InstagramUser.prototype = {
        open: function () {
            iimSet('url', this.Instagram.url + this.id);
            return 1 === iimPlay('CODE:filter type=images status=on\nurl goto={{url}}');
        },
        loadMore: function () {
            iimSet('href', '/' + this.id + '/?max_id=*');
            return 1 === iimPlay('CODE:set !timeout_step 1\ntag pos=1 type=a attr=href:{{href}}');
        },
        loadAll: function () {
            var body = window.content.document.body, html = window.content.document.documentElement;
            do {
                var height1 = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
                window.scrollBy(0, height1);
                iimPlay('CODE:wait seconds=1');
                var height2 = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
            } while (height1 !== height2);
            return true;
        },
        getPhotos: function () {
            if (1 === iimPlay('CODE:tag pos=1 type=span attr=id:react-root extract=htm') && iimGetExtract(1) !== '#EANF#') {
                var srcs = iimGetExtract(1).match(/src=".*?"/g);
                for (var i = 1, Photos = []; srcs && i < srcs.length; i++) {
                    var Photo = new InstagramUserPhoto(this);
                    Photo.url = srcs[i].replace(/^src="|"$/g,'');
                    Photos.push(Photo);
                }
                return Photos;
            }
        }
    };

    function InstagramUserPhoto (InstagramUser) {
        this.User = InstagramUser;

        this.url;
    }

    InstagramUserPhoto.prototype = {
        downloadToFolder: function (folder) {
            iimSet('url', this.url);
            iimSet('folder', folder);
            return 1 === iimPlay('CODE:url goto={{url}}\nondownload folder={{folder}} file=*\ntag pos=1 type=img attr=* content=event:saveitem');
        }
    };
}

/*VC*/ {
    var users = prompt('Users to scrape images from:\n(separate with commas)','richbenny,thinkgrowprosper,6amsuccess,millionaire_mentor,motivationmafia,agentsteven,successmessenger,dailymondo,secretstosuccess,big.empire,buildyourempire_,successes,mindsetofexcellence,wordsofsuccess,words_worth_billions,mindsetofgreatness,prosperityquotes,dailydose,businessmindset101,daily_greatness,acheivetheimpossible,hdfmagazine,bangbangmotivation,thegoodquote,thinksmartgrowrich').split(',');
    var folder = prompt('Download folder\n(* means default iMacros download folder\nuse double backslashes as directory separator)', '*');
    
    var Instagram = new Instagram();
    
    for (var i = 0; i < users.length; i++) {
        var User = new InstagramUser(Instagram);
        User.id = users[i];
        User.open();
        if (User.loadMore())
            User.loadAll();
        var Photos = User.getPhotos();
        for (var j = 0; j < Photos.length; j++) {
            Photos[j].downloadToFolder(folder);
        }
    }
    
    iimDisplay('');
    
}