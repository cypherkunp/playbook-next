import { useRouter } from "next/router";
import React from "react";

function PortfolioProjectPage() {
  const router = useRouter();
  const pageId = router.query["portfolioid"];

  return (
    <div>
      <h1>Project Page</h1>
      <h2>Page ID: {pageId}</h2>
    </div>
  );
}

export default PortfolioProjectPage;
