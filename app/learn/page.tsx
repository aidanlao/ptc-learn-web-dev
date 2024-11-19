import fs from "fs";

import Markdown from "markdown-to-jsx";

export default function Learn() {
  // const getPostContent = (slug: string) => {
  //     const folder = "posts/";

  //     const content =
  //     return content;
  //   };

  const file = `projects/test.md`;
  const content = fs.readFileSync(file, "utf8");

  console.log("the content in question");
  console.log(content);

  return (
    <>
      <div className="w-full h-full flex justify-center">
        <Markdown className="markdown">{content}</Markdown>
      </div>
    </>
  );
}
