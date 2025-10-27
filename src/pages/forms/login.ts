// @ts-nocheck
import Block from "core/Block";

import Input from "components/input/input";
import Button from "components/button/button";
import { clg } from "main";
import { formInputOnFocus, formInputOnBlur} from "main";
import formValidationHandler from "utils/formValidation";
import SignupPage from "./signup";
import renderDOM from "core/renderDOM";

function validate(e) {
    let isValid;
    if (e.name) {
        const { valid, verdict } = formValidationHandler('login', e.name, e.value, true);
        e.style.borderBottom = verdict ? 'dashed .2vh red' : '';
        document.querySelector(`.input-requirements-mismatch.${e.id}`).textContent = verdict;

        isValid = valid;
    } else {
        const { valid, verdict } = formValidationHandler('login', e.target.name, e.target.value);
        e.target.style.borderBottom = verdict ? 'dashed .2vh red' : '';
        document.querySelector(`.input-requirements-mismatch.${e.target.id}`).textContent = verdict;
        
        isValid = valid;
    }
    return isValid
}

interface loginProps {
    method: string
}

export default class LoginPage extends Block {
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

                    if (validate) return
                }
            },

            ChangeForm: new Button({
                classTypeOfButton: 'tetriary', 
                buttonType: 'button', 
                clientAction: 'Boot New Profile',
            }),
            Login: new Input({
                class: 'form-input',
                id: 'login',
                label: 'Email or username',
                type: 'email',
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
                clientAction: 'Jump In',
            }),
        })
    }
    public render(): string {
        return `
            <div class="header">
                <h1 class="form-title">Login</h1>
                <span class="form-switch">
                    <span>No account? No problem.</span> 
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
