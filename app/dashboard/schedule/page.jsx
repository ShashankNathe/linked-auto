"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Schedule() {
  const [post, setPost] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("/api/posts/schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ post }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Post scheduled successfully");
    } else {
      alert(`Error: ${data.message}`);
    }
  };

  return (
    <div>
      <h1>Schedule a Post</h1>
      <form onSubmit={handleSubmit}>
        <textarea placeholder="Write your post here" value={post} onChange={(e) => setPost(e.target.value)} />
        <button type="submit">Schedule Post</button>
      </form>
    </div>
  );
}
