var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);

// src/lib/rbxmGenerator.ts
function generateRbxmContent(assetName, category, luaCode) {
  const safeName = assetName.replace(/["&<>]/g, "");
  const safeScript = (luaCode || `-- Roblox Dev Hub Asset: ${safeName}
-- Category: ${category}
print("Loaded ${safeName} successfully from Roblox Dev Hub!")`).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.roblox.com/roblox.xsd" version="4">
	<External>null</External>
	<External>nil</External>
	<Item class="Model" referent="RBX0">
		<Properties>
			<BinaryString name="AttributesSerialize"></BinaryString>
			<string name="Name">${safeName}</string>
			<int64 name="SourceAssetId">-1</int64>
			<bool name="NeedsPivotMigration">false</bool>
		</Properties>
		<Item class="Script" referent="RBX1">
			<Properties>
				<bool name="Disabled">false</bool>
				<Content name="LinkedSource"><null></null></Content>
				<string name="Name">${safeName}MainScript</string>
				<string name="ScriptGuid">{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}</string>
				<ProtectedString name="Source"><![CDATA[${safeScript}]]></ProtectedString>
			</Properties>
		</Item>
		<Item class="Folder" referent="RBX2">
			<Properties>
				<string name="Name">${safeName}_Resources</string>
			</Properties>
			<Item class="StringValue" referent="RBX3">
				<Properties>
					<string name="Name">DevHubSource</string>
					<string name="Value">Downloaded from Roblox Dev Hub Library</string>
				</Properties>
			</Item>
		</Item>
	</Item>
</roblox>`;
}

// src/data/sampleAssets.ts
var SAMPLE_ASSETS = [];

// server.ts
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
app.get("/api/download/:assetId", (req, res) => {
  const { assetId } = req.params;
  const asset = SAMPLE_ASSETS.find((a) => a.id === assetId) || SAMPLE_ASSETS[0];
  const rbxmContent = generateRbxmContent(asset.name, asset.category, asset.codeSnippet);
  const fileName = `${asset.name.replace(/\s+/g, "")}.rbxm`;
  res.setHeader("Content-Type", "application/x-roblox-model");
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  res.send(rbxmContent);
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Roblox Dev Hub server listening on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
