export type IconOnlyButtonProps = {
    onClick?: () => void
    children: React.ReactNode
}

export const IconOnlyButton = (props: IconOnlyButtonProps) => {
    return (
        <button
            className="flex hover:bg-gray-200 rounded active:bg-gray-300 p-1 cursor-default"
            onClick={props.onClick}
        >
            {props.children}
        </button>
    )
}
