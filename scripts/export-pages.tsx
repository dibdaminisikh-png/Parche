import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {renderPage} from '../server/render';
import {newEntity} from '../src/admin/Admin';
import {freshState,demoDataset} from '../src/pages/demo-store';
import {pageRoutes} from '../src/pages/routes';
import {siteURL,SITE_BASE} from '../src/lib/runtime';
const root=resolve('dist/pages'),manifest=JSON.parse(await readFile(root+'/.vite/manifest.json','utf8')),entry=manifest['src/client.tsx'];
const assets={js:SITE_BASE+entry.file,css:entry.css.map((file:string)=>SITE_BASE+file)};
const host=process.env.PAGES_ORIGIN||'https://dibdaminisikh-png.github.io',origin=host.replace(/\/$/,'')+SITE_BASE.replace(/\/$/,'');
const state=freshState(),routes=pageRoutes(state.entities),report=[];
for(const path of routes){const admin=path.startsWith('/admin/'),data=demoDataset(state,admin);if(admin&&path.endsWith('/new/')){const type=({products:'product',articles:'article',pages:'page',landings:'landing',discounts:'coupon',attributes:'attribute'} as any)[path.split('/')[2]];if(type)(data as any).editorEntity=newEntity(type);}
 const local=path.replace(/^\/admin(?=\/|$)/,'/cms'),file=resolve(root,'.'+local,'index.html');await mkdir(dirname(file),{recursive:true});const html=renderPage(data,path,'',admin,assets,origin);await writeFile(file,html);report.push({path:siteURL(path),file:local+'index.html',admin});}
await writeFile(root+'/404.html',renderPage(demoDataset(state),'/not-found/','',false,assets,origin,404));
await writeFile(root+'/.nojekyll','');
await writeFile(root+'/robots.txt','User-agent: *\nDisallow: '+SITE_BASE+'\n# This test build also sets noindex,nofollow on every HTML page.\n');
await writeFile(root+'/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
await writeFile(root+'/pages-manifest.json',JSON.stringify({mode:'browser-local-test',base:SITE_BASE,origin,generatedAt:new Date().toISOString(),routes:report},null,2));
console.log(`Pre-rendered ${routes.length} complete pages, CMS at ${origin}/cms/. All test pages noindex; no runtime database or credentials exported.`);
process.exit(0);
