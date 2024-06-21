import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReviewStar from './ReviewStar';
import WriteReviewIcon from '../../assets/icons/WriteReviewIcon.svg';
import BackIcon from '../../assets/icons/BackIcon.svg';
import ReviewWrite from './ReviewWrite';
import ReviewList from './ReviewList';
import Pagination from './Pagination';
import axios from 'axios';
import ReviewEdit from './ReviewEdit'; // 추가된 부분
import { getReviews, editReview } from '../../api/Main'; // 경로에 따라 실제 경로로 수정 필요

const Review = ({ rating, placeId, placeType }) => {
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [iconImage, setIconImage] = useState(WriteReviewIcon);
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);

  const reviewsPerPage = 2;

  const handleToggleReview = () => {
    setIsWriteReviewOpen(!isWriteReviewOpen);
    setIconImage(isWriteReviewOpen ? WriteReviewIcon : BackIcon);
  };

  const refreshReviews = async () => {
    try {
      const response = await getReviews(placeId);
      setReviews(response.data);
    } catch (error) {
      console.error('리뷰를 불러오는 데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    refreshReviews();
  }, [placeId]);

  useEffect(() => {
    setIconImage(isWriteReviewOpen || isEditing ? BackIcon : WriteReviewIcon);
  }, [isWriteReviewOpen, isEditing]);

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEditClick = (review) => {
    setCurrentReview(review);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setCurrentReview(null);
    setIsEditing(false);
  };

  const handleSaveEdit = async (editedReview) => {
    try {
      await editReview(editedReview); // 실제 리뷰 수정 API 호출
      alert('리뷰가 수정되었습니다.');
      refreshReviews();
      handleCancelEdit();
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
          placeType={placeType}
          refreshReviews={refreshReviews}
          onClose={handleToggleReview}
        />
      ) : isEditing && currentReview ? (
        <ReviewEdit
          reviewId={currentReview._id}
          onClose={handleCancelEdit}
          refreshReviews={refreshReviews}
        />
      ) : (
        currentReviews.map((review) => (
          <ReviewList
            key={review._id}
            reviewId={review._id}
            rating={review.rating}
            comment={review.comment}
            user={review.user.name}
            date={review.date}
            loggedInUserId={userId}
            handleEditReview={() => handleEditClick(review)}
            userId={review.user._id}
            placeType={placeType}
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
  align-self: flex-end;
  cursor: pointer;
`;
