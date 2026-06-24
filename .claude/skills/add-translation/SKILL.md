---
name: add-translation
description: Add or sync translation keys across messages/de.json and messages/en.json for the Laccaria site. Use whenever new user-facing strings are introduced or locales drift out of sync.
---

# add-translation

Keep `messages/de.json` (German, default) and `messages/en.json` (English) in
perfect sync. **Both files must always have the identical key tree.**

## Steps
1. Identify the **namespace** (top-level object) the string belongs to — it usually
   maps to a component/section, e.g. `Hero`, `About`, `Services`, `Nav`, `Contact`.
   Create the namespace in both files if it does not exist.
2. Add the key under that namespace in **both** `messages/de.json` and
   `messages/en.json`. Use the same key name; only the value differs by language.
3. Use **ICU message syntax** for interpolation/plurals where needed, e.g.
   `"greeting": "Hallo {name}"` / `"greeting": "Hello {name}"`.
4. Reference the key in code via `t('key')` (see the **new-component** skill).

## Example
`messages/de.json`
```json
{
  "Hero": {
    "title": "Webentwickler aus Leidenschaft",
    "cta": "Projekte ansehen"
  }
}
```
`messages/en.json`
```json
{
  "Hero": {
    "title": "Web developer by passion",
    "cta": "View projects"
  }
}
```

## Verify parity
After editing, confirm both files have the same set of keys (no missing
translations). A quick structural diff of the sorted key paths:

```bash
node -e "const f=p=>{const o=require('./messages/'+p);const k=(x,pre='')=>Object.entries(x).flatMap(([a,v])=>typeof v==='object'&&v?k(v,pre+a+'.'):pre+a);return k(o).sort()};const d=f('de.json'),e=f('en.json');const miss=(a,b,n)=>a.filter(x=>!b.includes(x)).forEach(x=>console.log('missing in '+n+': '+x));miss(d,e,'en');miss(e,d,'de');console.log('keys de=%d en=%d',d.length,e.length)"
```
Output should list **no** missing keys and equal counts.

## Checklist
- [ ] Key added to **both** locale files under the same namespace/path.
- [ ] Values are real translations (no copied placeholder text).
- [ ] Parity check reports no missing keys.
