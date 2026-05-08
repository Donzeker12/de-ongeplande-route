import paramiko

host = "187.124.27.250"
username = "root"
password = "DiamondKim&Ruby-1992"
app_dir = "/var/www/de_ongeplande_route"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, username=username, password=password, timeout=15)

def run(client, cmd):
    stdin, stdout, stderr = client.exec_command(cmd)
    stdout.channel.recv_exit_status()
    return stdout.read().decode().strip()

# Get the most recent error (after our last fix)
print("=== Meest recente Laravel errors ===")
print(run(client, f"grep 'production.ERROR' {app_dir}/storage/logs/laravel.log | tail -5"))

print("\n=== Laravel log tijdstempels ===")
print(run(client, f"grep 'production.ERROR' {app_dir}/storage/logs/laravel.log | awk '{{print $1, $2}}' | tail -5"))

# Test via curl directly on the VPS
print("\n=== Directe HTTP test op VPS ===")
print(run(client, "curl -s -o /dev/null -w 'HTTP Status: %{http_code}\\nContent-Type: %{content_type}' http://deongeplanderoute.nl/ 2>&1"))

print("\n=== PHP syntax check alle controllers ===")
print(run(client, f"find {app_dir}/app -name '*.php' | xargs php -l 2>&1 | grep -v 'No syntax errors' | head -10"))

print("\n=== Bootstrap/cache permissies ===")
print(run(client, f"ls -la {app_dir}/bootstrap/cache/"))

client.close()
