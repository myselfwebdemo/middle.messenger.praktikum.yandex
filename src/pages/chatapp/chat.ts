// @ts-nocheck
import Block from 'core/Block';
import './chatapp.css';
import Fatal from 'components/dialog/fatal';
import Image from 'components/image/image';

import DialogWindow from 'components/dialog/dialog';
import MessageList from 'components/message/mes-list';
import Input from 'components/input/input';
import Button from 'components/button/button';
import { MapInit } from 'utils/map';

interface ChatProps {
    nameOCR: string,
    chatDeleteEvent: Record<string, () => void>
}

export default class Chat extends Block {
    constructor(props: ChatProps) {
        super('div', { 
            ...props,
            className: 'chat',
            events: {
                click: (e: Event) => {
                    const target = e.target as HTMLElement;
                    const ABCChoice = document.querySelector('.abc-choice') as HTMLElement;
                    const atr = document.querySelector('.action-to-recipient') as HTMLElement;
                
                    if (target.closest('.u-action-to-recipient-btn')) {
                        ABCChoice.style.display = 'none';
                
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
                                    this.children.ConfirmDeletionDialog.show();
                                    atr.innerHTML = '';
                                    atr.appendChild(this.children.ActionToRecipient.getContent());
                                }
                            }
                        });
                
                        atr.innerHTML = '';
                        atr.append(cancel.getContent(), confirm.getContent());
                        return;
                    }
                
                    if (target.closest('.u-add-btn')) {
                        atr.innerHTML = '';
                        atr.appendChild(this.children.ActionToRecipient.getContent());
                        ABCChoice.style.display = ABCChoice.style.display === 'block' ? 'none' : 'block';
                        return;
                    }
                
                    const choice = target.closest('.abc-choice li');
                    if (choice) {
                        const img = choice.querySelector('img');
                        const attachChoice = img.classList[2];
                        if (attachChoice === 'AttachLocation') MapInit();
                        this.children[`${attachChoice}Dialog`].show();
                        return;
                    }
                
                    if (!target.closest('.abc-choice') && !target.closest('.action-to-recipient')) {
                        ABCChoice.style.display = 'none';
                        atr.innerHTML = '';
                        atr.appendChild(this.children.ActionToRecipient.getContent());
                    }
                },
                
            },

            CurrentRecipient: new Image({
                class: 'chat-recipient',
                src: 'profile/default.png',
                alt: 'current recipient profile picture',
            }),
            ActionToRecipient: new Image({
                class: 'action-to-recipient-btn',
                src: 'atr.png',
                alt: 'button that opens list of action that can be done to current recipient',
            }),

            Messages: new MessageList(),

            Attach: new Image({
                class: 'add-btn',
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
                id: 'messageInput',
                name: 'messageInput',
                type: 'text',
                placeholder: 'Communicate...',
                events: {
                    keydown: (e: Event) => {
                        if (e.key === 'Enter') {
                            if (messageInput.value !== '') {
                                window.__socket.send(JSON.stringify({
                                    content: messageInput.value,
                                    type: 'message'
                                }));

                                messageInput.value = '';
                            } else {
                                return
                            }
                        }
                    }
                }
            }),
            SendBtn: new Button({
                classTypeOfButton: 'send',
                buttonType: 'button',
                typeIMG: true,
                src: 'send.png',
            }),

            ConfirmDeletionDialog: new Fatal({
                title: `Delete contact?`,
                mainMessage: `This will delete ${props.nameOCR} from your contacts. You will be able to add this user again later.`,
                extratip: `This action erases all messages ever sent to ${props.nameOCR}.`,
                finalAction: 'Delete',
                finalEvent: {
                    click: () => {
                        this.props.onChatDeleteConfirmed(this.props.chatId)
                    }
                }
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
                <div class="chat-send-form">
                    {{{ Message }}}
                    {{{ SendBtn }}}
                </div>
            </span>
            ${line.join(' ')}
        `
    }
}
