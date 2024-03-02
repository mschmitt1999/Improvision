class Scale {
    static allNotesMap = new Map();
    static scalesMap = new Map();
    rootNoteKeyDouble;
    scaleNameString;
    scaleNotes = [];    
    
    constructor(scaleString, rootNoteKeyDouble){
        Scale.initializeNotesMap();
        Scale.initializeScalesMap();
        this.scaleNameString = 'Ionisch';
        this.rootNoteKeyDouble = 1.0;
    }

    static initializeNotesMap(){
        // Return map of: (key: double, value: String)
        //Initialize @allNotesMap, that contains all notes as values with their represantative double...
        Scale.allNotesMap.set(1.0, 'C');
        Scale.allNotesMap.set(1.5, 'C#');
        Scale.allNotesMap.set(2.0, 'D');
        Scale.allNotesMap.set(2.5, 'D#');
        Scale.allNotesMap.set(3.0, 'E');
        Scale.allNotesMap.set(3.5, 'F');
        Scale.allNotesMap.set(4.0, 'F#');
        Scale.allNotesMap.set(4.5, 'G');
        Scale.allNotesMap.set(5.0, 'G#');
        Scale.allNotesMap.set(5.5, 'A');
        Scale.allNotesMap.set(6.0, 'A#');
        Scale.allNotesMap.set(6.5, 'H');
    }
    
    
    static initializeScalesMap(){
        Scale.scalesMap.set('Ionisch', [7,2,6]);
        Scale.scalesMap.set('Dorisch', [7,1,5]);
        Scale.scalesMap.set('Phrygisch', [7,0,4]);
        Scale.scalesMap.set('Lydisch', [7,3,7]);
        Scale.scalesMap.set('Mixolydisch', [7,2,5]);
        Scale.scalesMap.set('Äolisch', [7,1,4]);
        Scale.scalesMap.set('Lokrisch', [7,0,3]);
        Scale.scalesMap.set('DurPentatonik',[7,2,6]);
        Scale.scalesMap.set('MolPentatonik',[7,1,4]);
    }
    
    calculateScale(){
        let noteKeyDouble = this.getRootNoteKeyDouble();
        let lenghtOfScale = Scale.scalesMap.get(this.scaleNameString).at(0);
        let halfSteps = Scale.scalesMap.get(this.scaleNameString).slice(1,lenghtOfScale);
        let scaleNotesString = '';
        this.scaleNotes = [];
        for (let i=0; i<lenghtOfScale; i++){
            if(!(this.scaleNameString=='DurPentatonik' && (i==3 || i==6)) && !(this.scaleNameString=='MolPentatonik' && (i==1 || i==5))){
            scaleNotesString = scaleNotesString.concat(Scale.allNotesMap.get(noteKeyDouble),' | '); 
            this.scaleNotes.push([noteKeyDouble, Scale.allNotesMap.get(noteKeyDouble)]);
            }
            if(halfSteps.includes(i)){
                    noteKeyDouble += 0.5;
                }
                else{
                    noteKeyDouble +=1.0;
                }
                if(noteKeyDouble >= lenghtOfScale){
                    noteKeyDouble -= lenghtOfScale-1;
                }
        }
        return scaleNotesString;
    }

    setAndCalculateRandomScale(){
        let scaleKeyArray = Array.from(Scale.scalesMap.keys());
        let noteKeyArray = Array.from(Scale.allNotesMap.keys());
        this.scaleNameString = scaleKeyArray.at(Math.floor(Math.random()*scaleKeyArray.length));
        this.rootNoteKeyDouble = noteKeyArray.at(Math.floor(Math.random() * noteKeyArray.length))
        return this.calculateScale();  
    }

    getRootNoteKeyDouble() {
        return this.rootNoteKeyDouble;
    }
    setRootNoteKeyDouble(rootNoteKeyDouble) {
        this.rootNoteKeyDouble = rootNoteKeyDouble;
    }
    getScaleNameString() {
        return this.scaleNameString;
    }
    setScaleNameString(scaleNameString) {
        this.scaleNameString = scaleNameString;
    }
    getScaleNotes() {
        return this.scaleNotes;
    }
    setScaleNotes(scaleNotes) {
        this.scaleNotes = scaleNotes;
    }
    static getNotesMap() {
        return Scale.allNotesMap;
    }
    static setNotesMap(notesMap) {
        Scale.allNotesMap = notesMap;
    }
    static getScalesMap() {
        return Scale.scalesMap;
    }
    static setScalesMap(scalesMap) {
        Scale.scalesMap = scalesMap;
    }
}







class ScaleView {
    static showOrHideScaleButton = document.getElementById('showOrHideScaleButton');
    randomScaleButton;
    static swtichSVGButton = document.getElementById('switchSVG');
    static isKeyboardSvgShown = true;

    static scalesSelectbox = document.getElementById('selectedScales');
    static notesSelectbox = document.getElementById('selectedNotes');
    static scaleTextView = document.getElementById('scaleTextView');
    static scaleClass = new Scale();
    static noteColorMap = new Map();
    static showScaleBoolean = false;
    static keyboardSVG = document.getElementById('keyboardSVG');
    static guitarSVG = document.getElementById('guitarSVG');
    static svgContainerDiv = document.getElementById('svg-container');

    constructor(){
        ScaleView.showKeyboardSVG();
        this.initializeNoteColorMap();
        ScaleView.scalesSelectbox.onchange = function(){
            ScaleView.scaleClass.setScaleNameString(this.value);
            if(ScaleView.showScaleBoolean){
                ScaleView.showScale();
            }
        };
        
        ScaleView.notesSelectbox.onchange = function(){
            ScaleView.scaleClass.rootNoteKeyDouble = parseFloat(this.value);
            if(ScaleView.showScaleBoolean){
                ScaleView.showScale();
            }
        };
        
        ScaleView.showOrHideScaleButton.addEventListener('click', function(){
            if(ScaleView.showScaleBoolean){
                ScaleView.hideScale();
                ScaleView.showScaleBoolean = false;
            }
            else{
                ScaleView.showScale();
                ScaleView.showScaleBoolean = true;
            }

        })
        this.randomScaleButton = document.getElementById('randomScale');
        this.randomScaleButton.addEventListener('click', function(){
            
            let scaleString = ScaleView.scaleClass.setAndCalculateRandomScale();
            if(ScaleView.showScaleBoolean){
                ScaleView.scaleTextView.innerText = scaleString;
                if(ScaleView.isKeyboardSvgShown){
                    ScaleView.highlightKeyboardNotes();
                }
                else{
                    ScaleView.highlightGuitarNotes();
                }
            }
            ScaleView.scalesSelectbox.value = ScaleView.scaleClass.getScaleNameString();
            ScaleView.notesSelectbox.value = ScaleView.scaleClass.rootNoteKeyDouble;
        })

        ScaleView.swtichSVGButton.addEventListener('click',function(){
            ScaleView.swtichSVG();

            let svgLabel= document.getElementById('switchSVGLabel');
            if(ScaleView.isKeyboardSvgShown){
                svgLabel.innerText ='Guitar';
                if(ScaleView.showScaleBoolean){
                    ScaleView.highlightKeyboardNotes();
                }
                else{
                    ScaleView.resetKeyboardNotes();
                }
            }
            else{
                svgLabel.innerText = 'Keyboard';

                if(ScaleView.showScaleBoolean){
                    if(ScaleView.showScaleBoolean){
                        ScaleView.highlightGuitarNotes();
                    }
                }
                else{
                    ScaleView.resetGuitarNotes();
                }
            }
        } );
    }

    static showScale(){
        ScaleView.showScaleBoolean = true;
        ScaleView.scaleTextView.innerText = ScaleView.scaleClass.calculateScale();
        if (ScaleView.isKeyboardSvgShown){
            ScaleView.highlightKeyboardNotes();
        }
        else{
            ScaleView.highlightGuitarNotes();
        }
        document.getElementById('showScaleLabel').innerText = 'Hide Scale';
        
    }

    static hideScale(){
        ScaleView.showScaleBoolean = false;
        ScaleView.scaleTextView.innerText = '';
        if(ScaleView.isKeyboardSvgShown){
            ScaleView.resetKeyboardNotes();
        }
        else{
            ScaleView.resetGuitarNotes();
        }
        document.getElementById('showScaleLabel').innerText = 'Show Scale';
    }
    
    static highlightKeyboardNotes(){
        ScaleView.resetKeyboardNotes();

        //Marks notes in scale
        let rootNoteKeyDouble = ScaleView.scaleClass.scaleNotes[0][0];
        
        ScaleView.scaleClass.scaleNotes.forEach(eachNote => {
            //c1 - h2 H=6.5 c1=1 d1<c1
           if(rootNoteKeyDouble <= eachNote[0]){
            document.getElementById(eachNote[1].concat("1")).style.fill = '#21BF75';//ScaleView.noteColorMap.get(eachNote);
           }
           else{
            document.getElementById(eachNote[1].concat("2")).style.fill = '#21BF75';//ScaleView.noteColorMap.get(eachNote);
           }
        });
    }

    static resetKeyboardNotes(){
        Scale.allNotesMap.forEach((eachNote, eachKey) => {
            let fill = '#ffffff';
            if([1.5, 2.5, 4, 5, 6].includes(eachKey)){
                fill = '#000000';   
            }
            document.getElementById(eachNote.concat("1")).style.fill = fill;
            document.getElementById(eachNote.concat("2")).style.fill = fill;
        });
    }


    static highlightGuitarNotes(){
        ScaleView.resetGuitarNotes();

        //Every guitarString has it's own start value
        let guitarStringsMap = new Map();
        guitarStringsMap.set('E', 3);
        guitarStringsMap.set('A', 5.5);
        guitarStringsMap.set('D', 2);
        guitarStringsMap.set('G', 4.5);
        guitarStringsMap.set('H', 6.5);
        guitarStringsMap.set('e', 3);

        let scaleNotesDoubles = [];
        ScaleView.scaleClass.scaleNotes.forEach(eachNote => {
            scaleNotesDoubles.push(eachNote[0]);
        });
        Array.from(guitarStringsMap.keys()).forEach(eachKey => {
            for(let j=1; j<=5; j++){
                let guitarStringDouble = guitarStringsMap.get(eachKey) + j*0.5;
                if(guitarStringDouble > 6.5){
                    guitarStringDouble = guitarStringDouble % 6.5 + 0.5;
                }
                if(scaleNotesDoubles.includes(guitarStringDouble)){
                    document.getElementById(eachKey.concat(j.toString()).concat("Guitar")).style.visibility = "visible";
                }
            }
        })

    }

    static resetGuitarNotes(){
        let guitarStrings = ['E', 'A','D','G','H','e']

        for(let i=0; i<guitarStrings.length; i++){
            for(let j=1; j<=5; j++){
                document.getElementById(guitarStrings[i].concat(j.toString()).concat("Guitar")).style.visibility = "hidden";
            }
        }
        
    }


    initializeNoteColorMap(){
        ScaleView.noteColorMap.set('C','#F26B8F');
        ScaleView.noteColorMap.set('C#','#F1A7F2');
        ScaleView.noteColorMap.set('D','#A2F2E4');
        ScaleView.noteColorMap.set('D#','#F2B705');
        ScaleView.noteColorMap.set('E','#F28705');
        ScaleView.noteColorMap.set('F','#014040');
        ScaleView.noteColorMap.set('F#','#1BA673');
        ScaleView.noteColorMap.set('G','#21BF75');
        ScaleView.noteColorMap.set('G#','#F2EFBB');
        ScaleView.noteColorMap.set('A','#F29991');
        ScaleView.noteColorMap.set('A#','#B57114');
        ScaleView.noteColorMap.set('H','#962B09');
      }

    static showGuitarSVG(){
       ScaleView.svgContainerDiv.removeChild(ScaleView.keyboardSVG);
       ScaleView.svgContainerDiv.appendChild(ScaleView.guitarSVG);
    }
    static showKeyboardSVG(){
        ScaleView.svgContainerDiv.removeChild(ScaleView.guitarSVG);
        ScaleView.svgContainerDiv.appendChild(ScaleView.keyboardSVG);
    }
    
    static swtichSVG(){
        if(ScaleView.svgContainerDiv.firstElementChild == ScaleView.keyboardSVG){
            ScaleView.showGuitarSVG();
            ScaleView.isKeyboardSvgShown = false;
        }
        else{
            ScaleView.showKeyboardSVG();
            ScaleView.isKeyboardSvgShown = true;
        }
    }
}



new ScaleView();
