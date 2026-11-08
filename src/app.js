import {CHECKLIST,createInitialProject,validateMetadata,validateChapters,validateThumbnail,checklistProgress,buildMarkdown} from "./core.js";
const $=id=>document.getElementById(id);let project={...createInitialProject()};
const fields={title:"title",description:"description",tags:"tags",keyword:"keyword",audience:"audience",cta:"cta",format:"format",visibility:"visibility",language:"language",chapters:"chapter-input"};
function read(){for(const [key,id] of Object.entries(fields))project[key]=$(id).value;return project;}
function write(){for(const [key,id] of Object.entries(fields))$(id).value=project[key]??"";render();}
function save(){localStorage.setItem("creator-publish-kit",JSON.stringify(project));$("save-status").textContent="Saved locally";}
function render(){
 const p=read(),m=validateMetadata(p),c=validateChapters(p.chapters),t=p.tags.split(/[\n,]/).filter(x=>x.trim());
 $("title-count").textContent=`${p.title.length} / 100`;$("description-count").textContent=`${p.description.length} / 5,000`;$("tags-count").textContent=`${p.tags.length} / 500`;$("chapter-count").textContent=`${c.chapters.length} chapters`;
 $("metadata-result").textContent=m.valid?`Metadata check passed · ${t.length} tags`:m.errors.join(" ");$("metadata-result").className="result "+(m.valid?"good":"");
 $("chapter-result").textContent=c.valid?"Chapter checks passed.":c.errors.join(" ");$("chapter-result").className="result "+(c.valid?"good":"");
 const prog=checklistProgress(p.checklist);$("progress").textContent=`${prog.complete} / ${prog.total} complete`;$("progress-bar").style.width=prog.percent+"%";
 $("preview-title").textContent=p.title||"Untitled video";$("preview-content").textContent=buildMarkdown(p);
 save();
}
document.querySelectorAll("[data-tab]").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll("[data-tab]").forEach(b=>b.classList.toggle("active",b===btn));document.querySelectorAll(".panel").forEach(p=>{p.hidden=p.id!==btn.dataset.tab;p.classList.toggle("active",p.id===btn.dataset.tab);});if(btn.dataset.tab==="preview")render();}));
Object.values(fields).forEach(id=>$(id).addEventListener("input",render));
$("checklist").innerHTML=CHECKLIST.map(([id,label])=>`<label class="check"><input type="checkbox" data-check="${id}"> ${label}</label>`).join("");
$("checklist").addEventListener("change",e=>{if(e.target.matches("[data-check]")){project.checklist[e.target.dataset.check]=e.target.checked;render();}});
$("example").addEventListener("click",()=>{$("chapter-input").value="00:00 Introduction\n01:24 The problem\n03:10 Step-by-step walkthrough\n07:45 Final tips";render();});
$("new-draft").addEventListener("click",()=>{if(confirm("Start a new draft? Export your current pack first if you need it.")){project=createInitialProject();write();}});
$("export-md").addEventListener("click",()=>download("publishing-pack.md",buildMarkdown(read()),"text/markdown"));
$("export-json").addEventListener("click",()=>download("creator-publish-kit.json",JSON.stringify(read(),null,2),"application/json"));
$("print").addEventListener("click",()=>window.print());$("refresh-preview").addEventListener("click",render);
$("import-json").addEventListener("change",async e=>{try{const data=JSON.parse(await e.target.files[0].text());project={...createInitialProject(),...data,checklist:{...createInitialProject().checklist,...data.checklist}};write();}catch{alert("That file is not a valid Creator Publish Kit JSON pack.");}e.target.value="";});
$("thumbnail-file").addEventListener("change",async e=>{const file=e.target.files[0];if(!file)return;const url=URL.createObjectURL(file),img=new Image();img.onload=()=>{const v=validateThumbnail({width:img.naturalWidth,height:img.naturalHeight});$("thumbnail-preview").src=url;$("thumbnail-preview").hidden=false;$("thumbnail-result").textContent=`${img.naturalWidth} × ${img.naturalHeight} · ${(file.size/1024/1024).toFixed(2)} MB · ${v.notes.join(" ")||"Looks good against the planning targets."}`;};img.onerror=()=>{$("thumbnail-result").textContent="Could not read this image.";URL.revokeObjectURL(url);};img.src=url;});
function download(name,content,type){const a=document.createElement("a"),url=URL.createObjectURL(new Blob([content],{type}));a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);}
try{const stored=JSON.parse(localStorage.getItem("creator-publish-kit"));if(stored)project={...createInitialProject(),...stored};}catch{}write();
