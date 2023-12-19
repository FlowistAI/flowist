export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea: React.FC<TextAreaProps> = ({ ...props }) => {
    return (
        <textarea
            {...props}
            className={'block p-2.5 w-full text-gray-900 bg-gray-50 rounded-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500 ' +
                props.className
            }
        />
    )
}
