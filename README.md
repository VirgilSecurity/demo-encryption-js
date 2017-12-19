# Virgil Simple Encryption and Decryption Demo

A single page React application with Node.js backend demonstrating the use of Virgil Javascript SDK.

> Important! You will need Node.js version >=4.x <6.x. Newer versions are not supported by 
Virgil Crypto library at the time of this writing.

## Prerequisites

To run this demo you will need:

* An account at [Virgil Dashboard](https://developer.virgilsecurity.com/account/dashboard/).
* An _App_ in your Virgil Dashboard account.
* _app id_, _private key_, _private key password_ and _access token_ of your Virgil App. The app id, private key and 
 its password are used to digitally sign the Virgil Cards of your users, thus proving they belong to your application. 
 The Access token is used to authenticate requests to Virgil Cards Service as coming from your app.

## Setup

Clone this repository locally:

```bash
git clone https://github.com/VirgilSecurity/encryption-demo-js.git
```

Move to the project folder:

```bash
cd encryption-demo-js
```

Install dependencies:

```bash
npm install
```

### Configure the server

The server side reads configuration parameters (i.e. app id, private key, etc.) from `.env` file in the root folder.
The following parameters are required for the trigger to work:

| Variable name | Description |
| --- | --- |
| VIRGIL_APP_ID | Id of your app from [Virgil Dashboard](https://developer.virgilsecurity.com/account/dashboard/) |
| VIRGIL_APP_PRIVATE_KEY | Your app's private key as base64-encoded string |
| VRIGIL_APP_PRIVATE_KEY_PASSWORD | Password used to protect the app's private key |
| VIRGIL_APP_ACCESS_TOKEN | Your app's access token for Virgil Services |

To setup locally, copy the `.env.example` file in the root project folder, save it under name `.env`
and fill it in with your app's specific values. Please note, the `.env` file is included in `.gitignore`
because it contains sensitive information and must not be committed into the repo.

```bash
cp .env.example .env
```

### Configure the client

All of the client side code is currently in the `index.html` file in the `public` folder. It is written in ES6 and 
uses [babel-sandalone](https://github.com/babel/babel-standalone) to compile the code in real-time in your browser,
so there is no configuration necessary. 

### Start the server

```bash
npm start
```

Open `http://localhost:8888` in your web browser