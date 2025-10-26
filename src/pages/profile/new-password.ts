// @ts-nocheck
import Button from '../../components/button/button';
import DialogWindow from '../../components/dialog/dialog';
import Image from '../../components/image/image';
import PSL from '../../components/profile-info/psl';
import Block from '../../core/block';

export default class NewPassword extends Block {
    constructor() {
        super('div', {
            className: 'profile',

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
            <form class="paw"> {{!-- PAW: profile action wrapper --}}
                <div class="ps-lines">
                    {{{ old }}} 
                    {{{ new }}}
                    {{{ confirm }}}
                </div>
                <div class="profile-action">
                    {{{ Submit }}}
                </div>
            </form>
        `
    }
}
