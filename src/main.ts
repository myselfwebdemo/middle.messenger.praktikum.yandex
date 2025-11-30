// @ts-nocheck
import './style.css'
import Handlebars from 'handlebars';

import LoginPage from './pages/forms/login';
import SignupPage from './pages/forms/signup';
import ChatAPP from './pages/chatapp/chatapp';
import E from './pages/errors/error';
import Router from 'core/router';
import Home from 'pages/app-landing/landing-page';
import Profile from 'pages/profile/profile';
import formValidationHandler from 'utils/formValidation';
import { Storage } from 'core/storage';
import { checkLogin } from 'services/service';
  
export function clg(...i: []): void {
    console.log(...i);
}

export function formInputOnFocus(e) {
    const inputFields = document.querySelector('.input-fields');

    for (let i = 0;i<inputFields.children.length; i++) {
        const label = inputFields.children[i].children[0];
        if (inputFields.children[i].children[1].id === e.target.id) {
            if (i == 0) {
                label.style.transform = 'unset';
            } else {
                const inputTopSpacing = 1.3;
                e.target.style.margin = `${inputTopSpacing}vh 0 .2vh 0`;
                label.style.transform = `translateY(${inputTopSpacing}vh)`;
            }
            label.style.fontSize = 'var(--small-font-size)';
        }
    }
}
export function formInputOnBlur(e) {
    const inputFields = document.querySelector('.input-fields');

    for (let i = 0;i<inputFields.children.length; i++) {
        const label = inputFields.children[i].children[0];

        if (inputFields.children[i].children[1].id === e.target.id && !e.target.value) {
            e.target.style.margin = '0 0 .2vh 0';
            label.style.transform = 'translateY(2.4vh)';
            label.style.fontSize = 'var(--regular-font-size)';
        }
    }
}
export function validate(e, clear) {
    let isValid;
    if (e.name) {
        const { valid, verdict } = formValidationHandler(clear | false,'signup', e.name, e.value, true);
        e.style.borderBottom = verdict ? 'dashed .2vh var(--color-fatal)' : '';
        document.querySelector(`.input-requirements-mismatch.${e.id}`).textContent = verdict;

        isValid = valid;
    } else {
        const { valid, verdict } = formValidationHandler(clear | false,'login', e.target.name, e.target.value);
        e.target.style.borderBottom = verdict ? 'dashed .2vh var(--color-fatal)' : '';
        document.querySelector(`.input-requirements-mismatch.${e.target.id}`).textContent = verdict;
        
        isValid = valid;
    }
    return isValid
}
export function resetForm() {
    document.querySelectorAll('input').forEach(i => {
        validate(i,true);
        i.value = '';
        i.style.margin = '0 0 .2vh 0';

        const label = document.querySelector(`label[for="${i.id}"]`);
        label.style.transform = 'translateY(2.4vh)';
        label.style.fontSize = 'var(--regular-font-size)';
    });
}

Handlebars.registerHelper('isNumber', (value) => {
    return typeof value === 'number' && !isNaN(value)
});
Handlebars.registerHelper('eq', (a,b) => {
    return a === b;
})
Handlebars.registerHelper('deq', (a,b) => {
    return a !== b;
})

window.memory = new Storage({
    loading: false,
    user: {},
    chats: [],
    eAPI: null,
    sAPI: null,
})

export enum Routes {
    Landing = '/',
    // LogIn = '/log-in',
    SignUp = '/sign-up',
    App = '/messenger',
    SetUp = '/settings',
    E404 = '/404',
    E500 = '/500',
}
window.router = new Router('#app');

window.router.use(Routes.Landing, LoginPage, {method: 'get'})
            // .use('/', Home)
            // .use('/log-in', LoginPage, {method: 'get'})
             .use(Routes.App, ChatAPP)
             .use(Routes.SignUp, SignupPage, {method: 'post'})
             .use(Routes.SetUp, Profile, ({ level: 0 }))
             .use(Routes.E404, E, {eSrc: 'error.png', eAlt: 'Error 404: not found', error: '404'})
             .use(Routes.E500, E, {eSrc: 'error.png', eAlt: "Error 500: something went wrong on our end, we're already fixing it", error: '500'})
window.router.start();

await checkLogin();
