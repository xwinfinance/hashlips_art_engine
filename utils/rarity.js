const basePath = process.cwd();
const fs = require("fs");
const {
  layerConfigurations,
  directoryOutput,
  layerDirectory,
  layerURLBase
} = require(`${basePath}/src/config.js`);

const { getEnabledCategories } = require("trace_events");
const layersDir = `${basePath}/layers/` + layerDirectory;
const buildRarityDir = `${basePath}/build/`+ directoryOutput;
const { getElements } = require("../src/main.js");

// read json data
let rawdata = fs.readFileSync(`${basePath}/build/`+directoryOutput+`/json/_metadata.json`);
let data = JSON.parse(rawdata);
// console.log(data)
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
        layerURI: layerURLBase + layerDirectory + "/" + layer.name + "/" + element.name+ "%23" + element.weight + ".png" //       https://calvinthong.s3.ap-southeast-1.amazonaws.com/nftlayer/toppy-layers/
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
  }
}

// print out rarity data
// for (var layer in rarityData) {
//   for (var trait in rarityData[layer]) {
//     console.log(rarityData[layer][trait]);
//   }
// }

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

// calc score for each items
let tokenId = []
let scores = []
let temp = []

data.forEach((element) => {
  let attributes = element.attributes;
  let totalScore = 0
  attributes.forEach((attribute) => {
    let traitType = attribute.trait_type;
    let value = attribute.value;
    const selected = rarityData[traitType].find(x=>x.trait === value)
    const singleTraitScore = 1 / Number(selected.chance);
    totalScore = totalScore + singleTraitScore;
  });
  tokenId.push(element.edition.toString())
  const tempScore = totalScore * 10 ** 19
  scores.push(tempScore)
  console.log(element.edition + "=> " + tempScore.toString())
  temp.push({
    tokenId : element.edition,
    scores : tempScore
  })
});

const maxValueOfY = Math.max(...temp.map(x=>x.scores))
console.log(maxValueOfY)

const minValueOfY = Math.min(...temp.map(x=>x.scores))
console.log(minValueOfY)

const balancePerBucket = (maxValueOfY - minValueOfY) / 10
console.log("balancePerBucket : " + balancePerBucket)

const average = scores.reduce(function(sum, a) { return sum + a },0)/(scores.length||1);   
console.log(average);

var arr = temp.filter(x=>scores !== null)
var occurrences = arr.filter(function(val) {
    return val  > average + average ;
});
console.log(occurrences); // 3


fs.writeFileSync(
  `${buildRarityDir}/json/toppy-rarity-scores-parameter.txt`,
  tokenId.toString()
);

fs.appendFile(`${buildRarityDir}/json/toppy-rarity-scores-parameter.txt`, "\n", (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});

fs.appendFile(`${buildRarityDir}/json/toppy-rarity-scores-parameter.txt`, scores.toString(), (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});
