export const CHECKLIST = [
  ["metadata","Title and description reviewed"],["chapters","Chapters checked against final video"],["thumbnail","Thumbnail inspected at small size"],["links","Links and credits verified"],["captions","Captions / subtitles checked"],["visibility","Visibility and audience settings confirmed"],["end-screen","End screen and cards reviewed"],["final-playback","Final upload playback checked"]
];
export function createInitialProject(){return {title:"",description:"",tags:"",keyword:"",audience:"",cta:"",format:"Long-form",visibility:"Private",language:"English",chapters:"",checklist:Object.fromEntries(CHECKLIST.map(([id])=>[id,false]))};}
export function parseChapters(input){
 const rows=String(input||"").split(/\r?\n/).map((raw,index)=>({raw:raw.trim(),line:index+1})).filter(x=>x.raw);
 return rows.map(row=>{const m=row.raw.match(/^(\d{1,2}:\d{2}|\d{1,2}:\d{2}:\d{2})\s+(.+)$/);if(!m)return {...row,valid:false,error:"Use timestamp followed by a chapter title."};const p=m[1].split(":").map(Number);const seconds=p.length===2?p[0]*60+p[1]:p[0]*3600+p[1]*60+p[2];if(p.slice(1).some(n=>n>=60))return {...row,valid:false,error:"Minutes and seconds must be below 60."};return {...row,valid:true,time:seconds,label:m[2]};});
}
export function validateChapters(input){
 const chapters=parseChapters(input),errors=[];
 if(!chapters.length)errors.push("Add at least three chapters.");
 if(chapters.some(c=>!c.valid))errors.push("One or more lines have an invalid format.");
 if(chapters.length&&chapters[0].valid&&chapters[0].time!==0)errors.push("The first chapter must start at 00:00.");
 if(chapters.length&&chapters.length<3)errors.push("You need at least three chapters.");
 for(let i=1;i<chapters.length;i++){if(chapters[i-1].valid&&chapters[i].valid){if(chapters[i].time<=chapters[i-1].time)errors.push("Timestamps must be in ascending order.");else if(chapters[i].time-chapters[i-1].time<10)errors.push("Adjacent chapters must be at least 10 seconds apart.");}}
 return {valid:errors.length===0,chapters,errors};
}
export function validateMetadata(p){
 const errors=[],warnings=[],title=String(p.title||"").trim(),description=String(p.description||"").trim(),tags=String(p.tags||"").split(/[\n,]/).map(x=>x.trim()).filter(Boolean);
 if(!title)errors.push("Add a video title.");if(title.length>100)errors.push("Title must be 100 characters or fewer.");
 if(!description)errors.push("Add a video description.");if(description.length>5000)errors.push("Description must be 5,000 characters or fewer.");
 if(!p.keyword)warnings.push("Add a primary topic to keep the publishing intent clear.");
 if(tags.length>30)warnings.push("Review your tags; more than 30 may be unnecessary.");
 if(tags.join(", ").length>500)warnings.push("Your combined tags exceed 500 characters.");
 return {valid:errors.length===0,errors,warnings,tagCount:tags.length};
}
export function validateThumbnail({width,height}){const ratio=width/height,notes=[];if(Math.abs(ratio-16/9)>.02)notes.push("Image is not close to a 16:9 aspect ratio.");if(width<1280||height<720)notes.push("Image is smaller than the 1280 × 720 planning target.");return {valid:notes.length===0,notes,ratio};}
export function checklistProgress(state){const complete=CHECKLIST.filter(([id])=>state?.[id]).length;return {complete,total:CHECKLIST.length,percent:Math.round(complete/CHECKLIST.length*100)};}
export function buildMarkdown(p){const ch=validateChapters(p.chapters).chapters;return `# ${p.title||"Untitled video"}\n\n## Publishing details\n- Format: ${p.format}\n- Visibility: ${p.visibility}\n- Language: ${p.language}\n- Primary topic: ${p.keyword||"—"}\n- Audience: ${p.audience||"—"}\n- Call to action: ${p.cta||"—"}\n\n## Description\n${p.description||"—"}\n\n## Tags\n${p.tags||"—"}\n\n## Chapters\n${ch.map(c=>`- ${c.raw}`).join("\n")||"—"}\n\n## Launch checklist\n${CHECKLIST.map(([id,label])=>`- [${p.checklist?.[id]?"x":" "}] ${label}`).join("\n")}\n`;}
