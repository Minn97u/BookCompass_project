import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import CustomModal from './Modal';
import PostForm from './PostForm';
import { ReactComponent as WriteIcon } from '../../assets/icons/writebutton.svg';
import Pagination from './Pagination';
import TagButtons from './TagButtons';
import PostList from './PostList';
import ModalContent from './ModalContent';

import {
  getPosts,
  viewPosts,
  postPosts,
  updatePosts,
  deletePosts,
  postComments,
  deleteComments,
  updateComments
} from '../../api/BoardApi.js';

const Board = () => {
  const [state, setState] = useState({
    activeTag: '전체',
    modalIsOpen: false,
    selectedItem: null,
    currentPage: 1,
    isEditing: false,
    totalPages: 0,
    posts: []
  });

  const {
    activeTag,
    modalIsOpen,
    selectedItem,
    currentPage,
    isEditing,
    totalPages,
    posts
  } = state;

  // eslint-disable-next-line
  const [userName, setUserName] = useState(localStorage.getItem('userName'));
  const { handleSubmit, setValue, reset, watch } = useForm({
    defaultValues: {
      title: '',
      content: '',
      tag: '잡담',
      commentText: '',
      selectedFile: null
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
      console.log('게시글', res.posts);
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
    reset();
  };

  const handleWriteIconClick = () => {
    setState((prevState) => ({
      ...prevState,
      selectedItem: null,
      modalIsOpen: true
    }));
    reset({ title: '', content: '', tag: '잡담', selectedFile: null });
  };

  const handlePicAddIconClick = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setValue('selectedFile', file);
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
      console.log('Post submitted successfully:', response.data);
      await fetchItems();
      closeModal();
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  const handleEditClick = () => {
    setValue('title', selectedItem.title);
    setValue('content', selectedItem.content);
    setValue('tag', selectedItem.tag);
    setState((prevState) => ({
      ...prevState,
      isEditing: true,
      modalIsOpen: true
    }));
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

  const handleCommentSubmit = async (data) => {
    if (selectedItem) {
      // eslint-disable-next-line
      const newComment = {
        content: data.commentText,
        author: { name: userName }
      };

      try {
        const commentData = { content: data.commentText };
        await postComments(commentData, selectedItem.shortId);
        console.log('Comment submitted successfully');

        const res = await viewPosts(selectedItem.shortId);
        setState((prevState) => ({
          ...prevState,
          selectedItem: res
        }));

        setValue('commentText', '');
        reset({ commentText: '' });
        console.log('hihi', data.commentText);
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (selectedItem && commentId) {
      try {
        await deleteComments(selectedItem.shortId, commentId);
        const updatedComments = selectedItem.comments.filter(
          (comment) => comment._id !== commentId
        );
        setState((prevState) => ({
          ...prevState,
          selectedItem: { ...prevState.selectedItem, comments: updatedComments }
        }));
        console.log('댓글 삭제 완료');
      } catch (error) {
        console.error('댓글 삭제 오류', error);
      }
    } else {
      console.error('올바르지 않은 commentId 또는 선택된 게시글이 없습니다.');
    }
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
        console.log('댓글 수정 완료');
      } catch (error) {
        console.error('댓글 수정 오류', error);
      }
    } else {
      console.error('올바르지 않은 commentId 또는 선택된 게시글이 없습니다.');
    }
  };

  return (
    <BoardContainer>
      <BoardTagsContainer>
        <TagButtons activeTag={activeTag} handleTagClick={handleTagClick} />
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
            title={watch('title')}
            content={watch('content')}
            tag={watch('tag')}
            onTitleChange={(e) => setValue('title', e.target.value)}
            onContentChange={(e) => setValue('content', e.target.value)}
            onTagChange={(tag) => setValue('tag', tag)}
            onSubmit={handleSubmit(onSubmit)}
            fileInputRef={fileInputRef}
            onFileInputClick={handleFileInputClick}
            onFileChange={handlePicAddIconClick}
            selectedFile={watch('selectedFile')}
          />
        ) : isEditing ? (
          <PostForm
            title={watch('title')}
            content={watch('content')}
            tag={watch('tag')}
            onTitleChange={(e) => setValue('title', e.target.value)}
            onContentChange={(e) => setValue('content', e.target.value)}
            onTagChange={(tag) => setValue('tag', tag)}
            onSubmit={handleSubmit(onSubmit)}
            fileInputRef={fileInputRef}
            onFileInputClick={handleFileInputClick}
            onFileChange={handlePicAddIconClick}
            selectedFile={watch('selectedFile')}
          />
        ) : (
          <ModalContent
            selectedItem={selectedItem}
            userName={userName}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
            handleCommentSubmit={handleCommentSubmit}
            handleCommentDelete={handleCommentDelete}
            handleCommentUpdate={handleCommentUpdate}
          />
        )}
      </CustomModal>
    </BoardContainer>
  );
};

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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.25rem;
`;

export default Board;
