import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const loading = () => {
  return (
    <div className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8 w-full">
      <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 w-1/3">
        <div className="flex items-center gap-4">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">Profile</h1>
        </div>
        <div className="grid gap-4 grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 col-span-3 lg:gap-8 ">
            <Card x-chunk="dashboard-07-chunk-0" className="flex items-center justify-start flex-col p-4 w-full ">
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default loading;
