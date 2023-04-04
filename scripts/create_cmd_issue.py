import requests
import base64

from os import environ as env

CLIENT_ID = env["CLIENT_ID"]
CLIENT_SECRET = env["CLIENT_SECRET"]

APPLICATION_ID = env["APPLICATION_ID"]
GUILD_ID = env["GUILD_ID"]

def get_token():
    data = {
        'grant_type': 'client_credentials',
        'scope': 'applications.commands.update'
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    r = requests.post('https://discord.com/api/v8/oauth2/token', data=data, headers=headers, auth=(CLIENT_ID, CLIENT_SECRET))
    r.raise_for_status()
    return r.json()['access_token']

url = f"https://discord.com/api/v8/applications/{APPLICATION_ID}/guilds/{GUILD_ID}/commands"

print(CLIENT_ID)

json = {
    "name": "issue",
    "type": 3, #message 
}

headers = {
    "authorization": "Bearer " + get_token()
}

r = requests.post(url, headers=headers, json=json)
print(r.status_code)
print(r.text)
