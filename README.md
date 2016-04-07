# electron-slide-beacon
Mac OSX app from the [slide-beacon](https://github.com/dermike/slide-beacon) project made with [Electron](http://electron.atom.io).
Share links from your computer using this app to broadcast them as a [Physical Web](https://github.com/google/physical-web) Eddystone URL bluetooth beacon or [mDNS](https://github.com/google/physical-web/blob/master/documentation/mDNS_Support.md).

![](https://raw.githubusercontent.com/dermike/electron-slide-beacon/master/screenshot/screenshot.jpg)

**[Download pre-built binary](https://github.com/dermike/electron-slide-beacon/releases/download/0.3.0/PhysicalWebBroadcast.zip)** or follow the instructions below to run with Electron or build your own binary.

Use this [Eddystone URL bookmarklet](https://github.com/dermike/eddystone-bookmarklet) in your browser for quick sharing, or enter manually.

Note:
First try using Electron.

### Prerequisites to build

* [Node.js](https://nodejs.org/)
* [Xcode](https://developer.apple.com/xcode/download/) and its `Command Line Tools`. You can find this under the menu `Xcode -> Preferences -> Downloads`

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
