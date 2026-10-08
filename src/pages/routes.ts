import type {Base} from '../lib/models';
export const cmsModules=['orders','products','inventory','customers','discounts','articles','categories','attributes','media','homepage','navigation','pages','landings','reviews','seo','redirects','analytics','search-insights','notifications','users','audit','settings'];
export function pageRoutes(entities:Base[]){
 const paths=new Set(['/','/fabric/','/search/','/magazine/','/cart/','/checkout/','/account/','/login/','/wishlist/','/compare/','/admin/']);
 for(const module of cmsModules)paths.add(`/admin/${module}/`);
 const editors:Record<string,string>={product:'products',article:'articles',page:'pages',landing:'landings',coupon:'discounts',attribute:'attributes'};
 for(const module of Object.values(editors))paths.add(`/admin/${module}/new/`);
 for(const e of entities){if(e.type==='product')paths.add(`/product/${e.slug}/`);if(e.type==='category')paths.add(String(e.path));if(e.type==='article'){paths.add(`/magazine/${e.slug}/`);paths.add(`/magazine/category/${e.categorySlug}/`);}if(e.type==='page')paths.add(`/${e.slug}/`);if(e.type==='landing')paths.add(`/fabric/${e.slug}/`);if(e.type==='collection'||e.type==='brand')paths.add(`/${e.type}/${e.slug}/`);if(editors[e.type])paths.add(`/admin/${editors[e.type]}/${e.id}/`);}
 paths.add('/admin/orders/sample-order-1/');return [...paths];
}
