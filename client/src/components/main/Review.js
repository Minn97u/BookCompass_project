import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReviewStar from './ReviewStar';
import WriteReviewIcon from '../../assets/icons/WriteReviewIcon.svg';
import BackIcon from '../../assets/icons/BackIcon.svg';
import ReviewWrite from './ReviewWrite';
import ReviewList from './ReviewList';
import Pagination from './Pagination';
import axios from 'axios';

const Review = ({ rating, placeId }) => {
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [iconImage, setIconImage] = useState(WriteReviewIcon);
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 2;

  const handleToggleReview = () => {
    setIsWriteReviewOpen(!isWriteReviewOpen);
    setIconImage(isWriteReviewOpen ? WriteReviewIcon : BackIcon);
    console.log('userId:', userId);
  };

  const refreshReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/reviews?placeId=${placeId}`
      );
      setReviews(response.data);
    } catch (error) {
      console.error('리뷰를 불러오는 데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    refreshReviews();
  }, [placeId]);

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEditReview = async (editedReview) => {
    try {
      // Implement your edit review functionality here
      console.log('Editing review:', editedReview);
      // Example: You can use axios.put() to send edited review data to the server
    } catch (error) {
      console.error('리뷰 수정 중 오류 발생:', error);
    }
  };

  return (
    <Container>
      <ReviewTitle>
        <TitleText>
          <span>리뷰({reviews.length})</span>
          <span>
            <ReviewStar rating={rating} />
          </span>
        </TitleText>
        <WriteReviewIconWrapper onClick={handleToggleReview}>
          <img src={iconImage} alt='WriteReviewIcon' />
        </WriteReviewIconWrapper>
      </ReviewTitle>

      {isWriteReviewOpen ? (
        <ReviewWrite
          placeId={placeId}
          userId={userId}
          refreshReviews={refreshReviews}
          onClose={handleToggleReview}
        />
      ) : (
        currentReviews.map((review) => (
          <ReviewList
            key={review._id}
            reviewId={review._id} // Pass reviewId to ReviewList
            rating={review.rating}
            comment={review.comment}
            user={review.user}
            date={review.date}
            loggedInUserId={userId} // Pass loggedInUserId to ReviewList
            handleEditReview={handleEditReview} // Pass handleEditReview function
            userId={review.userId} // Pass userId of each review
          />
        ))
      )}

      <Pagination
        reviewsPerPage={reviewsPerPage}
        totalReviews={reviews.length}
        paginate={paginate}
      />
    </Container>
  );
};

export default Review;

const Container = styled.div`
  top: 50%;
  padding: 20px 0;
  border-radius: 0 0 20px 20px;
  width: 100%;
`;

const ReviewTitle = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 18px;
  color: #191619;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 20px;
  width: 100%;
  border-bottom: 0.5px solid #c0c0c0;
  box-sizing: border-box;
  padding-bottom: 5px;
`;

const TitleText = styled.div`
  display: flex;
  align-items: center;
  & > span {
    margin-right: 10px;
  }
  flex-grow: 1;
`;

const WriteReviewIconWrapper = styled.span`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 0;
`;
