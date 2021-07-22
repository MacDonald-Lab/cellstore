import { Grid } from "carbon-components-react";
import { useFetch } from "../../components/Hooks";
import InlineMessage from "../../components/InlineMessage";
import PageHeader from "../../components/PageHeader";
import SkeletonPages from "../../components/SkeletonPages";
import relativeDate from 'tiny-relative-date'
import PageSection from "../../components/PageSection/PageSection";

const MessagesPage = () => {

    const {loading, data} = useFetch([{url: "getMessages"}]);
    const {getMessages: messages} = data;

    if (loading) return <SkeletonPages page="MessagesPage" />;
    if (!messages) return <p>Error</p>

    return (
    <Grid>
        <PageHeader pageTitle="Messages" description="View the history of all errors or informative messages."/>
        <PageSection title="Showing last 50 messages" />
        {messages.map(message => {
            const date = new Date(message.createdAt);

        return <div key={message.id}>
            <InlineMessage permanent type={message.type} title={message.title} detail={message.detail}  />
            <p>{relativeDate(date)}</p>
            <p style={{color: "#808080"}}>{date.toDateString()} {date.toTimeString()}</p>
            
            </div>}
        
        
        )}
    </Grid>
        )

}

export default MessagesPage;