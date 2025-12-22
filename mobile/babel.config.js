module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }], // Rất quan trọng cho NativeWind v4
      "nativewind/babel",
    ],
    plugins: [
      // Các plugin khác nếu có (như react-native-reanimated/plugin)
    ],
  };
};