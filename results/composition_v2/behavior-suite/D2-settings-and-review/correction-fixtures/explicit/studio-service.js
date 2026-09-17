window.studioService={mode:new URLSearchParams(location.search).get('save')==='error'?'error':'success',saved:{displayName:'River Studio',kilnAlerts:true},async saveSettings(settings){await new Promise(resolve=>setTimeout(resolve,600));if(this.mode==='error')throw new Error('We could not save your settings. Please try again.');this.saved={...settings};return {...this.saved};}};

