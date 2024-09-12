import { useRouter } from "next/router";
import React from "react";

function BlogPostPage() {
  const router = useRouter();
  console.log(router.query);

  return (
    <div>
      <h1>Post:{router.query.slug.join("/")}</h1>
    </div>
  );
}

export default BlogPostPage;
