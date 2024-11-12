import { useState, useEffect } from "react";
import { CameraIcon, CtruhHorizontalIcon } from "./components/icon";
import "./index.css";
import { takeSnapShot } from "./main";

interface IndexProps {
  takeSnapShot: () => void;
  setMakeupState: (state: typeof window.makeupState) => void;
}
function Index(props: IndexProps) {
  const { setMakeupState } = props;

  const cosmeticsData = [
    {
      name: "Lipstick",
      items: [
        // { label: "Lipstick - Maroon", color: "#800000" },
        { label: "Lipstick - DarkLavender", color: "#800080", name: "" },
        { label: "Lipstick - Orange", color: "#AA0320", name: "" },
        { label: "Lipstick - Maroonpink", color: "#7A2F48", name: "" },
        { label: "Lipstick - Red", color: "#800000", name: "" },
        { label: "Lipstick - Purple", color: "#9C2455", name: "" },
        { label: "Lipstick - DarkRed", color: "#59130E", name: "" },
      ],
      path: "lipstick.png",
    },
    {
      name: "Eye",
      items: [
        { label: "Eyebrow Pencil - Black", color: "#000012", name: "all" },
        { label: "Eyebrow Pencil - Brown", color: "#2E0007", name: "all" },
        {
          label: "Lipstick - DarkLavender",
          color: "#800080",
          name: "eyeshadow",
        },
        { label: "Lipstick - Orange", color: "#AA0320", name: "eyeshadow" },
        { label: "Lipstick - Maroonpink", color: "#7A2F48", name: "eyeshadow" },
        { label: "Lipstick - Red", color: "#800000", name: "eyeshadow" },
        { label: "Lipstick - Purple", color: "#9C2455", name: "eyeshadow" },
        { label: "Lipstick - DarkRed", color: "#59130E", name: "eyeshadow" },
        // { label: "Eyebrow Pencil - Grey", color: "#808080" },
      ],
      path: "eyebrow.png",
    },
    {
      name: "Face",
      items: [
        //#DA6B4C  #C17A82
        // { label: "Eye Shadow - Orange", color: "#FFA500" },
        // { label: "Eye Shadow - Blue", color: "#0000FF" },
        // { label: "Eye Shadow - Green", color: "#800000" },
        // { label: "Eye Shadow - Purple", color: "#800080" },
        // { label: "Eye Shadow - Purple", color: "#F30290" },
        // { label: "Eye Shadow - Purple", color: "#FF1E1E" },
      ],
      // path: "eyeShadow.png",
    },
  ];

  const eyeImages = [
    {
      name: "EYE BROW",
      items: [
        // { name: "pattern1", url: "/eyeshadow.jpg" },
        { name: "pattern2", url: "/eyebrow.jpg" },
        // { name: "pattern3", url: "/eyeshadow.jpg" },
      ],
    },
    {
      name: "EYE LINER",
      items: [
        { name: "pattern1", url: "/Eyeliner_2.png" },
        { name: "pattern2", url: "/Eyeliner_3.png" },
        { name: "pattern3", url: "/Eyeliner_1.png" },
      ],
    },
    {
      name: "EYE SHADOW",
      items: [],
    },
    {
      name: "KAJAL",
      items: [
        { name: "pattern1", url: "/Kajal_1.png" },
        { name: "pattern2", url: "/Kajal_2.png" },
      ],
    },
  ];
  const lipImages = [
    {
      name: "MATTE",
      items: [],
    },
    {
      name: "GLOSSY",
      items: [],
    },
    {
      name: "CRAYON",
      items: [],
    },
    {
      name: "SHIMMER",
      items: [],
    },
  ];
  const [selectedCosmetic, setSelectedCosmetic] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedImages, setSelectedImages] = useState<
    {
      name: string;
      url: string;
    }[]
  >([]);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [state, setState] = useState<typeof window.makeupState>({
    lips: true,
    lipsType: "",
    eyebrow: false,
    eyeshadow: false,
    eyeliner: false,
    eyekajal: false,
    eyeLinerPattern: "pattern1",
    KajalPattern: "pattern1",
    lipColor: [161, 46, 42, 50],
    eyebrowColor: [0, 0, 0, 15],
    eyeshadowColor: [179, 44, 39, 20],
  } as typeof window.makeupState);

  const handleButtonClick = (
    images: { name: string; url: string }[],
    name: string
  ) => {
    if (activeButton === name) {
      setSelectedImages([]);
      setActiveButton(null);
    } else {
      setSelectedImages(images);
      setActiveButton(name);
    }
    if (
      name === "GLOSSY" ||
      name === "SHIMMER" ||
      name === "CRAYON" ||
      name === "MATTE"
    ) {
      setState((prevState) => ({ ...prevState, lipsType: name }));
    }
    if (name === "FOUNDATION") {
      setState((prevState) => ({ ...prevState, foundation: true }));
    }
    if (name === "BLUSH") {
      setState((prevState) => ({ ...prevState, blush: true }));
    }
  };

  const handleCosmeticSelection = (cosmeticName: string, color: string) => {
    const colorArray = hexToRGBA(color);
    setState((prevState: any) => {
      if (cosmeticName === "Lipstick") {
        return { ...prevState, lipColor: colorArray, lips: true };
      } else if (cosmeticName === "Face") {
        return { ...prevState, face: true };
      } else if (cosmeticName === "Eye") {
        if (activeButton === "EYE BROW") {
          return { ...prevState, eyebrowColor: color };
        }
        if (activeButton === "EYE SHADOW") {
          return { ...prevState, eyeshadowColor: color };
        }
        return prevState;
      } else {
        return prevState;
      }
    });
  };

  const handleImageClick = (name: string) => {
    if (activeButton === "EYE LINER") {
      setState((prevState) => ({
        ...prevState,
        eyeliner: true,
        eyeLinerPattern: name,
      }));
    } else if (activeButton === "KAJAL") {
      setState((prevState) => ({
        ...prevState,
        eyekajal: true,
        KajalPattern: name,
      }));
    } else if (activeButton === "EYE SHADOW") {
      setState((prevState) => ({
        ...prevState,
        eyeshadow: true,
        eyeshadowColor: [179, 44, 39, 20],
      }));
    } else if (activeButton === "EYE BROW") {
      setState((prevState) => ({
        ...prevState,
        eyebrow: true,
        eyebrowColor: [0, 0, 11, 50],
      }));
    }
  };

  const handleCosmeticButtonClick = (cosmeticName: string) => {
    // Update the selectedCosmetic array to reorder the selected cosmetic
    setSelectedCosmetic((prevSelected: any) => {
      if (prevSelected.includes(cosmeticName)) {
        return [...prevSelected.filter((item: any) => item !== cosmeticName)];
      } else {
        return [...prevSelected, cosmeticName];
      }
    });

    setSelectedOption(cosmeticName);
    setState((prevState) => {
      const newState = { ...prevState };

      switch (cosmeticName) {
        case "Lipstick":
          newState.lips = true; // Turn on lipstick
          break;
        // case "Eye":
        //   newState.eyebrow = true;
        //   break;
        case "Face":
          newState.face = true; // Turn on eye shadow
          break;
        default:
          break;
      }
      return newState; // Return the updated state
    });
  };

  // useEffect(() => {
  //   console.log("selected cosmetic", selectedCosmetic);
  // }, [selectedCosmetic]);
  const handleReset = () => {
    setState({
      lips: false,
      lipsType: "",
      eyebrow: false,
      face: false,
      foundation: false,
      blush: false,
      eyeliner: false,
      eyekajal: false,
      KajalPattern: "pattern1",
      eyeLinerPattern: "pattern1",
      lipColor: state.lipColor,
      eyebrowColor: state.eyebrowColor,
      eyeshadowColor: state.eyeshadowColor,
    });
    setSelectedCosmetic([]); // Reset selected cosmetics
    setSelectedImages([]);
    setActiveButton(null);
  };
  // Call setMakeupState after state update to sync with external makeup state
  useEffect(() => {
    setMakeupState(state);
  }, [state]);

  // Helper function to convert hex to RGBA
  const hexToRGBA = (hex: string) => {
    let r = 0,
      g = 0,
      b = 0,
      a = 100;

    if (hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    }

    return [r, g, b, a];
  };

  const renderDivs = () => {
    let selectedData: any;
    selectedData = cosmeticsData.find(
      (cosmetic) => cosmetic.name === selectedOption
    );

    if (selectedData) {
      if (selectedOption === "Eye") {
        if (activeButton == "EYE LINER" || activeButton == "KAJAL") {
          selectedData = {
            name: "Eye",
            path: "eyebrow.png",
            items: selectedData.items.filter(
              (item: any) => item.color === "#000000"
            ),
          };
        } else if (activeButton === "EYE SHADOW") {
          selectedData = {
            name: "Eye",
            path: "eyebrow.png",
            items: selectedData.items.filter(
              (item: any) => item.name === "eyeshadow"
            ),
          };
        } else {
          selectedData = {
            name: "Eye",
            path: "eyebrow.png",
            items: selectedData.items.filter(
              (item: any) => item.name === "all"
            ),
          };
        }
      }
      // Check if there are more than 6 items
      const moreThanSix = selectedData.items.length > 6 ? "more-than-6" : "";

      return (
        <div className={`cosmeticContainer ${moreThanSix}`}>
          {selectedData.items.map((item: any, index: number) => {
            return (
              <div
                key={index}
                className="cosmeticItemWrapper"
                onClick={() => {
                  setSelectedIndex(index);
                  handleCosmeticSelection(
                    selectedData.name,
                    selectedData.items[index].color
                  );
                }}
              >
                <img
                  src={selectedData.path}
                  alt={item.label}
                  className="cosmeticItem"
                  style={{
                    border:
                      selectedIndex === index
                        ? "1px solid #000"
                        : "1px solid transparent", // Add border if selected
                  }}
                />
                <div
                  className="selectedHexCode"
                  style={{
                    backgroundColor: item.color,
                    borderRight:
                      selectedIndex === index ? "1px solid white" : "none",
                    borderBottom:
                      selectedIndex === index ? "1px solid white" : "none",
                  }}
                ></div>
              </div>
            );
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="mainContainer">
        <div className="header">
          <CtruhHorizontalIcon />
          <h3>Ctruh Web AR Live</h3>
        </div>
        <div className="contentContainer">
          <CameraIcon
            onClick={() => {
              takeSnapShot();
            }}
          />

          {renderDivs()}

          <div className="buttonContainer">
            <button
              className={`button ${
                selectedCosmetic.includes("Lipstick") ? "active" : ""
              }`}
              onClick={() => handleCosmeticButtonClick("Lipstick")}
            >
              LIPSTICK
            </button>
            {selectedCosmetic.includes("Lipstick") && (
              <div className="buttonOptions" key="lipButtonOptions">
                {lipImages.map((item) => (
                  <>
                    <button
                      className="buttonValue"
                      key={item.name}
                      onClick={() => {
                        handleCosmeticButtonClick("Lipstick");
                        handleButtonClick(item.items, item.name);
                      }}
                    >
                      {item.name}
                    </button>
                  </>
                ))}
              </div>
            )}

            <button
              className={`button ${
                selectedCosmetic.includes("Eye") ? "active" : ""
              }`}
              onClick={() => handleCosmeticButtonClick("Eye")}
            >
              EYE
            </button>
            {selectedCosmetic.includes("Eye") && (
              <div className="buttonOptions" key="eyeButtonOptions">
                {eyeImages.map((item) => {
                  if (item.name === "EYE SHADOW") {
                    return (
                      <>
                        <button
                          className="buttonValue"
                          key={item.name}
                          onClick={() => {
                            handleCosmeticButtonClick("Eye");
                            handleButtonClick(item.items, item.name);
                            setState((prevState) => ({
                              ...prevState,
                              eyeshadow: true,
                              eyeshadowColor: [179, 44, 39, 20],
                            }));
                          }}
                        >
                          {item.name}
                        </button>
                      </>
                    );
                  } else {
                    return (
                      <>
                        <button
                          className="buttonValue"
                          key={item.name}
                          onClick={() => {
                            handleCosmeticButtonClick("Eye");
                            handleButtonClick(item.items, item.name);
                          }}
                        >
                          {item.name}
                        </button>
                      </>
                    );
                  }
                })}
              </div>
            )}

            <button
              className={`button ${
                selectedCosmetic.includes("Face") ? "active" : ""
              }`}
              onClick={() => handleCosmeticButtonClick("Face")}
            >
              FACE
            </button>
            {selectedCosmetic.includes("Face") && (
              <div className="buttonOptions" key="faceButtonOptions">
                <button
                  className="buttonValue"
                  onClick={() => {
                    handleCosmeticButtonClick("Face");
                    handleButtonClick([], "FOUNDATION");
                  }}
                >
                  FOUNDATION{" "}
                </button>
                <button
                  className="buttonValue"
                  onClick={() => {
                    handleCosmeticButtonClick("Face");
                    handleButtonClick([], "BLUSH");
                  }}
                >
                  BLUSH
                </button>
              </div>
            )}
            <button className="button" onClick={handleReset}>
              RESET
            </button>
            <div className="imageClass">
              {selectedImages.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  onClick={() => handleImageClick(image.name)}
                  style={{
                    width: "50px",
                    height: "50px",
                    margin: "10px",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Index;
