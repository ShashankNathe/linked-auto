"use client";

import React, { useState } from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { updatePost } from "@/app/actions/databaseActions";
const UpdateForm = ({ post }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const posId = post._id.toString();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        let postContent = formData.get("postContent");
        if (postContent.length > 3000) {
          toast({
            title: "Update failed",
            description: "Post content should be less than 3000 characters",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        try {
          const data = await updatePost(posId, formData);
          if (data.success) {
            toast({
              title: "Update saved",
              description: "Post updated successfully",
            });
          } else {
            toast({
              title: "UUpdate failed",
              description: "Failed to update post",
              variant: "destructive",
            });
          }
        } catch {
          toast({
            title: "Update failed",
            description: "Failed to update post",
            variant: "destructive",
          });
        }
        setLoading(false);
      }}
    >
      <CardContent>
        <div className="flex flex-col space-y-1.5 mb-8">
          <Label htmlFor="postContent">Post Content</Label>
          <Textarea className="min-h-52" name="postContent">
            {post.content}
          </Textarea>
        </div>
        <div className="flex flex-col space-y-1.5 mb-8">
          <Label htmlFor="scheduleDate">Select date and time</Label>
          <input
            type="datetime-local"
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            id="scheduleDate"
            name="scheduleDate"
            defaultValue={new Date(post.scheduleDate).toISOString().slice(0, 16)}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select name="status" id="status" required defaultValue={post.status}>
            <SelectTrigger>
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default UpdateForm;
