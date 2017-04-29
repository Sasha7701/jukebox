/* globals $ */

/**
 * JUKEBOX SINGLETON
 */
var Jukebox = {
	images: [],
	songs: [],
	activeSong: null,
	volume: 0,
	isPlaying: false,
	dom: {},
	

	// Run this function to kick the whole thing off
	start: function() {
		// Initialize the SoundCloud API
 		SC.initialize({ client_id: "fd4e76fc67798bfa742089ed619084a6" });
		// Grab the dom elements
		this.dom = {
			play: $(".jukebox-controls-play"),
			stop: $(".jukebox-controls-stop"),
			next: $(".jukebox-controls-next"),
			prev: $(".jukebox-controls-previous"),
			myRange: $("#myRange"),
			shuffle: $(".jukebox-controls-shuffle"),
			upload: $(".jukebox-header-upload"),
            input: $(".input1"),
			songs: $(".jukebox-songs"),
		    albumArt: $(".albumArt"),
		};

		this.addSong("./songs/Zimbabwe.mp3", {
			title: "Can I Get Wit' Ya in Zimbabwe",
			artist: "Notorious B.I.G. / New Navy",
		});
		this.addSong("./songs/IllGetYou.mp3", {
			title: "I'll Get You (ft. Jeppe)",
			artist: "Classixx",
		});
		this.addSong("./songs/CoastalBrake.mp3", {
			title: "Coastal Brake",
			artist: "Tycho",
		});
		
        this.addSong("./songs/CoastalBrake.mp3", {
			title: "Coastal Brake",
			artist: "Tycho",
		});
     
        this.addSong("https://soundcloud.com/viceroymusic/50-cent-disco-inferno-viceroy-jet-life-remix"); 
        
        this.change(this.songs[0]);

		// Render and bind!
		
		this.render();
		this.listen();
	},

	listen: function() {
		this.dom.play.on("click", function() {
			if (this.isPlaying) {
				this.pause();
			}
			else {
				this.play();
			}
		}.bind(this));

		this.dom.myRange.on("mousemove", function() {
	
			this.setVolume(0);
		}.bind(this));

		this.dom.next.on("click", function() {
			this.skip(1).play();
		}.bind(this));

		this.dom.prev.on("click", function() {
			this.skip(-1);
		}.bind(this));

		this.dom.stop.on("click", this.stop.bind(this));

        this.dom.shuffle.on("click", function() {
             this.shuffle(this.songs);
           }.bind(this));
		
		
            
        this.dom.input.on("input", function() {
        	this.addSong(this.dom.input.val());
         console.log(this);
        }.bind(this));

	      this.dom.upload.on("change", function() {
			var files = this.dom.upload.prop("files");

			for (var i = 0; i < files.length; i++) {
				var file = URL.createObjectURL(files[i]);
				this.addSong(file, {
					title: "Uploaded song",
					artist: "Unknown",
				    
				});
			}
		}.bind(this));
	},

	render: function() {
		// Render song elements
		 // this.dom.songs.html("");
		for (var i = 0; i < this.songs.length; i++) {
			var $song = this.songs[i].render();
			
			if (this.songs[i] === this.activeSong) {
				$song.addClass("isActive");
			}
		    else {
		    	$song.removeClass("isActive");
		    }
		}

		

		// Indicate paused vs played
		this.dom.play.toggleClass("isPlaying", this.isPlaying);
		this.dom.stop.toggleClass("isDisabled", !this.isPlaying);
	
	

     if (this.activeSong && this.activeSong.meta.image) {
           this.dom.albumArt.prop("src", this.activeSong.meta.image);
        }
        else {
            this.dom.albumArt.prop("src", "");
         }
         

	},

	
    

	play: function(song) {
		if (song) {
			this.change(song);
		}

		if (!this.activeSong) {
			return false;
		}

		this.isPlaying = true;
		this.activeSong.play();
		this.setVolume(this.volume)
		this.render();
		return this.activeSong;
	},

	pause: function() {
		if (!this.activeSong) {
			return false;
		}

		this.isPlaying = false;
		this.activeSong.pause();
		this.render();
		return this.activeSong;
	},

	stop: function() {
		if (!this.activeSong) {
			return false;
		}

		this.activeSong.stop();
		this.isPlaying = false;
		this.render();
		return this.activeSong;
	},

	change: function(song) {
		if (this.activeSong) {
			this.activeSong.stop();
		}
        
        this.activeSong = song;
		this.render();
		return this.activeSong;
	},

	skip: function(direction) {
		if (!this.activeSong) {
			return false;
		}

		var idx = this.songs.indexOf(this.activeSong);

		
		var desiredIndex = (idx + direction) % this.songs.length;

		// Change to the desired song
		return this.change(this.songs[desiredIndex]);
	},


	addSong: function(file, meta) {
	    var song;
 
 		if (file.indexOf("soundcloud.com") !== -1) {
 			song = new SoundCloudSong(file);
 		}
 		else {
 			song = new FileSong(file, meta);
 		}
  		this.songs.push(song);
        var $song = song.render();
		this.dom.songs.append($song);
		
  		
  		this.render();
  		return song;
 	},
		
		

	// volumeLevel should be a number between 0-100
	setVolume: function(volumeLevel) {
	this.activeSong.volume(this.volume = myRange.value / 100);
     
 }, 
     
  
shuffle: function() {
     this.songs.sort(function() { 
     return	Math.floor(Math.random() * 3 - 1);
     });
     
     this.change(this.songs[0]);
     this.play();
   
   console.log("Jukebox is shuffleing");
	},
   
};

  /**
 * SONG CLASS
 */
class Song {
  
 	constructor() {
 		this.file = null;
 		this.meta = {};
 			 this.audio = null;
 			 this.$song = $("<div class='jukebox-songs-song'></div>");
 			
 		}
 		
	///
	render() {
        this.$song.html("");
		this.$song.append('<div class="jukebox-songs-song-pic"></div>');
		this.$song.append('<div class="jukebox-songs-song-title">' + this.meta.title + '</div>');
		this.$song.append('<div class="jukebox-songs-song-artist">' + '<a href= '+this.meta.user+'>' + this.meta.artist + '</div>');
		this.$song.append('<img class="soundcloud-image albumArt" src = '+ this.meta.image+'>');
		this.$song.append('<div class="jukebox-songs-song-duration"></div>');
		
		this.$song.data("song", this);
	
		return this.$song;
	    
	}


    

	play() {
		this.audio.play();
	}

	pause() {
		this.audio.pause();
	}

	stop() {
		this.audio.pause();
		this.audio.currentTime = 0;
	}
	volume(volumeLevel){
	    this.audio.volume = volumeLevel;
	    
	  }
  }   
 class FileSong extends Song {
   
 constructor(file, meta) {	
 	 super();
 	 this.file = file;
 	 this.meta = meta || {
 	      title: "Unknown title",
 	      artist: "Unknown artist",
    };    
    this.audio = new Audio(file);
 }	
}

class SoundCloudSong extends Song {

constructor (url) {
	super();
        
	    SC.resolve(url)
           .then(function(song) {
               this.meta = {
               	   title: song.title,
                   artist: song.user.username,
                   image:  song.artwork_url,
                   user: song.permalink_url,
               };
             return song;
         }.bind(this))
      .then(function(song) {
      	   var uri = song.uri + "/stream?client_id=fd4e76fc67798bfa742089ed619084a6";
      	   this.audio = new Audio(uri);
          

      }.bind(this))

       .then(function() {
       	    this.render();
       }.bind(this));
 
    }
}


$(document).ready(function() {
	Jukebox.start();
	
});
        
		
		

		
             
     
     

 

    	
	

	

	
