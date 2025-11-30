// @ts-nocheck
import Button from 'components/button/button';
import Input from 'components/input/input';
import Block from 'core/Block';
import ChatList from './chat-list';
import { injectRouter } from 'utils/injectRouter';
import './chatapp.css';
import FoundUsersList from './searched-users-list';
import { addUserToChat, chatsUpdate, delChat, newChat, searchUser } from 'services/service';
import FUUser from './searched-user-component';
import Chat from './chat';
import ChatCard from 'components/chat-card/chat-card';
import Warning from 'components/dialog/warning';
import ChatConnection from 'core/websocket';
import Message from 'components/message/message';
import Image from 'components/image/image';
import { clg, Routes } from 'main';
import { StoreEvents } from 'core/storage';
import DialogWindow from 'components/dialog/dialog';

class Messenger extends Block {
    private _user: Record<string, any> = {};

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
                    const curSesUID = window.memory.take().user.id;

                    if (e.target.closest('.user-preview')) {
                        this.props.router.go(Routes.SetUp);
                    }

                    const userSearch = document.querySelector('.user-search') as HTMLElement;
                    if (userSearch && !e.target.closest('.user-search') && userSearch.classList.contains('u-s-opened')) {
                        search_user.value = '';
                        Object.keys(this.children.FoundUsersList.children).forEach((childName) => {
                            this.children.FoundUsersList.removeChildren(childName);
                        });
                        userSearch.classList.remove('u-s-opened');
                    }

                    if (e.target.closest('.chat-card')) {
                        if (!e.target.closest('.chat-card').classList.contains('selected-card')) {
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
                                        if (user.id === curSesUID) {
                                            if (user.role === 'admin') {
                                                const delChatRes = delChat({ chatId: id });
                                                this.children.ChatList.removeChildren(`chat_${id}`);
                                                this.removeChildren('Chat');
                                                
                                                const { [id]: remData, ...updatedChats } = window.memory.take().chats;
                                                window.memory.give({ chats: updatedChats });
                                            } else {
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
    
                            if (this.socket) {
                                this.socket.close();
                            }
    
                            const socketParams = {
                                userId: curSesUID,
                                chatId: onCardChatId,
                            }
                            
                            this.socket = new ChatConnection(
                                socketParams, 
                                (data) => {
                                    if (data.type === 'message') {
                                        const date = new Date(data.time);
                                        const hours = date.getHours();
                                        const minutes = String(date.getMinutes()).padStart(2, '0');
                                        
                                        const time = `${hours}:${minutes}`;
    
                                        if (data.user_id === curSesUID) {
                                            this.children.Chat.children.Messages.addChildren(new Message({
                                                messageType: 'text',
                                                textContent: data.content,
                                                fromYou: true,
                                                time: time
                                            }), `m_${data.id}`)
                                        } else {
                                            this.children.Chat.children.Messages.addChildren(new Message({
                                                messageType: 'text',
                                                textContent: data.content,
                                                time: time
                                            }), `m_${data.id}`)
                                        }
                                    }
                                    if (Array.isArray(data)) {
                                        const lastMesEl = this.children.Chat.children.Messages._element;
                                        const oldScrollHeight = lastMesEl.scrollHeight;
                                        const oldScrollTop = lastMesEl.scrollTop;

                                        data.forEach(mes => {
                                            const date = new Date(mes.time);
                                            const hours = date.getHours();
                                            const minutes = String(date.getMinutes()).padStart(2, '0');
                                            
                                            const time = `${hours}:${minutes}`;

                                            if (mes.user_id === curSesUID) {
                                                this.children.Chat.children.Messages.prependChildren(new Message({
                                                    messageType: 'text',
                                                    textContent: mes.content,
                                                    fromYou: true,
                                                    time: time
                                                }), `m_${mes.id}`)
                                            } else {
                                                this.children.Chat.children.Messages.prependChildren(new Message({
                                                    messageType: 'text',
                                                    textContent: mes.content,
                                                    time: time
                                                }), `m_${mes.id}`)
                                            }
                                        });
                                        
                                        const newScrollHeight = lastMesEl.scrollHeight;
                                        lastMesEl.scrollTop = oldScrollTop + (newScrollHeight - oldScrollHeight);
                                    } 
                                }
                            );
                        } else {
                            return
                        }
                    }

                    if (e.target.closest('.fu-user')) {
                        const clicked_user_name = e.target.textContent.trim();
                        let fuId = null;

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
                            this.removeChildren('Chat');
                        }
                        this.addChildren(new Chat({ 
                            nameOCR: clicked_user_name, 
                            chatId: newChatResult,
                            onChatDeleteConfirmed: async (id) => {
                                const delChatRes = await delChat({ chatId: id });
                                this.children.ChatList.removeChildren(`chat_${id}`);
                                this.removeChildren('Chat');
                            }
                        }), 'Chat');

                        if (this.socket) {
                            this.socket.close();
                        }
                        const socketParams = {
                            userId: curSesUID,
                            chatId: newChatResult,
                        }
                        this.socket = new ChatConnection(
                            socketParams, 
                            (data) => {
                                if (data.type === 'message') {
                                    const date = new Date(data.time);
                                    const hours = date.getHours();
                                    const minutes = String(date.getMinutes()).padStart(2, '0');
                                    
                                    const time = `${hours}:${minutes}`;

                                    if (data.user_id === curSesUID) {
                                        this.children.Chat.children.Messages.addChildren(new Message({
                                            messageType: 'text',
                                            textContent: data.content,
                                            fromYou: true,
                                            time: time
                                        }), `m_${data.id}`)
                                    } else {
                                        this.children.Chat.children.Messages.addChildren(new Message({
                                            messageType: 'text',
                                            textContent: data.content,
                                            time: time
                                        }), `m_${data.id}`)
                                    }
                                }
                                if (Array.isArray(data)) {
                                    data.forEach(mes => {
                                        const date = new Date(mes.time);
                                        const hours = date.getHours();
                                        const minutes = String(date.getMinutes()).padStart(2, '0');
                                        
                                        const time = `${hours}:${minutes}`;

                                        if (mes.user_id === curSesUID) {
                                            this.children.Chat.children.Messages.prependChildren(new Message({
                                                messageType: 'text',
                                                textContent: mes.content,
                                                fromYou: true,
                                                time: time
                                            }), `m_${mes.id}`)
                                        } else {
                                            this.children.Chat.children.Messages.prependChildren(new Message({
                                                messageType: 'text',
                                                textContent: mes.content,
                                                time: time
                                            }), `m_${mes.id}`)
                                        }
                                    });
                                } 
                            }
                        );
                    }

                    if (e.target.closest('.button.u-send')) {
                        if (messageInput.value !== '') {
                            this.socket.sendMessage(messageInput.value);
                            messageInput.value = '';
                        } else {
                            return
                        }
                    }
                }
            },

            AddChat: new Button({
                classTypeOfButton: 'tetriary new-chat',
                buttonType: 'button',
                typeIMG: true,
                src: 'add-cross.png',
                events: {
                    click: async () => {
                        this.children.AddUserOnNewChat.show();
                        ccc_user_search.value = '';
                        document.querySelectorAll('.dialog h4#dwFu').forEach(each => {
                            each.textContent = '';
                        })
                        ccc_user_search.focus();
                    }
                }
            }),
            AddUserOnNewChat: new DialogWindow({
                title: 'Add user to the chat',
                executiveAction: 'Create',
                label: 'Username (case-sensitive)',
                id: 'ccc_user_search',
                name: 'ccc_user_search',
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
                        const curSesUID = window.memory.take().user.id;

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

                            const chatName = `${curSesUID}_and_${fuId}`;
                            const newChatResult = await newChat({title: chatName});

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
                            this.children.ChatList.addChildren(new ChatCard({ recipientName: fuEl.textContent, class: 'on-hover chat-card selected-card' }), `chat_${newChatResult}`);

                            if (this.children.Chat) {
                                this.removeChildren('Chat');
                            }
                            this.addChildren(new Chat({ 
                                nameOCR: fuEl.textContent, 
                                chatId: newChatResult,
                                onChatDeleteConfirmed: async (id) => {
                                    const delChatRes = await delChat({ chatId: id });
                                    this.removeChildren('Chat');
                                }
                            }), 'Chat');

                            if (this.socket) {
                                this.socket.close();
                            }
                            const socketParams = {
                                userId: curSesUID,
                                chatId: newChatResult,
                            }
                            this.socket = new ChatConnection(
                                socketParams, 
                                (data) => {
                                    if (data.type === 'message') {
                                        const date = new Date(data.time);
                                        const hours = date.getHours();
                                        const minutes = String(date.getMinutes()).padStart(2, '0');
                                        
                                        const time = `${hours}:${minutes}`;
    
                                        if (data.user_id === curSesUID) {
                                            this.children.Chat.children.Messages.addChildren(new Message({
                                                messageType: 'text',
                                                textContent: data.content,
                                                fromYou: true,
                                                time: time
                                            }), `m_${data.id}`)
                                        } else {
                                            this.children.Chat.children.Messages.addChildren(new Message({
                                                messageType: 'text',
                                                textContent: data.content,
                                                time: time
                                            }), `m_${data.id}`)
                                        }
                                    }
                                }
                            );

                            this.children.AddUserOnNewChat.close();
                            ccc_user_search.value = '';
                            document.querySelectorAll('.dialog h4#dwFu').forEach(each => {
                                each.textContent = '';
                            })
                        }
                    }
                },
                executiveEvent: {
                    click: async (e: Event) => {
                        const curSesUID = window.memory.take().user.id;
                        const userName = ccc_user_search.value;
                        let fuId = null;

                        window.memory.take().search.forEach(user => {
                            Object.entries(user).forEach(([k,v]) => {
                                if (k === 'login' && v === userName) {
                                    fuId = user.id;
                                }
                            })
                        })

                        const chatName = `${curSesUID}_and_${fuId}`;
                        const newChatResult = await newChat({title: chatName});

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
                        this.children.ChatList.addChildren(new ChatCard({ recipientName: userName, class: 'on-hover chat-card selected-card' }), `chat_${newChatResult}`);

                        if (this.children.Chat) {
                            this.removeChildren('Chat');
                        }
                        this.addChildren(new Chat({ 
                            nameOCR: userName, 
                            chatId: newChatResult,
                            onChatDeleteConfirmed: async (id) => {
                                const delChatRes = await delChat({ chatId: id });
                                this.children.ChatList.removeChildren(`chat_${id}`);
                                this.removeChildren('Chat');
                            }
                        }), 'Chat');

                        if (this.socket) {
                            this.socket.close();
                        }
                        const socketParams = {
                            userId: curSesUID,
                            chatId: newChatResult,
                        }
                        this.socket = new ChatConnection(
                            socketParams, 
                            (data) => {
                                if (data.type === 'message') {
                                    const date = new Date(data.time);
                                    const hours = date.getHours();
                                    const minutes = String(date.getMinutes()).padStart(2, '0');
                                    
                                    const time = `${hours}:${minutes}`;

                                    if (data.user_id === curSesUID) {
                                        this.children.Chat.children.Messages.addChildren(new Message({
                                            messageType: 'text',
                                            textContent: data.content,
                                            fromYou: true,
                                            time: time
                                        }), `m_${data.id}`)
                                    } else {
                                        this.children.Chat.children.Messages.addChildren(new Message({
                                            messageType: 'text',
                                            textContent: data.content,
                                            time: time
                                        }), `m_${data.id}`)
                                    }
                                }
                            }
                        );

                        this.children.AddUserOnNewChat.close();
                        ccc_user_search.value = '';
                        document.querySelectorAll('.dialog h4#dwFu').forEach(each => {
                            each.textContent = '';
                        })
                    }
                }
            }),
            UserAvatar: new Image({
                directLink: true,
                class: '',
                src: '/assets/profile/default.png',
                alt: 'user avatar'
            }),
            SearchBar: new Input({
                type: 'text',
                id: 'search',
                name: 'search',
                placeholder: 'Search in chats',
                typeIMG: true,
                src: 'search.png'
            }),
            ChatList: new ChatList(),
            OpenUserSearch: new Button({
                classTypeOfButton: 'tetriary-nt ous',
                buttonType: 'button',
                clientAction: 'Lookup People.',
                events: {
                    click: () => {
                        document.querySelector('.user-search').classList.toggle('u-s-opened');
                        search_user.focus();
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
        });

        window.memory.on(StoreEvents.Updated, () => {
            const incomingUser = window.memory.take().user;

            if (incomingUser.avatar) {
                this.children.UserAvatar.setProps({
                    src: `https://ya-praktikum.tech/api/v2/resources${incomingUser.avatar}`
                });
            }

            if (JSON.stringify(this._user) !== JSON.stringify(incomingUser)) {
                this.setProps({ user: incomingUser });
                this._user = incomingUser;
            }
        });

        setInterval(async () => {
            await chatsUpdate();
            
            const openChatName = this.children.Chat?.props.nameOCR;
            if (this.children.Chat) {
                Object.values(window.memory.take().chats).forEach(inMemChat => {
                    inMemChat.users.forEach(user => {
                        if (user.id !== window.memory.take().user.id) {
                            if (user.login === openChatName) {
                                Object.values(this.children.ChatList.children).forEach(onListChat => {
                                    if (onListChat.props.recipientName === openChatName) {
                                        onListChat._element.classList.add('selected-card');
                                    }
                                })
                            }
                        }
                    })
                })
            }
        }, 15000);
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
                    <h5 style="margin-top:1.4vh;text-decoration:underline;">Usernames are case-sensitive. Type them exactly as they are. Capital letters must match the original username.</h5>
                </div>
            </div>

            <div class="chatapp-container">
                <div class="sidebar">
                    <div class="explore">
                        {{{ AddChat }}}
                        {{{ OpenProfile }}}
                        <div class="user-preview">
                            {{{ UserAvatar }}}
                            <div>
                                <p>{{ user.display_name }}</p>
                                <h5>{{ user.first_name }} {{ user.second_name }} @{{ user.login }}</h5>
                            </div>
                        </div>
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
            {{{ AddUserOnNewChat }}}
        `
    }
}

export default injectRouter(Messenger);
