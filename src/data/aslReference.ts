export interface ASLSign {
  label: string
  gestureKey: string
  handShape: string
  tip: string
  fingers: string
}

export interface ReferenceSection {
  title: string
  description: string
  color: string
  signs: ASLSign[]
}

export const ASL_REFERENCE: ReferenceSection[] = [
  {
    title: 'Quick responses',
    description: 'The most useful signs for everyday conversation',
    color: '#E1F5EE',
    signs: [
      {
        label: 'Yes', gestureKey: 'Thumb_Up',
        handShape: 'Make a fist. Extend your thumb straight up.',
        fingers: 'Thumb extended, all others curled',
        tip: 'Same as a thumbs-up in everyday life — universal and easy',
      },
      {
        label: 'No', gestureKey: 'Thumb_Down',
        handShape: 'Make a fist. Point your thumb straight down.',
        fingers: 'Thumb pointing down, all others curled',
        tip: 'Mirror of Yes — point down firmly and hold steady',
      },
      {
        label: 'Stop', gestureKey: 'Open_Palm',
        handShape: 'Hold your hand flat, palm facing outward, fingers together.',
        fingers: 'All 5 fingers extended and together, palm forward',
        tip: 'Like saying halt — push your palm toward the camera',
      },
      {
        label: 'Wait', gestureKey: 'Closed_Fist',
        handShape: 'Curl all fingers into a tight fist, thumb over fingers.',
        fingers: 'All fingers curled, thumb resting across them',
        tip: 'Hold the fist still and steady facing forward',
      },
      {
        label: 'Hello', gestureKey: 'Victory',
        handShape: 'Extend your index and middle fingers in a V shape. Keep others curled.',
        fingers: 'Index and middle extended, ring and pinky curled, thumb tucked',
        tip: 'Peace sign — one of the most recognized gestures worldwide',
      },
      {
        label: 'I love you', gestureKey: 'ILoveYou',
        handShape: 'Extend your thumb, index finger, and pinky. Curl middle and ring fingers.',
        fingers: 'Thumb + index + pinky extended, middle + ring curled',
        tip: 'Combines I (pinky), L (thumb+index), and Y (thumb+pinky) into one sign',
      },
      {
        label: 'One moment', gestureKey: 'Pointing_Up',
        handShape: 'Point your index finger straight up. Curl all other fingers.',
        fingers: 'Index finger extended straight up, all others curled',
        tip: 'Like saying just a second — hold the finger up and still',
      },
    ],
  },
  {
    title: 'Alphabet — A to F',
    description: 'Spell any word letter by letter in Spell mode',
    color: '#E6F1FB',
    signs: [
      {
        label: 'A', gestureKey: 'ASL_A',
        handShape: 'Make a fist with your thumb resting beside your index finger, not over it.',
        fingers: 'All fingers curled, thumb alongside — not tucked under',
        tip: 'Very similar to S but thumb sits beside the fist, not across it',
      },
      {
        label: 'B', gestureKey: 'ASL_B',
        handShape: 'Hold all four fingers straight up together. Tuck your thumb across your palm.',
        fingers: 'All 4 fingers extended upward, thumb folded across palm',
        tip: 'Flat vertical hand — fingers must be pressed together',
      },
      {
        label: 'C', gestureKey: 'ASL_C',
        handShape: 'Curve all your fingers and thumb into a C shape, like holding a cup.',
        fingers: 'All fingers curved, thumb curved — open C gap between thumb and fingers',
        tip: 'Imagine gripping a large mug — that natural curve is the C',
      },
      {
        label: 'D', gestureKey: 'ASL_D',
        handShape: 'Point your index finger up. Touch your middle, ring, and pinky tips to your thumb tip.',
        fingers: 'Index up, other three fingertips touching thumb tip',
        tip: 'The circle of three fingers + thumb makes the round part of the D',
      },
      {
        label: 'E', gestureKey: 'ASL_E',
        handShape: 'Bend all your fingers down so the tips touch your palm. Thumb tucks under.',
        fingers: 'All fingertips bent to touch palm, thumb tucked underneath',
        tip: 'Looks like a claw — all nails facing you',
      },
      {
        label: 'F', gestureKey: 'ASL_F',
        handShape: 'Touch your index fingertip to your thumb tip. Extend middle, ring, and pinky up.',
        fingers: 'Index + thumb form a circle, three fingers extended up',
        tip: 'The OK symbol with three fingers standing — circle forms the loop of F',
      },
    ],
  },
  {
    title: 'Alphabet — G to M',
    description: 'Continue spelling with the middle of the alphabet',
    color: '#EEEDFE',
    signs: [
      {
        label: 'G', gestureKey: 'ASL_G',
        handShape: 'Point your index finger sideways (horizontally). Extend thumb out parallel.',
        fingers: 'Index and thumb pointing sideways, others curled',
        tip: 'Hand points to the side like you are gesturing left or right',
      },
      {
        label: 'H', gestureKey: 'ASL_H',
        handShape: 'Point your index and middle fingers sideways together, parallel to the floor.',
        fingers: 'Index + middle extended horizontally, ring + pinky + thumb curled',
        tip: 'Like G but with two fingers — both point sideways together',
      },
      {
        label: 'I', gestureKey: 'ASL_I',
        handShape: 'Raise only your pinky finger. Curl all others including thumb.',
        fingers: 'Pinky only extended, all others curled',
        tip: 'Pinky up — the smallest finger makes the thinnest letter',
      },
      {
        label: 'K', gestureKey: 'ASL_K',
        handShape: 'Extend index and middle fingers in a V. Bring thumb up between them.',
        fingers: 'Index + middle in V shape, thumb up between them, ring + pinky curled',
        tip: 'Like Victory/Hello but with the thumb poking up between the two fingers',
      },
      {
        label: 'L', gestureKey: 'ASL_L',
        handShape: 'Point your index finger straight up. Extend your thumb out to the side. Make an L shape.',
        fingers: 'Index up, thumb out to side, middle + ring + pinky curled',
        tip: 'The most literal sign in ASL — your hand makes the letter L shape',
      },
      {
        label: 'M', gestureKey: 'ASL_M',
        handShape: 'Tuck your index, middle, and ring fingers over your thumb. Pinky curled in.',
        fingers: 'Three fingers folded over thumb, all curled down',
        tip: 'Three fingers = three humps of the letter M',
      },
    ],
  },
  {
    title: 'Alphabet — N to Z',
    description: 'Complete the alphabet',
    color: '#FAECE7',
    signs: [
      {
        label: 'N', gestureKey: 'ASL_N',
        handShape: 'Tuck your index and middle fingers over your thumb. Ring and pinky curled.',
        fingers: 'Two fingers folded over thumb',
        tip: 'Like M but only two fingers — two humps of the letter N',
      },
      {
        label: 'O', gestureKey: 'ASL_O',
        handShape: 'Curve all fingers and thumb to meet at the tips, forming a round O shape.',
        fingers: 'All fingertips touching thumb tip in a circle',
        tip: 'Imagine holding a small ball — that rounded shape is the O',
      },
      {
        label: 'R', gestureKey: 'ASL_R',
        handShape: 'Extend index and middle fingers, then cross them over each other.',
        fingers: 'Index and middle crossed, others curled',
        tip: 'Crossed fingers — like wishing for good luck',
      },
      {
        label: 'S', gestureKey: 'ASL_S',
        handShape: 'Make a fist with your thumb folded across the front of all your fingers.',
        fingers: 'All fingers curled, thumb across the front',
        tip: 'Tight fist with thumb over fingers — different from A where thumb is beside',
      },
      {
        label: 'U', gestureKey: 'ASL_U',
        handShape: 'Extend your index and middle fingers straight up, side by side and touching.',
        fingers: 'Index + middle extended together upward, others curled',
        tip: 'Two fingers pressed together form the two sides of the U',
      },
      {
        label: 'W', gestureKey: 'ASL_W',
        handShape: 'Extend index, middle, and ring fingers. Curl your pinky and tuck your thumb.',
        fingers: 'Three middle fingers extended, thumb + pinky curled',
        tip: 'Three fingers spread slightly — three points of the letter W',
      },
      {
        label: 'Y', gestureKey: 'ASL_Y',
        handShape: 'Extend your thumb and pinky finger. Curl your index, middle, and ring fingers.',
        fingers: 'Thumb + pinky extended, three middle fingers curled',
        tip: 'The shaka / hang loose sign — also means Y in ASL',
      },
    ],
  },
  {
    title: 'Numbers 0–5',
    description: 'Count and use numbers in conversation',
    color: '#EAF3DE',
    signs: [
      {
        label: '0', gestureKey: 'ASL_0',
        handShape: 'Same as the letter O — curve all fingertips to meet your thumb in a circle.',
        fingers: 'All fingertips touching thumb in a rounded O',
        tip: 'Zero and O use the same handshape in ASL',
      },
      {
        label: '1', gestureKey: 'ASL_1',
        handShape: 'Point only your index finger straight up. All other fingers and thumb curled.',
        fingers: 'Index only extended upward',
        tip: 'One finger = number one. As natural as it gets.',
      },
      {
        label: '2', gestureKey: 'ASL_2',
        handShape: 'Extend index and middle fingers in a V, palm facing you.',
        fingers: 'Index + middle extended, others curled',
        tip: 'Two fingers up, palm toward you — different from V/Hello which faces outward',
      },
      {
        label: '3', gestureKey: 'ASL_3',
        handShape: 'Extend your thumb, index, and middle fingers. Curl ring and pinky.',
        fingers: 'Thumb + index + middle extended',
        tip: 'Three fingers spread out — thumb counts too in ASL numbers',
      },
      {
        label: '4', gestureKey: 'ASL_4',
        handShape: 'Extend all four fingers. Tuck your thumb across your palm.',
        fingers: 'All 4 fingers extended, thumb tucked',
        tip: 'Four fingers standing — thumb hides behind',
      },
      {
        label: '5', gestureKey: 'ASL_5',
        handShape: 'Spread all five fingers wide open, palm facing forward.',
        fingers: 'All 5 fingers extended and spread',
        tip: 'Wide open hand — high five position',
      },
    ],
  },
  {
    title: 'Numbers 6–9',
    description: 'Complete your number vocabulary',
    color: '#FAEEDA',
    signs: [
      {
        label: '6', gestureKey: 'ASL_6',
        handShape: 'Touch your pinky tip to your thumb tip. Extend index, middle, and ring fingers.',
        fingers: 'Pinky + thumb touching, three fingers extended',
        tip: 'The touching fingers form a small circle while three stand up',
      },
      {
        label: '7', gestureKey: 'ASL_7',
        handShape: 'Touch your ring finger tip to your thumb tip. Other fingers extended.',
        fingers: 'Ring + thumb touching, index + middle + pinky extended',
        tip: 'Same idea as 6 but the ring finger touches the thumb instead',
      },
      {
        label: '8', gestureKey: 'ASL_8',
        handShape: 'Touch your middle finger tip to your thumb tip. Other fingers extended.',
        fingers: 'Middle + thumb touching, index + ring + pinky extended',
        tip: 'The touching pair moves inward with each number from 6 to 8',
      },
      {
        label: '9', gestureKey: 'ASL_9',
        handShape: 'Touch your index finger tip to your thumb tip. Other fingers extended.',
        fingers: 'Index + thumb forming a circle, others extended',
        tip: 'Like the letter F but used in number context',
      },
    ],
  },
  {
    title: 'Common phrases',
    description: 'High-frequency signs for real conversations',
    color: '#FBEAF0',
    signs: [
      {
        label: 'Please', gestureKey: 'ASL_PLEASE',
        handShape: 'Hold your flat open hand on your chest, palm facing your body. Move it in a small circle.',
        fingers: 'All fingers extended, palm flat against chest',
        tip: 'Rubbing your heart — genuinely polite, used constantly in ASL',
      },
      {
        label: 'Thank you', gestureKey: 'ASL_THANKYOU',
        handShape: 'Touch your fingertips to your chin with a flat hand. Move your hand forward and slightly down.',
        fingers: 'Flat hand, fingers together, tips touching chin then moving out',
        tip: 'Like blowing a kiss forward — gratitude goes outward',
      },
      {
        label: 'Sorry', gestureKey: 'ASL_SORRY',
        handShape: 'Make a fist. Rub it in a circle on your chest.',
        fingers: 'Closed fist rubbing on chest',
        tip: 'Rubbing your heart area = I\'m sorry from the heart',
      },
      {
        label: 'Help', gestureKey: 'ASL_HELP',
        handShape: 'Make a thumbs-up with one hand. Place it on your open flat other palm. Lift both hands up together.',
        fingers: 'Thumbs-up hand resting on flat palm, both moving upward',
        tip: 'One hand lifting the other = giving help, lifting someone up',
      },
      {
        label: 'More', gestureKey: 'ASL_MORE',
        handShape: 'Bring both hands together with fingertips touching thumbs on each hand. Tap fingertips together twice.',
        fingers: 'Both hands: fingertips pinched to thumb, tapping together',
        tip: 'The tapping motion means give me more of that',
      },
      {
        label: 'Finished', gestureKey: 'ASL_FINISHED',
        handShape: 'Hold both open hands up, palms facing you. Flip them outward quickly.',
        fingers: 'Both hands open, flip to palms-out position',
        tip: 'Shaking off your hands — all done, nothing left',
      },
      {
        label: 'Water', gestureKey: 'ASL_WATER',
        handShape: 'Extend your index, middle, and ring fingers in a W shape. Tap them to your chin twice.',
        fingers: 'W handshape tapping chin',
        tip: 'W for Water — tap where you drink from',
      },
      {
        label: 'Eat', gestureKey: 'ASL_EAT',
        handShape: 'Bring all fingertips together to a point. Tap them to your mouth.',
        fingers: 'All fingertips pinched together, touching lips',
        tip: 'Mimics putting food in your mouth — completely intuitive',
      },
      {
        label: 'Pain / Hurt', gestureKey: 'ASL_PAIN',
        handShape: 'Point both index fingers at each other and twist them toward each other twice.',
        fingers: 'Both index fingers pointing, twisting inward',
        tip: 'The twisting motion shows something sharp and unpleasant',
      },
      {
        label: 'Bathroom', gestureKey: 'ASL_BATHROOM',
        handShape: 'Make the letter T handshape. Shake it side to side.',
        fingers: 'Thumb between index and middle fingers, shaking',
        tip: 'T for toilet — universal urgent signal',
      },
    ],
  },
]

export const TOTAL_SIGNS = ASL_REFERENCE.reduce((sum, s) => sum + s.signs.length, 0)
