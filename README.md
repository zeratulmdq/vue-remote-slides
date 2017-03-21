# vue-remote-slides

We all love to give talks, but we get so nervous and need to walk around while we speak. So... this is exactly what we need! A super simple app to control presentations with a phone/tablet. Just upload a PDF file, browse with your phone to /control and you are all set to go.

* Automatic file rendering
* Automatic file change detection
* Automatic resizing to fit the screen
* All devices you want working simultaneously
* Prev/Next page
* Go to (n) page
* Theming

Coming soon:

* Automatic (pps, ppt, pptx, odp, etc) to PDF conversion

### Check the video

[![YouTube ain't working](http://img.youtube.com/vi/DzFBVb0OpT4/0.jpg)](http://www.youtube.com/watch?v=DzFBVb0OpT4)

### _If you just want to use the app_

``` bash
#clone the project
git clone https://github.com/zeratulmdq/vue-remote-slides.git

# install dependencies
npm install

#run the server
npm run server
```

### _If you wanna hack around a bit_

``` bash
#clone the project
git clone https://github.com/zeratulmdq/vue-remote-slides.git

# install dependencies
npm install

#run the backend server + dev server with hot reload 
#(you'll have two services running, port 3000 and 8080)
npm run go

#Browse to http://localhost:8080
```