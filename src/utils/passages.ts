export interface Passage {
  id: string;
  title: string;
  category: 'Short' | 'Medium' | 'Long';
  text: string;
}

export const PASSAGES: Passage[] = [
  {
    id: 'p1',
    title: 'The Grass Invoice',
    category: 'Short',
    text: 'Every keystroke saved is a moment stolen from nature. You thought typing eighty words per minute was an achievement, but Mother Earth has issued a mandatory invoice. Prepare your thumb.'
  },
  {
    id: 'p2',
    title: 'Productivity Paradox',
    category: 'Short',
    text: 'Efficiency is a dangerous illusion. By completing your four hours of daily typing in two hours, you have created a temporal surplus. That surplus must now be spent touching lawn greenery.'
  },
  {
    id: 'p3',
    title: 'Mechanical Clack',
    category: 'Medium',
    text: 'Your mechanical keyboard switches click and clack with terrifying velocity. Outside your window, lawn blades sway in silent anticipation. They do not care about your mechanical tactile feedback. They only demand your physical presence on the turf.'
  },
  {
    id: 'p4',
    title: 'The Photosynthesis Tax',
    category: 'Medium',
    text: 'While you were mastering touch-typing and shortcut keys, blades of Bermuda grass were quietly storing solar energy. Now, nature requires you to ground yourself. Touch the green blade. Feel the chlorophyll. Absorb the humbling reality of your fast fingers.'
  },
  {
    id: 'p5',
    title: 'Keyboard vs Lawn',
    category: 'Long',
    text: 'Modern humanity spends entire lifetimes staring at liquid crystal displays and tapping plastic keycaps. We optimize our typing speed to conquer inbox zero, write code faster, and draft emails before lunch. Yet every second saved is a second subtracted from quiet contemplation outdoors. Grass Debt restores ecological equilibrium. Press hold and repent.'
  },
  {
    id: 'p6',
    title: 'Existential Turf',
    category: 'Long',
    text: 'What is a fast typist if not a person racing toward an empty screen? You cleared your queue in record time. Congratulations. Now you are banned from typing until you have given equal time back to the soil. Do not attempt to close this browser tab. The grass knows.'
  }
];

export const FUNNY_GRASS_MESSAGES = [
  "You saved time. Now give it back.",
  "Nature has sent you an invoice.",
  "Your keyboard is proud of you. The lawn is patient.",
  "The grass is waiting.",
  "Productivity has consequences.",
  "You thought being fast would help?",
  "Touch. The. Grass.",
  "Your debt is growing. Just like grass.",
  "Stop typing. Start touching grass.",
  "Chlorophyll appreciates your cooperation.",
  "Do not let go. The turf senses weakness.",
  "This is what happens when you skip touch-typing breaks.",
  "Somewhere a dicky bird is watching you hold this screen.",
  "Ground yourself. Literally."
];
