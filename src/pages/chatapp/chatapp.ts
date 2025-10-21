// @ts-nocheck
import Button from '../../components/button/button';
import Image from '../../components/image/image';
import Input from '../../components/input/input';
import Block from '../../core/block';
import { clg } from '../../main';
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
                click: (e: Event) => {},
            },

            OpenProfile: new Button({
                classTypeOfButton: 'secondary',
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
                class: '_atr-choice',
                src: 'recipient-add.png',
                alt: 'symbol of adding recipient to contacts'
            }),
            DeleteRecipient: new Button({
                classTypeOfButton: 'fatal-primary del-rec',
                buttonType: 'button',
                clientAction: 'Remove recipient'
            }),
        })
    }
    public render(): string {
        return `
            <main>
                <div class="chatapp-container">
                    <div class="sidebar">
                        <div class="explore">
                            {{{ OpenProfile }}}
                            <span id="search-container">
                                {{{ SearchBar }}}
                            </span>
                        </div>
                        {{{ ChatList }}}
                    </div>
                    <div class="chat">
                        <span class="chat-header">
                            <span>
                                {{{ CurrentRecipient }}}
                                {{!-- INPUT REAL recipient's image by fetching--}}
                                <h3>Current Recipient</h3>
                                {{!-- INPUT REAL recipient's name --}}
                            </span>
                            <div class="action-to-recipient">
                                
                                {{{ ActionToRecipient }}}

                                <ul class="atr-choice">
                                    <li class="atr-li">
                                        {{{ AddRecipient }}}
                                        Add recipient
                                    </li>
                                    <li> {{{ DeleteRecipient }}} </li>
                                </ul>
                            </div>
                        </span>
                        <div class="messages">
                            {{> message 
                                mesType="text"
                                mesContent="Look at this."
                                time="12:30"}}
                            {{> message 
                                mesType="image"
                                mesSrc="/main.png"
                                time="1:31"}}
                            {{> message 
                                mesType="text"
                                fromYou=true
                                mesContent="Cool!"
                                time="2:02"}}
                            {{> message 
                                mesType="text"
                                fromYou=true
                                mesContent="For all the marvel of our technological ascendancy—the transistors etched finer than a human hair, the processors orchestrating trillions of operations each second—our comprehension of the inner life of modern computing remains astonishingly incomplete. We know, in principle, the logic of silicon; we design the architectures, dictate the algorithms, trace the flow of electrons through gates no wider than strands of DNA. Yet as the scale of these systems surpasses the intuitive reach of the human mind, an uncanny opacity emerges."
                                time="2:15"}}
                            {{> message 
                                mesType="image"
                                fromYou=true
                                mesSrc="/image.png"
                                time="3:13"}}
                        </div>
                        <span class="prompt">
                            <span class="add-btn-container">
                                {{> component_image
                                    class="add-btn drop-btn"
                                    src="add.png"
                                    alt="button that opens options of files to be sent"}}
                                    
                                <ul class="abc-choice">
                                    <li>
                                        {{> component_image
                                            class="abc-choice"
                                            src="abc-iov.png"
                                            alt="action representation image: add photo or video"}}
                                        Photo or Video
                                    </li>
                                    <li>
                                        {{> component_image
                                            class="abc-choice"
                                            src="abc-files.png"
                                            alt="action representation image: add file"}}
                                        Files
                                    </li>
                                    <li>
                                        {{> component_image
                                            class="abc-choice"
                                            src="pin.png"
                                            alt="action representation image: add location"}}
                                        Location
                                    </li>
                                </ul>
                            </span>
                            <form action="#" method="post" id="chat-send-form">
                                {{> component_input
                                    id="message"
                                    name="message"
                                    type="text"
                                    placeholder="Communicate..."}}
                                {{> component_button
                                    typeIMG=true
                                    type="send"
                                    btype="submit"
                                    src="send.png"}}
                            </form>
                        </span>
                    </div>
                </div>
            </main>
            {{> dialog
                title="Add recipient"
                class="recipient"
                id="login"
                label="Logic"
                atr="Add"
                itype="text"
                recipientLogin="destroyer1997"}}
        `
    }
}