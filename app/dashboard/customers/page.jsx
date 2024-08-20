import React from "react";

const page = async () => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const response = await fetch("http://localhost:5000/api/customers", requestOptions);
  const result = await response.json();
  console.log(result);

  return (
    <div>
      $
      {result.data.map((r) => (
        <code>
          {r.name}, {r.email}
        </code>
      ))}
    </div>
  );
};

export default page;
