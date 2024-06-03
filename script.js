class Scale {
    static allNotesMap;
    static allScaleMaps;
    static modesMap;
    static standardScaleMaps;
    length;
    halfSteps;
    scaleNotesString;
    rootNoteKeyDouble;
    scaleNameString;
    scaleNotes = [];    
    
    constructor(scaleString, rootNoteKeyDouble){
        Scale.initializeNotesMap();
        Scale.initializeModesMap();
        Scale.initializeStandardScaleMaps();
        Scale.initializeAllScaleMaps();
        this.setScale('Dur');
        this.setRootNoteKeyDouble(1.0);
    }

    static initializeNotesMap(){
        // Return map of: (key: double, value: String)
        //Initialize @allNotesMap, that contains all notes as values with their represantative double...
        Scale.setAllNotesMap(new Map([ 
            [1.0, 'C'],
            [1.5, 'C#'],
            [15, 'Db'],
            [2.0, 'D'],
            [2.5, 'D#'],
            [25, 'Eb'],
            [3.0, 'E'],
            [30, 'Fb'],
            [3.5, 'F'],
            [4.0, 'F#'],
            [40, 'Gb'],
            [4.5, 'G'],
            [5.0, 'G#'],
            [50, 'Ab'],
            [5.5, 'A'],
            [6.0, 'A#'],
            [60, 'Hb'],
            [6.5, 'H'],
            [65, 'Cb']
        ]));
    }
    
    
    static initializeAllScaleMaps(){
        //Redundanter Code
        Scale.setAllScaleMaps(new Map([
            ['DurPentatonik', [7, 2, 6]], //False Length 7 should be 5 
            ['MolPentatonik', [7, 1, 4]],
            ['Dur', [7, 2, 6]],
            ['Mol', [7, 1, 4]],
            ['Ionisch', [7, 2, 6]],
            ['Dorisch', [7, 1, 5]],
            ['Phrygisch', [7, 0, 4]],
            ['Lydisch', [7, 3, 7]],
            ['Mixolydisch', [7, 2, 5]],
            ['Äolisch', [7, 1, 4]],
            ['Lokrisch', [7, 0, 3]]
        ]));
    }
    static initializeStandardScaleMaps(){
        Scale.standardScaleMaps = new Map([ 
            ['DurPentatonik', [7, 2, 6]],
            ['MolPentatonik', [7, 1, 4]],
            ['Dur', [7, 2, 6]],
            ['Mol', [7, 1, 4]]]);
    }

    static initializeModesMap(){
        Scale.setModesMap(new Map([ ['Ionisch', [7, 2, 6]],
        ['Dorisch', [7, 1, 5]],
        ['Phrygisch', [7, 0, 4]],
        ['Lydisch', [7, 3, 7]],
        ['Mixolydisch', [7, 2, 5]],
        ['Äolisch', [7, 1, 4]],
        ['Lokrisch', [7, 0, 3]]]));
    }
    
    calculateScale(){
        let noteKeyDouble = this.getRootNoteKeyDouble();
        this.setScaleNotesString('');
        this.setScaleNotes([]);

        for (let i=0; i<this.getLength(); i++){

            this.getScaleNotes().push([noteKeyDouble, Scale.getAllNotesMap().get(noteKeyDouble)]);

            if(noteKeyDouble > 7){
                noteKeyDouble /= 10;
            }
            
            if(this.getHalfSteps().includes(i)){
                noteKeyDouble += 0.5;
            }
            else{
                noteKeyDouble +=1.0;
            }
            if(noteKeyDouble >= this.getLength()){
                noteKeyDouble %= this.getLength();
                noteKeyDouble ++;
            }
        }
        return this.getScaleNameString().includes('Pentatonik') ?  this.calculatePentatonicScaleString() : this.calculateScaleString();
    }

    calculatePentatonicScaleString(){
        this.scaleNotesString = this.calculateScaleString();
        let withOutNotesAtPositionArray;
        if(this.getScaleNameString()=='DurPentatonik'){
            withOutNotesAtPositionArray = [6,3];
        }
        else if(this.getScaleNameString()=='MolPentatonik'){
            withOutNotesAtPositionArray = [5, 1]
 
        }
        this.getScaleNotes().splice(withOutNotesAtPositionArray[0],1);
        this.getScaleNotes().splice(withOutNotesAtPositionArray[1],1); 
        return this.scaleNotesString
    }

    calculateScaleString(){        
       let notesString = '';
       let noteStringArray = [];
        let notesOrder = ['C','D','E','F','G','A','H'];
        let difference;
        let allNotesMapSwapped = new Map([ 
            ['C', 1.0],
            ['C#', 1.5],
            ['Db', 1.5],
            ['D', 2.0],
            ['D#', 2.5],
            ['Eb', 2.5],
            ['E', 3.0],
            ['Fb', 3.0],
            ['F', 3.5],
            ['F#', 4.0],
            ['Gb', 4.0],
            ['G', 4.5],
            ['G#', 5.0],
            ['Ab', 5.0],
            ['A', 5.5],
            ['A#', 6.0],
            ['Hb', 6.0],
            ['H', 6.5],
            ['Cb', 6.5],
        ]);

        let startingIndex = (this.getScaleNotes()[0][1].length == 1) ? notesOrder.indexOf(this.getScaleNotes()[0][1]) : notesOrder.indexOf(this.getScaleNotes()[0][1][0]);
        
        for (let i = 0; i < this.getScaleNotes().length; i++){
                if(!(this.getScaleNameString()=='DurPentatonik' && (i==3 || i==6)) && !(this.getScaleNameString()=='MolPentatonik' && (i==1 || i==5))){

                    let note = this.getScaleNotes()[i][1];
                    let noteDouble = this.getScaleNotes()[i][0];
                    let noteSuffix = '';
                    let index = (startingIndex + i) % notesOrder.length;
                    if(note[0] != notesOrder[index]){
                        if(note[0] == 'C' && notesOrder[index][0] == 'H'){
                            noteDouble = 7;
                        }
                    else if( note[0] == 'H' && notesOrder[index][0] == 'C'){
                            noteDouble = 0.5;
                    }
                        difference = noteDouble - allNotesMapSwapped.get(notesOrder[index]);
                        note = notesOrder[index];
                        while(difference != 0){
                            if(difference > 0){
                                noteSuffix += '#';
                                difference -= 0.5;
                            }
                            else{
                                noteSuffix += 'b';
                                difference += 0.5;
                            }
                        }
                    }
                    noteStringArray.push(note + noteSuffix);
                }
        }
        if(this.getRootNoteKeyDouble() > 10){
            let tempRootNoteKeyDouble = this.getRootNoteKeyDouble()/10;
            this.scaleNotes[0] = [tempRootNoteKeyDouble, Scale.getAllNotesMap().get(tempRootNoteKeyDouble)];
        }
        return noteStringArray;
    }

    setAndCalculateRandomScale(aAreModesActivatedBoolean){
        let scaleKeyArray = aAreModesActivatedBoolean ? Array.from(Scale.modesMap.keys()) : Array.from(Scale.standardScaleMaps.keys()) ;
        let noteKeyArray = Array.from(Scale.allNotesMap.keys());
        this.setScale(scaleKeyArray.at(Math.floor(Math.random()*scaleKeyArray.length)));
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
    setScaleNameString(aScaleNameString){
        this.scaleNameString = aScaleNameString;
    }

    setScale(aScaleNameString) {
        this.setScaleNameString(aScaleNameString);
        let scaleMap = Scale.getAllScaleMaps().get(aScaleNameString);
        this.setLength(scaleMap.at(0));
        this.setHalfSteps(scaleMap.slice(1,this.getLength()));
    }
    getScaleNotes() {
        return this.scaleNotes;
    }
    setScaleNotes(scaleNotes) {
        this.scaleNotes = scaleNotes;
    }

    getLength() {
        return this.length;
    }
    setLength(anInteger) {
        this.length = anInteger;
    }

    getHalfSteps() {
        return this.halfSteps;
    }
    setHalfSteps(anArray) {
        this.halfSteps = anArray;
    }

    getScaleNotesString() {
        return this.scaleNotesString;
    }
    setScaleNotesString(aString) {
        this.scaleNotesString = aString;
    }

    static getAllNotesMap() {
        return Scale.allNotesMap;
    }
    static setAllNotesMap(notesMap) {
        Scale.allNotesMap = notesMap;
    }
    static getAllScaleMaps() {
        return Scale.allScaleMaps;
    }
    static setAllScaleMaps(allScaleMaps) {
        Scale.allScaleMaps = allScaleMaps;
    }

    static getModesMap(){
        return Scale.modesMap;
    }

    static setModesMap(modesMap){
        Scale.modesMap = modesMap;
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
    guitarFretBoardPosition;
    svgContainerDiv;
    modesButton;
    highestFretNumber;
    lowestFretNumber;

    constructor(){
        this.swtichSVGButton = document.getElementById('switchSVG');
        this.showOrHideScaleButton = document.getElementById('showOrHideScaleButton');
        this.scalesSelectbox = document.getElementById('selectedScales');
        this.notesSelectbox = document.getElementById('selectedNotes');
        this.scaleTextView = document.getElementById('scaleTextView');
        this.keyboardSVG = document.getElementById('keyboardSVG');
        this.guitarSVG = document.getElementById('guitarSVG');
        this.svgContainerDiv = document.getElementById('svg-container');
        this.modesButton = document.getElementById('modesButton');
        this.isKeyboardSvgShown = true;
        this.scaleClass = new Scale();
        this.noteColorMap = new Map();
        this.showScaleBoolean = false;
    
        this.showKeyboardSVG();
        this.initializeNoteColorMap();       
       
        this.randomScaleButton = document.getElementById('randomScale');
        this.randomScaleButton.addEventListener('click', () => this.randomScaleButtonClick());
        this.swtichSVGButton.addEventListener('click', () => this.swtichSVGButtonClick());
        this.showOrHideScaleButton.addEventListener('click', () => this.showOrHideScaleButtonClick());
        this.modesButton.addEventListener('click', () => this.modesButtonClick());
        this.scalesSelectbox.onchange = () => this.scalesSelectboxOnchange();
        this.notesSelectbox.onchange = () => this.notesSelectboxOnchange();

        this.guitarFretBoardPosition = 0;
      

    }

    scalesSelectboxOnchange(){
        this.scaleClass.setScale(this.scalesSelectbox.value);
        if(this.showScaleBoolean){
            this.showScale();
        }   
    }

    notesSelectboxOnchange(){
        this.scaleClass.setRootNoteKeyDouble(parseFloat(this.notesSelectbox.value));
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

    modesButtonClick(){
    
        for (let i = 0; i < this.scalesSelectbox.options.length; i++){
            if(i > 3){
                if( this.scalesSelectbox.options[i].classList.contains('modesOptionInvisible')){
                    this.scalesSelectbox.options[i].classList.add('modesOptionVisible');
                    this.scalesSelectbox.options[i].classList.remove('modesOptionInvisible');
                    this.scalesSelectbox.value = 'Ionisch';
                    this.modesButton.innerText = 'Hide Modes'
               }
               else{
                    this.scalesSelectbox.options[i].classList.add('modesOptionInvisible');
                    this.scalesSelectbox.options[i].classList.remove('modesOptionVisible');
                    this.scalesSelectbox.value = 'Dur';
                    this.modesButton.innerText = 'Show Modes';
               }
               this.scalesSelectboxOnchange();
               if(this.showScaleBoolean){
                    this.showScale();
                }
            }
        }
    }

    randomScaleButtonClick(){
        
        let scaleString =this.scaleClass.setAndCalculateRandomScale(  this.modesButton.innerText == 'Deactivate Modes' );
        if(this.showScaleBoolean){
            this.showScale();
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

        let i = 0;
        //Ugly aber später
        this.scaleTextView.innerText = '';
        let scaleStringArray = this.scaleClass.calculateScale();
        this.scaleClass.scaleNotes.forEach(scaleNote => {
            let noteSpan = document.createElement('span');
            noteSpan.innerText = scaleStringArray[i];
            noteSpan.style.backgroundColor = this.noteColorMap.get(scaleNote[1]);
            noteSpan.style.color = '#000000';
            noteSpan.style.margin = '5px';
            noteSpan.style.padding= '5px';
            this.scaleTextView.appendChild(noteSpan);
            i++;
        });
        //

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
    
    highlightStringNotes(){
        let scaleNotesString = this.scaleClass.calculateScale();
    }


    highlightKeyboardNotes(){
        // Braucht eine andere Datenstruktur?
        this.resetKeyboardNotes();

        //Marks notes in scale
        let rootNoteKeyDouble = this.scaleClass.scaleNotes[0][0];
        
        this.scaleClass.scaleNotes.forEach(eachNote => {
            //c1 - h2 H=6.5 c1=1 d1<c1
           if(rootNoteKeyDouble <= eachNote[0]){
            document.getElementById(eachNote[1].concat("1")).style.fill = /*'#21BF75';*/this.noteColorMap.get(eachNote[1]);
           }
           else{
            document.getElementById(eachNote[1].concat("2")).style.fill = /*'#21BF75';*/this.noteColorMap.get(eachNote[1]);
           }
        });
    }

    resetKeyboardNotes(){
        Scale.allNotesMap.forEach((eachNote, eachKey) => {
            let fill = '#ffffff';
            if([1.5, 2.5, 4, 5, 6].includes(eachKey)){
                fill = '#000000';   
            }
            //dirty fix
            if(document.getElementById(eachNote.concat("1")) != null && document.getElementById(eachNote.concat("2")) != null){
                document.getElementById(eachNote.concat("1")).style.fill = fill;
                document.getElementById(eachNote.concat("2")).style.fill = fill;
            }
        });
    }

    setFretsHigher(){
        this.guitarFretBoardPosition +=1;
        this.lowestFretNumber.innerHTML = this.guitarFretBoardPosition + 1;
        this.highestFretNumber.innerHTML = this.guitarFretBoardPosition + 5;
        if(this.showScaleBoolean){
            this.highlightGuitarNotes();
        }
    }

    setFretsLower(){
        if(this.guitarFretBoardPosition == 0){
            return false;
        }
        this.guitarFretBoardPosition -=1;
        this.lowestFretNumber.innerHTML = this.guitarFretBoardPosition + 1;
        this.highestFretNumber.innerHTML = this.guitarFretBoardPosition +5;
        if(this.showScaleBoolean){
            this.highlightGuitarNotes();
        }
    }

    highlightGuitarNotes(){

        this.resetGuitarNotes();

        //Every guitarString has it's own start value
        let guitarStringsMap = new Map();
        guitarStringsMap.set('E', 3 + this.guitarFretBoardPosition * 0.5);
        guitarStringsMap.set('A', 5.5 + this.guitarFretBoardPosition * 0.5);
        guitarStringsMap.set('D', 2 + this.guitarFretBoardPosition * 0.5) ;
        guitarStringsMap.set('G', 4.5 + this.guitarFretBoardPosition * 0.5);
        guitarStringsMap.set('H', 6.5 + this.guitarFretBoardPosition * 0.5);
        guitarStringsMap.set('e', 3 + this.guitarFretBoardPosition * 0.5);

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
                    let guitarNote = document.getElementById(eachKey.concat(j.toString()).concat("Guitar"));
                    guitarNote.style.visibility = "visible";
                    guitarNote.style.fill = this.noteColorMap.get(Scale.allNotesMap.get(guitarStringDouble));
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
            if(this.highestFretNumber == null || this.lowestFretNumber == null){
                this.highestFretNumber = document.getElementById('highestFretNumber');
                this.lowestFretNumber = document.getElementById('lowestFretNumber');
                this.highestFretNumber.addEventListener('click', () => this.setFretsHigher());
                this.lowestFretNumber.addEventListener('click', () => this.setFretsLower());
            }
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
        this.noteColorMap.set('Db','#F1A7F2');
        this.noteColorMap.set('D','#A2F2E4');
        this.noteColorMap.set('D#','#F2B705');
        this.noteColorMap.set('Eb','#F2B705');
        this.noteColorMap.set('E','#F28705');
        //e# fehlt
        this.noteColorMap.set('Fb','#B967FF');
        this.noteColorMap.set('F','#B967FF');
        this.noteColorMap.set('F#','#FF71CE');
        this.noteColorMap.set('Gb','#FF71CE');
        this.noteColorMap.set('G','#21BF75');
        this.noteColorMap.set('G#','#F2EFBB');
        this.noteColorMap.set('Ab','#F2EFBB');
        this.noteColorMap.set('A','#F29991');
        this.noteColorMap.set('A#','#B57114');
        this.noteColorMap.set('Hb','#B57114');
        this.noteColorMap.set('H','#962B09');
        this.noteColorMap.set('Cb','#962B09');

      }
}


let sv = new ScaleView();
