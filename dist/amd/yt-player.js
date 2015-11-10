define(['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var YTPlayerCustomAttribute = (function () {
    function YTPlayerCustomAttribute(element, eventAggregator, logManager) {
      _classCallCheck(this, _YTPlayerCustomAttribute);

      this.quality = 'hd720';
      this.height = '100%';
      this.width = '100%';
      this.params = {
        enablejsapi: 1,

        autoplay: 0,
        showinfo: 0
      };
      this.duration = 0;

      this.element = element;
      this.eventAggregator = eventAggregator;
      this.logger = _aureliaFramework.LogManager.getLogger('yt-player');
      this.getScript();
      this.logger.debug('Plugin loaded');
    }

    _createClass(YTPlayerCustomAttribute, [{
      key: 'getScript',
      value: function getScript() {
        if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
          window.onYouTubeIframeAPIReady = this.loadPlayer.bind(this);
          var payload = { publisher: this, data: 'https://www.youtube.com/iframe_api' };
          this.eventAggregator.publish('ytplayer:service:getScript', payload);
        } else {
          this.loadPlayer();
        }
      }
    }, {
      key: 'attached',
      value: function attached() {}
    }, {
      key: 'valueChanged',
      value: function valueChanged(videoId) {
        if (this.validVideoId(videoId)) {
          this.videoId = videoId;
          if (this.player) {
            this.loadVideo();
          }
        } else {
          this.logger.error('Invalid video ID: ' + videoId);
        }
      }
    }, {
      key: 'loadPlayer',
      value: function loadPlayer() {
        this.player = new YT.Player(this.element, {
          height: this.height,
          width: this.width,
          playerVars: this.params,
          events: {
            'onReady': this.onPlayerReady.bind(this),
            'onStateChange': this.onPlayerStateChange.bind(this),
            'onError': this.onError.bind(this)
          } });
        this.logger.debug('Player created');
      }
    }, {
      key: 'onPlayerReady',
      value: function onPlayerReady(event) {
        this.playerAPI = new PlayerAPI(this.player, this.element, this.logger);
        this.eventAggregator.publish('ytplayer:load:player', this.playerAPI);
        if (this.videoId) {
          this.loadVideo();
        }
      }
    }, {
      key: 'onPlayerStateChange',
      value: function onPlayerStateChange(event) {
        switch (event.data) {
          case YT.PlayerState.CUED:
            this.eventAggregator.publish('ytplayer:state:cued', this.playerAPI);
            break;
          case YT.PlayerState.ENDED:
            this.eventAggregator.publish('ytplayer:state:ended', this.playerAPI);
            break;
          case YT.PlayerState.PLAYING:
            this.eventAggregator.publish('ytplayer:state:playing', this.playerAPI);
            break;
          case YT.PlayerState.PAUSED:
            this.eventAggregator.publish('ytplayer:state:paused', this.playerAPI);
            break;
          case YT.PlayerState.BUFFERING:
            this.eventAggregator.publish('ytplayer:state:buffering', this.playerAPI);
            break;
          default:
            this.eventAggregator.publish('ytplayer:state:unstarted', this.playerAPI);
            break;
        }
      }
    }, {
      key: 'onError',
      value: function onError(event) {
        switch (event.data) {
          case 2:
            this.eventAggregator.publish('ytplayer:error:invalid-param', this.playerAPI);
            break;
          case 5:
            this.eventAggregator.publish('ytplayer:error:html5', this.playerAPI);
            break;
          case 100:
            this.eventAggregator.publish('ytplayer:error:not-found', this.playerAPI);
            break;
          case 101:
          case 150:
            this.eventAggregator.publish('ytplayer:error:access-denied', this.playerAPI);
            break;
          default:
            this.eventAggregator.publish('ytplayer:error:unknown', this.playerAPI);
            break;
        }
        this.logger.error('YT error: ' + event.data);
      }
    }, {
      key: 'loadVideo',
      value: function loadVideo() {
        this.player.cueVideoById(this.videoId, this.quality);
        this.eventAggregator.publish('ytplayer:load:video', this.playerAPI);
        this.logger.debug('Loaded video: ' + this.videoId);
      }
    }, {
      key: 'validVideoId',
      value: function validVideoId(videoId) {
        return videoId.length === 11;
      }
    }]);

    var _YTPlayerCustomAttribute = YTPlayerCustomAttribute;
    YTPlayerCustomAttribute = (0, _aureliaFramework.customAttribute)('yt-player')(YTPlayerCustomAttribute) || YTPlayerCustomAttribute;
    YTPlayerCustomAttribute = (0, _aureliaFramework.inject)(Element, _aureliaEventAggregator.EventAggregator, _aureliaFramework.LogManager)(YTPlayerCustomAttribute) || YTPlayerCustomAttribute;
    return YTPlayerCustomAttribute;
  })();

  exports.YTPlayerCustomAttribute = YTPlayerCustomAttribute;

  var PlayerAPI = (function () {
    function PlayerAPI(player, element, logger) {
      _classCallCheck(this, PlayerAPI);

      this.player = player;
      this.element = element;
      this.logger = logger;
    }

    _createClass(PlayerAPI, [{
      key: 'play',
      value: function play() {
        if (this.player.playVideo) {
          this.player.playVideo();
        } else {
          this.logger.warn('Unable to play video');
        }
      }
    }, {
      key: 'pause',
      value: function pause() {
        if (this.player.pauseVideo) {
          this.player.pauseVideo();
        } else {
          this.logger.warn('Unable to pause video');
        }
      }
    }, {
      key: 'getVideoId',
      value: function getVideoId() {
        var playlist = this.player.getPlaylist();
        var videoId = '';
        if (playlist.lenght > 0) {
          videoId = playlist[this.player.getPlaylistIndex()];
        }
        return videoId;
      }
    }, {
      key: 'getDuration',
      value: function getDuration() {
        return this.player.getDuration();
      }
    }, {
      key: 'getContainer',
      value: function getContainer() {
        return this.element;
      }
    }]);

    return PlayerAPI;
  })();
});