const basePath = process.cwd();
const { MODE } = require(`${basePath}/constants/blend_mode.js`);
const { NETWORK } = require(`${basePath}/constants/network.js`);

const network = NETWORK.eth;

// General metadata for Ethereum
const layerURLBase = "https://calvinthong.s3.ap-southeast-1.amazonaws.com/nftlayer/" // layer directory
const layerDirectory = "toppy-layers" // layer directory
const directoryOutput = "toppy" // output directory
const nftContract = "0xc5ec66e2D1C8c933FcC9716C2a9a57E49fdc3899" // use for the hashedKey generation
const namePrefix = "xWIN Toppy"
const description = "xWIN Toppy collections. Toppy serves as xWIN mascot in xWIN group. It represent the harmony, peaceful and bringing joyful to the community and the world";
const baseUri = "ipfs://#IPFSCID#";

const solanaMetadata = {
  symbol: "YC",
  seller_fee_basis_points: 1000, // Define how much % you want from secondary market sales 1000 = 10%
  external_url: "https://www.youtube.com/c/hashlipsnft",
  creators: [
    {
      address: "7fXNuer5sbZtaTEPhtJ5g5gNtuyRoKkvxdjEjEnPN4mC",
      share: 100,
    },
  ],
};

// If you have selected Solana then the collection starts from 0 automatically
const layerConfigurations = [
  {
    growEditionSizeTo: 500,
    layersOrder: [
      { name: "Background" },
      { name: "Body"},
      { name: "Hats"},
      { name: "Mouth"},
      { name: "Sunglasses"},
      { name: "Cheeks", options: { blend: MODE.overlay, opacity: 0.7 } },
      { name: "Hands" },
      { name: "Clothes" },
      { name: "Necklace" },
    ],
  },
];
// const layerConfigurations = [
//   {
//     growEditionSizeTo: 100,
//     layersOrder: [
//       { name: "Background" },
//       { name: "Base"},
//       { name: "Glasses"},
//       { name: "Hairs"},
//       // { name: "Hat"},
//       // { name: "Eyes"},
//       { name: "Mouth"},
//       { name: "Light"},
//       { name: "Eyebrows"},
//       // { name: "Zipper" },
//       // { name: "Cheeks", options: { blend: MODE.overlay, opacity: 0.7 } },
//       { name: "Clothes" },
//       { name: "Earing" },      
//     ],
//   },
// ];
const shuffleLayerConfigurations = false;

const debugLogs = false;

const format = {
  width: 256,
  height: 256,
  smoothing: true,
};

const gif = {
  export: false,
  repeat: 0,
  quality: 100,
  delay: 500,
};

const text = {
  only: false,
  color: "#ffffff",
  size: 20,
  xGap: 40,
  yGap: 40,
  align: "left",
  baseline: "top",
  weight: "regular",
  family: "Courier",
  spacer: " => ",
};

const pixelFormat = {
  ratio: 1 / 128,
};

const background = {
  generate: true,
  brightness: "80%",
  static: false,
  default: "#000000",
};

const extraMetadata = {};

const rarityDelimiter = "#";

const uniqueDnaTorrance = 10000;

const preview = {
  thumbPerRow: 5,
  thumbWidth: 50,
  imageRatio: format.height / format.width,
  imageName: "preview.png",
};

const preview_gif = {
  numberOfImages: 50,
  order: "ASC", // ASC, DESC, MIXED
  repeat: 0,
  quality: 100,
  delay: 500,
  imageName: "preview.gif",
};

module.exports = {
  format,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  rarityDelimiter,
  preview,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
  pixelFormat,
  text,
  namePrefix,
  network,
  solanaMetadata,
  gif,
  preview_gif,
  nftContract,
  directoryOutput,
  layerDirectory,
  layerURLBase
};
