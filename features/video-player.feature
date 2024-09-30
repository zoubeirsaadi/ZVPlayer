Feature: Video Player

  Scenario: The player loads the video
    Given the standard video player is initialized
    When the user loads a video
    Then the video should be ready to play

  Scenario: Playing a video
    Given the standard video player is initialized
    When the user clicks the play button
    Then the video should start playing

  Scenario: Pausing a video
    Given the video is playing
    When the user clicks the pause button
    Then the video should be paused

  Scenario: Optimizing video quality with ABR
    Given the ABR video player is initialized
    When the user loads a video with ABR
    Then the video should adjust the quality based on bandwidth