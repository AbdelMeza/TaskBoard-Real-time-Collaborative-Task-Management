import button from './Button.module.scss';

export default function Button({ content, isDisabled }: { content: string, isDisabled: boolean }) {
    return <button className={`button-element ${button.mainButton} ${isDisabled ? button.disabled : ""}`}>
        {content}
    </button>
}