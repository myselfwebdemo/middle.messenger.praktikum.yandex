import './style.css'
import Handlebars from 'handlebars';
import LoginPage from './pages/forms/login';
import SignupPage from './pages/forms/signup';
import ChatAPP from './pages/chatapp/chatapp';
import E from './pages/errors/error';
import Router from 'core/router';
// import Home from 'pages/app-landing/landing-page';
import Profile from 'pages/profile/profile';
import formValidationHandler from 'utils/formValidation';
import { Storage } from 'core/storage';
import { checkLogin } from 'services/service';
import { SITE_BASE_URL } from './config';
  
export function clg(...i: unknown[]): void {
    console.log(...i);
}

export function formInputOnFocus(e: Event) {
    const inputFields = document.querySelector('.input-fields') as HTMLElement;
    const tar = e.target as HTMLElement;

    for (let i = 0;i<inputFields.children.length; i++) {
        const label = inputFields.children[i].children[0] as HTMLElement;
        if (inputFields.children[i].children[1].id === tar.id) {
            if (i == 0) {
                label.style.transform = 'unset';
            } else {
                const inputTopSpacing = 1.3;
                tar.style.margin = `${inputTopSpacing}vh 0 .2vh 0`;
                label.style.transform = `translateY(${inputTopSpacing}vh)`;
            }
            label.style.fontSize = 'var(--small-font-size)';
        }
    }
}
export function formInputOnBlur(e: Event) {
    const inputFields = document.querySelector('.input-fields') as HTMLElement;
    const tar = e.target as HTMLInputElement;

    for (let i = 0;i<inputFields.children.length; i++) {
        const label = inputFields.children[i].children[0] as HTMLElement;

        if (inputFields.children[i].children[1].id === tar.id && !tar.value) {
            tar.style.margin = '0 0 .2vh 0';
            label.style.transform = 'translateY(2.4vh)';
            label.style.fontSize = 'var(--regular-font-size)';
        }
    }
}
export function validate(e: Event | HTMLInputElement, clear: boolean) {
    const inputEl = e instanceof HTMLInputElement 
        ? e 
        : (e.target as HTMLInputElement);

    const mode = e instanceof HTMLInputElement ? 'signup' : 'login';

    const { valid, verdict } = formValidationHandler(
        clear || false,
        mode,
        inputEl.name,
        inputEl.value,
        e instanceof HTMLInputElement
    );

    inputEl.style.borderBottom = verdict
        ? 'dashed .2vh var(--color-fatal)'
        : '';

    const mismatch = document.querySelector(
        `.input-requirements-mismatch.${inputEl.id}`
    ) as HTMLElement;

    if (mismatch) mismatch.textContent = verdict || '';

    return valid;
}
export function resetForm() {
    document.querySelectorAll('input').forEach(i => {
        validate(i,true);
        i.value = '';
        i.style.margin = '0 0 .2vh 0';

        const label = document.querySelector(`label[for="${i.id}"]`) as HTMLLabelElement;
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
    chats: {},
    eAPI: null,
    sAPI: null,
});

export enum Routes {
    Landing = `${SITE_BASE_URL}/`,
    // LogIn = `${SITE_BASE_URL}/log-in`,
    // signup page uses Landing instead of LogIn
    SignUp = `${SITE_BASE_URL}/sign-up`,
    App = `${SITE_BASE_URL}/messenger`,
    SetUp = `${SITE_BASE_URL}/settings`,
    E404 = `${SITE_BASE_URL}/404`,
    E500 = `${SITE_BASE_URL}/500`,
}
window.router = new Router('#app');

window.router.use(Routes.Landing, LoginPage, {method: 'get'})
            // .use('/', Home)
            // .use(Routes.LogIn, LoginPage, {method: 'get'})
             .use(Routes.App, ChatAPP, {})
             .use(Routes.SignUp, SignupPage, {method: 'post'})
             .use(Routes.SetUp, Profile, { level: 0, user: window.memory.take().user })
             .use(Routes.E404, E, {eSrc: 'error.png', eAlt: 'Error 404: not found', error: '404'})
             .use(Routes.E500, E, {eSrc: 'error.png', eAlt: "Error 500: something went wrong on our end, we're already fixing it", error: '500'})
window.router.start();

await checkLogin();
