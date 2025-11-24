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
import FoundUsersList from './searched-users-list';
import endPointAPI from 'core/APIs/api';
import { addUserToChat, delChat, getChatToken, newChat, searchUser } from 'services/service';
import FUUser from './searched-user-component';
import Chat from './chat';
import ChatCard from 'components/chat-card/chat-card';
import { linkStorage } from 'utils/link-storage';
import Warning from 'components/dialog/warning';
import chatList from './chat-list';
import { connectChat } from 'core/websocket';

class Messenger extends Block {
    constructor(props) {
        super('main', {
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
                click: async (e: Event) => {
                    const userSearch = document.querySelector('.user-search') as HTMLElement;
                    if (userSearch && !e.target.closest('.user-search') && userSearch.classList.contains('u-s-opened')) {
                        search_user.value = '';
                        Object.keys(this.children.FoundUsersList.children).forEach((childName) => {
                            this.children.FoundUsersList.removeChildren(childName);
                        });
                        userSearch.classList.remove('u-s-opened');
                    }

                    if (e.target.closest('.chat-card')) {
                        const card = e.target.closest('.chat-card');

                        document.querySelectorAll('.chat-card.selected-card').forEach(card => {
                            card.classList.remove('selected-card');
                        })

                        card.classList.add('selected-card');

                        const onCardUsername = card.textContent.trim().split(' ')[0];
                        let onCardChatId: number;

                        const memChats = window.memory.take().chats;

                        Object.entries(memChats).forEach(([chatId, chat]) => {
                            chat['users'].forEach(user => {
                                if (onCardUsername === user.login) {
                                    onCardChatId = chatId;
                                }
                            })
                        })

                        if (this.children.Chat) {
                            this.removeChildren('Chat');
                        }
                        this.addChildren(new Chat({ 
                            nameOCR: card.dataset.recipient, 
                            chatId: onCardChatId,
                            onChatDeleteConfirmed: async (id) => {
                                memChats[id]['users'].forEach(user => {
                                    if (user.id === window.memory.take().user.id) {
                                        if (user.role === 'admin') {
                                            const delChatRes = delChat({ chatId: id });
                                            this.children.ChatList.removeChildren(`chat_${id}`);
                                            this.removeChildren('Chat');
                                            
                                            const { [id]: remData, ...updatedChats } = window.memory.take().chats;
                                            window.memory.give({ chats: updatedChats });
                                        } else {
                                            clg(this.children.WarningDialog);
                                            if (this.children.WarningDialog) {
                                                this.children.WarningDialog.show();
                                            } else {
                                                this.addChildren(new Warning({mesWarning: 'You cannot perform this action. Only admin of this chat can delete it'}), 'WarningDialog');
                                                this.children.WarningDialog.show();
                                            }
                                        }
                                    }
                                });
                            }
                        }), 'Chat');

                        // const {token} = await getChatToken(onCardChatId);

                        if (this.wccc) this.wccc.close();

                        const socketParams = {
                            userId: window.memory.take().user.id,
                            chatId: onCardChatId,
                        }
                        connectChat(socketParams);
                        // this.wccc = new ChatConnection(
                        //     socketParams,
                        //     (e) => {clg('message sent!',e)}
                        // );
                    }

                    if (e.target.closest('.fu-user')) {
                        const clicked_user_name = e.target.textContent.trim();
                        let fuId;

                        Object.keys(this.children.FoundUsersList.children).forEach((childName) => {
                            if (clicked_user_name === this.children.FoundUsersList.children[`${childName}`].props.name) {
                                fuId = childName;
                            }
                        });
                        
                        const nct = {
                            title: `${window.memory.take().user.id}_and_${fuId}`
                        };
                        const newChatResult = await newChat(nct);

                        const newUser = {
                            users: [Number(fuId)],
                            chatId: newChatResult
                        }
                        await addUserToChat(newUser);
                        
                        
                        if (Object.keys(this.children.ChatList.children).length !== 0) {
                            document.querySelectorAll('.chat-card.selected-card').forEach(card => {
                                card.classList.remove('selected-card');
                            })
                        }
                        this.children.ChatList.addChildren(new ChatCard({ recipientName: clicked_user_name, class: 'on-hover chat-card selected-card' }), `chat_${newChatResult}`);

                        search_user.value = '';
                        Object.keys(this.children.FoundUsersList.children).forEach((childName) => {
                            this.children.FoundUsersList.removeChildren(childName);
                        });
                        userSearch.classList.remove('u-s-opened');
                        
                        if (this.children.Chat) {
                            this.children.Chat.setProps({nameOCR: clicked_user_name});
                        } else {
                            let cn = 'Chat'
                            this.addChildren(new Chat({ 
                                nameOCR: clicked_user_name, 
                                chatId: newChatResult,
                                onChatDeleteConfirmed: async (id) => {
                                    const delChatRes = await delChat({ chatId: id });
                                    this.children.ChatList.removeChildren(`chat_${id}`);
                                    this.removeChildren('Chat');
                                }
                            }), cn);
                        }
                    }

                    // if (e.target.closest('.button.u-send')) {
                    //     if (message.value !== '') {
                    //         clg('want to send a message?')
                    //     } else {
                    //         clg('message input is empty');
                    //         return
                    //     }
                    // }
                }
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
            ChatList: new chatList(),
            OpenUserSearch: new Button({
                classTypeOfButton: 'tetriary-nt ous',
                buttonType: 'button',
                clientAction: 'Lookup People.',
                events: {
                    click: () => {
                        document.querySelector('.user-search').classList.toggle('u-s-opened');
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
                        searchUser({ login: document.activeElement.value }).then(() => {
                            Object.keys(this.children.FoundUsersList.children).forEach((childName) => {
                                this.children.FoundUsersList.removeChildren(childName);
                            });
                            
                            for (const user of window.memory.take().search) {
                                this.children.FoundUsersList.addChildren(new FUUser({ name: user.login }), user.id);
                            }
                            
                            if (document.activeElement.value === '') {
                                Object.keys(this.children.FoundUsersList.children).forEach((childName) => {
                                    this.children.FoundUsersList.removeChildren(childName);
                                });
                            }
                        });
                    }
                }
            }),
            FoundUsersList: new FoundUsersList(),

            // Chat: new Chat({
            //     nameOCR: 'Unknown'
            // })
        });

    }
    public render(): string {
        return `
            <div class="user-search">
                <div>
                    <div id="u-s-title-img"></div>
                    {{{ OpenUserSearch }}}
                    <h2>Find people</h2>
                    {{{ SearchUser }}}
                    {{{ FoundUsersList }}}
                    <h5 style="margin-top:1.4vh;text-decoration:underline;">Usernames are case-sensitive. Type them exactly as they are. Capital letters must match.</h5>
                </div>
            </div>

            <div class="chatapp-container">
                <div class="sidebar">
                    <div class="explore">
                        {{{ OpenProfile }}}
                        <span id="search-container"> {{{ SearchBar }}} </span>
                    </div>
                    {{{ ChatList }}}
                </div>
                
                <div class="chat-wrapper">
                    {{#if Chat}}
                        {{{ Chat }}}
                    {{else}}
                        <div class="chat-cork">
                            <div class="cc-ec"></div>
                            <div class="cc-ec"></div>
                            <div class="cc-fc"></div>
                            <div class="cc-fc"></div>
                            <div class="cc-s"></div>
                            <div class="cc-s"></div>
                            <div class="cc-s"></div>
                            
                            <div class="cc-"></div>

                            <div class="cc-box-wrapper">
                                <div class="cc-box">
                                    <div class="cc-line"></div>
                                </div>
                                <div class="cc-box">
                                    <div class="cc-line"></div>
                                    <div class="cc-line"></div>
                                </div>
                            </div>
                            <h3>Pick a chat to begin</h3>
                            <h5>Select a chat from the list to get started or create new chat by searching the user</h5>
                        </div>
                    {{/if}}
                </div>
            </div>

            {{{ WarningDialog }}}
        `
    }
}

export default injectRouter(Messenger);
