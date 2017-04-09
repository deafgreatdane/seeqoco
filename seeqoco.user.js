// ==UserScript==
// @name         Seeqoco
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Add some fun to the virtual office space
// @author       ben.johnson@seeq.com
// @match        https://app.sococo.com/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==
var officeSettings = [
    { "email":"ben.johnson@seeq.com" ,
     "room": "room-33",
     "officeDecorations":[
         { "type":"carpet" ,
          "css" : { "background-color":"#cccccc", "background-image":"url(https://deafgreatdane.github.io/images/check_green2.svg)","background-size":"150px"}
         },
         { "type": "furniture",
          "css": {"background-image":"url(https://deafgreatdane.github.io/images/couch.png)",
                  "background-size":"50px",
                  "top": 2,"width": "50px",
                  "height":"80px","left":"8px"}},    
         { "type": "furniture",
          "css": {"background-image":"url(https://deafgreatdane.github.io/images/greatdane.png)",
                  "background-size":"30px",
                  "top": 32,"width": "50px",
                  "height":"30px","left":"20px"}},
          { "type": "furniture",
          "css": {"background-image":"url(https://deafgreatdane.github.io/images/deer.png)",
                  "background-size":"35px",
                  "top": 22,"width": "50px",
                  "height":"80px","left":"120px"}}
     ]
    },
    { "email":"dakota.kanner@seeq.com" ,
     "room": "room-2",
     "officeDecorations": [
         { "type":"carpet" ,
          "westWall":true,
          "css" : { "background-color":"green"}
         }
     ]
    },
    { "email":"vacant corner" ,
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

// /////////////// helper methods for configuration
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

// ///////////////////////////////////////  setup
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
            if ( office.hasOwnProperty('animals')) {
                    var room = $("DIV[data-room-id='" + office.room + "']");
                    var el = $("<div></div>");
                    el.css('position','absolute');
                
            }
        }
    });
    console.log("sqc: done");
}
