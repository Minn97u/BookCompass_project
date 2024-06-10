import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Modal from 'react-modal';
import { ReactComponent as UserIcon } from '../../assets/icons/usericon.svg';
import { ReactComponent as CloseIcon } from '../../assets/icons/closebutton.svg';
import { ReactComponent as WriteIcon } from '../../assets/icons/writebutton.svg';
import { ReactComponent as PicAddIcon } from '../../assets/icons/picaddbutton.svg';
import { ReactComponent as ArrowLeft } from '../../assets/icons/arrowleft.svg';
import { ReactComponent as ArrowRight } from '../../assets/icons/arrowright.svg';
import { ReactComponent as DoubleArrowLeft } from '../../assets/icons/doublearrowleft.svg';
import { ReactComponent as DoubleArrowRight } from '../../assets/icons/doublearrowright.svg';

const Board = () => {
  const [items, setItems] = useState([]);
  const [activeTag, setActiveTag] = useState('전체');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const itemsPerPage = 10;
  const pagesToShow = 5;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(
          'https://jsonplaceholder.typicode.com/posts'
        );
        const fetchedItems = res.data.map((post) => ({
          id: post.id,
          text: post.title,
          body: post.body,
          imgSrc: 'https://via.placeholder.com/150',
          comments: [
            { id: 1, author: '이름', text: '고양이 귀여워' },
            { id: 2, author: '이름', text: '고양이 귀여워' }
          ]
        }));
        setItems(fetchedItems);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const handleTagClick = (tag) => {
    setActiveTag(tag);
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setModalIsOpen(true);
    setIsEditing(false);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedItem(null);
    setIsEditing(false);
  };

  const handleWriteIconClick = () => {
    setSelectedItem(null);
    setNewTitle('');
    setNewContent('');
    setModalIsOpen(true);
  };

  const handlePicAddIconClick = () => {
    return null;
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFirstPageClick = () => {
    setCurrentPage(1);
  };

  const handleLastPageClick = () => {
    setCurrentPage(totalPages);
  };

  const handlePrevPageClick = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPageClick = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePostSubmit = async () => {
    try {
      const response = await axios.post(
        'https://jsonplaceholder.typicode.com/posts',
        {
          title: newTitle,
          content: newContent
        }
      );
      console.log('Post submitted successfully:', response.data);
      closeModal();
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  const handleEditClick = () => {
    console.log('edit clicked');
    setNewTitle(selectedItem.text);
    setNewContent(selectedItem.body);
    console.log(newTitle);
    setIsEditing(true);
    setModalIsOpen(true);
    console.log('edit clicked2');
    console.log(isEditing);
  };

  const handleEditSubmit = async () => {
    if (selectedItem) {
      try {
        const response = await axios.put(
          'https://jsonplaceholder.typicode.com/posts/1',
          {
            title: newTitle,
            content: newContent
          }
        );
        console.log('Post edited successfully:', response.data);
        closeModal();
      } catch (error) {
        console.error('Error editing post:', error);
      }
    }
  };

  const handleDeleteClick = async () => {
    try {
      const response = await axios.delete(
        'https://jsonplaceholder.typicode.com/posts/1'
      );
      console.log('Post deleted successfully:', response.data);
      closeModal();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleCommentSubmit = async (postId, comment) => {
    try {
      const response = await axios.post(
        `https://jsonplaceholder.typicode.com/posts/${postId}/comments`,
        {
          body: comment,
          postId: postId
        }
      );
      console.log('Comment submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + pagesToShow - 1);

  return (
    <BoardContainer>
      <BoardTagsContainer>
        <BoardTags>
          <Button
            isActive={activeTag === '전체'}
            onClick={() => handleTagClick('전체')}
          >
            전체
          </Button>
          <Button
            isActive={activeTag === '추천 장소'}
            onClick={() => handleTagClick('추천 장소')}
          >
            추천 장소
          </Button>
          <Button
            isActive={activeTag === '같이 해요'}
            onClick={() => handleTagClick('같이 해요')}
          >
            같이 해요
          </Button>
        </BoardTags>
        <WriteIcon onClick={handleWriteIconClick} />
      </BoardTagsContainer>
      <BoardContent>
        {paginatedItems.map((item) => (
          <BoardItem key={item.id} onClick={() => openModal(item)}>
            <Image src={item.imgSrc} alt={item.text} />
            <Text>{item.text}</Text>
          </BoardItem>
        ))}
      </BoardContent>
      <PaginationContainer>
        <PaginationButton onClick={handleFirstPageClick}>
          <DoubleArrowLeft />
        </PaginationButton>
        <PaginationButton onClick={handlePrevPageClick}>
          <ArrowLeft />
        </PaginationButton>
        {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
          <PaginationButton
            key={startPage + index}
            isActive={currentPage === startPage + index}
            onClick={() => handlePageClick(startPage + index)}
          >
            {startPage + index}
          </PaginationButton>
        ))}
        <PaginationButton onClick={handleNextPageClick}>
          <ArrowRight />
        </PaginationButton>
        <PaginationButton onClick={handleLastPageClick}>
          <DoubleArrowRight />
        </PaginationButton>
      </PaginationContainer>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Item Detail Modal'
        ariaHideApp={false}
        style={customModalStyles}
      >
        {selectedItem === null ? (
          <ModalContent>
            <CloseButton onClick={closeModal}>
              <CloseIcon />
            </CloseButton>
            <ModalHeader></ModalHeader>
            <ModalBody>
              <CommentSection>
                <TitleInput
                  placeholder='제목을 입력해 주세요.'
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <HrLine />
                <BoardTagsContainer>
                  <BoardTags>
                    <Button
                      isActive={activeTag === '추천 장소'}
                      onClick={() => handleTagClick('추천 장소')}
                    >
                      추천 장소
                    </Button>
                    <Button
                      isActive={activeTag === '같이 해요'}
                      onClick={() => handleTagClick('같이 해요')}
                    >
                      같이 해요
                    </Button>
                  </BoardTags>
                  <PicAddIcon onClick={handlePicAddIconClick} />
                </BoardTagsContainer>
                <ContentTextArea
                  placeholder='내용을 입력해 주세요.'
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />
                <CommentButton onClick={handlePostSubmit}>등록</CommentButton>
              </CommentSection>
            </ModalBody>
          </ModalContent>
        ) : isEditing ? (
          <ModalContent>
            <CloseButton onClick={closeModal}>
              <CloseIcon />
            </CloseButton>
            <ModalHeader></ModalHeader>
            <ModalBody>
              <CommentSection>
                <TitleInput
                  placeholder='제목을 입력해 주세요.'
                  value={selectedItem.text}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <HrLine />
                <BoardTagsContainer>
                  <BoardTags>
                    <Button
                      isActive={activeTag === '추천 장소'}
                      onClick={() => handleTagClick('추천 장소')}
                    >
                      추천 장소
                    </Button>
                    <Button
                      isActive={activeTag === '같이 해요'}
                      onClick={() => handleTagClick('같이 해요')}
                    >
                      같이 해요
                    </Button>
                  </BoardTags>
                  <PicAddIcon onClick={handlePicAddIconClick} />
                </BoardTagsContainer>
                <ContentTextArea
                  placeholder='내용을 입력해 주세요.'
                  value={selectedItem.body}
                  onChange={(e) => setNewContent(e.target.value)}
                />
                <CommentButton onClick={handleEditSubmit}>수정</CommentButton>
              </CommentSection>
            </ModalBody>
          </ModalContent>
        ) : (
          <ModalContent>
            <CloseButton onClick={closeModal}>
              <CloseIcon />
            </CloseButton>
            <ModalHeader>
              <ModalTitle>{selectedItem.text}</ModalTitle>
              <ModalDate>2024.06.03</ModalDate>
              <ModalAuthor>작성자</ModalAuthor>
            </ModalHeader>
            <HrLine />
            <ModalBody>
              <div>
                <Image src={selectedItem.imgSrc} alt={selectedItem.text} />
                <Text>{selectedItem.body}</Text>
              </div>
              <CommentSection>
                <FlexContainer>
                  <h3>댓글</h3>
                  <ActionButtons>
                    <TextButton onClick={handleEditClick}>수정</TextButton>
                    <TextButton onClick={handleDeleteClick}>삭제</TextButton>
                  </ActionButtons>
                </FlexContainer>
                <CommentInput placeholder='내용을 입력해 주세요.' />
                <CommentButton onClick={handleCommentSubmit}>
                  등록
                </CommentButton>
                <CommentList>
                  {selectedItem.comments.map((comment) => (
                    <CommentItem key={comment.id}>
                      <CommentAvatar>
                        <UserIcon />
                      </CommentAvatar>
                      <CommentContent>
                        <strong>{comment.author}</strong>
                        <Text>{comment.text}</Text>
                      </CommentContent>
                    </CommentItem>
                  ))}
                </CommentList>
              </CommentSection>
            </ModalBody>
          </ModalContent>
        )}
      </Modal>
    </BoardContainer>
  );
};

const HrLine = styled.hr`
  border: none;
  border-top: 0.5px solid #ddd;
  padding-bottom: 1.25rem;
  margin: 0;
`;

const BoardContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 1.25rem;
  box-sizing: border-box;
`;

const BoardTagsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
`;

const BoardTags = styled.div`
  display: flex;
  justify-content: flex-start;

  & > *:not(:first-child) {
    margin-left: 1rem;
  }
`;

const Button = styled.button`
  background-color: ${(props) => (props.isActive ? '#543D20' : 'white')};
  color: ${(props) => (props.isActive ? 'white' : '#8a5a2b')};
  border: 0.063rem solid #8a5a2b;
  padding: 0.5rem 1rem;
  border-radius: 1.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  margin-right: 0.325rem;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const BoardContent = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.25rem;

  @media (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const BoardItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0.625rem;
  border-radius: 0.625rem;
  background: white;
  color: #543d20;
  cursor: pointer;

  &.placeholder {
    border: 0.063rem dashed #ddd;
  }
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  max-width: 20em;
  max-height: 20rem;
  object-fit: cover;
  border-radius: 0.625rem;
  margin-bottom: 0.625rem;
`;

const Text = styled.p`
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.25rem;
`;

const PaginationButton = styled.button`
  background-color: ${(props) => (props.isActive ? '#543D20' : 'white')};
  color: ${(props) => (props.isActive ? 'white' : '#8a5a2b')};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 1.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  margin: 0 0.325rem;
`;

const ModalContent = styled.div`
  background: white;
  padding: 1.25rem;
  width: 94%;
  max-width: 60rem;
  height: auto;
  max-height: 80vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0;
`;

const ModalDate = styled.div`
  font-size: 0.875rem;
  color: #888;
  margin-left: 0.65rem;
`;

const ModalAuthor = styled.div`
  font-size: 0.875rem;
  color: #191619;
  margin-left: auto;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  position: absolute;
  top: 0.25rem;
  right: 0rem;
  padding-bottom: 2rem;
`;

const ModalBody = styled.div`
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
`;

const CommentSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
`;

const CommentInput = styled.input.attrs({ type: 'text' })`
  width: 100%;
  padding: 0.625rem;
  margin-bottom: 0.625rem;
  border-radius: 0.325rem;
  border: 0.5px solid #ddd;
  box-sizing: border-box;
  height: 5rem;
`;

const CommentButton = styled(Button)`
  margin-left: auto;
  display: block;
  background-color: #543d20;
  color: white;
`;

const CommentList = styled.div`
  margin-top: 1.25rem;
`;

const CommentItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.625rem;
`;

const CommentAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  margin-right: 0.625rem;

  svg {
    width: 80%;
    height: 80%;
  }
`;

const CommentContent = styled.div`
  flex: 1;
`;

const TitleInput = styled.input.attrs({ type: 'text' })`
  width: 100%;
  padding: 0.625rem;
  margin-bottom: 0.625rem;
  border-radius: 0.325rem;
  border: none;
  box-sizing: border-box;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const ContentTextArea = styled.textarea`
  width: 100%;
  padding: 0.625rem;
  margin-bottom: 0.625rem;
  border-radius: 0.325rem;
  border: 0.5px solid #ddd;
  box-sizing: border-box;
  height: 20rem;
  resize: none;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.625rem;
  margin-top: 1.25rem;
  height: 1.5rem;
`;

const TextButton = styled.span`
  color: gray;
  cursor: pointer;
  font-size: 0.875rem;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const customModalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '94%',
    maxWidth: '60rem',
    height: 'auto',
    maxHeight: '80vh',
    overflowY: 'auto',
    borderRadius: '1rem',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
  }
};

export default Board;
