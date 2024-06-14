import React from 'react';
import styled from 'styled-components';
import LibraryPing from '../../../src/assets/icons/LibraryPing.svg';

const ParkList = ({ parks, keyword, handleParkItemClick }) => {
  const filterLibraries = (parks, keyword) => {
    return parks.filter((park) => park.name.includes(keyword));
  };

  return (
    <Container>
      <List>
        {filterLibraries(parks, keyword).map((park, index) => (
          <ListItem key={index} onClick={() => handleParkItemClick(park)}>
            <LibraryIcon src={LibraryPing} alt='LibraryPing' />
            <LibraryInfo>
              <LibraryName>{park.name}</LibraryName>
              <LibraryAddress>{park.address}</LibraryAddress>
            </LibraryInfo>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ParkList;

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 60vh;
`;

const List = styled.ul`
  list-style: none;
  padding-left: 0.5rem;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 0.5px solid #dfdfdf;
`;

const LibraryIcon = styled.img`
  width: 34px;
  height: 34px;
  margin-right: 10px;
`;

const LibraryInfo = styled.div`
  display: flex;
  text-align: left;
  flex-direction: column;
`;

const LibraryName = styled.span`
  font-family: 'SUIT';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  color: #191619;
  text-align: left;
  margin: 5px 0;
`;

const LibraryAddress = styled.span`
  font-family: 'SUIT';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: #545454;
  text-align: left;
  margin: 5px 0;
`;
