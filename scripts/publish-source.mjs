import {spawnSync} from 'node:child_process';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
process.stdin.setRawMode?.(true);console.log('Ready for hidden credential JSON on stdin.');const input=await new Promise(resolve=>{let value='';const receive=c=>{value+=c.toString();if(value.includes('\n')){process.stdin.off('data',receive);process.stdin.pause();process.stdin.setRawMode?.(false);resolve(value.trim())}};process.stdin.on('data',receive)});const {credential}=JSON.parse(input);
const run=(args,extra={})=>{const r=spawnSync('git',args,{cwd:process.cwd(),encoding:'utf8',...extra});if(r.status!==0)throw new Error(r.stderr||'Git command failed');return r.stdout.trim()};
try{run(['rev-parse','--git-dir'])}catch{run(['init','-b',credential.branch||'main'])}
run(['config','user.name','Codex']);run(['config','user.email','codex@openai.com']);
try{run(['remote','set-url','origin',credential.remote_url])}catch{run(['remote','add','origin',credential.remote_url])}
run(['add','.']);try{run(['commit','-m','Build Taropood storefront and persistent CMS phase one'])}catch(e){if(!String(e.message).includes('nothing to commit'))throw e}
await mkdir('/tmp/taropood-publish',{recursive:true});const askpass='/tmp/taropood-publish/askpass.sh';await writeFile(askpass,'#!/bin/sh\ncase "$1" in *Username*) printf "%s" "$SITE_GIT_USERNAME" ;; *) printf "%s" "$SITE_GIT_TOKEN" ;; esac\n',{mode:0o700});
try{run(['push','-u','origin',`HEAD:${credential.branch||'main'}`],{env:{...process.env,GIT_ASKPASS:askpass,GIT_TERMINAL_PROMPT:'0',SITE_GIT_USERNAME:credential.auth_mode?.includes('github')?'x-access-token':'oauth2',SITE_GIT_TOKEN:credential.token,...(credential.auth_mode==='http_extra_header'?{GIT_CONFIG_COUNT:'1',GIT_CONFIG_KEY_0:'http.extraHeader',GIT_CONFIG_VALUE_0:'Authorization: Bearer '+credential.token}:{})}})}finally{await rm(askpass,{force:true})}
console.log(JSON.stringify({commit_sha:run(['rev-parse','HEAD']),project_id:JSON.parse(await readFile('.openai/hosting.json','utf8')).project_id}));
