# UniverseView

UniverseView is a add-on for a browser game called OGame. (https://lobby.ogame.gameforge.com/en_GB/hub)

Visit the website for more information about its features:
https://universeview.be/

## Requirements

- NPM: https://www.npmjs.com/
    
     ```
     klaas@laptop:/universeview$ npm install  
     ```

## Building the extension

### For debugging

```
klaas@laptop:/universeview$ grunt
```

Now you can include the extension in your preferred browser.

For example, in chrome:
* Go to ``chrome://extensions/``
* Enable "Developer mode" in the top right corner
* Press the "Load unpacked" button in the top left corner
* Now go to the "universeview" directory and select ``dist/google-chrome/`` 


### For extension store reviewers

This will produce the same result as the debugging build. But it will also create the extension zips without minifying the JavaScript files and a generic source.zip without the specific platform files.

```
klaas@laptop:/universeview$ grunt reviewers
```

To produce the actual uploaded result for comparison run the production build: 

```
klaas@laptop:/universeview$ grunt production
```

### For production

```
klaas@laptop:/universeview$ grunt production
```

