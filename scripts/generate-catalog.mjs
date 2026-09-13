import { readFileSync, writeFileSync } from 'node:fs';
import ts from 'typescript';
const exports = {};
const code = ts.transpileModule(readFileSync('src/lib/data.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS}}).outputText;
new Function('exports','require',code)(exports,name=>{if(name!=='server-only')throw new Error('Unexpected dependency');return {};});
const catalog=exports.worlds.map(({tasks,...world})=>({...world,tasks:tasks.map(({id,title,questions})=>({id,title,questionCount:questions.length}))}));
writeFileSync('src/lib/catalog.ts','// Public navigation metadata only. Lesson content and answer keys stay on the server.\nexport const worlds = '+JSON.stringify(catalog,null,2)+';\n');
