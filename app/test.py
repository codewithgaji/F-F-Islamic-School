from core.security.hashHelper import HashHelper
import secrets


password = "FAdmin@Family"
print(HashHelper.get_password_hash(password))

print(secrets.token_hex(32))