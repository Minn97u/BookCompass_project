import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MypageBox from '../components/mypage/MypageBox';
import AuthModal from '../components/auth/AuthModal';
import WriteList from '../components/mypage/WriteList';
import BookMarkList from '../components/mypage/BookMarkList';
import ReviewList from '../components/mypage/ReviewList';
import WriteListIcon from '../assets/icons/WriteListIcon.svg';
import CommentIcon from '../assets/icons/CommentIcon.svg';
import BookMark from '../assets/icons/BookMark.svg';
import ReviewIcon from '../assets/icons/ReviewIcon.svg';
import MapIcon from '../assets/icons/MapIcon.svg';
import DefaultModal from '../components/common/DefaultModal';
import BookMarkMap from '../components/mypage/BookMarkMap';
import {
  getProfileInfo,
  getMyPosts,
  getMyComments,
  getMyFavoriteLibraries,
  getMyFavoriteParksList,
  getMyReviews
} from '../api/Mypage';

const Mypage = () => {
  const [myInfo, setMyInfo] = useState({
    profileImg: '',
    name: '',
    email: '',
    description: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [postDatas, setPostDatas] = useState([]);
  const [commentDatas, setCommentDatas] = useState([]);
  const [favoritePlaces, setFavoritePlaces] = useState([]);
  const [reviewDatas, setReviewDatas] = useState([]);
  const navigate = useNavigate();

  const handleSettingClick = () => {
    navigate('/mypage/edit');
  };

  const handleMapOpen = () => {
    setShowMapModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowMapModal(false);
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
    } catch (error) {
      console.error('내가 쓴 글 실패:', error);
    }
  };

  const fetchMyComments = async () => {
    try {
      const res = await getMyComments();
      const datas = res.data.map((item) => {
        const createAt = new Date(item.date);
        const localDate = createAt.toLocaleString();

        return {
          id: item._id,
          postId: item.postId,
          title: item.content,
          date: localDate
        };
      });
      setCommentDatas(datas);
    } catch (error) {
      console.error('내가 쓴 댓글 실패:', error);
    }
  };

  const fetchMyFavoriteLibraries = async () => {
    try {
      const res = await getMyFavoriteLibraries();
      const libraryDatas = res.data.map((item) => {
        return {
          id: item._id,
          name: item.name,
          address: item.address,
          latitude: item.latitude,
          longitude: item.longitude,
          type: 'library'
        };
      });
      return libraryDatas;
    } catch (error) {
      console.error('즐겨찾기 도서관 실패:', error);
    }
  };

  const fetchMyFavoriteParks = async () => {
    try {
      const res = await getMyFavoriteParksList();
      const parkDatas = res.data.map((item) => {
        return {
          id: item._id,
          name: item.name,
          address: item.address,
          latitude: item.latitude,
          longitude: item.longitude,
          type: 'park'
        };
      });
      return parkDatas;
    } catch (error) {
      console.error('즐겨찾기 공원 실패:', error);
    }
  };

  const fetchMyReviews = async () => {
    try {
      const res = await getMyReviews();
      const datas = res.data.map((item) => {
        const createAt = new Date(item.date);
        const localDate = createAt.toLocaleString();

        return {
          id: item._id,
          comment: item.comment,
          rating: item.rating,
          date: localDate,
          libraryName: item.libraryName,
          parkName: item.parkName
        };
      });
      setReviewDatas(datas);
    } catch (error) {
      console.error('내가 쓴 리뷰 실패:', error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchProfileInfo(),
          fetchMyPosts(),
          fetchMyComments(),
          fetchMyReviews()
        ]);

        const [libraryDatas, parkDatas] = await Promise.all([
          fetchMyFavoriteLibraries(),
          fetchMyFavoriteParks()
        ]);

        const allFavoritePlaces = [...libraryDatas, ...parkDatas];
        setFavoritePlaces(allFavoritePlaces);
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
        <SettingBtn onClick={handleSettingClick}>프로필 편집</SettingBtn>
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
          component={
            <BookMarkList datas={favoritePlaces} setList={setFavoritePlaces} />
          }
          mapIcon={MapIcon}
          onMapOpen={handleMapOpen}
        />
        <MypageBox
          icon={ReviewIcon}
          title='작성한 리뷰'
          component={
            <ReviewList
              datas={reviewDatas}
              type={'review'}
              setList={setReviewDatas}
            />
          }
        />
      </MypageContainer>
      {showMapModal && (
        <DefaultModal title={'즐겨찾기 장소'} onClose={handleCloseModal}>
          <BookMarkMap
            libraries={favoritePlaces.filter(
              (place) => place.type === 'library'
            )}
            parks={favoritePlaces.filter((place) => place.type === 'park')}
            onLibraryClick={() => {}}
            onParkClick={() => {}}
            center={{ lat: 37.5665, lng: 126.978 }}
          />
        </DefaultModal>
      )}
      {showModal && <AuthModal onClose={handleCloseModal} />}
    </Container>
  );
};

export default Mypage;

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const ProfileConatiner = styled.div`
  flex: display;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #f9f5f0;
  border-right: 1px solid #c5b8a8;
  min-width: 20rem;
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
  color: #5a4832;
  margin-top: -15px;
`;

const UserDescription = styled.p`
  font-size: 1.1rem;
  color: #191619;
  margin-top: 35px;
`;

const SettingBtn = styled.button`
  font-size: 0.9rem;
  font-weight: 400;
  color: white;
  width: 11rem;
  height: 2rem;
  padding: 5px;
  border: 1px solid #563c0a;
  border-radius: 7px;
  background-color: #563c0a;
  align-self: flex-end;
  cursor: pointer;
  margin-top: 25px;
  margin-bottom: 2px;
`;

const MypageContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 30px;
  align-items: center;
  margin: 25px auto;
  padding: 30px;
  width: 100%;
`;
