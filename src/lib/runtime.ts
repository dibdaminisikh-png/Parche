declare const __SITE_BASE__:string;
declare const __STATIC_DEMO__:boolean;
export const SITE_BASE=typeof __SITE_BASE__==='string'?__SITE_BASE__:'/';
export const STATIC_DEMO=typeof __STATIC_DEMO__==='boolean'?__STATIC_DEMO__:false;
const mediaURLs=new Map<string,string>();
export function registerMediaURL(path:string,url:string){const old=mediaURLs.get(path);if(old?.startsWith('blob:'))URL.revokeObjectURL(old);mediaURLs.set(path,url);}
export function siteURL<T extends string|undefined>(value:T):T{
 if(!value||!value.startsWith('/')||value.startsWith('//'))return value;
 if(mediaURLs.has(value))return mediaURLs.get(value) as T;
 let path=value.replace(/^\/admin(?=\/|$)/,'/cms');
 if(SITE_BASE!=='/'&&path.startsWith(SITE_BASE))return path as T;
 return (SITE_BASE.replace(/\/$/,'')+path) as T;
}
export function siteSrcSet<T extends string|undefined>(value:T):T{
 return (value?.split(',').map(s=>s.trim().replace(/^\S+/,siteURL)).join(', ')) as T;
}
export function logicalPath(value:string){
 let path=value;if(SITE_BASE!=='/'&&path.startsWith(SITE_BASE))path='/'+path.slice(SITE_BASE.length);
 return path.replace(/^\/cms(?=\/|$)/,'/admin');
}
