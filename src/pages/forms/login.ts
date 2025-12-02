import Block from "core/Block";
import './form.css';

import Input from "components/input/input";
import Button from "components/button/button";
import { resetForm, Routes, validate } from "main";
import { formInputOnFocus, formInputOnBlur} from "main";
import { injectRouter } from "utils/injectRouter";
import { login } from "../../services/service";
import { linkStorage } from "utils/link-storage";
import type Router from "core/router";

export interface loginProps {
    method: string
    formState: {
        login: string,
        password: string,
    }
    router: Router
}

class LoginPage extends Block<loginProps, Record<string,Block>> {
    constructor(props: loginProps) {
        super('div', {
            ...props,
            attrs: {
                method: props.method,
                novalidate: true
            }, 
            events: {
                focusin: (e: Event) => {
                    formInputOnFocus(e)
                },
                focusout: (e: Event) => {
                    formInputOnBlur(e)
                },
                input: (e: Event) => {
                    validate(e,false);
                },
                submit: async (e: Event) => {
                    e.preventDefault();

                    let validation;
                    for (const e of ((this._element as unknown as HTMLElement).lastElementChild as HTMLFormElement).elements) {
                        if (e instanceof HTMLInputElement) {
                            if (!validate(e,false)) {
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
                        this.props.router.go(Routes.SignUp);
                    }
                }
            }),
            Login: new Input({
                class: 'form-input',
                id: 'login',
                label: 'Username',
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

const extraProps = (wm: Partial<MemoryBI>) => {
    return {
        loading: wm.loading,
        reqFail: wm.eAPI
    }
}
 
export default linkStorage(extraProps)(injectRouter(LoginPage));
