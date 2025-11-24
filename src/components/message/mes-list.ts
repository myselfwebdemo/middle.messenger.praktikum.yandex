import Block from 'core/Block';
// import Message from './message';
import './message.css';
import Button from 'components/button/button';

export default class MessageList extends Block {
    constructor() {
        super('div', {
            className: 'messages',

            // m1: new Message({
            //     messageType: 'text',
            //     textContent: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt eveniet error perferendis eum maiores alias dolore consequuntur quae provident, modi tempora mollitia eius libero voluptatem nisi delectus, perspiciatis quaerat incidunt?',
            //     time: '2:33'
            // }),
            // m2: new Message({
            //     messageType: 'image',
            //     src: '/main.png',
            //     time: '2:33'
            // }),
            // m3: new Message({
            //     messageType: 'image',
            //     fromYou: true,
            //     src: '/image.png',
            //     time: '2:33'
            // }),
            // m4: new Message({
            //     messageType: 'image',
            //     fromYou: true,
            //     src: '/assets/error.png',
            //     time: '2:33'
            // }),
            // m5: new Message({
            //     messageType: 'location',
            //     LAT: 35.535,
            //     LON: 4.567999
            // }),
            // m6: new Message({
            //     messageType: 'image',
            //     src: '/image.png',
            //     time: '2:33'
            // }),

            SayHI: new Button({
                classTypeOfButton: 'secondary small complex',
                buttonType: 'button',
                clientAction: 'Say 👋 Hello'
            })
        })
    }
    public render(): string {
        if (Object.keys(this.children).length > 1) {
            const children_names = Object.keys(this.children);
            const line = [];
            
            for(const name of children_names) {
                line.push(`{{{ ${name} }}}`);
            }
            
            return line.join(' ');
        } else {
            return `
                <div class="meslist-cork">
                    <h3>This chat is empty</h3>
                    <h5>You can start talking by typing message in the input field below or press the button beneath</h5>
                    {{{ SayHI }}}
                </div>
            `
        }
    }
}
