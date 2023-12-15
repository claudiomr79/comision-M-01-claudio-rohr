import React from "react";
import { useEffect } from "react";

function Post() {
  useEffect(() => {
    fetch("http://localhost:4000/post")
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);
  return (
    <>
      <h1>Post</h1>
    </>
  );
}

export default Post;
