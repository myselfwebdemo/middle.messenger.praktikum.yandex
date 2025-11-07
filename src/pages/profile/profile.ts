import Block from "core/Block";
import './profile.css';

import Button from 'components/button/button';
import DialogWindow from 'components/dialog/dialog';
import Image from 'components/image/image';
import PSL from 'components/profile-info/psl';
import type Router from "core/router";
import Fatal from "components/dialog/fatal";
import { logout } from "../../services/auth-service";

interface Level { level: number }

export default class Profile extends Block {
    constructor(props: Level) {
        const singlePageProps = {
            // @ts-ignore
            router: window.router,
            toLevel: (nl: number) => {
                // @ts-ignore
                this.children.page = p[nl.toString()];
                this._render();
            }
        }
        const p = {
            '0': new ProfileLanding(singlePageProps),
            '1': new EditProfile(singlePageProps),
            '2': new SetNewPassword(singlePageProps),
        }

        super('div', {
            ...props,
            className: 'profile-wrapper',
                        
            ...(props.level === 0 ? { page: new ProfileLanding(singlePageProps) } : {}),
            ...(props.level === 1 ? { page: new EditProfile(singlePageProps) } : {}),
            ...(props.level === 2 ? { page: new SetNewPassword(singlePageProps) } : {}),

            events: {
                submit: (e: Event) => {
                    e.preventDefault();
                    alert('attemped to submit');
                }
            }
        });
    }
    public render(): string {
        return `
            {{{ page }}}
        `
    }
}

interface ProfilePagesProps { 
    router: Router,
    toLevel: (nl: number) => void
};

class ProfileLanding extends Block {
    constructor(props: ProfilePagesProps) {
        super('div', {
            ...props,
            className: 'profile profile-origin',
            events: {
                click: (e: Event) => {
                    // @ts-ignore
                    if (e.target.closest('.profile-icon-wrapper')) {
                        // @ts-ignore
                        this.children.dialog.show();
                    }
                }
            },

            ReturnBack: new Button({
                classTypeOfButton: 'send back-btn',
                buttonType: 'button',
                typeIMG: true,
                src: 'back.png',
                events: {
                    click: () => {
                        this.props.router.go('/messenger');
                    }
                }
            }),
            ProfileIcon: new Image({
                class: 'profile-icon',
                src: '/profile/example.png',
                alt: 'profile picture'
            }),

            l: new PSL({
                trait: 'Email', traitValue: 'user-email@domain.com'
            }),
            l1: new PSL({
                trait: 'Name', traitValue: 'User Name'
            }),
            l2: new PSL({
                trait: 'Surname', traitValue: 'User Surname'
            }),
            l3: new PSL({
                trait: 'Username', traitValue: 'usexample2000kill'
            }),
            l4: new PSL({
                trait: 'Phone', traitValue: '+112223334455'
            }),

            optionEditThis: new Button({
                classTypeOfButton: 'c2-primary',
                buttonType: 'button',
                clientAction: 'Edit profile',
                events: {
                    click: () => {
                        this.props.toLevel(1);
                    }
                }
            }),
            optionEditPassword: new Button({
                classTypeOfButton: 'c2-primary',
                buttonType: 'button',
                clientAction: 'Edit password',
                events: {
                    click: () => {
                        this.props.toLevel(2);
                    }
                }
            }),
            LogOut: new Button({
                classTypeOfButton: 'fatal-secondary',
                buttonType: 'button',
                clientAction: 'Log out',
                events: {
                    click: () => {
                        // @ts-ignore
                        this.children.ConfirmLogOut.show();
                    }
                }
            }),

            dialog: new DialogWindow({
                title: 'Choose image',
                class: 'dialog-simple-input',

                id: 'file-submit',
                name: 'file-submit',
                type: 'file',
                label: 'New avatar',

                executiveAction: 'Change'
            }),
            ConfirmLogOut: new Fatal({
                title: 'Log Out?',
                mainMessage: 'Logging out will end your current session. You’ll need to sign in again to restore access.',
                extratip: 'All your messages and account data remain securely stored on our servers.',
                finalAction: 'Log Out',
                finalEvent: {
                    click: () => {
                        logout();
                    }
                }
            }),
        })
    }
    public render(): string {
        return `
            {{{ ReturnBack }}}

            <div class="profile-icon-wrapper">
                {{{ ProfileIcon }}}
            </div>
            <h1 id="profile_user_fullname">user name</h1>
            <div class="paw"> {{!-- PAW: profile action wrapper --}}
                <div class="ps-lines">
                    {{{ l }}} {{{ l1 }}} {{{ l2 }}} {{{ l3 }}} {{{ l4 }}}
                </div>
                <div class="profile-action">
                    {{{ optionEditThis }}}
                    {{{ optionEditPassword }}}
                    {{{ LogOut }}}
                </div>
            </div>
            {{{ dialog }}}
            {{{ ConfirmLogOut }}}
        `
    }
}
class EditProfile extends Block {
    constructor(props: ProfilePagesProps) {
        super('div', {
            ...props,
            className: 'profile',

            ReturnBack: new Button({
                classTypeOfButton: 'send back-btn',
                buttonType: 'button',
                typeIMG: true,
                src: 'back.png',
                events: {
                    click: () => {
                        document.querySelectorAll('input').forEach(i => i.value=i.placeholder)
                        this.props.toLevel(0)
                        this.props.router.go('/messenger');
                    }
                }
            }),
            ProfileIcon: new Image({
                class: 'profile-icon',
                src: '/profile/example.png',
                alt: 'profile picture'
            }),

            l: new PSL({
                trait: 'Email', 

                reqInput: true,
                class: 'paw-input',
                type: 'text',
                required: true,

                id: 'email',
                name: 'email',
                value: 'user-email@domain.com',
                placeholder: 'user-email@domain.com',
            }),
            l1: new PSL({
                trait: 'Name', 
                
                reqInput: true,
                class: 'paw-input',
                type: 'text',
                required: true,
                
                id: 'profile_first_name',
                name: 'profile_first_name',
                value: 'User Name',
                placeholder: 'User Name'
            }),
            l2: new PSL({
                trait: 'Surname', 

                reqInput: true,
                class: 'paw-input',
                type: 'text',
                required: true,
                
                id: 'profile_second_name',
                name: 'profile_second_name',
                value: 'User Surname',
                placeholder: 'User Surname'
            }),
            l3: new PSL({
                trait: 'Username',

                reqInput: true,
                class: 'paw-input',
                type: 'text',
                required: true,
                
                id: 'profile_login',
                name: 'profile_login',
                value: 'usexample2000kill',
                placeholder: 'usexample2000kill'
            }),
            l4: new PSL({
                trait: 'Phone',
                
                reqInput: true,
                class: 'paw-input',
                type: 'text',
                required: true,
                
                id: 'profile_phone',
                name: 'profile_phone',
                value: '+112223334455',
                placeholder: '+112223334455'
            }),

            Submit: new Button({
                classTypeOfButton: 'primary',
                buttonType: 'submit',
                clientAction: 'Confirm changes'
            }),
            Cancel: new Button({
                classTypeOfButton: 'fatal-secondary',
                buttonType: 'button',
                clientAction: 'Cancel',
                events: {
                    click: () => {
                        this.props.toLevel(0);
                    }
                }
            })
        })
    }
    public render(): string {
        return `
            {{{ ReturnBack }}}

            <div class="profile-icon-wrapper">
                {{{ ProfileIcon }}}
            </div>
            <h1 id="profile_user_fullname">user name</h1>
            <form method="post" class="paw"> {{!-- PAW: profile action wrapper --}}
                <div class="ps-lines">
                    {{{ l }}} {{{ l1 }}} {{{ l2 }}} {{{ l3 }}} {{{ l4 }}}
                </div>
                <div class="profile-action">
                    {{{ Submit }}}
                    {{{ Cancel }}}
                </div>
            </form>
        `
    }
}
class SetNewPassword extends Block {
    constructor(props: ProfilePagesProps) {
        super('div', {
            ...props,
            className: 'profile',

            ReturnBack: new Button({
                classTypeOfButton: 'send back-btn',
                buttonType: 'button',
                typeIMG: true,
                src: 'back.png',
                events: {
                    click: () => {
                        document.querySelectorAll('input').forEach(i => i.value='');
                        this.props.toLevel(0);
                        this.props.router.go('/messenger');
                    }
                }
            }),
            ProfileIcon: new Image({
                class: 'profile-icon',
                src: '/profile/example.png',
                alt: 'profile picture'
            }),

            old: new PSL({
                trait: 'Old password', 

                reqInput: true,
                class: 'paw-input',
                type: 'password',
                required: true,

                id: 'old_password_input',
                name: 'old_password_input',
                placeholder: 'Current password',
            }),
            new: new PSL({
                trait: 'New password', 
                
                reqInput: true,
                class: 'paw-input',
                type: 'password',
                required: true,
                
                id: 'new_password_input',
                name: 'new_password_input',
                placeholder: 'New password'
            }),
            confirm: new PSL({
                trait: 'Confirm', 

                reqInput: true,
                class: 'paw-input',
                type: 'password',
                required: true,
                
                id: 'new_password_confirmation',
                name: 'new_password_confirmation',
                placeholder: 'New password (again'
            }),

            Submit: new Button({
                classTypeOfButton: 'primary',
                buttonType: 'submit',
                clientAction: 'Set'
            }),
            Cancel: new Button({
                classTypeOfButton: 'fatal-secondary',
                buttonType: 'button',
                clientAction: 'Cancel',
                events: {
                    click: () => {
                        this.props.toLevel(0);
                    }
                }
            })
        })
    }
    public render(): string {
        return `
            {{{ ReturnBack }}}

            <div class="profile-icon-wrapper">
                {{{ ProfileIcon }}}
            </div>
            <h1 id="profile_user_fullname">user name</h1>
            <form method="post" class="paw"> {{!-- PAW: profile action wrapper --}}
                <div class="ps-lines">
                    {{{ old }}} 
                    {{{ new }}}
                    {{{ confirm }}}
                </div>
                <div class="profile-action">
                    {{{ Submit }}}
                    {{{ Cancel }}}
                </div>
            </form>
        `
    }
}
