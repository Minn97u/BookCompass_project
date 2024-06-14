import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ReactComponent as StarIcon } from '../../assets/icons/StarIcon.svg';
import { ReactComponent as EmptyStarIcon } from '../../assets/icons/EmptyStar.svg';
import DeleteIcon from '../../assets/icons/DeleteIcon.svg';
import DeleteModal from '../common/DeleteModal';
import { getMyReviews, deleteMyReview } from '../../api/Mypage';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getMyReviews();
        setReviews(response.data);
      } catch (error) {
        console.error('리뷰를 가져오지 못했습니다.', error);
      }
    };

    fetchReviews();
  }, []);

  const closeModal = () => {
    setModalOpen(false);
    setCurrentId(null);
  };

  const handleDeleteBtn = (id) => {
    setCurrentId(id);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async (id) => {
    try {
      await deleteMyReview(id); // 리뷰 삭제 API 호출
      setReviews(reviews.filter((review) => review._id !== id));
      closeModal();
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
    }
  };

  return (
    <>
      {reviews.map((review) => (
        <ReviewGroup key={review._id}>
          <TextContainer>
            <ReviewText>{review.comment}</ReviewText>
            <DeleteWrite>
              <DeleteIconImg
                src={DeleteIcon}
                alt='delete-icon'
                onClick={() => handleDeleteBtn(review._id)}
              />
            </DeleteWrite>
          </TextContainer>
          <Hr />
        </ReviewGroup>
      ))}
      {modalOpen && (
        <DeleteModal
          onClose={closeModal}
          id={currentId}
          type='review'
          deleteSuccess={handleDeleteConfirm}
        />
      )}
    </>
  );
};

export default ReviewList;

const ReviewGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const StarContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const Star = styled(StarIcon)`
  width: 1.3rem;
  height: 1.2rem;
`;

const EmptyStar = styled(EmptyStarIcon)`
  width: 1.3rem;
  height: 1.2rem;
`;

const RatingText = styled.span`
  font-size: 1.1rem;
  margin-left: 12px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  text-align: left;
`;

const ReviewText = styled.div`
  font-size: 1.1rem;
`;

const DeleteWrite = styled.button`
  border: none;
  background-color: transparent;
`;

const DeleteIconImg = styled.img`
  width: 1.2rem;
  cursor: pointer;
  margin-left: 60px;
`;

const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ededed;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;
