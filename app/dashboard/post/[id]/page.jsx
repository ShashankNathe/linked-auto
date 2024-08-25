import { getPostStats } from "@/app/actions/linkedinActions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { MessageCircle, ThumbsUp } from "lucide-react";
import React from "react";
import UpdateForm from "./UpdateForm";
export const fetchCache = "force-no-store";
const page = async (id) => {
  const data = await getPostStats(id.params.id);
  if (!data || !data.post) return <p className="prose prose-neutral dark:prose-invert leading-8 min-h-[80vh] flex items-center justify-center">Something went wrong!!</p>;
  const badgeColor = {
    published: "bg-green-500",
    paused: "bg-red-400",
    scheduled: "bg-blue-500",
  };
  return (
    <Card className="m-2 mx-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span>Post Details</span>
          <Badge className={`${badgeColor[data.post.status] ? badgeColor[data.post.status] : "bg-blue-500"}`}>
            {data.post.status.charAt(0).toUpperCase() + data.post.status.slice(1)}
          </Badge>
        </CardTitle>
        <CardDescription>Details of the post</CardDescription>
      </CardHeader>

      {data.post.status == "published" ? (
        <>
          <CardContent>
            <p className="prose prose-neutral dark:prose-invert leading-8">{data.post.content}</p>
          </CardContent>
          <CardFooter className="flex items-center gap-4">
            <div className="flex items-end">
              <ThumbsUp size={24} />
              <span className="ml-2">
                {data.likes} {data.likes > 1 ? "Likes" : "Like"}
              </span>
            </div>
            <div className="flex items-end">
              <MessageCircle size={24} />
              <span className="ml-2">
                {data.comments} {data.comments > 1 ? "Comments" : "Comment"}
              </span>
            </div>
          </CardFooter>
        </>
      ) : (
        <UpdateForm post={JSON.parse(JSON.stringify(data.post))} />
      )}
    </Card>
  );
};

export default page;
