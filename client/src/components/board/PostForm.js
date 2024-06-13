import React from 'react';
import styled from 'styled-components';
import { ReactComponent as PicAddIcon } from '../../assets/icons/picaddbutton.svg';

const PostForm = ({
  title,
  content,
  tag,
  onTitleChange,
  onContentChange,
  onTagChange,
  onSubmit,
  fileInputRef,
  onFileInputClick,
  onFileChange,
  selectedFile
}) => {
  return (
    <ModalContent>
      <ModalHeader></ModalHeader>
      <ModalBody>
        <CommentSection>
          <TitleInput
            placeholder='제목을 입력해 주세요.'
            value={title}
            onChange={onTitleChange}
          />
          <HrLine />
          <BoardTagsContainer>
            <BoardTags>
              <Button
                isActive={tag === '잡담'}
                onClick={() => onTagChange('잡담')}
              >
                잡담
              </Button>
              <Button
                isActive={tag === '추천 장소'}
                onClick={() => onTagChange('추천 장소')}
              >
                추천 장소
              </Button>
              <Button
                isActive={tag === '같이 해요'}
                onClick={() => onTagChange('같이 해요')}
              >
                같이 해요
              </Button>
            </BoardTags>
            <PicAddIcon onClick={onFileInputClick} />
            <FileInput
              id='fileInput'
              ref={fileInputRef}
              onChange={onFileChange}
            />
            {selectedFile ? selectedFile.name : <></>}
          </BoardTagsContainer>
          <ContentTextArea
            placeholder='내용을 입력해 주세요.'
            value={content}
            onChange={onContentChange}
          />
          <CommentButton onClick={onSubmit}>등록</CommentButton>
        </CommentSection>
      </ModalBody>
    </ModalContent>
  );
};

const HrLine = styled.hr`
  border: none;
  border-top: 0.5px solid #ddd;
  padding-bottom: 1.25rem;
  margin: 0;
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

const CommentButton = styled(Button)`
  margin-left: auto;
  display: block;
  background-color: #543d20;
  color: white;
`;

const FileInput = styled.input.attrs({ type: 'file' })`
  display: none;
`;

export default PostForm;
