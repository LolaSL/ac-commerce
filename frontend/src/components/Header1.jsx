import React from "react";

export default function Header1() {
  return (
    <div className="container mt-4 pt-2">
       <h1 className="header-title  mb-4 text-center">
             New products
            </h1>
      <iframe
        className="responsive-iframe rounded"
        width="1300"
        height="700"
        src="https://www.youtube.com/embed/1dQ1MBSUHoQ?si=XgYwIiFsEHXc1Cl7&amp;clip=UgkxU-wNgQmBp0v_YmQiAkAlIHFzL6GTFAIK&amp;clipt=ENizARjwqAI"
        title="Samsung WindFree AC Technology"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </div>
  );
}
