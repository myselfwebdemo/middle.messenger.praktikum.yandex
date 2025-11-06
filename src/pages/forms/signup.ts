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
import transport from "core/APIs/api";

interface signupProp {
    method: string
}

class SignupPage extends Block {
    constructor(props: signupProp) {
        super('form', {
            ...props,
            userid: '',
            formState: {
                email: '',
                login: '',
                first_name: '',
                second_name: '',
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
                    formInputOnFocus(e)
                },
                focusout: (e) => {
                    formInputOnBlur(e)
                },
                input: (e) => {
                    validate(e.target)
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
                            first_name: inputEls[2].value,
                            second_name: inputEls[3].value,
                            phone: inputEls[4].value,
                            password: inputEls[5].value,
                        }
                    })

                    clg(this.props.formState);

                    if (this.getContent().checkValidity()) {
                        const a = new transport('auth');

                        // a.get('/signin', {login: ''})
                        a.post('/signup', { data: this.props.formState }).then((res) => {
                            clg('SIGN UP response: ', res.id);
                            this.props.userid = res.id;

                            if (res.id) {
                                this.props.router.go('/messenger');
                            }
                            // if (res.status === 200) {
                            //     clg('Sent request to signin');
                            //     a.get('/signin', {
                            //         login: this.props.formState.login, 
                            //         password: this.props.formState.password
                            //     }).then((res)=>{
                            //         clg('SIGN IN response: ',res.status);
                                    
                            //         clg('Retrieving user info');
                            //         a.get('/user').then((res)=>clg(res)).catch((e)=>clg(e));
                            //     }).catch((e)=>clg(e));
                            // }
                        }).catch((e) => clg(e))
                        return
                    }
                }
            },

            ChangeForm: new Button({
                classTypeOfButton: 'tetriary', 
                buttonType: 'button', 
                clientAction: 'Get In',
                events: {
                    click: () => {
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

export default injectRouter(SignupPage);
