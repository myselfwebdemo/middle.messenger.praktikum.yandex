// @ts-nocheck
import Block from "core/Block";
import './form.css';

import Input from "components/input/input";
import Button from "components/button/button";
import { clg, resetForm, validate } from "main";
import { formInputOnFocus, formInputOnBlur} from "main";
import SignupPage from "./signup";
import renderDOM from "core/renderDOM";
import { injectRouter } from "utils/injectRouter";
import endPointAPI from "core/APIs/api";
import { login } from "../../services/service";
import { linkStorage } from "utils/link-storage";

interface loginProps {
    method: string
}

class LoginPage extends Block {
    constructor(props: loginProps) {
        super('div', {
            ...props,
            formState: {
                login: '',
                password: '',
            },
            attrs: {
                method: props.method,
                novalidate: true
            }, 
            events: {
                focusin: (e) => {
                    formInputOnFocus(e)
                },
                focusout: (e) => {
                    formInputOnBlur(e)
                },
                input: (e) => {
                    validate(e)
                },
                submit: async (e) => {
                    e.preventDefault();

                    let validation;
                    for (const e of this._element.lastElementChild.elements) {
                        if (e instanceof HTMLInputElement) {
                            if (!validate(e)) {
                                validation = false;
                                break
                            }
                            validation = true;
                        }
                    }
                    
                    if (validation) {
                        const inputEls = document.querySelectorAll('input');
                        this.setProps({
                            formState: {
                                ...this.props.formState,
                                login: inputEls[0].value,
                                password: inputEls[1].value
                            }
                        })
    
                        document.querySelectorAll('input').forEach(i => {i.value = ''; i.style.margin = '0 0 .2vh 0'});
                        document.querySelectorAll('label').forEach(l => {l.style.transform = 'translateY(2.4vh)'; l.style.fontSize = 'var(--regular-font-size)'});
                        await login(this.props.formState);
                    }
                }
            },

            ChangeForm: new Button({
                classTypeOfButton: 'tetriary', 
                buttonType: 'button', 
                clientAction: 'Boot New Profile',
                events: {
                    click: () => {
                        window.memory.give({eAPI:null});
                        resetForm();
                        this.props.router.go('/signup');
                    }
                }
            }),
            Login: new Input({
                class: 'form-input',
                id: 'login',
                label: 'Email or username',
                type: 'text',
                name: 'login',
                required: true,
                mismatchObject: 'input-requirements-mismatch login',
            }),
            Password: new Input({
                class: 'form-input',
                id: 'password',
                label: 'Password',
                type: 'password',
                name: 'password',
                required: true,
                mismatchObject: 'input-requirements-mismatch password',
            }),

            Submit: new Button({
                classTypeOfButton: 'primary', 
                buttonType: 'submit', 
                clientAction: 'Jump In'
            }),
        })
    }
    public render(): string {
        return `
            {{#if loading}}
                <div class="loader-wrapper">
                    <div class="global-loader-wrapper">
                        <div class="global-loader"></div>
                    </div>
                </div>
            {{/if}}

            {{#if reqFail}}
                <div class="api-req-res-notif arrn-fail">
                    <p>{{ reqFail }}</p>
                    <img src='/assets/fail.png'>
                </div>
            {{/if}}

            <div style="position:absolute;top:50%;left:3%;transform:translateY(-50%);">
                <h2 style="margin-bottom:1vh;">Users:</h2>
                <table border="1" style="border:solid 1px blueviolet;width:25vw;height:20vh;text-align:center;">
                    <tr>
                        <td>Username</td>
                        <td>Password</td>
                        <td>Auto-Paste</td>
                    </tr>
                    <tr>
                        <td>Warbu</td>
                        <td rowspan="3">Password1</td>
                        <td><button onclick="document.querySelectorAll('label').forEach(el => {el.style.fontSize='small';el.style.transform='unset';});login.value='Warbu';password.value='Password1';" style="background:blueviolet;text-decorations:none;padding:.5vw;width:4vw;border-radius:1vh;color:white;">Use</button></td>
                    </tr>
                    <tr>
                        <td>Myskoi</td>
                        <td><button onclick="document.querySelectorAll('label').forEach(el => {el.style.fontSize='small';el.style.transform='unset';});login.value='Myskoi';password.value='Password1';" style="background:blueviolet;text-decorations:none;padding:.5vw;width:4vw;border-radius:1vh;color:white;">Use</button></td>
                    </tr>
                    <tr>
                        <td>my1000thusername</td>
                        <td><button onclick="document.querySelectorAll('label').forEach(el => {el.style.fontSize='small';el.style.transform='unset';});login.value='my1000thusername';password.value='Password1';" style="background:blueviolet;text-decorations:none;padding:.5vw;width:4vw;border-radius:1vh;color:white;">Use</button></td>
                    </tr>
                </table>
            </div>

            <form class="form">
                <div class="header">
                    <h1 class="form-title">Login</h1>
                    <span class="form-switch">
                        <span>No account? No problem –</span> 
                        {{{ ChangeForm }}}
                    </span>
                </div>
                <div class="input-fields">
                    {{{ Login }}}
                    {{{ Password }}}
                </div>
                {{{ Submit }}}
            </form>
        `
    }
}

const extraProps = (wm) => {
    return {
        loading: wm.loading,
        reqFail: wm.eAPI
    }
}
 
export default linkStorage(extraProps)(injectRouter(LoginPage));
