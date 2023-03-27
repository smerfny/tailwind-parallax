const plugin = require("tailwindcss/plugin");
const CLASS_NAME = "parallax";
const PERSPECTIVE = 300; // px
const LAYERS_DEF = [
  { id: -2, depth: -300 },
  { id: -1, depth: -150 },
  { id: 0, depth: 0, nonAbsolute: true },
  { id: 1, depth: 90, blockPointerEvents: true },
];
module.exports = plugin.withOptions(function (options = {}) {
  const { perspective, layers, className } = parseOptions(options);

  return function ({ addComponents }) {
    addComponents({
      [`.${className}-wrapper`]: {
        height: "100vh",
        perspective: `${perspective}px`,
      },
      [`.${className}-box`]: {
        "min-height": "100vh",
        position: "relative",
        "transform-style": "preserve-3d",
      },
      ...layers
        .map((layer) => {
          const { id, depth, nonAbsolute, blockPointerEvents } = layer;
          const layerId = id >= 0 ? `${id}` : `bg-${id * -1}`;
          const layerClass = `.${className}-layer-${layerId}`;
          const layerStyle = {
            transform: `translateZ(${depth}px) scale(${
              1 - depth / perspective
            })`,
            "z-index": `${id}`,
          };
          if (!nonAbsolute) {
            layerStyle.position = "absolute";
            layerStyle.top = "0";
            layerStyle.left = "0";
            layerStyle.right = "0";
            layerStyle.bottom = "0";
          }
          if (blockPointerEvents) {
            layerStyle["pointer-events"] = "none";
          }
          return {
            [layerClass]: layerStyle,
          };
        })
        .reduce((acc, cur) => ({ ...acc, ...cur }), {}),
    });
  };
});

function parseOptions(config) {
  if (config.perspective && typeof config.perspective !== "number") {
    throw new Error("perspective must be a number. Please check your config.");
  }
  const perspective = config.perspective || PERSPECTIVE;
  if (config.layers && !Array.isArray(config.layers)) {
    throw new Error("layers must be an array. Please check your config.");
  }
  if (config.layers) {
    config.layers.forEach((layer) => {
      if (typeof layer.id !== "number") {
        throw new Error(
          "id must be a number. Please check your config for layers."
        );
      }
      if (typeof layer.depth !== "number") {
        throw new Error(
          "depth must be a number. Please check your config for layers."
        );
      }
      if (layer.depth > perspective) {
        throw new Error(
          "depth must be less than perspective. Please check your config for layers."
        );
      }
    });
  }
  const layers = config.layers || LAYERS_DEF;
  if (config.className && typeof config.className !== "string") {
    throw new Error("className must be a string. Please check your config.");
  }
  const className = config.className || CLASS_NAME;
  return { perspective, layers, className };
}
