# Nasadzovanie

Rovnaký model ako mnamdonaska.sk: image sa buildujú v GitHub Actions a
publikujú do GHCR, droplet ich už len sťahuje. Nič sa na serveri nekompiluje.

```
push do main
   ↓
frontend checks  +  api checks        (paralelne)
   ↓
build & push  ──→  ghcr.io/skyedown/pohoda-skalite-frontend:{latest, <sha>}
                   ghcr.io/skyedown/pohoda-skalite-api:{latest, <sha>}
   ↓
SSH → deploy/deploy.sh <sha> → compose pull → up -d → /api/health
                                                   ↓ zlyhá
                                              rollback na posledný zdravý tag
```

## Konfigurácia zostáva v `.env` na serveri

Image neobsahuje **žiadnu** konfiguráciu. Pri štarte kontajnera
[docker/40-app-config.sh](docker/40-app-config.sh) vygeneruje
`/usr/share/nginx/html/config.js` z premenných prostredia a appka ho číta cez
`window.__APP_CONFIG__` ([src/config.ts](src/config.ts)).

Znamená to:

- `VITE_*` **nepatria** do GitHub secrets ani vars
- zmena telefónu, GA kódu, otváracích hodín, IČO či admin hesla = úprava
  `.env` a `docker compose up -d`, **bez rebuildu**
- ten istý image vie bežať proti akémukoľvek `.env`

Bez toho by to nešlo — Vite `import.meta.env.VITE_*` nahrádza textovo pri
builde, v hotovom bundli už premenná neexistuje.

## Jednorazové nastavenie

### 1. GitHub → Settings → Secrets and variables → Actions

Len tri secrets, žiadne vars:

| Secret | Hodnota |
|---|---|
| `DO_HOST` | IP droplet-u |
| `DO_USERNAME` | `root` |
| `DO_SSH_KEY` | privátny SSH kľúč |

Tie tri už v repozitári existujú z pôvodnej pipeline — nastavovať ich netreba.

`GITHUB_TOKEN` sa nenastavuje — GitHub ho dodá automaticky a workflow ho
používa na push do registry.

### 2. Droplet → prihlásenie do registry

Balíčky sú privátne. GitHub → Settings → Developer settings →
**Personal access tokens (classic)** → povolenie **`read:packages`**.

```bash
ssh root@<IP>
echo '<PAT>' | docker login ghcr.io -u skyedown --password-stdin
```

Uloží sa do `~/.docker/config.json`, platí trvalo.

### 3. Droplet → `.env`

V `/root/pohoda-skalite/.env` musia byť všetky `VITE_*` premenné — pozri
[.env.example](.env.example). Frontend kontajner si ich načíta cez `env_file`.

API má vlastný `api/.env` (Mongo, SendGrid, RabbitMQ) — ten sa nemení.

### 4. Prvé nasadenie

Na droplet-e beží ešte stará `deploy.sh` z koreňa repozitára, ktorá buildovala
lokálne. Prvý push ju nahradí, ale v tom istom behu sa spustí ešte tá stará.
Po dobehnutí workflowu preto spusti nový skript raz ručne:

```bash
ssh root@<IP>
/root/pohoda-skalite/deploy/deploy.sh $(git -C /root/pohoda-skalite rev-parse HEAD)
```

Odvtedy už všetko beží automaticky.

## Bežná prevádzka

Push do `main`. Nič viac.

### Nasadenie konkrétnej verzie / rollback

```bash
/root/pohoda-skalite/deploy/deploy.sh <git-sha>
```

Každý build je otagovaný holým commit SHA, takže sa dá vrátiť na ľubovoľnú
verziu bez rebuildu. Skript si vedie `.deploy_history` — zoznam tagov, ktoré
reálne prešli health checkom — a pri zlyhaní sa vráti na posledný z nich
vrátane `docker-compose.yml` z toho commitu.

### Zmena konfigurácie

```bash
ssh root@<IP>
cd /root/pohoda-skalite
nano .env
docker compose up -d frontend
```

Bez rebuildu, bez CI. Kontajner pri štarte prepíše `config.js`.

Nastavenia, ktoré sa menia najčastejšie — pauza objednávok, čakacia doba,
dostupnosť produktov, rozvozové obce a minimálne sumy — sú v MongoDB
a upravujú sa priamo v admine bez zásahu na server.

## Lokálny vývoj

```bash
npm run dev     # číta .env priamo cez Vite
```

`public/config.js` je prázdna zástupná verzia, takže sa v dev režime použije
`.env` a `config.ts` defaulty.

Docker lokálne:

```bash
docker compose up --build
```

`build:` je v compose ponechaný práve na toto — na serveri sa nikdy nepoužije,
tam sa vždy len `pull`.

## Rozdiel oproti mnamdonaska.sk

Mnamdonaska má jeden image pre backend aj frontend (`command:` rozlišuje, čo
kontajner spustí). Pohoda má dva — frontend a API sú samostatné build kontexty
s vlastnými `package.json` a vlastným `node_modules`. Zjednotenie by nič
nepridalo a znamenalo by prepis oboch Dockerfile-ov.

Všetko ostatné je rovnaké: `ci.yml` so `concurrency`, `metadata-action` pre
normalizáciu cesty a holý SHA tag, `TAG` premenná v compose, `deploy.sh`
s `.deploy_history`, health checkom a rollbackom.
