const basePath = process.cwd();
const fs = require("fs");
const layersDir = `${basePath}/layers`;
const buildRarityDir = `${basePath}/build/toppy`;

const { layerConfigurations } = require(`${basePath}/src/config.js`);

const { getElements } = require("../src/main.js");

// // read json data
// let rawdataRarity = fs.readFileSync(`${basePath}/build/toppy/json/toppy-rarity-output.json`);
// let rarityOutputData = JSON.parse(rawdataRarity);
// console.log(rarityOutputData)

// read json data
let rawdata = fs.readFileSync(`${basePath}/build/toppy/json/_metadata.json`);
let data = JSON.parse(rawdata);
console.log(data)
let editionSize = data.length;

let rarityData = [];

// intialize layers to chart
layerConfigurations.forEach((config) => {
  let layers = config.layersOrder;

  layers.forEach((layer) => {
    // get elements for each layer
    let elementsForLayer = [];
    let elements = getElements(`${layersDir}/${layer.name}/`);
    elements.forEach((element) => {
      // just get name and weight for each element
      let rarityDataElement = {
        trait: element.name,
        weight: element.weight.toFixed(0),
        occurrence: 0, // initialize at 0
        chance: "", 
      };
      elementsForLayer.push(rarityDataElement);
    });
    let layerName =
      layer.options?.["displayName"] != undefined
        ? layer.options?.["displayName"]
        : layer.name;
    // don't include duplicate layers
    if (!rarityData.includes(layer.name)) {
      // add elements for each layer to chart
      rarityData[layerName] = elementsForLayer;
    }
  });
});

// fill up rarity chart with occurrences from metadata
data.forEach((element) => {
  let attributes = element.attributes;
  attributes.forEach((attribute) => {
    let traitType = attribute.trait_type;
    let value = attribute.value;

    let rarityDataTraits = rarityData[traitType];
    rarityDataTraits.forEach((rarityDataTrait) => {
      if (rarityDataTrait.trait == value) {
        // keep track of occurrences
        rarityDataTrait.occurrence++;
      }
    });
  });
});

// convert occurrences to occurence string
for (var layer in rarityData) {
  for (var attribute in rarityData[layer]) {
    // get chance
    let chance =
      ((rarityData[layer][attribute].occurrence / editionSize) * 100).toFixed(2);

      rarityData[layer][attribute].chance = chance
    //   // show two decimal places in percent
    // rarityData[layer][attribute].occurrence =
    //   `${rarityData[layer][attribute].occurrence} in ${editionSize} editions (${chance} %)`;
  }
}

// print out rarity data
for (var layer in rarityData) {
  console.log(`Trait type: ${layer}`);
  for (var trait in rarityData[layer]) {
    console.log(rarityData[layer][trait]);
  }
  console.log();
}

console.log("printing rarity json....")
var tempHeader = []

for (var layer in rarityData) {
  let headerMetadata = {
    "traittype": `${layer}`,
    "attributes": []
  };
  tempHeader.push(headerMetadata)
  var tempAtt = []
  for (var trait in rarityData[layer]) {
    tempAtt.push(rarityData[layer][trait])
  }
  headerMetadata.attributes = JSON.stringify(tempAtt).replace(/\\/g, '');
}
  // write to the file
  // please reformat "[" in the attributes
  str = JSON.stringify(tempHeader, null, 2).replace(/\\/g, '');
  fs.writeFileSync(
    `${buildRarityDir}/json/toppy-rarity-output.json`,
    str
  );
