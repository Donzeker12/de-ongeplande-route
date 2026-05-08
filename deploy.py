import paramiko

hostname = "187.124.27.250"
username = "root"
password = "DiamondKim&Ruby-1992"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname, username=username, password=password)

commands = [
    ("Git pull", "cd /var/www/de_ongeplande_route && git reset --hard HEAD && git pull origin main"),
    ("Composer install", "cd /var/www/de_ongeplande_route && composer install --no-dev --optimize-autoloader --no-interaction 2>&1 | tail -5"),
    ("Frontend bouwen", "cd /var/www/de_ongeplande_route && npm ci && npm run build 2>&1 | tail -10"),
    ("Migraties draaien", "cd /var/www/de_ongeplande_route && php artisan migrate --force"),
    ("Cache vernieuwen", "cd /var/www/de_ongeplande_route && php artisan optimize:clear && php artisan optimize"),
    ("HTTP test", "curl -s -o /dev/null -w 'HTTP Status: %{http_code}' http://deongeplanderoute.nl/"),
]

for label, cmd in commands:
    print(f"\n>>> {label}")
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode()
    err = stderr.read().decode()
    if out:
        print(out)
    if err and "warning" not in err.lower():
        print("STDERR:", err)

client.close()
print("\nKlaar!")
