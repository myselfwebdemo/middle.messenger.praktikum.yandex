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
import DialogWindow from './components/dialog/dialog';
import UserProfile from './pages/profile/user-profile';
import EditUserProfile from './pages/profile/edit-profile';
import NewPassword from './pages/profile/new-password';
import E from './pages/errors/5';
  
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

// const app = new ChatAPP();
const app = new E({ eSrc: 'error.png', eAlt: "error 500: something went wrong on our end, we're already fixing it.", error: '500' });
renderDOM(app);

// function render(page: string) {
//     const [ src, context ] = pages[page];
//     if (typeof src === "function") {
//         renderDOM(new source({}));
//         return;
//     }
//     const app = document.getElementById('app');
//     const temlpatingFunction = Handlebars.compile(src);
//     // @ts-ignore
//     app.innerHTML = temlpatingFunction(context);
// }
// document.addEventListener('DOMContentLoaded', () => { render('chatapp'); })
