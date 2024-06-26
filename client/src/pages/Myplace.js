import React, { useState, useEffect } from 'react';
import { getLibraryPings, getParkPings, getReviews } from '../api/Main';
import styled from 'styled-components';
import ReviewStar from '../components/main/ReviewStar';
import BooksImg from '../assets/icons/books.svg';
import { getLoginStatus } from '../api/Auth';

const Myplace = () => {
  const [libraries, setLibraries] = useState([]);
  const [parks, setParks] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userPlace, setUserPlace] = useState(
    localStorage.getItem('userRegion')
  );

  const getLibrary = async () => {
    try {
      const libraryData = await getLibraryPings();
      const filteredLibraries = await Promise.all(
        libraryData
          .filter((library) => library.district === userPlace)
          .map(async (library) => {
            const reviews = await getReviews(library._id);
            const { reviews: _, ...libraryWithoutReviews } = library;
            return { ...libraryWithoutReviews, reviews: reviews.data };
          })
      );
      setLibraries(filteredLibraries);
    } catch (error) {
      console.error('Error fetching libraries:', error);
    }
  };

  const getPark = async () => {
    try {
      const parkData = await getParkPings();
      const filteredParks = await Promise.all(
        parkData
          .filter((park) => park.district === userPlace)
          .map(async (park) => {
            const reviews = await getReviews(park._id);
            const { reviews: _, ...parkWithoutReviews } = park;
            return { ...parkWithoutReviews, reviews: reviews.data };
          })
      );
      setParks(filteredParks);
    } catch (error) {
      console.error('Error fetching parks:', error);
    }
  };
  const checkLoginStatus = async () => {
    try {
      await getLoginStatus();
    } catch (error) {
      setUserPlace('로그인 후 내 주변 도서관을 찾아보세요');
    }
  };

  useEffect(() => {
    checkLoginStatus();
    getLibrary();
    getPark();
  }, []);

  const handlePlaceClick = (place) => {
    setSelectedPlace(place);
    console.log('Selected Place:', place);
  };

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Number((totalRating / reviews.length).toFixed(2));
  };

  return (
    <Container>
      <Sidebar>
        <Category>
          <CategoryHeader>도서관</CategoryHeader>
          <ItemList>
            {libraries.map((library, index) => (
              <Item
                key={index}
                onClick={() => handlePlaceClick(library)}
                isSelected={selectedPlace && selectedPlace._id === library._id}
              >
                {library.name}
              </Item>
            ))}
          </ItemList>
        </Category>
        <Category>
          <CategoryHeader>공원</CategoryHeader>
          <ItemList>
            {parks.map((park, index) => (
              <Item
                key={index}
                onClick={() => handlePlaceClick(park)}
                isSelected={selectedPlace && selectedPlace._id === park._id}
              >
                {park.name}
              </Item>
            ))}
          </ItemList>
        </Category>
      </Sidebar>
      <Content>
        <Header>
          <span>안녕하세요,</span> {userPlace}!
        </Header>
        {selectedPlace && (
          <Details>
            <h2>{selectedPlace.name}</h2>
            <InlineInfo>
              <ReviewStar
                rating={calculateAverageRating(selectedPlace.reviews)}
              />
              <ReviewCount>({selectedPlace.reviews.length})</ReviewCount>
            </InlineInfo>
            <ContentBox>
              <InfoBox>
                <p>
                  <strong>주소 :</strong> {selectedPlace.address}
                </p>
                <p>
                  <strong>휴무일 :</strong>{' '}
                  {selectedPlace.holidays || '연중무휴'}
                </p>
                <p>
                  <strong>운영시간 :</strong>{' '}
                  {selectedPlace.hours || '운영시간 정보 없음'}
                </p>
                <p>
                  <strong>전화번호 :</strong> {selectedPlace.phone}
                </p>
                <p>
                  <strong>홈페이지 :</strong>{' '}
                  {selectedPlace.url ? (
                    <a
                      href={selectedPlace.url}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {selectedPlace.url}
                    </a>
                  ) : (
                    '홈페이지 URL 없음'
                  )}
                </p>
              </InfoBox>
              <BookImg src={BooksImg} alt='book-img' />
            </ContentBox>
            <RevieContanier>
              <strong>리뷰:</strong>
            </RevieContanier>
            <ReviewList>
              {selectedPlace.reviews.length > 0
                ? selectedPlace.reviews.map((review, index) => (
                    <ReviewItem key={index}>
                      <ReviewStar rating={review.rating} />
                      <CommentContainer>
                        <Comment>{review.comment}</Comment>
                      </CommentContainer>
                      <ReviewDate>
                        {new Date(review.date).toLocaleDateString()}
                        <UserName>{review.user.name}</UserName>
                      </ReviewDate>
                    </ReviewItem>
                  ))
                : 'No reviews'}
            </ReviewList>
          </Details>
        )}
      </Content>
    </Container>
  );
};

export default Myplace;

const Container = styled.div`
  display: flex;
`;

const Sidebar = styled.div`
  width: 20rem;
  background-color: #f9f5f0;
  padding: 2.5rem 2rem 0rem 1rem;
  background-color: #f3e6d7;
  border-right: 1px solid #c5b8a8;
  position: fixed;
  height: 100%;
`;

const Category = styled.div`
  margin-bottom: 10px;
`;

const CategoryHeader = styled.h2`
  font-size: 1.5em;
  padding-left: 10px;
`;

const ItemList = styled.div`
  padding-left: 20px;
  max-height: 350px;
  overflow-y: auto;
`;

const Item = styled.div`
  padding: 10px;
  cursor: pointer;
  background-color: ${(props) => (props.isSelected ? '#f0f0f0' : 'white')};
  font-weight: ${(props) => (props.isSelected ? 'bold' : 'normal')};
  &:hover {
    background-color: #f0f0f0;
  }
`;

const Content = styled.div`
  margin-left: 22rem;
  flex: 1;
  padding: 0.3rem 10rem;
  box-sizing: border-box;
  text-align: left;
`;

const Header = styled.h1`
  font-size: 2em;
  text-align: left;
  color: #583e26;
  margin: 3rem 0 0 0;

  span {
    color: #2f2f2f;
  }
`;

const InlineInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: flex-start;
`;

const ReviewCount = styled.span`
  margin-left: 5px;
  font-size: 0.9em;
  color: #333;
`;

const Details = styled.div`
  padding-top: 40px;
  text-align: left;
  box-sizing: border-box;
  margin-left: 3px;
`;

const ReviewList = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;

  width: 100%;
`;

const ReviewItem = styled.div`
  padding: 10px 0;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const CommentContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ReviewDate = styled.span`
  margin-left: 10px;
  text-align: center;
  color: #999;
  font-size: 0.8em;
  display: flex;
  flex-direction: column;
`;

const Comment = styled.p`
  margin-left: 5px;
  font-weight: bold;
`;

const UserName = styled.span`
  font-size: 0.9rem;
  font-weight: normal;
  color: #333;
  text-align: right;
  margin-right: 3px;
  margin-top: 5px;
`;

const RevieContanier = styled.div`
  margin-top: 70px;
`;

const BookImg = styled.img`
  width: 10rem;
  align-self: flex-end;
  margin-bottom: 15px;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;
