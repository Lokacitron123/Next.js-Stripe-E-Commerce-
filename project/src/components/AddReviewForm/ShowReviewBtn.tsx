"use client";
import { createReview } from "@/actions/reviewActions";
import { useState } from "react";

interface SubmitReviewBtnProps {
  orderId: string;
  productName: string;
}

const AddReviewFormBtn: React.FC<SubmitReviewBtnProps> = ({
  orderId,
  productName,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleCloseModal();
  };

  return (
    <>
      <button className='btn' onClick={handleOpenModal}>
        Add Review
      </button>
      {showModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-8 rounded-md w-full md:w-1/2 lg:w-1/3 relative'>
            <div className='flex w-full justify-end'>
              <button className='btn btn-circle ' onClick={handleCloseModal}>
                X
              </button>
            </div>
            <h2 className='text-lg font-semibold mb-4'>
              Submit Review for {productName}
            </h2>
            <form action={createReview}>
              <input type='hidden' name={productName} value={productName} />
              <textarea
                name='comment'
                className='w-full h-32 border rounded-md p-2 mb-4 text-white'
                placeholder='Enter your review...'
                required
              />
              <label className='block mb-4'>
                Rating:
                <select
                  name='rating'
                  className='ml-2 border rounded-md p-2 text-white'
                  required
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </label>
              <button type='submit' className='btn btn-primary'>
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddReviewFormBtn;
