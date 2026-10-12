# Scary Monkey Inc. website

Static site (HTML/CSS/JS, no build step) served by nginx in Docker.

## Run on your NAS
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
- The compose file bind-mounts `./site`, so edits appear on refresh. Rebuild (`--build`) only if you change `nginx.conf`.

## Going public
Put a reverse proxy in front for HTTPS (Synology reverse proxy, Nginx Proxy Manager, Caddy, or a Cloudflare Tunnel, which avoids opening router ports). Point it at port 8080.
