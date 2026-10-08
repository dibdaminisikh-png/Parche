import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('.runtime/qa',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});const base=process.env.QA_ORIGIN||'http://localhost:3000';const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
await page.goto(base+'/',{waitUntil:'networkidle'});await page.screenshot({path:'.runtime/qa/home-desktop.png',fullPage:false});console.log('HOME',await page.title(),await page.locator('h1').count());
await page.goto(base+'/admin/',{waitUntil:'networkidle'});await page.screenshot({path:'.runtime/qa/admin-desktop.png',fullPage:false});console.log('ADMIN',await page.locator('h1').innerText());
await page.setViewportSize({width:390,height:844});await page.goto(base+'/',{waitUntil:'networkidle'});await page.screenshot({path:'.runtime/qa/home-mobile.png',fullPage:false});console.log('MOBILE overflow',await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
await page.goto(base+'/product/linen-natural/',{waitUntil:'networkidle'});await page.screenshot({path:'.runtime/qa/product-mobile.png',fullPage:true});console.log('PRODUCT',await page.locator('h1').innerText());
console.log('ERRORS',JSON.stringify(errors));await writeFile('.runtime/qa/errors.json',JSON.stringify(errors,null,2));await browser.close();
