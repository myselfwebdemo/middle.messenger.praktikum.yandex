// @ts-nocheck
import Button from '../../components/button/button';
import DialogWindow from '../../components/dialog/dialog';
import Image from '../../components/image/image';
import Input from '../../components/input/input';
import MessageList from '../../components/message/mes-list';
import Block from '../../core/block';
import { clg } from '../../main';
import { MapInit } from '../../utils/map';
import ChatList from './chat-list';

export default class ChatAPP extends Block {
    constructor() {
        super('main', {
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
                    const ATRChoice = document.querySelector('.atr-choice');
                    const ABCChoice = document.querySelector('.abc-choice');
                    const dropdowns = [ATRChoice, ABCChoice];

                    if (e.target.className.includes('action-to-recipient')) {
                        ABCChoice.style.display = 'none';
                        ATRChoice.style.display = ATRChoice.style.display === 'block' ? 'none' : 'block';
                        return;
                    } else if (e.target.className.includes('_add-btn')) {
                        ATRChoice.style.display = 'none';
                        ABCChoice.style.display = ABCChoice.style.display === 'block' ? 'none' : 'block';
                        return;
                    } else if (e.target.children[0].className.includes('_atr-choice')) {
                        this.children['AddRecipientDialog'].show();
                    } else if (e.target.children[0].className.includes('abc-choice')) {
                        const attachChoice = e.target.children[0].className.split(' ')[2];
                        if (attachChoice === 'AttachLocation') MapInit();
                        this.children[`${attachChoice}Dialog`].show();
                    }
                    dropdowns.forEach(el => {
                        el.style.display = 'none';
                    })                    
                },
            },

            OpenProfile: new Button({
                classTypeOfButton: 'tetriary',
                buttonType: 'button',
                clientAction: 'Profile',
                typeIMG: true,
                src: 'to.png',
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
            AddRecipient: new Image({
                class: 'atr-choice',
                src: 'recipient-add.png',
                alt: 'symbol of adding recipient to contacts'
            }),
            DeleteRecipient: new Button({
                classTypeOfButton: 'fatal-primary del-rec',
                buttonType: 'button',
                clientAction: 'Remove recipient'
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
                src: 'send.png'
            }),

            AddRecipientDialog: new DialogWindow({
                title: 'Add recipient',
                class: 'dialog-simple-input',
                
                id: 'login',
                name: 'login',
                type: 'text',
                label: 'Login',
                recipientLogin: 'ddd2408ddd',

                executiveAction: 'Add',
            }),
            AttachMediaDialog: new DialogWindow({
                title: 'Choose image or video',
                class: 'dialog-simple-input',

                id: 'media',
                name: 'media',
                type: 'file',
                label: 'Selection',
                
                executiveAction: 'Confirm Selection',
            }),
            AttachFileDialog: new DialogWindow({
                title: 'Choose a file',
                class: 'dialog-simple-input',
                
                id: 'file',
                name: 'file',
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
                    </div>
                    <div class="chat">
                        <span class="chat-header">
                            <span>
                                {{{ CurrentRecipient }}}
                                <h3>Current Recipient</h3>
                            </span>
                            <div class="action-to-recipient">
                                {{{ ActionToRecipient }}}
                                <ul class="atr-choice">
                                    <li class="atr-li"> {{{ AddRecipient }}} Add recipient </li>
                                    <li> {{{ DeleteRecipient }}} </li>
                                </ul>
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
                            <form action="#" method="post" id="chat-send-form">
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