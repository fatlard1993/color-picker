# color-picker

A simple no-frills js color picker


## Prerequisites

1. Linux or UNIX
2. node.js >= V6.10.1 [Check out NVM](https://github.com/creationix/nvm)
3. ```npm i -g eslint gulp```

## Setup for dev

```./SETUP```


## Live dev demo

```gulp dev```


## Include in your project

Everything you need to get started is in ```client/js/ColorPicker.js``` and ```client/scss/_colorPicker.scss```
Feel free to hack and slash this into whatever you want it to be.
Checkout ```client/js/index/index.js``` for a simplistic implementation


## Methods on the global ColorPicker object

### create (color)

Returns a colorPicker element
 * color :: "#666" | Overwrites the default color, uses colorPicker.set (see below)


### randomColor ()

Returns a random hex-formatted color


### onPointerDown (evt)

Intended to be placed inside an existing pointerDown function like so: (reduces total event listener count)
```
function pointerDown(evt){
	...

	ColorPicker.onPointerDown(evt);
}

document.addEventListener('mousedown', pointerDown);
document.addEventListener('touchstart', pointerDown);
```

But can just as easily be added in like this:
```
document.addEventListener('mousedown', ColorPicker.onPointerDown);
document.addEventListener('touchstart', ColorPicker.onPointerDown);
```


## Methods on a colorPicker element

### set (color)

Sets the colorPicker color to the provided value
 * color | Accepted formats: rgb, rgba (ignores alpha), hsl, and hex


## Problems

If you are using linux and run into this error:
```
Error: watch /home/chase/Projects/color-picker/client/js/ ENOSPC
	at exports._errnoException (util.js:1022:11)
	at FSWatcher.start (fs.js:1305:19)
	at Object.fs.watch (fs.js:1330:11)
	at Gaze._watchDir (/home/chase/Projects/color-picker/node_modules/gaze/lib/gaze.js:289:30)
	at /home/chase/Projects/color-picker/node_modules/gaze/lib/gaze.js:358:10
	at iterate (/home/chase/Projects/color-picker/node_modules/gaze/lib/helper.js:52:5)
	at Object.forEachSeries (/home/chase/Projects/color-picker/node_modules/gaze/lib/helper.js:66:3)
	at Gaze._initWatched (/home/chase/Projects/color-picker/node_modules/gaze/lib/gaze.js:354:10)
	at Gaze.add (/home/chase/Projects/color-picker/node_modules/gaze/lib/gaze.js:177:8)
	at new Gaze (/home/chase/Projects/color-picker/node_modules/gaze/lib/gaze.js:74:10)
```

Run this to fix it: ```echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p```