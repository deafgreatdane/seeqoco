// ==UserScript==
// @name         Seeqoco
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  Add some fun to the virtual office space
// @author       ben.johnson@seeq.com
// @match        https://app.sococo.com/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

var ooo = [ 
    //{email:"jason.rust@seeq.com", summary: "PTO"} 
];
var officeSettings = [
    { "email":"ben.johnson@seeq.com" ,
     "room": "room-33",
     "officeDecorations":[
         { "type":"carpet" ,
          "css" : { "background-color":"#cccccc", "background-image":"url(https://deafgreatdane.github.io/seeqoco/images/check_green2.svg)","background-size":"150px"}
         },
         { "type": "furniture",
          "css": {"background-image":"url(https://deafgreatdane.github.io/seeqoco/images/couch.png)",
                  "background-size":"50px",
                  "top": 2,"width": "50px",
                  "height":"80px","left":"8px"}},
         { "type": "furniture",
          "css": {"background-image":"url(https://deafgreatdane.github.io/seeqoco/images/deer.png)",
                  "background-size":"35px",
                  "top": 22,"width": "50px",
                  "height":"80px","left":"120px"}}
     ],
     animals: {
         pets: [ { "name":"costner",
                  "url":"https://deafgreatdane.github.io/seeqoco/images/greatdane.png"
                 }
               ]
     }
    },
    {"email":"jason.rust@seeq.com",
     "room":"room-19"},
    { "email":"dakota.kanner@seeq.com" ,
     "room": "room-2",
     animals: { },
     "officeDecorations": [
         { "type":"carpet" ,
          "westWall":true,
          "css" : { "background-color":"green"}
         }
     ]
    },
    { "email":"vacant corner" ,
     "room": "room-38",
     animals: {},
     "officeDecorations": [
         { "type":"carpet" ,
          "westWall":true,
          "southWall":true,
          "css" : { "background-color":"green"}
         }
     ]
    },
    {email: "lobby",
     "name":"Lobby",
     "room":"room-1",
     animals:{foo:1}},
    {email:'kitchen',
     name:"Kitchen",
     room:"room-7",
     animals:{foo:1}
    }
];

function SeeqocoAnimals() {
    this.animalHangouts = [];
    // the max number of seconds a pet will hangout in one room.
    // they'll always visit at least 1/2 this time
    this.hangoutDuration = 10;
}
SeeqocoAnimals.prototype.deferredMove = function(petEl, pet) {
    if ( pet.wanderlust == 0 ) {
        return;
    }
    var self = this;
    var retval = function() {
        var roomNumber = Math.floor(Math.random()* seeqoco.animals.animalHangouts.length);
        seeqoco.animals.animalHangouts[roomNumber].prepend(petEl);
        self.deferredMove(petEl,pet);
    };

    var stayStill = (1 + Math.random())/2 * this.hangoutDuration * 1000;
    window.setTimeout(retval,stayStill);
};
SeeqocoAnimals.prototype.setupRoom = function(office,beforeElement) {
    if ( ! office.hasOwnProperty('animals')) {
        return;
    }
    var el = $("<div></div>");
    el.css({'position':'absolute','width':60,'height':25, top: 45});
    this.animalHangouts[this.animalHangouts.length] = el;

    if ( office.animals.hasOwnProperty('pets')) {
        _.forEach(office.animals.pets, function(pet) {
            if ( ! pet.hasOwnProperty('wanderlust')) {
                pet.wanderlust = 2;
            }
            var petEl = $("<img>");
            this.deferredMove(petEl,pet);
            petEl.prop('src',pet.url);
            petEl.prop('title',pet.name);
            petEl.prop('width','25');
            petEl.prop('height','25');
            el.prepend(petEl);
        },this);
    }
    beforeElement.before(el);
};

function Seeqoco() {
    // the list of rooms that allow animals
    this.animals = new SeeqocoAnimals();
    this.ooo = {};
    this.newOffice = function(office) {
        console.log("sqc: S " +office.email);
        if ( office.hasOwnProperty('room') ) {
            var room = $("DIV[data-room-id='" + office.room + "']");
            var firstChild = room.find(":first-child");
            if ( office.hasOwnProperty('officeDecorations') ) {
                _.forEach(office.officeDecorations, function(deco) {
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
                    firstChild.before(el);
                });
            }
            this.animals.setupRoom(office,firstChild);
            if ( this.ooo.hasOwnProperty(office.email)) {
                var el = $("<div></div>");
                el.css('position','absolute');
                el.text(this.ooo[office.email]);
                el.css({left: 5, width: 50, height: 40, top: 10, backgroundColor: "white", opacity: "50%", color: "red", fontSize: "10px", textAlign: "center"});
                firstChild.before(el);
            }
        }
    };

    this.initDone = false;

    this.primarySetup = function() {
        // var oooRooms = {};
        for ( var i = 0 ; i < ooo.length ; i ++ ) {
            this.ooo[ooo[i].email] = ooo[i].summary;
        }
        if ( this.initDone) {
            return;
        } 
        this.initDone = true;
        _.forEach(officeSettings, this.newOffice, this);
        console.log("sqc: done");
    };

    return this;
};

var seeqoco = new Seeqoco();
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
        el.css('z-index',0);
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
(function() {
    function waitToLoad() {
        console.log("sqc: checking load");
        var room = $("DIV[data-room-id='room-1']");
        if ( room.height() <= 0 ) {
            window.setTimeout(waitToLoad,1000);
            return;
        }
        seeqoco.primarySetup();
    }
    $(function() {
        window.setTimeout(waitToLoad,3000);
    });
})();
