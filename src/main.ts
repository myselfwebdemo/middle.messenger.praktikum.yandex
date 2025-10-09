// @ts-nocheck
import './style.css'
import Handlebars, { log } from 'handlebars';
import * as Components from './components';
import * as Pages from './pages/';

Handlebars.registerHelper('isNumber', (value) => {
    return typeof value === 'number' && !isNaN(value)
});
Handlebars.registerHelper('eq', (a,b) => {
    return a === b;
})

Object.entries(Components).forEach(([ name,tmpl ]) => {
    Handlebars.registerPartial(name,tmpl);
});

function clog(x) {
    console.log(x);
}

const UserProfileSettingLineContext = {
    upPSLcontext: [
        { trait: "Email", profileInputIdentifier: "email", value: "user-email@domain.com" },
        { trait: "Name", profileInputIdentifier: "profile_first_name", value: "User name" },
        { trait: "Surname", profileInputIdentifier: "profile_second_name", value: "User surname" },
        { trait: "Username (name that others see)", profileInputIdentifier: "profile_login", value: "Username" },
        { trait: "Phone", profileInputIdentifier: "profile_phone", value: "+112223334455" },
    ]
};
const pages = {
    'login': [Pages.loginPage],
    'signup': [Pages.signupPage],
    'nav': [Pages.nav],
    'e404': [Pages.e404Page],
    'e5': [Pages.e5Page],
    'chatapp': [Pages.chatApp],
    'userprofile': [Pages.UserProfile, UserProfileSettingLineContext],
    'upediti': [Pages.UPeditProfile, UserProfileSettingLineContext],
    'uppass': [Pages.UPchangePass],
}

function render(page: string) {
    const [ src, context ] = pages[page];
    const app = document.getElementById('app');
    const temlpatingFunction = Handlebars.compile(src);
    // @ts-ignore
    app.innerHTML = temlpatingFunction(context);

    document.removeEventListener('click', navigate);
    if (page == 'login' || page == 'signup') {

        const inputs = document.querySelectorAll('input');
        const labels = document.querySelectorAll('label');
        
        for (let i = 0; i<inputs.length; i++) {
            inputs[i].addEventListener('focus', () => {
                if (i>0) {
                    inputs[i].style.margin = '3vh 0 .2vh 0';
                    labels[i].style.transform = 'translateY(3vh)';
                } else {
                    labels[i].style.transform = 'unset';
                }
                labels[i].style.textAlign = 'left';
                labels[i].style.fontSize = 'small';
            });
            inputs[i].addEventListener('blur', () => {
                if (!inputs[i].value) {
                    inputs[i].style.margin = '0 0 .2vh 0';
                    labels[i].style.transform = 'translateY(2.4vh)';
                    labels[i].style.fontSize = 'medium';
                }
            });
        }
    } else if (page == 'nav') {
        document.addEventListener('click', navigate);
    } else if (page == 'chatapp') {
        document.body.style.background = 'none';
        drops(); 
        activateSearch();
        sendMessage();

        const searchContainer = document.querySelector('#search-container');
        const search = document.querySelector('#search');
        const searchIMG = document.querySelector('#search-container img');

        search.addEventListener('focus', () => {
            search.style.textAlign = 'left';
            search.style.marginLeft = '.9vh';
            searchIMG.style.marginLeft = '1vw';
            searchContainer.style.justifyContent = 'left';
            search.style.width = '100%'
        })
        search.addEventListener('blur', () => {
            if (search.value.length == 0) {
                search.style.width = '3vw';
                search.style.textAlign = 'center';
                search.style.marginLeft = 'none';
                searchIMG.style.marginLeft = 'none';
                searchContainer.style.justifyContent = 'center';
            }
        })
        document.querySelector('.toprofile').addEventListener('click', () => {
            render('userprofile');
        })
    } else if (page == 'userprofile') {
        const ppcTrigger = document.querySelector('.profile-icon-wrapper');
        ppcTrigger.addEventListener('click', dialogOpen);

        document.querySelector('.back-btn').addEventListener('click', () => {
            render('chatapp');
        })
    }
}

const navigate = (e: Event) => {
    const page = e.target.getAttribute('page');
    render(page);
}

function activateSearch() {
    const search = document.querySelector('#search');
    const chatCards = document.querySelectorAll('.chat-card');
    
    if (search) {
        console.log('Search activated.')
        search.addEventListener('input', () => {
            const term = search.value.toLowerCase();
            
            chatCards.forEach(card => {
                console.log(card.dataset);
                const recipients = card.dataset.recipient.toLowerCase();
                const lastMessages = card.dataset.lastMessage.toLowerCase();
            
                if (recipients.includes(term) || lastMessages.includes(term)) {
                    card.parentElement.style.display = 'block';
                } else {
                    card.parentElement.style.display = 'none';
                }
            });
        });
    }
}
function drops() {
    const dropdown = document.querySelector('.action-to-recipient');
    const dropTriggers = document.querySelectorAll('.drop-btn');
    const atrChoice = document.querySelector('.atr-choice');
    const abcChoice = document.querySelector('.abc-choice');
    const atrLi = document.querySelector('.atr-li');
    const dialogWrapper = document.querySelector('.dialog-wrapper');

    dropTriggers.forEach(trig => {
        trig.addEventListener('click', e => {
            if (e.target.closest('._action-to-recipient')) {
                atrChoice.style.display = atrChoice.style.display === 'block' ? 'none' : 'block';
                abcChoice.style.display = 'none';
            }
            if (e.target.closest('._add-btn')) {
                abcChoice.style.display = abcChoice.style.display === 'block' ? 'none' : 'block';
                atrChoice.style.display = 'none';
            }
        });
    });
    atrLi.addEventListener('click', dialogOpen);
    document.addEventListener('click', (e) => {   
        if (!e.target.closest('._action-to-recipient') && !e.target.closest('._atr-choice')) {
            atrChoice.style.display = 'none';
        }
        if (!e.target.closest('._add-btn')) {
            abcChoice.style.display = 'none';
        }
    });
}
function sendMessage() {
    const chatSendForm = document.getElementById('chat-send-form');
    const prompt = document.getElementById('message');
    const sendBtn = document.querySelector('.button._send');
    const messages = document.querySelector('.messages');

    const messageTmpl = Handlebars.compile(Components.message);

    chatSendForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const promptContent = prompt.value.trim();
        if (promptContent && promptContent !== 'Enter your message!') {
            const message = {
                mesType: 'text',
                fromYou: true,
                mesContent: promptContent,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            messages.insertAdjacentHTML('beforeend', messageTmpl(message));
            messages.scrollTop = messages.scrollHeight;
            prompt.value = '';
        } else {
            prompt.value = 'Enter your message!';
        }
    });
    prompt.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendBtn.click();
        }
    });
}

function dialogOpen() {
    const dialogWrapper = document.querySelector('.dialog-wrapper');
    dialogWrapper.style.display = dialogWrapper.style.display === 'flex' ? 'none' : 'flex';
    if (dialogWrapper.style.display === 'flex') {
        dialogWrapper.addEventListener('click', dialogClose);
    }
}
function dialogClose(e) {
    const dialogWrapper = document.querySelector('.dialog-wrapper');
    if (!e.target.closest('.dialog')) {
        dialogWrapper.style.display = 'none';
        dialogWrapper.removeEventListener('click', dialogClose)
    }
}



document.addEventListener('DOMContentLoaded', () => { render('nav'); })

