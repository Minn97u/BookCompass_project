import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import DetailPageContent from '../components/board/DetailPageContent';
import PostForm from '../components/board/PostForm';

import {
  viewPosts,
  updatePosts,
  deletePosts,
  postComments,
  deleteComments,
  updateComments
} from '../api/BoardApi';

const PostDetails = () => {
  const { shortId } = useParams();
  const [state, setState] = useState({
    activeTag: '전체',
    isEditing: false
  });

  const { isEditing } = state;
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const res = await viewPosts(shortId);
        setSelectedItem(res);
      } catch (error) {
        console.error('게시물 상세 정보 가져오기 오류:', error);
        setIsDeleted(true); // 데이터가 null인 경우 삭제된 페이지로 설정
      }
    };

    fetchPostDetails();
  }, [shortId]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('tag', data.tag);
      if (data.selectedFile) {
        formData.append('postImg', data.selectedFile);
      }

      const res = await updatePosts(formData, selectedItem.shortId);
      window.location.href = `/board/${shortId}`;

      console.log('Post submitted successfully:', res.data);
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
        navigate('/mypage');
        console.log('삭제 완료', response.data);
        // 선택한 게시물 삭제 후 보드 페이지로 돌아가거나 상태 업데이트 처리
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

      try {
        const commentData = { content: data.commentText };
        await postComments(commentData, selectedItem.shortId);
        console.log('Comment submitted successfully');

        // 댓글 제출 후 게시물 상세 정보 다시 가져오기
        const res = await viewPosts(selectedItem.shortId);
        setSelectedItem(res);
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
        setSelectedItem((prevItem) => ({
          ...prevItem,
          comments: updatedComments
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
        setSelectedItem((prevItem) => ({
          ...prevItem,
          comments: updatedComments
        }));
        console.log('댓글 수정 완료');
      } catch (error) {
        console.error('댓글 수정 오류', error);
      }
    } else {
      console.error('올바르지 않은 commentId 또는 선택된 게시글이 없습니다.');
    }
  };

  const fileInputRef = useRef(null);

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePicAddIconClick = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setValue('selectedFile', file);
    }
  };

  return (
    <PostDetailsContainer>
      {selectedItem === null ? (
        isDeleted ? (
          <p>삭제된 페이지입니다.</p> // 삭제된 페이지 표시
        ) : (
          <p>Loading...</p> // 로딩 상태 표시
        )
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
        <DetailPageContent
          selectedItem={selectedItem}
          userName={userName}
          handleDeleteClick={handleDeleteClick}
          handleCommentSubmit={handleCommentSubmit}
          handleCommentDelete={handleCommentDelete}
          handleCommentUpdate={handleCommentUpdate}
          handleEditClick={handleEditClick}
        />
      )}
    </PostDetailsContainer>
  );
};

const PostDetailsContainer = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  padding: 30px 0px 180px 0px;
`;

export default PostDetails;
