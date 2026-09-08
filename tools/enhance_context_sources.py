#!/usr/bin/env python3
from pathlib import Path
import re
import sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else "_site")
app_path = root / "app.js"
extra_path = root / "client-extra.js"
design_path = root / "design-extra-v2.js"


def fail(message):
    raise SystemExit(f"V2 context sources: {message}")


def add_context_to_node(text, node_id, context_js, ensure_sources=()):
    lines = text.splitlines()
    prefix = f"{node_id}:{{type:'answer'"
    found = False
    for i, line in enumerate(lines):
        if line.lstrip().startswith(prefix):
            found = True
            if "contextSrc:" not in line:
                if ",src:[" not in line:
                    fail(f"node {node_id} nema src pole")
                line = line.replace(",src:[", f",contextSrc:{context_js},src:[", 1)
            match = re.search(r"src:\[([^\]]*)\]", line)
            if not match:
                fail(f"node {node_id} nema citatelne src pole")
            current = re.findall(r"'([^']+)'", match.group(1))
            for source_id in ensure_sources:
                if source_id not in current:
                    current.append(source_id)
            src_text = "src:[" + ",".join(repr(x) for x in current) + "]"
            line = line[:match.start()] + src_text + line[match.end():]
            lines[i] = line
            break
    if not found:
        fail(f"node {node_id} sa nenasiel")
    return "\n".join(lines) + ("\n" if text.endswith("\n") else "")


app = app_path.read_text(encoding="utf-8")

# Rozsirime register iba o zdroje, ktore maju jasny prakticky zmysel.
mediation_line = re.search(r"(^\s*mediation:\{[^\n]+\},\n)", app, flags=re.M)
if not mediation_line:
    fail("nenasiel sa zdroj mediation")
addition = (
    mediation_line.group(1)
    + " civil127:{label:'OFICIÁLNY',title:'Občiansky zákonník · § 127',desc:'Susedské obťažovanie hlukom, pachmi, dymom, vibráciami a ďalšími zásahmi.',url:'https://www.slov-lex.sk/ezbierky/pravne-predpisy/SK/ZZ/1964/40/'},\n"
    + " ars:{label:'OFICIÁLNY',title:'SOI · alternatívne riešenie sporov',desc:'Mimosúdny postup pri spotrebiteľskom spore po neúspešnej žiadosti o nápravu.',url:'https://www.soi.sk/alternativne-riesenie-spotrebitelskych-sporov'},\n"
)
app = app[:mediation_line.start()] + addition + app[mediation_line.end():]

helper_marker = "\nconst buttons={"
if helper_marker not in app:
    fail("nenasiel sa bod pre helper kontextovych zdrojov")
helpers = r'''
const contextSourceIds=(items)=>(items||[]).map(item=>Array.isArray(item)?item[0]:item);
function renderContextSources(items){
  if(!items||!items.length)return'';
  const links=items.map(item=>{
    const id=Array.isArray(item)?item[0]:item;
    const label=Array.isArray(item)?item[1]:'';
    const s=sources[id];
    if(!s)return'';
    return `<a class="context-source" target="_blank" rel="noopener" href="${s.url}">${label||s.title}<span aria-hidden="true">↗</span></a>`;
  }).filter(Boolean).join('');
  if(!links)return'';
  return `<div class="context-sources"><span class="context-sources-label">Prečítať viac z overeného zdroja:</span>${links}</div>`;
}
function renderAnswerBody(n){
  const body=n.html||'';
  const context=renderContextSources(n.contextSrc||[]);
  if(!context)return body;
  const firstParagraphEnd=body.indexOf('</p>');
  return firstParagraphEnd>=0
    ? body.slice(0,firstParagraphEnd+4)+context+body.slice(firstParagraphEnd+4)
    : context+body;
}
'''
app = app.replace(helper_marker, "\n" + helpers + "\nconst buttons={", 1)

# Kontextove zdroje: maximalne dva tam, kde clovek potrebuje vysvetlenie hned.
contexts = {
    "billing": ("[['annual','Ako sa zorientovať v ročnom vyúčtovaní']]", ()),
    "heat": ("[['heat503','Vyhláška · rozpočítavanie tepla'],['urso','ÚRSO · tepelná energetika']]", ()),
    "neighbors": ("[['mediation','Mediácia · odborný výklad'],['civil127','§ 127 · susedské obťažovanie']]", ("civil127",)),
    "reconstruction": ("[['buildlaw','Stavebný zákon · aktuálny rámec']]", ()),
    "sale": ("[['cadastre','ESKN · kataster a list vlastníctva']]", ()),
    "myreconstruction": ("[['buildlaw','Stavebný zákon · aktuálny rámec']]", ()),
    "voting": ("[['law182','Zákon 182/1993 · rozhodovanie vlastníkov']]", ()),
    "managercomplaint": ("[['soi','SOI · služby spojené s bývaním']]", ()),
    "billcomplaint": ("[['annual','Praktický výklad ročného vyúčtovania']]", ()),
    "votecomplaint": ("[['law182','Zákon 182/1993 · hlasovanie vlastníkov']]", ()),
    "repairproposal": ("[['sfrb','ŠFRB · možnosti obnovy bytového domu']]", ()),
    "energyproposal": ("[['sieia','SIEA · odborný sprievodca obnovou'],['sfrb','ŠFRB · financovanie obnovy']]", ()),
    "ruleproposal": ("[['law182','Zákon 182/1993 · správa a rozhodovanie domu']]", ()),
}
for node_id, (context_js, extra_sources) in contexts.items():
    app = add_context_to_node(app, node_id, context_js, extra_sources)

# Jeden renderer: kontextove zdroje sa zobrazia za prvym odsekom a dole sa neopakuju.
lines = app.splitlines()
renderer_found = False
for i, line in enumerate(lines):
    if line.startswith("function renderNode(id,push=true){"):
        renderer_found = True
        lines[i] = "function renderNode(id,push=true){if(push&&historyStack.at(-1)!==id)historyStack.push(id);const n=nodes[id],c=document.getElementById('content');document.getElementById('crumbs').textContent=breadcrumb();if(n.type==='answer'){const contextual=contextSourceIds(n.contextSrc||[]);const remaining=(n.src||[]).filter(id=>!contextual.includes(id));c.innerHTML=`<div class=\"answer\"><span class=\"kicker\">${n.kicker||''}</span><h3>${n.title}</h3>${renderAnswerBody(n)}${renderSources(remaining)}<p class=\"fine\">Pracovný koncept KUSIMA. Právne citlivé texty budeme pri finálnej verzii priebežne kontrolovať podľa aktuálneho znenia predpisov.</p></div>`}else{c.innerHTML=`<h2>${n.title}</h2><p class=\"intro\">${n.intro||''}</p><div class=\"options\">${n.choices.map(x=>`<button class=\"choice\" onclick=\"renderNode('${x[0]}')\"><strong>${x[1]}</strong><span>${x[2]}</span><span class=\"arrow\">Pokračovať →</span></button>`).join('')}</div>`}scrollTo(0,0)}"
        break
if not renderer_found:
    fail("nenasiel sa renderNode")
app = "\n".join(lines) + ("\n" if app.endswith("\n") else "")
app_path.write_text(app, encoding="utf-8")

# Reklamacny poriadok vzniká v client-extra.js, preto mu pridame spotrebitelsky zakon + ARS.
extra = extra_path.read_text(encoding="utf-8")
complaints_pattern = re.compile(r"(nodes\.complaints=\{type:'answer'.*?)(,src:\['consumer'\]\};)", re.S)
extra, count = complaints_pattern.subn(
    r"\1,contextSrc:[['consumer','Zákon o ochrane spotrebiteľa'],['ars','SOI · alternatívne riešenie sporu']],src:['consumer','ars']};",
    extra,
    count=1,
)
if count != 1:
    fail("nepodarilo sa doplnit kontext do reklamacie")
extra_path.write_text(extra, encoding="utf-8")

# Stara vrstva zdroj SOI umelo mazala. Vo V2 ho vedome zachovavame.
design = design_path.read_text(encoding="utf-8")
design = design.replace("  if(typeof sources!=='undefined' && sources.soi) delete sources.soi;\n", "")
design = design.replace("  if(typeof nodes!=='undefined') Object.values(nodes).forEach(n=>{if(Array.isArray(n.src)) n.src=n.src.filter(x=>x!=='soi');});\n", "")
design_path.write_text(design, encoding="utf-8")

# E-mailove akcne tlacidla otvaraju postu vedla webu, nie namiesto webu.
mail_rewrites = 0
for path in (app_path, extra_path):
    text = path.read_text(encoding="utf-8")
    before = text
    text = text.replace(
        'class="btn primary" href="${mail(',
        'class="btn primary mail-action" target="_blank" rel="noopener" href="${mail('
    )
    text = text.replace(
        'class=\\"btn primary\\" href=\\"${mail(',
        'class=\\"btn primary mail-action\\" target=\\"_blank\\" rel=\\"noopener\\" href=\\"${mail('
    )
    text = re.sub(
        r'class="btn primary"\s+href="mailto:',
        'class="btn primary mail-action" target="_blank" rel="noopener" href="mailto:',
        text
    )
    if text != before:
        mail_rewrites += 1
        path.write_text(text, encoding="utf-8")
if not mail_rewrites:
    fail("nenasli sa e-mailove akcne tlacidla")

print("V2 context sources and mail actions: OK")
