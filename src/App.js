import React, { useState } from "react";
import { Button, Typography, Box, Container, AppBar, Toolbar, IconButton } from "@mui/material";
import { useSwipeable } from "react-swipeable";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Model_x_y from "./vision/pushups";

function App() {
  const [currentSection, setCurrentSection] = useState(0); 

  const swipeHandlers = useSwipeable({
    onSwipedUp: () => {
      if (currentSection === 0) setCurrentSection(1); 
    },
    onSwipedDown: () => {
      if (currentSection === 1) setCurrentSection(0); 
    },
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
  });

  const containerStyle = {
    transform: `translateY(${currentSection === 0 ? "0" : "-100vh"})`,
    transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
  };

  return (
    <Box
      {...swipeHandlers}
      sx={{ bgcolor: "black", color: "white", minHeight: "100vh", overflow: "hidden" }}
    >
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          bgcolor: currentSection === 0 ? "black" : "white",
          color: currentSection === 0 ? "white" : "black",
          padding: "0px 20px",
          top: 0,
          zIndex: 10,
          transition: "background-color 0.5s ease, color 0.5s ease",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontFamily: "Arial", fontWeight: "bold" }}
          >
            {currentSection === 0 ? (
              <svg width="93" height="30" viewBox="0 0 93 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_49_3)">
                <path d="M9.95482 8.61706L5.6084 5.14059V29.8235H9.95482V18.7982H26.6682V15.4953H9.95482V8.61706ZM21.4802 11.0506H11.217V14.3529H25.5463L21.4802 11.0506ZM27.1452 23.9382V26.8435L30.0335 29.1282V26.2224L27.1452 23.9382Z" fill="white"/>
                <path d="M46.662 4.4447L42.9048 7.74764H10.8238L6.67334 4.4447H46.662Z" fill="white"/>
                <path d="M56.8144 2.08588L30.791 25.3035L27.7904 22.92L49.7191 3.32765H4.34642V29.1029L0 25.6765V0H54.2622L56.8144 2.08588ZM66.1522 20.9588H70.4986V8.59118L66.1522 5.11471V20.9588Z" fill="white"/>
                <path d="M92.3444 14.9241C92.3444 23.9629 85.2491 29.7988 75.0417 29.7988H31.3237V26.4959L57.2349 3.40177V8.49295L37.016 26.5206H73.836C82.5574 26.5206 88.0258 21.7782 88.0258 14.8994C88.0258 8.02118 82.6976 3.32765 73.836 3.32765H64.9187V22.1006H73.836C79.248 22.1006 82.4173 19.3194 82.4173 14.8994C82.4173 10.4794 79.248 7.74765 73.836 7.74765H71.3961L67.2463 4.4453H73.836C81.9961 4.4453 86.7637 8.74118 86.7637 14.8994C86.7637 21.0582 81.8559 25.4035 73.836 25.4035H40.1288L43.8023 22.1006H60.5722V0.0252991H74.0606C85.8662 0.0252991 92.3444 5.8853 92.3444 14.9488V14.9241Z" fill="white"/>
                </g>
                <defs>
                <clipPath id="clip0_49_3">
                <rect width="93" height="30" fill="white"/>
                </clipPath>
                </defs>
              </svg>
            ) : (
              <svg width="93" height="30" viewBox="0 0 93 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.2708 8.52113L6 5V30H10.2708V18.8331H26.6933V15.4877H10.2708V8.52113ZM21.5955 10.9859H11.5109V14.3307H25.5908L21.5955 10.9859ZM27.162 24.0391V26.9817L30 29.2958V26.3526L27.162 24.0391Z" fill="black"/>
                <path d="M47 4L43.2417 8H11.1516L7 4H47Z" fill="black"/>
                <path d="M57.2184 2.0785L31.0099 25.214L27.988 22.8389L50.0727 3.31588H4.37733V29L0 25.5857V0H54.6481L57.2184 2.0785ZM66.6227 20.8847H71V8.56079L66.6227 5.09661V20.8847Z" fill="black"/>
                <path d="M93 15.0122C93 24.1197 85.9072 30 75.7032 30H32V26.6719L57.9024 3.40215V8.53206L37.6903 26.6968H74.4979C83.2164 26.6968 88.6829 21.9184 88.6829 14.9873C88.6829 8.0567 83.3565 3.32747 74.4979 3.32747H65.5836V22.2432H74.4979C79.908 22.2432 83.0763 19.4409 83.0763 14.9873C83.0763 10.5336 79.908 7.78109 74.4979 7.78109H72.0588L67.9104 4.45362H74.4979C82.6553 4.45362 87.4212 8.78218 87.4212 14.9873C87.4212 21.1929 82.5151 25.5713 74.4979 25.5713H40.8021L44.4744 22.2432H61.2386V0H74.7224C86.5241 0 93 5.90457 93 15.037V15.0122Z" fill="black"/>
              </svg>
            )}
          </Typography>
          <div className="gap-[10px] flex justify-center items-center w-full">
            <Button
              variant="outlined"
              sx={{
                color: currentSection === 0 ? "white" : "black",
                borderColor: currentSection === 0 ? "white" : "black",
                borderRadius: "500px",
                marginRight: "20px",
                paddingTop: "10px",
                paddingBottom: "10px",
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
            >
              Newsroom
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: currentSection === 0 ? "#c7ff00" : "#c7ff00",
                color: currentSection === 0 ? "black" : "black",
                borderRadius: "500px",
                paddingTop: "10px",
                paddingBottom: "10px",
                paddingLeft: "30px",
                paddingRight: "30px",
                boxShadow: "none",
              }}
            >
              Get in touch
            </Button>
          </div>
        </Toolbar>
      </AppBar>

      {/* Content Sections */}
      <div style={containerStyle}>
        <Container
          maxWidth="lg"
          sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            top: 0,
            width: "100%",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              mb: 4,
              position: "relative",
              width: "100%"
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: -1,
                width: "100%",
                height: "100svh",
                overflow: "hidden",
                marginTop: "300px",
              }}
            >
              <svg width="541" height="338" viewBox="0 0 541 338" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M275.164 300.493C202.542 359.125 96.1399 347.785 37.5074 275.164C-21.1251 202.542 -9.78488 96.1399 62.8365 37.5074C135.458 -21.1251 241.86 -9.78488 300.493 62.8365C359.125 135.458 347.785 241.86 275.164 300.493ZM64.4588 39.5167C-7.05289 97.2532 -18.2198 202.03 39.5167 273.541C97.2532 345.053 202.03 356.22 273.541 298.483C345.053 240.747 356.22 135.97 298.483 64.4588C240.747 -7.05288 135.97 -18.2198 64.4588 39.5167Z" fill="url(#paint0_linear_0_1)"/>
                <path d="M541 169C541 262.336 465.336 338 372 338C278.664 338 203 262.336 203 169C203 75.6639 278.664 0 372 0C465.336 0 541 75.6639 541 169ZM205.582 169C205.582 260.91 280.09 335.418 372 335.418C463.91 335.418 538.418 260.91 538.418 169C538.418 77.0901 463.91 2.58247 372 2.58247C280.09 2.58247 205.582 77.0901 205.582 169Z" fill="url(#paint1_linear_0_1)"/>
                <defs>
                <linearGradient id="paint0_linear_0_1" x1="300.493" y1="62.8365" x2="37.5074" y2="275.164" gradientUnits="userSpaceOnUse">
                <stop stop-color="#4E2E00"/>
                <stop offset="0.52" stop-color="#0D0081"/>
                <stop offset="1"/>
                </linearGradient>
                <linearGradient id="paint1_linear_0_1" x1="372" y1="0" x2="372" y2="338" gradientUnits="userSpaceOnUse">
                <stop/>
                <stop offset="0.415" stop-color="#5E5E5E"/>
                <stop offset="1"/>
                </linearGradient>
                </defs>
              </svg>
            </div>
            EVERY MOVE <span style={{ color: "#401FD2" }}>COUNTS</span>
            <br />
            <IconButton
              onClick={() => setCurrentSection(1)}
              sx={{ color: "white", marginTop: "20px" }}
            >
              <ArrowDownwardIcon fontSize="large" />
            </IconButton>
          </Typography>


          
        </Container>

        <div
          style={{
            height: "100vh",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "fixed",
            width: "100%",
          }}
        >
            <IconButton
              onClick={() => setCurrentSection(0)}
              sx={{
                
              }}
            >
            <ArrowUpwardIcon fontSize="large"/>
          </IconButton>
          <Model_x_y />
        </div>
      </div>
    </Box>
  );
}

export default App;
