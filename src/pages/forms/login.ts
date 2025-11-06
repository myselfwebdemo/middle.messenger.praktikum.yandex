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
import transport from "core/APIs/api";
import { checkLogin, login } from "../../services/auth-service";
import { linkStorage } from "utils/link-storage";

interface loginProps {
    method: string
}

class LoginPage extends Block {
    constructor(props: loginProps) {
        super('form', {
            ...props,
            formState: {
                login: '',
                password: '',
            },
            className: 'form',
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
                submit: (e) => {
                    e.preventDefault();

                    let validation;

                    for (const e of this._element.elements) {
                        if (e instanceof HTMLInputElement) {
                            if (!e.checkValidity()) {
                                validation = validate(e);
                                this._element.reportValidity();
                            }
                        }
                    }
                    
                    const inputEls = document.querySelectorAll('input');
                    this.setProps({
                        formState: {
                            ...this.props.formState,
                            login: inputEls[0].value,
                            password: inputEls[1].value
                        }
                    })
                    clg(this.props.formState);

                    if (this.getContent().checkValidity()) {
                        login(this.props.formState);
                        return
                    }
                },
            },

            ChangeForm: new Button({
                classTypeOfButton: 'tetriary', 
                buttonType: 'button', 
                clientAction: 'Boot New Profile',
                events: {
                    click: () => {
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
                    <video src="/assets/loader.mp4"></video>
                </div>
            {{/if}}
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
        `
    }
}

const r = (fromStoreState) => {
    return {
        loading: fromStoreState.loading,
        // error: fromStoreState.eAPI
    }
}
export default linkStorage(r)(injectRouter(LoginPage));
