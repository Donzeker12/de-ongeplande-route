import paramiko

hostname = "187.124.27.250"
username = "root"
password = "DiamondKim&Ruby-1992"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname, username=username, password=password)

cmd = "cd /var/www/de_ongeplande_route && npm run build 2>&1 | head -60"
stdin, stdout, stderr = client.exec_command(cmd)
print(stdout.read().decode())
client.close()
