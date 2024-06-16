import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DetailPageContent from '../components/board/DetailPageContent';

import {
  viewPosts,
  deletePosts,
  postComments,
  deleteComments,
  updateComments
} from '../api/BoardApi';
import { useParams } from 'react-router-dom';

const PostDetails = () => {
  const { shortId } = useParams();
  const [selectedItem, setSelectedItem] = useState(null);
  const [userName, setUserName] = useState(localStorage.getItem('userName'));

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const res = await viewPosts(shortId);
        setSelectedItem(res);
      } catch (error) {
        console.error('게시물 상세 정보 가져오기 오류:', error);
      }
    };

    fetchPostDetails();
  }, [shortId]);

  const handleDeleteClick = async () => {
    if (selectedItem) {
      try {
        const response = await deletePosts(selectedItem.shortId);
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

  return (
    <PostDetailsContainer>
      {selectedItem ? (
        <DetailPageContent
          selectedItem={selectedItem}
          userName={userName}
          handleDeleteClick={handleDeleteClick}
          handleCommentSubmit={handleCommentSubmit}
          handleCommentDelete={handleCommentDelete}
          handleCommentUpdate={handleCommentUpdate}
        />
      ) : (
        <p>Loading...</p> // 로딩 상태 표시
      )}
    </PostDetailsContainer>
  );
};

const PostDetailsContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 1.25rem;
  box-sizing: border-box;
`;

export default PostDetails;
