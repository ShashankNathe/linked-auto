"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { saveSchedule } from "@/app/actions/databaseActions";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const ScheduleForm = () => {
  const [date, setDate] = useState();

  const { toast } = useToast();
  return (
    <div className="flex justify-center items-center">
      <Card className="w-11/12 sm:w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Sign in to your existing account</CardDescription>
        </CardHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = await saveSchedule(formData);
            if (data.success) {
              toast({
                title: "Schedule saved",
                description: "Post scheduled successfully",
                variant: "success",
              });
            } else {
              toast({
                title: "Schedule failed",
                description: "failed to schedule post",
                variant: "destructive",
              });
            }
          }}
        >
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="message">Post content</Label>
                <Textarea placeholder="Type your post content here." id="message" name="message" required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="date" placeholder="Password" name="password" />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? date : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>Schedule</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ScheduleForm;
