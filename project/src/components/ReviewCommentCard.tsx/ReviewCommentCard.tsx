import React from "react";
import Image from "next/image";
import { ProductProps } from "../ProductCard/ProductCard";
import prisma from "@/utils/db/prisma";
import { Review } from "@prisma/client";
import { getUser } from "@/actions/userActions";
import placeholder from "@/assets/profile-pic-placeholder.png";

interface ReviewCommentCardProps {
  review: Review;
}

const ReviewCommentCard = async ({ review }: ReviewCommentCardProps) => {
  const user = await getUser(review.userId);
  console.log("logging user", user);
  console.log("logging review from review comment card", review);

  return (
    <div className='flex flex-col gap-4 w-52'>
      <div className='flex gap-4 items-center'>
        <div className=' w-16 h-16 rounded-full shrink-0'>
          <Image
            className=' w-16 h-16 rounded-full shrink-0'
            src={user?.image || placeholder}
            width={50}
            height={50}
            alt='user profile image'
          />
        </div>
        <div className='flex flex-col gap-4'>
          <div className=' h-4 w-20'>
            <p>Rating: {review.rating}</p>
          </div>
        </div>
      </div>
      <div className=' h-32 w-full'>Review: {review.comment}</div>
    </div>
  );
};

export default ReviewCommentCard;
