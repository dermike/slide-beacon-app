# electron-slide-beacon
Mac OSX app from the [slide-beacon](https://github.com/dermike/slide-beacon) project made with [Electron](http://electron.atom.io).
Share links from your computer using this app to broadcast them as an Eddystone URL ([Physical Web](https://github.com/google/physical-web)) bluetooth beacon.

![](https://raw.githubusercontent.com/dermike/electron-slide-beacon/master/screenshot/screenshot.jpg)

**[Download pre-built binary](https://github.com/dermike/electron-slide-beacon/releases/download/v0.1.0/EddystoneURL_0.1.0.zip)** or follow the instructions below to run with Electron or build your own binary.

Use this [Eddystone URL bookmarklet](https://github.com/dermike/eddystone-bookmarklet) in your browser for quick sharing, or enter manually.

Note:
First try using Electron.

### Prerequisites

* [Node.js](https://nodejs.org/)

### Install and build

After cloning or downloading this repo, install the dependencies listed in `package.json`:

```sh
npm install
```

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