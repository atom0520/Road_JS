/**
 * Created by atom on 16/7/21.
 */

// 若想在屏幕上输出重要游戏变量的测试信息
// 以及将游戏中按键的时间保存为节奏点打击时间数据
// 以及大大降低游戏通关的难度
// 请把这里改为true
var DEBUG_MODE = false;

//enum
var GameState = {
    pause:0,
    init:1,
    inTheGame:2,
    ending:3,
    waitForTouchToReturn:4
}

var HeroState = {
    child:0,
    teen:1,
    adult:2,
    old:3
}

var TimeStage = {
    childTime:0,
    teenTime:1,
    adultTime:2,
    oldTime:3,
    dieTime:4,
}

var BeatType = {
    elec:1,
    rose:2,
    mask:3,
    bell:4
}


var JudgeResult = {
    miss:0,
    good:1,
    perfect:2
}

var EndingType = {
    childTimeUnnaturallyDieEnding:1,
    teenTimeUnnaturallyDieEnding:2,
    adultTimeUnnaturallyDieEnding:3,
    oldTimeUnnaturallyDieEnding:4,

    childStateNaturallyDieEnding:5,
    teenStateNaturallyDieEnding:6,
    adultStateNaturallyDieEnding:7,
    oldStateNaturallyDieEnding:8,
}

//immutable global var
var WINDOW_WIDTH= 1024;
var WINDOW_HEIGHT= 736;



//notification
var NOTIFICATION_BEAT_APPEAR = "beat_appear";
var NOTIFICATION_BEAT_PASS_MISS = "beat_pass_miss";
var NOTIFICATION_BEAT_GET_TOUCHED = "beat_get_touched";
var NOTIFICATION_ENTER_ENDING = "enter_ending";
var NOTIFICATION_HERO_CHANGE_STATE = "hero_change_state";
var NOTIFICATION_VIEW_CLARITY_CHANGE = "view_clarity_change";

//z order
var BG_ARMATURE_LAYER_GAME_SCENE_VIEW_Z_ORDER = 1;
var BLANK_WHITE_LAYER_GAME_VIEW_Z_ORDER = 2;

var BEAT_TRACK_WHITE_LINE_SPRITE_GAME_SCENE_VIEW_Z_ORDER = 3;

var BEAT_TRACK_GREY_LINE_SPRITE_GAME_SCENE_VIEW_Z_ORDER = 4;

var COFFIN_SPRITE_GAME_SCENE_VIEW_Z_ORDER = 5;
var HERO_SPRITE_GAME_SCENE_VIEW_Z_ORDER = 6;
var COFFIN_MASK_SPRITE_GAME_SCENE_VIEW_Z_ORDER = HERO_SPRITE_GAME_SCENE_VIEW_Z_ORDER+1;

var HEART_SPRITE_GAME_SCENE_VIEW_Z_ORDER = 9;
var MISS_JUDGE_HEART_EFFECT_SPRITE_GAME_SCENE_VIEW_Z_ORDER = HEART_SPRITE_GAME_SCENE_VIEW_Z_ORDER+1;
var GOOD_JUDGE_HEART_EFFECT_SPRITE_GAME_SCENE_VIEW_Z_ORDER = HEART_SPRITE_GAME_SCENE_VIEW_Z_ORDER-1;
var PERFECT_JUDGE_HEART_EFFECT_SPRITE_GAME_SCENE_VIEW_Z_ORDER = HEART_SPRITE_GAME_SCENE_VIEW_Z_ORDER-1;

var BEAT_SPRITE_GAME_SCENE_VIEW_Z_ORDER = 11;

var MEMBER_LIST_SPRITE_GAME_SCENE_VIEW_Z_ORDER = 12;

var ENDING_LABEL_GAME_SCENE_VIEW_Z_ORDER = 13;
var ENDING_TOMB_SPRITE_GAME_SCENE_VIEW_Z_ORDER = 13;

var HUD_LAYER_GAME_SCENE_VIEW_Z_ORDER = 14;
var TEST_LABEL_GAME_SCENE_VIEW_Z_ORDER = 14;

var ENDING_LABEL_3_GAME_SCENE_VIEW_Z_ORDER = 14;

//action tag
var BEAT_SPRITE_MOVE_FROM_APPEAR_TO_DISAPPEAR_ACTION_TAG = 1;
var BEAT_SPRITE_GET_TOUCHED_ACTION_TAG = 2;

var GOOD_JUDGE_HEART_SPRITE_ACTION_TAG = 3;
var PERFECT_JUDGE_HEART_SPRITE_ACTION_TAG = 4;
var HEART_SPRITE_REPEAT_BEAT_ACTION_TAG = 5;

var VIEW_CLARITY_CHANGE_FADE_ACTION_TAG = 6;

var BEAT_SUB_SPRITE_1_REPEAT_FADE_IN_FADE_OUT_ACTION_TAG = 7;
var BEAT_SUB_SPRITE_2_REPEAT_FADE_OUT_FADE_IN_ACTION_TAG = 8;

//node tag
SPECIAL_BEAT_SUB_SPRITE_1_TAG = 1;
SPECIAL_BEAT_SUB_SPRITE_2_TAG = 2;

//animation name
var HEART_BEAT_ANIMATION_NAME = "heart_loop";
var GOOD_JUDGE_HEART_ANIMATION_NAME = "heart_hit_1";
var PERFECT_JUDGE_HEART_ANIMATION_NAME = "heart_hit_2";
var CHILD_HERO_WALK_ANIMATION_NAME = "child_walk";
var TEEN_HERO_WALK_ANIMATION_NAME = "teen_walk";
var ADULT_HERO_WALK_ANIMATION_NAME = "adult_walk";
var OLD_HERO_WALK_ANIMATION_NAME = "old_walk";


var COMBO_NUM_LABEL_STR_PREFIX = "Combo: "

//font size
var COMBO_NUM_LABEL_FONT_SIZE = 48;
var ENDING_LABEL_FONT_SIZE = 88;
var ENDIND_LABEL_1_FONT_SIZE = 64;
var ENDIND_LABEL_2_FONT_SIZE = 32;
var ENDIND_LABEL_3_FONT_SIZE = 48;

//pos
var BEAT_SPRITE_APPEAR_POS_X = WINDOW_WIDTH + 64;
var BEAT_SPRITE_APPEAR_POS_Y = WINDOW_HEIGHT/2;
var BEAT_SPRITE_DISAPPEAR_POS_X = -64;
var BEAT_SPRITE_TOUCH_POS_X = WINDOW_WIDTH/4.0;

var BEAT_TRACK_LINE_SPRITE_POS_X = 0;
var BEAT_TRACK_LINE_SPRITE_POS_Y = WINDOW_HEIGHT/2;

var HEART_SPRITE_POS_X = BEAT_SPRITE_TOUCH_POS_X;
var HEART_SPRITE_POS_Y = WINDOW_HEIGHT/2.0;

var HERO_SPRITE_POS_X = HEART_SPRITE_POS_X - 8;
var CHILD_HERO_SPRITE_POS_Y = WINDOW_HEIGHT/2 - 24;
var TEEN_HERO_SPRITE_POS_Y = WINDOW_HEIGHT/2 - 80;
var ADULT_HERO_SPRITE_POS_Y = WINDOW_HEIGHT/2 - 64;
var OLD_HERO_SPRITE_POS_Y = WINDOW_HEIGHT/2 - 64;

var COMBO_LABEL_POS_X = 12;
var COMBO_LABEL_POS_Y = WINDOW_HEIGHT-8;

var COFFIN_SPRITE_POS_Y = OLD_HERO_SPRITE_POS_Y+400;
var COFFIN_SPRITE_MOVE_INTO_POS_X = WINDOW_WIDTH/4.0 * 3;

var COFFIN_SPRITE_FINAL_POS_X = WINDOW_WIDTH/2.0;
var COFFIN_SPRITE_FINAL_POS_Y = WINDOW_HEIGHT/2.0;

var UNNATURALLY_DIE_ENDING_LABEL_1_POS_X = WINDOW_WIDTH/5.0 * 3;
var UNNATURALLY_DIE_ENDING_LABEL_1_POS_Y = WINDOW_HEIGHT/5.0 * 3 ;
var UNNATURALLY_DIE_ENDING_LABEL_2_POS_X = UNNATURALLY_DIE_ENDING_LABEL_1_POS_X;
var UNNATURALLY_DIE_ENDING_LABEL_2_POS_Y = UNNATURALLY_DIE_ENDING_LABEL_1_POS_Y - 64;

var NATURALLY_DIE_ENDING_LABEL_1_POS_X = WINDOW_WIDTH/2.0;
var NATURALLY_DIE_ENDING_LABEL_1_POS_Y = WINDOW_HEIGHT/5.0 * 3;
var NATURALLY_DIE_ENDING_LABEL_2_POS_X = NATURALLY_DIE_ENDING_LABEL_1_POS_X;
var NATURALLY_DIE_ENDING_LABEL_2_POS_Y = NATURALLY_DIE_ENDING_LABEL_1_POS_Y - 64;


var ENDING_TOMB_SPRITE_FINAL_POS_X = WINDOW_WIDTH/3.0 - 64;
var ENDING_TOMB_SPRITE_FINAL_POS_Y = WINDOW_HEIGHT/5.0 * 3;
var ENDING_TOMB_SPRITE_INIT_POS_X = ENDING_TOMB_SPRITE_FINAL_POS_X;
var ENDING_TOMB_SPRITE_INIT_POS_Y = ENDING_TOMB_SPRITE_FINAL_POS_Y - 96;


var UNNATURALLY_DIE_ENDING_LABEL_3_POS_X = WINDOW_WIDTH/2.0;
var UNNATURALLY_DIE_ENDING_LABEL_3_POS_Y = WINDOW_HEIGHT/4.0;

var NATURALLY_DIE_ENDING_LABEL_3_POS_X = NATURALLY_DIE_ENDING_LABEL_1_POS_X;
var NATURALLY_DIE_ENDING_LABEL_3_POS_Y = WINDOW_HEIGHT/3.0 + 48;

//scale
var HERO_SPRITE_SCALE = 0.5;
var HEART_SPRITE_SCALE = 0.75;
var MISS_JUDGE_HEART_EFFECT_SPRITE_SCALE = 1.0;
var GOOD_JUDGE_HEART_EFFECT_SPRITE_SCALE = 0.75;
var PERFECT_JUDGE_HEART_EFFECT_SPRITE_SCALE = 0.75;
var COFFIN_SPRITE_INIT_SCALE = 2.0;
var MEMBER_LIST_SPRITE_SCALE = 1.5;
var ENDING_TOMB_SPRITE_SCALE = 0.5;

var BEAT_ROSE_SUB_SPRITE_SCALE = 0.5;
var BEAT_MASK_SUB_SPRITE_SCALE = 0.5;
var BEAT_BELL_SUB_SPRITE_SCALE = 0.5;

//opacity
var MEMBER_LIST_SPRITE_FADE_UP_OPACITY = 255;
var MEMBER_LIST_SPRITE_FADE_DOWN_OPACITY = 128;

var ENDING_LABEL_3_FADE_UP_OPACITY = 255;
var ENDING_LABEL_3_FADE_DOWN_OPACITY = 32;

//TOUCH_BEAT_VIEW_CLARITY_CHANGE
if(DEBUG_MODE == true){
    var PASS_MISS_BEAT_VIEW_CLARITY_CHANGE = (-10);
    var TOUCH_BEAT_MISS_JUDGE_VIEW_CLARITY_CHANGE = (-10);
    var TOUCH_BEAT_GOOD_JUDGE_VIEW_CLARITY_CHANGE = 30;
    var TOUCH_BEAT_PERFECT_JUDGE_VIEW_CLARITY_CHANGE = 50;
}else{
    var PASS_MISS_BEAT_VIEW_CLARITY_CHANGE = (-50);
    var TOUCH_BEAT_MISS_JUDGE_VIEW_CLARITY_CHANGE = (-50);
    var TOUCH_BEAT_GOOD_JUDGE_VIEW_CLARITY_CHANGE = 15;
    var TOUCH_BEAT_PERFECT_JUDGE_VIEW_CLARITY_CHANGE = 30;
}


//ending label str
var CHILD_TIME_UNNATURALLY_DIE_ENDING_LABEL_1_STR = "年少夭折";
var TEEN_TIME_UNNATURALLY_DIE_ENDING_LABEL_1_STR = "英年早逝";
var ADULT_TIME_UNNATURALLY_DIE_ENDING_LABEL_1_STR = "壮志未酬";
var OLD_TIME_UNNATURALLY_DIE_ENDING_LABEL_1_STR = "不得善终";

var CHILD_TIME_UNNATURALLY_DIE_ENDING_LABEL_2_STR= "He is just asleep";
var TEEN_TIME_UNNATURALLY_DIE_ENDING_LABEL_2_STR = "Died at the most beautiful age";
var ADULT_TIME_UNNATURALLY_DIE_ENDING_LABEL_2_STR = "Dreams are still in the air";
var OLD_TIME_UNNATURALLY_DIE_ENDING_LABEL_2_STR = "It's too late to say goodbye";

var CHILD_STATE_NATURALLY_DIE_ENDING_LABEL_1_STR = "童心未泯";
var TEEN_STATE_NATURALLY_DIE_ENDING_LABEL_1_STR = "永葆青春";
var ADULT_STATE_NATURALLY_DIE_ENDING_LABEL_1_STR = "鞠躬尽瘁";
var OLD_STATE_NATURALLY_DIE_ENDING_LABEL_1_STR = "寿终正寝";

var CHILD_STATE_NATURALLY_DIE_ENDING_LABEL_2_STR = "Never grow up! Never!";
var TEEN_STATE_NATURALLY_DIE_ENDING_LABEL_2_STR = "Forever young!";
var ADULT_STATE_NATURALLY_DIE_ENDING_LABEL_2_STR = "If I rest, I rust.";
var OLD_STATE_NATURALLY_DIE_ENDING_LABEL_2_STR = "Leave with no regret.";

var ENDING_LABEL_3_STR = "Valar Morghulis";

//SPECIAL_BEAT_GOT_NUM_THRESHOLD
var TEEN_STATE_SPECIAL_BEAT_GOT_NUM_THRESHOLD = 1;
var ADULT_STATE_SPECIAL_BEAT_GOT_NUM_THRESHOLD = 1;
var OLD_STATE_SPECIAL_BEAT_GOT_NUM_THRESHOLD = 1;

/////mutable global var

var g_needRecordTouchBeatsData = DEBUG_MODE;

//duration (in second)
var g_timePerSecond = 1000;

var g_beatSpriteMoveFromAppearToDisappearDuration = 3.0;
var g_beatSpriteFadeOutDuration = 0.2;
var g_heartSpriteFadeInDuration = 1.0;
var g_heartSpriteFadeOutDuration = 1.0;
var g_heroSpriteFadeInDuration = 1.0;
var g_heroSpriteFadeOutDuration = 1.0;
var g_heroSpriteFadeUpDuration = 1.0;

var g_beatTrackWhiteLineSpriteFadeOutDuration = 0.2;
var g_beatTrackGreyLineSpriteFadeOutDuration = 0.2;

var g_coffinSpriteMoveIntoDuration = 8.0;

var g_delayBetweenCoffinSpriteMoveIntoAndZoomInDuration = 1.0;
var g_delayBetweenCoffinMaskSpriteMoveIntoAndRemoveDuration = 1.0;
var g_coffinSpriteZoomInDuration = 4.0;

var g_heroSpriteMoveToCenterXDuration = 4.0;
var g_delayBetweenHeroSpriteMoveToCenterXAndHideDuration = g_coffinSpriteMoveIntoDuration-g_heroSpriteMoveToCenterXDuration;
var g_delayBeforeDisplayMemberListDurtion =
    g_coffinSpriteMoveIntoDuration
    +g_delayBetweenCoffinSpriteMoveIntoAndZoomInDuration
    +g_coffinSpriteZoomInDuration + 1.0;

var g_memberListSpriteScrollUpDuration = 20.0;
var g_memberListSpriteFadeUpDuration = 2.0;
var g_memberListSpriteFadeDownDuration = 2.0;

var g_naturallyDieEndingDelayBeforeEndingLabel1AppearDuration =
    g_delayBeforeDisplayMemberListDurtion
    + g_memberListSpriteScrollUpDuration + 1.5;

var g_naturallyDieEndingDelayBeforeEndingLabel2AppearDuration =
    g_naturallyDieEndingDelayBeforeEndingLabel1AppearDuration + 1.0;

var g_endingLabel1FadeInDuration = 1.5;
var g_endingLabel2FadeInDuration = 1.5;

var g_naturallyDieEndingDelayBeforeEndingLabel3AppearDuration =
    g_naturallyDieEndingDelayBeforeEndingLabel2AppearDuration + g_endingLabel2FadeInDuration + 0.1;

var g_endingLabel3FadeUpDuration = 2.0;
var g_endingLabel3FadeDownDuration = 2.0;

var g_naturallyDieEndingDelayBeforeBeginWaitForTouchToReturnDurtion =
    g_naturallyDieEndingDelayBeforeEndingLabel3AppearDuration + 1.0;

var g_beatTrackGreyLineSpriteMoveLeftOutDuraton = 1.0;

var g_delayBeforeEndingTombSpriteAppearDuration = 1.5;

var g_endingTombSpriteMoveUpDuration = 1.5;
var g_endingTombSpriteFadeInDuration = 1.5;

var g_unnaturallyDieEndingDelayBeforeEndingLabel1AppearDuration =
    g_delayBeforeEndingTombSpriteAppearDuration + 1.0;

var g_unnaturallyDieEndingDelayBeforeEndingLabel2AppearDuration =
    g_unnaturallyDieEndingDelayBeforeEndingLabel1AppearDuration + 1.0;

var g_unnaturallyDieEndingDelayBeforeEndingLabel3AppearDuration =
    g_unnaturallyDieEndingDelayBeforeEndingLabel2AppearDuration + g_endingLabel2FadeInDuration + 0.1;

var g_unnaturallyDieEndingDelayBeforeBeginWaitForTouchToReturnDurtion =
    g_unnaturallyDieEndingDelayBeforeEndingLabel3AppearDuration;

var g_sceneTransitionDuration = 1.0;

var g_viewClarityChangeFadeDuration = 0.5;

var g_beatSubSprite1FadeOutDuration = 0.8;
var g_beatSubSprite1FadeInDuration = 0.8;

var g_endingDelayBeforeControllerStopMusic = 1.0;

//time point
 var g_heroBecomeTeenTimePoint = 37.0*g_timePerSecond;
 var g_heroBecomeAdultTimePoint = 76.5*g_timePerSecond;
 var g_heroBecomeOldTimePoint = 116.5*g_timePerSecond;
 var g_enterEndingTimePoint = 158.0*g_timePerSecond;

//Armature
var g_bgArmaturesVars = [
    {
        id:0,
        armatureName:"BgAnimation",
        animationName:"Animation1",
        initPos:cc.p(0,0),
        initScale:1.0,
        zOrder:0,

    },
    {
        id:1,
        armatureName:"BitBeatAnimation",
        animationName:"ChildStar1Ani",
        initPos:cc.p(1100,200),
        initScale:0.8,
        zOrder:6,
    },
    {
        id:2,
        armatureName:"BitBeatAnimation",
        animationName:"ChildStar2Ani",
        initPos:cc.p(1100,100),
        initScale:0.8,
        zOrder:5,
    },
    {
        id:3,
        armatureName:"BitBeatAnimation",
        animationName:"ChildStar3Ani",
        initPos:cc.p(1100,50),
        initScale:0.8,
        zOrder:4,
    },
    {
        id:4,
        armatureName:"BitBeatAnimation",
        animationName:"ChildJokerAni",
        initPos:cc.p(1100,300),
        initScale:0.4,
        zOrder:7,
    },
    {
        id:5,
        armatureName:"BitBeatAnimation",
        animationName:"ChildDuckAni",
        initPos:cc.p(1100,400),
        initScale:0.4,
        zOrder:8,
    },
    {
        id:6,
        armatureName:"BitBeatAnimation",
        animationName:"ChildBabyAni",
        initPos:cc.p(1100,500),
        initScale:0.4,
        zOrder:9
    },
    {
        id:7,
        armatureName:"BitBeatAnimation",
        animationName:"ChildBearAni",
        initPos:cc.p(1100,600),
        initScale:0.4,
        zOrder:10,
    },
    {
        id:8,
        armatureName:"BitBeatAnimation",
        animationName:"YoungRoseAni",
        initPos:cc.p(1100,100),
        initScale:0.4,
        zOrder:1,

    },
    {
        id:9,
        armatureName:"BitBeatAnimation",
        animationName:"YoungHeartAni",
        initPos:cc.p(1100,300),
        initScale:0.4,
        zOrder:2,
    },
    {
        id:10,
        armatureName:"BitBeatAnimation",
        animationName:"YoungHeartSwordAni",
        initPos:cc.p(1100,500),
        initScale:0.4,
        zOrder:3,
    },
    {
        id:11,
        armatureName:"BitBeatAnimation",
        animationName:"MidLifeWatchAni",
        initPos:cc.p(1100,600),
        initScale:0.4,
        zOrder:13,
    },
    {
        id:12,
        armatureName:"BitBeatAnimation",
        animationName:"MidLifeMaskAni",
        initPos:cc.p(1100,200),
        initScale:0.4,
        zOrder:11,
    },
    {
        id:13,
        armatureName:"BitBeatAnimation",
        animationName:"MidLifeBabyAni",
        initPos:cc.p(1100,400),
        initScale:0.4,
        zOrder:12,
    },

    {
        id:14,
        armatureName:"BitBeatAnimation",
        animationName:"OldCrowFly",
        initPos:cc.p(1100,100),
        initScale:0.4,
        zOrder:14,
    },
    {
        id:15,
        armatureName:"BitBeatAnimation",
        animationName:"OldCrowStand",
        initPos:cc.p(1100,200),
        initScale:0.4,
        zOrder:15,
    },
    {
        id:16,
        armatureName:"BitBeatAnimation",
        animationName:"OldBellAni",
        initPos:cc.p(1100,300),
        initScale:0.4,
        zOrder:16,
    },
    {
        id:17,
        armatureName:"BitBeatAnimation",
        animationName:"OldFeather1Ani",
        initPos:cc.p(1100,400),
        initScale:0.4,
        zOrder:17,
    },
    {
        id:18,
        armatureName:"BitBeatAnimation",
        animationName:"OldFeather2Ani",
        initPos:cc.p(1100,500),
        initScale:0.4,
        zOrder:18,
    },
    {
        id:19,
        armatureName:"BitBeatAnimation",
        animationName:"OldFeather3Ani",
        initPos:cc.p(1100,600),
        initScale:0.4,
        zOrder:19,
    }
]

var g_bgAnimaturesPlayTimeData = [
    {
        order: 0,
        timePoint:0,
        bgAmaturesId:[0],
    },
    {
        order:1,
        timePoint:1.0*g_timePerSecond,
        bgAmaturesId:[1,2],
    },
    {
        order:2,
        timePoint:10.0*g_timePerSecond,
        bgAmaturesId:[3,4,5],
    },
    {
        order:3,
        timePoint:20.0*g_timePerSecond,
        bgAmaturesId:[6,7],
    },
    {
        order:4,
        timePoint:38.0*g_timePerSecond,
        bgAmaturesId:[8],
    },
    {
        order:5,
        timePoint:48.0*g_timePerSecond,
        bgAmaturesId:[9],
    },
    {
        order:6,
        timePoint:60.0*g_timePerSecond,
        bgAmaturesId:[10],
    },
    {
        order:7,
        timePoint:78.0*g_timePerSecond,
        bgAmaturesId:[11],
    },
    {
        order:8,
        timePoint:86.0*g_timePerSecond,
        bgAmaturesId:[12],
    },
    {
        order:9,
        timePoint:95.0*g_timePerSecond,
        bgAmaturesId:[13],
    },
    {
        order:10,
        timePoint:117.0*g_timePerSecond,
        bgAmaturesId:[14,15],
    },
    {
        order:11,
        timePoint:130.0*g_timePerSecond,
        bgAmaturesId:[16,17],
    },
    {
        order:12,
        timePoint:142.0*g_timePerSecond,
        bgAmaturesId:[18,19],
    },
]


