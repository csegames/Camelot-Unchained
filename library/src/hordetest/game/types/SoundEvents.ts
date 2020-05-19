/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  enum SoundEvents {
    // Scenario
    PLAY_SCENARIO_END = 777532938,
    PLAY_SCENARIO_RESET = 3722376796,

    PLAY_SCENARIO_START_COUNTDOWN_10 = 3645132515,
    PLAY_SCENARIO_START_COUNTDOWN_9 = 3628354937,
    PLAY_SCENARIO_START_COUNTDOWN_8 = 3628354936,
    PLAY_SCENARIO_START_COUNTDOWN_7 = 3628354935,
    PLAY_SCENARIO_START_COUNTDOWN_6 = 3628354934,
    PLAY_SCENARIO_START_COUNTDOWN_5 = 3628354933,
    PLAY_SCENARIO_START_COUNTDOWN_4 = 3628354932,
    PLAY_SCENARIO_START_COUNTDOWN_3 = 3628354931,
    PLAY_SCENARIO_START_COUNTDOWN_2 = 3628354930,
    PLAY_SCENARIO_START_COUNTDOWN_1 = 3628354929,
    PLAY_SCENARIO_START_COUNTDOWN_GO = 2940472538,

    // Lobby sounds
    PLAY_USER_FLOW_LOBBY = 2694245435,
    PLAY_USER_FLOW_CHAMP_SELECT = 2358959244,
    PLAY_USER_FLOW_LOADING_SCREEN = 2485029212,

    PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP = 2899301306,
    PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_YES = 2899351490,
    PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_NO = 2411850041,
    PLAY_UI_MAIN_MENU_TAB_STORE_OPEN = 3750248654,
    PLAY_UI_MAIN_MENU_TAB_CHAMPION_OPEN = 3921901464,
    PLAY_UI_MAIN_MENU_TAB_CHAMPION_AMAZON = 573172548,
    PLAY_UI_MAIN_MENU_TAB_CHAMPION_KNIGHT = 4155250707,
    PLAY_UI_MAIN_MENU_TAB_CHAMPION_CELT = 3515011292,
    PLAY_UI_MAIN_MENU_TAB_CHAMPION_BERSERKER = 2390678243,
    PLAY_UI_MAIN_MENU_TAB_CAREER_OPEN = 1968479385,
    PLAY_UI_MAIN_MENU_SIDEBAR_CLOSE = 2275937613,
    PLAY_UI_MAIN_MENU_SIDEBAR_OPEN = 2055547399,
    PLAY_UI_MAIN_MENU_PLAYBUTTON = 3430847414,
    PLAY_UI_MAIN_MENU_CLICK = 2899345168,
    PLAY_UI_MAIN_MENU_HOVER = 3575700635,

    PLAY_MUSIC_IN_GAME = 962944353,
  }
  interface Window {
    SoundEvents: typeof SoundEvents;
  }
}
enum SoundEvents {
  // Scenario
  PLAY_SCENARIO_END = 777532938,
  PLAY_SCENARIO_RESET = 3722376796,

  PLAY_SCENARIO_START_COUNTDOWN_10 = 3645132515,
  PLAY_SCENARIO_START_COUNTDOWN_9 = 3628354937,
  PLAY_SCENARIO_START_COUNTDOWN_8 = 3628354936,
  PLAY_SCENARIO_START_COUNTDOWN_7 = 3628354935,
  PLAY_SCENARIO_START_COUNTDOWN_6 = 3628354934,
  PLAY_SCENARIO_START_COUNTDOWN_5 = 3628354933,
  PLAY_SCENARIO_START_COUNTDOWN_4 = 3628354932,
  PLAY_SCENARIO_START_COUNTDOWN_3 = 3628354931,
  PLAY_SCENARIO_START_COUNTDOWN_2 = 3628354930,
  PLAY_SCENARIO_START_COUNTDOWN_1 = 3628354929,
  PLAY_SCENARIO_START_COUNTDOWN_GO = 2940472538,

  // Lobby sounds
  PLAY_USER_FLOW_LOBBY = 2694245435,
  PLAY_USER_FLOW_CHAMP_SELECT = 2358959244,
  PLAY_USER_FLOW_LOADING_SCREEN = 2485029212,

  PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP = 2899301306,
  PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_YES = 2899351490,
  PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_NO = 2411850041,
  PLAY_UI_MAIN_MENU_TAB_STORE_OPEN = 3750248654,
  PLAY_UI_MAIN_MENU_TAB_CHAMPION_OPEN = 3921901464,
  PLAY_UI_MAIN_MENU_TAB_CHAMPION_AMAZON = 573172548,
  PLAY_UI_MAIN_MENU_TAB_CHAMPION_KNIGHT = 4155250707,
  PLAY_UI_MAIN_MENU_TAB_CHAMPION_CELT = 3515011292,
  PLAY_UI_MAIN_MENU_TAB_CHAMPION_BERSERKER = 2390678243,
  PLAY_UI_MAIN_MENU_TAB_CAREER_OPEN = 1968479385,
  PLAY_UI_MAIN_MENU_SIDEBAR_CLOSE = 2275937613,
  PLAY_UI_MAIN_MENU_SIDEBAR_OPEN = 2055547399,
  PLAY_UI_MAIN_MENU_PLAYBUTTON = 3430847414,
  PLAY_UI_MAIN_MENU_CLICK = 2899345168,
  PLAY_UI_MAIN_MENU_HOVER = 3575700635,

  PLAY_MUSIC_IN_GAME = 962944353,
}
window.SoundEvents = SoundEvents;

