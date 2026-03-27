export type Answer = {
  value: string;
  points: number;
};

export type Question = {
  text: string;
  answers: Answer[];
};

const questions: Question[] = [
  {
    text: "Name something people do to prepare for a hurricane.",
    answers: [
      { value: "Board up windows", points: 100 },
      { value: "Stock up on food", points: 85 },
      { value: "Buy batteries", points: 70 },
      { value: "Fill up on gas", points: 55 },
      { value: "Evacuate", points: 40 },
      { value: "Fill bathtub with water", points: 25 },
    ],
  },
  {
    text: "Name something you'd find in a grandma's purse.",
    answers: [
      { value: "Candy", points: 100 },
      { value: "Tissues", points: 90 },
      { value: "Coupons", points: 75 },
      { value: "Lipstick", points: 55 },
      { value: "Photos", points: 35 },
      { value: "Reading glasses", points: 20 },
    ],
  },
  {
    text: "Name a reason someone might call in sick to work.",
    answers: [
      { value: "Flu", points: 100 },
      { value: "Hangover", points: 80 },
      { value: "Family emergency", points: 65 },
      { value: "Doctor's appointment", points: 50 },
      { value: "Mental health day", points: 30 },
      { value: "Car trouble", points: 15 },
    ],
  },
  {
    text: "Name something people do at a cookout.",
    answers: [
      { value: "Grill burgers", points: 100 },
      { value: "Play music", points: 85 },
      { value: "Play games", points: 70 },
      { value: "Drink beer", points: 55 },
      { value: "Dance", points: 35 },
      { value: "Take photos", points: 15 },
    ],
  },
];

export default questions;