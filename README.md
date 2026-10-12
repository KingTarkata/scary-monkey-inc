# Scary Monkey Inc. website

Static site (HTML/CSS/JS, no build step) served by nginx in Docker.

## Run on your NAS
**Option 0 (recommended if the repo is cloned on the NAS): serve the local files**
Use `docker-compose.local.yml` in a Portainer web-editor stack. First change both `/volume1/docker/scary-monkey-inc` paths to where the clone really lives (find it in the NAS file manager; it must be an absolute path).
Edit files in `site/` and refresh the browser to see changes. Update the site with `git pull` in the clone. Restart the container only if you change `nginx/default.conf`.

**Option A: paste-in stack (Portainer, Container Manager "Project" with pasted YAML)**
Use `docker-compose.nas.yml`. It pulls a prebuilt image, so no other files are needed.
The image is built by GitHub Actions on every push to `main` (or run *Publish Docker image* manually from the Actions tab).
If the repo/package is private, make the package public (GitHub > Packages > Package settings) or add `ghcr.io` as a registry with a personal access token (`read:packages`).

**Option B: from a checkout (SSH, or a stack that points at the repo/folder)**
`docker-compose.yml` builds locally, so it must run next to `Dockerfile` and `site/`.
```sh
git clone <this repo> && cd scary-monkey-inc
docker compose up -d --build        # http://<nas-ip>:8080
HOST_PORT=3000 docker compose up -d # use another port
```
Synology: Container Manager > Project > create from this folder's `docker-compose.yml`.
Unraid/Portainer: paste the compose file as a stack.

## Editing content
- Projects: `site/projects.json` (`category` is `game` or `other`; `image` is an optional path like `assets/foo.png`).
- Text: `site/index.html`. Look/feel: `site/styles.css`. Replace `hello@example.com`.
- The compose file bind-mounts `./site`, so edits appear on refresh. Rebuild (`--build`) only if you change `nginx/default.conf`.

## Going public
Put a reverse proxy in front for HTTPS (Synology reverse proxy, Nginx Proxy Manager, Caddy, or a Cloudflare Tunnel, which avoids opening router ports). Point it at port 8080.
