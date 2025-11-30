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
import { clg } from 'main';
import { addUserToChat, delUserFromChat, searchUser } from 'services/service';

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
                    const cdChoice = document.querySelector('.cd-choice') as HTMLElement;
                    const abcChoice = document.querySelector('.abc-choice') as HTMLElement;
                    const atrChoice = document.querySelector('.atr-choice') as HTMLElement;
                    const atr = document.querySelector('.action-to-recipient') as HTMLElement;
                
                    if (target.closest('.u-action-to-recipient-btn')) {
                        abcChoice.style.display = 'none';
                        atrChoice.style.display = atrChoice.style.display === 'flex' ? 'none' : 'flex';
                        return;
                    }
                
                    if (target.closest('.u-add-btn')) {
                        atrChoice.style.display = 'none';
                        abcChoice.style.display = abcChoice.style.display === 'flex' ? 'none' : 'flex';
                        return
                    }
                
                    const attachChoice = target.closest('#cdc-span');
                    if (attachChoice) {
                        this.children[attachChoice.dataset.dw].show();
                        abcChoice.style.display = 'none';
                        atrChoice.style.display = 'none';
                        return
                    }
                
                    if (!target.closest('.abc-choice') && !target.closest('.action-to-recipient')) {
                        abcChoice.style.display = 'none';
                        atrChoice.style.display = 'none';
                        return
                    }
                },
                mouseover: (e: Event) => {
                    let prevIMG: HTMLImageElement;

                    if (e.target.closest('.atr-choice')) {
                        if (e.target.closest('#cdc-span')) prevIMG = document.getElementById('hov-i-atr');
                    }
                    if (e.target.closest('.abc-choice')) {
                        if (e.target.closest('#cdc-span')) prevIMG = document.getElementById('hov-i-abc');
                    }

                    if (prevIMG) {
                        const selected = e.target as HTMLElement;
                        prevIMG.src = selected.dataset.src;
                    }
                }
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
            AddUserDialog: new DialogWindow({
                title: 'Add user to this chat',
                executiveAction: 'Add',
                label: 'Username (case-sensitive)',
                id: 'addUTC_search',
                name: 'addUTC_search',
                type: 'text',
                builtInSearch: true,
                inputEvent: {
                    input: async () => {
                        const dwFus = document.querySelectorAll('.dialog h4#dwFu');
                        let count = 0;

                        await searchUser({ login: document.activeElement.value }).then(() => {
                            const found = window.memory.take().search;
                            dwFus.forEach(each => {
                                if (found.length !== 0) {
                                    if (found[count]) {
                                        each.textContent = found[count].login;
                                        count++
                                    } else {
                                        each.textContent = '';
                                    }
                                } else {
                                    each.textContent = '';
                                }
                            })
                        });
                        
                        if (document.activeElement.value.length === 0) {
                            dwFus.forEach(each => {
                                each.textContent = '';
                            })
                        }
                    }
                },
                onSelSearchRes: {
                    click: async (e: Event) => {
                        if (e.target.closest('#dwFu')) {
                            const fuEl = e.target.closest('#dwFu');
                            let fuId = null;

                            window.memory.take().search.forEach(user => {
                                Object.entries(user).forEach(([k,v]) => {
                                    if (k === 'login' && v === fuEl.textContent) {
                                        fuId = user.id;
                                    }
                                })
                            })

                            const extraUser = {
                                users: [Number(fuId)],
                                chatId: this.props.chatId.toString()
                            }
                            await addUserToChat(extraUser);

                            this.children.AddUserDialog.close();
                            addUTC_search.value = '';
                            document.querySelectorAll('.dialog h4#dwFu').forEach(each => {
                                each.textContent = '';
                            })
                        }
                    }
                },
                executiveEvent: {
                    click: async (e: Event) => {
                        const userName = addUTC_search.value;
                        let fuId = null;

                        window.memory.take().search.forEach(user => {
                            Object.entries(user).forEach(([k,v]) => {
                                if (k === 'login' && v === userName) {
                                    fuId = user.id;
                                }
                            })
                        })

                        const newUser = {
                            users: [Number(fuId)],
                            chatId: this.props.chatId.toString()
                        }
                        await addUserToChat(newUser);

                        this.children.AddUserDialog.close();
                        addUTC_search.value = '';
                        document.querySelectorAll('.dialog h4#dwFu').forEach(each => {
                            each.textContent = '';
                        })
                    }
                }
            }),
            DeletUserDialog: new DialogWindow({
                title: 'Delete user from this chat',
                executiveAction: 'Delete',
                label: 'Username (case-sensitive)',
                id: 'delUFC_search',
                name: 'delUFC_search',
                type: 'text',
                builtInSearch: true,
                inputEvent: {
                    input: async () => {
                        const dwFus = document.querySelectorAll('.dialog h4#dwFu');
                        let count = 0;

                        await searchUser({ login: document.activeElement.value }).then(() => {
                            const found = window.memory.take().search;
                            dwFus.forEach(each => {
                                if (found.length !== 0) {
                                    if (found[count]) {
                                        each.textContent = found[count].login;
                                        count++
                                    } else {
                                        each.textContent = '';
                                    }
                                } else {
                                    each.textContent = '';
                                }
                            })
                        });
                        
                        if (document.activeElement.value.length === 0) {
                            dwFus.forEach(each => {
                                each.textContent = '';
                            })
                        }
                    }
                },
                onSelSearchRes: {
                    click: async (e: Event) => {
                        if (e.target.closest('#dwFu')) {
                            const fuEl = e.target.closest('#dwFu');
                            let fuId = null;

                            window.memory.take().search.forEach(user => {
                                Object.entries(user).forEach(([k,v]) => {
                                    if (k === 'login' && v === fuEl.textContent) {
                                        fuId = user.id;
                                    }
                                })
                            })

                            const extraUser = {
                                users: [Number(fuId)],
                                chatId: this.props.chatId.toString()
                            }
                            await delUserFromChat(extraUser);

                            this.children.DeletUserDialog.close();
                            delUFC_search.value = '';
                            document.querySelectorAll('.dialog h4#dwFu').forEach(each => {
                                each.textContent = '';
                            })
                        }
                    }
                },
                executiveEvent: {
                    click: async (e: Event) => {
                        const userName = delUFC_search.value;
                        let fuId = null;

                        window.memory.take().search.forEach(user => {
                            Object.entries(user).forEach(([k,v]) => {
                                if (k === 'login' && v === userName) {
                                    fuId = user.id;
                                }
                            })
                        })

                        const newUser = {
                            users: [Number(fuId)],
                            chatId: this.props.chatId.toString()
                        }
                        await delUserFromChat(newUser);

                        this.children.DeletUserDialog.close();
                        delUFC_search.value = '';
                        document.querySelectorAll('.dialog h4#dwFu').forEach(each => {
                            each.textContent = '';
                        })
                    }
                }
            }),

            Messages: new MessageList(),

            Attach: new Image({
                class: 'add-btn',
                src: 'add.png',
                alt: 'button that opens options of files to be sent'
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
                    <div class="cd-choice atr-choice">
                        <div>
                            <span id="cdc-span" data-dw="AddUserDialog" data-src="/assets/user-add.png">Add User</span>
                            <span id="cdc-span" data-dw="DeletUserDialog" data-src="/assets/user-del.png">Remove User</span>
                            <span id="cdc-span" data-dw="ConfirmDeletionDialog" data-src="/assets/del.png">Delete Chat</span>
                        </div>
                    </div>
                </div>
            </span>
            {{{ Messages }}}
            <span class="prompt">
                <span class="add-btn-container">
                    {{{ Attach }}} 
                    <div class="cd-choice abc-choice">
                        <div>
                            <span id="cdc-span" data-dw="AttachMediaDialog" data-src="/assets/attach-media.png">Photo or Video</span>
                            <span id="cdc-span" data-dw="AttachFileDialog" data-src="/assets/attach-files.png">Files</span>
                            <span id="cdc-span" data-dw="AttachLocationDialog" data-src="/assets/pin.png">Location</span>
                        </div>
                        <div>
                            <img id="hov-i-abc" src="/assets/empty.png" alt="on hover option preview">
                        </div>
                    </div>
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
