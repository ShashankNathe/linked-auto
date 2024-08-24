"use client";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { generatePost } from "@/app/actions/aiActions";
import { saveSchedule } from "@/app/actions/databaseActions";

const AiForm = () => {
  const { toast } = useToast();
  const [aiRes, setAiRes] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  return (
    <div className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3 px-0">
      <div className="relative flex flex-col items-start gap-8 " x-chunk="dashboard-03-chunk-0">
        <form
          className="grid w-full items-start gap-6"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            const formData = new FormData(e.currentTarget);
            try {
              const data = await generatePost(formData);
              setAiRes(data);
              toast({
                title: "Success",
                description: "Post generated successfully",
              });
            } catch {
              toast({
                title: "Failed",
                description: "Failed to generate post",
                variant: "destructive",
              });
            }
            setLoading(false);
          }}
        >
          <fieldset className="grid gap-6 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">Settings</legend>
            <div className="grid gap-3">
              <Label htmlFor="maxWords">Max word count</Label>
              <Input id="maxWords" name="maxWords" type="number" placeholder="100" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="tone">Tone</Label>
                <Select name="tone" id="tone" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Friendly">Friendly</SelectItem>
                    <SelectItem value="Inspirational">Inspirational</SelectItem>
                    <SelectItem value="Persuasive">Persuasive</SelectItem>
                    <SelectItem value="Casual">Casual</SelectItem>
                    <SelectItem value="Confident">Confident</SelectItem>
                    <SelectItem value="Motivational">Motivational</SelectItem>
                    <SelectItem value="Empathetic">Empathetic</SelectItem>
                    <SelectItem value="Neutral">Neutral</SelectItem>
                    <SelectItem value="Optimistic">Optimistic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="postFormat">Post Format</Label>
                <Select name="postFormat" id="postFormat" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="List (e.g., bullet points or numbered lists)">List (e.g., bullet points or numbered lists)</SelectItem>
                    <SelectItem value="Story (e.g., a narrative or anecdote)">Story (e.g., a narrative or anecdote)</SelectItem>
                    <SelectItem value="Announcement (e.g., news or updates)">Announcement (e.g., news or updates)</SelectItem>
                    <SelectItem value="Question (e.g., engaging the audience with a question)">Question (e.g., engaging the audience with a question)</SelectItem>
                    <SelectItem value="Advice (e.g., tips or suggestions)">Advice (e.g., tips or suggestions)</SelectItem>
                    <SelectItem value="Case Study (e.g., real-world example or testimonial)">Case Study (e.g., real-world example or testimonial)</SelectItem>
                    <SelectItem value="How-To (e.g., instructional or step-by-step guide)">How-To (e.g., instructional or step-by-step guide)</SelectItem>
                    <SelectItem value="Quote (e.g., inspirational or thought-provoking quote)">Quote (e.g., inspirational or thought-provoking quote)</SelectItem>
                    <SelectItem value="Opinion (e.g., personal thoughts or analysis)">Opinion (e.g., personal thoughts or analysis)</SelectItem>
                    <SelectItem value="Comparison (e.g., pros and cons, or side-by-side comparison)">Comparison (e.g., pros and cons, or side-by-side comparison)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea id="prompt" name="prompt" placeholder="Express your ideas.." className="min-h-[9.5rem]" required />
            </div>
            <Button type="submit" size="sm" className="ml-auto gap-1.5" disabled={loading}>
              {loading ? "Generating..." : "Generate"}
            </Button>
          </fieldset>
        </form>
      </div>
      <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
        <div className="flex justify-end mb-4">
          <Badge variant="outline" className="">
            Output
          </Badge>
        </div>

        <form
          className="relative overflow-hidden rounded-lg grid gap-4 px-2"
          x-chunk="dashboard-03-chunk-1"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading2(true);
            const formData = new FormData(e.currentTarget);
            formData.append("type", "Ai Generated");
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
            setLoading2(false);
          }}
        >
          <div className="grid gap-3">
            <Label htmlFor="scheduleDate">Select date and time</Label>
            <input
              type="datetime-local"
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="scheduleDate"
              name="scheduleDate"
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="postContent" className="">
              Post Content
            </Label>
            <Textarea
              id="postContent"
              name="postContent"
              placeholder="AI generated post content"
              className="min-h-60 resize-none border-0 p-3 "
              value={aiRes}
              onChange={(e) => {
                setAiRes(e.currentTarget.value);
              }}
              required
            />
          </div>
          <div className="flex items-center p-3 py-0">
            <Button type="submit" size="sm" className="ml-auto gap-1.5" disabled={loading || loading2}>
              {loading2 ? "Scheduling..." : "Schedule"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AiForm;
