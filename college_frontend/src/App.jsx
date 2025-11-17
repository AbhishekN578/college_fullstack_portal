import { useState } from "react";
import Login from "./Login";
import AddPost from "./AddPost";
import Posts from "./Posts";

export default function App() {
  const [student, setStudent] = useState(null);

  if (!student) return <Login setStudent={setStudent} />;

  return (
    <div>
      <AddPost student={student} />
      <Posts />
    </div>
  );
}
