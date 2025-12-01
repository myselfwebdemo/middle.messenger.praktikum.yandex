import Block from "core/Block";
import './image.css';

interface ImageProps {
    class: string
    src: string | null
    alt: string
    directLink?: boolean
}
export default class Image extends Block {
    constructor(props: ImageProps) {
        super('img', {
            ...props,
            className: `app-img u-${props.class}`,
            attrs: {
                src: props.directLink ? props.src : (props.src ? `/assets/${props.src}` : '/assets/profile/default.png'),
                alt: props.alt
            }
        })
    }
    componentDidUpdate(oldProps: ImageProps, newProps: ImageProps) {
        if (oldProps.src !== newProps.src) {
            (this._element as unknown as HTMLElement).setAttribute('src', newProps.src || '/profile/default.png');
        }
        if (oldProps.alt !== newProps.alt) {
            (this._element as unknown as HTMLElement).setAttribute('alt', newProps.alt);
        }
        return true;
    }
    public render(): string {
        return ``
    }
}
