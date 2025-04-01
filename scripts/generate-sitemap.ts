import { format } from 'date-fns/format';
import { XMLBuilder, XmlBuilderOptions } from 'fast-xml-parser';
import * as fs from 'fs';
import * as path from 'path';

// === CONFIGURATION ===
const appName = process.env['APP_NAME'] || 'angular-project';
const baseURL = process.env['BASE_URL'];

if (!baseURL) {
  console.error(
    "❌ BASE_URL est manquant. Merci de le définir via une variable d'environnement."
  );
  process.exit(1);
}

// === Write robots.txt ===
const robotsContent = `
    User-agent: *
    Disallow:

    Sitemap: ${baseURL}/sitemap.xml
  `;

const robotsPath = path.join(
  __dirname,
  `../dist/${appName}/browser/robots.txt`
);
fs.writeFileSync(robotsPath, robotsContent);
console.log(`✅ robots.txt généré : ${robotsPath}`);

// === Load prerendered routes ===
const prerenderedPath = path.join(
  __dirname,
  `../dist/${appName}/prerendered-routes.json`
);

if (!fs.existsSync(prerenderedPath)) {
  console.error(`❌ Fichier manquant : ${prerenderedPath}`);
  process.exit(1);
}

const prerenderedRoutes = JSON.parse(fs.readFileSync(prerenderedPath, 'utf8'));

const urls: string[] = Object.keys(prerenderedRoutes.routes).map((route) =>
  route === '/' ? baseURL : `${baseURL}${route}`
);

console.log(`✅ Génération de ${urls.length} routes dans sitemap.xml`);

// === Build XML ===
const xmlBuilderOptions: XmlBuilderOptions = {
  attributeNamePrefix: '@',
  ignoreAttributes: false,
  format: true,
};

const sitemap = {
  '?xml': {
    '@version': '1.0',
    '@encoding': 'UTF-8',
    urlset: {
      '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      url: urls.map((url) => ({
        loc: url,
        lastmod: format(new Date(), 'yyyy-MM-dd'),
      })),
    },
  },
};

const builder = new XMLBuilder(xmlBuilderOptions);
const xmlContent = builder.build(sitemap);

// === Write sitemap.xml ===
const outputPath = path.join(
  __dirname,
  `../dist/${appName}/browser/sitemap.xml`
);
fs.writeFileSync(outputPath, xmlContent);
console.log(`✅ sitemap.xml généré : ${outputPath}`);
