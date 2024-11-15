class Note {
    constructor(noteString, noteDouble, scaleDegree){
        this.noteString = noteString;
        this.noteDouble = noteDouble;
        this.scaleDegree = scaleDegree;
    }
}


class Scale {
    static ALL_NOTES_MAP;
    static ALL_NOTES_MAP_SWAPPED;
    static ALL_SCALES_MAP;
    static STANDARD_SCALE_MAP;
    static NOTES_ORDER_ARRAY;
    lengthOfScale;
    halfSteps;
    rootNoteKeyDouble;
    scaleNameString;
    scaleNotes = [];

    constructor(scaleString, rootNoteKeyDouble) {
        Scale.ALL_NOTES_MAP = new Map([
            [1.0, 'C'],
            [1.5, 'C#'],
            [15, 'Db'],
            [2.0, 'D'],
            [2.5, 'D#'],
            [25, 'Eb'],
            [3.0, 'E'],
            [30, 'Fb'],
            [35, 'E#'],
            [3.5, 'F'],
            [4.0, 'F#'],
            [40, 'Gb'],
            [4.5, 'G'],
            [5.0, 'G#'],
            [50, 'Ab'],
            [5.5, 'A'],
            [6.0, 'A#'],
            [60, 'Bb'],
            [6.5, 'B'],
            [65, 'Cb']
        ]);

        Scale.ALL_NOTES_MAP_SWAPPED = new Map([
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
            ['Bb', 6.0],
            ['B', 6.5],
            ['Cb', 6.5],
        ]);
        
        Scale.ALL_SCALES_MAP = new Map([
            ['MajorPentatonic', [7, 2, 6]], //False lengthOfScale 7 should be 5 
            ['MinorPentatonic', [7, 1, 4]],
            ['Major', [7, 2, 6]],
            //['Major', [0,2,2,1,2,2,2]],
            ['Minor', [7, 1, 4]],
            ['Ioanian', [7, 2, 6]],
            ['Dorian', [7, 1, 5]],
            ['Phrygian', [7, 0, 4]],
            ['Lydian', [7, 3, 7]],
            ['Mixolydian', [7, 2, 5]],
            ['Aeolian', [7, 1, 4]],
            ['Locrian', [7, 0, 3]]
        ]);

        Scale.NOTES_ORDER_ARRAY = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

        Scale.STANDARD_SCALE_MAP = new Map([
            ['MajorPentatonic', [7, 2, 6]],
            ['MinorPentatonic', [7, 1, 4]],
            ['Major', [7, 2, 6]],
            ['Minor', [7, 1, 4]]]);


        this.setScale(scaleString);
        this.setRootNoteKeyDouble(rootNoteKeyDouble);
    }

    calculateScale() {
        //
        let noteKeyDouble = this.getRootNoteKeyDouble();
        this.setScaleNotes([]);

        for (let i = 0; i < this.getLengthOfScale(); i++) {
            let aNote = new Note(Scale.getALL_NOTES_MAP().get(noteKeyDouble), noteKeyDouble, i+1);

            this.getScaleNotes().push(aNote);
            //Fixed 7 is not goood 
            if (noteKeyDouble > 7) {
                noteKeyDouble /= 10;
            }

            if (this.getHalfSteps().includes(i)) {
                noteKeyDouble += 0.5;
            }
            else {
                noteKeyDouble += 1.0;
            }

            if (noteKeyDouble >= this.getLengthOfScale()) {
                noteKeyDouble %= this.getLengthOfScale();
                noteKeyDouble++;
            }
        }
        //

        let notesString = '';
        let noteStringArray = [];
        let difference;

        let startingIndex = (this.getScaleNotes()[0].noteString.length == 1) ? Scale.NOTES_ORDER_ARRAY.indexOf(this.getScaleNotes()[0].noteString) : Scale.NOTES_ORDER_ARRAY.indexOf(this.getScaleNotes()[0].noteString[0]);

        for (let i = 0; i < this.getScaleNotes().length; i++) {
            if (!(this.getScaleNameString() == 'MajorPentatonic' && (i == 3 || i == 6)) && !(this.getScaleNameString() == 'MinorPentatonic' && (i == 1 || i == 5))) {

                let note = this.getScaleNotes()[i].noteString;
                let noteDouble = this.getScaleNotes()[i].noteDouble;
                let noteSuffix = '';
                let index = (startingIndex + i) % Scale.NOTES_ORDER_ARRAY.length;
                if (note[0] != Scale.NOTES_ORDER_ARRAY[index]) {
                    if (note[0] == 'C' && Scale.NOTES_ORDER_ARRAY[index][0] == 'B') {
                        noteDouble = 7;
                    }
                    else if (note[0] == 'B' && Scale.NOTES_ORDER_ARRAY[index][0] == 'C') {
                        noteDouble = 0.5;
                    }
                    else if (Scale.NOTES_ORDER_ARRAY[index][0] == 'C') {
                        noteDouble = 0.5;
                    }
                    difference = noteDouble - Scale.ALL_NOTES_MAP_SWAPPED.get(Scale.NOTES_ORDER_ARRAY[index]);
                    note = Scale.NOTES_ORDER_ARRAY[index];
                    while (difference != 0) {
                        if (difference > 0) {
                            noteSuffix += '#';
                            difference -= 0.5;
                        }
                        else {
                            noteSuffix += 'b';
                            difference += 0.5;
                        }
                    }
                }
                noteStringArray.push(note + noteSuffix);
            }
        }
        if (this.getRootNoteKeyDouble() > 10) {
            let tempRootNoteKeyDouble = this.getRootNoteKeyDouble() / 10;
            this.scaleNotes[0] = new Note(Scale.getALL_NOTES_MAP().get(tempRootNoteKeyDouble), tempRootNoteKeyDouble, 1);
        }

        //Pentatonic
        if (this.getScaleNameString().includes('Pentatonic')) {
            let withOutNotesAtPositionArray;
            if (this.getScaleNameString() == 'MajorPentatonic') {
                withOutNotesAtPositionArray = [6, 3];
            }
            else if (this.getScaleNameString() == 'MinorPentatonic') {
                withOutNotesAtPositionArray = [5, 1]
            }
            this.getScaleNotes().splice(withOutNotesAtPositionArray[0], 1);
            this.getScaleNotes().splice(withOutNotesAtPositionArray[1], 1);
        }

        return noteStringArray;
    }


    setAndCalculateRandomScale(aAreModesActivatedBoolean) {
        let scaleKeyArray = aAreModesActivatedBoolean ? Array.from(Scale.ALL_SCALES_MAP.keys()) : Array.from(Scale.STANDARD_SCALE_MAP.keys());
        let noteKeyArray = Array.from(Scale.ALL_NOTES_MAP.keys());
        this.setScale(scaleKeyArray.at(Math.floor(Math.random() * scaleKeyArray.length)));
        this.setRootNoteKeyDouble(noteKeyArray.at(Math.floor(Math.random() * noteKeyArray.length)));
        return this.calculateScale();
    }

    getChordMatchingToNote(aNote) {

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
    setScaleNameString(aScaleNameString) {
        this.scaleNameString = aScaleNameString;
    }

    setScale(aScaleNameString) {
        this.setScaleNameString(aScaleNameString);
        let scaleMap = Scale.getALL_SCALES_MAP().get(aScaleNameString);
        this.setLengthOfScale(scaleMap.at(0));
        this.setHalfSteps(scaleMap.slice(1, this.getLengthOfScale()));
    }
    getScaleNotes() {
        return this.scaleNotes;
    }
    setScaleNotes(scaleNotes) {
        this.scaleNotes = scaleNotes;
    }

    getLengthOfScale() {
        return this.lengthOfScale;
    }
    setLengthOfScale(anInteger) {
        this.lengthOfScale = anInteger;
    }

    getHalfSteps() {
        return this.halfSteps;
    }
    setHalfSteps(anArray) {
        this.halfSteps = anArray;
    }

    static getALL_NOTES_MAP() {
        return Scale.ALL_NOTES_MAP;
    }
    static setALL_NOTES_MAP(notesMap) {
        Scale.ALL_NOTES_MAP = notesMap;
    }
    static getALL_SCALES_MAP() {
        return Scale.ALL_SCALES_MAP;
    }
}


class ScaleView {
    randomScaleButton;
    swtichSVGButton;
    showOrHideScaleButton;
    scalesSelectbox;
    notesSelectbox;
    scaleTextView;
    scale;
    noteColorMap;
    showScaleBoolean;
    keyboardSVG;
    guitarSVG;
    guitarGroupNotesLayerSVG;
    guitarFretBoardPosition;
    svgContainerDiv;
    modesButton;
    highestFretNumber;
    lowestFretNumber;

    constructor() {
        this.swtichSVGButton = document.getElementById('switchSVG');
        this.showOrHideScaleButton = document.getElementById('showOrHideScaleButton');
        this.scalesSelectbox = document.getElementById('selectedScales');
        this.notesSelectbox = document.getElementById('selectedNotes');
        this.scaleTextView = document.getElementById('scaleTextView');
        this.keyboardSVG = document.getElementById('keyboardSVG');
        this.guitarSVG = document.getElementById('guitarSVG');
        this.svgContainerDiv = document.getElementById('svgContainer');
        this.modesButton = document.getElementById('modesButton');
        this.scale = new Scale('Major', 1);
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

        this.guitarGroupNotesLayerSVG = document.createElementNS("http://www.w3.org/2000/svg","g");
        this.guitarSVG.appendChild(this.guitarGroupNotesLayerSVG);
    }

    scalesSelectboxOnchange() {
        this.scale.setScale(this.scalesSelectbox.value);
        if (this.showScaleBoolean) {
            this.showScale();
        }
    }

    notesSelectboxOnchange() {
        this.scale.setRootNoteKeyDouble(parseFloat(this.notesSelectbox.value));
        if (this.showScaleBoolean) {
            this.showScale();
        }
    }

    showOrHideScaleButtonClick() {
        if (this.showScaleBoolean) {
            this.hideScale();
            this.showScaleBoolean = false;
        }
        else {
            this.showScale();
            this.showScaleBoolean = true;
        }
    }

    modesButtonClick() {

        for (let i = 0; i < this.scalesSelectbox.options.length; i++) {
            if (i > 3) {
                if (this.scalesSelectbox.options[i].classList.contains('modesOptionInvisible')) {
                    this.scalesSelectbox.options[i].classList.remove('modesOptionInvisible');
                    this.scalesSelectbox.value = 'Ioanian';
                    this.modesButton.innerText = 'Hide Modes'
                }
                else {
                    this.scalesSelectbox.options[i].classList.add('modesOptionInvisible');
                    this.scalesSelectbox.value = 'Major';
                    this.modesButton.innerText = 'Show Modes';
                }
            }
        }
        this.scalesSelectboxOnchange();
    }

    randomScaleButtonClick() {

        let scaleString = this.scale.setAndCalculateRandomScale(this.modesButton.innerText == 'Hide Modes');
        if (this.showScaleBoolean) {
            this.showScale();
            this.highlightNotes();
        }
        this.scalesSelectbox.value = this.scale.getScaleNameString();
        this.notesSelectbox.value = this.scale.rootNoteKeyDouble;
    }

    swtichSVGButtonClick() {
        this.swtichSVG();
        let svgLabel = document.getElementById('switchSVGLabel');
        if (Array.from(this.svgContainerDiv.children).includes(this.keyboardSVG)) {
            svgLabel.innerText = 'Guitar';
            if (this.showScaleBoolean) {
                this.highlightKeyboardNotes();
            }
            else {
                this.resetKeyboardNotes();
            }
        }
        else {
            svgLabel.innerText = 'Keyboard';

            if (this.showScaleBoolean) {
                if (this.showScaleBoolean) {
                    this.highlightGuitarNotes();
                }
            }
            else {
                this.resetGuitarNotes();
            }
        }
    }

    showScale() {
        this.showScaleBoolean = true;

        let i = 0;
        //Ugly aber später
        this.scaleTextView.innerText = '';
        let scaleStringArray = this.scale.calculateScale();
        this.scale.scaleNotes.forEach(scaleNote => {
            let noteSpan = document.createElement('span');
            noteSpan.innerText = scaleStringArray[i];
            noteSpan.classList.add("notesAsChars")
            noteSpan.style.backgroundColor = this.noteColorMap.get(scaleNote.noteString);
            this.scaleTextView.appendChild(noteSpan);
            i++;
        });
        //

        this.highlightNotes();
        document.getElementById('showScaleLabel').innerText = 'Hide Scale';

    }

    hideScale() {
        this.showScaleBoolean = false;
        this.scaleTextView.innerText = '';
        if (this.svgContainerDiv.firstElementChild == this.keyboardSVG) {
            this.resetKeyboardNotes();
        }
        else {
            this.resetGuitarNotes();
        }
        document.getElementById('showScaleLabel').innerText = 'Show Scale';
    }

    highlightStringNotes() {
        let scaleNotesString = this.scale.calculateScale();
    }

    highlightNotes(){
        if (this.svgContainerDiv.firstElementChild == this.keyboardSVG) {
            this.highlightKeyboardNotes();
        }
        else {
            this.highlightGuitarNotes();
        }
    }
    highlightKeyboardNotes() {
        // Braucht eine andere Datenstruktur?
        this.resetKeyboardNotes();

        //Marks notes in scale
        let rootNoteKeyDouble = this.scale.scaleNotes[0].noteDouble;

        this.scale.scaleNotes.forEach(eachNote => {
            //c1 - h2 H=6.5 c1=1 d1<c1
            if (rootNoteKeyDouble <= eachNote.noteDouble) {
                document.getElementById(eachNote.noteString.concat("1")).style.fill = this.noteColorMap.get(eachNote.noteString);
            }
            else {
                document.getElementById(eachNote.noteString.concat("2")).style.fill = this.noteColorMap.get(eachNote.noteString);
            }
        });
    }

    resetKeyboardNotes() {
        Scale.ALL_NOTES_MAP.forEach((eachNote, eachKey) => {
            let fill = '#ffffff';
            if ([1.5, 2.5, 4, 5, 6].includes(eachKey)) {
                fill = '#000000';
            }
            //dirty fix
            if (document.getElementById(eachNote.concat("1")) != null && document.getElementById(eachNote.concat("2")) != null) {
                document.getElementById(eachNote.concat("1")).style.fill = fill;
                document.getElementById(eachNote.concat("2")).style.fill = fill;
            }
        });
    }

    setFretsHigher() {
        this.guitarFretBoardPosition += 1;
        this.lowestFretNumber.innerHTML = this.guitarFretBoardPosition + 1;
        this.highestFretNumber.innerHTML = this.guitarFretBoardPosition + 5;
        if (this.showScaleBoolean) {
            this.highlightGuitarNotes();
        }
    }

    setFretsLower() {
        if (this.guitarFretBoardPosition == 0) {
            return false;
        }
        this.guitarFretBoardPosition -= 1;
        this.lowestFretNumber.innerHTML = this.guitarFretBoardPosition + 1;
        this.highestFretNumber.innerHTML = this.guitarFretBoardPosition + 5;
        if (this.showScaleBoolean) {
            this.highlightGuitarNotes();
        }
    }

    highlightGuitarNotes() {

        this.resetGuitarNotes();

        //Every guitarString has it's own start value
        let guitarStringsMap = new Map();
        guitarStringsMap.set('E', 3 + this.guitarFretBoardPosition * 0.5);
        guitarStringsMap.set('A', 5.5 + this.guitarFretBoardPosition * 0.5);
        guitarStringsMap.set('D', 2 + this.guitarFretBoardPosition * 0.5);
        guitarStringsMap.set('G', 4.5 + this.guitarFretBoardPosition * 0.5);
        guitarStringsMap.set('B', 6.5 + this.guitarFretBoardPosition * 0.5);
        guitarStringsMap.set('e', 3 + this.guitarFretBoardPosition * 0.5);

        let scaleNotesMap = new Map();
        this.scale.scaleNotes.forEach(eachNote => {
            scaleNotesMap.set(eachNote.noteDouble,  eachNote);
        });
        let y= 5;
        Array.from(guitarStringsMap.keys()).forEach(eachKey => {
            let eachKeyDouble = Scale.ALL_NOTES_MAP_SWAPPED.get(eachKey.toUpperCase());
            if(scaleNotesMap.has(eachKeyDouble)){
                document.getElementById("textOpenString".concat(eachKey)).style.fill = this.noteColorMap.get(Scale.ALL_NOTES_MAP.get(eachKeyDouble));
            }
            for (let x = 1; x <= 5; x++) {
                let guitarStringDouble = guitarStringsMap.get(eachKey) + x * 0.5;
                if (guitarStringDouble > 6.5) {
                    guitarStringDouble = guitarStringDouble % 6.5 + 0.5;
                }
                if (scaleNotesMap.has(guitarStringDouble)) {
                    let aNote = scaleNotesMap.get(guitarStringDouble);
                    this.createGuitarNoteForm([x-1,y], aNote.scaleDegree, aNote);
                }
            }
            y--;
        })
    }

    resetGuitarNotes() {
        let guitarStrings = ['E', 'A', 'D', 'G', 'B', 'e']

        for (let i = 0; i < 6; i++) {
            document.getElementById("textOpenString".concat(guitarStrings[i])).style.fill = "#dcdcdc";
        }
        this.guitarGroupNotesLayerSVG.replaceChildren();
    }

   
    createGuitarNoteForm(aPositionArray, aScaleDegree, aNote){
        let noteForm;
        let xOffset = aPositionArray[0] * 20;
        let yOffset = aPositionArray[1] * 10;
        let svgNs = "http://www.w3.org/2000/svg";
        switch(aScaleDegree){
            case 1:
                noteForm = document.createElementNS(svgNs,"circle"); 
                noteForm.setAttributeNS(null,"cx",22.5 + xOffset);
                noteForm.setAttributeNS(null,"cy",4.5 + yOffset);
                noteForm.setAttributeNS(null,"r",4.5);
                noteForm.setAttributeNS(null,"stroke","none");
                break;
            case 2:
                noteForm = document.createElementNS(svgNs,"ellipse");
                noteForm.setAttributeNS(null,"cx",22.5 + xOffset);
                noteForm.setAttributeNS(null,"cy",5 + yOffset);
                noteForm.setAttributeNS(null,"rx",4.5);
                noteForm.setAttributeNS(null,"ry", 2.25)
                noteForm.setAttributeNS(null,"stroke","none");
                break;
            case 3:
                noteForm = document.createElementNS(svgNs,"path");  
                noteForm.setAttributeNS(null, "d", "m 13.5,1 4,7 -8,-2e-7 z");  
                noteForm.setAttributeNS(null, "transform", "matrix(1,0,0,1," + (9 + xOffset) + "," + (-1 + yOffset)+")");
                noteForm.setAttributeNS(null, "opacity", 1);  
                break;
            case 4:
                noteForm = document.createElementNS(svgNs, "rect");
                noteForm.setAttributeNS(null,"width",9);
                noteForm.setAttributeNS(null,"height",9);
                noteForm.setAttributeNS(null,"x",18 + xOffset);
                noteForm.setAttributeNS(null,"y",1 + yOffset);
                break;
            case 5:
                let transform = "matrix(1,0,0,1," + (8 + xOffset) + "," + (-1 + yOffset)+")";
                noteForm = document.createElementNS(svgNs,"path");  
                noteForm.setAttributeNS(null, "d", "M 11,-9e-6 15,3 14,8 8,8 7,3 Z");  
                noteForm.setAttributeNS(null, "transform","matrix(1,0,0,1,"+(12+xOffset)+","+(1+yOffset)+")"); 
                noteForm.setAttributeNS(null, "opacity", 1);  
                break;
            case 6:
                noteForm = document.createElementNS(svgNs,"path");  
                noteForm.setAttributeNS(null, "d", "M 41.5,9.5 36,6 36,-9e-6 41.5,-3.25 l 5.5,3 0,6.4 z");  
                noteForm.setAttributeNS(null, "transform","matrix(0.8,0,0,0.7,"+(-11+xOffset)+"," +(3.3+yOffset)+")"); 
                noteForm.setAttributeNS(null, "opacity", 1);  
                break;
            case 7:
                noteForm = document.createElementNS(svgNs,"path");  
                noteForm.setAttributeNS(null, "d", "m 63, 5 -5 ,2.5 -5,-2.3 -1.4,-5.4 3.4,-4.5 5.6,-0.1 3.6,4.3 z");  
                noteForm.setAttributeNS(null, "transform","matrix(0.7,0,0,0.7,"+(-18+xOffset)+","+(4+yOffset)+")"); 
                noteForm.setAttributeNS(null, "opacity", 1);  
                break;
            
        }
        noteForm.style.fill = this.noteColorMap.get(aNote.noteString);
        this.guitarGroupNotesLayerSVG.appendChild(noteForm);

    }

    showGuitarSVG() {
        this.svgContainerDiv.removeChild(this.keyboardSVG);
        this.svgContainerDiv.appendChild(this.guitarSVG);
    }
    showKeyboardSVG() {
        this.svgContainerDiv.removeChild(this.guitarSVG);
        this.svgContainerDiv.appendChild(this.keyboardSVG);
    }

    swtichSVG() {
        if (Array.from(this.svgContainerDiv.children).includes(this.keyboardSVG)) {
            this.showGuitarSVG();
            if (this.highestFretNumber == null || this.lowestFretNumber == null) {
                this.highestFretNumber = document.getElementById('highestFretNumber');
                this.lowestFretNumber = document.getElementById('lowestFretNumber');
                document.getElementById("fretsHigher").addEventListener('click', () => this.setFretsHigher());
                document.getElementById("fretsLower").addEventListener('click', () => this.setFretsLower());
            }
        }
        else {
            this.showKeyboardSVG();
        }
    }

    initializeNoteColorMap() {
        this.noteColorMap.set('C', '#F26B8F');
        this.noteColorMap.set('C#', '#F1A7F2');
        this.noteColorMap.set('Db', '#F1A7F2');
        this.noteColorMap.set('D', '#A2F2E4');
        this.noteColorMap.set('D#', '#F2B705');
        this.noteColorMap.set('Eb', '#F2B705');
        this.noteColorMap.set('E', '#F28705');
        //e# fehlt
        this.noteColorMap.set('Fb', '#B967FF');
        this.noteColorMap.set('F', '#B967FF');
        this.noteColorMap.set('F#', '#FF71CE');
        this.noteColorMap.set('Gb', '#FF71CE');
        this.noteColorMap.set('G', '#21BF75');
        this.noteColorMap.set('G#', '#F2EFBB');
        this.noteColorMap.set('Ab', '#F2EFBB');
        this.noteColorMap.set('A', '#F29991');
        this.noteColorMap.set('A#', '#B57114');
        this.noteColorMap.set('Bb', '#B57114');
        this.noteColorMap.set('B', '#962B09');
        this.noteColorMap.set('Cb', '#962B09');

    }
}


new ScaleView();
