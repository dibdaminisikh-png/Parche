import test from 'node:test';
import assert from 'node:assert/strict';
(globalThis as any).__SITE_BASE__='/Parche/';
(globalThis as any).__STATIC_DEMO__=true;
const values=new Map<string,string>();
(globalThis as any).localStorage={getItem:(key:string)=>values.get(key)||null,setItem:(key:string,value:string)=>values.set(key,value),removeItem:(key:string)=>values.delete(key),clear:()=>values.clear(),key:(i:number)=>[...values.keys()][i],get length(){return values.size}};
const {siteURL,siteSrcSet,logicalPath}=await import('../src/lib/runtime');
const {freshState,demoDataset,demoRequest,loadState}=await import('../src/pages/demo-store');
const call=(path:string,body?:any)=>demoRequest(new URL('https://test.local/Parche'+path),body?'POST':'GET',body||{});
test('Pages prefixes assets, srcset and CMS links without changing external links',()=>{
 assert.equal(siteURL('/admin/products/p1/'),'/Parche/cms/products/p1/');assert.equal(siteURL('/Parche/images/a.webp'),'/Parche/images/a.webp');assert.equal(siteURL('https://example.com/x'),'https://example.com/x');assert.equal(logicalPath('/Parche/cms/products/p1/'),'/admin/products/p1/');assert.equal(siteSrcSet('/images/a.webp 320w, /images/b.webp 640w'),'/Parche/images/a.webp 320w, /Parche/images/b.webp 640w');
});
test('Pages autosave keeps the public snapshot and publishes browser-local changes explicitly',async()=>{
 values.clear();const p=freshState().entities.find(e=>e.id==='p1')!;const draft=await call('/api/admin/save',{...p,name:'نام تست محلی',autosave:true});let state=loadState();assert.equal(demoDataset(state).products.find(p=>p.id==='p1')!.name,p.name);assert.equal(demoDataset(state,false,'p1').products.find(p=>p.id==='p1')!.name,'نام تست محلی');await assert.rejects(()=>call('/api/admin/save',{...p,name:'نسخه قدیمی'}),/نسخه جدیدتری/);await call('/api/admin/save',{...draft,status:'published'});state=loadState();assert.equal(demoDataset(state).products.find(p=>p.id==='p1')!.name,'نام تست محلی');assert.ok(state.revisions.length>=2);assert.ok(state.audit.length>=2);
});
test('Pages cart validates centimeters and stores a calculated demo order without payment',async()=>{
 values.clear();const p=demoDataset(freshState()).products[0],v=p.variants[0];await assert.rejects(()=>call('/api/cart',{productId:p.id,variantId:v.id,quantityCm:55}),/گام/);await call('/api/cart',{productId:p.id,variantId:v.id,quantityCm:250});const order=await call('/api/checkout',{name:'مشتری تست',phone:'09121234567',city:'تهران',address:'نشانی نمونه برای آزمون',postalCode:'1234567890'});assert.equal(order.lines[0].quantityCm,250);assert.equal(order.subtotal,Math.round(v.price*2.5));assert.equal(order.paymentStatus,'demo');assert.equal(loadState().cart.length,0);assert.ok(demoDataset(loadState()).orders.some(o=>o.id===order.id));
});
