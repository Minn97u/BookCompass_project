import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useForm, FormProvider } from 'react-hook-form';
import CustomModal from '../components/board/Modal';
import PostForm from '../components/board/PostForm';
import { ReactComponent as WriteIcon } from '../assets/icons/writebutton.svg';
import Pagination from '../components/board/Pagination';
import TagButtons from '../components/board/TagButtons';
import PostList from '../components/board/PostList';
import ModalContent from '../components/board/ModalContent';
import DeleteConfirmModal from '../components/board/DeleteConfirmModal';
import {
  getPosts,
  viewPosts,
  postPosts,
  updatePosts,
  deletePosts,
  postComments,
  deleteComments,
  updateComments
} from '../api/BoardApi';

const Board = () => {
  const [state, setState] = useState({
    activeTag: '전체',
    modalIsOpen: false,
    selectedItem: null,
    currentPage: 1,
    isEditing: false,
    totalPages: 0,
    posts: [],
    deleteConfirmModalIsOpen: false,
    commentToDelete: null
  });
  const tags = ['전체', '같이 해요', '추천 장소'];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    activeTag,
    modalIsOpen,
    selectedItem,
    currentPage,
    isEditing,
    totalPages,
    posts,
    deleteConfirmModalIsOpen,
    commentToDelete
  } = state;

  const [userName, setUserName] = useState(localStorage.getItem('userName'));
  const methods = useForm({
    defaultValues: {
      title: '',
      content: '',
      tag: '잡담',
      commentText: '',
      selectedFile: null,
      commentToDelete: null
    }
  });

  const itemsPerPage = 10;
  const fetchItems = async (page = currentPage, tag = activeTag) => {
    try {
      const res = await getPosts(page, itemsPerPage, tag === '전체' ? '' : tag);
      setState((prevState) => ({
        ...prevState,
        currentPage: res.currentPage,
        totalPages: res.totalPages,
        posts: res.posts
      }));
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [currentPage, activeTag]);

  const handleTagClick = (tag) => {
    setState((prevState) => ({
      ...prevState,
      activeTag: tag,
      currentPage: 1
    }));
  };

  const openModal = async (item) => {
    try {
      const res = await viewPosts(item.shortId);
      setState((prevState) => ({
        ...prevState,
        selectedItem: res,
        modalIsOpen: true,
        isEditing: false
      }));
    } catch (error) {
      console.error('Error opening modal:', error);
    }
  };

  const closeModal = () => {
    setState((prevState) => ({
      ...prevState,
      modalIsOpen: false,
      selectedItem: null,
      isEditing: false
    }));
    methods.reset();
  };

  const handleWriteIconClick = () => {
    if (userName === null) {
      alert('로그인을 해주세요');
      return;
    }
    setState((prevState) => ({
      ...prevState,
      selectedItem: null,
      modalIsOpen: true
    }));
    methods.reset({ title: '', content: '', tag: '잡담', selectedFile: null });
  };

  const handlePicAddIconClick = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      methods.setValue('selectedFile', file);
    }
  };

  const fileInputRef = useRef(null);

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePageChange = (pageNumber) => {
    setState((prevState) => ({
      ...prevState,
      currentPage: pageNumber
    }));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('tag', data.tag);
      if (data.selectedFile) {
        formData.append('postImg', data.selectedFile);
      }
      const response = isEditing
        ? await updatePosts(formData, selectedItem.shortId)
        : await postPosts(formData);
      await fetchItems();
      closeModal();
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = () => {
    methods.setValue('title', selectedItem.title);
    methods.setValue('content', selectedItem.content);
    methods.setValue('tag', selectedItem.tag);
    setState((prevState) => ({
      ...prevState,
      isEditing: true,
      modalIsOpen: true
    }));
  };

  const handleDeleteClick = () => {
    setState((prevState) => ({
      ...prevState,
      deleteConfirmModalIsOpen: true
    }));
  };

  const confirmDelete = async () => {
    if (selectedItem) {
      try {
        await deletePosts(selectedItem.shortId);
        await fetchItems();
        closeModal();
      } catch (error) {
        console.error('삭제 오류', error);
      } finally {
        setState((prevState) => ({
          ...prevState,
          deleteConfirmModalIsOpen: false
        }));
      }
    }
  };

  const handleCommentSubmit = async (data) => {
    if (selectedItem) {
      try {
        const commentData = { content: data.commentText };
        await postComments(commentData, selectedItem.shortId);
        const res = await viewPosts(selectedItem.shortId);
        setState((prevState) => ({
          ...prevState,
          selectedItem: res
        }));
        methods.setValue('commentText', '');
        methods.reset({ commentText: '' });
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    }
  };

  const handleCommentDeleteClick = (commentId) => {
    setState((prevState) => ({
      ...prevState,
      deleteConfirmModalIsOpen: true,
      commentToDelete: commentId
    }));
  };

  const confirmCommentDelete = async () => {
    if (selectedItem && commentToDelete) {
      try {
        await deleteComments(selectedItem.shortId, commentToDelete);
        const updatedComments = selectedItem.comments.filter(
          (comment) => comment._id !== commentToDelete
        );
        setState((prevState) => ({
          ...prevState,
          selectedItem: {
            ...prevState.selectedItem,
            comments: updatedComments
          },
          deleteConfirmModalIsOpen: false,
          commentToDelete: null
        }));
      } catch (error) {
        console.error('댓글 삭제 오류', error);
      }
    } else {
      console.error('올바르지 않은 commentId 또는 선택된 게시글이 없습니다.');
    }
  };

  const cancelDelete = () => {
    setState((prevState) => ({
      ...prevState,
      deleteConfirmModalIsOpen: false,
      commentToDelete: null
    }));
  };

  const handleCommentUpdate = async (commentId, updatedContent) => {
    if (selectedItem && commentId) {
      try {
        const updatedComment = { content: updatedContent };
        await updateComments(selectedItem.shortId, commentId, updatedComment);
        const updatedComments = selectedItem.comments.map((comment) =>
          comment._id === commentId
            ? { ...comment, content: updatedContent }
            : comment
        );
        setState((prevState) => ({
          ...prevState,
          selectedItem: { ...prevState.selectedItem, comments: updatedComments }
        }));
      } catch (error) {
        console.error('댓글 수정 오류', error);
      }
    } else {
      console.error('올바르지 않은 commentId 또는 선택된 게시글이 없습니다.');
    }
  };

  return (
    <FormProvider {...methods}>
      <BoardContainer>
        <BoardTagsContainer>
          <TagButtons
            activeTag={activeTag}
            handleTagClick={handleTagClick}
            tags={tags}
          />
          <WriteIcon onClick={handleWriteIconClick} />
        </BoardTagsContainer>
        <PostList posts={posts} openModal={openModal} />
        <PaginationContainer>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </PaginationContainer>
        <CustomModal isOpen={modalIsOpen} onRequestClose={closeModal}>
          {selectedItem === null ? (
            <PostForm
              control={methods.control}
              onSubmit={methods.handleSubmit(onSubmit)}
              setValue={methods.setValue}
              fileInputRef={fileInputRef}
              onFileInputClick={handleFileInputClick}
              onFileChange={handlePicAddIconClick}
            />
          ) : isEditing ? (
            <PostForm
              control={methods.control}
              setValue={methods.setValue}
              onSubmit={methods.handleSubmit(onSubmit)}
              fileInputRef={fileInputRef}
              onFileInputClick={handleFileInputClick}
              onFileChange={handlePicAddIconClick}
            />
          ) : (
            <ModalContent
              selectedItem={selectedItem}
              userName={userName}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              handleCommentSubmit={handleCommentSubmit}
              handleCommentDelete={handleCommentDeleteClick}
              handleCommentUpdate={handleCommentUpdate}
            />
          )}
        </CustomModal>
        <DeleteConfirmModal
          isOpen={deleteConfirmModalIsOpen}
          onRequestClose={cancelDelete}
          onConfirm={commentToDelete ? confirmCommentDelete : confirmDelete}
          isSubmitting={isSubmitting}
        />
      </BoardContainer>
    </FormProvider>
  );
};

const BoardContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 1.2rem 4rem 1.2rem 4rem;
  box-sizing: border-box;
`;

const BoardTagsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0px 35px 0px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.3rem;
`;

export default Board;
