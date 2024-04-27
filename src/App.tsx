import { useEffect } from "react";
import "./App.css";
import { initChinaMap } from "./initChinaMap";

function App() {
  useEffect(() => {
    initChinaMap();
  }, []);

  return (
    <div className="root-app">
      <div className="map-gd">
        <canvas id="canvas" />
      </div>
    </div>
  );
}

export default App;
