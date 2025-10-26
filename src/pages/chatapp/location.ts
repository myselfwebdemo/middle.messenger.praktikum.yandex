import Block from 'core/block';

export default class Map extends Block {
    constructor(props: any) {
        super('iframe', {
            ...props,
            attrs: {
                width: '250',
                height: '150',
                style: 'border: 0;',
                loading: 'lazy',
                referrerpolicy: 'no-referrer-when-downgrade',
                src: 'https://www.google.com/maps?q=37.9838,23.7275&z=15&output=embe'
            }
        })
    }
}
