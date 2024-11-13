// Define types

export type Option = {
  id: number;
  label: string;
  name: string;
  color?: string;
  url?: string;
};

export type CosmeticOption = {
  id: number;
  name: string;
  value: string;
  images?: Option[]; // Images are optional
  disabled?: boolean; // Disabled is optional
};

type CosmeticData = {
  id: number;
  name: string;
  icon: string;
  options: CosmeticOption[];
  shades: Option[];
  path: string;
};

// Cosmetics data with type validation
const cosmeticsData: CosmeticData[] = [
  {
    id: 1,
    name: "Lipstick",
    icon: "icons/lipstick.svg",
    options: [
      {
        id: 1,
        name: "MATTE",
        value: "MATTE",
        images: [],
      },
      {
        id: 2,
        name: "GLOSSY",
        value: "GLOSSY",
        images: [],
      },
      {
        id: 3,
        name: "CRAYON",
        value: "CRAYON",
        images: [],
      },
      {
        id: 4,
        name: "SHIMMER",
        value: "SHIMMER",
        images: [],
      },
    ],
    shades: [
      { id: 1, label: "Lipstick - Maroon", color: "#800000", name: "" },
      { id: 2, label: "Lipstick - DarkLavender", color: "#800080", name: "" },
      { id: 3, label: "Lipstick - Orange", color: "#AA0320", name: "" },
      { id: 4, label: "Lipstick - Maroonpink", color: "#7A2F48", name: "" },
      { id: 5, label: "Lipstick - Red", color: "#800000", name: "" },
      { id: 6, label: "Lipstick - Purple", color: "#9C2455", name: "" },
      { id: 7, label: "Lipstick - DarkRed", color: "#59130E", name: "" },
    ],
    path: "lipstick.png",
  },
  {
    id: 2,
    name: "Eye",
    icon: "icons/eye.svg",
    options: [
      {
        id: 1,
        name: "EYE BROW",
        value: "eyebrow",
        images: [],
      },
      {
        id: 2,
        name: "EYE LINER",
        value: "eyeliner",
        images: [
          {
            id: 1,
            name: "pattern1",
            label: "eyeLinerPattern",
            url: "Eyeliner_2.png",
          },
          {
            id: 2,
            name: "pattern2",
            label: "eyeLinerPattern",
            url: "Eyeliner_3.png",
          },
          {
            id: 3,
            name: "pattern3",
            label: "eyeLinerPattern",
            url: "Eyeliner_1.png",
          },
        ],
      },
      {
        id: 3,
        name: "EYE SHADOW",
        value: "eyeshadow",
        images: [],
      },
      {
        id: 4,
        name: "KAJAL",
        value: "kajal",
        images: [
          {
            id: 1,
            name: "pattern1",
            label: "KajalPattern",
            url: "Kajal_1.png",
          },
          {
            id: 2,
            name: "pattern2",
            label: "KajalPattern",
            url: "Kajal_2.png",
          },
        ],
      },
    ],
    shades: [
      {
        id: 1,
        label: "EyeShadow - Purple",
        color: "#9C2455",
        name: "eyeshadow",
      },
      {
        id: 2,
        label: "EyeShadow - DarkRed",
        color: "#59130E",
        name: "eyeshadow",
      },
      { id: 3, label: "Eyebrow Pencil - Grey", color: "#808080", name: "all" },
      {
        id: 4,
        label: "EyeShadow - DarkLavender",
        color: "#800080",
        name: "eyeshadow",
      },
      {
        id: 5,
        label: "EyeShadow - Orange",
        color: "#AA0320",
        name: "eyeshadow",
      },
      {
        id: 6,
        label: "EyeShadow - Maroonpink",
        color: "#7A2F48",
        name: "eyeshadow",
      },
      { id: 7, label: "EyeShadow - Red", color: "#800000", name: "eyeshadow" },
    ],
    path: "eyebrow.png",
  },
  {
    id: 3,
    name: "Face",
    icon: "icons/face.svg",
    options: [
      {
        id: 1,
        name: "FOUNDATION",
        value: "foundation",
        images: [],
        disabled: true, // Optional property
      },
      {
        id: 2,
        name: "BLUSH",
        value: "blush",
        images: [],
        disabled: true, // Optional property
      },
    ],
    shades: [],
    path: "eyeShadow.png",
  },
];

export { cosmeticsData };
