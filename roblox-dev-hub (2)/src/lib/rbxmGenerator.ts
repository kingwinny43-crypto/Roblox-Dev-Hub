/**
 * Utility to generate valid Roblox Model (.rbxm) XML format files
 * that can be natively dragged or imported into Roblox Studio Explorer.
 */
export function generateRbxmContent(
  assetName: string,
  category: string,
  luaCode?: string
): string {
  const safeName = assetName.replace(/["&<>]/g, '');
  const safeScript = (luaCode || `-- Roblox Dev Hub Asset: ${safeName}\n-- Category: ${category}\nprint("Loaded ${safeName} successfully from Roblox Dev Hub!")`)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

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

export function triggerBrowserDownload(filename: string, content: string, mimeType = 'text/xml') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
