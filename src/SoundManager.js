/**
 * Created by atom on 16/7/22.
 */
var SoundManager = {
    m_bgmAudioId:-1,
    playMusic:function(music,loop){
        if(cc.sys.platform === cc.sys.DESKTOP_BROWSER) {
           
            if(loop !== undefined){
                cc.audioEngine.playMusic(music,loop);
            }else{
                cc.audioEngine.playMusic(music);
            }
        }else{
            if(cc.sys.os === cc.sys.OS_IOS){
                if(loop !== undefined){
                    this.m_bgmAudioId = jsb.AudioEngine.play2d(music,loop);
                }else{
                    this.m_bgmAudioId = jsb.AudioEngine.play2d(music);
                }
                
            }else if(cc.sys.os === cc.sys.OS_ANDROID){
            	if(loop !== undefined){
                    this.m_bgmAudioId = jsb.AudioEngine.play2d(music,loop);
                }else{
                    this.m_bgmAudioId = jsb.AudioEngine.play2d(music);
                }
            }
        }
    },
    stopMusic:function(){

        if(cc.sys.platform === cc.sys.DESKTOP_BROWSER) {
            cc.audioEngine.stopMusic();
        }else{
            if(cc.sys.os === cc.sys.OS_IOS){
                jsb.AudioEngine.stop(this.m_bgmAudioId);


            }else if(cc.sys.os === cc.sys.OS_ANDROID){
 				jsb.AudioEngine.stop(this.m_bgmAudioId);
            }
        }
    },
    playEffect:function(effect){
        if(cc.sys.platform === cc.sys.DESKTOP_BROWSER) {
            cc.audioEngine.playEffect(effect);
        }else{
            if(cc.sys.os === cc.sys.OS_IOS){
                
                jsb.AudioEngine.play2d(effect);
                
            }else if(cc.sys.os === cc.sys.OS_ANDROID){
				jsb.AudioEngine.play2d(effect);
            }else if(cc.sys.os === cc.sys.OS_WINDOWS){

            }

        }

    },
    getCurrentMusicTime:function(){
        if(cc.sys.platform === cc.sys.DESKTOP_BROWSER) {
            var currMusic = cc.audioEngine._currMusic;
            if(currMusic == null){
                return -1;
            }else{
                return currMusic._element.currentTime*g_timePerSecond;
            }
        }else{
            if(cc.sys.os === cc.sys.OS_IOS){
                if(this.m_bgmAudioId != jsb.AudioEngine.INVALID_AUDIO_ID) {

                    if (jsb.AudioEngine.getState(this.m_bgmAudioId) == jsb.AudioEngine.AudioState.PLAYING) {
                        return jsb.AudioEngine.getCurrentTime(this.m_bgmAudioId)*g_timePerSecond;
                    }else{
                        return -1;
                    }
                }else{
                    return -1;
                }

            }else if(cc.sys.os === cc.sys.OS_ANDROID){
				if(this.m_bgmAudioId != jsb.AudioEngine.INVALID_AUDIO_ID) {

                    if (jsb.AudioEngine.getState(this.m_bgmAudioId) == jsb.AudioEngine.AudioState.PLAYING) {
                        return jsb.AudioEngine.getCurrentTime(this.m_bgmAudioId)*g_timePerSecond;
                    }else{
                        return -1;
                    }
                }else{
                    return -1;
                }
            }
        }

    },
    isMusicPlaying:function(){
        if(cc.sys.platform === cc.sys.DESKTOP_BROWSER) {
            return cc.audioEngine.isMusicPlaying();
        }else{
            if(cc.sys.os === cc.sys.OS_IOS){
                return jsb.AudioEngine.getState(this.m_bgmAudioId) == jsb.AudioEngine.AudioState.PLAYING;
            }else if(cc.sys.os === cc.sys.OS_ANDROID){
				return jsb.AudioEngine.getState(this.m_bgmAudioId) == jsb.AudioEngine.AudioState.PLAYING;
            }
        }


    }
};