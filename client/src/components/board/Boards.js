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
  deleteComments
} from '../../api/BoardApi.js';

const Board = () => {
  const [activeTag, setActiveTag] = useState('전체');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [posts, setPosts] = useState([]);

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
      setCurrentPage(res.currentPage);
      setTotalPages(res.totalPages);
      setPosts(res.posts);
      console.log('게시글', res.posts);
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
    reset();
  };

  const handleWriteIconClick = () => {
    setSelectedItem(null);
    reset({ title: '', content: '', tag: '잡담', selectedFile: null });
    setModalIsOpen(true);
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
    setCurrentPage(pageNumber);
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
    setIsEditing(true);
    setModalIsOpen(true);
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
      const newComment = {
        content: data.commentText,
        author: { name: userName }
      };

      const updatedComments = [...selectedItem.comments, newComment];
      setSelectedItem({ ...selectedItem, comments: updatedComments });
      setValue('commentText', '');

      try {
        const commentData = { content: data.commentText };
        await postComments(commentData, selectedItem.shortId);
        console.log('Comment submitted successfully');
      } catch (error) {
        console.error('Error submitting comment:', error);
        setSelectedItem({ ...selectedItem, comments: selectedItem.comments });
      }
    }
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
