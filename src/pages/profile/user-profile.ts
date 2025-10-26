// @ts-nocheck
import Button from 'components/button/button';
import DialogWindow from 'components/dialog/dialog';
import Image from 'components/image/image';
import PSL from 'components/profile-info/psl';
import Block from 'core/block';

// add on upload under "change avatar" action so the preview of image uploaded appears

export default class UserProfile extends Block {
    constructor() {
        super('div', {
            className: 'profile profile-origin',
            events: {
                click: (e: Event) => {
                    if (e.target.closest('.profile-icon-wrapper')) {
                        this.children.dialog.show();
                    }
                }
            },

            ReturnBack: new Button({
                classTypeOfButton: 'send back-btn',
                buttonType: 'button',
                typeIMG: true,
                src: 'back.png'
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
                clientAction: 'Edit profile'
            }),
            optionEditPassword: new Button({
                classTypeOfButton: 'c2-primary',
                buttonType: 'button',
                clientAction: 'Edit password'
            }),
            LogOut: new Button({
                classTypeOfButton: 'fatal-secondary',
                buttonType: 'button',
                clientAction: 'Log out'
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
        `
    }
}
