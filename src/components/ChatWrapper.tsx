import { Chat } from "./Chat";
import { User, Presence, UserStatus, useChat, Participant, ConversationRole, Conversation, TypingUsersList, ConversationId } from "@chatscope/use-chat";
import React, { useEffect } from 'react';


const john = new User({
    id: 'john',
    presence: new Presence({ status: UserStatus.Available, description: 'hi' }),
    firstName: 'John',
    lastName: 'Doe',
    username: 'GPT 4 turbo',
    email: 'j@j.com',
    avatar: 'https://avatars.githubusercontent.com/u/9919?v=4&s=64',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis diam eu nunc accumsan ultricies. Donec eget diam nec libero luctus ornare. Sed euismod, nisl quis lacinia hendrerit, diam nunc tincidunt odio, vitae aliquam nisi nisl quis nunc. Sed euismod, nisl quis lacinia hendrerit, diam nunc tincidunt odio, vitae aliquam nisi nisl quis nunc.',
    data: {},
})

const amy = new User({
    id: 'amy',
    presence: new Presence({ status: UserStatus.Available, description: 'hi' }),
    firstName: 'amy',
    lastName: 'ff',
    username: 'amy',
    email: 'i@i.com',
    avatar: 'https://avatars.githubusercontent.com/u/9919?v=4&s=64',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis diam eu nunc accumsan ultricies. Donec eget diam nec libero luctus ornare. Sed euismod, nisl quis lacinia hendrerit, diam nunc tincidunt odio, vitae aliquam nisi nisl quis nunc. Sed euismod, nisl quis lacinia hendrerit, diam nunc tincidunt odio, vitae aliquam nisi nisl quis nunc.',
    data: {},
})


function createConversation(id: ConversationId, name: string): Conversation {
    return new Conversation({
        id,
        participants: [
            new Participant({
                id: name,
                role: new ConversationRole([])
            })
        ],
        unreadCounter: 0,
        typingUsers: new TypingUsersList({ items: [] }),
        draft: ""
    });
}

type ChatWrapperProps = {
} & React.HTMLAttributes<HTMLDivElement>

export const ChatWrapper: React.FC<ChatWrapperProps> = ({ ...rest }: ChatWrapperProps) => {
    const { addConversation, setActiveConversation, addUser } = useChat()

    useEffect(() => {
        addUser(john)
        addUser(amy)

        const c = createConversation("1", "john")
        c.addParticipant(new Participant({
            id: 'amy',
            role: new ConversationRole([]),
        }))

        addConversation(c)
        setActiveConversation("1")
    }, [])

    return (
        <div {...rest}>
            <Chat user={john} />
        </div>
    )
}
