import { useEffect } from "react";
import "./App.css";
import { initChinaMap } from "./initChinaMap";

function App() {
  useEffect(() => {
    const mapInstance = initChinaMap();
    return () => {
      mapInstance && mapInstance.destroy && mapInstance.destroy();
    };
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
