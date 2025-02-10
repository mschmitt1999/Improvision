class Note {
    chordNotes = [];
    chordType;
    harmonicString;
    constructor(noteString, noteDouble, scaleDegree) {
        this.noteString = noteString;
        this.noteDouble = noteDouble;
        this.scaleDegree = scaleDegree;
    }
}

class Scale {
    allNotesMap;
    allNotesMapSwapped;
    allScalesMap;
    notesOrderArray;
    rootNoteKeyDouble;
    scaleNameString;
    scaleNotes = [];
    scale

    constructor(scaleString, rootNoteKeyDouble) {
        this.initializeScaleMaps();
        this.setScale(scaleString);
        this.rootNoteKeyDouble = rootNoteKeyDouble;
    }

    initializeScaleMaps(){
        this.allNotesMap = new Map([
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
            [10, 'B#'],
            [65, 'Cb']
        ]);

        this.allNotesMapSwapped = new Map([
            ['C', 1.0],
            ['C#', 1.5],
            ['Db', 15],
            ['D', 2.0],
            ['D#', 2.5],
            ['Eb', 25],
            ['E', 3.0],
            ['Fb', 30],
            ['F', 3.5],
            ['F#', 4.0],
            ['Gb', 40],
            ['G', 4.5],
            ['G#', 5.0],
            ['Ab', 50],
            ['A', 5.5],
            ['A#', 6.0],
            ['Bb', 60],
            ['B', 6.5],
            ['B#', 10],
            ['Cb', 65],
        ]);

       this.allScalesMap = new Map([
            ['Major',[1,1,0.5,1,1,1,0.5]],
            ['Minor',[1,0.5,1,1,0.5,1,0.5]],
            ['MajorPentatonic',[1,1,0.5,1,1,1,0.5]],
            ['MinorPentatonic',[1,0.5,1,1,0.5,1,1]],
            ['Ioanian',[1,1,0.5,1,1,1,0.5]],
            ['Dorian',[1,0.5,1,1,1,0.5,1]],
            ['Phrygian',[0.5,1,1,1,0.5,1,1]],
            ['Lydian',[1,1,1,0.5,1,1,1]],
            ['Mixolydian',[1,1,0.5,1,1,0.5,1]],
            ['Aeolian',[1,0.5,1,1,0.5,1,1]],
            ['Locrian',[0.5,1,1,0.5,1,1,1]],
            ['Harmonic Minor', [1,0.5,1,1,0.5,1.5,0.5]],
            ['Melodic Minor', [1,0.5,1,1,0.5,1,0.5,0.5]]
        ])

        this.notesOrderArray = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    }

    calculateScale() {
        //
        let noteKeyDouble = this.rootNoteKeyDouble;
        this.scaleNotes = [];

        let scaleDegree = 0
        this.scale.forEach(steps => {
            scaleDegree ++
            let aNote = new Note(this.allNotesMap.get(noteKeyDouble), noteKeyDouble, scaleDegree);
            if (noteKeyDouble >= 10) {
                noteKeyDouble /= 10;
                aNote.noteDouble = noteKeyDouble
            }
            this.scaleNotes.push(aNote);

            noteKeyDouble += steps 
            if (noteKeyDouble > 6.5) {
                noteKeyDouble -= 6;
            }    
                    
        });
        //

        let notesString = '';
        let noteStringArray = [];
        let difference;

        let startingIndex = (this.scaleNotes[0].noteString.length == 1) ? this.notesOrderArray.indexOf(this.scaleNotes[0].noteString) : this.notesOrderArray.indexOf(this.scaleNotes[0].noteString[0]);

        for (let i = 0; i < this.scaleNotes.length; i++) {
            if (!(this.scaleNameString == 'MajorPentatonic' && (i == 3 || i == 6)) && !(this.scaleNameString == 'MinorPentatonic' && (i == 1 || i == 5))) {
                let note = this.scaleNotes[i].noteString;
                let noteDouble = this.scaleNotes[i].noteDouble;
                let noteSuffix = '';
                let index = (startingIndex + i) % this.notesOrderArray.length;
                if (note[0] != this.notesOrderArray[index]) {
                    if(this.notesOrderArray[index][0] == 'C' && this.allNotesMapSwapped.get(note[0]) > 2){
                        difference = noteDouble - 7
                    }
                    else{
                        if (note[0] == 'C' && this.notesOrderArray[index][0] == 'B') {
                            noteDouble = 7;
                        }
                        else if (note[0] == 'B' && this.notesOrderArray[index][0] == 'C') {
                            noteDouble = 0.5;
                        }
                        difference = noteDouble - this.allNotesMapSwapped.get(this.notesOrderArray[index]);
                    }
              
                    note = this.notesOrderArray[index];
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
                this.scaleNotes[i].harmonicString = note + noteSuffix;
            }
        }
        if (this.rootNoteKeyDouble >= 10) {
            let tempRootNoteKeyDouble = this.rootNoteKeyDouble / 10;
            this.scaleNotes[0] = new Note(this.allNotesMap.get(tempRootNoteKeyDouble), tempRootNoteKeyDouble, 1);
            this.scaleNotes[0].harmonicString = this.allNotesMap.get(this.rootNoteKeyDouble)
        }

        //Pentatonic
        if (this.scaleNameString.includes('Pentatonic')) {
            let withOutNotesAtPositionArray;
            if (this.scaleNameString == 'MajorPentatonic') {
                withOutNotesAtPositionArray = [6, 3];
            }
            else if (this.scaleNameString == 'MinorPentatonic') {
                withOutNotesAtPositionArray = [5, 1]
            }
            this.scaleNotes.splice(withOutNotesAtPositionArray[0], 1);
            this.scaleNotes.splice(withOutNotesAtPositionArray[1], 1);
        }
        this.setChordsOfScale();
        return noteStringArray;
    }

    setAndCalculateRandomScale(aAreModesActivatedBoolean) {
        let scaleKeyArray = aAreModesActivatedBoolean ? Array.from(this.allScalesMap.keys()) : ['MajorPentatonic', 'MinorPentatonic', 'Major', 'Minor'];
        let noteKeyArray = Array.from(this.allNotesMap.keys());
        this.setScale(scaleKeyArray.at(Math.floor(Math.random() * scaleKeyArray.length)));
        this.rootNoteKeyDouble = noteKeyArray.at(Math.floor(Math.random() * noteKeyArray.length));
        return this.calculateScale();
    }

    setChordsOfScale() {
        if(this.scaleNameString.includes("Pentatonic")){
            return
        }
        this.scaleNotes;
        let length = this.scaleNotes.length;
        for (let i = 0; i < length; i++) {
            let terz;
            let quinte;
            let rootNote = this.scaleNotes[i];
            let terzIndex = i+2;
            let quinteIndex = i+4;
            let terzDifference = 0;
            let quinteDifference = 0; 
            if(terzIndex >= length){
                terzIndex %= length;
                terz = this.scaleNotes[terzIndex];
                terzDifference = terz.noteDouble - rootNote.noteDouble; 
            }
            else{
                terz = this.scaleNotes[terzIndex];
                terzDifference = terz.noteDouble - rootNote.noteDouble;
            }
            if(terzDifference == 1.5 ||terzDifference == -4.5){
                rootNote.chordType = "minor";
            }
            else{
                rootNote.chordType = "major";
            }

            if(quinteIndex >= length){
                quinteIndex %= length;
                quinte = this.scaleNotes[quinteIndex];
                quinteDifference = quinte.noteDouble - rootNote.noteDouble;
            }
            else{
                quinte = this.scaleNotes[quinteIndex];
                quinteDifference = quinte.noteDouble - rootNote.noteDouble;
            }
            
            if(quinteDifference == 3 || quinteDifference == -3){
                rootNote.chordType += " diminished"
            }
            rootNote.chordNotes = [terz,quinte];
        }
    }

    setScale(aScaleNameString) {
        this.scaleNameString = aScaleNameString;
        this.scale = this.allScalesMap.get(aScaleNameString);
    }
}


class ScaleView {
    randomScaleButton;
    switchSVGButton;
    showOrHideScaleButton;
    scalesSelectbox;
    notesSelectbox;
    scaleTextView;
    scale;
    noteColorMap;
    showScaleBoolean;
    keyboardSVG;
    guitarSVG;
    bassSVG;
    guitarGroupNotesLayerSVG;
    bassGroupNotesLayerSVG
    guitarFretBoardPosition;
    bassFretBoardPosition;
    svgContainerDiv;
    modesButton;
    highestFretNumber;
    lowestFretNumber;
    showsGuitar = false;
    showsBass = false;
    showsKeyboard = true;

    constructor() {
        this.switchSVGButton = document.getElementById('switchSVG');
        this.showOrHideScaleButton = document.getElementById('showOrHideScaleButton');
        this.scalesSelectbox = document.getElementById('selectedScales');
        this.notesSelectbox = document.getElementById('selectedNotes');
        this.scaleTextView = document.getElementById('scaleTextView');
        this.keyboardSVG = document.getElementById('keyboardSVG');
        this.guitarSVG = document.getElementById('guitarSVG');
        this.bassSVG = document.getElementById('bassSVG');
        this.svgContainerDiv = document.getElementById('svgContainer');
        this.modesButton = document.getElementById('modesButton');
        this.scale = new Scale('Major', 1);
        this.noteColorMap = new Map();
        this.showScaleBoolean = false;

        this.setEventListeners()
        this.showKeyboardSVG();
        this.initializeNoteColorMap();
        this.initializeGuitarSvg();
        this.initializeBassSvg();        
    }

    initializeGuitarSvg(){
        this.guitarFretBoardPosition = 0;
        this.guitarGroupNotesLayerSVG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.guitarSVG.appendChild(this.guitarGroupNotesLayerSVG);
        this.svgContainerDiv.removeChild(this.guitarSVG);
    }

    initializeBassSvg(){
        this.bassFretBoardPosition = 0;
        this.bassGroupNotesLayerSVG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.bassSVG.appendChild(this.bassGroupNotesLayerSVG);
    }

    setEventListeners(){
        document.getElementById("fretsHigher").addEventListener('click', () => this.setFretsHigher());
        document.getElementById("fretsLower").addEventListener('click', () => this.setFretsLower());
        document.getElementById("bassFretsHigher").addEventListener('click', () => this.setFretsHigher());
        document.getElementById("bassFretsLower").addEventListener('click', () => this.setFretsLower());
        this.randomScaleButton = document.getElementById('randomScale');
        this.randomScaleButton.addEventListener('click', () => this.randomScaleButtonClick());
        this.switchSVGButton.addEventListener('click', () => this.switchSVGButtonClick());
        this.showOrHideScaleButton.addEventListener('click', () => this.showOrHideScaleButtonClick());
        this.modesButton.addEventListener('click', () => this.modesButtonClick());
        this.scalesSelectbox.onchange = () => this.scalesSelectboxOnchange();
        this.notesSelectbox.onchange = () => this.notesSelectboxOnchange();
    }

    scalesSelectboxOnchange() {
        this.scale.setScale(this.scalesSelectbox.value);
        if (this.showScaleBoolean) {
            this.showScale();
        }
    }

    notesSelectboxOnchange() {
        this.scale.rootNoteKeyDouble = parseFloat(this.notesSelectbox.value);
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
        this.scalesSelectbox.value = this.scale.scaleNameString;
        this.notesSelectbox.value = this.scale.rootNoteKeyDouble;
    }

    switchSVGButtonClick() {
        this.switchSVG();
        let svgLabel = document.getElementById('switchSVGLabel');
        this.svgContainerDivChildren = Array.from(this.svgContainerDiv.children);
        if (this.showsKeyboard) {
            svgLabel.innerText = 'Go to Guitar';
            if (this.showScaleBoolean) {
                this.highlightKeyboardNotes();
            }
            else {
                this.resetKeyboardNotes();
            }
        }
        else if (this.showsGuitar) {
            svgLabel.innerText = 'Go to Bass';

            if (this.showScaleBoolean) {
                if (this.showScaleBoolean) {
                    this.highlightGuitarNotes();
                }
            }
            else {
                this.resetGuitarNotes();
            }
        }
        else if (this.showsBass) {
            svgLabel.innerText = 'Go to Keyboard';
            if (this.showScaleBoolean) {
                if (this.showScaleBoolean) {
                    this.highlightBassNotes();
                }
            }
            else {
                this.resetBassNotes();
            }
        }
    }

    showScale() {
        this.showScaleBoolean = true;
        let i = 0;
        this.scaleTextView.innerText = '';
        let scaleStringArray = this.scale.calculateScale();
        this.scale.scaleNotes.forEach(scaleNote => {
            let noteSpan = document.createElement('span');
            noteSpan.innerText = scaleStringArray[i];
            noteSpan.classList.add("notesAsChars")
            noteSpan.style.backgroundColor = this.noteColorMap.get(scaleNote.noteString);
            noteSpan.addEventListener("click", () => this.highlightChord(scaleNote))
            this.scaleTextView.appendChild(noteSpan);
            i++;
        });
        this.highlightNotes();
        document.getElementById('showScaleLabel').innerText = 'Hide Scale';
    }

    highlightChord(scaleNote){
        console.log(scaleNote)
    }

    hideScale() {
        this.showScaleBoolean = false;
        this.scaleTextView.innerText = '';
        if (this.svgContainerDiv.firstElementChild == this.keyboardSVG) {
            this.resetKeyboardNotes();
        }
        else if (this.svgContainerDiv.firstElementChild == this.guitarSVG) {
            this.resetGuitarNotes();
        }
        else {
            this.resetBassNotes()
        }
        document.getElementById('showScaleLabel').innerText = 'Show Scale';
    }

    highlightStringNotes() {
        let scaleNotesString = this.scale.calculateScale();
    }

    highlightNotes() {
        if (this.svgContainerDiv.firstElementChild == this.keyboardSVG) {
            this.highlightKeyboardNotes();
        }
        else if (this.svgContainerDiv.firstElementChild == this.guitarSVG) {
            this.highlightGuitarNotes();
        }
        else {
            this.highlightBassNotes();
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
        this.scale.allNotesMap.forEach((eachNote, eachKey) => {
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

    resetFretsPosition() {
        this.guitarFretBoardPosition = 0;
        this.lowestFretNumber.innerHTML = 1;
        this.highestFretNumber.innerHTML = 5;
        if (this.showScaleBoolean) {
            if (this.showsGuitar) {
                this.highlightGuitarNotes();
            }
            else {
                this.highlightBassNotes();
            }
        }
    }

    setFretsHigher() {
        this.guitarFretBoardPosition = parseInt(this.lowestFretNumber.innerHTML);
        this.lowestFretNumber.innerHTML = this.guitarFretBoardPosition + 1;
        this.highestFretNumber.innerHTML = this.guitarFretBoardPosition + 5;
        if (this.showScaleBoolean) {
            if (this.showsGuitar) {
                this.highlightGuitarNotes();
            }
            else {
                this.highlightBassNotes();
            }
        }
    }

    setFretsLower() {
        if (this.guitarFretBoardPosition == 0) {
            return false;
        }
        this.guitarFretBoardPosition = parseInt(this.lowestFretNumber.innerHTML) - 2;
        this.lowestFretNumber.innerHTML = this.guitarFretBoardPosition + 1;
        this.highestFretNumber.innerHTML = this.guitarFretBoardPosition + 5;
        if (this.showScaleBoolean) {
            if (this.showsGuitar) {
                this.highlightGuitarNotes();
            }
            else {
                this.highlightBassNotes();
            }
        }
    }

    highlightStringInstrumentNotes(aStringInstrumentMap, idPrefixString, aSvgContainer) {
        this.resetStringInstrumentNotes(Array.from(aStringInstrumentMap.keys()), idPrefixString, aSvgContainer)

        let scaleNotesMap = new Map();
        this.scale.scaleNotes.forEach(eachNote => {
            scaleNotesMap.set(eachNote.noteDouble, eachNote);
        });
        let y = aStringInstrumentMap.size - 1;
        Array.from(aStringInstrumentMap.keys()).forEach(eachKey => {
            let eachKeyDouble = this.scale.allNotesMapSwapped.get(eachKey.toUpperCase());
            if (scaleNotesMap.has(eachKeyDouble)) {
                document.getElementById(idPrefixString.concat(eachKey)).style.fill = this.noteColorMap.get(this.scale.allNotesMap.get(eachKeyDouble));
            }
            for (let x = 1; x <= 5; x++) {
                let guitarStringDouble = aStringInstrumentMap.get(eachKey) + x * 0.5;
                if (guitarStringDouble > 6.5) {
                    guitarStringDouble = guitarStringDouble % 6.5 + 0.5;
                }
                if (scaleNotesMap.has(guitarStringDouble)) {
                    let aNote = scaleNotesMap.get(guitarStringDouble);
                    this.createGuitarNoteForm([x - 1, y], aNote.scaleDegree, aNote, aSvgContainer);
                }
            }
            y--;
        })
    }

    resetStringInstrumentNotes(aStringNotesArray, idPrefixString, aSvgContainer) {
        for (let i = 0; i < aStringNotesArray.length; i++) {
            document.getElementById(idPrefixString.concat(aStringNotesArray[i])).style.fill = "#dcdcdc";
        }
        aSvgContainer.replaceChildren();
    }
    highlightGuitarNotes() {
        //Every guitarString has it's own start value
        let guitarStringsMap = new Map();
        guitarStringsMap.set('E', 3 + this.guitarFretBoardPosition * 0.5);
        guitarStringsMap.set('A', 5.5 + this.guitarFretBoardPosition * 0.5);
        guitarStringsMap.set('D', 2 + this.guitarFretBoardPosition * 0.5);
        guitarStringsMap.set('G', 4.5 + this.guitarFretBoardPosition * 0.5);
        guitarStringsMap.set('B', 6.5 + this.guitarFretBoardPosition * 0.5);
        guitarStringsMap.set('e', 3 + this.guitarFretBoardPosition * 0.5);
        this.highlightStringInstrumentNotes(guitarStringsMap, "textOpenString", this.guitarGroupNotesLayerSVG)
    }

    resetGuitarNotes() {
        this.resetStringInstrumentNotes(['E', 'A', 'D', 'G', 'B', 'e'], "textOpenString", this.guitarGroupNotesLayerSVG)
    }

    highlightBassNotes() {
        let bassStringsMap = new Map();
        bassStringsMap.set('E', 3 + this.guitarFretBoardPosition * 0.5);
        bassStringsMap.set('A', 5.5 + this.guitarFretBoardPosition * 0.5);
        bassStringsMap.set('D', 2 + this.guitarFretBoardPosition * 0.5);
        bassStringsMap.set('G', 4.5 + this.guitarFretBoardPosition * 0.5);
        this.highlightStringInstrumentNotes(bassStringsMap, "bassTextOpenString", this.bassGroupNotesLayerSVG)
    }

    resetBassNotes() {
        this.resetStringInstrumentNotes(['E', 'A', 'D', 'G'], "bassTextOpenString", this.bassGroupNotesLayerSVG)
    }

    createGuitarNoteForm(aPositionArray, aScaleDegree, aNote, aSvgContainer) {
        let noteForm;
        let xOffset = aPositionArray[0] * 20;
        let yOffset = aPositionArray[1] * 10;
        let svgNs = "http://www.w3.org/2000/svg";
        switch (aScaleDegree) {
            case 1:
                noteForm = document.createElementNS(svgNs, "circle");
                noteForm.setAttributeNS(null, "cx", 22.5 + xOffset);
                noteForm.setAttributeNS(null, "cy", 4.5 + yOffset);
                noteForm.setAttributeNS(null, "r", 4.5);
                noteForm.setAttributeNS(null, "stroke", "none");
                break;
            case 2:
                noteForm = document.createElementNS(svgNs, "ellipse");
                noteForm.setAttributeNS(null, "cx", 22.5 + xOffset);
                noteForm.setAttributeNS(null, "cy", 5 + yOffset);
                noteForm.setAttributeNS(null, "rx", 4.5);
                noteForm.setAttributeNS(null, "ry", 2.25)
                noteForm.setAttributeNS(null, "stroke", "none");
                break;
            case 3:
                noteForm = document.createElementNS(svgNs, "path");
                noteForm.setAttributeNS(null, "d", "m 13.5,1 4,7 -8,-2e-7 z");
                noteForm.setAttributeNS(null, "transform", "matrix(1,0,0,1," + (9 + xOffset) + "," + (-1 + yOffset) + ")");
                noteForm.setAttributeNS(null, "opacity", 1);
                break;
            case 4:
                noteForm = document.createElementNS(svgNs, "rect");
                noteForm.setAttributeNS(null, "width", 9);
                noteForm.setAttributeNS(null, "height", 9);
                noteForm.setAttributeNS(null, "x", 18 + xOffset);
                noteForm.setAttributeNS(null, "y", 1 + yOffset);
                break;
            case 5:
                let transform = "matrix(1,0,0,1," + (8 + xOffset) + "," + (-1 + yOffset) + ")";
                noteForm = document.createElementNS(svgNs, "path");
                noteForm.setAttributeNS(null, "d", "M 11,-9e-6 15,3 14,8 8,8 7,3 Z");
                noteForm.setAttributeNS(null, "transform", "matrix(1,0,0,1," + (12 + xOffset) + "," + (1 + yOffset) + ")");
                noteForm.setAttributeNS(null, "opacity", 1);
                break;
            case 6:
                noteForm = document.createElementNS(svgNs, "path");
                noteForm.setAttributeNS(null, "d", "M 41.5,9.5 36,6 36,-9e-6 41.5,-3.25 l 5.5,3 0,6.4 z");
                noteForm.setAttributeNS(null, "transform", "matrix(0.8,0,0,0.7," + (-11 + xOffset) + "," + (3.3 + yOffset) + ")");
                noteForm.setAttributeNS(null, "opacity", 1);
                break;
            case 7:
                noteForm = document.createElementNS(svgNs, "path");
                noteForm.setAttributeNS(null, "d", "m 63, 5 -5 ,2.5 -5,-2.3 -1.4,-5.4 3.4,-4.5 5.6,-0.1 3.6,4.3 z");
                noteForm.setAttributeNS(null, "transform", "matrix(0.7,0,0,0.7," + (-18 + xOffset) + "," + (4 + yOffset) + ")");
                noteForm.setAttributeNS(null, "opacity", 1);
                break;
        }
        noteForm.style.fill = this.noteColorMap.get(aNote.noteString);
        aSvgContainer.appendChild(noteForm);

    }

    switchSVG() {
        if (this.showsKeyboard) {
            this.showsKeyboard = false;
            this.showsGuitar = true;
            this.showGuitarSVG();
            this.highestFretNumber = document.getElementById('highestFretNumber');
            this.lowestFretNumber = document.getElementById('lowestFretNumber');

        }
        else if (Array.from(this.svgContainerDiv.children).includes(this.guitarSVG)) {
            this.showsGuitar = false;
            this.showsBass = true;
            this.showBassSVG();
            this.highestFretNumber = document.getElementById('bassHighestFretNumber');
            this.lowestFretNumber = document.getElementById('bassLowestFretNumber');
        }
        else {
            this.showsBass = false;
            this.showsKeyboard = true;
            this.showKeyboardSVG();
        }
    }
    showGuitarSVG() {
        this.svgContainerDiv.removeChild(this.keyboardSVG);
        this.svgContainerDiv.appendChild(this.guitarSVG);
    }
    showKeyboardSVG() {
        this.svgContainerDiv.removeChild(this.bassSVG);
        this.svgContainerDiv.appendChild(this.keyboardSVG);
    }
    showBassSVG() {
        this.svgContainerDiv.removeChild(this.guitarSVG);
        this.svgContainerDiv.appendChild(this.bassSVG);
    }

    initializeNoteColorMap() {
        this.noteColorMap.set('C', '#F26B8F');
        this.noteColorMap.set('C#', '#F1A7F2');
        this.noteColorMap.set('Db', '#F1A7F2');
        this.noteColorMap.set('D', '#A2F2E4');
        this.noteColorMap.set('D#', '#F2B705');
        this.noteColorMap.set('Eb', '#F2B705');
        this.noteColorMap.set('E', '#F28705');
        this.noteColorMap.set('E#', '#B967FF');
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
        this.noteColorMap.set('B#', '#F26B8F');
        this.noteColorMap.set('Cb', '#962B09');

    }
}

new ScaleView();
