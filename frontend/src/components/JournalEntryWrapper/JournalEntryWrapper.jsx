import { useParams } from "react-router-dom";
import JournalEntry from "../JournalEntry/JournalEntry";

export default function JournalEntryWrapper() {
  const { entryId } = useParams(); // Må matche route-definisjonen!
  return <JournalEntry entryId={entryId} />;
}