// @ts-nocheck
import './style.css'
import Handlebars, { log } from 'handlebars';
import * as Components from './components';
import * as Pages from './pages/';

import renderDOM from './core/renderDOM';
import LoginPage from './pages/forms/login';
import SignupPage from './pages/forms/signup';
import ChatAPP from './pages/chatapp/chatapp';
import ChatList from './pages/chatapp/chat-list';
import ChatCard from './components/chat-card/chat-card';
  
export function clg(...i: any[]): void {
    console.log(...i);
}
export function FormInputOnFocus(e) {
    const parentOfParentElOfCurrentInput = e.target.parentElement.parentElement;

    for (let i = 0;i<parentOfParentElOfCurrentInput.children.length; i++) {
        const label = parentOfParentElOfCurrentInput.children[i].children[0];
        if (parentOfParentElOfCurrentInput.children[i].children[1].id === e.target.id) {
            if (i == 0) {
                label.style.transform = 'unset';
            } else {
                const inputTopSpacing = 1.3;
                e.target.style.margin = `${inputTopSpacing}vh 0 .2vh 0`;
                label.style.transform = `translateY(${inputTopSpacing}vh)`;
            }
            label.style.fontSize = 'small';
        }
    }
}
export function FormInputOnBlur(e) {
    const parentOfParentElOfCurrentInput = e.target.parentElement.parentElement;

    for (let i = 0;i<parentOfParentElOfCurrentInput.children.length; i++) {
        const label = parentOfParentElOfCurrentInput.children[i].children[0];

        if (parentOfParentElOfCurrentInput.children[i].children[1].id === e.target.id && !e.target.value) {
            e.target.style.margin = '0 0 .2vh 0';
            label.style.transform = 'translateY(2.4vh)';
            label.style.fontSize = 'medium';
        }
    }
}

Handlebars.registerHelper('isNumber', (value) => {
    return typeof value === 'number' && !isNaN(value)
});
Handlebars.registerHelper('eq', (a,b) => {
    return a === b;
})

Object.entries(Components).forEach(([ name,tmpl ]) => {
    if (typeof tmpl === 'function') {
        return;
    }
    Handlebars.registerPartial(name,tmpl);
});

const capp = new ChatAPP();
renderDOM(capp);

window.MyApp = capp;
window.CL = capp.children['ChatList']

let k = 2;

window.addEventListener('keydown', (e) => {
    if (e.key=== 'k') {
        let nun = Math.floor(Math.random()*10);
        if (nun === 0) {
            CL.addChildren(new ChatCard({ src: 'profile/example.png', recipientName: `Recipient ${k}` }), `CC${k}`);
        } else {
            CL.addChildren(new ChatCard({ src: 'profile/example.png', recipientName: `Recipient ${k}`, time: `${Math.floor(Math.random()*12)}:${Math.floor(Math.random()*60)}`, unread: nun }), `CC${k}`);
        }
        k++;
    }
    if (e.key === 'd') {
        CL.removeChildren(`CC${k-1}`);
        k--
    }
});


// Other pages that you can render:
//  renderDOM(new LoginPage({method: 'get'}))
//  renderDOM(new SignupPage({method: 'post'}))
//  renderDOM(new ChatAPP())


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
    'e404': [Pages.e404Page],
    'e5': [Pages.e5Page],
    'chatapp': [Pages.chatApp],
    'userprofile': [Pages.UserProfile, UserProfileSettingLineContext],
    'upediti': [Pages.UPeditProfile, UserProfileSettingLineContext],
    'uppass': [Pages.UPchangePass],
}

function render(page: string) {
    const [ src, context ] = pages[page];
    if (typeof src === "function") {
        renderDOM(new source({}));
        return;
    }
    const app = document.getElementById('app');
    const temlpatingFunction = Handlebars.compile(src);
    // @ts-ignore
    app.innerHTML = temlpatingFunction(context);

    document.removeEventListener('click', navigate);
    if (page == 'login' || page == 'signup') {
        skip
    } else if (page == 'chatapp') {
        document.body.style.background = 'none';
        drops(); 
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
    if (e.target.getAttribute('page')) {
        const page = e.target.getAttribute('page');
        render(page);
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



// document.addEventListener('DOMContentLoaded', () => { render('signup'); })

