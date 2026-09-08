#!/usr/bin/env python3
from pathlib import Path
import re
import sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else "_site")
design_path = root / "design-extra-v2.js"
index_path = root / "index.html"


def fail(message):
    raise SystemExit(f"V2 room captions: {message}")


design = design_path.read_text(encoding="utf-8")
room_meta = """  const roomMeta={\n    kitchen:['Naša kuchyňa','Tu sa veci varia a riešia.'],\n    pantry:['Naša špajza','Všetko dôležité máme po ruke.'],\n    office:['Naša pracovňa','Tu dávame veciam poriadok a jasné pravidlá.'],\n    workshop:['Naša dielňa','Tu spolu opravíme, čo sa pokazilo.']\n  };"""
design, count = re.subn(r"  const roomMeta=\{.*?\n  \};", room_meta, design, count=1, flags=re.S)
if count != 1:
    fail("nenasiel sa roomMeta")

design = design.replace(
    '<div class="room-caption"><strong>Naša obývačka</strong><small>miesto pre návštevu a prvý rozhovor</small></div>',
    '<div class="room-caption"><strong>Naša obývačka</strong><small>Tu si sadneme a porozprávame sa o vašom dome.</small></div>'
)

old_heading = '<p class="eyebrow">ZÁUJEMCA O SPRÁVU</p><h2>Sadnime si k tomu.</h2>'
new_heading = '<p class="eyebrow">ZÁUJEMCA O SPRÁVU</p><h2>Dovoľte nám predstaviť sa.</h2>'
if old_heading not in design:
    fail("nenasiel sa povodny nadpis zaujemcu")
design = design.replace(old_heading, new_heading, 1)

old_intro = '<p class="prospect-intro"><strong>Sme malá rodinná správcovská firma.</strong> Dnes spravujeme 15 bytových domov a voľnú kapacitu máme približne na ďalšie 3 až 5. Nechceme rásť za každú cenu. Chceme si zachovať spôsob práce, pri ktorom <strong>vieme, čo robíme – a vieme aj pre koho to robíme.</strong></p>'
new_intro = '<p class="prospect-intro"><strong>Sme malá správcovská firma.</strong> Dnes spravujeme 15 bytových domov a voľnú personálnu kapacitu máme na ďalších 3 až 5 domov. Nechceme rásť za každú cenu. Chceme si zachovať náš špecifický spôsob práce, pri ktorom <strong>vieme, čo robíme – a hlavne vieme aj pre koho to robíme. Technické záležitosti rieši priamo konateľ spoločnosti p. Javorinský a bankovú a hospodársku agendu spoločníčka s.r.o., p. Halahijová. Sídlo spoločnosti je v Poprade, ale kanceláriu a archív máme aj vo Svite, sme preto v oboch mestách po ruke.</strong></p>'
if old_intro not in design:
    fail("nenasiel sa povodny uvod zaujemcu")
design = design.replace(old_intro, new_intro, 1)

design_path.write_text(design, encoding="utf-8")

index = index_path.read_text(encoding="utf-8")
old_supplier = '<div class="supplier-head"><p class="eyebrow">DODÁVATEĽ · NAŠA DIELŇA</p>'
new_supplier = '<div class="supplier-head"><div class="room-caption"><strong>Naša dielňa</strong><small>Tu spolu opravíme, čo sa pokazilo.</small></div><p class="eyebrow">DODÁVATEĽ</p>'
if old_supplier not in index:
    fail("nenasiel sa supplier-head")
index = index.replace(old_supplier, new_supplier, 1)

old_explore = '<div class="explore-head"><p class="eyebrow">NA KÁVU · BEZ POVINNOSTÍ</p>'
new_explore = '<div class="explore-head"><div class="room-caption"><strong>Naša terasa / balkón</strong><small>Tu sa pozeráme dopredu a zbierame dobré nápady.</small></div><p class="eyebrow">NA KÁVU · BEZ POVINNOSTÍ</p>'
if old_explore not in index:
    fail("nenasiel sa explore-head")
index = index.replace(old_explore, new_explore, 1)

index_path.write_text(index, encoding="utf-8")
print("V2 room captions: OK")
