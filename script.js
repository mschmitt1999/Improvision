/**
 * Represents a musical note including harmonic and chord-related information.
 *
 * This class encapsulates both the symbolic representation of a note
 * (e.g. "C", "F#", "Bb") and its numeric representation, as well as its
 * functional role within a musical scale. Additionally, it can store
 * chord-related data such as chord tones, chord type, and a harmonic
 * description or analysis.
 *
 * @class Note
 * @property {string[]} chordNotes - Array of notes forming the chord.
 * @property {string} chordType - Type of chord (major, minor, diminished).
 * @property {string} harmonicString - Enharmonically corrected note name.
 * @property {string} noteString - Original note name (e.g., 'C', 'F#', 'Bb').
 * @property {number} noteDouble - Numeric representation of the note.
 * @property {number} scaleDegree - Scale degree (1-7) within the scale.
 */
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
/**
 * Represents a musical scale with notes, steps, and harmonic information.
 * @class Scale
 * @property {Map<number, string>} allNotesMap - Maps numeric values to note names.
 * @property {Map<string, number>} allNotesMapSwapped - Maps note names to numeric values.
 * @property {Map<string, string[]>} allScalesMap - Maps scale names to step patterns.
 * @property {number} rootNoteKeyDouble - Numeric value of the root note.
 * @property {string} scaleNameString - Name of the current scale.
 * @property {Note[]} scaleNotes - Array of Note objects in the scale.
 * @property {number[]} scaleStepsArray - Step pattern for the current scale.
 */
class Scale {
    allNotesMap;
    allNotesMapSwapped;
    allScalesMap;
    rootNoteKeyDouble;
    scaleNameString;
    scaleNotes = [];
    scaleStepsArray;

    constructor(scaleString, rootNoteKeyDouble) {
        this.initializeScaleMaps();
        this.setScale(scaleString);
        this.rootNoteKeyDouble = rootNoteKeyDouble;
    }

    /**
     * Initialize maps containing all notes and scale patterns.
     * @returns {void}
     */
    initializeScaleMaps(){
        //TODO It only stores data, there for it should be seperated.
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
    }

    /**
     * Get an array with the notes ordered starting from C.
     * @returns {string[]} Array of note names in order.
     */
    getNotesOrderArray(){
        return ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    }

    /**
     * Get note string from numeric note value.
     * @param {number} aNoteKeyDouble - Numeric note value.
     * @returns {string|undefined} Note name (e.g., 'C', 'F#', 'Bb').
     */
    getNoteStringFromNoteDouble(aNoteKeyDouble){
        return this.allNotesMap.get(aNoteKeyDouble)
    }

    /**
     * Calculate scale notes based on the scale type and root note.
     * @returns {void}
     */
    calculateScale() {
        //
        let noteKeyDouble = this.rootNoteKeyDouble;
        this.scaleNotes = [];
        let scaleDegree = 0
        
        this.scaleStepsArray.forEach(steps => {
            scaleDegree ++
            let aNoteString = this.getNoteStringFromNoteDouble(noteKeyDouble)
            let aNote = new Note(aNoteString, noteKeyDouble, scaleDegree);
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
        
        this.resolveEnharmonicConfusion()
        if (this.scaleNameString.includes('Pentatonic')) {
            this.createPentatonicScaleFromScale();
        }
        this.setChordsOfScale();
    }

    /**
     * Get scale notes as an array of harmonic strings.
     * @returns {string[]} Array of note names in the scale.
     */
    getScaleString(){
        this.calculateScale()
        let aScaleNoteString = []
        this.scaleNotes.forEach(note => {
            aScaleNoteString.push(note.harmonicString)
        });
        return aScaleNoteString
    }

    /**
     * Set and calculate a random scale.
     * @returns {string[]} Array of scale note names.
     */
    setAndCalculateRandomScale() {
        let scaleKeyArray = Array.from(this.allScalesMap.keys());
        let noteKeyArray = Array.from(this.allNotesMap.keys());
        this.setScale(scaleKeyArray.at(Math.floor(Math.random() * scaleKeyArray.length)));
        this.rootNoteKeyDouble = noteKeyArray.at(Math.floor(Math.random() * noteKeyArray.length));
        return this.getScaleString();
    }

    /**
     * Remove notes from the scale to create pentatonic version.
     * @returns {void}
     */
    createPentatonicScaleFromScale(){
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

    /**
     * Resolve enharmonic confusion by adjusting note names to proper scale degrees.
     * @returns {void}
     */
    resolveEnharmonicConfusion(){
        let difference;
        let notesOrderArray = this.getNotesOrderArray()
        let firstNote =this.scaleNotes[0].noteString
        let startingIndex = (firstNote.length == 1) ? notesOrderArray.indexOf(firstNote) : notesOrderArray.indexOf(firstNote[0]);

        for (let i = 0; i < this.scaleNotes.length; i++) {
                let note = this.scaleNotes[i].noteString;
                let noteDouble = this.scaleNotes[i].noteDouble;
                let noteSuffix = '';
                let index = (startingIndex + i) % notesOrderArray.length;
                let noteInNotesOrderArrayAtIndex = notesOrderArray[index][0]
                if (note[0] != notesOrderArray[index]) {
                    if(noteInNotesOrderArrayAtIndex == 'C' && this.allNotesMapSwapped.get(note[0]) > 2){
                        difference = noteDouble - 7
                    }
                    else{
                        if (note[0] == 'C' && noteInNotesOrderArrayAtIndex == 'B') {
                            noteDouble = 7;
                        }
                        else if (note[0] == 'B' && noteInNotesOrderArrayAtIndex == 'C') {
                            noteDouble = 0.5;
                        }
                        difference = noteDouble - this.allNotesMapSwapped.get(notesOrderArray[index]);
                    }
              
                    note = notesOrderArray[index];
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
                this.scaleNotes[i].harmonicString = note + noteSuffix;
        }
        if (this.rootNoteKeyDouble >= 10) {
            let tempRootNoteKeyDouble = this.rootNoteKeyDouble / 10;
            this.scaleNotes[0] = new Note(this.getNoteStringFromNoteDouble(tempRootNoteKeyDouble), tempRootNoteKeyDouble, 1);
            this.scaleNotes[0].harmonicString = this.getNoteStringFromNoteDouble(this.rootNoteKeyDouble)
        }
    }

    /**
     * Determine chord types (major/minor) for each scale degree.
     * @returns {void}
     */
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

    /**
     * Set the scale by name and initialize its step pattern.
     * @param {string} aScaleNameString - Name of the scale (e.g., 'Major', 'Minor').
     * @returns {void}
     */
    setScale(aScaleNameString) {
        this.scaleNameString = aScaleNameString;
        this.scaleStepsArray = this.allScalesMap.get(aScaleNameString);
    }
}


/**
 * Manages UI and visualization of musical scales on keyboard, guitar, and bass.
 * @class ScaleView
 * @property {HTMLButtonElement} switchSVGButton - Button to switch instruments.
 * @property {HTMLButtonElement} showOrHideScaleButton - Button to toggle scale display.
 * @property {HTMLSelectElement} scalesSelectbox - Dropdown for scale selection.
 * @property {HTMLSelectElement} notesSelectbox - Dropdown for root note selection.
 * @property {HTMLDivElement} scaleTextView - Container for scale text display.
 * @property {SVGElement} keyboardSVG - SVG element for keyboard visualization.
 * @property {SVGElement} guitarSVG - SVG element for guitar visualization.
 * @property {SVGElement} bassSVG - SVG element for bass visualization.
 * @property {HTMLDivElement} svgContainerDiv - Container for SVG elements.
 * @property {Scale} scale - Current scale object.
 * @property {Map<string, string>} noteColorMap - Maps note names to hex colors.
 * @property {boolean} showScaleBoolean - Whether scale is currently visible.
 * @property {boolean} showsGuitar - Whether guitar is displayed.
 * @property {boolean} showsBass - Whether bass is displayed.
 * @property {boolean} showsKeyboard - Whether keyboard is displayed.
 * @property {number} guitarFretBoardPosition - Current guitar fret board position.
 * @property {number} bassFretBoardPosition - Current bass fret board position.
 * @property {SVGGElement} guitarGroupNotesLayerSVG - SVG group for guitar notes.
 * @property {SVGGElement} bassGroupNotesLayerSVG - SVG group for bass notes.
*/
class ScaleView {

    /**
     * Initialize ScaleView with UI elements and event listeners.
     * @returns {void}
     */
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
        this.scale = new Scale('Major', 1);
        this.noteColorMap = new Map();
        this.showScaleBoolean = false;
        this.showsGuitar = false;
        this.showsBass = false;
        this.showsKeyboard = true;

        this.setEventListeners()
        this.showKeyboardSVG();
        this.initializeNoteColorMap();
        this.initializeGuitarSvg();
        this.initializeBassSvg();       
        
        // Dialog setup
        const dialog = document.getElementById("informationDialog");
        const showButton = document.getElementById("showInformationDialogButton");
        const closeButton = document.getElementById("closeIsnformationDialogButton");
        showButton.addEventListener("click", () => {
        dialog.showModal();
        });
        closeButton.addEventListener("click", () => {
        dialog.close();
        });
    }

    /**
     * Initialize guitar SVG layer for note visualization.
     * @returns {void}
     */
    initializeGuitarSvg(){
        this.guitarFretBoardPosition = 0;
        this.guitarGroupNotesLayerSVG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.guitarSVG.appendChild(this.guitarGroupNotesLayerSVG);
        this.svgContainerDiv.removeChild(this.guitarSVG);
    }

    /**
     * Initialize bass SVG layer for note visualization.
     * @returns {void}
     */
    initializeBassSvg(){
        this.bassFretBoardPosition = 0;
        this.bassGroupNotesLayerSVG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.bassSVG.appendChild(this.bassGroupNotesLayerSVG);
    }

    /**
     * Attach event listeners to UI controls.
     * @returns {void}
     */
    setEventListeners(){
        document.getElementById("fretsHigher").addEventListener('click', () => this.setFretsHigher());
        document.getElementById("fretsLower").addEventListener('click', () => this.setFretsLower());
        document.getElementById("bassFretsHigher").addEventListener('click', () => this.setFretsHigher());
        document.getElementById("bassFretsLower").addEventListener('click', () => this.setFretsLower());
        this.randomScaleButton = document.getElementById('randomScale');
        this.randomScaleButton.addEventListener('click', () => this.randomScaleButtonClick());
        this.switchSVGButton.addEventListener('click', () => this.switchSVGButtonClick());
        this.showOrHideScaleButton.addEventListener('click', () => this.showOrHideScaleButtonClick());
        this.scalesSelectbox.onchange = () => this.scalesSelectboxOnchange();
        this.notesSelectbox.onchange = () => this.notesSelectboxOnchange();
    }

    /**
     * Handle scale selection change from dropdown.
     * @returns {void}
     */
    scalesSelectboxOnchange() {
        this.scale.setScale(this.scalesSelectbox.value);
        if (this.showScaleBoolean) {
            this.showScale();
        }
    }

    /**
     * Handle root note selection change from dropdown.
     * @returns {void}
     */
    notesSelectboxOnchange() {
        this.scale.rootNoteKeyDouble = parseFloat(this.notesSelectbox.value);
        if (this.showScaleBoolean) {
            this.showScale();
        }
    }

    /**
     * Toggle scale visibility.
     * @returns {void}
     */
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

    /**
     * Handle random scale generation.
     * @returns {void}
     */
    randomScaleButtonClick() {
        let scaleString = this.scale.setAndCalculateRandomScale();
        if (this.showScaleBoolean) {
            this.showScale();
            this.highlightNotes();
        }
        this.scalesSelectbox.value = this.scale.scaleNameString;
        this.notesSelectbox.value = this.scale.rootNoteKeyDouble;
    }

    /**
     * Handle switching between keyboard, guitar, and bass visualizations.
     * @returns {void}
     */
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

    /**
     * Display scale notes with colors and interactive elements.
     * @returns {void}
     */
    showScale() {
        this.showScaleBoolean = true;
        let i = 0;
        this.scaleTextView.innerText = '';
        let scaleStringArray = this.scale.getScaleString();
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

    /**
     * Display chord for the selected scale note.
     * @param {Note} scaleNote - The scale note to highlight chord for.
     * @returns {void}
     */
    highlightChord(scaleNote){
        console.log(scaleNote)
    }

    /**
     * Hide scale visualization and reset all note highlights.
     * @returns {void}
     */
    hideScale() {
        this.showScaleBoolean = false;
        this.scaleTextView.innerText = '';
        let firstElementChild = this.svgContainerDiv.firstElementChild;
        if (firstElementChild == this.keyboardSVG) {
            this.resetKeyboardNotes();
        }
        else if (firstElementChild == this.guitarSVG) {
            this.resetGuitarNotes();
        }
        else {
            this.resetBassNotes()
        }
        document.getElementById('showScaleLabel').innerText = 'Show Scale';
    }


    /**
     * Highlight scale notes on the active instrument visualization.
     * @returns {void}
     */
    highlightNotes() {
        let firstElementChild = this.svgContainerDiv.firstElementChild
        if ( firstElementChild == this.keyboardSVG) {
            this.highlightKeyboardNotes();
        }
        else if (firstElementChild == this.guitarSVG) {
            this.highlightGuitarNotes();
        }
        else {
            this.highlightBassNotes();
        }
    }

    /**
     * Highlight scale notes on the keyboard visualization.
     * @returns {void}
     */
    highlightKeyboardNotes() {
        this.resetKeyboardNotes();
        let rootNoteKeyDouble = this.scale.scaleNotes[0].noteDouble;
        this.scale.scaleNotes.forEach(eachNote => {
            if (rootNoteKeyDouble <= eachNote.noteDouble) {
                document.getElementById(eachNote.noteString.concat("1")).style.fill = this.noteColorMap.get(eachNote.noteString);
            }
            else {
                document.getElementById(eachNote.noteString.concat("2")).style.fill = this.noteColorMap.get(eachNote.noteString);
            }
        });
    }

    /**
     * Reset keyboard note colors to default.
     * @returns {void}
     */
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

    /**
     * Reset fret board position to the beginning.
     * @returns {void}
     */
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

    /**
     * Move fret board view higher (increasing fret numbers).
     * @returns {void}
     */
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

    /**
     * Move fret board view lower (decreasing fret numbers).
     * @returns {void|boolean} False if already at lowest position.
     */
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

    /**
     * Highlight scale notes on string instrument (guitar/bass).
     * @param {Map<string, number>} aStringInstrumentMap - Map of strings to their tunings.
     * @param {string} idPrefixString - ID prefix for SVG elements.
     * @param {SVGGElement} aSvgContainer - SVG container for note shapes.
     * @returns {void}
     */
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

    /**
     * Reset string instrument note colors and clear note shapes.
     * @param {string[]} aStringNotesArray - Array of open string notes.
     * @param {string} idPrefixString - ID prefix for SVG elements.
     * @param {SVGGElement} aSvgContainer - SVG container to clear.
     * @returns {void}
     */
    resetStringInstrumentNotes(aStringNotesArray, idPrefixString, aSvgContainer) {
        for (let i = 0; i < aStringNotesArray.length; i++) {
            document.getElementById(idPrefixString.concat(aStringNotesArray[i])).style.fill = "#dcdcdc";
        }
        aSvgContainer.replaceChildren();
    }
    /**
     * Highlight scale notes on guitar fret board.
     * @returns {void}
     */
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

    /**
     * Reset guitar note colors and clear note shapes.
     * @returns {void}
     */
    resetGuitarNotes() {
        this.resetStringInstrumentNotes(['E', 'A', 'D', 'G', 'B', 'e'], "textOpenString", this.guitarGroupNotesLayerSVG)
    }

    /**
     * Highlight scale notes on bass fret board.
     * @returns {void}
     */
    highlightBassNotes() {
        let bassStringsMap = new Map();
        bassStringsMap.set('E', 3 + this.guitarFretBoardPosition * 0.5);
        bassStringsMap.set('A', 5.5 + this.guitarFretBoardPosition * 0.5);
        bassStringsMap.set('D', 2 + this.guitarFretBoardPosition * 0.5);
        bassStringsMap.set('G', 4.5 + this.guitarFretBoardPosition * 0.5);
        this.highlightStringInstrumentNotes(bassStringsMap, "bassTextOpenString", this.bassGroupNotesLayerSVG)
    }

    /**
     * Reset bass note colors and clear note shapes.
     * @returns {void}
     */
    resetBassNotes() {
        this.resetStringInstrumentNotes(['E', 'A', 'D', 'G'], "bassTextOpenString", this.bassGroupNotesLayerSVG)
    }

    /**
     * Create SVG shape for a note on guitar/bass based on scale degree.
     * @param {number[]} aPositionArray - [fret, string] position.
     * @param {number} aScaleDegree - Scale degree (1-7).
     * @param {Note} aNote - Note to display.
     * @param {SVGGElement} aSvgContainer - Container to append shape to.
     * @returns {void}
     */
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

    /**
     * Switch between keyboard, guitar, and bass visualizations.
     * @returns {void}
     */
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
    /**
     * Display guitar SVG in container.
     * @returns {void}
     */
    showGuitarSVG() {
        this.svgContainerDiv.removeChild(this.keyboardSVG);
        this.svgContainerDiv.appendChild(this.guitarSVG);
    }
    /**
     * Display keyboard SVG in container.
     * @returns {void}
     */
    showKeyboardSVG() {
        this.svgContainerDiv.removeChild(this.bassSVG);
        this.svgContainerDiv.appendChild(this.keyboardSVG);
    }
    /**
     * Display bass SVG in container.
     * @returns {void}
     */
    showBassSVG() {
        this.svgContainerDiv.removeChild(this.guitarSVG);
        this.svgContainerDiv.appendChild(this.bassSVG);
    }

    /**
     * Initialize map of note names to hex color values.
     * @returns {void}
     */
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
