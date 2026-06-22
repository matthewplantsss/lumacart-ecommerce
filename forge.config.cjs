module.exports = {
  packagerConfig: {
    name: "LumaCart",
    executableName: "LumaCart",
    appBundleId: "com.matthewplants.lumacart",
    appCategoryType: "public.app-category.shopping",
    asar: {
      unpack: "**/{backend,node_modules}/**/*",
    },
    ignore: [
      /^\/out($|\/)/,
      /^\/\.git($|\/)/,
      /^\/screenshots($|\/)/,
    ],
  },

  rebuildConfig: {},

  makers: [
    {
      name: "@electron-forge/maker-dmg",
      config: {
        name: "LumaCart",
        format: "ULFO",
      },
    },
  ],

  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
  ],
};
