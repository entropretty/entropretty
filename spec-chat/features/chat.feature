Feature: AI Chat Assistant
  Users can interact with an AI assistant to create and modify
  procedural generative art algorithms in the editor.

  Related specs: [Data Model](../data-model.md), [Components](../design/components.md)

  Background:
    Given the user is on the create page
    And the editor contains some initial code

  # === Tab Navigation ===

  Scenario: User opens AI chat tab
    Given the user is on the Code tab
    When the user clicks the "AI" tab
    Then the AI chat interface is displayed
    And the welcome message is shown
    And suggested prompts are visible

  Scenario: Suggested prompts adapt to editor state
    Given the editor contains only the default initial code
    When the user opens the AI tab
    Then the suggested prompts include "Create a geometric mandala pattern"
    And the suggested prompts include "Help me understand the seed system"
    But the suggested prompts do NOT include "Make my design more tattoo-friendly"

  Scenario: Suggested prompts show tattoo option when custom code exists
    Given the editor contains custom user code
    When the user opens the AI tab
    Then the suggested prompts include "Make my design more tattoo-friendly"

  # === Sending Messages ===

  Scenario: User sends a message to the AI
    Given the user is on the AI tab
    When the user types "Create a simple circle pattern" in the composer
    And the user clicks the send button
    Then the user message appears in the chat
    And a loading indicator is shown
    And the composer is cleared

  Scenario: User sends message with Enter key
    Given the user is on the AI tab
    When the user types "Add some randomness" in the composer
    And the user presses Enter
    Then the message is sent to the AI

  Scenario: User clicks a suggested prompt
    Given the user is on the AI tab
    And the welcome screen is showing
    When the user clicks "Create a geometric mandala pattern"
    Then "Create a geometric mandala pattern" is sent as a message
    And the AI begins responding

  # === AI Responses ===

  Scenario: AI responds with code
    Given the user has sent a message requesting code
    When the AI responds with an explanation and code
    Then the AI's explanation is displayed in the chat
    And the code is automatically applied to the editor
    And the preview updates to show the new algorithm
    And a history checkpoint is created

  Scenario: AI responds without code
    Given the user has sent a question about the seed system
    When the AI responds with only an explanation
    Then the AI's explanation is displayed in the chat
    And the editor code remains unchanged
    And no history checkpoint is created

  Scenario: AI response streams progressively
    Given the user has sent a message
    When the AI is generating a response
    Then the response text appears progressively as it streams
    And the user can see the response building in real-time

  # === Context Awareness ===

  Scenario: AI receives current editor code as context
    Given the editor contains a spiral drawing algorithm
    When the user asks "Add more spirals to my design"
    Then the AI's response references the existing spiral code
    And the generated code builds upon the existing implementation

  Scenario: AI receives current error as context
    Given the editor contains code with a syntax error
    And the error "Unexpected token" is displayed
    When the user opens the AI tab
    And the user sends any message
    Then the AI acknowledges the error in its response
    And suggests a fix for the syntax error

  Scenario: AI receives seed type as context
    Given the seed type is set to "ProceduralPersonal"
    When the user asks "Create a pattern"
    Then the AI response may reference the personal seed type
    And the generated code works with the current seed type

  # === Error Handling ===

  Scenario: Network error during AI request
    Given the user has sent a message
    When the network request fails
    Then an error message is displayed in the chat
    And the user can retry by sending another message

  Scenario: AI generates invalid JavaScript
    Given the user has sent a message
    When the AI responds with syntactically invalid code
    Then the code is still applied to the editor
    And the script error appears in the error panel
    And the user can ask the AI to fix the error

  # === Multi-turn Conversation ===

  Scenario: User has a multi-turn conversation
    Given the user has received an AI response with code
    When the user asks "Now add some color variation"
    Then the AI receives the updated editor code as context
    And the AI builds upon the previous response
    And the new code is applied to the editor
