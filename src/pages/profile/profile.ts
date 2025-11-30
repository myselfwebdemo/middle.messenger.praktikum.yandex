// @ts-nocheck
import Block from "core/Block";
import './profile.css';

import Button from 'components/button/button';
import DialogWindow from 'components/dialog/dialog';
import Image from 'components/image/image';
import PSL from 'components/profile-info/psl';
import type Router from "core/router";
import Fatal from "components/dialog/fatal";
import { changeAvatar, editPass, editUser, logout } from "../../services/service";
import { linkStorage } from "utils/link-storage";
import { injectRouter } from "utils/injectRouter";

interface ProfileProps { 
    user: Record<string, any>
    level: number
}

class Profile extends Block {
    constructor(props: ProfileProps) {
        const singlePageProps = {
            router: window.router,
            user: props.user,
            toLevel: (nl: number) => {
                window.memory.give({eAPI: null, sAPI: false});

                const profileLevels = {
                    '0': new ProfileLanding({...singlePageProps, user: this.props.user}),
                    '1': new EditProfile({...singlePageProps, user: this.props.user}),
                    '2': new SetNewPassword({...singlePageProps, user: this.props.user}),
                }
                
                this.children.page = profileLevels[nl.toString()];
                this._render();
            }
        }
        
        super('div', {
            ...props,
            className: 'profile-wrapper',
                        
            ...(props.level === 0 ? { page: new ProfileLanding(singlePageProps) } : {}),
            ...(props.level === 1 ? { page: new EditProfile(singlePageProps) } : {}),
            ...(props.level === 2 ? { page: new SetNewPassword(singlePageProps) } : {}),
        });
    }
    setProps(newProps): void {
        super.setProps(newProps);

        const pslToUserData = {
            'l': newProps.user.login,
            'l1': newProps.user.first_name,
            'l2': newProps.user.second_name,
            'l3': newProps.user.email,
            'l4': newProps.user.phone,
        }

        if (newProps.user) {
            if (newProps.user !== this.children.page.props.user) {
                this.children.page.setProps({ user: newProps.user });

                Object.entries(this.children.page.children).forEach(([name,child]) => {
                    if (['l','l1','l2','l3','l4'].includes(name)) {
                        const dataFrag = pslToUserData[name];
                        child.setProps({ traitValue: dataFrag, value: dataFrag });
                    }
                });
            }
        }
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
            {{#if reqSuccess}}
                <div class="api-req-res-notif arrn-success">
                    <p>Success</p>
                    <img src='/assets/success.png'>
                </div>
            {{/if}}
                
            {{{ page }}}
        `
    }
}

const extraProps = (wm: Record<string, any>) => {
    return {
        loading: wm.loading,
        reqFail: wm.eAPI,
        reqSuccess: wm.sAPI,
        user: wm.user
    }
}
// @ts-ignore
export default linkStorage(extraProps)(injectRouter(Profile));

interface ProfilePagesProps {
    router: Router,
    user: Record<string, any>,
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
                        this.children.avatarChange.show();
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
                directLink: true,
                class: 'profile-icon',
                src: props.user.avatar
                    ? `https:ya-praktikum.tech/api/v2/resources${props.user.avatar}`
                    :  'assets/profile/default.png',
                alt: 'profile picture'
            }),

            l: new PSL({
                trait: 'Username', traitValue: props.user.login 
                || 'N/A'
            }),
            l1: new PSL({
                trait: 'Name', traitValue: props.user.first_name 
                || 'N/A'
            }),
            l2: new PSL({
                trait: 'Surname', traitValue: props.user.second_name 
                || 'N/A'
            }),
            l3: new PSL({
                trait: 'Email', traitValue: props.user.email 
                || 'N/A'
            }),
            l4: new PSL({
                trait: 'Phone', traitValue: props.user.phone 
                || 'N/A'
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
                        this.children.ConfirmLogOut.show();
                    }
                }
            }),

            avatarChange: new DialogWindow({
                title: 'Choose image',
                class: 'dialog-simple-input',

                id: 'file-submit',
                name: 'file-submit',
                type: 'file',
                label: 'New avatar',
                inputAccept: 'image/*',

                executiveAction: 'Change',
                executiveEvent: {
                    click: () => {
                        const filei = document.querySelector('input[type="file"]');
                        const file = filei.files[0];

                        const formData = new FormData();
                        formData.append('avatar', file);
                        formData.append('path', 'avatars/current-user.png');
                        formData.append('overwrite', 'true');
                        
                        if (file) {
                            changeAvatar(formData).then(() => {
                                this.children.avatarChange.close();
                            });
                        }
                    }
                }
            }),
            ConfirmLogOut: new Fatal({
                title: 'Log Out?',
                mainMessage: 'Logging out will end your current session. You will need to sign in again to restore access.',
                extratip: 'All your messages and account data remain securely stored on our servers.',
                finalAction: 'Log Out',
                finalEvent: {
                    click: () => {
                        logout().then(() => {
                            this.children.ConfirmLogOut.close();
                        });
                    }
                }
            }),
        })
    }
    setProps(newProps): void {
        super.setProps(newProps);

        this.children.ProfileIcon.setProps({
            src: `https://ya-praktikum.tech/api/v2/resources${this.props.user.avatar}`
        })
    }
    public render(): string {
        return `
            {{{ ReturnBack }}}

            <span class="profile-top">
                <div class="profile-icon-wrapper">
                    {{{ ProfileIcon }}}
                </div>
                {{#if user.display_name}}
                    <h1 id ="profile_user_fullname">{{ user.display_name }}</h1>
                {{else}}
                    <h1 id ="profile_user_fullname">{{ user.first_name }} {{ user.second_name }}</h1>
                {{/if}}
            </span>
            <div class="ps-lines">
                {{{ l }}} {{{ l1 }}} {{{ l2 }}} {{{ l3 }}} {{{ l4 }}}
            </div>
            <div class="profile-action">
                {{{ optionEditThis }}}
                {{{ optionEditPassword }}}
                {{{ LogOut }}}
            </div>
            {{{ avatarChange }}}
            {{{ ConfirmLogOut }}}
        `
    }
}

class EditProfile extends Block {
    constructor(props: ProfilePagesProps) {
        super('form', {
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
                directLink: true,
                class: 'profile-icon',
                src: props.user.avatar
                    ? `https:ya-praktikum.tech/api/v2/resources${props.user.avatar}`
                    :  '/profile/default.png',
                alt: 'profile picture'
            }),

            l: new PSL({
                trait: 'Username',

                reqInput: true,
                class: 'paw-input',
                type: 'text',
                required: true,
                
                id: 'profile_login',
                name: 'profile_login',
                placeholder: 'usexample2000kill',

                value: props.user.login,
            }),
            l1: new PSL({
                trait: 'Display name',

                reqInput: true,
                class: 'paw-input',
                type: 'text',
                required: true,
                
                id: 'profile_display_name',
                name: 'profile_display_name',
                placeholder: 'Your Name Displayed',

                value: props.user.display_name || undefined,
            }),
            l2: new PSL({
                trait: 'Name', 
                
                reqInput: true,
                class: 'paw-input',
                type: 'text',
                required: true,
                
                id: 'profile_first_name',
                name: 'profile_first_name',
                placeholder: 'User Name',

                value: props.user.first_name,
            }),
            l3: new PSL({
                trait: 'Surname', 

                reqInput: true,
                class: 'paw-input',
                type: 'text',
                required: true,
                
                id: 'profile_second_name',
                name: 'profile_second_name',
                placeholder: 'User Surname',

                value: props.user.second_name,
            }),
            l4: new PSL({
                trait: 'Email', 

                reqInput: true,
                class: 'paw-input',
                type: 'text',
                required: true,

                id: 'profile_email',
                name: 'profile_email',
                placeholder: 'user-email@domain.com',

                value: props.user.email,
            }),
            l5: new PSL({
                trait: 'Phone',
                
                reqInput: true,
                class: 'paw-input',
                type: 'text',
                required: true,
                
                id: 'profile_phone',
                name: 'profile_phone',
                placeholder: '+112223334455',

                value: props.user.phone,
            }),

            Submit: new Button({
                classTypeOfButton: 'primary',
                buttonType: 'button',
                clientAction: 'Confirm changes',
                events: {
                    click: () => {                        
                        editUser({
                            ...this.props.user,
                            email: profile_email.value,
                            display_name: profile_display_name.value,
                            login: profile_login.value,
                            first_name: profile_first_name.value,
                            second_name: profile_second_name.value,
                            phone: profile_phone.value,
                        })
                        this.props.toLevel(0);
                    }
                }
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

            <span class="profile-top">
                <div class="profile-icon-wrapper">
                    {{{ ProfileIcon }}}
                </div>
                {{#if user.display_name}}
                    <h1 id ="profile_user_fullname">{{ user.display_name }}</h1>
                {{else}}
                    <h1 id ="profile_user_fullname">{{ user.first_name }} {{ user.second_name }}</h1>
                {{/if}}
            </span>

            <div class="ps-lines">
                {{{ l }}} {{{ l1 }}} {{{ l2 }}} {{{ l3 }}} {{{ l4 }}} {{{ l5 }}}
            </div>
            <div class="profile-action">
                {{{ Submit }}}
                {{{ Cancel }}}
            </div>
        `
    }
}
class SetNewPassword extends Block {
    constructor(props: ProfilePagesProps) {
        super('form', {
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
                directLink: true,
                class: 'profile-icon',
                src: props.user.avatar
                    ? `https:ya-praktikum.tech/api/v2/resources${props.user.avatar}`
                    :  '/profile/default.png',
                alt: 'profile picture'
            }),

            old: new PSL({
                trait: 'Old password', 

                reqInput: true,
                class: 'paw-input',
                type: 'password',
                required: true,

                id: 'old_password',
                name: 'old_password',
                placeholder: 'Current password',
            }),
            new: new PSL({
                trait: 'New password', 
                
                reqInput: true,
                class: 'paw-input',
                type: 'password',
                required: true,
                
                id: 'new_password',
                name: 'new_password',
                placeholder: 'New password'
            }),
            confirm: new PSL({
                trait: 'Confirm', 

                reqInput: true,
                class: 'paw-input',
                type: 'password',
                required: true,
                
                id: 'new_password_rep',
                name: 'new_password_rep',
                placeholder: 'New password (again)'
            }),

            Submit: new Button({
                classTypeOfButton: 'primary',
                buttonType: 'button',
                clientAction: 'Set',
                events: {
                    click: () => {
                        if (new_password.value !== new_password_rep.value) {
                            new_password_rep.style.border = 'solid .2vh rgb(255,0,0,.5)';
                            new_password_rep.style.background = 'rgb(255,0,0,.2)';
                            new_password_rep.value = '';
                            new_password_rep.placeholder = "Passwords don't match";
                        } else {
                            new_password_rep.style.border = 'none';
                            new_password_rep.style.background = '';
                            new_password_rep.placeholder = 'New password (again)';

                            const passData = {
                                oldPassword: old_password.value,
                                newPassword: new_password.value
                            }
                            editPass(passData).then(() => {
                                this.props.toLevel(0);
                            });
                        }
                    }
                }
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

            <span class="profile-top">
                <div class="profile-icon-wrapper">
                    {{{ ProfileIcon }}}
                </div>
                {{#if user.display_name}}
                    <h1 id ="profile_user_fullname">{{ user.display_name }}</h1>
                {{else}}
                    <h1 id ="profile_user_fullname">{{ user.first_name }} {{ user.second_name }}</h1>
                {{/if}}
            </span>

            <div class="ps-lines">
                {{{ old }}} 
                {{{ new }}}
                {{{ confirm }}}
            </div>
            <div class="profile-action">
                {{{ Submit }}}
                {{{ Cancel }}}
            </div>
        `
    }
}
