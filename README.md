# Youtube Player Aurelia Plugin
 
 Plugin for integrating Youtube iFrame embeds.
  
 The plugin is implemented as aurelia `customAttribute`.
 
## Basic Usage

Inside `<div>` container add another div with the `customAttribute`:
```
<div class="YourYoutubePlayerContainer">
  <div yt-player="YE7VzlLtp-4"></div>
</div>
```
> **Note:** `yt-player` value receives the Youtube video ID for the player to play.
Make sure to set width and height (can be dynamic) of `YourYoutubePlayerContainer`.
The internal `<div yt-player="YE7VzlLtp-4"></div>` is replaced by `<iframe>`
which has width and height set to 100%.
Changing `YourYoutubePlayerContainer` size will adjust the video frame size dynamically.

##### You can dynamically change the Youtube video ID, using something like:
```
<template>
  <div class="YourYoutubePlayerContainer">
    <div yt-player="${videoId}"></div>
  </div>
</template>
```
Where `videoId` is property of your custom element.

> **Note:** Youtube requires loading of `www.youtube.com/iframe_api` script.
You need to load it manually before the plugin is initialized or read the `Initialization Event` below.

## Events

The plugin makes use of `aurelia-event-aggregator` to publish different events.

### Initialization Event

`ytplayer:init:getScript` published when the plugin detects `www.youtube.com/iframe_api` is loaded.

Event payload:
```
{
  publisher: this,
  data: 'https://www.youtube.com/iframe_api'
};
```
Your application should load the script when receiving this event. If you use jQuery, you could use something like:
```
import {inject} from 'aurelia-dependency-injection';
import $ from 'jquery';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class App {
  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;
    this.eventAggregator.subscribe('ytplayer:init:getScript', payload => {
      $.getScript(payload.data);
    });
    /* .... */
  }
  
  /*...*/
}
```
> **Note:** Youtube requires CORS request so using non csp ```System.import(...)``` won't work. That's why to reduce number of dependencies and maximum flexibility the plugin publishes event instead of loading the script.

### Load Events

`ytplayer:load:player` published when plugin loads the Youtube player.
`ytplayer:load:video` published when plugin loads new video.

Events payload is `PlayerAPI` object.

### Player state Events
Delegation of [Youtube player onStateChange events](https://developers.google.com/youtube/iframe_api_reference#Events)

`ytplayer:state:cued`
`ytplayer:state:ended`
`ytplayer:state:playing`
`ytplayer:state:paused`
`ytplayer:state:buffering`
`ytplayer:state:unstarted`

Events payload is `PlayerAPI` object.

### Player error Events
Delegation of [Youtube player onError events](https://developers.google.com/youtube/iframe_api_reference#Events)

`ytplayer:error:invalid-param`
`ytplayer:error:html5`
`ytplayer:error:not-found`
`ytplayer:error:access-denied`
`ytplayer:error:unknown`

Events payload is `PlayerAPI` object.

## PlayerAPI

Wrapper of Youtube player.

Payload of most of the events and can be used to interact with the player.
```
interface PlayerAPI {

  play(): void;

  pause(): void;

  getVideoId(): String;

  getDuration(): Number;

  /* DOM element of the embed-code. Especialy usefull if you have number of players */
  getContainer(): Object;
}

```

## TODO

Add configuration options to plugin. Current defaults:
```
  quality = 'hd720';
  height = '100%';
  width = '100%';
  params = {
    enablejsapi: 1,
    //origin: ''   specify in production
    autoplay: 0,
    showinfo: 0
  };
```

## Based on aurelia-skeleton-plugin

[![ZenHub](https://raw.githubusercontent.com/ZenHubIO/support/master/zenhub-badge.png)](https://zenhub.io)
[![Join the chat at https://gitter.im/aurelia/discuss](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aurelia/discuss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This skeleton is part of the [Aurelia](http://www.aurelia.io/) platform. It sets up a standard aurelia plugin using gulp to build your ES6 code with the Babel compiler. Karma/Jasmine testing is also configured.

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.durandal.io/). If you have questions, we invite you to [join us on Gitter](https://gitter.im/aurelia/discuss). If you would like to have deeper insight into our development process, please install the [ZenHub](https://zenhub.io) Chrome Extension and visit any of our repository's boards. You can get an overview of all Aurelia work by visiting [the framework board](https://github.com/aurelia/framework#boards).

## Building The Code

To build the code, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

  ```shell
  npm install
  ```
3. Ensure that [Gulp](http://gulpjs.com/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g gulp
  ```
4. To build the code, you can now run:

  ```shell
  gulp build
  ```
5. You will find the compiled code in the `dist` folder, available in three module formats: AMD, CommonJS and ES6.

6. See `gulpfile.js` for other tasks related to generating the docs and linting.

## Running The Tests

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. Ensure that the [Karma](http://karma-runner.github.io/) CLI is installed. If you need to install it, use the following command:

  ```shell
  npm install -g karma-cli
  ```
2. Ensure that [jspm](http://jspm.io/) is installed. If you need to install it, use the following commnand:

  ```shell
  npm install -g jspm
  ```
3. Install the client-side dependencies with jspm:

  ```shell
  jspm install
  ```

4. You can now run the tests with this command:

  ```shell
  karma start
  ```
