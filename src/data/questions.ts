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
    text: "Who is the most notable Black cartoon character?",
    answers: [
      { value: "Huey or Riley Freeman (The Boondocks)", points: 57 },
      { value: "Miles Morales (Marvel)", points: 14 },
      { value: "Cyborg (Teen Titans)", points: 11 },
      { value: "Numbuh 5 (Codename: KND)", points: 7 },
      { value: "Virgil Hawkins/Static Shock (Static Shock)", points: 7 },
      { value: "Piccolo (Dragon Ball Z)", points: 4 },
    ],
  },
  {
    text: "If you could pick any superpower, what would you pick?",
    answers: [
      { value: "Flight / Teleportation", points: 32 },
      { value: "Telekinesis / Mind-reading", points: 25 },
      { value: "Elemental (Fire/Ice/Water)", points: 17 },
      { value: "Invisibility", points: 14 },
      { value: "Super Speed", points: 10 },
      { value: "Super Strength", points: 2 },
    ],
  },
  {
    text: "Name a game that Black people take way too seriously.",
    answers: [
      { value: "Spades", points: 43 },
      { value: "Uno", points: 25 },
      { value: "Dominos", points: 11 },
      { value: "2k / Madden / Fifa", points: 11 },
      { value: "Musical chairs", points: 7 },
      { value: "Basketball", points: 3 },
    ],
  },
  {
    text: "Name a reason that you might get kicked out the BLERD BBQ.",
    answers: [
      { value: "Fucking up the mac & cheese", points: 50 },
      { value: "Dropping a spoiler", points: 21 },
      { value: "Packing a to-go plate early", points: 10 },
      { value: "Getting too lit", points: 10 },
      { value: "Dub over sub", points: 7 },
      { value: "Cheating in a game", points: 2 },
    ],
  },
  {
    text: "Name a famous person named 'Michael'.",
    answers: [
      { value: "Michael Jackson", points: 67 },
      { value: "Michael Jordan", points: 17 },
      { value: "Michael B. Jordan", points: 10 },
      { value: "Michael Blackson", points: 3 },
      { value: "Mike Tyson", points: 2 },
      { value: "Michael Phelps", points: 1 },
    ],
  },
  {
    text: "Other than feet, name something that runs.",
    answers: [
      { value: "Engine / Car", points: 36 },
      { value: "Nose", points: 21 },
      { value: "Water / Toilet", points: 18 },
      { value: "Refrigerator", points: 18 },
      { value: "Tights / Pantyhose", points: 7 },
    ],
  },
  {
    text: "Name an occasion for which you might wear your lucky underwear.",
    answers: [
      { value: "Job Interview", points: 39 },
      { value: "Hot Date", points: 25 },
      { value: "Exam / Finals", points: 17 },
      { value: "Casino / Gambling", points: 14 },
      { value: "Sporting Event", points: 3 },
      { value: "Wedding", points: 2 },
    ],
  },
  {
    text: "Name something that people lie about on a first date.",
    answers: [
      { value: "Bodycount", points: 36 },
      { value: "How “over” their ex they are", points: 25 },
      { value: "How often they go to the gym", points: 14 },
      { value: "Their age", points: 11 },
      { value: "Their job/salary/income", points: 11 },
      { value: "How much they drink", points: 3 },
    ],
  },
];

export default questions;