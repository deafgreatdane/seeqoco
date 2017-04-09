// ==UserScript==
// @name         Seeqoco
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Doing things better
// @author       You
// @match        https://app.sococo.com/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @require https://cdn.jsdelivr.net/lodash/4.17.4/lodash.min.js
// @require https://cdn.jsdelivr.net/lodash/4.17.4/lodash.core.min.js
// @require https://cdn.jsdelivr.net/lodash/4.17.4/lodash.fp.min.js
// ==/UserScript==
var officeSettings = [
    { "email":"ben.johnson@seeq.com" ,
     "room": "room-33",
     "officeDecorations":[
         { "type":"carpet" ,
          "css" : { "background-color":"#cccccc", "background-image":"url(http://127.0.0.1:8080/check_green2.svg)","background-size":"150px"}
         },
         { "type": "furniture",
          "css": {"background-image":"url(http://127.0.0.1:8080/foo_burned.png)",
                  "background-size":"50px",
                  "top": 2,"width": "50px",
                  "height":"80px","left":"8px"}},
         
          { "type": "furniture",
          "css": {"background-image":"url(http://127.0.0.1:8080/mature.png)",
                  "background-size":"35px",
                  "top": 2,"width": "50px",
                  "height":"80px","left":"120px"}}


     ],
     "roomCss2": {
         "background-color":"blue"
     }
    },
    { "email":"dakota.kanner@seeq.com" ,
     "room": "room-2",
     "officeDecorations": [
         { "type":"carpet" ,
          "westWall":true,
          "css" : { "background-color":"green"}
         }
     ],
     "roomTweaks": ["leftWall"],
     "roomCss2": {
         "background-color":"yellow"
     }
    },
    { "email":"vacant cornr" ,
     "room": "room-38",
     "officeDecorations": [
         { "type":"carpet" ,
          "westWall":true,
          "southWall":true,
          "css" : { "background-color":"green"}
         }
     ]
    }
];
var roomDecorations = {
    carpet: function(roomEl, roomConfig, el, options) {
        var width = roomEl.width() -5;
        var height = roomEl.height() -5;
        var top = 5;
        var left = 0;
        if ( options.hasOwnProperty('westWall')) {
            left += 3;
            width += -3;
        }
        if ( options.hasOwnProperty('southWall')) {
            height += -3;
        }
        el.width(width);
        el.height(height);
        el.css('left',left);
        el.css('top',top);
    },
    furniture: function(roomEl, roomConfig, el, options) {
        var newCss = { top: 0, left: 0, "background-repeat":"no-repeat"};
        _.extend(newCss, options);
        newCss.top += 5;
        el.css(newCss);
    }
};
$(function() {
    window.setTimeout(waitToLoad,3000);
});

function waitToLoad() {
    console.log("sqc: checking load");
    var room = $("DIV[data-room-id='room-1']");
    if ( room.height() <= 0 ) {
        window.setTimeout(waitToLoad,1000);
        return;
    }
    tweakThings();

}
function tweakThings() {
    _.forEach(officeSettings, function(office) {
        console.log("sqc: " +office.email);
        if ( office.hasOwnProperty('room') ) {
            if ( office.hasOwnProperty('officeDecorations') ) {
                _.forEach(office.officeDecorations.reverse(), function(deco) {
                    var room = $("DIV[data-room-id='" + office.room + "']");
                    var el = $("<div></div>");
                    el.css('position','absolute');
                    el.width(20);
                    el.height(20);
                    if ( roomDecorations.hasOwnProperty(deco.type)) {
                        roomDecorations[deco.type](room, office, el, deco);
                    }
                    if( deco.hasOwnProperty('css')) {
                        el.css(deco.css);
                    }
                    room.prepend(el);
                });
            }
            if ( office.hasOwnProperty('roomCss') ) {
                var room = $("DIV[data-room-id='" + office.room + "']");
                var position = room.position();
                room.css(office.roomCss);
                // normal room is width 60, height 70
                room.css({ "margin-top":4});
                room.height( room.height() -4);
                room.width( room.width() -4);


                _.forEach(office.roomTweaks, function(tweak) {
                    if ( tweak == "leftWall") {
                        room.css({ "margin-left":2});
                        room.width( room.width() -2);
                    }
                });
            }
        }
    });
    console.log("sqc: done");

}
