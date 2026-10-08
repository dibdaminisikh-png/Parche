import sharp from 'sharp';
import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('public/images',{recursive:true});
for(const width of [640,960,1440]) { await sharp('/workspace/assets-research/fabric-hero.png').resize(width).webp({quality:80}).toFile(`public/images/hero-${width}.webp`); await sharp('/workspace/assets-research/fabric-hero.png').resize(width).avif({quality:55}).toFile(`public/images/hero-${width}.avif`); }
for(let i=0;i<6;i++){const left=(i%3)*512,top=Math.floor(i/3)*512; for(const width of [320,640]) {await sharp('/workspace/assets-research/fabric-catalog.png').extract({left,top,width:512,height:512}).resize(width).webp({quality:82}).toFile(`public/images/fabric-${i}-${width}.webp`);} await copyFile(`public/images/fabric-${i}-640.webp`,`public/images/fabric-${i}.webp`);await sharp('/workspace/assets-research/fabric-catalog.png').extract({left,top,width:512,height:512}).resize(640).avif({quality:58}).toFile(`public/images/fabric-${i}.avif`);}
