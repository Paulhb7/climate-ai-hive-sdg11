# @probable-futures/probable-futures-maps-html-generator

This package empowers developers to seamlessly integrate dynamic and interactive climate maps into their web applications

## Installing

Using npm:
`npm install @probable-futures/probable-futures-maps-html-generator`

Using yarn:
`yarn add @probable-futures/probable-futures-maps-html-generator`

Using CDN:
The library is available via a CDN, so no installation is required. Simply include the following script in your HTML file:
`<script src="https://cdn.jsdelivr.net/npm/@probable-futures/probable-futures-maps-html-generator@latest/dist/probable-futures-maps-html-generator.umd.js"></script>`

## Functions

### `generateEmbedMap`

Easily embed any Probable Futures map in a website without touching a single line of code. This function can be used to generate embeddable maps as an html-string template.

**Params:**

- `datasetId` (Number): The id of the dataset associated to each map. The list can be found in the [docs](https://docs.probablefutures.org/maps/#all-maps)
- `tempUnit` (`°C` or `°F`): If the map unit is a temperature unit, eg. "Average Tempareture" map, you can choose the initial unit for the map data. Note that unit can still be changed from the map key
- `scenario` (Number): The warming scenario
- `viewState` (Object): This is an object which defines the initial view port of the map. The object includes `longitude`, `latitude`, and `zoom`
- `compare` (Object): This object can be specified in case the user wants to generate a comparison embeddable map. The object fields are `scenarioBefore` and `scenarioAfter`
- `hideControls` (Boolean) - default false: Hide the map controls, such as zoom buttons
- `hideMapLegend` (Boolean) - default false: Hide the map key
- `hideTitle` (Boolean) - default false: Hide the title containing the map name
- `hideResetMapButton` (Boolean) - default true: Hide the reset button. This button could be used to reset the map to its original view given the initial long, lat and zoom.

**Example:**

```js
import { generateEmbedMap } from "@probable-futures/probable-futures-maps";
import * as fs from "fs";

const htmlTemplate = await generateEmbedMap({
  datasetId: 40101,
  viewState: {
    zoom: 4,
  },
  scenario: 2,
});

// Do whatever you want with the html template, eg. write it to an html
// file or render it in inside an html iframe.

const fullPath = "./output.html";

fs.writeFileSync(fullPath, htmlTemplate);
```

<blockquote style="font-family: 'Source Sans Pro', 'Lucida Grande', sans-serif;-webkit-font-smoothing: antialiased;line-height: 1.6;font-size: 1rem;color: #333;box-sizing: border-box;background: #efefef;padding: 1px 16px;margin-left: 0;margin-right: 0;border-left: #cecece solid 10px;border-radius: 3px;">
<p><strong>Note</strong> Pass "compare" parameter to genereate an embeddable comparison map instead of a simple map. Check the Config section for more info about how to use this param.</p>
</blockquote>

**Additionally, the HTML template listens to the following message events that you can trigger from the main page where you are rendering the template**

- `onDegreeChanged`: You can change the selected warming scenario from outside the tempalte code. Example, if you are rendering the template inside an iframe:

  ```js
  // Simple map
  const newDegree = 3;
  const data = {
    action: "onDegreeChanged",
    degree: newDegree,
  };
  iframe.contentWindow?.postMessage(data, "*");
  ```

  ```js
  // Compare map
  const newDegreeBefore = 1.5;
  const newDegreeAfter = 3;
  const data = {
    action: "onDegreeChanged",
    degreeBefore: newDegreeBefore,
    degreeAfter: newDegreeAfter,
  };
  iframe.contentWindow?.postMessage(data, "*");
  ```

**Example using the CDN:**

```js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Probable Futures Map</title>
  </head>
  <body>
    <h1>Probable Futures Climate Map</h1>
    <div id="map-container"></div>
    <button onclick="changeScenario(3)">Change Scenario to 3°C</button>

    <script src="https://cdn.jsdelivr.net/npm/@probable-futures/probable-futures-maps-html-generator@latest/dist/probable-futures-maps-html-generator.umd.js"></script>
    <script>
      window.onload = async function () {
        if (typeof ProbableFuturesMapsHTMLGenerator === "undefined") {
          console.error("ProbableFuturesMapsHTMLGenerator is not loaded. Check the script URL.");
          return;
        }

        const htmlTemplate = await ProbableFuturesMapsHTMLGenerator.generateEmbedMap({
          datasetId: 40101,
          viewState: { zoom: 4 },
          scenario: 2,
        });

        console.log(htmlTemplate);

        // Create an iframe
        const iframe = document.createElement("iframe");
        iframe.style.width = "100%";
        iframe.style.height = "600px";
        iframe.style.border = "none";
        document.getElementById("map-container").appendChild(iframe);

        // Write the generated HTML template inside the iframe
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(htmlTemplate);
        iframeDoc.close();
      };

      function changeScenario(degree) {
        const iframe = document.querySelector("#map-container iframe");
        if (iframe) {
          iframe.contentWindow.postMessage(
            { action: "onDegreeChanged", degree },
            "*"
          );
        }
      }
    </script>
  </body>
</html>
```

### `getLatestMaps`

Use this function to get the latest Maps. Each Map object is of type Map.

### `getMapObject`

Get the full object of a spcific Map. eg. `getMapObject(40104)`

### `getDatasetIds`

Get all the available dataset Ids. Find each map and its associated datasetId [here](https://docs.probablefutures.org/maps/)

### `getDataDescriptionAtPlaceGenerator`

You can generate a magic sentence that describes the data of a specific map at a specific location. Currenly, only maps whose names start with "Days above" have an associated magic sentence. Usage example:

Example:

```js
import {
  getDataDescriptionAtPlaceGenerator,
  getMapObject,
  DataDescriptionAtPlaceFuncType,
} from "@probable-futures/probable-futures-maps";

const generator = getDataDescriptionAtPlaceGenerator();
const func: DataDescriptionAtPlaceFuncType = generator[40104];
// call the function by passing the required params:
const sentence = func({
  place: "Arizona, United States",
  valueLow: 6,
  valueMid: 32,
  valueHigh: 74,
  degree: 0.5,
  datasetId: 40104,
});

console.log(sentence);

// The result:
// Between 1970 and 2000, people in Arizona, United States could expect about 32 Days above 32°C (90°F) in an average year, 6 days in a cooler year and 74 days in a warmer year. In a 1.5°C warming scenario, people in Arizona, United States can expect about 57 Days above 32°C (90°F) in an average year, 26 days in a cooler year and 106 days in a warmer year.
```

#### Version history

For details about updates and changes in each version of this package, check the version history at this [link](https://github.com/Probable-Futures/apps-public/blob/main/packages/probable-futures-maps-html-generator/CHANGELOG.md).
