const data = require("./searchData.js");
const lunr = require("./lunr.js");

const fs = require("fs");
const path = require("path");

const config = {
  minSearchLength: 3,
  indexedFields: ["name", "desc", "type", "parent"],
};

// Build the index using Lunr.js
const index = lunr(function () {
  this.ref("name");

  config.indexedFields.forEach((field) => {
    this.field(field);
  }, this);

  data.forEach((doc) => {
    this.add(doc);
  }, this);
});

fs.writeFileSync(
  path.join(__dirname, "./serialized.json"),
  JSON.stringify(index, null, 2)
);
