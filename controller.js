
class Controller {
    constructor(model) {
        this.model = model;
        this.isLogged = false;
        
        this.identityInput = document.getElementById('identity-input');
        this.recipientIdentityInput = document.getElementById('recipient-identity');
        this.loginForm = document.querySelector('.login-form');
        this.encryptForm = document.getElementById('encrypt-form');
        this.decryptForm = document.getElementById('decrypt-form');
        
        this.radios = document.querySelectorAll('input[name="action"]');
        this.encryptArea = document.getElementById('encrypt-area');
        this.decryptArea = document.getElementById('decrypt-area');
        
        this.loginForm.onsubmit = this.login;
        this.encryptForm.onsubmit = this.encrypt;
        this.decryptForm.onsubmit = this.decrypt;
        this.radios.forEach(radio => radio.onchange = this.changeAction);
    }

    login = async (e) => {
        e.preventDefault();

        const identity = this.identityInput.value;
        this.model.configure(identity);
        const cards = await this.model.searchCards(identity);

        if (!cards.length) await this.model.createCard(identity);
        
        this.loginForm.classList.add('hidden');
    }

    changeAction = (e) => {
        if (e.target.value === 'encrypt') {
            this.decryptForm.classList.add('hidden');
            this.encryptForm.classList.remove('hidden');
        } else {
            this.encryptForm.classList.add('hidden');
            this.decryptForm.classList.remove('hidden');
        }
    }

    encrypt = async (e) => {
        e.preventDefault();
        const message = this.encryptArea.value;
        const recipientIdentity = this.recipientIdentityInput.value;
        let encrypted;
        try {
            encrypted = await this.model.encrypt(message, recipientIdentity);
        } catch (error) {
            console.error(error);
        }
        prompt('encrypted message:', encrypted);
    }


    decrypt = async (e) => {
        e.preventDefault();
        const decrypted = this.decryptArea.value;
        let message;
        try {
            message = await this.model.decrypt(decrypted);
        } catch (error) {
            console.log(error);
        }

        alert(message);
    }
}

const controller = new Controller(new Model());
