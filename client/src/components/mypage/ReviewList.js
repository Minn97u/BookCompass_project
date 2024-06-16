import React, { useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as StarIcon } from '../../assets/icons/StarIcon.svg';
import { ReactComponent as EmptyStarIcon } from '../../assets/icons/EmptyStar.svg';
import DeleteIcon from '../../assets/icons/DeleteIcon.svg';
import DeleteModal from '../common/DeleteModal';

const ReviewList = ({ datas, type, setList }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const closeModal = () => {
    setModalOpen(false);
    setCurrentId(null);
  };

  const handleDeleteBtn = (listid) => {
    setCurrentId(listid);
    setModalOpen(true);
  };

  const handleDeleteConfirm = (id) => {
    setList(datas.filter((data) => data.id !== id));
    closeModal();
  };

  return (
    <>
      {datas.map((data, index) => (
        <ReviewGroup key={data.id}>
          <StarContainer>
            {[...Array(data.rating)].map((i) => (
              <Star key={i} />
            ))}
            {[...Array(5 - data.rating)].map((i) => (
              <EmptyStar key={i} />
            ))}
            <RatingText>{data.rating}</RatingText>
          </StarContainer>
          <TextContainer>
            <CommentBox>
              <ReviewText>{data.comment}</ReviewText>
              <Date>{data.date}</Date>
            </CommentBox>
            <DeleteWrite>
              <DeleteIconImg
                src={DeleteIcon}
                alt='delete-icon'
                onClick={() => handleDeleteBtn(data.id)}
              />
            </DeleteWrite>
          </TextContainer>
          {datas.length > 1 && index !== datas.length - 1 && <Hr />}
        </ReviewGroup>
      ))}
      {modalOpen && (
        <DeleteModal
          onClose={closeModal}
          id={currentId}
          type={type}
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

const CommentBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const Date = styled.span`
  font-size: 0.8rem;
  color: #afafaf;
  margin-top: 6px;
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
