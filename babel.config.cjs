module.exports = {
  // Only apply this config when running Jest (not during build)
  env: {
    test: {
      presets: [
        ["@babel/preset-env", { targets: { node: "current" } }],
        "@babel/preset-typescript",
      ],
      plugins: [
        // Transform import.meta to a Jest-compatible format
        ["@babel/plugin-syntax-import-meta", { module: "ES6" }],
        // Transform import.meta.env to process.env for Jest
        function () {
          return {
            visitor: {
              MemberExpression(path) {
                if (
                  path.node.object &&
                  path.node.object.type === "MetaProperty" &&
                  path.node.object.meta &&
                  path.node.object.meta.name === "import" &&
                  path.node.object.property &&
                  path.node.object.property.name === "meta" &&
                  path.node.property &&
                  path.node.property.name === "env"
                ) {
                  // Replace import.meta.env with process.env
                  path.replaceWithSourceString("process.env");
                }
              },
              MetaProperty(path) {
                if (
                  path.node.meta &&
                  path.node.meta.name === "import" &&
                  path.node.property &&
                  path.node.property.name === "meta"
                ) {
                  // Replace import.meta with a mock object
                  path.replaceWithSourceString("({ env: process.env })");
                }
              },
            },
          };
        },
      ],
    },
  },
};
