"use client";
import React, { useState } from "react";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { saveSchedule } from "@/app/actions/databaseActions";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

const ScheduleForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  return (
    <div className="w-full mt-10">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const formData = new FormData(e.currentTarget);
          let postContent = formData.get("postContent");
          if (postContent.length > 3000) {
            toast({
              title: "Failed",
              description: "Post content should be less than 3000 characters",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
          formData.append("type", "Manual");
          try {
            const data = await saveSchedule(formData);
            if (data.success) {
              toast({
                title: "Schedule saved",
                description: "Post scheduled successfully",
              });
            } else {
              toast({
                title: "Schedule failed",
                description: "Failed to schedule post",
                variant: "destructive",
              });
            }
          } catch {
            toast({
              title: "Schedule failed",
              description: "Failed to schedule post",
              variant: "destructive",
            });
          }
          setLoading(false);
        }}
      >
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="postContent">Post content</Label>
            <Textarea placeholder="Type your post content here." id="postContent" name="postContent" required />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="scheduleDate">Select date and time</Label>
            <input
              type="datetime-local"
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="scheduleDate"
              name="scheduleDate"
            />
          </div>
        </div>
        <CardFooter className="flex justify-end mt-5 pe-0">
          <Button disabled={loading}>{loading ? "Scheduling..." : "Schedule"}</Button>
        </CardFooter>
      </form>
    </div>
  );
};

export default ScheduleForm;
