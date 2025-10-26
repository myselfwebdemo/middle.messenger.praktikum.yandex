// @ts-nocheck
import Block from "../../core/Block";

import Input from "../../components/input/input";
import Button from "../../components/button/button";
import { clg } from "../../main";
import { FormInputOnFocus, FormInputOnBlur} from "../../main";
import FormValidationHandler from "../../utils/formValidation";
import renderDOM from "../../core/renderDOM";
import LoginPage from "./login";

function validate(e) {
    let isValid;
    if (e.name) {
        const { valid, verdict } = FormValidationHandler('signup', e.name, e.value, true);
        e.style.borderBottom = verdict ? 'dashed .2vh red' : '';
        document.querySelector(`.input-requirements-mismatch.${e.id}`).textContent = verdict;

        isValid = valid;
    } else {
        const { valid, verdict } = FormValidationHandler('login', e.target.name, e.target.value);
        e.target.style.borderBottom = verdict ? 'dashed .2vh red' : '';
        document.querySelector(`.input-requirements-mismatch.${e.target.id}`).textContent = verdict;
        
        isValid = valid;
    }
    return isValid
}

interface signupProp {
    class: string
    method: string
}

export default class SignupPage extends Block {
    constructor(props: signupProp) {
        super('form', {
            ...props,
            formState: {
                email: '',
                login: '',
                firstName: '',
                secondName: '',
                phone: '',
                password: '',
            },
            className: 'form',
            attrs: {
                method: props.method,
                novalidate: true
            }, 
            events: {
                focusin: (e) => {
                    FormInputOnFocus(e)
                },
                focusout: (e) => {
                    FormInputOnBlur(e)
                },
                input: (e) => {
                    const { verdict } = FormValidationHandler('signup', e.target.name, e.target.value);
                    e.target.style.borderBottom = verdict ? 'dashed .2vh red' : '';
                    document.querySelector(`.input-requirements-mismatch.${e.target.id}`).textContent = verdict;
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
                            email: inputEls[0].value,
                            login: inputEls[1].value,
                            firstName: inputEls[2].value,
                            secondName: inputEls[3].value,
                            phone: inputEls[4].value,
                            password: inputEls[5].value,
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
                id: 'email',
                label: 'Email',
                type: 'email',
                name: 'email',
                required: true,
                mismatchObject: 'input-requirements-mismatch email',
            }),
            Username: new Input({
                class: 'form-input',
                id: 'login',
                label: 'Username',
                type: 'text',
                name: 'login',
                mismatchObject: 'input-requirements-mismatch login',
            }),
            FirstName: new Input({
                class: 'form-input',
                id: 'first_name',
                label: 'First Name',
                type: 'text',
                name: 'first_name',
                required: true,
                mismatchObject: 'input-requirements-mismatch first_name',
            }),
            SecondName: new Input({
                class: 'form-input',
                id: 'second_name',
                label: 'Second Name',
                type: 'text',
                name: 'second_name',
                required: true,
                mismatchObject: 'input-requirements-mismatch second_name',
            }),
            Phone: new Input({
                class: 'form-input',
                id: 'phone',
                label: 'Phone Number',
                type: 'tel',
                name: 'phone',
                required: true,
                mismatchObject: 'input-requirements-mismatch phone',
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
            PasswordRep: new Input({
                class: 'form-input',
                id: 'password-rep',
                label: 'Password (again)',
                type: 'password',
                name: 'password-rep',
                required: true,
                mismatchObject: 'input-requirements-mismatch password-rep',
            }),
            Submit: new Button({
                classTypeOfButton: 'primary', 
                buttonType: 'submit', 
                clientAction: 'Get Started',
            }),
        })
    }
    public render(): string {
        return `
            <div class="header">
                <h1 class="form-title">Join</h1>
                <span class="form-switch">
                    <span>Part of a hub?</span> 
                    {{{ ChangeForm }}}
                </span>
            </div>
            <div class="input-fields">
                {{{ Login }}}
                {{{ Username }}}
                {{{ FirstName }}}
                {{{ SecondName }}}
                {{{ Phone }}}
                {{{ Password }}}
                {{{ PasswordRep }}}
            </div>
            {{{ Submit }}}
        `
    }
}
