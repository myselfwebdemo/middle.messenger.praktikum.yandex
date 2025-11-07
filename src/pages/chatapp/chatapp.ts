// @ts-nocheck
import Button from 'components/button/button';
import DialogWindow from 'components/dialog/dialog';
import Image from 'components/image/image';
import Input from 'components/input/input';
import MessageList from 'components/message/mes-list';
import Block from 'core/Block';
import { clg } from 'main';
import { MapInit } from 'utils/map';
import ChatList from './chat-list';
import { injectRouter } from 'utils/injectRouter';
import './chatapp.css';
import Fatal from 'components/dialog/fatal';
import FoundUsersList from './list';
import transport from 'core/APIs/api';

class Messenger extends Block {
    constructor(props) {
        super('main', {
            nameOCR: props.nameOCR || 'Petya',
            ...props,
            events: {
                input: (e: Event) => {
                    if (e.target.id === 'search') {
                        document.querySelector('.chat-list').scrollIntoView({block:'start'});

                        const chatCards = document.querySelectorAll('.chat-card');
                        const term = e.target.value.toLowerCase();
                        const fieldLast = document.querySelectorAll('.chat-last-text');
                        
                        chatCards.forEach(card => {
                            const recipients = card.dataset.recipient.toLowerCase();
                            const lastMessages = card.dataset.lastMessage.toLowerCase();
                        
                            if (recipients.includes(term) || lastMessages.includes(term)) {
                                card.style.display = 'flex';
                                fieldLast.forEach(el => { el.style.display = 'none' });
                            } else {
                                card.style.display = 'none';
                            }
                        });
                        if (e.target.value.length === 0) {
                            chatCards.forEach(card => {
                                card.style.display = 'flex';
                            });
                            fieldLast.forEach(el => { el.style.display = 'flex' });
                        }
                    }
                },
                click: (e: Event) => {
                    const ABCChoice = document.querySelector('.abc-choice');

                    if (e.target.className.includes('action-to-recipient')) {
                        ABCChoice.style.display = 'none';

                        const atr = document.querySelector('.action-to-recipient');

                        const cancel = new Button({
                                            classTypeOfButton: 'tetriary small',
                                            buttonType: 'button',
                                            clientAction: 'Cancel',
                                            events: {
                                                click: () => {
                                                    atr.innerHTML = '';
                                                    atr.appendChild(this.children.ActionToRecipient.getContent());
                                                }
                                            }
                                        });
                        const confirm = new Button({
                                            classTypeOfButton: 'fatal-primary small',
                                            buttonType: 'button',
                                            clientAction: 'Delete',
                                            events: {
                                                click: () => {
                                                    this.children.ConfirmDeletionDialog.show()
                                                    atr.innerHTML = '';
                                                    atr.appendChild(this.children.ActionToRecipient.getContent());
                                                }
                                            }
                                        });

                        atr.innerHTML = '';
                        atr.append(cancel.getContent(), confirm.getContent())

                        return;
                    } else if (e.target.className.includes('u-add-btn')) {
                        ABCChoice.style.display = ABCChoice.style.display === 'block' ? 'none' : 'block';
                        return;
                    } 

                    if (e.target.closest('.atr-choice') || e.target.closest('.abc-choice')) {
                        if (e.target.children[0].className.includes('abc-choice')) {
                            const attachChoice = e.target.children[0].className.split(' ')[2];
                            if (attachChoice === 'AttachLocation') MapInit();
                            this.children[`${attachChoice}Dialog`].show();
                        }
                    }              
                },
            },

            OpenProfile: new Button({
                classTypeOfButton: 'tetriary',
                buttonType: 'button',
                clientAction: 'Profile',
                typeIMG: true,
                src: 'to.png',
                events: {
                    click: () => {
                        this.props.router.go('/settings');
                    }
                }
            }),
            SearchBar: new Input({
                type: 'text',
                id: 'search',
                name: 'search',
                placeholder: 'Search',
                typeIMG: true,
                src: 'search.png'
            }),
            ChatList: new ChatList(),
            OpenUserSearch: new Button({
                classTypeOfButton: 'tetriary-nt ous',
                buttonType: 'button',
                clientAction: 'Open user search',
                typeIMG: true,
                src: 'to.png',
                events: {
                    click: () => {
                        document.querySelector('.user-search').classList.toggle('u-s-opened');
                        document.querySelector('.ous').children[1].style.transform = document.querySelector('.ous').children[1].style.transform === 'rotate(270deg)' ? 'rotate(90deg)' : 'rotate(270deg)';
                    }
                }
            }),
            SearchUser: new Input({
                type: 'text',
                id: 'search_user',
                name: 'search_user',
                placeholder: '...search by username',
                events: {
                    input: () => {
                        const xhr = new transport('user');
                        xhr.post('/search', { login: search_user.value }).then((res) => alert(res.status)).catch((e) => clg(e))
                    }
                }
            }),
            FoundUsersList: new FoundUsersList(),

            CurrentRecipient: new Image({
                class: 'chat-recipient',
                src: 'profile/example.png',
                alt: 'current recipient profile picture',
            }),
            ActionToRecipient: new Image({
                class: 'action-to-recipient drop-btn',
                src: 'atr.png',
                alt: 'button that opens list of action that can be done to current recipient',
            }),

            Messages: new MessageList(),

            Attach: new Image({
                class: 'add-btn drop-btn',
                src: 'add.png',
                alt: 'button that opens options of files to be sent'
            }),
            AddMedia: new Image({
                class: 'abc-choice AttachMedia',
                src: 'attach-media.png',
                alt: 'action representation image: add photo or video',
            }),
            AddFiles: new Image({
                class: 'abc-choice AttachFile',
                src: 'attach-files.png',
                alt: 'action representation image: add file',
            }),
            AddLocation: new Image({
                class: 'abc-choice AttachLocation',
                src: 'pin.png',
                alt: 'action representation image: add location',
            }),
            Message: new Input({
                id: 'message',
                name: 'message',
                type: 'text',
                placeholder: 'Communicate...'
            }),
            SendBtn: new Button({
                classTypeOfButton: 'send',
                buttonType: 'submit',
                typeIMG: true,
                src: 'send.png',
                events: {
                    click: (e: Event) => {
                        e.preventDefault();
                        e.stopImmediatePropagation()

                        if (document.getElementById('message').value !== '') {
                            e.target.closest('form').submit()
                        }
                    }
                }
            }),

            ConfirmDeletionDialog: new Fatal({
                title: `Delete contact?`,
                mainMessage: `This will delete ${props.nameOCR} from your contacts. You will be able to add this user again later.`,
                extratip: `This action erases all messages ever sent to ${props.nameOCR}.`,
                finalAction: 'Delete'
            }),
            AttachMediaDialog: new DialogWindow({
                title: 'Choose image or video',
                class: 'dialog-simple-input',

                id: 'dialog_media',
                name: 'dialog_media',
                type: 'file',
                label: 'Selection',
                
                executiveAction: 'Confirm Selection',
            }),
            AttachFileDialog: new DialogWindow({
                title: 'Choose a file',
                class: 'dialog-simple-input',
                
                id: 'dialog_file',
                name: 'dialog_file',
                type: 'file',
                label: 'Selection',
                
                executiveAction: 'Confirm Selection',
            }),
            AttachLocationDialog: new DialogWindow({
                title: 'Share location',
                locat: true,
                executiveAction: 'Share',
            }),
        })
    }
    public render(): string {
        const children_names = Object.keys(this.children);
        const line = [];

        for(const name of children_names) {
            if (name.toLowerCase().includes('dialog')) {
                line.push(`{{{ ${name} }}}`)
            }
        }

        return `
            <main>
                <div class="chatapp-container">
                    <div class="sidebar">
                        <div class="explore">
                            {{{ OpenProfile }}}
                            <span id="search-container"> {{{ SearchBar }}} </span>
                        </div>
                        {{{ ChatList }}}
                        <div class="user-search">
                            <div>
                                <div id="u-s-title-img"></div>
                                {{{ OpenUserSearch }}}
                                <h2>Find people</h2>
                                {{{ SearchUser }}}
                                {{{ FoundUsersList }}}
                            </div>
                        </div>
                    </div>
                    <div class="chat">
                        <span class="chat-header">
                            <span>
                                {{{ CurrentRecipient }}}
                                <h3>{{ nameOCR }}</h3>
                            </span>
                            <div class="action-to-recipient">
                                {{{ ActionToRecipient }}}
                            </div>
                        </span>
                        {{{ Messages }}}
                        <span class="prompt">
                            <span class="add-btn-container">
                                {{{ Attach }}} 
                                <ul class="abc-choice">
                                    <li> {{{ AddMedia }}} Photo or Video </li>
                                    <li> {{{ AddFiles }}} Files </li>
                                    <li> {{{ AddLocation }}} Location </li>
                                </ul>
                            </span>
                            <form id="chat-send-form">
                                {{{ Message }}}
                                {{{ SendBtn }}}
                            </form>
                        </span>
                    </div>
                </div>
            </main>
            ${line.join(' ')}
        `
    }
}

export default injectRouter(Messenger);
