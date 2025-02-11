import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  text-align: center;
  //   background-color: #f5f0e4;
  -ms-overflow-style: none;
  overflow: hidden;

  @media (hover: hover) {
    width: 390px;
    margin: 0 auto;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const BodyWrapper = styled.div`
  flex: 1;
  overflow: auto;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  margin-bottom: 60px;
`;

const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  height: 60px;
  padding: 10px;
  align-items: center;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;

const Back = styled.div`
  width: 30px;
  cursor: pointer;
`;

const Logo = styled.div`
  cursor: pointer;
`;

const Video = styled.div`
  cursor: pointer;
  width: 30px;
`;

const Body = styled.div`
  height: 690px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  flex-shrink: 0;
`;
const Gra = styled.div`
  position: relative;
  background: linear-gradient(to right, #e02d11, #05bba2);
  width: 100%;
  height: 2px;
  border: none; /* 선 없애기 */
`;
const FormContent = styled.div`
  height: auto;
  margin: 43px 32px;
  margin-bottom: 0;
`;
const PayImg = styled.div`
  margin: auto;
  width: 326px;
  height: 326px;
  border-radius: 10px;
`;
const ProductName = styled.div`
  color: #000;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  height: 82px;
  padding-top: 22px;
  box-sizing: border-box;
  text-align: left;
  margin-bottom: 20px;
`;
const ProductWrapper = styled.div`
  height: 58px;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-bottom: 8px;
  margin-top: 8px;
`;
const PriceWrapper = styled.div`
  display: inline;
`;
const CountWrapper = styled.div`
  width: 113px;
  height: 40px;
  border-radius: 6px;
  border: 1px solid #60716f;
  background: #fff;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
`;
const TotalWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: 65px;
  align-items: center;
  padding: 0 18px;
  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;
const Whole = styled.span``;
const Price = styled.span``;
const Won = styled.span``;
const TotalPrice = styled.span``;

const Submit = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;
const CoachMark = styled.div`
  position: fixed;
  bottom: 80px;
  text-align: right;
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  @media (hover: hover) {
    width: 390px;
    margin: 0 auto;
  }
`;
const BottomBar = styled.footer`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 60px;
  position: fixed;
  bottom: 0;
  width: 100%;
  background: white;
  @media (hover: hover) {
    width: 390px;
    margin: 0 auto;
  }
`;

const Menu = styled.div`
  width: 30px;
  cursor: pointer;
`;

const Search = styled.div`
  width: 30px;
  cursor: pointer;
`;

const Home = styled.div`
  width: 30px;
  cursor: pointer;
`;

const My = styled.div`
  width: 30px;
  cursor: pointer;
`;

const ProductDetail = () => {
  const navigate = useNavigate();
  const { category, productId } = useParams(); // 경로 파라미터 값 가져오기
  const [productDetail, setProductDetail] = useState(null);
  const [value, setValue] = useState(1);

  const BACKEND_URL =
    "https://youngest.pythonanywhere.com" || "http://127.0.0.1:8000";
  useEffect(() => {
    // API 요청을 위한 URL 조합
    const apiUrl = `${BACKEND_URL}/products/${category}/${productId}/`;

    axios
      .get(apiUrl)
      .then((response) => {
        setProductDetail(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("에러 발생 : ", error);
      });
  }, [category, productId]);

  if (!productDetail) {
    return <div>Loading...</div>; // 로딩 중일 때 표시할 내용
  }

  const inputValue = (e) => {
    const { value } = e.target;
    setValue(value);
  };

  const addValue = () => {
    if (value > 19) {
      return;
    }
    setValue(value + 1);
  };

  const minusValue = () => {
    if (value < 2) {
      return;
    }
    setValue(value - 1);
  };

  const navigateToBack = () => {
    window.history.back();
  };

  const navigateToVideo = () => {
    navigate("/PlayVideo");
  };

  const totalPriceValue = value * productDetail.price;

  const submitStyle = {
    width: "222px",
    height: "53px",
    padding: "10px",
    borderRadius: "6px",
    background: "#05BBA2",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    border: "none",
    color: "white",
  };

  const countStyles = {
    minus: {
      borderRadius: "50%",
      width: "24px",
      height: "24px",
      border: "1px solid #60716F",
      background: "transparent",
      cursor: "pointer", // Adding cursor pointer for better interaction
    },
    plus: {
      borderRadius: "50%",
      width: "24px",
      height: "24px",
      border: "1px solid #60716F",
      background: "transparent",
      cursor: "pointer", // Adding cursor pointer for better interaction
    },
    inputCount: {
      width: "26px", // Adjusted width for better alignment
      border: "none",
      textAlign: "center",
      margin: "0 10px", // Adjusted margin for better alignment
    },
  };

  const goMenu = () => {
    navigate("/Category");
  };
  const goSearch = () => {
    navigate("/Main");
  };
  const goMain = () => {
    navigate("/Main");
  };
  const goMyPage = () => {
    navigate("/MypageMain");
  };
  const flex = () => {
    const queryParams = new URLSearchParams();
    queryParams.append("productName", productDetail.name);
    queryParams.append("unitPrice", productDetail.price);
    queryParams.append("quantity", value);
    queryParams.append("imagePath", productDetail.image);
    queryParams.append("productId", productDetail.id);

    // URL 쿼리 파라미터로 데이터를 전달하면서 페이지 이동
    navigate(`/payment?${queryParams.toString()}`);
  };

  return (
    <Container>
      <BodyWrapper>
        <Topbar>
          <Back onClick={navigateToBack}>
            <img
              src={`${process.env.PUBLIC_URL}/images/left.png`}
              alt="back"
              width="12px"
            />
          </Back>
          <Logo>
            <img
              src={`${process.env.PUBLIC_URL}/images/로고3.png`}
              alt="logo"
              width="90px"
            />
          </Logo>
          <Video onClick={navigateToVideo}>
            <img
              src={`${process.env.PUBLIC_URL}/images/carousel-video.png`}
              width="30px"
              alt="video"
            />
          </Video>
        </Topbar>
        <Body>
          <FormContent>
            <PayImg>
              <img
                src={`${BACKEND_URL}${productDetail.image}`}
                alt={productDetail.name}
                width="326px"
              />
            </PayImg>
            <ProductName>{productDetail.name}</ProductName>
            <Gra></Gra>
            <ProductWrapper>
              <PriceWrapper>
                {/* <Price>{price.toLocaleString()}</Price> */}
                <Price>{productDetail.price}</Price>
                <Won> 원</Won>
              </PriceWrapper>
              <CountWrapper>
                <button
                  className="minus"
                  style={countStyles.minus}
                  onClick={minusValue}
                >
                  -
                </button>
                <input
                  className="inputCount"
                  style={countStyles.inputCount}
                  onChange={inputValue}
                  value={value}
                ></input>
                <button
                  className="plus"
                  style={countStyles.plus}
                  onClick={addValue}
                >
                  +
                </button>
              </CountWrapper>
            </ProductWrapper>
            <Gra></Gra>
            <TotalWrapper>
              <Whole>총 </Whole>
              <PriceWrapper>
                <TotalPrice>{totalPriceValue.toLocaleString()}</TotalPrice>
                <Won> 원</Won>
              </PriceWrapper>
            </TotalWrapper>
          </FormContent>
          <Submit>
            <button formAction="" style={submitStyle} onClick={flex}>
              구매하기
            </button>
          </Submit>
          <CoachMark>
            <img
              src={`${process.env.PUBLIC_URL}/images/coachmark.png`}
              width="48px"
            />
          </CoachMark>
        </Body>
        <BottomBar>
          <Menu onClick={goMenu}>
            <img
              src={`${process.env.PUBLIC_URL}/images/menu.png`}
              width="26px"
            />
          </Menu>
          <Search onClick={goSearch}>
            <img
              src={`${process.env.PUBLIC_URL}/images/search.png`}
              width="26px"
            />
          </Search>
          <Home onClick={goMain}>
            <img
              src={`${process.env.PUBLIC_URL}/images/home.png`}
              width="26px"
            />
          </Home>
          <My onClick={goMyPage}>
            <img src={`${process.env.PUBLIC_URL}/images/me.png`} width="26px" />
          </My>
        </BottomBar>
      </BodyWrapper>
    </Container>
  );
};
export default ProductDetail;
