"use client";
import React, { useState } from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { deletePost } from "@/app/actions/databaseActions";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";

const DeletePost = ({ id }) => {
  const { toast } = useToast();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const data = await deletePost(id);
      if (data.success) {
        toast({
          title: "Post deleted",
          description: "Post deleted successfully",
          variant: "success",
        });
      } else {
        toast({
          title: "Delete failed",
          description: "Failed to delete post",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Delete failed",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
    setDeleteLoading(false);
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        toast({
          title: "Confirm",
          description: "Are you sure you want to delete this post?",
          action: (
            <ToastAction altText="Delete" onClick={confirmDelete}>
              Delete
            </ToastAction>
          ),
        });
      }}
    >
      <DropdownMenuItem className="text-red-500">
        <button className="w-full" type="submit" disabled={deleteLoading}>
          {deleteLoading ? "Deleting..." : "Delete"}
        </button>
      </DropdownMenuItem>
    </form>
  );
};

export default DeletePost;
