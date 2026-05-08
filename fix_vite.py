import paramiko
import json

host = "187.124.27.250"
username = "root"
password = "DiamondKim&Ruby-1992"
app_dir = "/var/www/de_ongeplande_route"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, username=username, password=password, timeout=15)

def run(client, cmd, desc=""):
    if desc:
        print(f"\n>>> {desc}")
    stdin, stdout, stderr = client.exec_command(cmd)
    exit_code = stdout.channel.recv_exit_status()
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    if out:
        print(out)
    if err:
        print(f"[STDERR] {err}")
    return exit_code, out, err

# Check what entry points are actually in the manifest
run(client, f"cat {app_dir}/public/build/manifest.json | python3 -c \"import sys,json; m=json.load(sys.stdin); [print(k) for k in sorted(m.keys())]\"", "Alle manifest keys")

# Check vite.config.js (the old one) vs vite.config.ts
run(client, f"cat {app_dir}/vite.config.js", "Inhoud vite.config.js (oud)")

# Fix: remove old vite.config.js so only vite.config.ts is used
run(client, f"rm {app_dir}/vite.config.js", "Oud vite.config.js verwijderen")

# Fix bootstrap/cache permissions (root owned, needs to be writable by www-data)
run(client, f"chown -R www-data:www-data {app_dir}/bootstrap/cache", "Permissies bootstrap/cache fixen")
run(client, f"chown -R www-data:www-data {app_dir}/storage", "Permissies storage fixen")

# Rebuild and re-cache
run(client, f"cd {app_dir} && npm run build 2>&1 | tail -5", "Frontend opnieuw bouwen")
run(client, f"cd {app_dir} && php artisan optimize:clear && php artisan optimize 2>&1", "Cache vernieuwen")

# Verify
run(client, f"cat {app_dir}/public/build/manifest.json | python3 -c \"import sys,json; m=json.load(sys.stdin); [print(k) for k in sorted(m.keys()) if not k.startswith('_')]\"", "Manifest entry points na rebuild")

client.close()
print("\nKlaar!")
