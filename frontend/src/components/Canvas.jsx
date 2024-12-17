import React, {useState} from "react";

export default function Canvas({ canvasRef }) {

    const [previewUrl] = useState(null);
  return (
    <canvas
    ref={canvasRef}
    width="1400"
    height="1750"
  
    style={{
      backgroundImage: `url(${previewUrl})`,
      backgroundSize: "cover",
    }}
    ></canvas>
  );
}
