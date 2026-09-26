import { useState } from "react";

function ProfileProgress() {
  const [progress, setProgress] = useState(0);

  return (
    <div>
      <h2>Profile Progress</h2>

      <p>{progress}% completed</p>

      <button onClick={() => setProgress(progress + 10)}>
        Complete Step
      </button>
    </div>
  );
}

export default ProfileProgress;