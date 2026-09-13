// Local development cluster only. Never reads DATABASE_URL or contacts remote hosts.
import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
const root = resolve('.local-postgres');
const bin = process.env.PG_BIN ?? 'C:/Program Files/PostgreSQL/18/bin';
const exe = name => join(bin, name + (process.platform === 'win32' ? '.exe' : ''));
if (!existsSync(join(root,'PG_VERSION'))) throw new Error('Local cluster not found.');
const hba = join(root,'pg_hba.conf');
const current = readFileSync(hba,'utf8');
if (!current.split(/\r?\n/).some(line=>!line.trim().startsWith('#') && /\btrust\b/.test(line))) {
  console.log('Local cluster already requires authentication.'); process.exit(0);
}
let started = false;
const run = (command,args,extra={}) => spawnSync(command,args,{windowsHide:true,encoding:'utf8',...(command===exe('pg_ctl')?{stdio:'ignore'}:{}),...extra});
try {
  const ready=run(exe('pg_isready'),['-h','127.0.0.1','-p','55439','-t','2']);
  if(ready.status!==0){
    const start=run(exe('pg_ctl'),['-D',root,'-l',resolve('.local-postgres-hardening.log'),'-o','-h 127.0.0.1 -p 55439','-w','start']);
    if(start.status!==0)throw new Error('Could not start local cluster.');
    started=true;
  }
  let admin, args, roles;
  for (const candidate of [...new Set([process.env.LOCAL_PG_ADMIN, 'postgres', 'politika', 'wilck', process.env.USERNAME].filter(Boolean))]) {
    args=['-w','-h','127.0.0.1','-p','55439','-U',candidate,'-d','postgres','-v','ON_ERROR_STOP=1','-At'];
    roles=run(exe('psql'),[...args,'-c','SELECT rolname FROM pg_roles WHERE rolcanlogin']);
    if(roles.status===0){admin=candidate;break;}
  }
  if(!admin)throw new Error('Set LOCAL_PG_ADMIN to the local administrative role; configuration unchanged.');
  const directory=run(exe('psql'),[...args,'-c',"SHOW data_directory"]);
  if(directory.status!==0||resolve(directory.stdout.trim()).toLowerCase()!==root.toLowerCase())throw new Error('Refusing to change a different local cluster.');
  const credentials={};
  const statements=[];
  for(const role of roles.stdout.trim().split(/\r?\n/)){
    const password=randomBytes(32).toString('hex'); credentials[role]=password;
    statements.push('ALTER ROLE "'+role.replaceAll('"','""')+'" PASSWORD \''+password+'\';');
  }
  const result=run(exe('psql'),args,{input:"SET password_encryption = 'scram-sha-256';\n"+statements.join('\n')});
  if(result.status!==0)throw new Error('Could not configure local credentials; HBA unchanged.');
  writeFileSync(join(root,'local-credentials.json'),JSON.stringify(credentials,null,2),{mode:0o600});
  writeFileSync(hba,current.split(/\r?\n/).map(line=>line.trim().startsWith('#')?line:line.replace(/\btrust\b/g,'scram-sha-256')).join('\n'));
  if(run(exe('pg_ctl'),['-D',root,'reload']).status!==0)throw new Error('Reload local PostgreSQL configuration.');
  const denied=run(exe('psql'),[...args,'-c','SELECT 1'],{env:{...process.env,PGPASSWORD:'invalid'}});
  const allowed=run(exe('psql'),[...args,'-c','SELECT 1'],{env:{...process.env,PGPASSWORD:credentials[admin]}});
  if(denied.status===0||allowed.status!==0)throw new Error('Local authentication verification failed.');
  console.log('PASS: local SCRAM authentication; anonymous/incorrect login rejected. Credentials retained only in ignored local cluster directory.');
}finally{if(started)run(exe('pg_ctl'),['-D',root,'-m','fast','-w','stop']);}
