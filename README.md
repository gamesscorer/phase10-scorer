# Phase 10 Scorer

A beautiful, modern web application for tracking scores and phases in the Phase 10 card game.

## Features

- **Player Management**: Support for 2-6 players
- **Dealer Rotation**: Automatic dealer rotation based on player order
- **Phase Tracking**: Track each player's current phase (1-10)
- **Score Tracking**: Accumulate scores across rounds
- **Win Detection**: Automatically detects when a player completes Phase 10
- **Tie Breaking**: If multiple players complete Phase 10, the lowest score wins

## How to Use

1. **Setup**: Enter player names in order (2-6 players). The order determines dealer rotation.
2. **Play**: Each round, the dealer rotates automatically (Round 1 = Player 1, Round 2 = Player 2, etc.)
3. **End Round**: Click "End Round" after each round to enter scores
4. **Enter Scores**: For each player, enter their score and whether they completed their current phase
5. **Win**: The first player to complete Phase 10 wins. If multiple players complete it, the lowest score wins.

## The 10 Phases

1. Phase 1: 2 sets of 3
2. Phase 2: 1 set of 3 + 1 run of 4
3. Phase 3: 1 set of 4 + 1 run of 4
4. Phase 4: 1 run of 7
5. Phase 5: 1 run of 8
6. Phase 6: 1 run of 9
7. Phase 7: 2 sets of 4
8. Phase 8: 7 cards of 1 color
9. Phase 9: 1 set of 5 + 1 set of 2
10. Phase 10: 1 set of 5 + 1 set of 3

## Hosting on GitHub Pages

1. Create a new repository on GitHub
2. Push all files to the repository
3. Go to Settings → Pages
4. Select the branch (usually `main` or `master`)
5. Select `/ (root)` as the source
6. Click Save
7. Your app will be available at `https://yourusername.github.io/repository-name/`

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and responsive design
- `script.js` - Game logic and state management
- `README.md` - This file

## Browser Support

Works on all modern browsers (Chrome, Firefox, Safari, Edge). No dependencies required - pure HTML, CSS, and JavaScript.
