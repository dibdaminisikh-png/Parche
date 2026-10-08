import React from 'react';
import {hydrateRoot} from 'react-dom/client';
import './styles.css';
import {STATIC_DEMO,siteURL} from './lib/runtime';
const state=JSON.parse(document.getElementById('__DATA__')!.textContent!);
const d=state.data;d.products=d.entities.filter((e:any)=>e.type==='product');d.categories=d.entities.filter((e:any)=>e.type==='category');d.articles=d.entities.filter((e:any)=>e.type==='article');d.attributes=d.entities.filter((e:any)=>e.type==='attribute');d.settings=d.entities.find((e:any)=>e.id==='site-settings');d.sections=d.entities.find((e:any)=>e.id==='home')?.sections||[];d.navigation=d.entities.find((e:any)=>e.id==='menu')?.columns||[];
if(STATIC_DEMO){const {default:mountPages}=await import('./pages/PagesApp');await mountPages(state);}else{const {default:App}=await (state.admin?import('./admin/Admin'):import('./storefront/Storefront'));hydrateRoot(document.getElementById('root')!,<App {...state}/>);}
if('serviceWorker' in navigator){/* Deliberately no offline cache for identity-aware catalog and checkout. */}
const model=(navigator as any).modelContext;
if(model?.registerTool){model.registerTool({name:'search_fabrics',description:'Search published fabric products by name, material or SKU.',inputSchema:{type:'object',properties:{query:{type:'string'}},required:['query']},execute:async({query}:{query:string})=>({content:[{type:'text',text:JSON.stringify(await(await fetch(siteURL('/api/catalog?q='+encodeURIComponent(query)))).json())}]})});}
