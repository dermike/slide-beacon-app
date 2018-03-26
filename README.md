# slide-beacon-app

![](https://raw.githubusercontent.com/dermike/slide-beacon-app/master/screenshot/screenshot.jpg)

Mac OSX app from the [slide-beacon](https://github.com/dermike/slide-beacon) project made with [Electron](http://electron.atom.io).
Share links from your computer using this app to broadcast them as a [Physical Web](https://github.com/google/physical-web) Eddystone URL bluetooth beacon or [mDNS](https://github.com/google/physical-web/blob/master/documentation/mDNS_Support.md).

To discover shared URLs wirelessly via bluetooth, use the [physical-web-scan-app](https://github.com/dermike/physical-web-scan-app), or see the [Physical Web website](https://google.github.io/physical-web/try-physical-web) for Android and iOS clients.

Enter URLs manually or use this [reveal.js plugin](https://github.com/dermike/slide-beacon) to share links in presentational slides.

**[Download pre-built binary](https://github.com/dermike/slide-beacon-app/releases/download/0.4.3/SlideBeacon.zip)** or follow the instructions below to run with Electron or build your own binary.

### Prerequisites to build

* [Node.js](https://nodejs.org/)
* [Xcode](https://developer.apple.com/xcode/download/) and its `Command Line Tools`. You can find this under the menu `Xcode -> Preferences -> Downloads`

### Install and build

After cloning or downloading this repo, install the dependencies listed in `package.json`:

```sh
npm install
```

Note: this currently uses a git url to get latest version of [Bleno](https://github.com/noble/bleno) with High Sierra support.


Rebuild native modules for Electron use:

```sh
node ./node_modules/.bin/electron-rebuild
```

Run as Electron app:

```sh
npm run electron
```

Package as standalone Mac OSX app:

```sh
npm run package
```

Note: Edit the electron-packager options to your liking in the `scripts` section of `package.json`
