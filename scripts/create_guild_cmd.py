import requests
import base64

CLIENT_ID = ''
CLIENT_SECRET = ''

APPLICATION_ID = ''
GUILD_ID = ''

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

json = {
    "name": "blep",
    "type": 1,
    "description": "Send a random adorable animal photo",
    "options": [
        {
            "name": "animal",
            "description": "The type of animal",
            "type": 3,
            "required": True,
            "choices": [
                {
                    "name": "Dog",
                    "value": "animal_dog"
                },
                {
                    "name": "Cat",
                    "value": "animal_cat"
                },
                {
                    "name": "Penguin",
                    "value": "animal_penguin"
                }
            ]
        },
        {
            "name": "only_smol",
            "description": "Whether to show only baby animals",
            "type": 5,
            "required": False
        }
    ]
}

headers = {
    "authorization": "Bearer " + get_token()
}

r = requests.post(url, headers=headers, json=json)
