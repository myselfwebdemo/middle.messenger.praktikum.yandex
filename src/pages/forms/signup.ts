// @ts-nocheck
import Block from "core/Block";
import './form.css';

import Input from "components/input/input";
import Button from "components/button/button";
import { clg, resetForm, validate } from "main";
import { formInputOnFocus, formInputOnBlur} from "main";
import renderDOM from "core/renderDOM";
import LoginPage from "./login";
import { injectRouter } from "utils/injectRouter";
import endPointAPI from "core/APIs/api";
import { linkStorage } from "utils/link-storage";
import { signup, login } from "../../services/service";
import Fatal from "components/dialog/fatal";

interface signupProp {
    method: string
}

class SignupPage extends Block {
    constructor(props: signupProp) {
        super('div', {
            ...props,
            formState: {
                email: '',
                login: '',
                display_name: '',
                first_name: '',
                second_name: '',
                phone: '',
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
                    validate(e.target)
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
                                email: inputEls[0].value,
                                login: inputEls[1].value,
                                display_name: [inputEls[2].value, inputEls[3].value].join(' '),
                                first_name: inputEls[2].value,
                                second_name: inputEls[3].value,
                                phone: inputEls[4].value,
                                password: inputEls[5].value,
                            }
                        });

                        document.querySelectorAll('input').forEach(i => {i.value = ''; i.style.margin = '0 0 .2vh 0'});
                        document.querySelectorAll('label').forEach(l => {l.style.transform = 'translateY(2.4vh)'; l.style.fontSize = 'var(--regular-font-size)'});
                        await signup(this.props.formState);
                    }
                }
            },

            ChangeForm: new Button({
                classTypeOfButton: 'tetriary', 
                buttonType: 'button', 
                clientAction: 'Get In',
                events: {
                    click: () => {
                        window.memory.give({eAPI:null});
                        resetForm();
                        this.props.router.go('/login');
                    }
                }
            }),
            Login: new Input({
                class: 'form-input',
                id: 'email',
                label: 'Email',
                type: 'email',
                name: 'email',
                required: true,
                mismatchObject: 'input-requirements-mismatch email',

                value: 'example@gmail.com'
            }),
            Username: new Input({
                class: 'form-input',
                id: 'login',
                label: 'Username',
                type: 'text',
                name: 'login',
                required: true,
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

                value: 'ExampleName'
            }),
            SecondName: new Input({
                class: 'form-input',
                id: 'second_name',
                label: 'Second Name',
                type: 'text',
                name: 'second_name',
                required: true,
                mismatchObject: 'input-requirements-mismatch second_name',
                
                value: 'ExampleSurname'
            }),
            Phone: new Input({
                class: 'form-input',
                id: 'phone',
                label: 'Phone Number',
                type: 'tel',
                name: 'phone',
                required: true,
                mismatchObject: 'input-requirements-mismatch phone',

                value: '+7-916-111-11-11'
            }),
            Password: new Input({
                class: 'form-input',
                id: 'password',
                label: 'Password',
                type: 'password',
                name: 'password',
                required: true,
                mismatchObject: 'input-requirements-mismatch password',

                value: 'Password1'
            }),
            PasswordRep: new Input({
                class: 'form-input',
                id: 'password-rep',
                label: 'Password (again)',
                type: 'password',
                name: 'password-rep',
                required: true,
                mismatchObject: 'input-requirements-mismatch password-rep',

                value: 'Password1'
            }),

            Submit: new Button({
                classTypeOfButton: 'primary', 
                buttonType: 'submit', 
                clientAction: 'Get Started'
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

            {{{ SuggestAutoLogin }}}
            <form class="form">
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

export default linkStorage(extraProps)(injectRouter(SignupPage));
