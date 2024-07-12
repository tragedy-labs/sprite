const fs = require("fs");
const path = require("path");

function parseTypeDocsJson(json) {
  let data = [];
  json.children.forEach((type) => {
    if (type.kind === 128 && type.children.length) {
      data = [...data, ...parseMethods(type, type.name)];
    }
    data.push({
      name: type.name,
      desc:
        type.comment && type.comment.summary.length
          ? type.comment.summary.map((segment) => segment.text).join(" ")
          : "undefined",
      type:
        type.kind === 128
          ? "class"
          : type.kind === 64
          ? "interface"
          : type.kind === 256
          ? "interface"
          : type.kind === 512
          ? "class"
          : type.kind === 1024
          ? "property"
          : type.kind === 2048
          ? "method"
          : type.kind === 262144
          ? "enum"
          : type.kind === 4194304
          ? "type alias"
          : type.kind === 65536
          ? "variable"
          : type.kind === 131072
          ? "const"
          : type.kind === 16777216
          ? "module"
          : type.kind === 33554432
          ? "namespace"
          : type.kind === 67108864
          ? "constructor"
          : type.kind === 134217728
          ? "parameter"
          : type.kind === 268435456
          ? "type literal"
          : type.kind === 536870912
          ? "call signature"
          : type.kind === 1073741824
          ? "index signature"
          : type.kind === 2147483648
          ? "construct signature"
          : type.kind === 2097152
          ? "type"
          : "unknown",
    });
  });
  return data;
}

function parseMethods(json, parent) {
  let data = [];
  json.children.forEach((type) => {
    data.push({
      parent,
      name: type.name,
      desc:
        type.signatures &&
        type.signatures[0].comment &&
        type.signatures[0].comment.summary
          ? type.signatures[0].comment.summary
              .map((segment) => segment.text)
              .join(" ")
          : "undefined",
      type:
        type.kind === 128
          ? "class"
          : type.kind === 64
          ? "interface"
          : type.kind === 256
          ? "interface"
          : type.kind === 512
          ? "function"
          : type.kind === 1024
          ? "property"
          : type.kind === 2048
          ? "method"
          : type.kind === 262144
          ? "enum"
          : type.kind === 4194304
          ? "type alias"
          : type.kind === 65536
          ? "variable"
          : type.kind === 131072
          ? "const"
          : type.kind === 16777216
          ? "module"
          : type.kind === 33554432
          ? "namespace"
          : type.kind === 67108864
          ? "constructor"
          : type.kind === 134217728
          ? "parameter"
          : type.kind === 268435456
          ? "type literal"
          : type.kind === 536870912
          ? "call signature"
          : type.kind === 1073741824
          ? "index signature"
          : type.kind === 2147483648
          ? "construct signature"
          : type.kind === 2097152
          ? "type"
          : "unknown",
    });
  });
  return data;
}

function getDocsData() {
  const json = require("../_data/docs.json");
  return parseTypeDocsJson(json);
}

const parsed = getDocsData();

fs.writeFileSync(
  path.join(__dirname, "../_data/parseDocsData.json"),
  JSON.stringify(parsed, null, 2)
);
