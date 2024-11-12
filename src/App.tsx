import React from "react";
import ReactDOM from "react-dom/client";
import Index from "./Index";
import { startTryon, setMakeupState, takeSnapShot } from "./main";

await startTryon();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Index setMakeupState={setMakeupState} takeSnapShot={takeSnapShot} />
);
