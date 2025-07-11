import ChatClientLayout from "../../../Layout/User/chatclientlayout";

export default function IndaLayout({children}: {children: React.ReactNode}){
    return(
        <ChatClientLayout>
            {children}
        </ChatClientLayout>
    )
}