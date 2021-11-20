import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';

export function getOverlays() {
  return glob.sync('./public/overlays/**/overlay.json').map((overlayManifestPath) => {
    const overlayDir = overlayManifestPath.replace(path.basename(overlayManifestPath), '');
    const overlayManifestString = fs.readFileSync(overlayManifestPath, 'utf-8');
    const overlayManifest = JSON.parse(overlayManifestString);
    const scriptPath = path.join(overlayDir, './main.js');
    const stylePath = path.join(overlayDir, './style.css');

    overlayManifest.assets = {
      script: fs.existsSync(scriptPath) ? scriptPath.replace('public/', '/') : null,
      style: fs.existsSync(stylePath) ? stylePath.replace('public/', '/') : null,
    };

    return overlayManifest;
  });
}
