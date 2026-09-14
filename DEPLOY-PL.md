# Spustenie poľskej mutácie (pizzapohoda.pl)

Poľský web beží z **rovnakého buildu, rovnakého kontajnera a rovnakej databázy**
ako slovenský. Jazyk sa určuje za behu z hostname, takže CI/CD sa nemení — mení
sa len DNS, nginx a TLS certifikát.

## 1. DNS

U registrátora domény `pizzapohoda.pl`:

| Typ | Názov | Hodnota |
|-----|-------|---------|
| A   | `@`   | IP adresa DigitalOcean droplet-u |
| A   | `www` | IP adresa DigitalOcean droplet-u |

Overenie: `dig +short pizzapohoda.pl` musí vrátiť rovnakú IP ako
`dig +short pizzapohoda.sk`.

## 2. TLS certifikát

`nginx.conf` v kontajneri počúva len na porte 80 — TLS terminuje reverse proxy
na hostiteľovi (kontajner je publikovaný na `8080`). Certifikát pre novú doménu
treba vydať **tam, kde sa vydáva ten súčasný**. Pri certbote:

```bash
certbot --nginx -d pizzapohoda.pl -d www.pizzapohoda.pl
```

Ak TLS rieši Cloudflare alebo iný proxy, pridaj doménu tam a nastav
`Full (strict)`.

> Pred nasadením over, ako je TLS nastavené na serveri — tento krok je jediný,
> ktorý nie je v repozitári.

## 3. Premenné prostredia

Do `.env` na serveri doplň (viď `.env.example`):

- `VITE_COMPANY_ICO`, `VITE_COMPANY_DIC`, `VITE_COMPANY_IC_DPH` — **povinné**,
  zobrazujú sa v Regulamine aj v Polityce prywatności. Bez nich je poľský
  Regulamin neúplný.
- `VITE_GA_ID_PL` — merací kód samostatnej GA property pre poľský web.
  Ak zostane prázdny, poľská návštevnosť ide do slovenskej property označená
  parametrom `tenant=pl`.

`VITE_*` sa zapekajú do buildu, ktorý beží v GitHub Actions — tieto hodnoty
teda patria do **GitHub → Settings → Secrets and variables → Actions**, nie do
`.env` na serveri. Po ich zmene spusti Re-run all jobs na poslednom behu
workflowu. Detaily v [DEPLOY.md](DEPLOY.md).

## 4. Nasadenie

Žiadny nový krok — `git push` do `main` spustí pipeline (viď [DEPLOY.md](DEPLOY.md)).
`nginx.conf` s blokom pre `pizzapohoda.pl` je súčasťou frontend image.

## 5. Overenie po nasadení

```bash
curl -sI https://pizzapohoda.pl/ | head -1                 # 200
curl -s https://pizzapohoda.pl/ | grep -o '<html lang="[a-z]*"'   # lang="pl"
curl -sI https://pizzapohoda.pl/admin | head -1            # 404
curl -s https://pizzapohoda.pl/robots.txt | head -1        # robots.txt for pizzapohoda.pl
curl -s https://pizzapohoda.pl/sitemap.xml | grep pizzapohoda.pl
```

V prehliadači:

1. `pizzapohoda.pl` — celé menu po poľsky, ceny v `zł`.
2. Košík → výber obce ponúka len poľské dediny, minimum 170 zł.
3. Testovacia objednávka → zákazníkovi príde poľský e-mail, do kuchyne
   slovenský lístok s červeným pruhom `🇵🇱 POĽSKÁ OBJEDNÁVKA`.
4. `pizzapohoda.sk/admin/orders` — objednávka má odznak `🇵🇱 PL` a sumu v zł.
5. `pizzapohoda.sk/admin/analytics` — prepínač Slovensko/Poľsko, tržby sa
   nesčítavajú naprieč menami.

## 6. Google Search Console

1. Pridaj `pizzapohoda.pl` ako novú property.
2. Verifikačný token vlož do `index.pl.html` namiesto komentára
   `<!-- Add the pizzapohoda.pl verification token ... -->`.
3. Odošli `https://pizzapohoda.pl/sitemap.xml`.

## 7. E-maily

Potvrdzovacie e-maily poľským zákazníkom odchádzajú z overenej domény
`pizzapohoda.sk` — doručiteľnosť je v poriadku a žiadna zmena v SendGride nie je
potrebná. Ak by si neskôr chcel odosielať z `@pizzapohoda.pl`, treba v SendGride
spraviť domain authentication a pridať SPF/DKIM záznamy na poľskú doménu.

## 8. Testovanie pred prepnutím DNS

Poľskú verziu je možné otvoriť na slovenskej doméne parametrom:

```
https://pizzapohoda.sk/?lang=pl
```

Voľba sa drží v `sessionStorage` počas relácie. Späť: `?lang=sk`.

## Čo zostáva na doplnenie

- **IČO / DIČ / IČ DPH** v `.env` (viď bod 3).
- **Kontrola poľských textov rodeným hovorcom** — preklady sú kompletné, ale
  marketingová formulácia sa oplatí prejsť.
- **Právna kontrola Regulaminu** advokátom so špecializáciou na poľské
  spotrebiteľské právo. Dokument pokrýva povinné náležitosti vrátane vylúčenia
  odstúpenia od zmluvy podľa čl. 38 bod 4 a 12 ustawy o prawach konsumenta,
  ale nenahrádza právne stanovisko.
