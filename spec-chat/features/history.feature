Feature: Editor History Navigation
  Users can navigate through checkpoints of their editor code,
  allowing them to undo AI changes or return to previous versions.

  Related specs: [Data Model](../data-model.md), [Architecture](../architecture.md)

  Background:
    Given the user is on the create page
    And a session has been initialized

  # === Session Initialization ===

  Scenario: New session creates initial checkpoint
    Given the user navigates to the create page for the first time
    Then a new session ID is generated
    And the initial editor code is saved as the first checkpoint
    And the checkpoint source is marked as "initial"

  Scenario: Session persists on page refresh
    Given the user has made changes to the editor
    And checkpoints have been saved
    When the user refreshes the page
    Then the same session ID is used
    And the history is restored from localStorage
    And the editor shows the most recent checkpoint

  # === Checkpoint Creation ===

  Scenario: AI response creates checkpoint
    Given the user is on the AI tab
    When the AI responds with code that is applied
    Then a new checkpoint is created
    And the checkpoint source is marked as "ai"
    And the checkpoint contains the full new code
    And the history index advances to the new checkpoint

  Scenario: Checkpoints have timestamps
    Given a checkpoint is created
    Then the checkpoint includes a timestamp
    And the timestamp reflects when the code was applied

  # === History Navigation ===

  Scenario: User navigates back in history
    Given the history contains 3 checkpoints
    And the user is at checkpoint 3 (most recent)
    When the user clicks the back button
    Then the editor code changes to checkpoint 2
    And the preview updates to reflect the older code
    And the back button remains enabled
    And the forward button becomes enabled

  Scenario: User navigates forward in history
    Given the history contains 3 checkpoints
    And the user has navigated back to checkpoint 1
    When the user clicks the forward button
    Then the editor code changes to checkpoint 2
    And the preview updates accordingly

  Scenario: Back button disabled at start of history
    Given the user is at the first checkpoint
    Then the back button is disabled
    And the forward button may be enabled if history exists

  Scenario: Forward button disabled at end of history
    Given the user is at the most recent checkpoint
    Then the forward button is disabled
    And the back button may be enabled if history exists

  Scenario: Single checkpoint disables both buttons
    Given the history contains only 1 checkpoint
    Then both back and forward buttons are disabled

  # === History and AI Interaction ===

  Scenario: AI receives code from current history position
    Given the user has navigated back to an older checkpoint
    When the user sends a message to the AI
    Then the AI receives the code from the current checkpoint
    And NOT the most recent checkpoint

  Scenario: New AI response after navigating back
    Given the history contains checkpoints [A, B, C]
    And the user has navigated back to checkpoint A
    When the AI responds with new code D
    Then a new checkpoint D is created
    And checkpoint D becomes the new most recent
    And the history is now [A, B, C, D]
    And the user is at checkpoint D

  # === History Limits ===

  Scenario: History is pruned when limit exceeded
    Given the history contains 100 checkpoints
    When a new checkpoint is created
    Then the oldest checkpoint is removed
    And the history contains 100 checkpoints
    And the most recent 100 checkpoints are preserved

  # === Visual Indicators ===

  Scenario: History position indicator
    Given the history contains 5 checkpoints
    And the user is at checkpoint 3
    Then a visual indicator shows "3 / 5" or similar
    And the user understands their position in history

  # === Edge Cases ===

  Scenario: Navigation does not create checkpoints
    Given the history contains 3 checkpoints
    When the user navigates back and forth
    Then no new checkpoints are created
    And the history still contains exactly 3 checkpoints

  Scenario: Empty localStorage on first visit
    Given the user has never visited before
    And localStorage has no session data
    When the user loads the create page
    Then a new session is created
    And the initial code checkpoint is saved
