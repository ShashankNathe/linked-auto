import React from "react";
import ScheduleForm from "./ScheduleForm";
import { saveSchedule } from "@/app/actions/databaseActions";

const page = () => {
  const schedulePost = async (formData) => {
    "use server";

    console.log(formData);
    console.log(formData.get("email"));

    // const res = await saveSchedule(formData);
    // console.log(res);
  };
  return (
    <div>
      <ScheduleForm savePost={schedulePost} />
    </div>
  );
};

export default page;
