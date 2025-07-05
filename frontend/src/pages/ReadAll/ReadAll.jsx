import ShowEntries from "../../components/ShowEntries/showEntries"
import KeywordList from "../../components/KeywordList/KeywordList"

export default function ReadAll() {
    return (
        <div>
            <h2>Read all my musings</h2>
            <ShowEntries grid={true} />
            <KeywordList />
        </div>
    )
}