"use client";
import { useRouter } from "next/navigation";

const BackTrackBtn = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back(); // This function navigates back to the previous page in the browser's history
  };

  return (
    <button onClick={handleGoBack} className='btn btn-ghost'>
      Go Back
    </button>
  );
};

export default BackTrackBtn;
