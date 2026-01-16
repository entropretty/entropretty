Feature: File Attachments
  Users can attach image files to their messages for the AI
  to analyze and reference when generating code.

  Related specs: [Data Model](../data-model.md), [Error Handling](../error-handling.md)

  Background:
    Given the user is on the AI tab
    And the composer is visible

  # === Adding Attachments ===

  Scenario: User attaches an image via button
    Given the user has not attached any files
    When the user clicks the attach button
    And the user selects an image file (PNG, 500KB)
    Then the image thumbnail appears in the composer
    And the attachment count shows "1"

  Scenario: User attaches an image via drag and drop
    Given the composer is visible
    When the user drags an image file onto the composer
    And drops the file
    Then the image is added as an attachment
    And a thumbnail preview is shown

  Scenario: User attaches multiple images
    Given the user has attached 2 images
    When the user attaches another image
    Then all 3 thumbnails are visible
    And the attachment count shows "3"

  Scenario: User removes an attachment
    Given the user has attached an image
    When the user clicks the remove button on the thumbnail
    Then the attachment is removed
    And the thumbnail disappears

  # === Attachment Validation ===

  Scenario: Reject non-image file types
    Given the user clicks the attach button
    When the user selects a PDF file
    Then an error message is shown: "Only image files are supported"
    And the file is not attached

  Scenario: Reject file exceeding size limit
    Given the user clicks the attach button
    When the user selects an image larger than 10MB
    Then an error message is shown: "File size must be under 10MB"
    And the file is not attached

  Scenario: Reject when attachment limit reached
    Given the user has attached 5 images (maximum)
    When the user tries to attach another image
    Then an error message is shown: "Maximum 5 attachments allowed"
    And the new file is not attached

  Scenario: Accept various image formats
    When the user attaches images of different formats
    Then PNG files are accepted
    And JPG/JPEG files are accepted
    And GIF files are accepted
    And WebP files are accepted

  # === Sending Messages with Attachments ===

  Scenario: Send message with attachment
    Given the user has typed "Recreate this pattern"
    And the user has attached an image
    When the user sends the message
    Then the message shows the attached image
    And the AI receives both text and image
    And the attachments are cleared from the composer

  Scenario: Send message with only attachment
    Given the user has attached an image
    And the message text is empty
    When the user sends the message
    Then the message is sent with just the image
    And the AI can analyze the image

  Scenario: AI references attached image in response
    Given the user has sent "Create something like this" with an image
    When the AI responds
    Then the AI's response references details from the image
    And the generated code attempts to recreate the visual

  # === Attachment Display ===

  Scenario: Attachment thumbnail in composer
    Given the user has attached an image
    Then a thumbnail preview is shown (max 60x60 pixels)
    And the filename is displayed (truncated if long)
    And a remove button is visible on the thumbnail

  Scenario: Attachment in sent message
    Given the user has sent a message with an image
    Then the message shows the image (larger than thumbnail)
    And clicking the image opens it in full size (modal or new tab)

  # === Memory Management ===

  Scenario: Attachments cleared after sending
    Given the user has attached 3 images
    When the user sends the message
    Then the composer attachment area is cleared
    And the user can attach new files for the next message

  Scenario: Attachments not persisted
    Given the user has attached an image
    When the user refreshes the page
    Then the attachment is no longer present
    And the composer is empty

  # === Error Scenarios ===

  Scenario: Attachment fails to load
    Given the user selects a corrupted image file
    When the file fails to read
    Then an error message is shown: "Failed to load file"
    And the file is not attached

  Scenario: Network error with attachment
    Given the user sends a message with an attachment
    When the network request fails
    Then an error message is shown in the chat
    And the original message with attachment is still visible
    And the user can retry
