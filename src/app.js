import {CHECKLIST,createInitialProject,validateMetadata,validateChapters,validateThumbnail,checklistProgress,buildMarkdown} from "./core.js";
import {validateImportedProject,validateThumbnailFile,MAX_THUMBNAIL_DIMENSION} from "./safety.js";
const $=id=>document.getElementById(id);let project={...createInitialProject()};let previewUrl=null;
const fields={title:"title",description:"description",tags:"tags",keyword:"keyword",audience:"audience",cta:"cta",format:"format",visibility:"visibility",language:"language",chapters:"chapter-input"};
function read(){for(const [key,id] of Object.entries(fields))project[key]=$(id).value;return project;}
function save(){
 try{localStorage.setItem("creator-publish-kit",JSON.stringify(project));$("save-status").textContent="Saved locally";}
 catch{$("save-status").textContent="Browser storage unavailable — export a backup";$("save-status").setAttribute("aria-live","assertive");}
}
function render(){
 const p=read(),m=validateMetadata(p),c=validateChapters(p.chapters),t=p.tags.split(/[\n,]/).filter(x=>x.trim());
 $("title-count").textContent=`${p.title.length} / 100`;$("description-count").textContent=`${p.description.length} / 5,000`;$("tags-count").textContent=`${p.tags.length} / 500`;$("chapter-count").textContent=`${c.chapters.length} chapters`;
 $("metadata-result").textContent=m.valid?`Metadata check passed · ${t.length} tags`:m.errors.join(" ");$("metadata-result").className="result "+(m.valid?"good":"");
 $("chapter-result").textContent=c.valid?"Chapter checks passed.":c.errors.join(" ");$("chapter-result").className="result "+(c.valid?"good":"");
 const prog=checklistProgress(p.checklist);$("progress").textContent=`${prog.complete} / ${prog.total} complete`;$("progress-bar").style.width=prog.percent+"%";
 $("preview-title").textContent=p.title||"Untitled video";$("preview-content").textContent=buildMarkdown(p);
 document.querySelectorAll("[data-check]").forEach(input=>{input.checked=Boolean(p.checklist[input.dataset.check]);});
 save();
}
function write(){for(const [key,id] of Object.entries(fields))$(id).value=project[key]??"";render();}
document.querySelectorAll("[data-tab]").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll("[data-tab]").forEach(b=>b.classList.toggle("active",b===btn));document.querySelectorAll(".panel").forEach(p=>{p.hidden=p.id!==btn.dataset.tab;p.classList.toggle("active",p.id===btn.dataset.tab);});if(btn.dataset.tab==="preview")render();}));
Object.values(fields).forEach(id=>$(id).addEventListener("input",render));
$("checklist").innerHTML=CHECKLIST.map(([id,label])=>`<label class="check"><input type="checkbox" data-check="${id}"> ${label}</label>`).join("");
$("checklist").addEventListener("change",e=>{if(e.target.matches("[data-check]")){project.checklist[e.target.dataset.check]=e.target.checked;render();}});
$("example").addEventListener("click",()=>{$("chapter-input").value="00:00 Introduction\n01:24 The problem\n03:10 Step-by-step walkthrough\n07:45 Final tips";render();});
$("new-draft").addEventListener("click",()=>{if(confirm("Start a new draft? Export your current pack first if you need it.")){project=createInitialProject();write();}});
$("export-md").addEventListener("click",()=>download("publishing-pack.md",buildMarkdown(read()),"text/markdown"));
$("export-json").addEventListener("click",()=>download("creator-publish-kit.json",JSON.stringify(read(),null,2),"application/json"));
$("print").addEventListener("click",()=>window.print());$("refresh-preview").addEventListener("click",render);
$("import-json").addEventListener("change",async e=>{
 const file=e.target.files?.[0];if(!file)return;
 try{if(file.size>1024*1024)throw new Error("JSON import must be 1 MB or smaller.");const data=JSON.parse(await file.text());project=validateImportedProject(data,createInitialProject());write();$("import-result").textContent="Project imported and validated.";}
 catch(error){$("import-result").textContent=error instanceof Error?error.message:"Could not import this JSON file.";}
 e.target.value="";
});
$("thumbnail-file").addEventListener("change",e=>{
 const file=e.target.files?.[0];if(!file)return;
 try{validateThumbnailFile(file);}catch(error){$("thumbnail-result").textContent=error.message;e.target.value="";return;}
 const url=URL.createObjectURL(file),img=new Image();
 img.onload=()=>{
  if(img.naturalWidth>MAX_THUMBNAIL_DIMENSION||img.naturalHeight>MAX_THUMBNAIL_DIMENSION){URL.revokeObjectURL(url);$("thumbnail-result").textContent="Image dimensions exceed the 8,192 pixel preview limit.";return;}
  const old=previewUrl;previewUrl=url;$("thumbnail-preview").src=url;$("thumbnail-preview").hidden=false;
  if(old)URL.revokeObjectURL(old);
  const v=validateThumbnail({width:img.naturalWidth,height:img.naturalHeight});
  $("thumbnail-result").textContent=`${img.naturalWidth} × ${img.naturalHeight} · ${(file.size/1024/1024).toFixed(2)} MB · ${v.notes.join(" ")||"Looks good against the planning targets."}`;
 };
 img.onerror=()=>{URL.revokeObjectURL(url);$("thumbnail-result").textContent="Could not decode this image. Try exporting it as PNG or JPEG.";};
 img.src=url;
});
function download(name,content,type){const a=document.createElement("a"),url=URL.createObjectURL(new Blob([content],{type}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
try{const stored=JSON.parse(localStorage.getItem("creator-publish-kit"));if(stored)project=validateImportedProject(stored,createInitialProject());}
catch(error){$("save-status").textContent="Saved draft could not be loaded — start fresh or import a backup";}
write();
