import React,{useState,useEffect} from 'react';
import {hydrateRoot} from 'react-dom/client';
import DemoNotice from './DemoNotice';
import {demoDataset,loadState,loadMedia,installDemoTransport,resetDemo,recordSearch} from './demo-store';
import {logicalPath,siteURL,SITE_BASE} from '../lib/runtime';
type View={data:any;path:string;query:string;admin:boolean;Component:any;revision?:number};
export default async function mountPages(initial:any){
 installDemoTransport();
 const {default:Component}=await (initial.admin?import('../admin/Admin'):import('../storefront/Storefront'));
 hydrateRoot(document.getElementById('root')!,<PagesApplication initial={{...initial,Component}}/>);
}
function PagesApplication({initial}:{initial:View}){
 const [view,setView]=useState(initial),[error,setError]=useState('');
 async function refresh(){try{await loadMedia();let path=logicalPath(location.pathname),state=loadState();for(let i=0;i<20;i++){const redirect=state.redirects.find(r=>r.source===path);if(!redirect)break;path=redirect.target;history.replaceState({},'',siteURL(path)+location.search);}
 const admin=path.startsWith('/admin/'),query=location.search,params=new URLSearchParams(query),data=demoDataset(state,admin,params.get('preview')||undefined);const module=await (admin?import('../admin/Admin'):import('../storefront/Storefront'));
 if(admin&&path.endsWith('/new/')){const type=({products:'product',articles:'article',pages:'page',landings:'landing',discounts:'coupon',attributes:'attribute'} as any)[path.split('/')[2]];if(type)(data as any).editorEntity=(module as any).newEntity(type);}
 if(path==='/search/'&&params.get('q')){const term=params.get('q')!;recordSearch(term,data.products.filter(p=>(p.name+' '+Object.values(p.attributes).join(' ')).includes(term)).length);}
 const product=data.products.find(p=>path===`/product/${p.slug}/`),entity=data.entities.find(e=>e.id===params.get('preview'));document.title=admin?'مدیریت نسخه تست | '+data.settings.brand:(entity?.name||product?.name||data.settings.brand)+' | نسخه تست';
 setView(old=>({data,path,query,admin,Component:module.default,revision:(old.revision||0)+1}));setError('');window.scrollTo(0,0);
 }catch(e){setError((e as Error).message);}}
 useEffect(()=>{void refresh();const click=(event:MouseEvent)=>{if(event.defaultPrevented||event.button||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;const a=(event.target as Element)?.closest('a');if(!a||a.target==='_blank'||a.hasAttribute('download'))return;const url=new URL(a.href,location.href);if(url.origin!==location.origin||!url.pathname.startsWith(SITE_BASE)||url.hash&&url.pathname===location.pathname)return;event.preventDefault();history.pushState({},'',url.href);void refresh();};const submit=(event:SubmitEvent)=>{const form=event.target as HTMLFormElement;if(event.defaultPrevented||form.method.toLowerCase()!=='get'||!form.hasAttribute('action'))return;const url=new URL(form.action,location.href);if(url.origin!==location.origin)return;event.preventDefault();const params=new URLSearchParams();for(const [key,value] of new FormData(form))if(typeof value==='string')params.append(key,value);url.search=params.toString();history.pushState({},'',url.href);void refresh();};const pop=()=>void refresh();addEventListener('click',click);addEventListener('submit',submit);addEventListener('popstate',pop);addEventListener('storage',pop);return()=>{removeEventListener('click',click);removeEventListener('submit',submit);removeEventListener('popstate',pop);removeEventListener('storage',pop);};},[]);
 const {Component}=view;
 return <><DemoNotice onReset={async()=>{if(confirm('همه تغییرات و سفارش‌های آزمایشی همین مرورگر پاک و داده اولیه بازگردانده شود؟')){await resetDemo();await refresh();}}} onExport={()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(loadState(),null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='taropood-test-data.json';a.click();URL.revokeObjectURL(url);}}/>{error&&<p className="pages-demo-error" role="alert">{error}</p>}<Component key={view.path+view.query+':'+(view.revision||0)} {...view}/></>;
}
