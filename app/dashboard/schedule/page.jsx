import React from "react";
import ScheduleForm from "./ScheduleForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AiForm from "./AiForm";

const page = () => {
  return (
    <div className="p-5">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Schedule a post</CardTitle>
          <CardDescription>Schedule a post to be published at a later date and time.</CardDescription>
        </CardHeader>
        <Tabs defaultValue="ai">
          <TabsList className="mx-5">
            <TabsTrigger value="ai">Generate using AI</TabsTrigger>
            <TabsTrigger value="normal">Normal</TabsTrigger>
          </TabsList>
          <CardContent>
            <TabsContent value="ai">
              <AiForm />
            </TabsContent>
            <TabsContent value="normal">
              <ScheduleForm />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default page;
