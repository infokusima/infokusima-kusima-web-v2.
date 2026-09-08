#!/usr/bin/env python3
from pathlib import Path
import re
import sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else "_site")
paths = [
    root / "index.html",
    root / "app.js",
    root / "client-extra.js",
    root / "design-extra-v2.js",
]

changed = 0
for path in paths:
    if not path.exists():
        continue
    text = path.read_text(encoding="utf-8")
    before = text

    # Akcne tlacidla skladane z mail() helpera.
    text = text.replace(
        'class="btn primary" href="${mail(',
        'class="btn primary mail-action" target="_blank" rel="noopener" href="${mail('
    )
    text = text.replace(
        'class=\\"btn primary\\" href=\\"${mail(',
        'class=\\"btn primary mail-action\\" target=\\"_blank\\" rel=\\"noopener\\" href=\\"${mail('
    )

    # Priame mailto tlacidla, napr. Zaujemca o spravu a Dodavatel.
    text = re.sub(
        r'class="btn primary"\s+href="mailto:',
        'class="btn primary mail-action" target="_blank" rel="noopener" href="mailto:',
        text
    )
    text = re.sub(
        r'class=\\"btn primary\\"\s+href=\\"mailto:',
        'class=\\"btn primary mail-action\\" target=\\"_blank\\" rel=\\"noopener\\" href=\\"mailto:',
        text
    )

    if text != before:
        path.write_text(text, encoding="utf-8")
        changed += 1

if not changed:
    raise SystemExit("V2 mail actions: nenaslo sa nic na opravu")

print(f"V2 mail actions: OK ({changed} subory)")
