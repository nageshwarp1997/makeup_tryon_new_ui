import "./index.css";
import { cosmeticsData, Option } from "./data";
import Header from "./components/Header";
import { Fragment, useState, useEffect } from "react";
import {
  CheckmarkIcon,
  CompareIcon,
  DownIcon,
  PhotoIcon,
  ResetIcon,
  UpIcon,
} from "./components/icon";
import { takeSnapShot } from "./main";

interface IndexProps {
  takeSnapShot: () => void;
  setMakeupState: (state: typeof window.makeupState) => void;
}

function Index(props: IndexProps) {
  const { setMakeupState } = props;

  const lipsTypes = ["matte", "shimmer", "glossy", "crayon"];

  const [selectedCosmetic, setSelectedCosmetic] = useState<string>(""); // "Lipstick", "Eye", "Face"
  const [appliedOptions, setAppliedOptions] = useState<string[]>([]);
  const [activeButton, setActiveButton] = useState<string>("");
  const [displayOptions, setDisplayOptions] = useState<Option[]>([]);
  const [state, setState] = useState<typeof window.makeupState>({
    lips: false,
    lipsType: "",
    eyebrow: false,
    eyeshadow: false,
    eyeliner: false,
    kajal: false,
    foundation: false,
    blush: false,
    eyeLinerPattern: "",
    KajalPattern: "",
    lipColor: [0, 0, 0, 0],
    eyebrowColor: [0, 0, 0, 15],
    eyeshadowColor: [0, 0, 0, 15],
  } as typeof window.makeupState);

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

  useEffect(() => {
    if (selectedCosmetic === "Lipstick") {
      const cosmetic = cosmeticsData.find((c) => c.name === selectedCosmetic);
      const lipColor = hexToRGBA(
        cosmetic?.shades[0]?.color as string
      ) as ColorTuple;
      setState((prevState) => {
        return { ...prevState, lips: true, lipColor: lipColor };
      });
    }
  }, [state.lipsType]);

  useEffect(() => {
    if (selectedCosmetic === "Eye") {
      const cosmetic = cosmeticsData.find((c) => c.name === selectedCosmetic);

      setState((prevState) => {
        return {
          ...prevState,
          eyeshadowColor: cosmetic?.shades[0]?.color,
        };
      });
    }
  }, [state.eyeshadow]);

  useEffect(() => {
    let rangeContainer = document.getElementById(
      "range-container"
    ) as HTMLInputElement;
    let rangeInput = document.getElementById("range") as HTMLInputElement;
    if (selectedCosmetic === "Lipstick" && state.lips) {
      rangeContainer.style.display = "block";

      if (!lipsTypes.some((type) => type === state.lipsType)) {
        rangeContainer.style.display = "none";
      }

      switch (state.lipsType) {
        case "matte": {
          rangeInput.value = "50";
          setState((prevState) => {
            return { ...prevState, rangeValue: 0.5 };
          });
          break;
        }
        case "shimmer":
        case "glossy": {
          rangeInput.value = "80";
          setState((prevState) => {
            return { ...prevState, rangeValue: 0.8 };
          });
          break;
        }
        case "crayon": {
          rangeInput.value = "40";
          setState((prevState) => {
            return { ...prevState, rangeValue: 0.4 };
          });
          break;
        }

        default: {
          rangeInput.value = "50";
          setState((prevState) => {
            return { ...prevState, rangeValue: 0.5 };
          });
        }
      }
    } else {
      rangeContainer.style.display = "none";
      setState((prevState) => {
        return { ...prevState, rangeValue: 0.5 };
      });
    }
  }, [selectedCosmetic, state.lipsType, state.lips]);

  useEffect(() => {
    setMakeupState(state);
  }, [state]);

  const handleOptionsSelection = (cosmeticName: string, optionName: string) => {
    const cosmetic = cosmeticsData.find((c) => c.name === cosmeticName);

    if (selectedCosmetic === "Lipstick") {
      if (optionName === state.lipsType) {
        setDisplayOptions([]);
      } else {
        setDisplayOptions(cosmetic?.shades || []);
      }
    } else if (selectedCosmetic === "Eye") {
      if (optionName === "eye shadow") {
        setDisplayOptions(cosmetic?.shades || []);
      } else if (optionName === "eye liner") {
        if (state.eyeliner) {
          setDisplayOptions([]);
        } else {
          setDisplayOptions(
            cosmetic?.options.find((o) => o.name === optionName)?.images || []
          );
        }
      } else if (optionName === "kajal") {
        if (state.kajal) {
          setDisplayOptions([]);
        } else {
          setDisplayOptions(
            cosmetic?.options.find((o) => o.name === optionName)?.images || []
          );
        }
      } else {
        setDisplayOptions([]);
      }
    } else {
      setDisplayOptions(
        cosmetic?.options.find((o) => o.name === optionName)?.images || []
      );
    }
  };

  const handleReset = () => {
    setState({
      lips: false,
      lipsType: "",
      eyebrow: false,
      eyeshadow: false,
      eyeliner: false,
      kajal: false,
      face: false,
      foundation: false,
      blush: false,
      KajalPattern: "",
      eyeLinerPattern: "",
      lipColor: state.lipColor,
      eyebrowColor: state.eyebrowColor,
      eyeshadowColor: state.eyeshadowColor,
      rangeValue: 0.5,
    });
    setSelectedCosmetic("");
    setDisplayOptions([]);
  };

  return (
    <div className="w-full h-full">
      {/* Header */}
      <Header />
      {/* Body */}
      <div className="w-full px-[4.5rem] flex justify-between gap-10 mt-5">
        {/* Left part */}
        <div className="min-w-[340px] max-w-[340px] 2xl:min-[450px] 2xl:max-w-[450px] w-full h-[calc(100vh-190px)] flex flex-col items-center justify-between gap-2.5  text-[#404040]">
          <div className="flex flex-col items-center gap-5 self-stretch h-full max-h-[60vh] overflow-y-scroll scrollbar-none">
            <div className="w-full flex flex-col gap-4">
              {cosmeticsData &&
                cosmeticsData.map((cosmetic) => (
                  <Fragment key={cosmetic?.id}>
                    <div
                      className={`w-full flex py-3 px-4 2xl:py-4 2xl:px-7 justify-between items-center self-stretch rounded-xl cursor-pointer ${
                        cosmetic?.name === selectedCosmetic
                          ? "active bg-[#F9E5D4] border-[2px] border-[#F9E5D4]"
                          : "border-[2px] border-[#F9EDE3] bg-white"
                      }`}
                      onClick={() => {
                        setSelectedCosmetic(
                          selectedCosmetic === cosmetic.name
                            ? ""
                            : cosmetic.name
                        );
                        setDisplayOptions(cosmetic?.shades || []);
                      }}
                    >
                      <span className="flex items-center gap-3 2xl:gap-5">
                        <img
                          src={cosmetic?.icon}
                          alt={cosmetic?.name}
                          className="w-6 h-6 2xl:w-8 2xl:h-8"
                        />
                        <p className="font-metropolis text-[18px] font-semibold leading-[27px]">
                          {cosmetic?.name}
                        </p>
                      </span>
                      <span className="flex items-center justify-center">
                        {cosmetic?.name === selectedCosmetic ? (
                          <UpIcon />
                        ) : (
                          <DownIcon />
                        )}
                      </span>
                    </div>
                    {cosmetic?.name === selectedCosmetic && (
                      <div className="w-full grid grid-cols-2 gap-3 text-center pb-2">
                        {cosmetic?.options?.map((option) => {
                          const isSelected: boolean =
                            selectedCosmetic === "Lipstick" &&
                            state.lipsType === option.value;

                          const isApplied: boolean = appliedOptions.includes(
                            option.name
                          );

                          return (
                            <button
                              className={`py-3 px-4 rounded-xl text-[16px] bg-[#FFFFFF80] font-metropolis font-semibold capitalize ${
                                isSelected ||
                                (isApplied && option?.name === activeButton)
                                  ? "border-[2px] border-[#D99D73] text-[#D99D73]"
                                  : "border-[2px] border-[#F9EDE3] text-[#4D4D4D]"
                              } bg-[#FFFFFF80] ${
                                option?.disabled
                                  ? "opacity-50 cursor-not-allowed"
                                  : "opacity-100 cursor-pointer"
                              }`}
                              key={option?.id}
                              onClick={() => {
                                if (!option?.disabled) {
                                  handleOptionsSelection(
                                    cosmetic?.name,
                                    option?.name
                                  );

                                  if (appliedOptions.includes(option.name)) {
                                    setActiveButton("");
                                  } else {
                                    setActiveButton((prev) =>
                                      prev === option?.name ? "" : option?.name
                                    );
                                  }

                                  // Update appliedOptions
                                  if (selectedCosmetic !== "Lipstick") {
                                    if (appliedOptions.includes(option.name)) {
                                      setAppliedOptions(
                                        appliedOptions.filter(
                                          (item) => item !== option.name
                                        )
                                      );
                                    } else {
                                      setAppliedOptions([
                                        ...appliedOptions,
                                        option.name,
                                      ]);
                                    }
                                  }

                                  if (selectedCosmetic === "Lipstick") {
                                    setState((prevState) => ({
                                      ...prevState,
                                      lipsType:
                                        state.lipsType === option.value
                                          ? ""
                                          : option.value,
                                    }));
                                  } else {
                                    if (
                                      ["eyeliner", "kajal"].includes(
                                        option.value
                                      )
                                    ) {
                                      setState((prevState) => ({
                                        ...prevState,
                                        [option.images[0].label]:
                                          option?.images[0].name,
                                        [option.value]: !state[option.value],
                                      }));
                                    } else {
                                      setState((prevState) => ({
                                        ...prevState,
                                        [option.value]: !state[option.value],
                                      }));
                                    }
                                  }
                                }
                              }}
                            >
                              <div className="w-full flex justify-between items-center">
                                {appliedOptions.includes(option?.name) ||
                                state.lipsType === option?.value ? (
                                  <>
                                    <p>{option?.name}</p>
                                    <CheckmarkIcon
                                      optionName={option?.name}
                                      activeButton={activeButton}
                                    />
                                  </>
                                ) : (
                                  <p>{option?.name}</p>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </Fragment>
                ))}
            </div>
          </div>
          <div
            className={`w-full flex py-3 px-4 2xl:py-4 2xl:px-7 justify-between items-center self-stretch rounded-xl bg-[#FFFFFF] cursor-pointer`}
            onClick={() => {
              takeSnapShot();
            }}
          >
            <p className="font-metropolis text-[18px] font-semibold leading-[27px]">
              Download
            </p>
            <PhotoIcon />
          </div>
        </div>
        {/* Right Part OR Video Section */}
        <div className="relative w-[70%] rounded-[40px] border-[12px] border-[#F9EDE3]">
          <div className="absolute w-full h-full inset-0 overflow-hidden -z-1">
            <img
              src="/images/placeholderImage.png"
              alt="Placeholder Image"
              className="h-full object-cover rounded-[28px] bg-transparent object-center "
            />
          </div>

          <div className="absolute top-0 right-3 flex flex-col justify-between items-between h-full py-5 px-3">
            <span
              className="flex justify-center items-center p-3 rounded-full bg-white z-50 cursor-pointer"
              onClick={handleReset}
            >
              <ResetIcon />
            </span>
            <span className="flex justify-center items-center p-3 rounded-full bg-white z-[51] cursor-not-allowed opacity-50">
              <CompareIcon />
            </span>
          </div>
          {/* Check conditions for showing shades */}
          {((selectedCosmetic === "Lipstick" && state.lipsType) ||
            (selectedCosmetic === "Eye" && state.eyeshadow)) &&
            displayOptions.length > 0 && (
              <div className="z-50 w-full absolute left-0 bottom-4 px-[10%] py-4 flex flex-col">
                <div className="w-full overflow-x-scroll scrollbar-none flex justify-center gap-6">
                  {displayOptions?.map((option, index) => {
                    if (option.color) {
                      const rgbaColor = hexToRGBA(option.color) as ColorTuple;
                      return (
                        <div
                          key={index}
                          className={`flex items-center justify-center min-w-[48px] min-h-[48px] cursor-pointer rounded-full ${
                            (
                              selectedCosmetic === "Lipstick"
                                ? state.lipColor.join("") === rgbaColor.join("")
                                : state.eyeshadowColor === option.color
                            )
                              ? "border-[2px] border-[#FFFFFF]"
                              : "border-[2px] border-[#cecdcd]"
                          }`}
                          onClick={() => {
                            if (selectedCosmetic === "Lipstick") {
                              setState((prevState) => ({
                                ...prevState,
                                lips: true,
                                lipColor: rgbaColor,
                              }));
                            } else {
                              setState((prevState: any) => ({
                                ...prevState,
                                eyeshadow: true,
                                eyeshadowColor: option.color,
                              }));
                            }
                          }}
                          style={{
                            backgroundColor: option.color,
                          }}
                        ></div>
                      );
                    }
                  })}
                </div>
              </div>
            )}

          {selectedCosmetic !== "Lipstick" && displayOptions.length > 0 && (
            <div className="z-50 w-full absolute left-0 bottom-4 px-[10%] py-4 flex flex-col">
              <div className="w-full overflow-x-scroll scrollbar-none flex justify-center gap-6">
                {displayOptions?.map((option, index) => {
                  if (option.url) {
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          setState((prevState) => ({
                            ...prevState,
                            [option.label]: option.name,
                          }));
                        }}
                        className={`border flex items-center justify-center w-[48px] h-[48px] cursor-pointer rounded-full p-1 ${
                          state[option.label] === option.name
                            ? "border-[2px] border-[#FFFFFF90] bg-[#FFFFFF]"
                            : "border-[2px] border-[#FFFFFF30] bg-[#FFFFFF90]"
                        }`}
                      >
                        <img
                          src={option.url}
                          className="object-contain cursor-pointer"
                        />
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )}
          <div className="absolute bottom-0 w-full bg-black h-10 blur-3xl -rotate-[8deg]"></div>
          <div className="absolute bottom-0 w-full bg-black h-10 blur-3xl rotate-[8deg]"></div>
        </div>
      </div>
    </div>
  );
}

export default Index;
