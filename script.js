class Scale {
    static allNotesMap;
    static scalesMap;
    rootNoteKeyDouble;
    scaleNameString;
    scaleNotes = [];    
    
    constructor(scaleString, rootNoteKeyDouble){
        
        Scale.initializeNotesMap();
        Scale.initializeScalesMap();
        this.setScaleNameString('Ionisch');
        this.setRootNoteKeyDouble(1.0);
    }

    static initializeNotesMap(){
        // Return map of: (key: double, value: String)
        //Initialize @allNotesMap, that contains all notes as values with their represantative double...
        Scale.setAllNotesMap(new Map([ 
            [1.0, 'C'],
            [1.5, 'C#'],
            [2.0, 'D'],
            [2.5, 'D#'],
            [3.0, 'E'],
            [3.5, 'F'],
            [4.0, 'F#'],
            [4.5, 'G'],
            [5.0, 'G#'],
            [5.5, 'A'],
            [6.0, 'A#'],
            [6.5, 'H']
        ]));
    }
    
    
    static initializeScalesMap(){
        Scale.setScalesMap(new Map([
            ['Ionisch', [7, 2, 6]],
            ['Dorisch', [7, 1, 5]],
            ['Phrygisch', [7, 0, 4]],
            ['Lydisch', [7, 3, 7]],
            ['Mixolydisch', [7, 2, 5]],
            ['Äolisch', [7, 1, 4]],
            ['Lokrisch', [7, 0, 3]],
            ['DurPentatonik', [7, 2, 6]],
            ['MolPentatonik', [7, 1, 4]],
        ]));
    }
    
    calculateScale(){
        let noteKeyDouble = this.getRootNoteKeyDouble();
        let lenghtOfScale = Scale.getScalesMap().get(this.getScaleNameString()).at(0);
        let halfSteps = Scale.getScalesMap().get(this.getScaleNameString()).slice(1,lenghtOfScale);
        let scaleNotesString = '';
        this.setScaleNotes([]);

        for (let i=0; i<lenghtOfScale; i++){
            if(!(this.getScaleNameString()=='DurPentatonik' && (i==3 || i==6)) && !(this.getScaleNameString()=='MolPentatonik' && (i==1 || i==5))){
                scaleNotesString = scaleNotesString.concat(Scale.getAllNotesMap().get(noteKeyDouble),' | '); 
                this.getScaleNotes().push([noteKeyDouble, Scale.getAllNotesMap().get(noteKeyDouble)]);
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

    calculateScaleString(){
        this.getScaleNotes.forEach(element => {
            element[0]            
        });
    }

    setAndCalculateRandomScale(){
        let scaleKeyArray = Array.from(Scale.scalesMap.keys());
        let noteKeyArray = Array.from(Scale.allNotesMap.keys());
        this.setScaleNameString(scaleKeyArray.at(Math.floor(Math.random()*scaleKeyArray.length)));
        this.setRootNoteKeyDouble(noteKeyArray.at(Math.floor(Math.random() * noteKeyArray.length)));
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
    static getAllNotesMap() {
        return Scale.allNotesMap;
    }
    static setAllNotesMap(notesMap) {
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
    randomScaleButton;
    swtichSVGButton;
    isKeyboardSvgShown;
    showOrHideScaleButton;
    scalesSelectbox;
    notesSelectbox;
    scaleTextView;
    scaleClass;
    noteColorMap;
    showScaleBoolean;
    keyboardSVG;
    guitarSVG;
    svgContainerDiv;

    constructor(){
        this.swtichSVGButton = document.getElementById('switchSVG');
        this.isKeyboardSvgShown = true;
        this.showOrHideScaleButton = document.getElementById('showOrHideScaleButton');
        this.scalesSelectbox = document.getElementById('selectedScales');
        this.notesSelectbox = document.getElementById('selectedNotes');
        this.scaleTextView = document.getElementById('scaleTextView');
        this.scaleClass = new Scale();
        this.noteColorMap = new Map();
        this.showScaleBoolean = false;
        this.keyboardSVG = document.getElementById('keyboardSVG');
        this.guitarSVG = document.getElementById('guitarSVG');
        this.svgContainerDiv = document.getElementById('svg-container');
    
        this.showKeyboardSVG();
        this.initializeNoteColorMap();       
       
        this.randomScaleButton = document.getElementById('randomScale');
        this.randomScaleButton.addEventListener('click', () => this.randomScaleButtonClick());
        this.swtichSVGButton.addEventListener('click', () => this.swtichSVGButtonClick());
        this.showOrHideScaleButton.addEventListener('click', () => this.showOrHideScaleButtonClick());
        this.scalesSelectbox.onchange = () => this.scalesSelectboxOnchange;
        this.notesSelectbox.onchange = () => this.notesSelectboxOnchange();
    }

    scalesSelectboxOnchange(){
        this.scaleClass.setScaleNameString(this.value);
        if(this.showScaleBoolean){
            this.showScale();
        }   
    }

    notesSelectboxOnchange(){
        this.scaleClass.rootNoteKeyDouble = parseFloat(this.value);
        if(this.showScaleBoolean){
            this.showScale();
        }
    }

   showOrHideScaleButtonClick(){
        if(this.showScaleBoolean){
            this.hideScale();
            this.showScaleBoolean = false;
        }
        else{
            this.showScale();
            this.showScaleBoolean = true;
        }
    }

    randomScaleButtonClick(){
        let scaleString = this.scaleClass.setAndCalculateRandomScale();
        if(this.showScaleBoolean){
            this.scaleTextView.innerText = scaleString;
            if(this.isKeyboardSvgShown){
                this.highlightKeyboardNotes();
            }
            else{
                this.highlightGuitarNotes();
            }
        }
        this.scalesSelectbox.value = this.scaleClass.getScaleNameString();
        this.notesSelectbox.value = this.scaleClass.rootNoteKeyDouble;
    }

    swtichSVGButtonClick(){
        this.swtichSVG();
        let svgLabel= document.getElementById('switchSVGLabel');
        if(this.isKeyboardSvgShown){
            svgLabel.innerText ='Guitar';
            if(this.showScaleBoolean){
                this.highlightKeyboardNotes();
            }
            else{
                this.resetKeyboardNotes();
            }
        }
        else{
            svgLabel.innerText = 'Keyboard';

            if(this.showScaleBoolean){
                if(this.showScaleBoolean){
                    this.highlightGuitarNotes();
                }
            }
            else{
                this.resetGuitarNotes();
            }
        }
    }

    showScale(){
        this.showScaleBoolean = true;
        this.scaleTextView.innerText = this.scaleClass.calculateScale();
        if (this.isKeyboardSvgShown){
            this.highlightKeyboardNotes();
        }
        else{
            this.highlightGuitarNotes();
        }
        document.getElementById('showScaleLabel').innerText = 'Hide Scale';
        
    }

    hideScale(){
        this.showScaleBoolean = false;
        this.scaleTextView.innerText = '';
        if(this.isKeyboardSvgShown){
            this.resetKeyboardNotes();
        }
        else{
            this.resetGuitarNotes();
        }
        document.getElementById('showScaleLabel').innerText = 'Show Scale';
    }
    
    highlightKeyboardNotes(){
        this.resetKeyboardNotes();

        //Marks notes in scale
        let rootNoteKeyDouble = this.scaleClass.scaleNotes[0][0];
        
        this.scaleClass.scaleNotes.forEach(eachNote => {
            //c1 - h2 H=6.5 c1=1 d1<c1
           if(rootNoteKeyDouble <= eachNote[0]){
            document.getElementById(eachNote[1].concat("1")).style.fill = '#21BF75';//this.noteColorMap.get(eachNote);
           }
           else{
            document.getElementById(eachNote[1].concat("2")).style.fill = '#21BF75';//this.noteColorMap.get(eachNote);
           }
        });
    }

    resetKeyboardNotes(){
        Scale.allNotesMap.forEach((eachNote, eachKey) => {
            let fill = '#ffffff';
            if([1.5, 2.5, 4, 5, 6].includes(eachKey)){
                fill = '#000000';   
            }
            document.getElementById(eachNote.concat("1")).style.fill = fill;
            document.getElementById(eachNote.concat("2")).style.fill = fill;
        });
    }


    highlightGuitarNotes(){
        this.resetGuitarNotes();

        //Every guitarString has it's own start value
        let guitarStringsMap = new Map();
        guitarStringsMap.set('E', 3);
        guitarStringsMap.set('A', 5.5);
        guitarStringsMap.set('D', 2);
        guitarStringsMap.set('G', 4.5);
        guitarStringsMap.set('H', 6.5);
        guitarStringsMap.set('e', 3);

        let scaleNotesDoubles = [];
        this.scaleClass.scaleNotes.forEach(eachNote => {
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

    resetGuitarNotes(){
        let guitarStrings = ['E', 'A','D','G','H','e']

        for(let i=0; i<guitarStrings.length; i++){
            for(let j=1; j<=5; j++){
                document.getElementById(guitarStrings[i].concat(j.toString()).concat("Guitar")).style.visibility = "hidden";
            }
        } 
    }

    showGuitarSVG(){
       this.svgContainerDiv.removeChild(this.keyboardSVG);
       this.svgContainerDiv.appendChild(this.guitarSVG);
    }
    showKeyboardSVG(){
        this.svgContainerDiv.removeChild(this.guitarSVG);
        this.svgContainerDiv.appendChild(this.keyboardSVG);
    }
    
    swtichSVG(){
        if(this.svgContainerDiv.firstElementChild == this.keyboardSVG){
            this.showGuitarSVG();
            this.isKeyboardSvgShown = false;
        }
        else{
            this.showKeyboardSVG();
            this.isKeyboardSvgShown = true;
        }
    }

    initializeNoteColorMap(){
        this.noteColorMap.set('C','#F26B8F');
        this.noteColorMap.set('C#','#F1A7F2');
        this.noteColorMap.set('D','#A2F2E4');
        this.noteColorMap.set('D#','#F2B705');
        this.noteColorMap.set('E','#F28705');
        this.noteColorMap.set('F','#014040');
        this.noteColorMap.set('F#','#1BA673');
        this.noteColorMap.set('G','#21BF75');
        this.noteColorMap.set('G#','#F2EFBB');
        this.noteColorMap.set('A','#F29991');
        this.noteColorMap.set('A#','#B57114');
        this.noteColorMap.set('H','#962B09');
      }
}


new ScaleView();
