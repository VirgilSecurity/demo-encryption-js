# Encryption Demo JS

Simple demonstration of the virgil encrypted communication

## Browser Requirements

```
IE ✘
Edge ✔ 15+
Firefox ✔ 52+
Chrome ✔ 55+
Safari ✔ 10.1+
Opera ✔ 42+
```

## Prerequisites

To run this demo you will need:

* An account at [Virgil Dashboard](https://developer.virgilsecurity.com/).
* _App_ and _Api Key_ in your Virgil Dashboard account.

## Setup

Clone this repository locally:

```bash
git clone https://github.com/VirgilSecurity/demo-encryption-js.git
```

Move to the project folder:

```bash
cd demo-encryption-js
```

Install dependencies:

```bash
npm install
```

Add config.json file to root folder

```
{
    "API_KEY": "API PRIVATE KEY FROM DASHBOARD",
    "API_KEY_ID": "API KEY ID FROM DASHBOARD",
    "APP_ID": "APP ID FROM DASHBOARD"
}
```

then

```
npm start
```

and open http://localhost:3000 in your web browser
