module.exports = {
  "extensions": ["ts"],
  "spec": ["test/**/*.ts"],
  "node-option": [
    "experimental-specifier-resolution=node",
    "loader=ts-node/esm"
  ]
}