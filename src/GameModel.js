/**
 * Created by atom on 16/7/21.
 */
/*
未特别注明单位的time均以毫秒为单位
*/
var GameModel = cc.Node.extend({
    m_musicsData:null,

    m_currMusicId:0,
    m_currBeatsVars:null,
    m_nextWillAppearBeatIndex:0,
    m_nextWillDisappearBeatIndex:0,
    m_nextWillTouchBeatIndex:0,
    m_gameTimer:0,
    m_hasGameTimerStart:false,
    m_musicStartTime:0,

    m_beatMovePerSecond:0,
    m_beatDisappearTimeToAppearTime:0,  //in millisecond
    m_beatTouchTimeToAppearTime:0,   //in millisecond
    //m_timeUnitsPerSecond:0,

    m_touchBeatJudgeTimeRanges:{miss:200, good:100, perfect:50},  //in millisecond

    m_perfectNum:0,
    m_goodNum:0,
    m_missNum:0,
    m_comboNum:0,
    m_roseBeatGotNum:0,
    m_maskBeatGotNum:0,
    m_bellBeatGotNum:0,

    m_heroState:null,
    m_timeStage:null,
    m_recordTouchBeatsDataStr:null,
                               
    //视线清晰度的程度，miss一次视线模糊一点
    m_viewClarity:255,
    
    ctor:function(){
        this._super();
        this.m_musicsData=[];
        this.loadMusicsData();

        //this.m_timeUnitsPerSecond = 100;
        this.m_beatMovePerSecond = (BEAT_SPRITE_APPEAR_POS_X-BEAT_SPRITE_DISAPPEAR_POS_X)/g_beatSpriteMoveFromAppearToDisappearDuration;
        this.m_beatDisappearTimeToAppearTime = g_beatSpriteMoveFromAppearToDisappearDuration * g_timePerSecond;
        this.m_beatTouchTimeToAppearTime = (BEAT_SPRITE_APPEAR_POS_X-BEAT_SPRITE_TOUCH_POS_X) / this.m_beatMovePerSecond * g_timePerSecond;

        this.m_heroState = HeroState.child;
        this.m_timeStage = TimeStage.childTime;

        if(cc.sys.platform === cc.sys.DESKTOP_BROWSER) {

        }else{
            if(cc.sys.os === cc.sys.OS_IOS){
                if(g_needRecordTouchBeatsData == true){
                    this.m_recordTouchBeatsDataStr = "";
                }

            }else if(cc.sys.os === cc.sys.OS_ANDROID){

            }
        }
    },
    loadMusicsData:function(){
        //读取json文件
        this.m_musicsData = [];

        var musicsDataTxt;
        if(cc.sys.platform === cc.sys.DESKTOP_BROWSER) {
            musicsDataTxt = cc.loader._loadTxtSync(res.musicsData_json);


        }else{
            if(cc.sys.os === cc.sys.OS_IOS){
                musicsDataTxt = jsb.fileUtils.getStringFromFile(res.musicsData_json);

            }else if(cc.sys.os === cc.sys.OS_ANDROID){
				musicsDataTxt = jsb.fileUtils.getStringFromFile(res.musicsData_json);
            }
        }



        var musicsDataArray = JSON.parse(musicsDataTxt);

        for(var i=0;i<musicsDataArray.length;i++){
            var beatsDataStr = musicsDataArray[i].beatsDataStr;
            var beatsDataStrArray = beatsDataStr.split(",");

            var beatsData = [];
            for(var j=0;j<beatsDataStrArray.length;j+=1){
                var beatDataStr=beatsDataStrArray[j];

                var beatDataStrArray = beatDataStr.split("-");

                beatsData[j] = this.createBeatData(parseInt(beatDataStrArray[0]),parseInt(beatDataStrArray[1]));

                cc.log("no "+j+" beat's touch time is "+beatsData[j].touchTime);
            }
            this.m_musicsData[i] = this.createMusicData(musicsDataArray[i].name,beatsData);
            //this.m_musicsData[i].name;
            //this.m_musicsData[i].beatsData;
        }

    },
    createMusicData:function(name,beatsData){
        return {
            name:name,
            beatsData:beatsData
        };
    },
    createBeatData:function(touchTime,type){
        return {
            touchTime:touchTime,
            type:type
        };
    },
    createBeatVars:function(type,touchTime,visible,touchable){
        return {
            type:type,
            appearTime:touchTime-this.m_beatTouchTimeToAppearTime,
            touchTime:touchTime,
            disappearTime:touchTime-this.m_beatTouchTimeToAppearTime+this.m_beatDisappearTimeToAppearTime,
            visible:visible,
            touchable:touchable,
        };
    },
    initCurrBeatsVars:function(musicId){
        this.m_currMusicId = musicId;
        var musicData = this.m_musicsData[this.m_currMusicId];
        this.m_currBeatsVars = [];
        for(var i=0;i<musicData.beatsData.length;i++){
            this.m_currBeatsVars[i] = this.createBeatVars(
                musicData.beatsData[i].type,
                musicData.beatsData[i].touchTime,
                false,
                false
            );
        }
    },
    update:function(dt,systemTime,musicCurrentTime){

        if(this.m_hasGameTimerStart == false){
            if(SoundManager.isMusicPlaying()==true) {
                //timer处理
                //var systemTime = (new Date()).getTime();
                //var currentMusicTime = SoundManager.getCurrentMusicTime();
                if (musicCurrentTime > 0) {
                    cc.log("GameTimerStart");
                    this.m_hasGameTimerStart = true;

                    //this.m_musicStartTime = systemTime - musicCurrentTime;
                    //this.m_gameTimer = systemTime - this.m_musicStartTime;
                    this.m_gameTimer = musicCurrentTime;
                }
            }
        }else{
            this.m_gameTimer += dt*1000;
            if(Math.abs(this.m_gameTimer-musicCurrentTime)>500){
                               this.m_gameTimer = (this.m_gameTimer+musicCurrentTime)/2.0;
            }
            //this.m_gameTimer = musicCurrentTime;
            //var systemTime = (new Date()).getTime();
            //this.m_gameTimer = systemTime - this.m_musicStartTime;

            //判断hero是否需要改变状态
            switch(this.m_timeStage){
                case TimeStage.childTime:
                    if(this.m_gameTimer >= g_heroBecomeTeenTimePoint){
                        if(this.m_roseBeatGotNum>= TEEN_STATE_SPECIAL_BEAT_GOT_NUM_THRESHOLD){

                            this.m_heroState = HeroState.teen;
                            var event = new cc.EventCustom(NOTIFICATION_HERO_CHANGE_STATE);
                            event.setUserData({
                                newHeroState:HeroState.teen
                            });
                            cc.eventManager.dispatchEvent(event);
                        }
                        
                        this.m_timeStage = TimeStage.teenTime;
                    }
                    break;
                case TimeStage.teenTime:
                    if(this.m_gameTimer >= g_heroBecomeAdultTimePoint){
                        if(this.m_maskBeatGotNum>= ADULT_STATE_SPECIAL_BEAT_GOT_NUM_THRESHOLD){
                            this.m_heroState = HeroState.adult;
                            var event = new cc.EventCustom(NOTIFICATION_HERO_CHANGE_STATE);
                            event.setUserData({
                                newHeroState:HeroState.adult
                            });
                            cc.eventManager.dispatchEvent(event);
                        }
                        this.m_timeStage = TimeStage.adultTime;
                    }
                    break;
                case TimeStage.adultTime:
                    if(this.m_gameTimer >= g_heroBecomeOldTimePoint){
                        if(this.m_bellBeatGotNum>= OLD_STATE_SPECIAL_BEAT_GOT_NUM_THRESHOLD){
                            this.m_heroState = HeroState.old;
                            var event = new cc.EventCustom(NOTIFICATION_HERO_CHANGE_STATE);
                            event.setUserData({
                                newHeroState:HeroState.old
                            });
                            cc.eventManager.dispatchEvent(event);
                        }
                        this.m_timeStage = TimeStage.oldTime;
                    }
                    break;
                case TimeStage.oldTime:


                    break;
            }

            //判断是否需要进入游戏ending
            if(this.m_gameTimer >= g_enterEndingTimePoint){
                if(cc.sys.platform === cc.sys.DESKTOP_BROWSER) {

                }else{
                    if(cc.sys.os === cc.sys.OS_IOS){
                        //
                        if(g_needRecordTouchBeatsData == true){
                            var path = jsb.fileUtils.getWritablePath();
                            path = path + "musicsData.json";
                            var willSaveMusicsData = [];
                            willSaveMusicsData.push(
                                {
                                    name:this.m_musicsData[this.m_currMusicId].name,
                                    beatsDataStr:this.m_recordTouchBeatsDataStr.slice(0,this.m_recordTouchBeatsDataStr.length-1)
                                }
                            );
                            var willSaveMusicsDataStr = JSON.stringify(willSaveMusicsData);

                            //jsb.fileUtils.writeValueVectorToFile(willSaveMusicsData,path);
                            jsb.fileUtils.writeStringToFile(willSaveMusicsDataStr,path);
                            cc.log("!!!touchBeatsData file 'musicsData.json' has been saved at "+path);
                        }

                    }else if(cc.sys.os === cc.sys.OS_ANDROID){

                    }
                }

                this.m_timeStage = TimeStage.dieTime;

                var endingType;
                switch(this.m_heroState){
                    case HeroState.child:
                        endingType = EndingType.childStateNaturallyDieEnding;
                        break;
                    case HeroState.teen:
                        endingType = EndingType.teenStateNaturallyDieEnding;
                        break;
                    case HeroState.adult:
                        endingType = EndingType.
                            adultStateNaturallyDieEnding;
                        break;
                    case HeroState.old:
                        endingType = EndingType.
                            oldStateNaturallyDieEnding;
                        break;
                }
                
                var event = new cc.EventCustom(NOTIFICATION_ENTER_ENDING);
                event.setUserData({endingType:endingType});
                cc.eventManager.dispatchEvent(event);
            }

            if(this.m_viewClarity == 0){
                var endingType;
                if(this.m_gameTimer < g_heroBecomeTeenTimePoint){
                    endingType = EndingType.childTimeUnnaturallyDieEnding;
                }else if(this.m_gameTimer < g_heroBecomeAdultTimePoint){
                    endingType = EndingType.teenTimeUnnaturallyDieEnding;
                }else if(this.m_gameTimer < g_heroBecomeOldTimePoint){
                    endingType = EndingType.adultTimeUnnaturallyDieEnding;
                }else{
                    endingType = EndingType.oldTimeUnnaturallyDieEnding;
                }
                var event = new cc.EventCustom(NOTIFICATION_ENTER_ENDING);
                event.setUserData({endingType:endingType});
                cc.eventManager.dispatchEvent(event);
            }

            
            //判断是否有要出现的beat
            if(this.m_nextWillAppearBeatIndex < this.m_currBeatsVars.length){

               while(this.m_currBeatsVars[this.m_nextWillAppearBeatIndex].appearTime<=
                     this.m_gameTimer)
               {
                   //cc.log("beat "+this.m_nextWillAppearBeatIndex+" appear!");
                   this.m_currBeatsVars[this.m_nextWillAppearBeatIndex].visible=true;
                   this.m_currBeatsVars[this.m_nextWillAppearBeatIndex].touchable=true;

                   var event = new cc.EventCustom(NOTIFICATION_BEAT_APPEAR);
                   event.setUserData({
                                     beatIndex:this.m_nextWillAppearBeatIndex,
                                     beatType:this.m_currBeatsVars[this.m_nextWillAppearBeatIndex].type
                                     });
                   cc.eventManager.dispatchEvent(event);

                   this.m_nextWillAppearBeatIndex+=1;
                   if(this.m_nextWillAppearBeatIndex >= this.m_currBeatsVars.length){
                       break;
                   }
               }
            }
            
            //判断是否有要自动判miss的beat
            if(this.m_nextWillTouchBeatIndex < this.m_currBeatsVars.length){
                while(1)
                {
                    if(this.m_nextWillTouchBeatIndex>=this.m_nextWillAppearBeatIndex){
                        break;
                    };

                    //判断index为this.m_nextWillTouchBeatIndex的beat是否既没到自动判miss时间又仍然没被点击
                    if(this.m_currBeatsVars[this.m_nextWillTouchBeatIndex].touchTime
                        +this.m_touchBeatJudgeTimeRanges.miss>
                        this.m_gameTimer
                        && this.m_currBeatsVars[this.m_nextWillTouchBeatIndex].touchable == true){
                        break;
                    }



                    if(this.m_currBeatsVars[this.m_nextWillTouchBeatIndex].touchable == true){
                        //节奏已过敲击区域而自动判miss
                        this.m_currBeatsVars[this.m_nextWillTouchBeatIndex].touchable = false;
                        this.m_comboNum = 0;
                        //cc.log("beat "+this.m_nextWillTouchBeatIndex+" pass miss!");

                        var event = new cc.EventCustom(NOTIFICATION_BEAT_PASS_MISS);
                        event.setUserData({
                            beatIndex:this.m_nextWillTouchBeatIndex,
                            beatType:this.m_currBeatsVars[this.m_nextWillTouchBeatIndex].type
                        });
                        cc.eventManager.dispatchEvent(event);

                        this.m_viewClarity =
                            Math.min(255,Math.max(0,this.m_viewClarity+PASS_MISS_BEAT_VIEW_CLARITY_CHANGE));
                        
                        var event = new cc.EventCustom(NOTIFICATION_VIEW_CLARITY_CHANGE);
                        event.setUserData({
                            newViewClarity:this.m_viewClarity
                        });
                        cc.eventManager.dispatchEvent(event);
                    }

                    this.m_nextWillTouchBeatIndex+=1;
                }
            }


            //判断是否有要消失的beat
            if(this.m_nextWillDisappearBeatIndex < this.m_currBeatsVars.length){
                while(1)
                {
                    if(this.m_nextWillDisappearBeatIndex>=this.m_nextWillAppearBeatIndex){
                        break;
                    };

                    //判断index为this.m_nextWillDisappearBeatIndex的beat是否既没到消失时间又仍然可见
                    if(this.m_currBeatsVars[this.m_nextWillDisappearBeatIndex].disappearTime >
                        this.m_gameTimer
                        && this.m_currBeatsVars[this.m_nextWillDisappearBeatIndex].visible == true){
                        break;
                    }

                    if(this.m_currBeatsVars[this.m_nextWillDisappearBeatIndex].visible==true){
                        //index为this.m_nextWillDisappearBeatIndex的beat自动miss
                        this.m_currBeatsVars[this.m_nextWillDisappearBeatIndex].visible=false;

                    }else{
                        //什么也不做
                    }
                    this.m_nextWillDisappearBeatIndex+=1;
                }
            }

        }
    },
    touchBeatJudge:function(touchTime){
        if(cc.sys.platform === cc.sys.DESKTOP_BROWSER) {

        }else{
            if(cc.sys.os === cc.sys.OS_IOS){
                if(g_needRecordTouchBeatsData == true){
                    this.m_recordTouchBeatsDataStr =
                        this.m_recordTouchBeatsDataStr + Math.floor(touchTime) + "-" + 1 + ",";
                }

            }else if(cc.sys.os === cc.sys.OS_ANDROID){

            }
        }

        //cc.log("touchTime is "+touchTime);
        if(this.m_nextWillTouchBeatIndex < this.m_currBeatsVars.length){
            //cc.log("nextWillTouchBeat touchTime is "+this.m_currBeatsVars[this.m_nextWillTouchBeatIndex].touchTime);
        }else{
            //cc.log("nextWillTouchBeat touchTime is -1");
            return;
        }

        var timeOffSet = touchTime -
            (this.m_currBeatsVars[this.m_nextWillTouchBeatIndex].touchTime);

        //cc.log("timeOffSet is "+timeOffSet);
        if(Math.abs(timeOffSet) > this.m_touchBeatJudgeTimeRanges.miss){
            //invalid

        }
        else{
            //valid
            var beatIndex = this.m_nextWillTouchBeatIndex;
            var beatType = this.m_currBeatsVars[beatIndex].type;

            var judgeResult;
            if(Math.abs(timeOffSet) <= this.m_touchBeatJudgeTimeRanges.perfect){
                //perfect
                this.m_currBeatsVars[this.m_nextWillTouchBeatIndex].touchable == false;
                this.m_currBeatsVars[this.m_nextWillTouchBeatIndex].visible == false;
                this.m_perfectNum+=1;
                this.m_comboNum += 1;
                judgeResult = JudgeResult.perfect;

                this.m_viewClarity =
                    Math.min(255, Math.max(0, this.m_viewClarity + TOUCH_BEAT_PERFECT_JUDGE_VIEW_CLARITY_CHANGE));

                switch (beatType) {
                    case BeatType.rose:
                        this.m_roseBeatGotNum += 1;
                        break;
                    case BeatType.mask:
                        this.m_maskBeatGotNum += 1;
                        break;
                    case BeatType.bell:
                        this.m_bellBeatGotNum += 1;
                        break;
                }

            }else if(Math.abs(timeOffSet) <= this.m_touchBeatJudgeTimeRanges.good){
                //good
                this.m_currBeatsVars[this.m_nextWillTouchBeatIndex].touchable == false;
                this.m_currBeatsVars[this.m_nextWillTouchBeatIndex].visible == false;
                this.m_goodNum+=1;
                this.m_comboNum += 1;
                judgeResult = JudgeResult.good;

                this.m_viewClarity =
                    Math.min(255, Math.max(0, this.m_viewClarity + TOUCH_BEAT_GOOD_JUDGE_VIEW_CLARITY_CHANGE));

                switch (beatType) {
                    case BeatType.rose:
                        this.m_roseBeatGotNum += 1;
                        break;
                    case BeatType.mask:
                        this.m_maskBeatGotNum += 1;
                        break;
                    case BeatType.bell:
                        this.m_bellBeatGotNum += 1;
                        break;
                }

            }else{
                //miss
                this.m_currBeatsVars[this.m_nextWillTouchBeatIndex].touchable == false;
                this.m_missNum+=1;
                this.m_comboNum = 0;
                judgeResult = JudgeResult.miss;

                this.m_viewClarity =
                    Math.min(255,Math.max(0,this.m_viewClarity+TOUCH_BEAT_MISS_JUDGE_VIEW_CLARITY_CHANGE));
            }

            var event = new cc.EventCustom(NOTIFICATION_BEAT_GET_TOUCHED);
            event.setUserData({
                beatIndex:beatIndex,
                beatType:beatType,
                judgeResult:judgeResult
            });
            cc.eventManager.dispatchEvent(event);

            var event = new cc.EventCustom(NOTIFICATION_VIEW_CLARITY_CHANGE);
            event.setUserData({
                newViewClarity:this.m_viewClarity
            });
            cc.eventManager.dispatchEvent(event);

            this.m_nextWillTouchBeatIndex++;
        }
    }
});

