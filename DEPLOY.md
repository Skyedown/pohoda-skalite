# Nasadzovanie

Image sa buildujú v GitHub Actions a publikujú do GitHub Container Registry.
DigitalOcean droplet ich už len sťahuje — nič sa na ňom nekompiluje.

```
push do main
   ↓
CI (lint / format / typecheck)  ── frontend + api paralelne
   ↓
build & push  ──→  ghcr.io/skyedown/pohoda-skalite-frontend:{latest, <sha>}
                   ghcr.io/skyedown/pohoda-skalite-api:{latest, <sha>}
   ↓
SSH na droplet → deploy.sh <sha> → docker compose pull → up -d → health check
                                                              ↓ zlyhá
                                                          rollback
```

## Jednorazové nastavenie

### 1. GitHub → Settings → Secrets and variables → Actions

**Variables** (verejná konfigurácia, zapečie sa do JS bundlu):

| Názov | Hodnota |
|---|---|
| `VITE_API_URL` | *(prázdne — frontend volá `/api` na vlastnej doméne)* |
| `VITE_RESTAURANT_EMAIL` | `objednavky@pizzapohoda.sk` |
| `VITE_RESTAURANT_PHONE` | `+421918175571` |
| `VITE_PREORDER_START_TIME` | `10:00` |
| `VITE_OPENING_TIME` | `11:00` |
| `VITE_LAST_ORDER_TIME` | `21:30` |
| `VITE_CLOSING_TIME` | `22:00` |
| `VITE_COMPANY_ICO` | IČO |
| `VITE_COMPANY_DIC` | DIČ |
| `VITE_COMPANY_IC_DPH` | IČ DPH |
| `VITE_GA_ID_SK` | `G-6Q287KJ5RR` |
| `VITE_GA_ID_PL` | `G-9LEFZGNPWY` |
| `VITE_META_PIXEL_ID` | `695345926848903` |

**Secrets:**

| Názov | Hodnota |
|---|---|
| `VITE_ADMIN_NAME` | prihlasovacie meno do admina |
| `VITE_ADMIN_PASSWORD` | heslo do admina |
| `DO_HOST` | IP droplet-u |
| `DO_USERNAME` | `root` |
| `DO_SSH_KEY` | privátny SSH kľúč |

`GITHUB_TOKEN` sa nenastavuje — GitHub ho poskytuje automaticky a workflow ho
používa na push do registry.

Ak niektorú `Variable` nenastavíš, použije sa default zapísaný v kóde
(`analytics.ts`, `company.ts`, `orderingStatus.ts`). IČO/DIČ ale default nemajú
a v obchodných podmienkach sa zobrazí `—`.

### 2. Droplet → prihlásenie do registry

Balíčky sú privátne, takže droplet potrebuje token na sťahovanie.

GitHub → Settings → Developer settings → **Personal access tokens (classic)** →
Generate new token → povolenie **`read:packages`**.

```bash
ssh root@<IP>
echo '<PAT>' | docker login ghcr.io -u skyedown --password-stdin
```

Prihlásenie je trvalé (uloží sa do `~/.docker/config.json`).

### 3. Prvé nasadenie

Na droplet-e stále beží stará verzia `deploy.sh`, ktorá buildovala lokálne.
Prvý push ju síce nahradí novou, ale ešte v tom istom behu použije tú starú —
a tá by spravila lokálny build **bez** build args, takže by vznikol bundle bez
admin prihlasovacích údajov.

Preto po prvom úspešnom behu workflowu spusti deploy ešte raz ručne:

```bash
ssh root@<IP>
/root/pohoda-skalite/deploy.sh
```

Odvtedy už všetko beží automaticky.

## Bežná prevádzka

Push do `main`. Nič viac.

### Manuálne nasadenie konkrétnej verzie

```bash
/root/pohoda-skalite/deploy.sh                 # :latest
/root/pohoda-skalite/deploy.sh 023d015abc...   # konkrétny commit
```

Každý build sa taguje aj commit SHA, takže sa dá vrátiť na ľubovoľnú verziu bez
rebuildu.

### Rollback

`deploy.sh` si pred výmenou zapamätá digest bežiacich image. Ak health check
zlyhá, automaticky vráti predchádzajúce a skončí s chybou, takže to GitHub
Actions ohlási.

Ručne:

```bash
/root/pohoda-skalite/deploy.sh <sha-predchadzajuceho-commitu>
```

## Lokálny vývoj

`docker-compose.yml` má popri `image:` stále aj `build:`, takže lokálne funguje
build ako predtým:

```bash
./start.sh              # build + up
docker compose build    # len build
```

Rozdiel oproti predtým: `.env` sa už **nekopíruje do image** (je v
`.dockerignore`). Na lokálny Docker build treba build args:

```bash
docker compose build --build-arg VITE_ADMIN_NAME=admin \
                     --build-arg VITE_ADMIN_PASSWORD=admin123
```

Pre bežný vývoj to nepotrebuješ — `npm run dev` číta `.env` priamo.

## Zmena konfigurácie bez zmeny kódu

`VITE_*` sa zapekajú do bundlu, takže po zmene ktorejkoľvek `Variable` alebo
`Secret` treba znovu spustiť build:

GitHub → Actions → CI-CD-Deploy → **Re-run all jobs** na poslednom behu.

Naopak nastavenia, ktoré sa menia často — otváracie hodiny oznámení, pauza
objednávok, dostupnosť produktov, rozvozové obce a minimálne sumy — sú
v MongoDB a upravujú sa v admine bez deployu.

## Bezpečnostná poznámka

`VITE_ADMIN_NAME` a `VITE_ADMIN_PASSWORD` sa kompilujú do JavaScriptu, ktorý
server posiela každému návštevníkovi. Ktokoľvek si ich vie prečítať z
`assets/main-*.js` na živom webe. Uloženie do GitHub Secrets chráni len samotný
repozitár, nie výsledný bundle.

Platilo to aj pred touto zmenou — admin autentifikácia je od začiatku
client-side ([ProtectedRoute.tsx](src/components/ProtectedRoute/ProtectedRoute.tsx)).
Riešenie je presunúť overenie na API a vydávať session cookie; je to niekoľko
hodín práce a dá sa spraviť samostatne.
