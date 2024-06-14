import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MypageBox from '../components/mypage/MypageBox';
import AuthModal from '../components/auth/AuthModal';
import WriteList from '../components/mypage/WriteList';
import BookMarkList from '../components/mypage/BookMarkList';
import ReviewList from '../components/mypage/ReviewList';
import SettingIcon from '../assets/icons/SettingIcon.svg';
import WriteListIcon from '../assets/icons/WriteListIcon.svg';
import CommentIcon from '../assets/icons/CommentIcon.svg';
import BookMark from '../assets/icons/BookMark.svg';
import ReviewIcon from '../assets/icons/ReviewIcon.svg';
import MapIcon from '../assets/icons/MapIcon.svg';
import { getProfileInfo, getMyPosts, getMyComments } from '../api/Mypage';

const Mypage = () => {
  const [myInfo, setMyInfo] = useState({
    profileImg: '',
    name: '',
    email: '',
    description: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [postDatas, setPostDatas] = useState([]);
  const [commentDatas, setCommentDatas] = useState([]);
  const navigate = useNavigate();

  const bookMarkList = [
    { name: '성동구립성수도서관', location: '성수문화복지회관 7층' },
    { name: '성동구립성수도서관', location: '성수문화복지회관 7층' },
    { name: '성동구립성수도서관', location: '성수문화복지회관 7층' }
  ];

  const handleSettingClick = () => {
    navigate('/mypage/edit');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const fetchProfileInfo = async () => {
    try {
      const res = await getProfileInfo();
      const { profilePic, name, email, profileMsg } = res.data;

      setMyInfo({
        profileImg: profilePic,
        name,
        email,
        description: profileMsg
      });
    } catch (error) {
      console.error('프로필 가져오기 실패:', error);
    }
  };

  const fetchMyPosts = async () => {
    try {
      const res = await getMyPosts();
      const datas = res.data.map((item) => {
        const createAt = new Date(item.createdAt);
        const localDate = createAt.toLocaleString();

        return {
          id: item.shortId,
          title: item.title,
          date: localDate
        };
      });
      setPostDatas(datas);
      console.log('내가 쓴 글', datas);
    } catch (error) {
      console.error('내가 쓴 글 실패:', error);
    }
  };

  const fetchMyComments = async () => {
    try {
      const res = await getMyComments();
      const datas = res.data.map((item) => {
        const createAt = new Date(item.createdAt);
        const localDate = createAt.toLocaleString();

        return {
          id: item._id,
          title: item.content,
          date: localDate
        };
      });
      setCommentDatas(datas);
      console.log('내가 쓴 댓글', datas);
    } catch (error) {
      console.error('내가 쓴 댓글 실패:', error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchProfileInfo(),
          fetchMyPosts(),
          fetchMyComments()
        ]);
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
    };

    fetchAllData();
  }, []);

  return (
    <Container>
      <ProfileConatiner>
        <ProfileImg src={myInfo.profileImg} alt='profile'></ProfileImg>
        <UserName>{myInfo.name}</UserName>
        <UserEmail>{myInfo.email}</UserEmail>
        <UserDescription>{myInfo.description}</UserDescription>
        <SettingBtn
          src={SettingIcon}
          alt='setting'
          onClick={handleSettingClick}
        ></SettingBtn>
      </ProfileConatiner>
      <MypageContainer>
        <MypageBox
          icon={WriteListIcon}
          title='내가 쓴 글'
          component={
            <WriteList datas={postDatas} type={'post'} setList={setPostDatas} />
          }
        />
        <MypageBox
          icon={CommentIcon}
          title='내가 쓴 댓글'
          component={
            <WriteList
              datas={commentDatas}
              type={'comment'}
              setList={setCommentDatas}
            />
          }
        />
        <MypageBox
          icon={BookMark}
          title='즐겨찾기 장소'
          component={<BookMarkList datas={bookMarkList} />}
          mapIcon={MapIcon}
        />
        <MypageBox
          icon={ReviewIcon}
          title='작성한 리뷰'
          component={<ReviewList />}
        />
      </MypageContainer>
      {showModal && <AuthModal onClose={handleCloseModal} />}
    </Container>
  );
};

export default Mypage;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: calc(100vh - 60px);
`;

const ProfileConatiner = styled.div`
  flex: display;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #eed8bc;
  min-width: 21.5rem;
  position: relative;
`;

const ProfileImg = styled.img`
  width: 8.8rem;
  margin: 75px 0px 5px 0px;
  border-radius: 50%;
`;

const UserName = styled.p`
  font-size: 1.4rem;
  font-weight: 600;
  color: #191619;
`;

const UserEmail = styled.p`
  font-size: 1rem;
  color: #787878;
  margin-top: -15px;
`;

const UserDescription = styled.p`
  font-size: 1.1rem;
  color: #191619;
  margin-top: 35px;
`;

const SettingBtn = styled.img`
  width: 3rem;
  padding: 5px 10px 5px 10px;
  border: none;
  position: absolute;
  bottom: 50px;
  left: 20px;
  cursor: pointer;
`;

const MypageContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 50px;
  align-items: center;
  margin: auto;
`;
