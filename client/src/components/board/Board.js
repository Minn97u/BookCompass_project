import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { ReactComponent as UserIcon } from '../../assets/icons/usericon.svg';
import { ReactComponent as CloseIcon } from '../../assets/icons/closebutton.svg';
import { ReactComponent as WriteIcon } from '../../assets/icons/writebutton.svg';
import { ReactComponent as PicAddIcon } from '../../assets/icons/picaddbutton.svg';
import { ReactComponent as ArrowLeft } from '../../assets/icons/arrowleft.svg';
import { ReactComponent as ArrowRight } from '../../assets/icons/arrowright.svg';
import { ReactComponent as DoubleArrowLeft } from '../../assets/icons/doublearrowleft.svg';
import { ReactComponent as DoubleArrowRight } from '../../assets/icons/doublearrowright.svg';
import {
  getPosts,
  viewPosts,
  postPosts,
  updatePosts,
  deletePosts,
  postComments,
  deleteComments
} from '../../api/BoardApi.js';

const Board = () => {
  const [activeTag, setActiveTag] = useState('전체');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newPostTag, setNewPostTag] = useState('잡담');
  const [commentText, setCommentText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [posts, setPosts] = useState([]);

  // eslint-disable-next-line
  const [userName, setUserName] = useState(localStorage.getItem('userName'));

  // const pagesToShow = 5;
  const itemsPerPage = 10;
  const fetchItems = async (page = currentPage, tag = activeTag) => {
    try {
      const res = await getPosts(page, itemsPerPage, tag === '전체' ? '' : tag);
      setCurrentPage(res.currentPage);
      setTotalPages(res.totalPages);
      setPosts(res.posts);
      console.log('게시글', posts);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [currentPage, activeTag]);

  const handleTagClick = (tag) => {
    setActiveTag(tag);
    setCurrentPage(1);
  };

  const openModal = async (item) => {
    try {
      const res = await viewPosts(item.shortId);
      setSelectedItem(res);
      setModalIsOpen(true);
      setIsEditing(false);
    } catch (error) {
      console.error('Error opening modal:', error);
    }
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
    setNewPostTag('잡담');
    setModalIsOpen(true);
  };

  const handlePicAddIconClick = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
    }
  };

  const handlePageClick = async (pageNumber) => {
    try {
      const response = await getPosts(
        pageNumber,
        itemsPerPage,
        activeTag === '전체' ? '' : activeTag
      );
      setCurrentPage(pageNumber);
      setTotalPages(response.totalPages);
      setPosts(response.posts);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
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

  const fileInputRef = useRef(null);

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePostSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', newTitle);
      formData.append('content', newContent);
      formData.append('tag', newPostTag);
      if (selectedFile) {
        formData.append('postImg', selectedFile);
      }
      const response = await postPosts(formData);
      console.log('Post submitted successfully:', response.data);
      await fetchItems();
      setSelectedFile(null);
      closeModal();
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  const handleEditClick = () => {
    console.log('edit clicked');
    setNewTitle(selectedItem.title);
    setNewContent(selectedItem.content);
    setNewPostTag(selectedItem.tag);
    setIsEditing(true);
    setModalIsOpen(true);
    console.log('edit clicked2');
    console.log(isEditing);
  };

  const handleEditSubmit = async () => {
    if (selectedItem) {
      try {
        const formData = new FormData();
        formData.append('title', newTitle);
        formData.append('content', newContent);
        formData.append('tag', newPostTag);
        if (selectedFile) {
          formData.append('postImg', selectedFile);
        }
        const response = await updatePosts(formData, selectedItem.shortId);
        console.log('Post edited successfully:', response.data);
        await fetchItems();
        setSelectedFile(null);
        closeModal();
      } catch (error) {
        console.error('Error editing post:', error);
      }
    }
  };

  const handleDeleteClick = async () => {
    if (selectedItem) {
      try {
        const response = await deletePosts(selectedItem.shortId);
        console.log('삭제 완료', response.data);
        await fetchItems();
        closeModal();
      } catch (error) {
        console.error('삭제 오류', error);
      }
    }
  };

  const handleCommentSubmit = async () => {
    if (selectedItem) {
      const newComment = {
        content: commentText,
        author: { name: userName } // 현재 사용자 이름을 사용, 실제 구현에 따라 다를 수 있음
      };

      // 먼저 클라이언트 상태에 댓글 추가
      const updatedComments = [...selectedItem.comments, newComment];
      setSelectedItem({ ...selectedItem, comments: updatedComments });
      setCommentText('');

      try {
        // 서버에 댓글 데이터 전송
        const data = { content: commentText };
        await postComments(data, selectedItem.shortId);
        console.log('Comment submitted successfully');
      } catch (error) {
        console.error('Error submitting comment:', error);
        setSelectedItem({ ...selectedItem, comments: selectedItem.comments });
      }
    }
  };

  const handleCommentInputChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleCommentDelete = async (commentId) => {
    if (selectedItem) {
      try {
        await deleteComments(selectedItem.shortId, commentId);
        const updatedComments = selectedItem.comments.filter(
          (comment) => comment._id !== commentId
        );
        setSelectedItem({ ...selectedItem, comments: updatedComments });
        console.log('댓글 삭제 완료');
      } catch (error) {
        console.error('댓글 삭제 오류', error);
      }
    }
  };

  // const totalPages = Math.ceil(items.length / itemsPerPage);
  // const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
  // const endPage = Math.min(totalPages, startPage + pagesToShow - 1);

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
        {posts.map((item) => (
          <BoardItem key={item.shortId} onClick={() => openModal(item)}>
            <ImageContainer>
              <Image
                src={
                  item.postImg
                    ? `uploads/${item.postImg.split('uploads\\')[1]}`
                    : './No_image_available.png'
                }
                alt={item.title}
              />
            </ImageContainer>
            <Text>{item.title}</Text>
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
        {Array.from({ length: totalPages }, (_, index) => (
          <PaginationButton
            key={index + 1}
            isActive={currentPage === index + 1}
            onClick={() => handlePageClick(index + 1)}
          >
            {index + 1}
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
                      isActive={newPostTag === '잡담'}
                      onClick={() => setNewPostTag('잡담')}
                    >
                      잡담
                    </Button>
                    <Button
                      isActive={newPostTag === '추천 장소'}
                      onClick={() => setNewPostTag('추천 장소')}
                    >
                      추천 장소
                    </Button>
                    <Button
                      isActive={newPostTag === '같이 해요'}
                      onClick={() => setNewPostTag('같이 해요')}
                    >
                      같이 해요
                    </Button>
                  </BoardTags>
                  <PicAddIcon onClick={handleFileInputClick} />
                  <FileInput
                    id='fileInput'
                    ref={fileInputRef}
                    onChange={handlePicAddIconClick}
                  />
                  {selectedFile ? selectedFile.name : <></>}
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
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <HrLine />
                <BoardTagsContainer>
                  <BoardTags>
                    <Button
                      isActive={newPostTag === '잡담'}
                      onClick={() => setNewPostTag('잡담')}
                    >
                      잡담
                    </Button>
                    <Button
                      isActive={newPostTag === '추천 장소'}
                      onClick={() => setNewPostTag('추천 장소')}
                    >
                      추천 장소
                    </Button>
                    <Button
                      isActive={newPostTag === '같이 해요'}
                      onClick={() => setNewPostTag('같이 해요')}
                    >
                      같이 해요
                    </Button>
                  </BoardTags>
                  <PicAddIcon onClick={handleFileInputClick} />
                  <FileInput
                    id='fileInput'
                    ref={fileInputRef}
                    onChange={handlePicAddIconClick}
                  />
                  {selectedFile ? selectedFile.name : <></>}
                </BoardTagsContainer>
                <ContentTextArea
                  placeholder='내용을 입력해 주세요.'
                  value={newContent}
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
              <ModalTitle>{selectedItem.title}</ModalTitle>
              <ModalDate>
                {new Date(selectedItem.createdAt).toLocaleString()}
              </ModalDate>
              {userName === selectedItem.author.name && (
                <ActionButtons>
                  <TextButton onClick={handleEditClick}>수정</TextButton>
                  <TextButton onClick={handleDeleteClick}>삭제</TextButton>
                </ActionButtons>
              )}
              <ModalAuthor>{selectedItem.author.name}</ModalAuthor>
            </ModalHeader>
            <HrLine />
            <ModalBody>
              <div>
                <PostImage
                  src={
                    selectedItem.postImg
                      ? `uploads/${selectedItem.postImg.split('uploads\\')[1]}`
                      : './No_image_available.png'
                  }
                  alt={selectedItem.title}
                />
                <Text>{selectedItem.content}</Text>
              </div>
              <CommentSection>
                <FlexContainer>
                  <h3>댓글</h3>
                </FlexContainer>
                <CommentInput
                  placeholder='내용을 입력해 주세요.'
                  value={commentText}
                  onChange={handleCommentInputChange}
                />
                <CommentButton
                  onClick={() => handleCommentSubmit(selectedItem.shortId)}
                >
                  등록
                </CommentButton>
                <CommentList>
                  {selectedItem.comments.map((comment) => (
                    <CommentItem key={comment.shortId}>
                      <CommentAvatar>
                        <UserIcon />
                      </CommentAvatar>
                      <CommentContent>
                        <strong>{comment.author.name}</strong>
                        <p>{comment.content}</p>
                        {userName === comment.author.name && (
                          <TextButton
                            onClick={() => handleCommentDelete(comment._id)}
                          >
                            삭제
                          </TextButton>
                        )}
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.25rem;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(5, 1fr);
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
  box-sizing: border-box;
  &.placeholder {
    border: 0.063rem dashed #ddd;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  padding-top: 75%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 0.625rem;
  margin-bottom: 0.625rem;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  cursor: pointer;
`;

const PostImage = styled.img`
  width: 100%;
  max-width: 20rem;
  height: auto;
  object-fit: contain;
  cursor: pointer;
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
  height: 1.5rem;
  margin-top: 0.5rem;
  margin-left: 1.25rem;
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

const FileInput = styled.input.attrs({ type: 'file' })`
  display: none;
`;

export default Board;
